
import { GroupOptions, Tab } from "./TabTypes";
import { UrlUtils } from "./utils";

/**
 * Tab信息查询统一接口
 */
namespace TabInfoProxy {
    export function getAll(): Promise<Tab[]> {
        return chrome.tabs.query({});
    }

    export async function getHighlighted(): Promise<Tab> {
        const [highlightedTab] = await chrome.tabs.query({
            highlighted: true
        })
        return highlightedTab;
    }

    export async function getByUrl(url: string): Promise<Tab[]|undefined> {
        const allTabs = await getAll()
        return allTabs.filter(t => UrlUtils.compareUrl(t.url, url))
    }

    export function getByGroupId(groupId: number): Promise<Tab[]> {
        return chrome.tabs.query({
            "groupId": groupId
        })
    }
}

/**
 * Tab操作统一管理
 */
namespace TabOperationProxy {
    const tabs = chrome.tabs;

    export function active(tabId: number) {
        tabs.update(
            tabId,
            {
                active: true
            }
        )
    }

    export function move(tabId: number, position: number) {
        tabs.move(tabId, {index: position})
    }

    export function remove(tabId: number) {
        tabs.remove(tabId)
    }

    export function batchRemove(...tabIds: number[]) {
        tabIds.forEach(
            id => remove(id)
        )
    }

    export function group(options: GroupOptions): Promise<number> {
        return tabs.group(options)
    }

}

export {
    TabInfoProxy, TabOperationProxy
}