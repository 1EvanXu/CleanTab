import { SmileOutlined } from "@ant-design/icons";

const EmptyClean = () => {
    const divStyle: React.CSSProperties = { 
        textAlign: 'center', 
        paddingTop: 20, 
        paddingBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(5,5,5,0.08)',
        borderStyle: 'solid',
        borderRadius: 3,
        color: 'green'
    };
    return (
        <div style={divStyle}>
            <SmileOutlined style={{ fontSize: 20 }} />
            <p>No Duplicated Tabs, Your Brower is Clean!</p>
        </div>
    )
};

export default EmptyClean