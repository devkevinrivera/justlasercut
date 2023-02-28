import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    appName: 'Arquetype',
}

export const configurationSlice = createSlice({
    name: 'configuration',
    initialState,
    reducers: {
        changeName: (state , action) => {
            state.appName = action.payload
        },
    }
});

export const { changeName } = configurationSlice.actions;

export default configurationSlice.reducer;