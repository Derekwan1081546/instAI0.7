import './App.css';
import {BrowserRouter as Router , Routes , Route} from "react-router-dom";
import React , {useState} from "react";
// redux
import { Provider } from 'react-redux';
import {configureStore } from "@reduxjs/toolkit";
import projectSlice from "./store/projectSlice";
import modelSlice from "./store/modelSlice";
// 開發完成頁面
import Register from "./Navigation/Register/Register";
import Login from "./Navigation/Login/Login";
import DataFilter from "./Navigation/DataProcess/Filter";
import Project from "./Navigation/ProjectPage/Project";
import CreatePage from "./Navigation/CreatePage/Create";
import StepPage from "./Navigation/Step1/Step";

import ConfirmImg from './Navigation/Confirm/ConfirmIMG';
import ConfirmReq from './Navigation/Confirm/ConfirmReq';
import ViewReq from './Navigation/Confirm/ViewReq';
import ViewData from './Navigation/Model/Req';

import Requirement from './Navigation/Requirment/Requirment';
import Data      from "./Navigation/Model/Data";
import Req from './Navigation/Model/Req';
import Model     from './Navigation/Model/Model';

//------尚未開發完成-------//
import LabelPage from './tool/label';
const store = configureStore({
  reducer : {
    project : projectSlice ,
    model   : modelSlice
  }
})
console.log(store.getState().model);
console.log(store.getState().project);


function App() {

  const [userState , setUserState] = useState({});
  return (
    <div className="App">
      <Provider store = {store}>
       <Router>
        <Routes>
          <Route path="/" element={<Register/>}/>
          <Route path='/Login' element={<Login setUserState={setUserState} />}/>
          <Route path='/DataFilter' element={<DataFilter/>}/>
          <Route path="/Project" element={<Project/>}/>
          <Route path="/CreatePage" element={<CreatePage/>}/>
          <Route path='/Step' element={<StepPage/>}/>
          <Route path="/ConfirmImg" element={<ConfirmImg/>}/>
          <Route path="/ConfirmReq" element={<ConfirmReq/>}/>
          <Route path='/LabelPage' element={<LabelPage/>}/>
          <Route path="/Data"  element={<Data/>}/>
          <Route path="/Req" element={<Req/>}/> 
          <Route path="/ViewData" element={<ViewData/>}/>
          <Route path="/ViewReq" element={<ViewReq/>}/>
          <Route path="/Model"  element={<Model/>}/>
          <Route path="/Requirment" element={<Requirement/>}/>
        </Routes>
       </Router>
      </Provider>
    </div>
  );
}

export default App;
