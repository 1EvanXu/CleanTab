import { FutureTabManager } from "../tab-service/FutureTab"
import { TabInfoProxy, TabOperationProxy } from "../tab-service/TabsProxy"
import { UrlUtils, CTLog } from "../common/utils"
import { SettingsManager } from "../storage/SettingsManager"
import { TabCleanTask } from "../common/TabCleanTask"

class DuplicatedTabRecord extends TabCleanTask {
    tabIds: Array<number>
    reserved: number | undefined

    constructor(url: string) {
        super()
        this.url = url
        this.tabIds = new Array<number>()
        this.tabId = -1
    }

    add(tabId: number) {
        const r = this.tabIds.indexOf(tabId)
        if(r < 0) {
            this.tabIds.push(tabId)
            if (!this.reserved) {
                this.reserved = tabId
            }
        } 
    }

    getDuplicatedTabIds(): number[] {
        return this.tabIds.filter(id => id != this.reserved)
    }

    count(): number {
        return this.tabIds.length
    }
}

export namespace DuplicatedTabHandler {

    let dupTabRecordList = new Array<DuplicatedTabRecord>()
    
    function shouldAutoClean(url: string) {
        const settings = SettingsManager.getSettings()
        if (settings.cleanMode != 'auto') {
            return false
        }
        if (settings.disableGlobal) {
            return false
        }
        const hostname = UrlUtils.getHostName(url)
        if (hostname && settings.disabledDomainList.indexOf(hostname) > -1) {
            return false
        } 
        return true
    }

    export async function observeFutureUrl(tabId: number, url: string) {
        if (!UrlUtils.isChromeUrl(url) && shouldAutoClean(url)){
            
            const tabs = await TabInfoProxy.getByUrl(url)

            const tabsAfterFilter = tabs?.filter(tab => tab.id != tabId)

            if(tabsAfterFilter && tabsAfterFilter.length > 0) {
                
                setTimeout(() => {
                    if (tabsAfterFilter[0].id) {
                        TabOperationProxy.remove(tabId)
                        TabOperationProxy.active(tabsAfterFilter[0].id)
                    }
                }, 1000)
            }
            FutureTabManager.remove(tabId)
        }
    }

    export async function getDuplicatedTabs(): Promise<DuplicatedTabRecord[]> {
        const tabs = await TabInfoProxy.getAll()
        tabs.forEach(
            tab => {
                if(!tab.url || !UrlUtils.isHttpUrl(tab.url)) {
                    return
                }

                let record = dupTabRecordList.find(
                    r => {
                        return tab.url == r.url && !r.cleaned
                    }
                )
                if (tab.id) {
                    if (record) {
                        if(!tab.discarded) {
                            record.reserved = tab.id
                        }
                    } else {
                        record = new DuplicatedTabRecord(tab.url)
                        record.title = tab.title
                        record.tabId = -1
                        record.favicon = tab.favIconUrl
                        dupTabRecordList.push(record)
                    }
                    record.add(tab.id)
                }
            }
        )
        dupTabRecordList = dupTabRecordList.filter(r => r.count() > 1)
        return dupTabRecordList;
    }

    export async function cleanDuplicatedTabs(taskIds: number[]) {
        const records = await getDuplicatedTabs()
        const toClean = records.filter(r => taskIds.indexOf(r.taskId) > -1 && !r.cleaned)
        toClean.forEach(
            item => {
                try {
                    TabOperationProxy.batchRemove(...item.getDuplicatedTabIds())
                    item.cleaned = true
                } catch (e) {
                    CTLog.warn(e)
                }
            }
        )
    }
}