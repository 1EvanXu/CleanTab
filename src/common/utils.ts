import { BGLogger } from "./Log";
import { ChromeMessage } from "./message";

namespace UrlUtils {

    export function compareUrl(urlA?: string, urlB?: string): boolean{
        if (!urlA || !urlB) {
            return false;
        }
        const url1 = new URL(urlA);
        const url2 = new URL(urlB);
        if (url1.hostname != url2.hostname) {
            return false;
        }
    
        if (url1.pathname != url2.pathname) {
            return false;
        }
    
        const queryParams1 = new URLSearchParams(url1.searchParams);
        const queryParams2 = new URLSearchParams(url2.searchParams);
        
        if (queryParams1.keys.length != queryParams2.keys.length) {
            return false;
        }
    
        for (const key in queryParams1) {
            if (queryParams1.get(key) != queryParams2.get(key)) {
                return false;
            }
        }
        return true;
    }

    export function getHostName(url?: string): string | undefined {
        if(url) {
            try {
                const uri = new URL(url);
                return uri.hostname;
            } catch (error) {
                CTLog.warn("UrlUtils.getHostName", JSON.stringify(error));
            }
        } 
    }

    export function isHttpUrl(url?: string): boolean {
        if (url?.startsWith("https") || url?.startsWith("http")) {
            return true
        }
        return false
    }

    export function isChromeUrl(url?: string): boolean {
        if (url?.startsWith("chrome")) {
            return true
        }
        return false
    }

    export function getDomain(hostname?: string): string {
        let domian = ""

        if(isHttpUrl(hostname)) {
            hostname = getHostName(hostname)
        }
        
        if (hostname) {
            const strArray = hostname.split('.');
            if(strArray.length >= 2) {
                // 移除后缀
                strArray.pop()
                // 移除前缀
                if(strArray[0] == "www") {
                    strArray.shift()
                }
            
                domian = strArray.join(".");
            } else {
                domian = hostname;
            }
        }
        return domian;
    }
}

namespace StringUtils {
    export function isEmpty(value?:string): boolean {
        return value == undefined || value.length == 0
    }
    export function isNotEmpty(value?:string): boolean {
        return !isEmpty(value)
    }
}



const CTLog = new BGLogger()
CTLog.setTag("CleanTab")

export  {
    CTLog, UrlUtils, StringUtils
}