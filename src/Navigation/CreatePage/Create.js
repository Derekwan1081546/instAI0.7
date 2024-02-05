import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Create.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import InstAI_icon from '../../image/instai_icon.png';

function Create() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const add_p = process.env.ADD_PROJECT;
  const [formData, setFormData] = useState({
    projectName: "",
    devices: [],
  });

  const handleFormDataChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));

    console.log(`Field ${fieldName} updated to:`, value);
  };

  const addProject = async () => {
    if (formData.projectName.trim() === "") {
      alert("請輸入專案名稱");
    } else {
      console.log("Form submitted:", formData);
      try {
        const response = await axios.post(
          `${add_p}?username=${id}`,
          { projectName: formData.projectName.trim() }
        );
        alert(response.data);
        handleFormDataChange("projectName", "");
        console.log(response);

        // 導航回去
        navigate(`/Project?id=${id}&type=1`);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
    }
  };

  const enterSolve = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 避免預設跳轉
      await addProject(); // non-blocking statement
    }
  };

  return (
    <div className="container-fluid mt-3">
      
    <div  className="row d-flex justify-content-between ">
        <div className="col-auto"> 
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>

        <div className="col-auto mt-4"> 
          <NavLink to={`/Project?id=${id}&type=1`} className="projectPageLink">
          <button className="btn projectPageButton">返回專案頁面</button>
        </NavLink>
        </div>
        <div className="custom-border"></div>
    </div>
    


    <div className="card col-xl-5  create-form" style={{height:550}}>
      <form onSubmit={(e) => e.preventDefault()} >
        <div>
          <h1 className="display-4  text-center create-title" style={{fontWeight:'bold'}}>Create Projects</h1>
        </div>
        <div className="createProjectName">
          <label className="form-label fs-6">專案名稱：</label>
          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={(e) => handleFormDataChange("projectName", e.target.value)}
            onKeyDown={enterSolve}
            className="form-control fs-6"
          />
        </div>

        <button className="btn createButton" type="button" onClick={addProject}>
          新增專案
        </button>
      </form>
    </div>
  </div>
  );
}

export default Create;
