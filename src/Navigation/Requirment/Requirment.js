import React, { useState, useEffect } from "react";
import axios from "axios";
import Prompt from "../../Components/Prompt/Prompt2";
import { useNavigate, useLocation } from "react-router-dom";
import "./Requirment.css";
import InstAI_icon from "../../image/instai_icon.png";
//import ReviewReq from "../Review/ReviewReq";

function Requirement() {
  const [reqData, setReqData] = useState({
    Requirement1: {
      question: "What is the type of location/environment that the AI model will be used?",
      answer: "1561561561566165156",
    },
    Requirement2: {
      question: "What is the type of location/environment that the AI model will be used?",
      answer: "",
    },
    ID: "",
    author: "",
    LastUpdated: "",
  });
  const navigate = useNavigate();
  //const [ReqPreviews, setReqPreviews] = useState([]);
  const [linktostep, setlinktostep] = useState(false);
  const [isDataChecked, setIsDataChecked] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const projectname = searchParams.get("projectname");
  const u_r = process.env.UPLOAD_REQUIREMENT;
  const c_s = process.env.CONFIRM_STEP;
  // Set initial values for ID, author, and LastUpdated
  useEffect(() => {
    setReqData((prevData) => ({
      ...prevData,
      ID: projectname || "default_id",
      author: id || "default_user_id", 
      LastUpdated: new Date().toLocaleString(),
    }));
  }, [id]);

  const handleFormDataChange = (fieldName, value) => {
    setReqData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
    if (fieldName !== "") {
      setlinktostep(true);
    }
    console.log(`Field ${fieldName} updated to:`, value);
  };

  const handleGenerateClick = async () => {
    const answer1Length = reqData.Requirement1.answer.trim().length;
    const answer2Length = reqData.Requirement2.answer.trim().length;
    // 增加字數限制 必須超過100字
    //if (answer1Length < 100 || answer2Length < 100) {
    //  alert("Answers cannot less than 100 characters ! please give detailed description.");
    //} 
   if (answer1Length === 0 || answer2Length === 0) {
      alert("Please answer both questions.");
    } else {
      const confirmed = window.confirm(
        `Are you sure you want to submit?\n\nData to be submitted:\n${JSON.stringify(
          reqData,
          null,
          2
        )}`
      );
      if (confirmed) {
        setIsDataChecked(true);
      }
    }
  };

  const handleSendData = async () => {
    const requestData = {
      method: "POST",
      request: reqData,
      response: {
        message: "傳輸成功",
      },
    };
    try {
      const response = await axios.post(
        `${u_r}/?username=${id}&projectname=${projectname}`,
        requestData
      );
      console.log("server response:", response.data);
      const response2 = await axios.post(
        `${c_s}/?step=2&username=${id}&projectname=${projectname}`
      );
      console.log('step updated successfully:', response2.data);
      alert("Requirement submitted successfully!");
      // Reset form data
      setReqData({
        Requirement1: {
          question: "What is the type of location/environment that the AI model will be used?",
          answer: "",
        },
        Requirement2: {
          question: "What is the main purpose for this AI model?",
          answer: "",
        },
        ID: "",
        author: "",
        LastUpdated: "",
      });
      setlinktostep(false);
      setIsDataChecked(false);
      localStorage.setItem(`secondPage_${id}_${projectname}`, 'true');
      //navigate 
      navigate(`/Step?id=${id}&project=${projectname}`);
    } catch (error) {
      console.error("Submission failed:", error);
      if (error.response) {
        alert(`Submission failed, status code: ${error.response.status}`);
      } else {
        alert("Submission failed. Check network connection or try again later.");
      }
    }
  };

  return (
    <div className="container-fluid mt-3">

    <div  className="row d-flex justify-content-between ">
        <div className="col-auto"> 
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>
        <div className="custom-border"></div>
    </div>

    <div className="card col-xl-5  requirement-form" style={{height:700}}>
        <div>
          <h1 className="display-4 mt-1 mb-5 text-center create-title" style={{fontWeight:'bold'}}>Requirement</h1>
        </div>
    
    <h3 className="mt-4" style={{fontWeight:'bold'}}>Question1</h3>
    <p className="mt-2">What is the type of location/environment that the AI model will be used?</p>
        <div className="prompt">
          <Prompt
            text={reqData.Requirement1.question}
            value={reqData.Requirement1.answer}
            onChange={(value) => handleFormDataChange("Requirement1", { ...reqData.Requirement1, answer: value })}
          />
        </div>

    <h3 className="mt-3" style={{fontWeight:'bold'}}>Question2</h3>
    <p className="mt-2">What is the main purpose for this AI model?</p>
        <div className="prompt">
          <Prompt
            text={reqData.Requirement2.question}
            value={reqData.Requirement2.answer}
            onChange={(value) => handleFormDataChange("Requirement2", { ...reqData.Requirement2, answer: value })}
          />
        </div>

        <div className="container mt-5">
        <div className="row">
          <div className="col-md-12 d-flex justify-content-end ">
            {isDataChecked ? (
             <>
             {/* {linktostep ? (
            <NavLink to={`/Step?id=${id}&project=${projectname}`}>
              <button onClick={handleSendData} className="btn submitButton">
                Submit
              </button>
            </NavLink>
               ) : (
            <button onClick={handleSendData} className="btn submitButton">
              Submit
            </button>
             )} */}
             <button onClick={handleSendData} className="btn submitButton">
              Submit
            </button>
        </>
             ) : (
              <button onClick={handleGenerateClick} className="btn submitButton">
               Generate and Check
              </button>
             )}
           </div>
            </div>
         </div>

      </div>

  
    </div>
  );
}

export default Requirement;
