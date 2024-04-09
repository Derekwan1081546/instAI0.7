import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Navbar, Nav, Card, Container, Row, Col, Button ,Form,} from "react-bootstrap";
import InstAI_icon from "../../image/instai_icon.png";
import axios from "axios";
import { FaRegClock } from 'react-icons/fa'; 

const ImageDisplay = () => {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const projectname_confirm1 = location.state?.projectname??"";
  const projectName_process2 = location.state?.projectName??"";
  const[projectName,setProjectName] =useState('unknown');
  useEffect(()=>{
    if(projectName_process2 ==""){
      setProjectName(projectname_confirm1);
    }else if(projectname_confirm1==""){
      setProjectName(projectName_process2);
    }else{
      console.log("process error");
    }
  },[projectName,projectName_process2,projectname_confirm1])
  const p = process.env;
  const id = localStorage.getItem("userId");
  const base64Data = location.state?.base64Data ?? "";
  const [images, setImages] = useState([base64Data]); 
  const storeImg = p.REACT_APP_STORE_IMG;
  const [selectImg , setSelectImg] = useState([]);
  const [selectSDImg, setSelectSDImg] = useState([]);
  const [times , setTimes]= useState(1); // 用來計算第幾次存取
  const [chance,setChance] = useState(3);
  const imgComplete = p.REACT_APP_PROCESS_PROMPT; //resened prompt to sd for img generation 
  const u = process.env.REACT_APP_UPLOAD;
  const get_count = p.REACT_APP_GET_IMGCOUNT;
  const modify_count = p.REACT_APP_MODIFY_IMGCOUNT;
  const [promptData,setPromptData] = useState(location.state?.promptData ?? "");
  const [order, setOrder] = useState([
    { img: base64Data },
    { img: {} },
    { img: {} },
    { img: {} },
  ]); 
  // 用來存取每一次sd生成的base64 string 
  const downloadSingleImage = (base64, index) => {
    const link = document.createElement('a');
    link.href = base64;
    link.download = `image_${index + 1}.jpg`;
    link.click();
  };
  // 重新下prompt 或者是使用重樣的prompt再生圖一次 => 需要夾帶2種process的projectname以及呼叫後端api 來達成ImgGernation的完成
  const resendPromptData = () => {
    const confirmed = window.confirm("需要重新撰寫prompt嗎?");
    if (!confirmed) {
      console.log(promptData)
      const postSDimg = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("jwtToken");
          const response = await axios.post(`${imgComplete}`, promptData, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }});

          console.log(response.data); // 這邊應該會是base64的圖片字串
          const newBase64Data = response.data;
          setChance(chance-1);
          setTimes(prevTimes => prevTimes + 1); //新資料型態 使用1 order matrix solve the problem of multiple sd data 
          // 若是按下try again 會增加times

          setOrder(prevOrder => {
            let newOrder = [...prevOrder];
            newOrder[times] = { img: newBase64Data };
            return newOrder;});
          setLoading(false);
          console.log(order.order1);

          const countResponse = await axios.post(`${modify_count}?userName=${id}&projectName=${projectName}`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }});

          console.log(countResponse.data);}
          catch (error) {
          console.error("Error sending data to backend:", error);
          setLoading(false);}}

      postSDimg();}
    else {
      const newPrompt = prompt("請輸入新的prompt:");
      if (newPrompt) {
        // 更新formData中的prompt
        setPromptData(prevPromptData => ({
          ...prevPromptData,
          prompt: newPrompt
        }));

        console.log(promptData)
        const postSDimg = async () => {
          setLoading(true);
          try {
            const token = localStorage.getItem("jwtToken");
            const response = await axios.post(`${imgComplete}`, promptData, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`}});

            console.log(response.data); // 這邊應該會是base64的圖片字串
            const newBase64Data = response.data;
            setChance(chance-1);
            setTimes(prevTimes => prevTimes + 1); //新資料型態 使用1 order matrix solve the problem of multiple sd data

            setOrder(prevOrder => {
              let newOrder = [...prevOrder];
              newOrder[times] = { img: newBase64Data };
              return newOrder;
            });

            setLoading(false);
            console.log(order.order1);
            const countResponse = await axios.post(`${modify_count}?userName=${id}&projectName=${projectName}`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              }});
            console.log(countResponse.data);
          }
          catch (error) {
            console.error("Error sending data to backend:", error);
            setLoading(false);}}
        postSDimg();}
      }
    }

  const handleButtonClick = (index) => {
    setLoading(true);
    if(order[index].img===""){
        }
    setImages(order[index].img);
    //setImages(base64Data);
    setLoading(false);};

  const handleChangeState =() =>{
    const confirm = window.confirm("sure to give up?");
    if(confirm){
    setLoading(!loading);
    }
    else{ return;}}

  const submitBatch = () => {
    const confirm = window.confirm("確定要傳送照片了嗎");
    if (!confirm) {
      return;} else {
      const formData = new FormData();
      selectSDImg.forEach((img, index) => {
        const timestamp = new Date().getTime(); // 取得當前時間的時間戳記
        formData.append('file', img, `sd_image_${index + 1}_${timestamp}.jpg`);});
      console.log(formData);
      // 透過 axios 將 FormData 傳送到後端
      const token = localStorage.getItem('jwtToken');
      axios.post(`${u}?username=${id}&projectname=${projectName}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }}).then(response => {
        console.log(response.data);
        alert(response.data.message);
        // 處理後端回傳的資料
      }).catch(error => {
        console.error("Error sending:", error);});}};
        
 const handleCheck = (e, base64) => {
    if (e.target.checked) {
      const img = dataURItoBlob(base64);
      setSelectSDImg(prevState => [...prevState, img]);
      setSelectImg(prevState => [...prevState, base64]);
    } else {
      setSelectImg(prevState => prevState.filter(img => img !== base64));
      setSelectSDImg(prevState => prevState.filter(img => img !== base64));
    }
  };

  // 將 base64 字串轉換為 Blob 物件的函式
  const dataURItoBlob = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  useEffect(() => {
    console.log(selectImg,"projectName is",projectName);
    setImages(order[0].img);
  }, [selectImg,projectName]);

  useEffect(() =>{
    const fetchData = async() =>{
      try{
        const token = localStorage.getItem('jwtToken');
        
        const response = await axios.get(`${get_count}username=${id}projectName=${projectName}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
         });
         setChance(response.data);
         console.log(chance);
      }catch(error){
        console.log("error is ",error);
      }
      fetchData();
    }
  },[resendPromptData,submitBatch])

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
      ) : (
        <Container>
           <Card className="mb-4">
           <Card.Body className="d-flex justify-content-between">
           <Button style = {{width:'18%'}} onClick={() => handleButtonClick(0)}>Batch 1</Button>
           <Button style = {{width:'18%'}} onClick={() => handleButtonClick(1)}>Batch 2</Button>
           <Button style = {{width:'18%'}} onClick={() => handleButtonClick(2)}>Batch 3</Button>
           <Button style = {{width:'18%'}} onClick={() => handleButtonClick(3)}>Batch 4</Button>
           </Card.Body>

    </Card>
          <Row>
              {images.length > 0 && images.map((base64, index) => (
                <Col sm={6} md={4} lg={3} key={index} style={{ marginTop: '20px' }}>
                  <Card className="mb-4">
                    {`data:image/png;base64,${base64}` ? (
                      <Card.Img variant="top" src={`data:image/png;base64,${base64}`} />
                    ) : (
                      <p>Error loading image</p>
                    )}
                    <Card.Body>
                      <Form.Check 
                        type="checkbox"
                        id={`check-api-${index}`}
                        label="select"
                        style={{position: 'absolute', top: 0, right: 0}}
                        onChange={e => handleCheck(e, `data:image/png;base64,${base64}`)}
                      />
                      <Button variant="primary" style={{width:'100%'}} onClick={() => downloadSingleImage(`data:image/png;base64,${base64}`, index)}>下載</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              
             <Card className>
              <Card.Body className="d-flex justify-content-center">
              <Button variant="secondary" style={{ width: '30%', height:'40px', marginLeft: "10px" }}onClick={resendPromptData}disabled={chance === 0}>
               try again ({chance} attempts left)
              </Button>
              <Button onClick={submitBatch} style={{ width: '30%', height:'40px',backgroundColor: 'blueviolet', borderColor: 'blueviolet', marginLeft: "10px" }}>use  img for model training</Button>
              </Card.Body>
             </Card> 
          </Row>
        </Container>
      )}
    </div>
  );
}

export default ImageDisplay;