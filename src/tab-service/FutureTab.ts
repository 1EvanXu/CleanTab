import { TabCleanTask } from "../common/TabCleanTask"
import { StringUtils } from "../common/utils"

type TabUrlObserver = (tabId: number, url: string) => void

export class FutureTab extends TabCleanTask {

    private observer?: TabUrlObserver

    constructor(tabId: number, _observer: TabUrlObserver) {
        super()
        this.tabId = tabId
        this.observer = _observer
    }

    setUrl(url?: string) {
        
        if (!this.url) {
            if (url && StringUtils.isNotEmpty(url)) {
                this.url = url
                if (this.observer) {
                    this.observer(this.tabId, url)
                }
            }
        }
    }

    setTitle(title?: string) {
        if(StringUtils.isNotEmpty(title)) {
            this.title = title
        }
    }

    setFavicon(favicon?: string) {
        if(StringUtils.isNotEmpty(favicon)) {
            this.favicon = favicon
        }
    }
}

export namespace FutureTabManager {
    const futureTabs: FutureTab[] = []

    export function add(ft: FutureTab) {
        if(get(ft.tabId)) {
            return
        }
        futureTabs.push(ft)
    }

    export function get(tabId: number): FutureTab|void {
        return futureTabs.find(
            value => value.tabId == tabId && !value.cleaned
        )
    }

    export function remove(tabId: number) {
        const futureTab = get(tabId)
        if (futureTab) {
            futureTab.cleaned = true
        }
    }

    export function getAllCleaned(): FutureTab[] {
        return futureTabs.filter(t => t.cleaned);
    }
}