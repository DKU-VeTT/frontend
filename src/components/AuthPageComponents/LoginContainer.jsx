import React from "react";
import classes from "./AuthContainer.module.css";
import LoginInput from "./LoginInput";
import { signinService } from "../../api/AuthService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GoogleLoginComponent from "./GoogleLoginComponent";
import Naver from "../../assets/naver.png";
import Kakao from "../../assets/kakao.png";

const baseUrl = window.location.origin;

const LoginContainer = () => {

    const navigate = useNavigate();

    const kakaoLoginHandler = async () => {

        const REST_API = import.meta.env.VITE_KAKAO_REST_API_KEY;
        const REDIRECT_URI = `${baseUrl}/oauth/kakao`;
    
        const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;
        window.location.href = kakaoURL;
       
    };

    const naverLoginHandler = async () => {
        
        const REST_API = import.meta.env.VITE_NAVER_REST_API_KEY;
        const REDIRECT_URI =  `${baseUrl}/oauth/naver`;
        const state = crypto.randomUUID();

        const NaverURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${REST_API}&redirect_uri=${REDIRECT_URI}&state=${state}&auth_type=reauthenticate`
        window.location.href = NaverURL;
    };

    const loginSubmitHandler = async (formData) => {
        
        const signinResponseData = await signinService(formData);
        if (signinResponseData.success){
            const tokenData = signinResponseData.data;
            const accessToken = tokenData.accessToken;
            const refreshToken = tokenData.refreshToken;

            localStorage.setItem('accessToken',accessToken);
            localStorage.setItem('refreshToken',refreshToken);
            navigate('/')
        }else{
            const message = signinResponseData.message;
            if (message === "There is no member matching the provided username and password." || "Not found member with your primary key or userId"){
                toast.error("일치하는 회원정보가 존재하지 않습니다.", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
    };

    return (
        <React.Fragment>
            <div className={classes.auth_wrapper}>
                <LoginInput loginSubmitHandler={loginSubmitHandler}/>
                <p className={classes.social_login_description}> Social Login </p>
                <div className={classes.socialButtonsContainer}>
                    <GoogleLoginComponent/>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={naverLoginHandler}
                    >
                        <img className={classes.icon} src={Naver} alt='Naver Image'/>
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={kakaoLoginHandler}
                    >
                        <img className={classes.icon} src={Kakao} alt='Kakao Image'/>
                    </motion.div>
                </div>
            </div>
        </React.Fragment>
    )
};

export default LoginContainer;