import { Divider, Row, Col, Typography, Tooltip, Avatar } from 'antd'
import VirtualList from 'rc-virtual-list';
import { ClearOutlined, CheckCircleOutlined } from '@ant-design/icons'
import React, { useContext } from 'react';
import { CleanTaskType, NotificationContext } from './NotificationContext';

const { Text } = Typography

const CleanTask = (prop: { data: CleanTaskType }) => {
    const iconUnCleanedStyle: React.CSSProperties = { cursor: 'pointer', color: 'orange' }

    const iconCleanedStyle = { color: 'green' }

    return (
        <>
            <Row style={{ marginTop: 3 }}>
                <Col span={3} style={{ textAlign: "center" }}>
                    <Avatar size={18} src={prop.data.favicon} />
                </Col>
                <Col span={17} style={{ paddingLeft: 2, paddingRight: 2 }}>
                    <Tooltip title={prop.data.url}>
                        <Text ellipsis={true}>{prop.data.title}</Text>
                    </Tooltip>
                </Col>
                <Col span={2}>
                    <Text strong type='secondary'>{prop.data.count}</Text>
                </Col>
                <Col span={2} >
                    {
                        prop.data.cleand ?
                            (
                                <Tooltip title="已清理">
                                    <CheckCircleOutlined style={iconCleanedStyle} />
                                </Tooltip>
                            )
                            :
                            <ClearOutlined style={iconUnCleanedStyle} />
                    }
                </Col>
            </Row>
            <Divider style={{ marginTop: 3, marginBottom: 0, marginLeft: 0, marginRight: 0 }} />
        </>
    )
}

const containerStyle: React.CSSProperties = {
    borderWidth: 1,
    borderColor: 'rgba(5,5,5,0.08)',
    borderStyle: 'solid',
    borderRadius: 3
}

const CleanTaskList = () => {
    const { cleanTasks } = useContext(NotificationContext)
    const vListHeight = 118
    return (
        <div style={containerStyle}>
            <VirtualList
                data={cleanTasks}
                height={vListHeight}
                itemKey='taskId'
            >
                {
                    (item => <CleanTask data={item} />)
                }
            </VirtualList>
        </div>

    )
}

export default CleanTaskList