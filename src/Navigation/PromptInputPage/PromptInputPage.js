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
    const id = localStorage.getItem("userId");  // user區分使用的id
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type");
    const [content, setContent] = useState(''); // 用來存取使用者的prompt => content
    const [state , setState] = useState(false); //處理頁面渲染 如果提交PROMPT表單則會變成等待Page
    const p = process.env;
    const prompt = p.REACT_APP_PROCESS_PROMPT;   // 提交prompt的api 
    
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
      batch_size: 20,
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
    });    // initial folder for img generation 
   
    // 跳轉回去
    const handleBack =() =>{
      navigate('/ModelSelectionPage');
    }
    // 
    const handleContentChange = (event) => {
      setContent(event.target.value);
    };   // 對應到formControl 的表單，存取使用者的輸入 

    useEffect(() => {
      console.log(formData);
      console.log(formData.prompt);
    }, [formData]); // 只监视 formData 的变化

    const handleChangeState =() =>{
      const confirm = window.confirm("sure to give up?");
      if(confirm){
        setState(!state);
      }
      else{
        return;
      }
      // 確認是否submit 決定是否要變更狀態
    }


  const handleSubmit = (event) => {
    const confirm = window.confirm("sure to submit prompt ?");
     if(confirm){
       event.preventDefault();
       // 確認好之後才把前面使用 handleContentChange修改好的content輸入到formData的prompt裡面
       const updatedFormData = { ...formData, prompt: content };
       setFormData(updatedFormData);
    console.log(formData);
    console.log(formData.prompt); // 顯示修改成果
    setState(!state);             // 轉換成已提交後須等待的page
    // 對後端針對prompt接收的api發出post
     const postData = async() =>{
      try{
        const token = localStorage.getItem("jwtToken");
        const response = await axios.post(`${prompt}`,formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
                }
        });
        setState(!state);
        console.log(response.data); // 這邊應該會是base64的圖片字串
        const base64Data = response.data;
        const promptData = formData;
        navigate(`ImgDisplayPage`,{ state: { base64Data , promptData} });
        }catch (error){
        console.error("Error sending data to backend:", error);
        }
    }
    postData();
        }
        else{
          return ;
        }
    };    
      
  return (
          <>
          {state ? (
            <>
              <Navbar bg="white" style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
        <Nav className="mr-auto">
        <Nav className="mr-auto" style={{marginLeft:"10px"}}>
             <h3 onClick={handleBack}>←Back</h3>
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
      <h2 className="text-center mb-4">Generative model is processing your request.</h2>
      <p className="text-center mb-4">Estimated time: </p>
      <h2 className="text-center mb-4">5 minutes</h2>
      <div className="text-center">
          <FaRegClock style={{ animation: 'spin 12s linear infinite' }} size={70} />
      </div>
        
        <Button variant="primary" style={{ width: '50%', marginLeft: '25%' , marginTop:"30px"}} onClick={handleChangeState}>
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