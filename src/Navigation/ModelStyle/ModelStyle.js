import React,{useState,useEffect} from "react";
import { useNavigate,useLocation } from "react-router-dom";
import axios from "axios"
import InstAI_icon from "../../image/instai_icon.png";
import { Navbar, Nav, Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function ModelStyle(){
    const location = useLocation();
    const navigate = useNavigate();
    const id = localStorage.getItem("userId");
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const p = process.env;
    useEffect(()=>{
        const fetchData = async() =>{
         try{
          const token = localStorage.getItem("jwtToken");
          const response = await axios.get(``, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
        //   從後端讀取有甚麼照片風格 ? 
          console.log(response.data);
         }catch (error){
    
        }
        };
        fetchData();
        },[]);
        // logic area 


        return (
            <div style={{ backgroundColor: 'white' }}>
              <Navbar style={{ backgroundColor: 'WHITE',boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                <Nav className="mr-auto" style={{marginLeft:"10px"}}>
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
              <Container className="d-flex flex-column justify-content-center" style={{ minHeight: '60vh', maxWidth: '50rem', margin: '50px auto', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
                <h2 className="text-center mb-4">What’s the image style for your AI model?</h2>
                <Row className="justify-content-around">
                  {Array.from({ length: 6 }, (_, i) => (
                    <Col md={4} className="mb-4">
                      <Card>
                        <Card.Img variant="top" src={`model${i + 1}.jpg`} /> {/* 替換成你的模型圖片的路徑 */}
                        <Card.Body>
                          <Card.Title>Model {i + 1}</Card.Title>
                          <Card.Text>天俊還沒告訴我要寫甚麼 所以我還沒有分開寫你們</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
          );
}