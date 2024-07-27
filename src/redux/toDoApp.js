// src/features/todo/toDoAppSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tasks: [],
    count: 0,
};

const toDoAppSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        increment: (state, action) => {
            state.count += action.payload;
        },
        decrement: (state, action) => {
            state.count -= action.payload;
        },
        addTask: (state, action) => {
            state.tasks.push({
                id: action.payload.id,
                text: action.payload.text,
                pinned: action.payload.pinned,
            });
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
        editTask: (state, action) => {
            const task = state.tasks.find(task => task.id === action.payload.id);
            if (task) {
                task.text = action.payload.text;
            }
        },
        pinTask: (state, action) => {
            const task = state.tasks.find(task => task.id === action.payload);
            if (task) {
                task.pinned = !task.pinned;
            }
        },
    },
});

export const { increment, decrement, addTask, deleteTask, editTask, pinTask } = toDoAppSlice.actions;
export default toDoAppSlice.reducer;
