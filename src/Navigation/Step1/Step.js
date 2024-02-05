import React, { useState , useEffect } from 'react';
import './Step.css';
import axios from 'axios';
import InstAI_icon from "../../image/instai_icon.png";
import { NavLink, useNavigate, useLocation } from 'react-router-dom';


function Step() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userid = searchParams.get('id');
  const projectname = searchParams.get('project');
  const g_s = process.env.GET_STEP;
  const modelLink = `/Model?id=${userid}&projectname=${projectname}`;
  const [upload, setUpload] = useState(
    JSON.parse(localStorage.getItem(`firstPage_${userid}_${projectname}`) || 'false')
  );
  const [requirement, setRequirement] = useState(
    JSON.parse(localStorage.getItem(`secondPage_${userid}_${projectname}`) || 'false')
  );
  const [confirm1Data, setConfirm1Data] = useState(
    JSON.parse(localStorage.getItem(`confirmStatusImg_${userid}_${projectname}`) || 'false')
  );
  const [confirm2Data, setConfirm2Data] = useState(
    JSON.parse(localStorage.getItem(`confirmStatusReq_${userid}_${projectname}`) || 'false')
  );
  const [step,setstep] = useState();
  const fetchstep = async () => {
    try {
      const response = await axios.get(
        `${g_s}/?username=${userid}&projectname=${projectname}`
      );
      console.log(response.data)
      setstep(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    console.log(upload.toString(),requirement.toString(),confirm1Data.toString(),confirm2Data.toString());
    localStorage.setItem(`firstPage_${userid}_${projectname}`, upload.toString());
    localStorage.setItem(`secondPage_${userid}_${projectname}`, requirement.toString());
    localStorage.setItem(`confirmStatusImg_${userid}_${projectname}`, confirm1Data.toString());
    localStorage.setItem(`confirmStatusReq_${userid}_${projectname}`, confirm2Data.toString());
    fetchstep();
  }, [upload, requirement, confirm1Data, confirm2Data]); 

  /*const response =  來自後端回傳的檢查 可能使用axios 當這個頁面被點及進入時 後端會回傳說相對應的data以及req資料夾是否是空的 如果都是有一定資料量的話 回傳true */
  const navigate = useNavigate();
  // console.log("第一個按鈕:" ,upload , "第二個按鈕 ", requirement) ;
  const circleNo1ClassName = upload ? 'circleNo1-active' : 'circleNo1';
  const circleNo2ClassName = requirement ? 'circleNo2-active' : 'circleNo2';
  const circleNo3ClassName = confirm1Data ? 'circleNo3-active' : 'circleNo3';
  const circleNo4ClassName = confirm2Data ? 'circleNo4-active' : 'circleNo4';
  console.log('circleNo1ClassName:', circleNo1ClassName);
  console.log('circleNo2ClassName:', circleNo2ClassName);
  console.log('circleNo3ClassName:', circleNo3ClassName);
  console.log('circleNo4ClassName:', circleNo4ClassName);
  //-----------------------------------------------------//
  const Green1 = () => {
    console.log("upload 被點擊");
    var str = "上傳資料";
    if (upload){
      str = "預覽資料";
    }
    const userConfirm = window.confirm(str);
    if (userConfirm) {
      if (!upload) {
        //   setUpload((prevData) => {
        //   const newUpload = !prevData;
        //   localStorage.setItem(`firstPage_${userid}_${projectname}`, newUpload.toString());
        //   return newUpload;
        // });
        // localStorage.setItem(`confirmStatusImg_${userid}_${projectname}`, upload.toString());
        setUpload(upload);
        console.log("upload:",upload);
        navigate(`/Download2?id=${userid}&projectname=${projectname}`);
      }
      else{
        console.log("upload 已經確定");
        navigate(`/ViewData?id=${userid}&projectname=${projectname}`);
      }
    }
  };
  
  const Green2 = () => {
    console.log("第二個按鈕被點擊");
    var str = "填寫需求";
    if (requirement){
      str = "預覽需求";
    }
    const userConfirm=window.confirm(str);
    if (userConfirm) {
      if(upload){
         if (!requirement) {
          // setRequirement((prevData) => {
          //   const newRequirement = !prevData;
          //   localStorage.setItem(`secondPage_${userid}_${projectname}`, newRequirement.toString());
          //   return newRequirement;
          // });
          //localStorage.setItem(`secondPage_${userid}_${projectname}`, requirement.toString());
          setRequirement(requirement);
          console.log("Fill out the form : ",requirement);
          navigate(`/Requirment?id=${userid}&projectname=${projectname}`);
        }
        else{
          console.log("requirement 已經確定");
          navigate(`/ViewReq?id=${userid}&projectname=${projectname}`)
        }
      }
      else{
        alert("請從第一步開始");
      }
   }
  };
  const handleFormDataChange = () => {
    const userConfirm=window.confirm("圖片檢查");
    if(userConfirm){
      if(upload && requirement){
        // if(confirm1Data){
        //   console.log("不須1212");
        //   navigate(`/ConfirmImg?id=${userid}&projectname=${projectname}`);
        // }
        // else{
        //   setConfirm1Data((prevData) => {
        //     const newConfirm1Data = !prevData;
        //     localStorage.setItem(`confirmStatusImg_${userid}_${projectname}`, newConfirm1Data.toString());
        //     return newConfirm1Data;
        //   });
        // }
        //localStorage.setItem(`confirmStatusImg_${userid}_${projectname}`, confirm1Data.toString());
        setConfirm1Data(confirm1Data);
        console.log('Button clicked. Confirm is now:', confirm1Data);
        navigate(`/ConfirmImg?id=${userid}&projectname=${projectname}`);
      }
      else{
        alert("請照步驟執行");
      }
  }
  };

  const handleForm2DataChange = () => {
    const userConfirm=window.confirm("需求檢查");
    if(userConfirm){
      if(confirm1Data && requirement && upload){
        // if(confirm2Data){
        //   console.log("不須變更");
        //   navigate(`/ConfirmReq?id=${userid}&projectname=${projectname}`);
        // }
        // else{
        //   setConfirm2Data((prevData) => {
        //     const newConfirm2Data = !prevData;
        //     localStorage.setItem(`confirmStatusReq_${userid}_${projectname}`, newConfirm2Data.toString());
        //     return newConfirm2Data;
        //   });
        // }
        //localStorage.setItem(`confirmStatusReq_${userid}_${projectname}`, confirm2Data.toString());
        setConfirm2Data(confirm2Data);
        console.log('Button clicked. Confirm is now:', confirm2Data);
        navigate(`/ConfirmReq?id=${userid}&projectname=${projectname}`);
    }
    else{
      alert("請照步驟執行");
    }
  }
  };

  const navigateLogic= async () =>{
    const userConfirm=window.confirm("模型訓練");
    if(userConfirm ){
      if (confirm1Data  && confirm2Data && upload && requirement){  
        try {
          const response = await axios.get(
            `${g_s}/?username=${userid}&projectname=${projectname}`
          );
          console.log(response.data)
          if(response.data === 3){
            navigate(modelLink);
          }   
        } catch (error) {
          console.error('Error fetching data:', error);
        }      
      }
      else{
        alert("請照步驟執行");
        console.log("error reading");
      }
    }
    else{
      console.log("使用者說no! ");
      return;
    }
  }
  return (
    // <div className="app">
    <div className="container-fluid mt-3">

    <div className="row d-flex justify-content-between " >
      <div className="col-auto"> 
        <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
      </div>
      <div className="col-auto mt-4"> 
         <NavLink to={`/Project?id=${userid}&type=1`} className="projectPageLink">
            <button className="btn projectPageButton">返回專案頁面</button>
          </NavLink>
      </div>
      <div className="custom-border">

      </div>
    </div>

        <h1 className='main-projectTitle'>
        {projectname} 
        </h1>
      <nav className="secondNav">
        <ul>
          <li >Steps</li>
          <li style={{ backgroundColor: step === 0 ? '#EBE7FF' : '' }}>1.Upload & confirm  data</li>
          <li style={{ backgroundColor: step === 1 ? '#EBE7FF' : '' }}>2.Provide and confirm your model training requirements</li>
          <li style={{ backgroundColor: step === 2 ? '#EBE7FF' : '' }}>3.Train your AI model</li>
          <li style={{ backgroundColor: step === 3 ? '#EBE7FF' : '' }}>4.Download AI model</li>
        </ul>
      </nav>
      <div className='background'></div>
        <div className="stepRectangle"></div>
      <div className="circles">
        <div className={step === 0 ? 'circleNo1-active' : 'circleNo1-complete'}></div>
        <div className={step === 0 ? 'circleNo2' : step === 1 ? 'circleNo2-active' : 'circleNo2-complete'} ></div>
        <div className={step === 0 || step === 1 ? 'circleNo3' : step === 2 ? 'circleNo3-active' : 'circleNo3-complete'}></div>
        <div className={step === 3 ? 'circleNo4-active' : 'circleNo4'}></div>
      </div>
      <div className={step === 0 ? 'frame1' : 'frame1-complete'}>
        <ul>
          <li className='listTitle'>Upload training data</li>
          <li>Upload the image data you wish to use to train your style model</li> {/*第一個要追蹤的進度 如果使用者點進這個navlink之後 並且這個navlink被上傳的資料不為空 則顯示進度1完成 */}
        </ul>
        <button className={step === 0 ? 'upload-buttonNo1' : 'upload-buttonNo1-complete'} onClick={Green1}>
              {upload ? 'View your data':'Upload'}
        </button>

      </div>

      <div className={step === 1 ? 'frameNo2' : 'frameNo2-complete'}>
        <ul>
          <li className='listTitle'>Provide your training requirements</li> {/*第二個要追蹤的進度 如果使用者點進這個navlink之後 並且這個navlink上傳的資料不為空 則顯示進度2完成 */}
          <li>Tell us your specific needs for AI model training</li>
        </ul>

          <button className={step === 0 ? 'upload-buttonNo2' : step === 1 ? 'upload-buttonNo2-active' : 'upload-buttonNo2-complete'} onClick={Green2}>
            {upload && requirement? 'View your response':'Fill out the form'}
            </button>
      </div>

      <div className={step === 2 ? 'frameNo3' : 'frameNo3-complete'}>
      <ul>
          <li className='listTitle'>Training your AI model</li>
          <li>You haven't submitted data yet</li>
        </ul>
        <button className={step === 0 || step === 1 ? 'upload-buttonNo3' : step === 2 ? 'upload-buttonNo3-active' : 'upload-buttonNo3-complete'} onClick={handleFormDataChange} disabled={ step === 3? true : false}>Confirm data</button>
        <button className={step === 0 || step === 1 ? 'upload-buttonNo4' : step === 2 ? 'upload-buttonNo4-active' : 'upload-buttonNo4-complete'} onClick={handleForm2DataChange} disabled={ step === 3? true : false}>Confirm requirements</button>
      </div>

      <div className={step === 3 ? 'frameNo4' : 'frameNo4-complete'}>
      <ul>
          <li className='listTitle'>Download AI model</li>
          <li>No model available for download</li>
        </ul>
        <button onClick={navigateLogic} className={step === 3 ? 'upload-buttonNo5-active' : 'upload-buttonNo5'}>Start Training</button>
      </div>
    
    </div>
  );
}

export default Step;