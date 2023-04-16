
import {
     TabEventsDispatcher,
     TabEventsHandler,
} from "./tab-service/TabEvent";
import { TabInfoProxy, TabOperationProxy } from "./tab-service/TabsProxy";
import { CTLog, StringUtils, UrlUtils } from "./tab-service/utils";


const onInstalled = (details: chrome.runtime.InstalledDetails) => {
    CTLog.info("Installed success.")
}

// 插件初始化
chrome.runtime.onInstalled.addListener(details => onInstalled(details));


/**
 * Popup 弹出
 */
chrome.action.onClicked.addListener(
    () => {
        CTLog.info("Icon clicked.")
    }
  )

// 快捷键
chrome.commands.onCommand.addListener(
    (command, curTab) => {
        CTLog.info(`onCommand ${command}.`)
        if(command == "group-tabs") {
            
        } else if (command == "settings") {
           openSettingsPage()
        }
    }
)

const openSettingsPage = () => {
    const settingsUrl = chrome.runtime.getURL("settings/index.html")
    chrome.tabs.create({
        url: settingsUrl
    });
}



class TabInfoChangeHandler extends TabEventsHandler {
    
    handleUpdated(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): boolean {
        CTLog.info("handleUpdated", changeInfo)
        const ft = ftm.get(tabId)
        if(ft && changeInfo.url && StringUtils.isNotEmpty(changeInfo.url)) {
            ft.setUrl(changeInfo.url)
        }
        return true;
    }
    handleCreated(tab: chrome.tabs.Tab): boolean {
        CTLog.info("handleCreated", tab)
        if(tab.id) {
            ftm.add(
                new FutureTab(tab.id, DuplicatedTabHandler.observeFutureUrl)
            )
        }
        return true
    }
}

const changeHandler = new TabInfoChangeHandler();

TabEventsDispatcher.init();

TabEventsDispatcher.register(changeHandler);

type TabUrlObserver = (tabId: number, url: string) => void

class FutureTab {
    
    tabId: number

    url?: string

    private observer?: TabUrlObserver

    constructor(tabId: number, _observer: TabUrlObserver) {
        this.tabId = tabId
        this.observer = _observer
    }

    setUrl(url: string) {
        if (!this.url) {
            this.url = url
            if (this.observer) {
                this.observer(this.tabId, url)
            }
        }
        
    }
}

class FutureTabManager {
    private futureTabs: FutureTab[] = []

    add(ft: FutureTab) {
        if(this.get(ft.tabId)) {
            return
        }
        this.futureTabs.push(ft)
    }

    get(tabId: number): FutureTab|void {
        return this.futureTabs.find(
            value => value.tabId === tabId
        )
    }

    remove(tabId: number) {
        
    }
}

const ftm = new FutureTabManager()

namespace DuplicatedTabHandler {
    export async function observeFutureUrl(tabId: number, url: string) {
        if (!UrlUtils.isChromeUrl(url)){
            CTLog.debug("observeFutureUrl", tabId, url)
            const tabs = await TabInfoProxy.getByUrl(url)
            CTLog.debug("observeFutureUrl", tabs)
            const tabsAfterFilter = tabs?.filter(value => value.id != tabId)
            CTLog.debug("observeFutureUrl-tabsAfterFilter", tabsAfterFilter)
            if(tabsAfterFilter && tabsAfterFilter.length > 0) {
                
                setTimeout(() => {
                    if (tabsAfterFilter[0].id) {
                        CTLog.debug("active", tabsAfterFilter[0])
                        TabOperationProxy.remove(tabId)
                        TabOperationProxy.active(tabsAfterFilter[0].id)
                    }
                }, 2000)
            }
            ftm.remove(tabId)
        }
    }

}