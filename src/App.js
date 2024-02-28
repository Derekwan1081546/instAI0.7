import './App.css';
import {BrowserRouter as Router , Routes , Route} from "react-router-dom";
import React , {lazy, Suspense , useState} from "react";


// 開發完成頁面
// import Loading from './loading';
const Register = lazy(() => import("./Navigation/Register/Register"));
const Login = lazy(() => import("./Navigation/Login/Login"));
const DataFilter = lazy(() => import("./Navigation/DataProcess/Filter"));
const Project = lazy(() => import("./Navigation/ProjectPage/Project"));
const CreatePage = lazy(() => import("./Navigation/CreatePage/Create"));
const StepPage = lazy(() => import("./Navigation/Step1/Step"));
const ConfirmImg = lazy(() => import('./Navigation/Confirm/ConfirmIMG'));
const ConfirmReq = lazy(() => import('./Navigation/Confirm/ConfirmReq'));
const ViewReq = lazy(() => import('./Navigation/Confirm/ViewReq'));
const ViewData = lazy(() => import('./Navigation/Model/Req'));
const Requirement = lazy(() => import('./Navigation/Requirment/Requirment'));
const Data = lazy(() => import("./Navigation/Model/Data"));
const Req = lazy(() => import('./Navigation/Model/Req'));
const Model = lazy(() => import('./Navigation/Model/Model'));
const UploadImg = lazy(() => import('./Navigation/UploadImg/UploadImg'));
// const LabelProject = lazy(()=>import ('./tool/LabelProject'));
// const LabelCreate = lazy(() => import("./tool/LabelCreate"));
// // 還沒完成頁面
// const LabelPage = lazy(() => import('./tool/LabelPage'));
function App() {

  const [userState , setUserState] = useState({});
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path='/Login' element={<Login setUserState={setUserState} />} />
            <Route path='/DataFilter' element={<DataFilter />} />
            <Route path="/Project" element={<Project />} />
            <Route path="/CreatePage" element={<CreatePage />} />
            <Route path='/Step' element={<StepPage />} />
            <Route path="/ConfirmImg" element={<ConfirmImg />} />
            <Route path="/ConfirmReq" element={<ConfirmReq />} />
            {/* <Route path='/LabelPage' element={<LabelPage />} />
            <Route path='/LabelProject' element={<LabelProject/>}/>
            <Route path='/LabelCreate' element={<LabelCreate/>}/> */}
            <Route path="/Data" element={<Data />} />
            <Route path="/Req" element={<Req />} /> 
            <Route path="/ViewData" element={<ViewData />} />
            <Route path="/ViewReq" element={<ViewReq />} />
            <Route path="/Model" element={<Model />} />
            <Route path="/Requirment" element={<Requirement />} />
            <Route path='/UploadImg' element={<UploadImg/>}/>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
