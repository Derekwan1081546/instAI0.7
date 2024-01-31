import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  state: 0,
};

const modelSlice = createSlice({
  name: "modelState",
  initialState: initialState,
  reducers: {
    state1(state, action) {
      console.log(action);
      state.state = 1;
    },
    state2(state, action) {
      console.log(action);
      state.state = 2;
    },
    state3(state, action) {
      console.log(action);
      state.state = 3;
    },
    state4(state, action) {
      console.log(action);
      state.state = 4;
    },
  },
});

export const { state1, state2, state3, state4} = modelSlice.actions;
export default modelSlice.reducer;
