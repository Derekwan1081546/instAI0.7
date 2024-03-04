import React, { useState,  Fragment } from "react";
import basestyle from "../Base.module.css";
import loginstyle from "./Login.module.css";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import InstAI_icon from '../../image/iconnew.png'

const Login = ({ setUserState }) => {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const log_in = process.env.REACT_APP_LOG_IN
  const [user, setUserDetails] = useState({
    email: "",
    password: "",
  });
  const R_L = process.env.REACT_APP_LOG_IN;

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const validateForm = (values) => {
    const error = {};
    const regex = /^[^\s+@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      error.email = "Email is required for login";
    } else if (!regex.test(values.email)) {
      error.email = "Please enter a valid email address";
    }
    if (!values.password) {
      error.password = "Password is required for login";
    }
    return error;
  };
  const loginHandler = async (e) => {
    e.preventDefault();
    setFormErrors(validateForm(user));
    setIsSubmit(true);
  
    if (Object.keys(formErrors).length !== 0 || !isSubmit) {
      return;
    }
  
    try {
      const response = await axios.post(log_in, user,);
      console.log(response.data);
      if (response.data && response.data.message && typeof response.data === 'object' && response.data.message.includes("Failed")) {
        alert("登錄失敗！");
      } else {
        alert("登錄成功！");
        const token = response.data.token;
        localStorage.setItem("jwtToken", token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const remove = "Success";
        const id = response.data.message.replace(remove, "");
        console.log(id);
        navigate("/Project", { state: id, replace: true });
      }
    } catch (error) {
      console.error('登錄時出錯', error);
    }
  };
  
  

  return (
    <Fragment>
     <div className="container"  style={{marginTop:"30vh"}}>
        <div className="row">
          <div className="col-md-3 mx-auto"> 
            <img src={InstAI_icon} className="img-fluid" alt="InstAi_Icon" ></img>
          </div>
        </div>
       
        <div className="row" >
          <div className="col-md-5  mx-auto"> 

         <div className={`card rounded-5 ${loginstyle.logincard}`} >
            <div className="card-body">
          <h3 className="card-title text-center " style={{fontWeight:'bold'}}>Sign in</h3>
          <form>
           <label className="form-label fs-6 mt-2 mb-1 fw-bold">Email</label>
           <input
             type="email"
             name="email"
             id="email"
             onChange={changeHandler}
             value={user.email}
             className="form-control fs-6  mt-1 mb-1"
           />
           <p className={`text-center ${basestyle.error}`}>{formErrors.email}</p>
           <label className="form-label fs-6  mt-1 mb-1 fw-bold">Password</label>
           <input
             type="password"
             name="password"
             id="password"
             onChange={changeHandler}
             value={user.password}
             className="form-control fs-6  mt-1 mb-1"
           />
           <p className={`text-center ${basestyle.error}`}>{formErrors.password}</p>
           <button type="button" className={`btn ${basestyle.button_common}`} onClick={loginHandler}>
             SIGN IN
           </button>
           <NavLink className={`nav-link text-center text-primary `} style={{fontWeight:'bold'}} to="/">
             Create a new account
           </NavLink>
         </form>
         
            </div>
            </div>

            <div className="text-center mt-3">
              Have questions? Send email to <b>support@instai.co</b>
            </div>

          </div>
        </div>


      </div>


    </Fragment>
  );
};

export default Login;