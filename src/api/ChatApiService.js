import axios from "axios";
import { toast } from "react-toastify";
import { reIssueTokenService } from "./AuthService";

const apiClient = axios.create({
  baseURL: 'http://localhost:9000/chat',
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.headers['token-error-message']) {
      const tokenErrorMessage = error.response.headers['token-error-message'];
      if (tokenErrorMessage === 'Token Expired') {
        const refreshToken = localStorage.getItem('refreshToken');
        const reissueTokenResponseData = await reIssueTokenService({ refreshToken });

        if (reissueTokenResponseData.success){
            const newAccessToken = reissueTokenResponseData.data.accessToken;
            const newRefreshToken = reissueTokenResponseData.data.refreshToken;
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(error.config);

        }else{
            toast.warning("로그인 시간이 만료되었습니다. \n 다시 로그인해주세요.", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken"); 
            setTimeout(() => {
                window.location.href = '/auth';
            },2000)
        }
      } else {
        toast.error("인증에 문제가 생겼습니다. \n 다시 로그인해주세요.", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken"); 
        setTimeout(() => {
            window.location.href = '/auth';
        },2000)
      }
    }
    return Promise.reject(error);
  }
);

export const geminiChatService = async (question) => {
  try {
    const geminiChatResponse = await apiClient.post(`/gemini/test/question?question=${question}`);
    return await geminiChatResponse.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAllChatMessageService = async (roomId) => {
  try {
    const chatResponse = await apiClient.get(`/message/${roomId}`);
    return await chatResponse.data;
  } catch (error) {
    return error.response.data;
  }
};
