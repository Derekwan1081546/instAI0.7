import React, { useState,useEffect } from 'react';
import styles from './UploadImg.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import InstAI_icon from "../../image/instai_icon.png";
import { FaRegClock } from 'react-icons/fa'; 
import {Container} from "react-bootstrap";

function UploadImg() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("userId");
  const projectname = searchParams.get('projectname');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const u = process.env.REACT_APP_UPLOAD;
  const c_s = process.env.REACT_APP_CONFIRM_STEP;
  const [mode , setMode] = useState(false);
  const [loading , setLoading] = useState(false);
  //
  
  //const [username, setUsername] = useState(""); 
  //const [filename, setFilename] = useState(""); 
  // 文件選擇
  const [imageFiles, setImageFiles] = useState([]);

  const handleFileSelect = async (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files);
  
    const allowedFileTypes = ['image/jpeg', 'image/png'];
    const promises = fileArray.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            file,
            dimensions: {
              width: 0,
              height: 0,
            },
            fileType: file.type,
          });
        };
        reader.readAsDataURL(file);
      });
    });
  
    try {
      const results = await Promise.all(promises);
      console.log('File information:', results);
  
      // Filter files
      const filteredFiles = results.filter((result) =>
        allowedFileTypes.includes(result.fileType)
      );
  
      setImageFiles((prevFiles) => [...prevFiles, ...filteredFiles.map((result) => result)]);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filteredFiles.map((result) => result.file)]);
      setImagePreviews((prevPreviews) => [...prevPreviews, ...filteredFiles.map((result) => URL.createObjectURL(result.file))]);
    } catch (error) {
      console.error('Error reading file information:', error);
    }
  };
  
  // 處理刪除單一圖片
  const handleDeleteImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...imagePreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  useEffect(() => {
    
    console.log('Selected Files:', selectedFiles.length);
  }, [selectedFiles]);

  // 刪除預覽
  const handleDeleteAllPreviews = () => {
    setImagePreviews([]);
    setSelectedFiles([]);
  };
  const selectModel = () => {
    if (mode === false) {
      const confirmation = window.confirm("你想要關掉篩選模式功能並且無限制上傳圖片嗎?");
      if (confirmation) {
        setMode(true);
        // 可以將格式篩選的功能關掉，變成無限制上傳照片並且都會顯示照片
      }
    } else if (mode === true) {
      const confirmationWithFilter = window.confirm("你想要開啟篩選模式功能對上傳的照片做尺寸篩選嗎");
      if (confirmationWithFilter) {
        setMode(false);
        // 在這裡添加對篩選模式的相關邏輯
      }
    }
    console.log(mode);
  }
  // 下載預覽 //modified
  const handleDownloadAll = () => {
    selectedFiles.forEach((file) => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(new Blob([file]));
      console.log(a.href)
      a.setAttribute("download", file.name);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('請選擇要上傳的圖片!');
    } 
    else if (selectedFiles.length < 10) {
      alert('请至少選擇10張合格的照片!');
      return;
    }
    else {
      const confirmDelete = window.confirm('要求已經滿足,確定要上傳圖片?');
      if (!confirmDelete) {
        return;
      }  
      setLoading(true);   
      const uploaded = [...selectedFiles];
      const formData = new FormData();
      for(let i =0;i<uploaded.length;++i){
        //console.log(uploaded[i]);
        formData.append('file', uploaded[i]);
      }
      //console.log(formData);
      try {
        const token = localStorage.getItem('jwtToken');
        const response = await axios.post(
          `${u}?username=${id}&projectname=${projectname}`,
          formData, 
          {
            headers: {
              'Content-Type':'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          });
        console.log(response.data);
        alert('upload success');

        console.log(token);
        const response2 = await axios.post(
          `${c_s}/?step=1&username=${id}&projectname=${projectname}`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setLoading(false);
        console.log('step updated successfully:', response2.data);
        navigate(`/Step?project=${projectname}`);
        //navigate(`/LabelPage?id=${id}&projectname=${projectname}`);
      } catch (error) {
        console.error('Error sending data to backend:', error);
      }
    }
  };
  useEffect(()=>{
    console.log("loading state test is ",loading);
  },[loading,setLoading,handleUpload]);

  return (
    <div className="container-fluid mt-3">
      <div className="row d-flex justify-content-between ">
        <div className="col-auto">
          <img
            src={InstAI_icon}
            className="img-fluid"
            alt="InstAi_Icon"
            style={{ width: '76.8px', height: '76.8px' }}
          />
        </div>
        <div className="custom-border"></div>
      </div>

      <div className={`card   ${styles.downloadform}`} style={{ height: 100 }}>
        <h1 className="display-4  text-center create-title" style={{ fontWeight: 'bold' }}>
          Filter the data you want
        </h1>
      </div>

      <div className="row justify-content-between">
        <div className="col-4">
        <label className="btn btn-primary">
          select image
          <input type="file" accept="image/*" multiple name="images" onChange={handleFileSelect} style={{ display: 'none' }} />
        </label>  
        </div>
        <div className="col-4 d-flex  justify-content-end">
          <div>
            <button className={'btn btn-primary'} onClick={selectModel}>
              Select modes
            </button>
          </div>
          <div>
            <button className={`btn btn-danger `} onClick={handleDeleteAllPreviews}>
              Remove all
            </button>
          </div>
          <div>
            <button className={`btn btn-primary`} onClick={handleDownloadAll}>
              Download All
            </button>
          </div>
          <div>
            <button className={`btn btn-success `} onClick={handleUpload}>
              Done
            </button>
          </div>
          
        </div>
      </div>

      <div className="mt-3" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {loading?(
       <>
        <Container className="d-flex flex-column justify-content-center" style={{ minHeight: '60vh', maxWidth: '50rem', margin: '50px auto', backgroundColor: 'white', 
       borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
       <h2 className="text-center mb-4">Data are being processed</h2>
       <p className="text-center mb-4">Estimated time: </p>
       <h2 className="text-center mb-4">5 minutes</h2>
       <div className="text-center">
           <FaRegClock style={{ animation: 'spin 12s linear infinite' }} size={70} />
       </div>
       </Container>
       </>
       ):(<><div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
          marginBottom: "2px",
          padding: "5px",
          border: "1px solid black",
        }}
      >
      <p>img id</p>
      <p>labeled</p>
      <p>img height</p>
      <p>img width</p>
      <p>delete</p>
      <p>file</p>
    </div>       
    {imagePreviews.map((preview, index) => (
   <div
   key={index}
   className="image-previews-wrapper"
   style={{
     display: "flex",
     flexDirection: "row",
     justifyContent: "space-between",
     alignItems: "center",
     width: "100%",
     marginBottom: "2px",
     padding: "5px",
     border: "1px solid black",
   }}
 > 
     {/* Information */}
     <div className="d-flex flex-row align-items-center" >
       <p style={{marginLeft:'120px'}}>{index + 1}</p>
       <p style={{marginLeft:'220px'}}>{selectedFiles[index].isTagged ? 'Yes' : 'No'}</p>
       <p style={{marginLeft:'230px'}}>512</p>
       <p style={{marginLeft:'250px'}}>512</p>
        <button
         className="btn btn-danger"
         onClick={handleDeleteImage}
         style={{marginLeft:'200px'}}>
         Delete
       </button>
     </div>
     {/* Image */}
     <img
       src={preview}
       alt={`image ${index}`}
       style={{ width: '100px', height: '120px', marginRight: '50px' }}
       loading='lazy'
     />
   </div>
))}</>)}
      
</div>


      
    </div>
  );
};

export default UploadImg;