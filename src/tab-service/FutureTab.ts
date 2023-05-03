
type TabUrlObserver = (tabId: number, url: string) => void

export class FutureTab {
    
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
            value => value.tabId === tabId
        )
    }

    export function remove(tabId: number) {
        
    }
}