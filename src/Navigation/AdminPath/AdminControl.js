
import React , {useEffect , useState} from "react";
import {useLoaderData, useLocation , useNavigate} from "react-router-dom";
import InstAI_icon from "../../image/instai.png";
import axios from "axios";
import {Row , Col , Card ,Container , Nav , Navbar} from "react-bootstrap";

export default function AdminControl(){
    
    const [state,setState] = useState();
    const navigate= useNavigate();
    const location = useLocation();
    
    
    useEffect(()=>{

    },[])

    return(<div>

    </div>)
}


