import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface InitialState {
    user:null;
    loading?: boolean;
    error?: string;
    
}

const initialState: InitialState = {
    user:null,
    loading: false,
    error: '',   
}

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setCurrUser: (state, action: PayloadAction<InitialState>) => {
            state.user = action.payload.user,
            state.loading = false;
            state.error = '';
        },
        requestStart: (state) => {
            state.loading = true;
        },
        requestFail: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
})

export const {
    setCurrUser,
    requestStart,
    requestFail,

} = userSlice.actions

export default userSlice.reducer;