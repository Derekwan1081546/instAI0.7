import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Card, Container, Row, Col, Button } from "react-bootstrap";
import InstAI_icon from "../../image/instai_icon.png";
import { BounceLoader } from "react-spinners";
import axios from "axios";

const ImageDisplay = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const p = process.env;
  const imgComplete = p.REACT_APP_PROCESS_PROMPT; //resened prompt to sd for img generation 
  const id = localStorage.getItem("userId");
  const [images, setImages] = useState([]);
  const base64Data = location.state?.base64Data ?? "";
  const promptData = location.state?.formData ?? "";
  
  useEffect(() =>{
    setLoading(false);
  },[base64Data])
  useEffect(()=>{
    setLoading(true);
  },[resendPromptData])
  const resendPromptData = () =>{
     const confirmed = window.confirm("確定要重新產生圖片嗎");
     if(confirmed){
        
        const postSDimg = async() =>{
          setLoading(true);
          try{
            const token = localStorage.getItem("jwtToken");
            const response = await axios.post(`${imgComplete}`,promptData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
                    }
            });
            console.log(response.data); // 這邊應該會是base64的圖片字串
            const newBase64Data = response.data;
            setImages(prevImages => {
              // 在這裡，prevImages 是上一次 render 時的狀態
              // 我們將其與新的 base64Data 結合，產生新的圖集
              return [...prevImages, ...newBase64Data];
            });
            setLoading(false);

            }catch (error){
            console.error("Error sending data to backend:", error);
            }
            
        }
        postSDimg();
     }
     else{
            return;
     }
  
  const downloadSingleImage = (base64, index) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = `image_${index + 1}.jpg`;
    link.click();
  };
  return (
    <div style={{ backgroundColor: 'white' }}>
      <Navbar style={{ backgroundColor: 'WHITE', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <Nav className="mr-auto" style={{ marginLeft: "10px" }}>
        <div className="col-auto mt-4"> 
          <NavLink to={`/PromptInputPage`} className="PromptInputPageLink">
            <button className="btn PromptInputPageButton" style={{ marginLeft: "10px", fontFamily: 'Lato' }}>
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
      {loading ? (
        <div className="loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <BounceLoader color={'#black'} size={120} />
        </div>
      ) : (
        <Container>
          <Row>
          {images.map((base64, index) => (
            <Col sm={6} md={4} lg={3} key={index} style={{ marginTop: '20px' }}>
              <Card className="mb-4">
                {`data:image/png;base64,${base64}` ? (
                  <Card.Img variant="top" src={`data:image/png;base64,${base64}`} />
                ) : (
                  <p>Error loading image</p>
                )}
                <Card.Body>
                  <Button variant="primary" onClick={() => downloadSingleImage(`data:image/png;base64,${base64}`, index)}>下載</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
             <Card className>
              <Card.Body className="d-flex justify-content-center">
              <Button variant="secondary" style={{ width: '30%',height:'40px', marginLeft: "10px" }}onClick={resendPromptData}>try again (3 attempts left)</Button>
              <Button style={{ width: '30%', height:'40px',backgroundColor: 'blueviolet', borderColor: 'blueviolet', marginLeft: "10px" }}>use 20 img for model training</Button>
             </Card.Body>
             </Card> 
          </Row>
        </Container>
      )}
    </div>
  );
 }
};
export default ImageDisplay;