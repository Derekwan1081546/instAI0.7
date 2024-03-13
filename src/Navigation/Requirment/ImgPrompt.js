import React,{useState,useEffect} from "react";
import axios from "axios";
import {useNavigate , useLocation} from "react-router-dom";
import {  Navbar, Nav, Container, Button,Form} from "react-bootstrap";
import InstAI_icon from "../../image/instai_icon.png";

export default function ImgPrompt(){
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
            <div style={{ backgroundColor: 'WHITE' }}>
              <Navbar style={{ backgroundColor: 'WHITE', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                <Nav className="mr-auto" style={{marginLeft:"10px"}}>
                 <h3>Back</h3>
                </Nav>
                <Navbar.Brand href="#home" className="mx-auto">
                  <img
                    src={InstAI_icon}
                    width="30"
                    height="30"
                    className="d-inline-block align-top"
                    alt="InstAI logo"
                  />
                  {' '}InstAI
                </Navbar.Brand>
              </Navbar>
              <Container className="d-flex flex-column justify-content-center" style={{ minHeight: '60vh', maxWidth: '50rem', margin: '50px auto', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
                <h2 className="text-center mb-4">Write a prompt to the image generation model</h2>
                <p className="text-center mb-4"><a href="#">How to write a prompt for generative AI model?</a></p>
                <Form>
                  <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={10} placeholder="Describe the details the image should include" />
                  </Form.Group>
                  <Button variant="primary" type="submit" style={{ width: '50%', marginLeft: '50%' }}>
                    Submit
                  </Button>
                </Form>
              </Container>
            </div>
          );
}