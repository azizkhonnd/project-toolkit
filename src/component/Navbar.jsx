// src/components/NotificationBar.js
import { IoMdNotifications } from "react-icons/io";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Modal, List } from 'antd';
import { deleteNotification } from '../redux/store';

const NotificationBar = () => {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notifications);
    const [notificationVisible, setNotificationVisible] = useState(false);

    const handleDeleteNotification = (id) => {
        dispatch(deleteNotification(id));
    };

    return (
        <div className="notification-bar">
            <Button style={{
                position: 'relative',
                float: 'right',
                backgroundColor: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: 5,
                padding: '5px 10px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                fontSize: 14,
            }} onClick={() => setNotificationVisible(true)}> <IoMdNotifications size={15} /> Notifications ({notifications.length})</Button>
            <Modal
                title="Notifications"
                visible={notificationVisible}
                onOk={() => setNotificationVisible(false)}
                onCancel={() => setNotificationVisible(false)}
                footer={null}
            >
                <List
                    dataSource={notifications}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[
                                <Button key="delete" onClick={() => handleDeleteNotification(item.id)}>Delete</Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={`#${index + 1} - ${item.message}`}
                                description={item.time}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export default NotificationBar;
