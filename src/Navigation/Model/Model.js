import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useLocation } from "react-router-dom";
import modelcss from "./Model.css";

import bell from "../../image/bell.png";
import schdule from "../../image/schdule.png";
import train from "../../image/train.png";
import design from "../../image/design.png";
import line from "../../image/line.png";
import { state1, state2, state3, state4} from "../../store/modelSlice";

function Model() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.model.state);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userid = searchParams.get("id");
  const projectname = searchParams.get("project");
  const [userstate, setUserstate] = useState(JSON.parse(localStorage.getItem(`user_${userid}_${projectname}`) || false));
  const [currentImage, setCurrentImage] = useState(bell);

  const fetchModel = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/model/downloadmodel/?username=${userid}&projectname=${projectname}`
      );
      console.log(response.data);
      alert(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchModel();
    switch (state) {
      case 1:
        setCurrentImage(train);
        break;
      case 2:
        setCurrentImage(design);
        break;
      case 3:
        setCurrentImage(schdule);
        break;
      case 4:
        setCurrentImage(line);
        break;
      default:
        setCurrentImage(bell);
    }
  }, [state]);

  const handleButtonClick = () => {
    switch (state) {
      case 1:
        dispatch(state1());
        break;
      case 2:
        dispatch(state2());
        break;
      case 3:
        dispatch(state3());
        break;
      case 4:
        dispatch(state4());
        break;
      default:
        break;
    }
  };

  return (
    <div className="container-fluid mt-3">
      <img src={currentImage} alt="Current Image" />
      <button onClick={handleButtonClick}>Next Image</button>
    </div>
  );
}

export default Model;
