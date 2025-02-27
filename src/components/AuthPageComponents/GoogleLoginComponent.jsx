import React from 'react';
import google from "../../assets/google.png";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from "@react-oauth/google";
import classes from "./GoogleLoginComponent.module.css"
import { motion } from 'framer-motion';
import { socialLoginService } from '../../api/AuthService';
import { useNavigate } from "react-router-dom";


const GOOGLE_USERINFO_REQUEST_URL = import.meta.env.VITE_GOOGLE_USERINFO_REQUEST_URL;

const GoogleLoginButton = () => {

  const navigate = useNavigate();
  
  const signIn = useGoogleLogin({
      onSuccess: async (res) => { 
          const token = res.access_token;
          try {
            const res = await axios.get(GOOGLE_USERINFO_REQUEST_URL, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            const responserData = await res.data;
            const socialLoginData = await socialLoginService({
              userId : `google_${responserData.id}`,
              name : responserData.name,
              email : responserData.email
            });
            if (socialLoginData.success){
              const tokenData = socialLoginData.data;
              const accessToken = tokenData.accessToken;
              const refreshToken = tokenData.refreshToken;
  
              localStorage.setItem('accessToken',accessToken);
              localStorage.setItem('refreshToken',refreshToken);
              navigate('/')
            }
          } catch (error) {
            console.log(error);
          }
      },
      onError: (error) =>{ console.log(error);}
  });

  return (
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => signIn()}>
          <img className={classes.icon} src={google} alt="Login with Google"/>
      </motion.div>
  );
};

const GoogleLoginComponent = () => {

  return (
    <GoogleOAuthProvider clientId={`${import.meta.env.VITE_GOOGLE_CLIENT_ID}`}>
      <GoogleLoginButton/>
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginComponent;
