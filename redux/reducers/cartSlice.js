import { createSlice } from "@reduxjs/toolkit";
const { v4: uuidv4 } = require('uuid');

const initialState = {
    id: uuidv4(),
    name: '',
    items: []
}

export const cartSlice = createSlice({
    name: 'configuration',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items = [...state.items, action.payload];
        },
        deleteItem: (state, action) => {
            state.items = state.items.filter(item => item.idProjectItem !== action.payload);
        },
        setMaterial: (state, action) => {
            state.items = state.items.map( item => {
                if(item.idProjectItem === action.payload.itemId) {
                    item.material = action.payload.material
                };
                return item
            })
        },
        setGrosor: (state, action) => {
            state.items = state.items.map( item => {
                if(item.idProjectItem === action.payload.itemId) {
                    item.weight = action.payload.weight
                };
                return item
            })
        },
        addExtra: (state,action) => {
            state.items = state.items.map( item => {
                if(item.idProjectItem === action.payload.itemId) {
                    item.extras = [...item.extras,action.payload.extras]
                };
                return item
            })
        },
        deleteExtra: (state,action) => {
            state.items = state.items.map( item => {
                if(item.idProjectItem === action.payload.itemId) {
                    item.extras = item.extras.filter((item) => item.id === action.payload.id)
                };
                return item
            })
        },
        modifyCopias: (state,action) => {
            state.items = state.items.map( item => {
                if(item.idProjectItem === action.payload.itemId) {
                    item.copias = parseInt(action.payload.copias);
                };
                return item
            })
        },
        checkMaterialClient: (state,action) => {
            state.items = state.items.map( item => {
                if(item.idProjectItem === action.payload.itemId) {
                    item.materialClient = action.payload.check;
                };
                return item
            })
        },
        setNameProject: (state,action) => {
            state.name = action.payload.name
        },
        setPrice: (state,action) => {
            state.items = state.items.map( item => {
                if(item.idProjectItem === action.payload.itemId) {
                    item.total = action.payload.total
                };
                return item
            })
        }
    }
});

export const { 
    setNameProject: setNameProject,
    checkMaterialClient: checkMaterialClient,
    addItem: addItem, 
    deleteItem: deleteItem, 
    setMaterial: setMaterial,
    setGrosor: setGrosor,
    addExtra: addExtra ,
    deleteExtra: deleteExtra,
    modifyCopias: modifyCopias,
    setPrice: setPrice
} = cartSlice.actions;

export default cartSlice.reducer;