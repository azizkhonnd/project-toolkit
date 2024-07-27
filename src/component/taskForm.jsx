// src/components/Task.js
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, moveTask, editTask, pinTask, unpinTask, addNotification } from '../redux/store';
import { Dropdown, Menu, Button, Input, TimePicker, Modal } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { BsFillPinAngleFill } from 'react-icons/bs';
import { BiTrashAlt, BiPencil } from 'react-icons/bi';
import moment from 'moment';

const Task = ({ task, column }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [newTask, setNewTask] = useState(task);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedTime, setSelectedTime] = useState(null);
    const [notificationVisible, setNotificationVisible] = useState(false);

    useEffect(() => {
        if (task.endTime) {
            const endTime = moment(task.endTime, 'HH:mm');
            const now = moment();
            const duration = endTime.diff(now);

            if (duration > 0) {
                const timer = setTimeout(() => {
                    dispatch(addNotification({
                        id: task.id,
                        message: `Task '${task.name}' has reached its end time`,
                        time: new Date().toLocaleTimeString()
                    }));
                }, duration);

                const warningTimer = setTimeout(() => {
                    dispatch(addNotification({
                        id: task.id,
                        message: `Task '${task.name}' will end in 15 minutes`,
                        time: new Date().toLocaleTimeString()
                    }));
                }, duration - 15 * 60 * 1000); // 15 minutes before end time

                return () => {
                    clearTimeout(timer);
                    clearTimeout(warningTimer);
                };
            }
        }
    }, [task, dispatch]);

    const handleDelete = () => {
        dispatch(deleteTask({ taskId: task.id, from: column }));
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleMove = (newColumn) => {
        if (newColumn === 'doing') {
            setShowTimePicker(true);
        } else {
            dispatch(moveTask({ taskId: task.id, from: column, to: newColumn }));
        }
    };

    const handlePin = () => {
        if (task.pinned) {
            dispatch(unpinTask({ taskId: task.id, from: column }));
        } else {
            dispatch(pinTask({ taskId: task.id, from: column }));
        }
    };

    const handleSave = () => {
        dispatch(editTask({ taskId: task.id, from: column, newTask }));
        setIsEditing(false);
    };

    const handleTimeChange = (time, timeString) => {
        setSelectedTime(timeString);
    };

    const handleConfirmMove = () => {
        if (selectedTime) {
            dispatch(moveTask({ taskId: task.id, from: column, to: 'doing', endTime: selectedTime }));
            dispatch(addNotification({
                id: task.id,
                message: `Task '${newTask.name}' is due at ${selectedTime}`,
                time: new Date().toLocaleTimeString()
            }));
            setNotificationVisible(true); // Show notification modal
            setShowTimePicker(false);
            setSelectedTime(null);
        }
    };

    const handleCloseNotification = () => {
        setNotificationVisible(false);
    };

    const menu = (
        <Menu style={{ width: '150px' }}>
            <Menu.Item style={{ color: 'red' }} onClick={handleDelete}>
                <BiTrashAlt size={15} /> Delete
            </Menu.Item>
            <Menu.Item onClick={handleEdit}>
                <BiPencil size={15} /> Edit
            </Menu.Item>
            <Menu.Item onClick={handlePin}>
                <BsFillPinAngleFill size={15} /> {task.pinned ? 'Unpin' : 'Pin'}
            </Menu.Item>
            <Menu.Item style={{ backgroundColor: '#8758ff', marginBottom: '5px' }} onClick={() => handleMove('todo')}>To Do</Menu.Item>
            <Menu.Item style={{ backgroundColor: 'orange', marginBottom: '5px' }} onClick={() => handleMove('doing')}>Doing</Menu.Item>
        </Menu>
    );

    return (
        <div className="task">
            {isEditing ? (
                <Input
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    onBlur={handleSave}
                />
            ) : (
                <span>{newTask.name}</span>
            )}
            <div style={{ width: '65%' }}>
                <span>Created on: {newTask.date} at {newTask.time}</span> {/* Displaying creation time */}
            </div>
            <Dropdown overlay={menu} trigger={['click']}>
                <Button icon={<EllipsisOutlined />} />
            </Dropdown>
            {showTimePicker && (
                <div style={{ marginTop: '10px' }}>
                    <TimePicker
                        format="HH:mm"
                        onChange={handleTimeChange}
                        value={selectedTime ? moment(selectedTime, 'HH:mm') : null}
                    />
                    <Button onClick={handleConfirmMove} style={{ marginLeft: '10px' }}>
                        Confirm
                    </Button>
                </div>
            )}
            <Modal
                title="Notification"
                visible={notificationVisible}
                onOk={handleCloseNotification}
                onCancel={handleCloseNotification}
            >
                <p>Task `{newTask.name}` is due at {selectedTime}</p>
            </Modal>
        </div>
    );
};

export default Task;
