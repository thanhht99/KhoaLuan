import { configureStore } from '@reduxjs/toolkit'

import accSlice from './reducers/acc';
import userSlice from './reducers/user';

export const store = configureStore({
    reducer: {
        acc: accSlice,
        user: userSlice
    },
})
