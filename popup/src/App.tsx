
import { useEffect, useState } from 'react'
import './App.css'
import NotificationPanel from './notification/NotificationPanel'
import SettingPanel from './settings/SettingPanel'
import { CleanTabServiceSession } from './service/CleanTabService'

function App() {

  const [isSettingVisible, setSettingVisible] = useState<boolean>(false)

  const onCloseSettings = () => setSettingVisible(false)

  const onOpenSettings = () => setSettingVisible(true)

  useEffect(
    () => {
      CleanTabServiceSession.connect()
      return () => CleanTabServiceSession.disconnect()
    }
  , []);

  return (
    <>
      {
        isSettingVisible ?
          (
            <SettingPanel
              onCloseSettings={onCloseSettings} />
          )
          :
          (
            <NotificationPanel
              onOpenSettings={onOpenSettings} />
          )
      }
    </>
  )
}

export default App
