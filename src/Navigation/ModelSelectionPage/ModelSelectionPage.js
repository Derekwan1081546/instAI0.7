import React,{useState,useEffect} from "react";
import {useLocation,NavLink } from "react-router-dom";
import axios from "axios"
import InstAI_icon from "../../image/instai_icon.png";
import { Navbar, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';
import yolov3Tiny from "../../image/yoloV3_tiny-m.jpg";
import yolov3Spp from "../../image/SPP-module-YOLOv3.png";
import yoloV3 from '../../image/yoloV3.jpg';
import yoloV5 from "../../image/yoloV5.jpg";
import yolov7 from "../../image/yoloV7.jpg";
import yolov8 from "../../image/yoloV8.jpg";

export default function ModelStyle(){
    const location = useLocation();
    const id = localStorage.getItem("userId");
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const p = process.env;
    const modelSelect = p.REACT_APP_MODEL_SELECT;
    const modelInformation = p.REACT_APP_MODEL_INFORMATION;
    const [models, setModels] = useState({
        model1: { title: 'Yolo v3 tiny', content: 'This is a lightweight object detection model suitable for running on devices with limited computational resources. Due to its simple structure, it requires relatively fewer images for training.',
        img : yolov3Tiny, link :'/PromptInputPage' },
        model2: { title: 'Yolo v3 spp', content: 'This model incorporates Spatial Pyramid Pooling (SPP) structure on top of YOLOv3, allowing it to extract richer features. It performs better in detecting objects with significant variations in size.',
        img : yolov3Spp ,link : '/PromptInputPage'},
        model3: { title: 'Yolo v3', content: 'This is a commonly used object detection model utilizing the architecture of darknet-53, consisting of 53 layers of convolutional neural networks.' ,
        img :yoloV3 , link : '/PromptInputPage'},
        model4: { title: 'Yolo v5', content: 'This model has made improvements upon YOLOv4 to enhance both detection accuracy and speed. For training, each class requires at least 250 to 300 annotated samples to train a relatively good model.' ,
        img:yoloV5 , link : '/PromptInputPage'},
        model5: { title: 'Yolo v7', content: "YOLOv7 is an advanced real-time object detector that surpasses all known object detectors in both speed and accuracy within the range of 5 FPS to 160 FPS. It has been optimized in both model architecture and training process. YOLOv7 reduces the parameter count by 40% and computational workload by 50% compared to today's real-time object detection models." ,
        img:yolov7 , link : '/PromptInputPage'},
        model6: { title: 'Yolo v8', content: "This model might be the latest version in the YOLO series. For training, if the dataset is small (a few hundred images), it's recommended to use yolov8n or yolov8s. Oversized models may lead to overfitting. For medium-sized datasets (a few thousand images), yolov8s or yolov8m could be considered." ,
        img:yolov8 , link : '/PromptInputPage'},
      });
  
    useEffect(()=>{
        const fetchData = async() =>{
         try{
          const token = localStorage.getItem("jwtToken");
          const response = await axios.get(`${modelInformation}${id}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          console.log(response.data);
         }catch (error){
    
        }
        };
        fetchData();
        },[]);
        

      const handleModelClick = (modelKey) => {
        // 記錄數值
        const value = modelKey; // 設定使用甚麼model
        console.log(value);
        const formData = new FormData();
        formData.append('modelKey', modelKey);
        formData.append('value', value);
        const response = async() =>{
          try{
           const token = localStorage.getItem("jwtToken");
           const response = await axios.post(`${modelSelect}${id}`,formData, {
             headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
             }
           });
           console.log(response.data);
          }catch (error){
            console.error("Error sending data to backend:", error);
         }
         console.log(response.data);
      }};
        return (
            <div style={{ backgroundColor: 'white' }}>
              <Navbar style={{ backgroundColor: 'WHITE',boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                <Nav className="mr-auto" style={{marginLeft:"10px"}}>
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
                <Row className="justify-content-around">
                 {Object.keys(models).map(modelKey => (
                  <Col md={4} className="mb-4">
                    <div style={{ cursor: 'pointer' }} onClick={() => handleModelClick(models[modelKey].title)}> 
                  <Card>
                    {/* <NavLink to = {models[modelKey].link}> */}
                    <Card.Img variant="top" src={models[modelKey].img} loading="lazy" style={{width:'250px',height:'150px'}} />
                 <Card.Body>
                  <NavLink to={models[modelKey].link}><Card.Title>{models[modelKey].title}</Card.Title></NavLink>
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