import React, { useState, useEffect } from "react";
import "./Project.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { BounceLoader } from 'react-spinners';
import InstAI_icon from '../../image/instai_icon.png'

function Project() {
  const location = useLocation();
  const userid = location.state;
  const searchParams = new URLSearchParams(location.search);
  const id = localStorage.getItem("userId");
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const [projectList, setProjectList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);
  
  const g_r = process.env.REACT_APP_GET_PROJECT;
  const d_p = process.env.REACT_APP_DELETE_PROJECT;
  const [isLoading, setIsLoading] = useState(false);
  let isMounted = true; // 使用一個標誌來標記組件是否已經 mount 

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // 在發送請求之前，設置isLoading為true
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${g_r}/?username=${type ? id : userid}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
        const combinedProjects = response.data.projectname.map((projectname, index) => ({
          name: projectname,
          desc: response.data.desc[index]
        }));
        setProjectList(combinedProjects);
      } catch (error) {
        if (error.response.status === 403) {
          if (isMounted) {
            isMounted = false; // 在第一次執行後將標誌設置為false，以防止後續執行
            console.error('獲取數據時出錯', error);
            alert("Timed out, please log in again!");
            navigate("/");
          } else {
            console.error('獲取數據時出錯', error);
          }

        } else {
          console.error("An error occurred:", error);
        }
        
      }finally {
        setIsLoading(false); // 在接收到響應或捕獲到錯誤後，設置isLoading為false
      }
    };
    fetchData();
  }, [g_r,id,type,userid]);

  const ProjectCard = ({ project, index, handleDeleteProject, handleNavigate }) => (
    <div className="col-lg-2 col-md-3 mb-4 mt-3 project" key={index}>
      <div className="project-list-grid">
        <h2 className="project-Name">{project.name}</h2>
        <div className="projectNavLink">
          <p className="project-Detial">{project.desc}</p>
        </div>
        <div className="project-Delete">
          <button className="btn deleteButton" onClick={() => handleDeleteProject(index)}>刪除專案</button>
        </div>
        <div className="project-Nav" style={{ marginLeft: '110px' }}>
          <button className="btn deleteButton" onClick={() => handleNavigate(project.name)}>進入專案</button>
        </div> 
      </div>
    </div>
  );
  
  const Loading = () => (
    <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <BounceLoader color={'black'} loading={isLoading} size={120} /> 
    </div>
  );
  
  const handleDeleteProject = async (index) => {
    const confirmDelete = window.confirm("確定要刪除專案?");
    if (!confirmDelete) {
      return;
    }

    const updatedProjects = [...projectList];
    const deletedProject = updatedProjects.splice(index, 1)[0];
    setProjectList(updatedProjects);

    try {
      //console.log(deletedProject.name);
      const token = localStorage.getItem("jwtToken");
      const response = await axios.post(
        `${d_p}/?username=${type ? id : userid}`,
        { 
          projectName: deletedProject.name
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      //後續改用redux-persist做state dispatch
      localStorage.setItem(`firstPage_${type ? id : userid}_${deletedProject}`, 'false');
      localStorage.setItem(`secondPage_${type ? id : userid}_${deletedProject}`, 'false');
      localStorage.setItem(`confirmStatusImg_${type ? id : userid}_${deletedProject}`, 'false');
      localStorage.setItem(`confirmStatusReq_${type ? id : userid}_${deletedProject}`, 'false');
      // 
      alert(response.data);
      console.log(response);
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  const handleNavigate = (projectName) => {
    navigate(`/Step?project=${projectName}`);
  }
  const handleLogout = () => {
    //setShowLogoutPrompt(true);
    const confirmlogout = window.confirm("確定要登出嗎？");
    if (!confirmlogout) {
      return;
    }
    localStorage.setItem('jwtToken',false);
    console.log('註銷token');
    //alert('註銷token');
    const token = localStorage.getItem('jwtToken');
    console.log(token);
    navigate("/"); // Redirect to the home page
  };

  const handleConfirmLogout = () => {
    setShowLogoutPrompt(false);
    navigate("/"); // Redirect to the home page
  };

  const handleCancelLogout = () => {
    setShowLogoutPrompt(false);
  };

  const filteredProjects = projectList.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (

  
    <div className="container-fluid mt-3">

    <div className="row d-flex justify-content-between " >
      <div className="col-auto"> 
        <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
      </div>
      <div className="col-auto mt-4"> 
        <button  className="btn  logoutButton" onClick={handleLogout}>登出</button>
      </div>
      <div className="custom-border">

      </div>
    </div>

    <div className="row">
      <div className="col-12">
        <h1 className="mt-3" style={{fontWeight:'bold'}}>Projects</h1>
      </div>
    </div>

    <div className="row d-flex justify-content-between">
      <div className="col-auto">
       <input 
        className="form-control "
        type="text"
        placeholder="搜尋專案"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

    <div className="col-auto">
       <NavLink to={`/CreateProjectPage`}>
          <button className="btn add-project-button">新增專案</button>
       </NavLink>
    </div>
    </div>

    <div className="row ml-3" style={{ marginLeft: 3 }}>
    {isLoading ? <Loading /> : filteredProjects.map((project, index) => <ProjectCard project={project} index={index} handleDeleteProject={handleDeleteProject} handleNavigate={handleNavigate} />)}
  </div>
    {showLogoutPrompt && (
      <div className="logout-prompt">
        <p>確定要登出嗎？</p>
        <button onClick={handleConfirmLogout}>確定</button>
        <button onClick={handleCancelLogout}>取消</button>
      </div>
    )}
  </div>
  );
}

export default Project;