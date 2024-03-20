import React,{useState,useEffect} from "react";
import axios from "axios";
import {useNavigate , useLocation} from "react-router-dom";
import {  Navbar, Nav, Container, Button,Form} from "react-bootstrap";
import InstAI_icon from "../../image/instai_icon.png";
import { FaRegClock } from 'react-icons/fa'; 
// import Autosuggest from 'react-autosuggest';    之後可以加入一些提示詞語 方便下更好的prompt
import "./PromptInputPage.css";

export default function ImgPrompt(){
    const location = useLocation();
    const navigate = useNavigate();
    const id = localStorage.getItem("userId");
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const p = process.env;
    const prompt = p.REACT_APP_PROCESS_PROMPT;
    const imgComplete = p.REACT_APP_SDIMG_COMPLETE;
    // const sd_complete = p.REACT
    const handleBack =() =>{
      navigate('/ModelSelectionPage');
    }
    const handleNavigate = () =>{
      navigate('/ImgDisplayPage');
    }
    const [content, setContent] = useState('');

    const handleContentChange = (event) => {
      setContent(event.target.value);
    };
    
    const handleChangeState =() =>{
      const confirm = window.confirm("sure to give up?");
      if(confirm){
        setState(!state);
      }
      else{
        return;
      }
    }

    const [formData, setFormData] = useState({
      enable_hr: false,
      denoising_strength: 0,
      hr_scale: 2,
      hr_upscaler: "Latent",
      hr_second_pass_steps: 0,
      hr_resize_x: 0,
      hr_resize_y: 0,
      prompt: "A cat",
      styles: [],
      seed: -1,
      batch_size: 1,
      n_iter: 1,
      steps: 20,
      cfg_scale: 7,
      width: 512,
      height: 512,
      restore_faces: false,
      tiling: false,
      negative_prompt: "",
      eta: 0,
      override_settings: { 
        sd_model_checkpoint: "sd-v1-5-inpainting.ckpt [c6bbc15e32]" 
      },
      script_args: [],
      sampler_index: "Euler a",
      alwayson_scripts: {}
    });
    const [state , setState] = useState(false);

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
          console.log(response.data);
         }catch (error){
          console.error("Error sending data to backend:", error);
        }
        };
        fetchData();
        },[state]);

  useEffect(() => {
    console.log(formData.prompt);
  }, [formData.prompt]);

        const handleSubmit = (event) => {
          const confirm = window.confirm("sure to submit prompt ?");
          if(confirm){
            event.preventDefault();
            setFormData(prevState => ({
              ...prevState,
              prompt: content
            }));
            console.log(formData.prompt);
            setState(!state);
            console.log(state);
            const response = async() =>{
              try{
               const token = localStorage.getItem("jwtToken");
               const response = await axios.post(`${prompt}${id}`,formData, {
                 headers: {
                   'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}`
                 }
               });
               console.log(response.data);
              }catch (error){
                console.error("Error sending data to backend:", error);
             }
           }
          //  console.log(response);
           const checkImageGenerationComplete = async () => {
            try {
              const token = localStorage.getItem("jwtToken");
              const response = await axios.get(`${imgComplete}${id}`, {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                }
              });
      
              // 如果 API 回傳了資料，則停止檢查並導航到新的頁面
              if (response.data) {
                clearInterval(intervalId);
                navigate('/ImgDisplayPage');
              }
            } catch (error) {
              console.error("Error checking image generation:", error);
            }
          };
          const intervalId = setInterval(checkImageGenerationComplete, 30000);
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
      <p className="text-center mb-4">Estimated time: </p>
      <h2 className="text-center mb-4">5 minutes</h2>
      <div className="text-center">
          <FaRegClock style={{ animation: 'spin 12s linear infinite' }} size={70} />
      </div>
        
        <Button variant="primary" style={{ width: '50%', marginLeft: '25%' , marginTop:"30px"}} onClick={handleChangeState}>
          Cancel Request
        </Button>
        <Button onClick={handleNavigate} style={{marginTop:'50px'}}>
          Go to IMG display page
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
              How to write a prompt for generative AI model?
              </p>
              <Form>
              <Form.Group controlId="exampleForm.ControlTextarea1">
               <Form.Control as="textarea" rows={15} cols={80} placeholder="Describe the details the image should include" onChange={handleContentChange} />
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