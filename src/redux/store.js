import { configureStore, createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
    name: 'tasks',
    initialState: {
        todo: [],
        doing: [],
        done: []
    },
    reducers: {
        addTask: (state, action) => {
            const { column, task } = action.payload;
            state[column].push(task);
        },
        moveTask: (state, action) => {
            const { taskId, from, to } = action.payload;
            const task = state[from].find(task => task.id === taskId);
            state[from] = state[from].filter(task => task.id !== taskId);
            state[to].push(task);
        },
        deleteTask: (state, action) => {
            const { taskId, from } = action.payload;
            state[from] = state[from].filter(task => task.id !== taskId);
        },
        editTask: (state, action) => {
            const { taskId, from, newTask } = action.payload;
            const taskIndex = state[from].findIndex(task => task.id === taskId);
            if (taskIndex >= 0) {
                state[from][taskIndex] = newTask;
            }
        },
        pinTask: (state, action) => {
            const { taskId, from } = action.payload;
            const task = state[from].find(task => task.id === taskId);
            state[from] = state[from].filter(task => task.id !== taskId);
            state[from].unshift({ ...task, pinned: true });
        },
        unpinTask: (state, action) => {
            const { taskId, from } = action.payload;
            const task = state[from].find(task => task.id === taskId);
            state[from] = state[from].filter(task => task.id !== taskId);
            state[from].push({ ...task, pinned: false });
        }
    }
});

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: [],
    reducers: {
        addNotification: (state, action) => {
            state.push(action.payload);
        },
        deleteNotification: (state, action) => {
            return state.filter(notification => notification.id !== action.payload);
        }
    }
});

export const { addTask, moveTask, deleteTask, editTask, pinTask, unpinTask } = tasksSlice.actions;
export const { addNotification, deleteNotification } = notificationsSlice.actions;

const store = configureStore({
    reducer: {
        tasks: tasksSlice.reducer,
        notifications: notificationsSlice.reducer
    }
});

export default store;
