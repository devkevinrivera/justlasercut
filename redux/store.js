import { configureStore } from "@reduxjs/toolkit";
import configurationSlice from "./reducers/configurationSlice";
import cartSlice from "./reducers/cartSlice";

export const store = configureStore({
    reducer: {
        configuration: configurationSlice,
        cart: cartSlice
    },
});
