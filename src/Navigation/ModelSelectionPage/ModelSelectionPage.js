import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios"
import InstAI_icon from "../../image/instai_icon.png";
import { Navbar, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';

import  default_style from "../../image/default_model.png";
import anime_style from "../../image/Anime_model.png";
import pixart_style from "../../image/Pixart_model.png";
import realistic_style from "../../image/realistic_model.png";

export default function ModelStyle() {
  const location = useLocation();
  
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const p = process.env;
  const modelSelect = p.REACT_APP_MODEL_SELECT;
  const modelInformation = p.REACT_APP_MODEL_INFORMATION;

  const projectname_confirm1 = location.state?.projectname_confirm1??'';
  const projectName_process2 = location.state?.projectName_process2??'';
  console.log("state is ",projectname_confirm1 ,"", projectName_process2);
 
  const [models, setModels] = useState({
    model1: {
      title: 'Default Style', 
      modelName :'v1-5-pruned-emaonly.safetensors [6ce0161689]',
      content: 'This is the default model on Stable diffusion',
      img: default_style, link: '/PromptInputPage'
    },
    model2: {
      title: 'Anime Style',
      modelName : 'animagineXLV31_v31.safetensors [e3c47aedb0]',
      content: 'This is a model for generate Anime style imgs',
      img: anime_style, link: '/PromptInputPage'
    },
    model3: {
      title: 'Pixart_Style', 
      modelName : 'model.safetensors [a54ec249cb]',
      content: "This is a model for Pixart style,it's colot is only black and white ",
      img: pixart_style, link: '/PromptInputPage'
    },
    model4: {
      title: 'Realisitic Style',
      modelName : 'realisticVisionV60B1_v51VAE.safetensors [ef76aa2332]',
      content: 'This is a model for realistic human style.',
      img: realistic_style, link: '/PromptInputPage'
    },

  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${modelInformation}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
        //setModels(response.data);
      } catch (error) {

      }
    };
    fetchData();
  }, []);

  const handleModelSelect =(modelKey) =>{
    const model =models[modelKey].modelName
    //跳轉並抓取projectname1 || 2
    navigate(`/PromptInputPage`,{ state: { model ,projectname_confirm1 ,projectName_process2 } });
  }

  const handleModelClick = (modelKey) => {
    // 記錄數值
    
    const value = modelKey; // 設定使用甚麼model
    console.log(value);
    const formData = new FormData();
    formData.append('modelKey', modelKey);
    formData.append('value', value);
    const response = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.post(`${modelSelect}`, formData, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${token}`
          }
        });
        console.log(response.data);
      } catch (error) {
        console.error("Error sending data to backend:", error);
      }
      console.log(response.data);
    }
  };
  return (
    <div style={{ backgroundColor: 'white' }}>
      <Navbar style={{ backgroundColor: 'WHITE', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <Nav className="mr-auto" style={{ marginLeft: "10px" }}>
          <div className="col-auto mt-4">
            <NavLink to={`/Project?&type=1`} className="CreateProjectPageLink">
              <button className="btn createprojectPageButton" style={{ marginLeft: "10px", fontFamily: 'Lato' }}>
                <h3 style={{ marginLeft: "10px" }}>←Back</h3>
              </button>
            </NavLink>
          </div>
          {/* <h3>Back</h3> */}
        </Nav>
        <Navbar.Brand href="#home" className="mx-auto">
          <img
            src={InstAI_icon}
            width="60"
            height="60"
            className="d-inline-block align-top"
            alt="InstAI logo"
          />
          {' '}InstAI
        </Navbar.Brand>
      </Navbar>
      <Container className="d-flex flex-column justify-content-center" style={{ minHeight: '60vh', maxWidth: '80rem', margin: '50px auto', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
        <h2 className="text-center mb-4" style={{ marginLeft: "10px", fontFamily: 'Lato', fontStyle: 'normal' }}>What’s the image style for your AI model?</h2>
        <Row className="justify-content-start">
          {Object.keys(models).map(modelKey => (
            
            <Col md={3} className="mb-4">
              <div style={{ cursor: 'pointer' }} onClick={() => handleModelClick(models[modelKey].title)}>
                <Card  >
                  {/* <NavLink to = {models[modelKey].link}> */}
                  <Card.Img variant="top" src={models[modelKey].img} loading="lazy" style={{ width: '100%', height: '75%' }} />
                  <Card.Body>
                  
                  <div className="d-flex justify-content-center" style={{ margin: 'auto'}}>
                   <Button style={{width:'80%', backgroundColor:'black'}} onClick={() => handleModelSelect(modelKey)}>
                   {models[modelKey].title}
                   </Button>
                   </div>
                    {/* <NavLink to={{ pathname: models[modelKey].link, state: { model: models[modelKey].title } }}>
                      <Card.Title>{models[modelKey].title}</Card.Title>
                    </NavLink> */}
                    <Card.Text style={{marginTop:'10px'}}>{models[modelKey].content}</Card.Text>
                  </Card.Body>
                  {/* </NavLink> */}
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}