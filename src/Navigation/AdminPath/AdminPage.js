import React , {useState , useEffect} from "react";
import {useLocation , useNavigate} from "react-router-dom";
import axios from "axios";
import InstAI_icon from "../../image/instai.png";
import {Row , Col , Navbar , Nav , Card , Container } from "react-bootstrap";
import Adminpage_style from "./AdminPage.css";

export default function AdminPage  () {
   const [state , setState] = useState();
   const navigate = useNavigate();
   const location = useLocation();
   
   const handelAdmin = () =>{
    const response = async() =>{
        
    }
   }
   useEffect(()=>{

   },[])

   return (
    <div>

    </div>
   )
}
