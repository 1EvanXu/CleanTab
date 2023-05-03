export type Tab = chrome.tabs.Tab

export type TabGroup = chrome.tabGroups.TabGroup

export type ColorEnum = chrome.tabGroups.ColorEnum

export type TabActiveInfo = chrome.tabs.TabActiveInfo

export type TabAttachInfo = chrome.tabs.TabAttachInfo

export type TabDetachInfo = chrome.tabs.TabDetachInfo

export type TabChangeInfo = chrome.tabs.TabChangeInfo

export type TabHighlightInfo = chrome.tabs.TabHighlightInfo

export type TabMoveInfo = chrome.tabs.TabMoveInfo

export type TabRemoveInfo = chrome.tabs.TabRemoveInfo

export type ZoomChangeInfo = chrome.tabs.ZoomChangeInfo

export type HighlightInfo = chrome.tabs.HighlightInfo

export type UpdateProperties = chrome.tabs.UpdateProperties

export type GroupOptions = chrome.tabs.GroupOptions


export class TabInfo implements Tab {
    status?: string | undefined
    index: number = -1
    openerTabId?: number | undefined
    title?: string | undefined
    url?: string | undefined
    pendingUrl?: string | undefined
    pinned: boolean = false
    highlighted: boolean = false
    windowId: number = -1
    active: boolean = false;
    favIconUrl?: string | undefined
    id?: number | undefined
    incognito: boolean = false;
    selected: boolean = false
    audible?: boolean | undefined
    discarded: boolean = false
    autoDiscardable: boolean = false
    mutedInfo?: chrome.tabs.MutedInfo | undefined
    width?: number | undefined
    height?: number | undefined
    sessionId?: string | undefined
    groupId: number = -1
    
}

export class TabGroupInfo implements TabGroup {
    collapsed: boolean = false
    color: ColorEnum = "blue" 
    id: number = -1
    title?: string | undefined
    windowId: number = -1
}


export enum TabStatus {
    unloaded = "unloaded",
    loading = "loading",
    completed = "completed"
}


export type Port = chrome.runtime.Port