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

            const tabsAfterFilter = tabs?.filter(value => value.id != tabId)

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
        const dupMap = new Map<string, DuplicatedTabRecord>()
        const recordList = new Array<DuplicatedTabRecord>()
        const tabs = await TabInfoProxy.getAll()
        
        tabs.forEach(
            tab => {
                if(!tab.url || !UrlUtils.isHttpUrl(tab.url)) {
                    return
                }

                if(!dupMap.has(tab.url)) {
                    const tabRecord = new DuplicatedTabRecord(tab.url)
                    tabRecord.title = tab.title
                    tabRecord.tabId = tab.id?? -1
                    tabRecord.favicon = tab.favIconUrl
                    dupMap.set(tab.url, tabRecord)
                }
                const record = dupMap.get(tab.url)
                if (record && tab.id) {
                    record.add(tab.id)
                    if(!tab.discarded) {
                        record.reserved = tab.id
                    }
                }
            }
        )

        dupMap.forEach(
            record => {
                if (record.count() > 1) {
                    recordList.push(record)
                }
            }
        )
        
        return recordList;
    }

    export async function cleanDuplicatedTabs(tasks: TabCleanTask[]) {
        const dupRecords = await getDuplicatedTabs()
        dupRecords.forEach(
            record => {
                try {
                    TabOperationProxy.batchRemove(...record.getDuplicatedTabIds())
                } catch (e) {
                    CTLog.error(e)
                }
            }
        )
    }

    const cleanTaskHistory: TabCleanTask[] = []

}