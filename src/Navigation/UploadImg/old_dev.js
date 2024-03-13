import React, { useState,useEffect } from 'react';
import styles from './UploadImg.css';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import InstAI_icon from "../../image/instai_icon.png";


function UploadImg() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("userId");
  const projectname = searchParams.get('projectname');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
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
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            resolve({
              file,
              dimensions: {
                width: img.width,
                height: img.height,
              },
              fileType: file.type,
            });
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    });
   
    try {
      const results = await Promise.all(promises);
      console.log('File information:', results);
      
      // 過濾文件
      const filteredFiles = results.filter((result) =>
        allowedFileTypes.includes(result.fileType)
      );
      setImageFiles((prevFiles) => [...prevFiles, ...results.map((result) => result)]);
      setSelectedFiles((prevFiles) => [...prevFiles, ...filteredFiles.map((result) => result.file)]);
      setImagePreviews((prevPreviews) => [...prevPreviews, ...filteredFiles.map((result) => URL.createObjectURL(result.file))]);
    } catch (error) {
      console.error('Error reading file information:', error);
    }
  };

  // 文件下載 //modified
  // const handleDownload = (file) => {
  //   const a = document.createElement('a');
  //   a.href = window.URL.createObjectURL(new Blob([file]));
  //   a.setAttribute("download", file.name);
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // };

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

  const handleupload = async () => {
    // 檢查是否有選擇任何檔案
    if (selectedFiles.length === 0) {
      alert('請選擇要上傳的圖片!');
    }
    else{
      const confirmDelete = window.confirm("確定要上傳圖片?");
      if (!confirmDelete) {
        return;
      }
      const uploaded = [...selectedFiles];
      const formData = new FormData();
      for(let i =0;i<uploaded.length;++i){
        formData.append('file', uploaded[i]);
      }
  
      try {
        const response = await axios.post(`http://localhost:8080/api/upload/upload?username=${id}&projectname=${projectname}`, formData)
        .then(response => {
          console.log(response.data);
          // Handle success
          alert('upload success')
        })
        .catch(error => {
          console.error(1233+error);
          // Handle error
        });
        console.log(response);
        const response2 = await axios.post(
          `http://localhost:8080/api/project/confirmstep/?step=1&username=${id}&projectname=${projectname}`
        );
        console.log('step updated successfully:', response2.data);
        localStorage.setItem(`firstPage_${id}_${projectname}`, 'true');
        navigate(`/Step?project=${projectname}`);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    }
  };

  return (
    // <div className={styles.downloadBackground}>
    <div className="container-fluid mt-3">

  
      <div  className="row d-flex justify-content-between ">
        <div className="col-auto"> 
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>
        <div className="custom-border"></div>
       </div>

       <div className={`card   ${styles.downloadform}`} style={{height:100}}>
          <h1 className="display-4  text-center create-title" style={{fontWeight:'bold'}}>Upload/Download</h1>
        </div>

      

      <div class="row justify-content-between">
         <div class="col-4">
          <input type="file" accept="image/*" multiple name="images" onChange={handleFileSelect} />
          </div>
        <div class="col-8 d-flex  justify-content-end">
            <div >
               <button className={`btn btn-danger `} onClick={handleDeleteAllPreviews}>Remove all</button>
            </div>
           
            <div >
              <button className={`btn btn-primary`} onClick={handleDownloadAll}>Download All</button>
            </div>

            <div >
              <button className={`btn btn-success ` } onClick={handleupload}>Done</button>
           </div>
         </div>
     </div>
     {/* 我想要使用這個長方形將每一個img都分別包裹起來 並且長方形中會包裹圖片的information  */}
     {/* 並且我希望長方形以及圖片的訊息都是橫向的 長方形的長度佔頁面的橫向70% 寬度像現在的圖片使用的一樣 */}
     {/* 並且長方形的內容 從左到右 分別是 圖片編號(從1開始) , 上傳日期 , 上傳時間 , 是否有標註 , 尺寸 , 圖片預覽  */}
     <div className="mt-3" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
  {/* Horizontal Bar */}
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      width: "100%",
      marginBottom: "10px",
      padding: "10px",
      border: "1px solid black",
    }}
  >
    <p>img id</p>
    <p>labeled</p>
    <p>img height</p>
    <p>img width</p>
    <p>file</p>
  </div>
  {imageFiles.map((file, index) => (
    <div
      key={index}
      className="image-previews-wrapper"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "70%",
        marginBottom: "10px",
        padding: "10px",
        border: "1px solid black",
      }}
    >
      {/* Image and Information */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginRight: "20px",
        }}
      >
        <img
          src={URL.createObjectURL(file)}
          alt={`image ${index}`}
          style={{ width: "100px", height: "120px", marginBottom: "5px" }}
          loading="lazy"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
          }}
        >
          <p>{index + 1}</p>
          <p>No</p>
          <p>{file.height} px</p>
          <p>{file.width} px</p>
          <p>{file.name}</p>
        </div>
      </div>
      {/* Delete Button */}
      <div className="d-flex flex-column align-items-center">
        <button
          className="btn btn-danger"
          onClick={() => {
            // create a new array without the deleted file
            const newFiles = imageFiles.filter((f, i) => i !== index);
            // update the state with the new array
            setImageFiles(newFiles);
          }}
        >
          刪除
        </button>
      </div>
    </div>
  ))}
</div>





     
    </div>
  );
}

export default UploadImg;