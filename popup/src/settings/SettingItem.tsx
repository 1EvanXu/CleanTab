import {Row, Col, Typography } from 'antd'
import { ReactNode } from 'react'

const { Text, Paragraph } = Typography;

export interface SettingItemProp {
    key: number
    title: string,
    tooltip?: string,
    children?: ReactNode
}


export const SettingItem = (prop: SettingItemProp) => {

    const tooltipStyle: React.CSSProperties = {
        fontSize: 5,
        color: 'grey',
    }

    return (
        <>
         <Row>
            <Col span={12} style={{
                fontSize: 15,
                textAlign: "end",
                paddingRight: 10
            }}>
                {prop.title}:
            </Col>
            <Col span={12}>
                {prop.children}
                <Paragraph>
                <Text style={tooltipStyle}>
                    {prop.tooltip}
                </Text>
                </Paragraph>
            </Col>
         </Row>
        </>
    )
}
