import React, { useContext, useState, useRef } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import loginContext from '../../store/login-context';
import classes from "./Header.module.css";
import { logoutService } from '../../api/MemberService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import gptImg from "../../assets/gpt.png";
import GeminiChat from '../ChatPageComponents/GeminiChat';
import { IoIosArrowForward } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";

const Header = () => {

  const loginCtx = useContext(loginContext);
  const navigate = useNavigate();
  
  const geminiChatRef = useRef();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  
  const handleReset = () => {
      if (geminiChatRef.current) {
          geminiChatRef.current.resetChat();
      }
  };

  const openAdminPage = () => {
    window.open('http://localhost:9000/admin/login', '_blank', 'noopener,noreferrer');
  };

  const logoutHandler = async () => {
    const logoutResponseData = await logoutService();
    if (logoutResponseData.success){
        toast.success("로그아웃에 성공하셨습니다.", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }else{
        toast.error("로그아웃에 실패하셨습니다. \n 강제로 로그아웃합니다.", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
    }
    loginCtx.logoutUser();
    navigate('/auth');
  };

  return (
    <React.Fragment>
      <Navbar bg="dark" variant="dark" expand="lg" className={classes.header}>
        <Container>
          <Navbar.Brand className={classes.navbar_brand} as={Link} to="/">VeTT</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link onClick={logoutHandler}>Logout</Nav.Link> 
              <Nav.Link as={Link} to="/chat">Chatting</Nav.Link>
              <Nav.Link as={Link} to="/place">Place</Nav.Link>
              <Nav.Link onClick={openAdminPage}>Admin</Nav.Link>
              <motion.img src={gptImg} whileHover={{ scale : 1.1 }} alt="GPT" className={classes.chat_icon} onClick={toggleChat} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div 
            className={classes.chat_container} 
            initial={{ x: 300, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: 300, opacity: 0 }} 
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className={classes.chat_header}>
                <span className={classes.chat_name}>VeTT Chat</span>
                <div className={classes.chat_buttons}>
                    <button className={classes.reset_btn} onClick={handleReset}><GrPowerReset/></button>
                    <button className={classes.close_btn} onClick={toggleChat}><IoIosArrowForward/></button>
                </div>
            </div>
            <div className={classes.chat_content}>
                <GeminiChat ref={geminiChatRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}

export default Header;
