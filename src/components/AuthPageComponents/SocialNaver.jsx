import { useEffect } from "react";
import { getNaverToken, getNaverData } from "../../api/OauthApiService";
import { socialLoginService } from "../../api/AuthService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../LayoutComponents/Loading";

const SocialNaver = () => {

    const code = new URL(window.location.href).searchParams.get("code");
    const state = new URL(window.location.href).searchParams.get("state");
    const navigate = useNavigate();

    useEffect(() => {
        
        if (!code) return;
        const fetchNaverUser = async () => {
             try {
                const token = await getNaverToken(code, state);
                const userData = await getNaverData(token);
               
                const socialLoginData = await socialLoginService({
                    userId : `naver_${userData.id}`,
                    name : userData.name,
                    email : userData.email
                });
                if (socialLoginData.success){
                    const tokenData = socialLoginData.data;
                    const accessToken = tokenData.accessToken;
                    const refreshToken = tokenData.refreshToken;
        
                    localStorage.setItem('accessToken',accessToken);
                    localStorage.setItem('refreshToken',refreshToken);
                    navigate('/')
                }else{
                    navigate('/auth')
                }
            } catch (error) {
                toast.error("네이버 로그인에 실패하셨습니다. \n 다른 방법으로 로그인을 진행해주세요.", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                navigate('/auth')
            }
        };
        fetchNaverUser();
    }, [code]);

    return (
        <>
            <Loading/>
        </>
    );
};

export default SocialNaver;
