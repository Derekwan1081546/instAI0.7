import React from 'react';
import { Alert } from 'react-bootstrap';
import instAI_icon from "../../image/instai.png";

const WarningAlert = ({ message }) => {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="danger" onClose={() => setShow(false)} dismissible>
        <Alert.Heading>warning</Alert.Heading>
        <img src={instAI_icon} alt="InstAI Icon" style={{ width: '50px', height: '50px' }} />
        <p>
          {message}
        </p>
      </Alert>
    );
  }
  return null;
}

export default WarningAlert;


// 使用方式
// import WaringAlert from 這個地方
// <WarningAlert message="這是一個警告訊息" />
