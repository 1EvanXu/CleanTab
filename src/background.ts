
import { DuplicatedTabHandler } from "./clean-task/DuplicatedHandler";
import { SettingsManager } from "./storage/SettingsManager";
import { FutureTab, FutureTabManager } from "./tab-service/FutureTab";
import {
    TabEventsDispatcher,
    TabEventsHandler,
} from "./tab-service/TabEvent";
import { TabInfoProxy } from "./tab-service/TabsProxy";
import { CTLog, StringUtils, UrlUtils } from "./common/utils";
import { BGLogRemoteServer } from "./common/Log";


const onInstalled = (details: chrome.runtime.InstalledDetails) => {
    CTLog.info("Installed success.", details)
    BGLogRemoteServer.start()
}

// 插件初始化
chrome.runtime.onInstalled.addListener(details => onInstalled(details));


chrome.runtime.onMessage.addListener(
    (msg, sender, sendResponse) => {
        if (msg.action == "logToBackground") {
            CTLog.warn("Popup => ", msg.payload)
        } else {
            CTLog.debug("OnMessage", "msg=", msg, "sender=", sender, "sendResponse=", sendResponse)
            handleMessage(msg, sendResponse)
        }
    }
)

chrome.runtime.onConnect.addListener(
    port => {
        CTLog.debug("new connetion established => ", port)
        if (port.name == "CleanTabService") {
            port.onMessage.addListener((message, innerPort) => {
                CTLog.debug("connection received message => ", innerPort, message)
                if (message.action == "ACK") {
                    const retMsg = {}
                    Object.assign(retMsg, message)
                    innerPort.postMessage(retMsg)
                } else {
                    handleMessage(message, (res?: any) => {
                        const retMsg = {
                            action: message.action,
                            payload: res,
                            requestId: message.requestId
                        }
                        innerPort.postMessage(retMsg)
                    })
                }
            })
        }
        port.onDisconnect.addListener(port => {
            CTLog.warn("Connection destroyed => ", port)
        })
    }
)


const handleMessage = (message: any, sendResponse: (res?: any) => void) => {
    if (message.action == "getDuplicatedTabs") {
        DuplicatedTabHandler.getDuplicatedTabs().then(
            duplicatedTabs => {
                let cleanTasks;
                if (SettingsManager.getSettings().cleanMode == 'auto') {
                    cleanTasks = FutureTabManager.getAllCleaned().map(
                        record => record.newObject()
                    )
                } else {
                    cleanTasks = duplicatedTabs.map(
                        record => record.newObject()
                    )
                }
                
                sendResponse(cleanTasks)
            }
        )
    } else if (message.action == "getSettingsInfo") {
        const settingInfo = SettingsManager.getSettings()
        sendResponse(settingInfo)
    } else if (message.action == "updateSettings") {
        if (message.payload) {
            SettingsManager.updateSettings(message.payload)
        }
    } else if (message.action == 'getCurrentDoaminDisabled') {
        TabInfoProxy.getHighlighted().then(
            tab => {
                if (UrlUtils.isHttpUrl(tab.url)) {
                    const currentDomain = UrlUtils.getHostName(tab.url)
                    let disabled = false; 
                    if (currentDomain) {
                        disabled = SettingsManager.getSettings().disabledDomainList.indexOf(currentDomain) > -1
                    }
                    sendResponse({currentDomain, disabled})
                }
            }
        )
    } else if (message.action == 'performCleanTask' && message.payload) {
        if (message.payload.taskIdList) {
            DuplicatedTabHandler.cleanDuplicatedTabs(message.payload.taskIdList)
        }
    }
}


class TabInfoChangeHandler extends TabEventsHandler {

    handleUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, _tab: chrome.tabs.Tab): boolean {
        const futureTab = FutureTabManager.get(tabId)
        CTLog.debug("futureTab", futureTab)
        if (futureTab) {
            futureTab.setUrl(changeInfo.url)
            futureTab.setFavicon(changeInfo.favIconUrl)
            futureTab.setTitle(changeInfo.title)
        }
        return true;
    }
    
    handleCreated(tab: chrome.tabs.Tab): boolean {
        if (tab.id) {
            FutureTabManager.add(
                new FutureTab(tab.id, DuplicatedTabHandler.observeFutureUrl)
            )
        }
        return true
    }
}

const changeHandler = new TabInfoChangeHandler();

TabEventsDispatcher.init();

TabEventsDispatcher.register(changeHandler);

SettingsManager.init()
