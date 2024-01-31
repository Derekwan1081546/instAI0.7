import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ConfirmSTR.css'; 
import InstAI_icon from '../../image/instai_icon.png';

function ConfirmReq() {
  const [reqData, setReqData] = useState({});
  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const projectname = searchParams.get('projectname');
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(JSON.parse(localStorage.getItem(`confirmStatusReq_${id}_${projectname}`) || 'false'));

  console.log('Initial confirmed value:', confirmed);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/upload/getrequirement/?username=${id}&projectname=${projectname}`
      );
      const responseData = response.data.content;
      const parsedData = {};
      responseData.forEach(item => {
        const parsedItem = JSON.parse(`{${item}}`);
        Object.assign(parsedData, parsedItem);
      });
      setReqData(parsedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem(`confirmStatusReq_${id}_${projectname}`, confirmed.toString());
    fetchData();
  }, [id, projectname]);

  const handleSaveButtonClick = async () => {
    const updatedData = {
      Requirement1: {
        question: reqData.Requirement1.question,
        answer: editable ? document.getElementById('editedAnswer1').innerText : reqData.Requirement1.answer,
      },
      Requirement2: {
        question: reqData.Requirement2.question,
        answer: editable ? document.getElementById('editedAnswer2').innerText : reqData.Requirement2.answer,
      },
      ID: id,
      author: '',
      LastUpdated: new Date().toLocaleString(),
    };
    const requestData = {
      method: "POST",
      request: updatedData,
      response: {
        message: "傳輸成功",
      },
    };
    try { 
      const response = await axios.post(
        `http://localhost:8080/api/upload/requirement/?username=${id}&projectname=${projectname}`,
        requestData
      );

      console.log('Data updated successfully:', response.data);

      fetchData();
      try {
        const response = await axios.get(
          `http://localhost:8080/api/upload/getrequirement/?username=${id}&projectname=${projectname}`
        );
        const responseData = response.data.content;
        const parsedData = {};
        responseData.forEach(item => {
          const parsedItem = JSON.parse(`{${item}}`);
          Object.assign(parsedData, parsedItem);
        });
        setReqData(parsedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setEditable(false);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleConfirmButtonClick = () => {
    console.log('handleConfirmButtonClick triggered');
    //const confirmeState = window.confirm("do you want to change confirm state");
  
    // if (confirmeState) {
    //   if(confirmed){
    //     console.log("取消確認狀態");
    //     handleCancelConfirmation();
    //   }
    //   else{
    //     console.log("確認狀態");
    //     handleConfirmRequirement();
    //   }
    // } else {
    //   console.log("取消變更");
    //   return;
    // }
    if(confirmed){
      console.log("取消確認狀態");
      handleCancelConfirmation();
    }
    else{
      console.log("確認狀態");
      handleConfirmRequirement();
    }
  };
  
  const handleCancelConfirmation = () => {
  const userConfirmed = window.confirm('Are you sure you want to cancel the confirmation?');
  if (userConfirmed) {
    localStorage.setItem(`confirmStatusReq_${id}_${projectname}`, 'false');
    setConfirmed(false);
  }
};

const handleConfirmRequirement = () => {
  const userConfirmed = window.confirm('Are you sure you want to confirm the requirement?');
  if (userConfirmed) {
    localStorage.setItem(`confirmStatusReq_${id}_${projectname}`, 'true');
    setConfirmed(true);
  }
};

  const handleGoBack = async() => {
    if (!confirmed) {
      const userConfirmed = window.confirm('You have not confirmed the requirement. Are you sure you want to go back?');
      if (!userConfirmed) {
        return; 
      }
    }

    if (confirmed) {
      const response = await axios.post(
        `http://localhost:8080/api/project/confirmstep/?step=3&username=${id}&projectname=${projectname}`
      );
      console.log('step updated successfully:', response.data);
      window.alert('See your model later');
    }

    navigate(`/Step?id=${id}&project=${projectname}`);
  };

  return (
    // <div className="review-container">
    <div className="container-fluid mt-3">

      <div  className="row d-flex justify-content-between ">
        <div className="col-auto"> 
          <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" style={{ width: '76.8px', height: '76.8px' }} ></img>
        </div>
        <div className="custom-border"></div>
      </div>


      <div className="card col-xl-5  view-form" style={{height:600}}>
        
         <div>
          <h1 className="display-5  mb-5 text-center create-title" style={{fontWeight:'bold'}}>Requirement Preview</h1>
        </div>
      
        {reqData.Requirement1 && (
            <div >
              <h5 className="mt-5" style={{fontWeight:'bold'}}>Question 1: <br></br> {reqData.Requirement1.question}</h5>
              <p>
                Answer 1:{' '}
                {editable ? (
                  <span
                    id="editedAnswer1"
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: reqData.Requirement1.answer }}
                  ></span>
                ) : (
                  reqData.Requirement1.answer
                )}
              </p>
            </div>
          )}

          {reqData.Requirement2 && (
            <div className="question-answer">
              <h5 className="mt-5" style={{fontWeight:'bold'}}>Question 2: <br></br> {reqData.Requirement2.question}</h5>
              <p>
                Answer 2:{' '}
                {editable ? (
                  <span
                    id="editedAnswer2"
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: reqData.Requirement2.answer }}
                  ></span>
                ) : (
                  reqData.Requirement2.answer
                )}
              </p>
            </div>
          )}


          <div className=" d-flex mt-2 mb-3 justify-content-center ">
          <button className='btn mr-1 btn-danger' onClick={handleConfirmButtonClick} style={{ backgroundColor: confirmed ? 'green' : '' }} disabled={confirmed ? true : false}>
        {confirmed ? 'Requirement is already confirmed' : 'Requirement is not confirmed'}
          </button>
            </div>

            <div className=" d-flex mt-5 justify-content-end ">
          {!confirmed ? <button className='btn btn-warning' onClick={() => setEditable(!editable)}>{editable ? 'Cancel Edit' : 'Edit'}</button> : <></>}
          {editable && <button className='btn btn-success' onClick={handleSaveButtonClick}>Save Edition</button>}
          <button className='btn confirmButton' onClick={handleGoBack}>Go Back</button>
            </div>

        
      </div>

    </div>
  );
}

export default ConfirmReq;
