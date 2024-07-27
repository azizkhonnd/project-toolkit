// src/components/Column.js
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../redux/store';
import Task from '../component/taskForm';

const Column = ({ name }) => {
    const tasks = useSelector((state) => state.tasks[name]);
    const dispatch = useDispatch();
    const [taskName, setTaskName] = useState('');

    const handleAddTask = (e) => {
        e.preventDefault();
        const newTask = {
            id: Date.now(),
            name: taskName,
            completed: false,
            priority: 'medium',
            deadline: '',
            description: '',
            status: 'Pending',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString() // Add local time here
        };
        dispatch(addTask({ column: name, task: newTask }));
        setTaskName('');
    };

    return (
        <div className={`column ${name}`}>
            <h2>{name}</h2>
            <form className='form_wrapper' onSubmit={handleAddTask}>
                <input
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="+ New"
                />
                <button type="submit" className='formBtn'>Add</button>
            </form>
            <div className="task-list">
                {tasks.map((task) => (
                    <Task key={task.id} task={task} column={name} />
                ))}
            </div>
        </div>
    );
};

export default Column;
