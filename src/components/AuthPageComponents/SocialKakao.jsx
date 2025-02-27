import { useEffect } from "react";
import { getKakaoToken, getKakaoData } from "../../api/OauthApiService";
import { socialLoginService } from "../../api/AuthService";
import { useNavigate } from "react-router-dom";
import Loading from "../LayoutComponents/Loading";
import { toast } from "react-toastify";

const SocialKakao = () => {

    const code = new URL(window.location.href).searchParams.get("code");
    const navigate = useNavigate();

    useEffect(() => {
        if (!code) return;
        const fetchKakaoUser = async () => {
           
            try {
                const token = await getKakaoToken(code);
                const userData = await getKakaoData(token);

                const socialLoginData = await socialLoginService({
                    userId : `kakao_${userData.id}`,
                    name : userData.properties.nickname,
                    email : userData.kakao_account.email
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
                toast.error("카카오 로그인에 실패하셨습니다. \n 다른 방법으로 로그인을 진행해주세요.", {
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
        fetchKakaoUser();
    }, [code]);

    return (
        <>
          <Loading/>
        </>
    );
};

export default SocialKakao;
