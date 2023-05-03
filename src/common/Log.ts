const MSG_ACTION = 'BGLog'

type LogLevel = 'debug'|'info'|'warn'|'error'

class RemoteLogPayload {
    tag?: string
    level: LogLevel = 'debug'
    content: any
}

class RemoteLogMessage {
    action: string = MSG_ACTION
    payload?: RemoteLogPayload
}

type PrinterFunc = (message?: any, ...optionalParams: any[]) => void

interface Logger {
    setTag: (tag: string) => void
    setLevel: (level: LogLevel) => void
    debug: (...msg: any) => void
    info: (...msg: any) => void
    warn: (...msg: any) => void
    error: (...msg: any) => void
}

export class BGLogger implements Logger {
    private TAG = "BGLog"

    private level: LogLevel = "debug"

    private logger: { [key: string]: PrinterFunc } = {
        debug: console.debug,
        info: console.info,
        warn: console.warn,
        error: console.error
    }

    setTag(tag: string) {
        this.TAG = tag
    }

    setLevel(value: 'debug'|'info'|'warn'|'error') {
        this.level = value
    }

    setPrinter(debug = console.debug, info = console.info, warn = console.warn, error = console.error) {
        this.logger.debug = debug
        this.logger.info = info
        this.logger.warn = warn
        this.logger.error = error
    }

    debug(...msg: any) {
        if (this.level == 'debug') {
            this.logger.debug(this.TAG, "[debug]", ...msg);
        }
    }

    info(...msg: any) {
        if (this.level == 'debug' || this.level == 'info') {
            this.logger.info(this.TAG, "[info]", ...msg);
        }
    }

    warn(...msg: any) {
        if (this.level == 'debug' || this.level == 'info' || this.level == 'warn') {
            this.logger.warn(this.TAG, "[warn]", ...msg)
        }
    }

    error(...msg: any) {
        this.logger.error(this.TAG, "[error]", ...msg)
    }    
}

export namespace BGLogRemoteServer {

    let bgLogger: BGLogger|undefined

    const msgListener = (message: any) => {
        if (!bgLogger) {
            return
        }

        if (message.action == MSG_ACTION && message.payload) {
            const {tag, level, content} = message.payload
            if (tag) {
                bgLogger.setTag(tag)
            }
            switch (level) {
                case 'debug': bgLogger.debug(content); break
                case 'info': bgLogger.info(content); break
                case 'warn': bgLogger.warn(content); break
                case 'error': bgLogger.error(content); break
                default: break
            }
        }
    }

    export function start() {
        bgLogger = new BGLogger()
        bgLogger.info("[BGLogRemoteServer] start runing 🚀🚀🚀🚀🚀🚀")
        if (chrome.runtime.onMessage.hasListener(msgListener)) {
            chrome.runtime.onMessage.removeListener(msgListener)
        }
        chrome.runtime.onMessage.addListener(msgListener)
    }

    export function stop() {
        chrome.runtime.onMessage.removeListener(msgListener)
        bgLogger = undefined
    }
}

export namespace BGLogRemoteClient {

    let isFistLog = true;

    export function debug(...msg: any) {
        send('debug', msg)
    }

    export function info(...msg: any) {
        send('info', msg)
    }

    export function warn(...msg: any) {
        send('warn', msg)
    }

    export function error(...msg: any) {
        send('error', msg)
    }

    function send(level: LogLevel ,content: any) {
        const message = new RemoteLogMessage()
        const payload = new RemoteLogPayload()
        if (isFistLog) {
            payload.tag = "BGLogRemoteClient"
            isFistLog = false
        }
        payload.content = content
        payload.level = level
        message.payload = payload
        chrome.runtime.sendMessage(message)
    }
}
