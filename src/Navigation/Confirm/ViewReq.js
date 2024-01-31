import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './ConfirmSTR.css'; 
import InstAI_icon from '../../image/instai_icon.png';

function ViewReq() {
  const [reqData, setReqData] = useState({});
  const location = useLocation();
  const [editable, setEditable] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const projectname = searchParams.get('projectname');
  const id = searchParams.get('id');
  const navigate = useNavigate();
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
    fetchData();
  }, [id, projectname]);

  const handleGoBack = () => {
    console.log("已經檢查需求");
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
              <h5 className="mt-5" style={{fontWeight:'bold'}}>Question 1: <br></br>{reqData.Requirement1.question}</h5>
              <p >
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
            <div className='mt-5' >
              <h5 className="mt-3" style={{fontWeight:'bold'}}>Question 2: <br></br>{reqData.Requirement2.question}</h5>
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

        <div className="container mt-5">
        <div className="row">
          <div className="col-md-12 d-flex justify-content-end ">
             <button onClick={handleGoBack} className='btn viewButton'>Go Back</button>
           </div>
            </div>
         </div>

        </div>      



   
    </div>
  );
}

export default ViewReq;
