
export namespace SettingsManager {
    const settingStoreKey = "cleanTabSettings"
    const store = chrome.storage.local

    class SettingsModel {
        cleanMode: "auto" | "manual" = "auto"
        disableGlobal: boolean = false
        disableNotification: boolean = false
        disabledDomainList: Array<string> = []
    }

    let settingValue: SettingsModel

    let hasInited = false

    export async function init() {
        if (hasInited) {
            return
        }
        chrome.storage.onChanged.addListener((changes, namespace) => {
            for (let [key, { newValue }] of Object.entries(changes)) {
                if (namespace != 'local' || key != settingStoreKey) {
                    continue
                }
                settingValue = newValue
            }
        })

        initSettingStorage()
    }

    async function initSettingStorage() {
        const res = await store.get(settingStoreKey)
        if (Object.keys(res).length === 0) {
            settingValue = new SettingsModel()
            store.set({ cleanTabSettings: settingValue })
        } else {
            settingValue = res.cleanTabSettings
        }
    }

    export function getSettings(): SettingsModel {
        if (!hasInited) {
            init()
        }
        return settingValue
    }

    export function updateSettings(data: { [key: string]: string | boolean }) {
        
        if (data.domainDisabled) {
            if (typeof data.domainDisabled == 'string' && settingValue.disabledDomainList.indexOf(data.domainDisabled) == -1) {
                settingValue.disabledDomainList.push(data.domainDisabled)
            }
        } else if (data.domainEnabled) {
            if (typeof data.domainEnabled == 'string' && settingValue.disabledDomainList.indexOf(data.domainEnabled) > -1) {
                const index = settingValue.disabledDomainList.indexOf(data.domainEnabled)
                settingValue.disabledDomainList.splice(index, 1)
            }
        } else {
            Object.assign(settingValue, data)
        }
        store.set({ cleanTabSettings: settingValue })
    }
}