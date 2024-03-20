import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const imgComplete = p.REACT_APP_IMG_SD;
  const id = localStorage.getItem("userId");

  useEffect(() =>{
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await axios.get(`${imgComplete}?username=${id}`, {
          headers: {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data.images);
        setLoading(!loading);
        setImagePreviews(response.data.images);
      } catch (error) {
        console.error('Error fetching image previews:', error);
      }
    };
    fetchData()
  })

  const handleBack = () => {
    navigate('/PromptInputPage');
  }
  
  return (
    <div style={{ backgroundColor: 'white' }}>
      <Navbar style={{ backgroundColor: 'WHITE', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <Nav className="mr-auto" style={{ marginLeft: "10px" }}>
          <h3>Back</h3>
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
            {/* 其他內容 */}
          </Row>
        </Container>
      )}
    </div>
  );
  
  
};

export default ImageDisplay;
