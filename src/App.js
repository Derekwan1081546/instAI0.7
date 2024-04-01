import './App.css';
import {BrowserRouter as Router , Routes , Route , useNavigate , useLocation} from "react-router-dom";
import React , {lazy, Suspense , useState , useEffect} from "react";
import { BounceLoader } from 'react-spinners';
//使用 WebSocket 的網址向 Server 開啟連結
let ws = new WebSocket('ws://localhost:8080')
//開啟後執行的動作，指定一個 function 會在連結 WebSocket 後執行
ws.onopen = () => {
    console.log('open connection')
}
//關閉後執行的動作，指定一個 function 會在連結中斷後執行
ws.onclose = () => {
    console.log('close connection')
}
//接收 Server 發送的訊息
ws.onmessage = event => {
  console.log(event)
}
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
const ViewData = lazy(() => import('./Navigation/Confirm/ViewData'));
const Requirement = lazy(() => import('./Navigation/Requirment/Requirment'));
const Data = lazy(() => import("./Navigation/Model/Data"));
const Req = lazy(() => import('./Navigation/Model/Req'));
const Model = lazy(() => import('./Navigation/Model/Model'));
const UploadImg = lazy(() => import('./Navigation/UploadImg/UploadImg'));
const CreateProjectPage = lazy(()=>import('./Navigation/CreateProjectPage/CreateProjectPage'));
const ModelSelectionPage = lazy(() => import("./Navigation/ModelSelectionPage/ModelSelectionPage"));
const PromptInputPage = lazy(() => import("./Navigation/PromptInputPage/PromptInputPage"));
const ImageDisplay = lazy(() => import("./Navigation/ImgDisplayPage/ImgDisplayPage"));
const Txt2ImgPage = lazy(() => import("./StableDiffusion/txt2txt/TXTtoIMG"));

const Alert = lazy(() => import("./Navigation/AlertComponent/Reminder"));
const Confirm = lazy(()=>import("./Navigation/AlertComponent/Confirm"));

function AppDev() {
  const setUserState= useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if(token && token !== 'false'){
      //檢查TOKEN是否為base64字串
      const base64Regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
      if (base64Regex.test(token)) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = localStorage.setItem("userId",payload.user);
        const id_test = localStorage.getItem("id_test");
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if(userId !== id_test || userId !== id){
          navigate(location.pathname);  
        }
      } else {
        console.error('Invalid token');
      }
    }
    if (token && token !== 'false') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      if (location.pathname !== "/Login" && location.pathname !== "/" && isLoggedIn !== true ) {
        navigate("/Login"); 
      }
    }
  }, [navigate, location, isLoggedIn]);

  
  return (
    <div className="App">
      
        <Suspense fallback={ 
    <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
       <BounceLoader color={'#black'} size={120} /> 
     </div>}>
      
          <Routes>
            {isLoggedIn ? (
              <>
                <Route path="/" element={<Register />} />
                <Route path='/Login' element={<Login setUserState={setUserState} />} />
                <Route path='/DataFilter' element={<DataFilter />} />
                <Route path="/Project" element={<Project />} />
                <Route path="/CreatePage" element={<CreatePage />} />
                <Route path='/Step' element={<StepPage />} />
                <Route path="/ConfirmImg" element={<ConfirmImg />} />
                <Route path="/ConfirmReq" element={<ConfirmReq />} />
                <Route path="/Data" element={<Data />} />
                <Route path="/Req" element={<Req />} /> 
                <Route path="/ViewData" element={<ViewData />} />
                <Route path="/ViewReq" element={<ViewReq />} />
                <Route path="/Model" element={<Model />} />
                <Route path="/Requirment" element={<Requirement />} />
                <Route path='/UploadImg' element={<UploadImg/>}/>
                <Route path="/CreateProjectPage" element={<CreateProjectPage/>}/>
                <Route path="/ModelSelectionPage" element={<ModelSelectionPage/>}/>
                <Route path="/PromptInputPage" element={<PromptInputPage/>}/>
                <Route path ="/ImgDisplayPage" element={<ImageDisplay/>}/>
                <Route path ="/Txt2ImgPage" element={<Txt2ImgPage/>}/>
                <Route path="/Alert" element={<Alert/>}/>
                <Route path="/Confirm" element={<Confirm/>}/>
                
              </>
            ) : (
              <>
                <Route path="/" element={<Register />} />
                <Route path='/Login' element={<Login setUserState={setUserState} />} />
              </>
            )}
          </Routes>
          
        </Suspense>
      
    </div>
  );
}

function App(){
  return(
    <Router>
      <AppDev/>
    </Router>
  )
}

export default App;