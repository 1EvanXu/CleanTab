import { Layout, Button, Row, Col, Tooltip, Avatar } from 'antd'
import { SettingOutlined, ClearOutlined, CheckCircleOutlined } from '@ant-design/icons'
import CleanTaskList from './CleanTaskList';
import { useEffect, useState } from 'react';
import { CleanTabService, CleanTabServiceSession } from '../service/CleanTabService';
import { NotificationContext, CleanTaskType } from './NotificationContext';
import EmptyClean from './EmptyClean';

const { Header, Content, Footer } = Layout

const headerStyle: React.CSSProperties = {
    textAlign: 'start',
    fontWeight: "bolder",
    color: '#fff',
    height: 40,
    lineHeight: '40px',
    backgroundColor: 'green',
};

const contentStyle: React.CSSProperties = {
    marginTop: 6,
    marginLeft: 6,
    marginRight: 6,
    padding: 4,
    alignItems: 'center',
    height: 125
}



const NotificationPanel = (props: { onOpenSettings?: () => void }) => {

    const [cleanTasks, setCleanTasks] = useState(new Array<CleanTaskType>())

    const [cleanMode, setCleanMode] = useState<string>('auto')

    const [iconUrl, setIconUrl] = useState<string>('')

    const onSettingBtnClick = () => {
        if (props.onOpenSettings) {
            props.onOpenSettings()
        }
    }

    const onClean = (taskId: number) => {
        const newTaskList = new Array<CleanTaskType>()
        cleanTasks.forEach(
            item => {
                if (item.taskId == taskId) {
                    item.cleand = true
                }
                newTaskList.push(item)
            }
        )
        setCleanTasks(newTaskList)
        CleanTabService.performCleanTask([taskId])
    }

    const onCleanAll = () => {
        const newTaskList = new Array<CleanTaskType>()
        cleanTasks.forEach(
            item => {
                item.cleand = true
                newTaskList.push(item)
            }
        )
        const taskIdList = newTaskList.map(item => item.taskId)
        CleanTabService.performCleanTask(taskIdList)
    }

    useEffect(
        () => {
            CleanTabServiceSession.getDuplicatedTabs((res) => {
                setCleanTasks(res)
            })
            
            CleanTabService.getSettingsInfo().then(
                settings => {
                    setCleanMode(settings.cleanMode)
                }
            )

            const url = chrome.runtime.getURL('./asset/icon-128.png')
            setIconUrl(url)

        }, []
    )
    
    const buttonText = cleanMode == 'manual' ? 'Clean All Duplicated Tab' : 'Auto Clean Duplicated Tab'
    
    return (
        <NotificationContext.Provider value={{
            cleanMode, cleanTasks, onClean
        }}>
            <Layout >
                <Header style={headerStyle}>
                    <Row>
                        <Col span={20}>
                            <Avatar size={20} src={iconUrl} /> CleanTab
                        </Col>
                        <Col span={4}>
                            <Tooltip title="Change Your Config">
                                <Button
                                    icon={<SettingOutlined />}
                                    shape='circle'
                                    type='primary'
                                    size='small'
                                    style={{ backgroundColor: 'green' }}
                                    onClick={onSettingBtnClick}
                                />
                            </Tooltip>
                        </Col>
                    </Row>
                </Header>
                <Content style={contentStyle}>
                    {
                        cleanTasks.length == 0 ? <EmptyClean /> : <CleanTaskList /> 
                    }
                </Content>
                <Footer style={{ padding: 5, textAlign: 'center' }}>
                    <Button
                        onClick={onCleanAll}
                        style={{ backgroundColor: cleanMode!='auto' ? 'green': undefined }}
                        type={cleanMode != 'auto' ? 'primary': 'default'} 
                        size='small'
                        disabled={cleanMode=='auto' || cleanTasks.length == 0}
                        icon={cleanMode != 'auto'? <ClearOutlined /> : <CheckCircleOutlined />}>
                            {buttonText}
                    </Button>
                </Footer>
            </Layout>
        </NotificationContext.Provider>
    )
}


export default NotificationPanel