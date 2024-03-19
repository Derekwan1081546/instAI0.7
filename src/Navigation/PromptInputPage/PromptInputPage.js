import React,{useState,useEffect} from "react";
import axios from "axios";
import {useNavigate , useLocation} from "react-router-dom";
import {  Navbar, Nav, Container, Button,Form} from "react-bootstrap";
import InstAI_icon from "../../image/instai_icon.png";
// import Autosuggest from 'react-autosuggest';

export default function ImgPrompt(){
    const location = useLocation();
    const navigate = useNavigate();
    const id = localStorage.getItem("userId");
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const p = process.env;
    const [content, setContent] = useState('');
    const handleContentChange = (event) => {
      setContent(event.target.value);
    };
    const [state , setState] = useState(false);
    // const qq = "https://www.salesforce.com/au/blog/generative-ai-prompts/#:~:text=Consider%20these%20tips%20when%20writing%20generative%20AI%20prompts%3A,avoiding%20closed-ended%20questions%20that%20offer%20yes%2Fno%20answers.%20%E6%9B%B4%E5%A4%9A%E9%A0%85%E7%9B%AE"
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
          console.error("Error sending data to backend:", error);
        }
        };
        fetchData();
        },[state]);
        const handleChangeState =() =>{
          const confirm = window.confirm("sure to give up?");
          if(confirm){
            setState(!state);
          }
          else{
            return;
          }
        }
        const handleBack =() =>{
          navigate('/ModelSelectionPage');
        }
        const handleSubmit = (event) => {
          const confirm = window.confirm("sure to submit prompt ?");
          if(confirm){
            event.preventDefault();
            const formData = new FormData();
            formData.append('content', content);
            console.log(formData.get("content"));
            setState(!state);
            console.log(state);
          //   const response = async() =>{
          //     try{
          //      const token = localStorage.getItem("jwtToken");
          //      const response = await axios.post(`adsadssa${id}`,formData, {
          //        headers: {
          //          'Content-Type': 'application/json',
          //          'Authorization': `Bearer ${token}`
          //        }
          //      });
          //      console.log(response.data);
          //     }catch (error){
          //       console.error("Error sending data to backend:", error);
          //    }
          //  }
          //  console.log(response);
          }
          else{
             return ;
          }
         
        };    
         // logic area 
         return (
          <>
          {state ? (
            <>
              <Navbar bg="white" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <Nav className="mr-auto">
        <Nav className="mr-auto" style={{marginLeft:"10px"}}>
             <h3 onClick={handleBack}>Back</h3>
            </Nav>
        </Nav>
        <Navbar.Brand href="#home" className="mx-auto">
          <img
            src={InstAI_icon} 
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="InstAI logo"
          />
          InstAI
        </Navbar.Brand>
      </Navbar>
      <Container className="d-flex flex-column justify-content-center" style={{ minHeight: '60vh', maxWidth: '50rem', margin: '50px auto', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', padding: '20px' }}>
        <h2 className="text-center mb-4">Generative model is processing your request.</h2>
        <p className="text-center mb-4">Estimated time: 5 minutes.</p>
        {/* Illustration or any other content */}
        <Button variant="primary" style={{ width: '50%', marginLeft: '25%' }} onClick={handleChangeState}>
          Cancel Request
        </Button>
      </Container>
            </>
          ) : (
            <>
              {/* 這裡是當state為false時顯示的內容 */}
              <div style={{ backgroundColor: 'WHITE' }}>
          <Navbar style={{ backgroundColor: 'WHITE', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <Nav className="mr-auto" style={{marginLeft:"10px"}}>
             <h3 onClick={handleBack}>Back</h3>
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
            <p className="text-center mb-4" >
              {/* <a href={qq}> */}
              How to write a prompt for generative AI model?
              {/* </a> */}
              </p>
              <Form>
              <Form.Group controlId="exampleForm.ControlTextarea1">
               <Form.Control as="textarea" rows={10} placeholder="Describe the details the image should include" onChange={handleContentChange} />
              </Form.Group>
              <Button variant="primary" type="submit" style={{ width: '50%', marginLeft: '50%' }}
                onClick={handleSubmit}
               >
                Submit
              </Button>
              </Form>
          </Container>
        </div>
            </>
          )}
          </>
        );  
}