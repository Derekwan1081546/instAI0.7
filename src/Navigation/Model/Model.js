import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import InstAI_icon from "../../image/instai_icon.png";

import yolov3Model from '../../model/AD6F1091A9FD04D8298166B9DB990614977F8760_yolov3tiny'; //使用按鍵下載這個模型

import bell from "../../image/bell.png";
import train from "../../image/train.png";
import design from "../../image/design.png";
import schedule from '../../image/schdule.png';
import line from '../../image/line.png';

const Model = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userid = searchParams.get('id');
  const projectname = searchParams.get("projectname");
  const [modelFile, setModelFile] = useState(yolov3Model);
  const d_m = process.env.DOWNLOAD_MODEL;
  useEffect(() => {
    const fetchModel = async () => {
      try {

        const responses = await axios.post(
          `${d_m}/?username=${userid}&projectname=${projectname}`, 
          null, // 注意這裡傳遞了 null，因為 POST 請求不需要傳遞具體的資料
          { 
            responseType: 'blob'
          }
        );
        console.log('Model fetched successfully');
        setModelFile(responses.data);

        // const responses = await axios.post(
        //   `${DOWNLOAD_MODEL}/?username=${userid}&projectname=${projectname}`, { responseType: 'blob' }
        // );
        // //const response = await axios.get('aws模型位址', { responseType: 'blob' });
        // console.log('Model fetched successfully');
        // setModelFile(responses);
        //alert(responses.data);
      } catch (error) {
        console.error('Could not fetch model', error);
      }
    };

    fetchModel();
  }, []);  
  
  // const handleDownloadModel = () => {
  //   if (modelFile) {
  //     const blob = new Blob([modelFile], { type: 'application/octet-stream' });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'yolov3tiny.zip');
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };
  const handleDownloadModel = () => {
    if (modelFile instanceof Blob) {
      // 繼續處理下載
      const blob = new Blob([modelFile], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'yolov3tiny.zip');
  
      // 將元素附加到DOM之前，確保元素設置是可見的
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      
      // 等待檔案下載後再從DOM中移除元素
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } else {
      console.error('無法下載檔案，因為檔案不是有效的 Blob 物件。');
    }
  };
  
  // const handleDownloadModel = () => {
  //   if (modelFile) {
  //     const url = window.URL.createObjectURL(new Blob([modelFile]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'yolov3tiny.extension');
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //   }
  // };

  return (
    <div className="container-fluid mt-3">
      <div className="row d-flex justify-content-between ">
        <div className="col-auto">
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>
        <div className="col-auto mt-4">
          <NavLink to={`/Project?id=${userid}&type=1`} className="projectPageLink">
            <button className="btn projectPageButton">返回專案頁面</button>
          </NavLink>
        </div>
        <div className="custom-border" />
      </div>
      <h1 className='main-projectTitle'>
        {projectname}
      </h1>
      <div className='background' style={{ position: 'relative' }}>
        
        <img src={bell} alt="bell" style={{ width: '150px', height: '150px' ,marginRight: '120px',marginLeft:'120px' }}></img>
        <img src={schedule} alt="schedule" style={{ width: '150px', height: '150px',marginRight: '120px' }}></img>
        <img src={design} alt="design" style={{ width: '150px', height: '150px',marginRight: '120px' }}></img>
        <img src={train} alt="train" style={{ width: '150px', height: '150px',marginRight: '120px' }}></img>
        <img src={line} alt="line" style={{ width: '150px', height: '150px' }}></img>

        <div style={{ display: 'flex', marginTop: '20px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', border: '2px solid #000', marginRight: '250px' ,marginLeft: '190px'}}></div>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', border: '2px solid #000', marginRight: '250px' }}></div>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', border: '2px solid #000', marginRight: '250px' }}></div>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', border: '2px solid #000', marginRight: '250px' }}></div>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', border: '2px solid #000' }}></div>
          
        </div>

        <div style={{ position: 'absolute', left: '50%',marginTop:'-10px', transform: 'translateX(-50%)', width: '100%', borderBottom: '2px solid #000' }}></div>
        <div className="col mt-3">
        <ul>
          <button className='listTitle' style={{marginLeft:'600px',marginTop:'200px'}} onClick={handleDownloadModel}>Download AI model</button>
        </ul>
      </div>
      </div>

      
    </div>
  );
}

export default Model;