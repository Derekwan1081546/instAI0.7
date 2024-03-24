import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Card, Container, Row, Col, Button } from "react-bootstrap";
import InstAI_icon from "../../image/instai_icon.png";
import { BounceLoader } from "react-spinners";

const ImageDisplay = () => {
  const [images, setImages] = useState([]);
  const [dataURL,seturl] = useState([])
  const [error, setError] = useState(null);
  const location = useLocation();
  const base64Data = location.state?.base64Data;
  const navigate = useNavigate();
  const id = localStorage.getItem("userId");

  useEffect(()=>{
    try{
      const dataURL = `data:image/png;base64,${base64Data}`;
      seturl(dataURL);
      setImages(base64Data);
      setError(null);
    }catch(error){
      console.error("Error sending data to backend:", error);
    }
  },[base64Data])

  const downloadSingleImage = (base64, index) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = `image_${index + 1}.jpg`;
    link.click();
  };

  const handleBack = () => {
    navigate('/PromptInputPage');
  }
  
  return(
    <div style={{backgroundColor:'white'}}>
     <Navbar bg="white" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
    <Nav className="mr-auto">
    <Nav className="mr-auto" style={{marginLeft:"10px"}}>
         <h3 onClick={handleBack}>Back</h3>
        </Nav>
    </Nav>
    <Navbar.Brand href="#home" className="mx-auto">
      <img
        src={InstAI_icon} 
        width="60"
        height="60"
        className="d-inline-block align-top"
        alt="InstAI logo"
      />
      InstAI
    </Navbar.Brand>
  </Navbar>
  <Container className="d-flex flex-column justify-content-center" style={{ minHeight: '60vh', maxWidth: '50rem', margin: '50px auto', backgroundColor: 'white', 
      borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
      {images.map((base64, index) => (
        <span key={index} className="image-item">
          {`data:image/png;base64,${base64}` ? ( // Check if dataURL is not empty
            <img src={`data:image/png;base64,${base64}`} alt={`Image ${index}`} loading="lazy" />
          ) : (
            <p>Error loading image</p>
          )}
          <button onClick={() => downloadSingleImage(`data:image/png;base64,${base64}`, index)}>下載</button>
        </span>
      ))}
      </Container>
    </div>
    

  
  )
  
};

export default ImageDisplay;
