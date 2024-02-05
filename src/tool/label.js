import React , {useState,useEffect }from 'react';
import { UseDispatch , UseSelector} from 'react-redux'; 
import style from './label.css';
import { useLocation , useNavigate } from 'react-router-dom';
//import LabelStudio from 'label-studio';
function Label () {
    const naviagate = useNavigate();
    const location = useLocation();
    const serchParms = new URLSearchParams(location.search);
    const id = serchParms.get('id');
    const projectname = serchParms.get('projectname');
    
  
  
    return(
     <div>
    
    </div>)
}

export default Label;