import { Tab, TabActiveInfo, TabAttachInfo, TabChangeInfo, TabDetachInfo, TabHighlightInfo, TabMoveInfo, TabRemoveInfo, ZoomChangeInfo } from "../common/ChromeExtensionTypes";

export abstract class TabEventsHandler {
    handleCreated(tab: Tab): boolean {
        return true;
    }
    handleActivated(activeInfo: TabActiveInfo): boolean {
        return true;
    }
    handleAttatched(tabId: number, attachInfo: TabAttachInfo): boolean {
        return true;
    }
    handleDetatched(tabId: number, detachInfo: TabDetachInfo): boolean {
        return true;
    }
    handleHighlighted(highlightInfo: TabHighlightInfo): boolean {
        return true;
    }
    handleMoved(tabId: number, moveInfo: TabMoveInfo): boolean {
        return true;
    }
    handleRemoved(tabId: number, removeInfo: TabRemoveInfo): boolean {
        return true;
    }
    handleReplaced(addedTabId: number, removedTabId: number): boolean {
        return true;
    }
    handleUpdated(tabId: number, changeInfo: TabChangeInfo, tab: Tab): boolean {
        return true;
    }
    handleZoomChange(zoomChangeInfo: ZoomChangeInfo): boolean {
        return true;
    }
}

export namespace TabEventsDispatcher {

    let isInited = false;

    let handlerChain: TabEventsHandler[] = new Array();
    
    export function init() {
        if (isInited) {
            return;
        }

        chrome.tabs.onCreated.addListener(
            (tab) => {
                onCreated(tab)
            }
        );
        chrome.tabs.onActivated.addListener(
            (activeInfo) => {
                onActivated(activeInfo)
            }
        );
        chrome.tabs.onAttached.addListener(
            (tabId, attachInfo) => {
                onAttatched(tabId, attachInfo)
            }
        );
        chrome.tabs.onDetached.addListener(
            (tabId, detachInfo) => {
                onDetatched(tabId, detachInfo)
            }
        );
        chrome.tabs.onMoved.addListener(
            (tabId, moveInfo) => {
                onMoved(tabId, moveInfo)
            }
        );
        chrome.tabs.onRemoved.addListener(
            (tabId, removeInfo) => {
                onRemoved(tabId, removeInfo)
            }
        );
        chrome.tabs.onUpdated.addListener(
            (tabId, changeInfo, tab) => {
                onUpdated(tabId, changeInfo, tab)
            }
        );
        chrome.tabs.onReplaced.addListener(
            (addedTabId, removedTabId) => {
                onReplaced(addedTabId, removedTabId)
            }
        );
        chrome.tabs.onHighlighted.addListener(
            (highlightInfo) => {
                onHighlighted(highlightInfo)
            }
        );
        chrome.tabs.onZoomChange.addListener(
            (zoomChangeInfo) => {
                onZoomChange(zoomChangeInfo)
            }
        );

        isInited = true;
    }

    export function register(handler: TabEventsHandler) {
        if (handler instanceof TabEventsHandler) {
            handlerChain.push(handler)
        }
    }

    export function unregister(handler: TabEventsHandler) {
        handlerChain = handlerChain.filter(
            value => value != handler
        )
    }

    function onCreated(tab: Tab) {
        for (const handler of handlerChain) {
            if(!handler.handleCreated(tab)) {
                break;
            }
        }
    }

    function onActivated(activeInfo: TabActiveInfo) {
        for (const handler of handlerChain) {
            if(!handler.handleActivated(activeInfo)) {
                break;
            }
        }
    }

    function onAttatched(tabId: number, attachInfo: TabAttachInfo) {
        for (const handler of handlerChain) {
            if(!handler.handleAttatched(tabId, attachInfo)) {
                break;
            }
        }
    }

    function onDetatched(tabId: number, detachInfo: TabDetachInfo) {
        for (const handler of handlerChain) {
            if(!handler.handleDetatched(tabId, detachInfo)) {
                break;
            }
        }
    }

    function onHighlighted(highlightInfo: TabHighlightInfo) {
        for (const handler of handlerChain) {
            if(!handler.handleHighlighted(highlightInfo)) {
                break;
            }
        }
    }

    function onMoved(tabId: number, moveInfo: TabMoveInfo) {
        for (const handler of handlerChain) {
            if(!handler.handleMoved(tabId, moveInfo)) {
                break;
            }
        }
    }
    
    function onRemoved(tabId: number, removeInfo: TabRemoveInfo) {
        for (const handler of handlerChain) {
            if(!handler.handleRemoved(tabId, removeInfo)) {
                break;
            }
        }
    }

    function onReplaced(addedTabId: number, removedTabId: number) {
        for (const handler of handlerChain) {
            if(!handler.handleReplaced(addedTabId, removedTabId)) {
                break;
            }
        }
    }

    function onUpdated(tabId: number, changeInfo: TabChangeInfo, tab: Tab) {
        for (const handler of handlerChain) {
            if(!handler.handleUpdated(tabId, changeInfo, tab)) {
                break;
            }
        }
    }

    function onZoomChange(zoomChangeInfo: ZoomChangeInfo) {
        for (const handler of handlerChain) {
            if(!handler.handleZoomChange(zoomChangeInfo)) {
                break;
            }
        }
    }
}

