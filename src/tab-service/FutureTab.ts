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
        
        if (!this.url && url && StringUtils.isNotEmpty(url)) {
            this.url = url
            if (this.observer && this.title && this.favicon) {
                this.observer(this.tabId, this.url)
            }
        }
    }

    setTitle(title?: string) {
        if (!this.title && title && StringUtils.isNotEmpty(title)) {
            this.title = title
            if (this.observer && this.url && this.favicon) {
                this.observer(this.tabId, this.url)
            }
        }
    }

    setFavicon(favicon?: string) {
        if (!this.favicon && favicon && StringUtils.isNotEmpty(favicon)) {
            this.favicon = favicon
            if (this.observer && this.url && this.title) {
                this.observer(this.tabId, this.url)
            }
        }
    }

    count(): number {
        return 2
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