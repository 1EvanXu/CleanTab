(()=>{"use strict";var e={675:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{c(r.next(e))}catch(e){i(e)}}function s(e){try{c(r.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0});const o=n(407),i=n(188),a=n(28);chrome.runtime.onInstalled.addListener((e=>{a.CTLog.info("Installed success.")})),chrome.action.onClicked.addListener((()=>{a.CTLog.info("Icon clicked.")})),chrome.commands.onCommand.addListener(((e,t)=>{a.CTLog.info(`onCommand ${e}.`),"group-tabs"==e||"settings"==e&&s()}));const s=()=>{const e=chrome.runtime.getURL("settings/index.html");chrome.tabs.create({url:e})};class c extends o.TabEventsHandler{handleUpdated(e,t,n){a.CTLog.info("handleUpdated",t);const r=l.get(e);return r&&t.url&&a.StringUtils.isNotEmpty(t.url)&&r.setUrl(t.url),!0}handleCreated(e){return a.CTLog.info("handleCreated",e),e.id&&l.add(new d(e.id,f.observeFutureUrl)),!0}}const u=new c;o.TabEventsDispatcher.init(),o.TabEventsDispatcher.register(u);class d{constructor(e,t){this.tabId=e,this.observer=t}setUrl(e){this.url||(this.url=e,this.observer&&this.observer(this.tabId,e))}}const l=new class{constructor(){this.futureTabs=[]}add(e){this.get(e.tabId)||this.futureTabs.push(e)}get(e){return this.futureTabs.find((t=>t.tabId===e))}remove(e){}};var f;!function(e){e.observeFutureUrl=function(e,t){return r(this,void 0,void 0,(function*(){if(!a.UrlUtils.isChromeUrl(t)){a.CTLog.debug("observeFutureUrl",e,t);const n=yield i.TabInfoProxy.getByUrl(t);a.CTLog.debug("observeFutureUrl",n);const r=null==n?void 0:n.filter((t=>t.id!=e));a.CTLog.debug("observeFutureUrl-tabsAfterFilter",r),r&&r.length>0&&setTimeout((()=>{r[0].id&&(a.CTLog.debug("active",r[0]),i.TabOperationProxy.remove(e),i.TabOperationProxy.active(r[0].id))}),2e3),l.remove(e)}}))}}(f||(f={}))},407:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.TabEventsDispatcher=t.TabEventsHandler=void 0;class n{handleCreated(e){return!0}handleActivated(e){return!0}handleAttatched(e,t){return!0}handleDetatched(e,t){return!0}handleHighlighted(e){return!0}handleMoved(e,t){return!0}handleRemoved(e,t){return!0}handleReplaced(e,t){return!0}handleUpdated(e,t,n){return!0}handleZoomChange(e){return!0}}t.TabEventsHandler=n,function(e){let t=!1,r=new Array;e.init=function(){t||(chrome.tabs.onCreated.addListener((e=>{!function(e){for(const t of r)if(!t.handleCreated(e))break}(e)})),chrome.tabs.onActivated.addListener((e=>{!function(e){for(const t of r)if(!t.handleActivated(e))break}(e)})),chrome.tabs.onAttached.addListener(((e,t)=>{!function(e,t){for(const n of r)if(!n.handleAttatched(e,t))break}(e,t)})),chrome.tabs.onDetached.addListener(((e,t)=>{!function(e,t){for(const n of r)if(!n.handleDetatched(e,t))break}(e,t)})),chrome.tabs.onMoved.addListener(((e,t)=>{!function(e,t){for(const n of r)if(!n.handleMoved(e,t))break}(e,t)})),chrome.tabs.onRemoved.addListener(((e,t)=>{!function(e,t){for(const n of r)if(!n.handleRemoved(e,t))break}(e,t)})),chrome.tabs.onUpdated.addListener(((e,t,n)=>{!function(e,t,n){for(const o of r)if(!o.handleUpdated(e,t,n))break}(e,t,n)})),chrome.tabs.onReplaced.addListener(((e,t)=>{!function(e,t){for(const n of r)if(!n.handleReplaced(e,t))break}(e,t)})),chrome.tabs.onHighlighted.addListener((e=>{!function(e){for(const t of r)if(!t.handleHighlighted(e))break}(e)})),chrome.tabs.onZoomChange.addListener((e=>{!function(e){for(const t of r)if(!t.handleZoomChange(e))break}(e)})),t=!0)},e.register=function(e){e instanceof n&&r.push(e)},e.unregister=function(e){r=r.filter((t=>t!=e))}}(t.TabEventsDispatcher||(t.TabEventsDispatcher={}))},188:function(e,t,n){var r=this&&this.__awaiter||function(e,t,n,r){return new(n||(n=Promise))((function(o,i){function a(e){try{c(r.next(e))}catch(e){i(e)}}function s(e){try{c(r.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(a,s)}c((r=r.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.TabOperationProxy=t.TabInfoProxy=void 0;const o=n(28);var i,a;!function(e){function t(){return chrome.tabs.query({})}e.getAll=t,e.getHighlighted=function(){return r(this,void 0,void 0,(function*(){const[e]=yield chrome.tabs.query({highlighted:!0});return e}))},e.getByUrl=function(e){return r(this,void 0,void 0,(function*(){return(yield t()).filter((t=>o.UrlUtils.compareUrl(t.url,e)))}))},e.getByGroupId=function(e){return chrome.tabs.query({groupId:e})}}(i||(i={})),t.TabInfoProxy=i,function(e){const t=chrome.tabs;e.active=function(e){t.update(e,{active:!0})},e.move=function(e,n){t.move(e,{index:n})},e.remove=function(e){t.remove(e)},e.group=function(e){return t.group(e)}}(a||(a={})),t.TabOperationProxy=a},28:(e,t)=>{var n,r,o;Object.defineProperty(t,"__esModule",{value:!0}),t.StringUtils=t.UrlUtils=t.CTLog=void 0,function(e){function t(e){if(e)try{return new URL(e).hostname}catch(e){o.warn("UrlUtils.getHostName",JSON.stringify(e))}}function n(e){return!(!(null==e?void 0:e.startsWith("https"))&&!(null==e?void 0:e.startsWith("http")))}e.compareUrl=function(e,t){if(!e||!t)return!1;const n=new URL(e),r=new URL(t);if(n.hostname!=r.hostname)return!1;if(n.pathname!=r.pathname)return!1;const o=new URLSearchParams(n.searchParams),i=new URLSearchParams(r.searchParams);if(o.keys.length!=i.keys.length)return!1;for(const e in o)if(o.get(e)!=i.get(e))return!1;return!0},e.getHostName=t,e.isHttpUrl=n,e.isChromeUrl=function(e){return!!(null==e?void 0:e.startsWith("chrome"))},e.getDomain=function(e){let r="";if(n(e)&&(e=t(e)),e){const t=e.split(".");t.length>=2?(t.pop(),"www"==t[0]&&t.shift(),r=t.join(".")):r=e}return r}}(n||(n={})),t.UrlUtils=n,function(e){function t(e){return null==e||0==e.length}e.isEmpty=t,e.isNotEmpty=function(e){return!t(e)}}(r||(r={})),t.StringUtils=r,function(e){const t="CleanTab";e.info=function(...e){console.info(t,"[info]",...e)},e.debug=function(...e){console.debug(t,"[debug]",...e)},e.warn=function(...e){console.warn(t,"[warn]",...e)},e.error=function(...e){console.error(t,"[error]",...e)}}(o||(o={})),t.CTLog=o}},t={};!function n(r){var o=t[r];if(void 0!==o)return o.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,n),i.exports}(675)})();