import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios"
import InstAI_icon from "../../image/instai_icon.png";
import { Navbar, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';
import yolov3Tiny from "../../image/yoloV3_tiny-m.jpg";
import yolov3Spp from "../../image/SPP-module-YOLOv3.png";
import yoloV3 from '../../image/yoloV3.jpg';
import yoloV5 from "../../image/yoloV5.jpg";
import yolov7 from "../../image/yoloV7.jpg";
import yolov8 from "../../image/yoloV8.jpg";

export default function ModelStyle() {
  const location = useLocation();
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const p = process.env;
  const modelSelect = p.REACT_APP_MODEL_SELECT;
  const modelInformation = p.REACT_APP_MODEL_INFORMATION;
  const [models, setModels] = useState({
    model1: {
      title: 'Default Style', 
      modelName :'v1-5-pruned-emaonly.safetensors [6ce0161689]',
      content: 'This is the default model on Stable diffusion',
      img: yolov3Tiny, link: '/PromptInputPage'
    },
    model2: {
      title: 'Anime Style',
      modelName : 'VTBCkpt_v10.safetensors [85d06f5f3d]',
      content: 'This is a model for generate Anime style imgs',
      img: yolov3Spp, link: '/PromptInputPage'
    },
    model3: {
      title: 'Pixart_Style', 
      modelName : 'model.safetensors [a54ec249cb]',
      content: 'This is a model for Pixart style ',
      img: yoloV3, link: '/PromptInputPage'
    },
    model4: {
      title: 'Realisitic Style',
      modelName : 'realisticVisionV60B1_v51VAE.safetensors [ef76aa2332]',
      content: 'This is a model for realistic human style.',
      img: yoloV5, link: '/PromptInputPage'
    },

  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${modelInformation}${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data);
      } catch (error) {

      }
    };
    fetchData();
  }, []);

  const handleModelSelect =(modelKey) =>{
    const model =models[modelKey].modelName
    navigate(`/PromptInputPage`,{ state: { model} });
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
        const response = await axios.post(`${modelSelect}${id}`, formData, {
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
            <NavLink to={`/CreateProjectPage`} className="CreateProjectPageLink">
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
            
            <Col md={4} className="mb-4">
              <div style={{ cursor: 'pointer' }} onClick={() => handleModelClick(models[modelKey].title)}>
                <Card>
                  {/* <NavLink to = {models[modelKey].link}> */}
                  <Card.Img variant="top" src={models[modelKey].img} loading="lazy" style={{ width: '250px', height: '150px' }} />
                  <Card.Body>
                  
                  <Button onClick={() => handleModelSelect(modelKey)}>
                  {models[modelKey].title}
                  </Button>
                    {/* <NavLink to={{ pathname: models[modelKey].link, state: { model: models[modelKey].title } }}>
                      <Card.Title>{models[modelKey].title}</Card.Title>
                    </NavLink> */}
                    <Card.Text>{models[modelKey].content}</Card.Text>
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