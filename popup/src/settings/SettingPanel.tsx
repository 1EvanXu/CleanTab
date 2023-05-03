import { SettingItem, SettingItemProp } from './SettingItem'
import { Select, Switch, Button, Layout } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { CleanTabService, CleanTabServiceSession, SettingsModel } from '../service/CleanTabService'

const { Header, Content } = Layout

const cleanModeOptions = [
    { value: 'auto', label: 'Auto', tooltip: "Auto clean duplocatied tabs." },
    { value: 'manual', label: 'Manual', tooltip: "Manual clean duplocatied tabs." }
]



const headerStyle: React.CSSProperties = {
    textAlign: 'start',
    fontWeight: "bolder",
    color: '#fff',
    height: 40,
    lineHeight: '40px',
    backgroundColor: 'green',
};

const SettingPanel = (props: { onCloseSettings?: () => void }) => {
    const [settings, updateSettings] = useState(new SettingsModel({}))

    const [domainState, setDoaminState] = useState({currentDomain: undefined, disabled: false})

    useEffect(() => {
        CleanTabService.getSettingsInfo().then(
            model => {
                const newValue = new SettingsModel(model)
                updateSettings(newValue)
            }
        )
    }, [])

    useEffect(() => {
        CleanTabServiceSession.getCurrentDoaminDisabled(data => {
            const {currentDomain, disabled} = data
            setDoaminState({currentDomain, disabled})
        })
    }, [])

    const handleCleanModeChange = (value: string) => {
        if (value == 'auto' || value == 'manual') {
            const newSettings = new SettingsModel(settings)
            newSettings.cleanMode = value
            updateSettings(newSettings)
            CleanTabService.updateSettings({ cleanMode: value })
        }
    }

    const handleGlobalSwitchChange = (checked: boolean) => {
        const newSettings = new SettingsModel(settings)
        newSettings.disableGlobal = checked
        updateSettings(newSettings)
        CleanTabService.updateSettings({ disableGlobal: checked })
    }

    const handleDiomainSwitchChange = (checked: boolean) => {
        const {currentDomain, disabled} = domainState
        const newValue = {currentDomain, disabled}
        newValue.disabled = checked
        setDoaminState(newValue)
        if (domainState.currentDomain) {
            if (checked) {
                CleanTabService.updateSettings({ domainDisabled: domainState.currentDomain })
            } else {
                CleanTabService.updateSettings({ domainEnabled: domainState.currentDomain })
            }
        }
    }
    
    const handleDisableNotification = (checked: boolean) => {
        const newSettings = new SettingsModel(settings)
        newSettings.disableNotification = checked
        updateSettings(newSettings)
        CleanTabService.updateSettings({ disableNotification: checked })
    }


    const settingItemData: SettingItemProp[] = [
        {
            key: 1,
            title: "Clean Mode",
            tooltip: settings.cleanMode == 'auto' ? cleanModeOptions[0].tooltip : cleanModeOptions[1].tooltip,
            children: (
                <Select
                    size='small'
                    style={{ width: 140 }}
                    value={settings.cleanMode}
                    onChange={handleCleanModeChange}
                    options={cleanModeOptions}
                />
            )
        },
        {
            key: 2,
            title: "Disable Global",
            children: (
                <Switch
                    size='small'
                    checked={settings.disableGlobal}
                    disabled={settings.cleanMode != 'auto'}
                    onChange={handleGlobalSwitchChange}
                />
            )
        },
        {
            key: 3,
            title: "Disable in this domain",
            tooltip: domainState.currentDomain ? `current: ${domainState.currentDomain}`: undefined,
            children: (
                <Switch
                    size='small'
                    checked={domainState.disabled}
                    disabled={settings.cleanMode != 'auto'}
                    onChange={handleDiomainSwitchChange}
                />
            )
        },
        {
            key: 4,
            title: "Disable Notification",
            children: (
                <Switch
                    size='small'
                    checked={settings.disableNotification}
                    onChange={handleDisableNotification}
                />
            )
        }
    ]

    const settingItems = settingItemData.map(
        item => <SettingItem key={item.key} title={item.title} tooltip={item.tooltip}>{item.children}</SettingItem>
    )

    const onBackBtnClicked = () => {
        if (props.onCloseSettings) {
            props.onCloseSettings()
        }
    }

    return (
        <Layout>
            <Header style={headerStyle}>
                <Button
                    size='small'
                    onClick={onBackBtnClicked}
                    icon={<ArrowLeftOutlined />}
                    type='primary'
                    shape='circle'
                    style={{ backgroundColor: 'green', }}
                />
                <span style={{ marginLeft: 10 }}>Settings</span>
            </Header>
            <Content style={{ marginTop: 10, marginBottom: 10 }}>
                {settingItems}
            </Content>
        </Layout>
    )
}

export default SettingPanel