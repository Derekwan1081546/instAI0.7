import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    project:{
        confirmed1 : false , 
        confirmed2 : false , 
        confiremd3 : false , 
        confirmed4 : false ,
        dataConfirmed : false ,
        reqConfirmed  : false ,
        tan : 'Damn fucking good !!!'
    }
}

const projectSlice = createSlice({
    name: 'projectState',
    initialState: initialState,
    reducers: {
        step1(state, action) {
            console.log(action);
            state.project = {
                ...state.project,
                confirmed1: true,
                confirmed2: false,
                confirmed3: false,
                confirmed4: false,
                dataConfirmed: false,
                reqConfirmed: false
            };
        },
        step2(state, action) {
            console.log(action);
            state.project = {
                ...state.project,
                confirmed1: true,
                confirmed2: true,
                confirmed3: false,
                confirmed4: false,
                dataConfirmed: false,
                reqConfirmed: false
            };
        },
        step3(state, action) {
            console.log(action);
            state.project = {
                ...state.project,
                confirmed1: true,
                confirmed2: true,
                confirmed3: true,
                confirmed4: false,
                dataConfirmed: false,
                reqConfirmed: false
            };
        },
        step4(state, action) {
            console.log(action);
            state.project = {
                ...state.project,
                confirmed1: true,
                confirmed2: true,
                confirmed3: true,
                confirmed4: true,
                dataConfirmed: false,
                reqConfirmed: false
            };
        },
        deleteStep(state, action) {
            console.log(action);
            state.project = initialState.project;
        }
    }
});

export const { step1, step2, step3, step4, deleteStep } = projectSlice.actions;
export default projectSlice.reducer;
