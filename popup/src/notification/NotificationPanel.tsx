import { Layout, Button, Row, Col } from 'antd'
import { SettingOutlined, ClearOutlined } from '@ant-design/icons'
import CleanTaskList from './CleanTaskList';
import { useEffect, useState } from 'react';
import { CleanTabServiceSession } from '../service/CleanTabService';
import { CleanTaskListContext, CleanTaskType } from './CleanTaskListContext';
// import { BGLogRemoteClient } from '../common/Log';

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

    const onSettingBtnClick = () => {
        if (props.onOpenSettings) {
            props.onOpenSettings()
        }
    }

    const onCleanAll = () => {

    }

    useEffect(
        () => {
            CleanTabServiceSession.getDuplicatedTabs((res) => {
                setCleanTasks(res)
            })

        }, []
    )

    return (
        <CleanTaskListContext.Provider value={cleanTasks}>
            <Layout >
                <Header style={headerStyle}>
                    <Row>
                        <Col span={20}>
                            CleanTab
                        </Col>
                        <Col span={4}>
                            <Button
                                icon={<SettingOutlined />}
                                shape='circle'
                                type='primary'
                                size='small'
                                style={{ backgroundColor: 'green' }}
                                onClick={onSettingBtnClick}
                            />
                        </Col>
                    </Row>
                </Header>
                <Content style={contentStyle}>
                    <CleanTaskList />
                </Content>
                <Footer style={{ padding: 5, textAlign: 'center' }}>
                    <Button
                        onClick={onCleanAll}
                        style={{ backgroundColor: 'green' }}
                        type='primary' size='small'
                        icon={<ClearOutlined />}>
                        Clean All Duplicated Tab
                    </Button>
                </Footer>
            </Layout>
        </CleanTaskListContext.Provider>
    )
}


export default NotificationPanel