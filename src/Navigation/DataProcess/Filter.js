import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InstAI_icon from '../../image/instai_icon.png';
import styles from './Filter.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Filter = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const projectname = searchParams.get('projectname');
  const navigate = useNavigate();
  //const [format , setFormat] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [validFilesCount, setValidFilesCount] = useState(0);
  //const fileInputRef = useRef(null);
  const u = process.env.UPLOAD;
  const c_s = process.env.CONFIRM_STEP;
  useEffect(() => {
    console.log('Selected Files:', selectedFiles.length);
  }, [selectedFiles]);

  const validateSize = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        console.log('Original Width:', img.naturalWidth);
        console.log('Original Height:', img.naturalHeight);
        resolve(img.naturalWidth === 512 && img.naturalHeight === 512);
      };
      img.onerror = function () {
        console.error('Error loading image');
        resolve(false);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (event) => {
    console.log("touch");
    const files = event.target.files;
    console.log('Selected Files:', files);
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const filteredFiles = [...files].filter((file) =>
      allowedFileTypes.includes(file.type)
    );
    console.log('Filtered Files:', filteredFiles);
    const validatedFiles = await Promise.all(
      filteredFiles.map(async (file) => ({
        file,
        isValidSize: await validateSize(file),
      }))
    );

    const validFiles = validatedFiles.filter((file) => file.isValidSize);
    const newSimilarities = validFiles.filter((file) => {
      return (
        !selectedFiles.some(
          (existingFile) => existingFile.name === file.file.name
        ) &&
        !imagePreviews.some(
          (preview) => preview === URL.createObjectURL(file.file)
        )
      );
    });

    if (newSimilarities.length !== validFiles.length) {
      window.alert(
        `Selected ${validFiles.length} valid photos and found ${
          validFiles.length - newSimilarities.length
        } duplicate photos.`
      );
    }

    const updatedSelectedFiles = [...selectedFiles, ...newSimilarities.map((file) => file.file)];
    const updatedImagePreviews = [
      ...imagePreviews,
      ...newSimilarities.map((file) => URL.createObjectURL(file.file)),
    ];

    setSelectedFiles(updatedSelectedFiles);
    setImagePreviews(updatedImagePreviews);
    setValidFilesCount(updatedSelectedFiles.length);
  };
  const formatSize = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        ctx.drawImage(img, 0, 0, 512, 512);
        canvas.toBlob((blob) => {
          const formattedFile = new File([blob], file.name, { type: 'image/jpeg' });
          const previewURL = URL.createObjectURL(formattedFile);
          resolve({ formattedFile, previewURL });
        }, 'image/jpeg');
      };
      img.onerror = function () {
        console.error('Error loading image');
        resolve({ formattedFile: null, previewURL: null });
      };
      img.src = URL.createObjectURL(file);
    });
  };
  
  const handelFormat = async (event) => {
    const files = event.target.files;
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const filteredFiles = [...files].filter((file) =>
      allowedFileTypes.includes(file.type)
    );
  
    const formatedFiles = await Promise.all(
      filteredFiles.map(async (file) => await formatSize(file))
    );
  
    const newFormatFiles = formatedFiles.filter((file) => file.formattedFile !== null);
  
    const updatedSelectedFiles = [...selectedFiles, ...newFormatFiles.map((file) => file.formattedFile)];
    const updatedImagePreviews = [...imagePreviews, ...newFormatFiles.map((file) => file.previewURL)];
    console.log('format success');
    setSelectedFiles(updatedSelectedFiles);
    setImagePreviews(updatedImagePreviews);
    setValidFilesCount(updatedSelectedFiles.length);
  };
  
  
  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([file]));
    a.setAttribute('download', file.name);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteImage = (index) => {
    const updatedFiles = [...selectedFiles];
    const updatedPreviews = [...imagePreviews];

    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setSelectedFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
    setValidFilesCount((prevCount) => prevCount - 1);
  };

  const handleDeleteAllPreviews = () => {
    setImagePreviews([]);
    setSelectedFiles([]);
    setValidFilesCount(0);
  };

  const handleDownloadAll = async () => {
    console.log(`download all ${selectedFiles.length} photos`);
    const allFiles = [...selectedFiles];
    const formattedFiles = await Promise.all(selectedFiles.map(async (file) => await formatSize(file)));
    const newFormatFiles = formattedFiles.filter((file) => file.formattedFile !== null);
    allFiles.push(...newFormatFiles.map((file) => file.formattedFile));

    allFiles.forEach((file, index) => {
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(new Blob([file]));
      a.setAttribute('download', file.name);
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
      const uploaded = [...selectedFiles];
      const formData = new FormData();
      uploaded.forEach((file) => {
        formData.append('file', file);
      });

      try {
        const response = await axios.post(
          `-${u}?username=${id}&projectname=${projectname}`,
          formData
        );
        console.log(response.data);
        alert('upload success');

        const response2 = await axios.post(
          `${c_s}/?step=1&username=${id}&projectname=${projectname}`
        );
        console.log('step updated successfully:', response2.data);
        navigate(`/Step?id=${id}&projectname=${projectname}`);
      } catch (error) {
        console.error('Error sending data to backend:', error);
      }
    }
  };

  
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
          Upload/Download
        </h1>
      </div>

      <div className="row justify-content-between">
        <div className="col-4">
        <label className="btn btn-primary">
          select image
          <input type="file" accept="image/*" multiple name="images" onChange={handleFileSelect} style={{ display: 'none' }} />
        </label>  
        </div>
        <div className="col-4">
        <label className="btn btn-primary">
          Format Images
          <input type="file" accept="image/" multiple name="images" onChange={handelFormat} style={{ display: 'none' }} />
        </label>
        </div>
        <div className="col-4 d-flex  justify-content-end">
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

      <div className={`mt-3 ${styles.downloadDiv}`} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
        {imagePreviews.map((preview, index) => (
          <span key={index} className={styles.imgPreviews} style={{ marginLeft: '10px', marginBottom: '10px', width: 'calc(100% / 11 - 20px)' }}>
             <img
               src={preview}
               alt={`image ${index}`}
               style={{ width: '100px', height: '120px', top: '20px', marginTop: '20px', marginLeft: '20px', marginBottom: '20px' }}
              />
            <div className="d-flex flex-column align-items-center">
               <button className={`btn btn-danger ${styles.downloadDelete}`} onClick={() => handleDeleteImage(index)}>
                 delete
               </button>
              <button className={`btn btn-primary ${styles.downloadSingleImg}`} onClick={() => handleDownload(selectedFiles[index])}>
                 Download
              </button>
           </div>
         </span>
       ))}
      </div>

      
    </div>
  );
};

export default Filter;
