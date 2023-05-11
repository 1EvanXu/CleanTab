

export class SettingsModel {
    cleanMode: "auto" | "manual" = "auto"
    disableGlobal: boolean = false
    disableNotification: boolean = false
    disabledDomainList: Array<string> = []

    constructor(data: any) {
        if (data.cleanMode == "auto" || data.cleanMode == "manual") {
            this.cleanMode = data.cleanMode
        }
        if (data.disableGlobal != undefined) {
            this.disableGlobal = data.disableGlobal
        }
        if (data.disableNotification != undefined) {
            this.disableNotification = data.disableNotification
        }
        if (data.disabledDomainList != undefined) {
            this.disabledDomainList = data.disabledDomainList
        }
    }
}

class CTRequest {
    action: string
    payload?: object

    constructor(action: string, payload?: object) {
        this.action = action,
        this.payload = payload
    }

    toMessage(): { action: string, payload?: object } {
        return {
            action: this.action,
            payload: this.payload
        }
    }
}


export namespace CleanTabService {

    async function send(request: CTRequest) {
        try {
            const response = await chrome.runtime.sendMessage(request.toMessage())
            return response
        } catch (e) {
            return { error: " Not in chrome environment." }
        }
    }

    export function getDuplicatedTabs() {
        return send(new CTRequest("getDuplicatedTabs"))
    }

    export async function getSettingsInfo(): Promise<SettingsModel> {
        const response = await send(new CTRequest("getSettingsInfo"))
        return new SettingsModel(response)
    }

    export function updateSettings(payload: { [key: string]: string | boolean }) {
        send(new CTRequest("updateSettings", payload))
    }

    export async function getCurrentDoaminDisabled() {
        const response = await send(new CTRequest("getCurrentDoaminDisabled"))
        const retData = { currentDomain: undefined, disabled: false }
        retData.currentDomain = response.domain
        retData.disabled = response.disabled
        return retData
    }

    export function performCleanTask(taskIdList: number[]) {
        send(new CTRequest("performCleanTask", { taskIdList }))
    }
}


type Port = chrome.runtime.Port


interface CTSessionMessage {
    action: string
    requestId: number
    payload?: any
}

class CTSessionRequest {
    requestId: number
    action: string
    payload?: object

    constructor(action: string, requestId: number, payload?: object) {
        this.action = action,
        this.payload = payload
        this.requestId = requestId
    }

    toMessage(): CTSessionMessage {
        return {
            action: this.action,
            payload: this.payload,
            requestId: this.requestId
        }
    }
}


type CTSessionRequestCallback = (msg: any) => void


export namespace CleanTabServiceSession {

    const SERVICE_NAME = "CleanTabService"

    let isConnected = false

    let localPort: Port | undefined

    const callbackMap = new Map<number, CTSessionRequestCallback>()

    let pendingRequestQueue = new Array<CTSessionRequest>()

    let requestCount = 0

    function getRequestId() {
        requestCount += 1
        return requestCount
    }

    export function connect() {
        if (isConnected) {
            return
        }
        try {
            localPort = chrome.runtime.connect({ name: SERVICE_NAME })
            const ackReq = new CTSessionRequest("ACK", 0)
            localPort.postMessage(ackReq.toMessage())
    
            localPort.onMessage.addListener((msg, port) => {
                if (port.name == SERVICE_NAME) {
                    if (msg.action == "ACK" && msg.requestId == 0) {
                        isConnected = true
                        
                        while(pendingRequestQueue.length != 0) {
                            const pendingReq = pendingRequestQueue.pop()
                            if (pendingReq) {
                                send(pendingReq)
                            }
                        }
                        return
                    }
    
                    const callback = callbackMap.get(msg.requestId)
                    if (callback) {
                        callback(msg.payload)
                        callbackMap.delete(msg.requestId)
                    }
                }
            })
    
            localPort.onDisconnect.addListener(_ => {
                resetState()
            })
        } catch(e) {
            console.warn('Not in chrome environment.')
        }
    }

    export function disconnect() {
        if (isConnected && localPort) {
            localPort.disconnect()
            resetState()
        }
    }

    function resetState() {
        isConnected = false
        localPort = undefined
        callbackMap.clear()
        pendingRequestQueue = new Array<CTSessionRequest>()
    }

    function send(request: CTSessionRequest, callback?: CTSessionRequestCallback) {
        if (!localPort || !isConnected) {
            pendingRequestQueue.push(request)
            if (callback) {
                callbackMap.set(request.requestId, callback)
            }
            return
        }
        localPort.postMessage(request.toMessage())
        if (callback) {
            callbackMap.set(request.requestId, callback)
        }
    }

    export function getDuplicatedTabs(callback?: CTSessionRequestCallback) {
        send(new CTSessionRequest("getDuplicatedTabs", getRequestId()), callback)
    }

    export async function getCurrentDoaminDisabled(callback?: CTSessionRequestCallback) {
        send(new CTSessionRequest("getCurrentDoaminDisabled", getRequestId()), callback)
    }

}
