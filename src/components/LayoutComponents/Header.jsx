import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import loginContext from '../../store/login-context';
import classes from "./Header.module.css";
import { logoutService } from '../../api/MemberService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {

  const loginCtx = useContext(loginContext);
  const navigate = useNavigate();
  
  const openAdminPage = () => {
    window.open('https://port-0-vett-admin-ss7z32llwmafmaz.sel5.cloudtype.app/admin', '_blank', 'noopener,noreferrer');
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
              <Nav.Link as={Link} to="/">홈</Nav.Link>
              <Nav.Link as={Link} to="/place">반려동물과 함께</Nav.Link>
              <Nav.Link as={Link} to="/chat">그룹 채팅방</Nav.Link>
              <Nav.Link as={Link} to="/ai/chat">AI 챗봇</Nav.Link>
              <Nav.Link as={Link} to="/diagnosis">AI 건강 진단</Nav.Link>
              <Nav.Link as={Link} to="/me">마이페이지</Nav.Link>
              <Nav.Link onClick={logoutHandler}>로그아웃</Nav.Link> 
              {/* <Nav.Link onClick={openAdminPage}>Admin</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </React.Fragment>
  );
}

export default Header;
