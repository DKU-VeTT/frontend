import axios from "axios";
import { toast } from "react-toastify";
import { reIssueTokenService } from "./AuthService";

const apiClient = axios.create({
  baseURL: window.location.hostname === 'localhost' 
  ? 'http://localhost:9000/llm' 
  : `${import.meta.env.VITE_VETT_BACKEND_URL}/llm`,
  withCredentials: true,
  headers: {
    'Content-Type': `application/json`,
    'ngrok-skip-browser-warning': '9000',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('accessToken');
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
        const refreshToken = sessionStorage.getItem('refreshToken');
        const reissueTokenResponseData = await reIssueTokenService({ refreshToken });

        if (reissueTokenResponseData.success){
            const newAccessToken = reissueTokenResponseData.data.accessToken;
            const newRefreshToken = reissueTokenResponseData.data.refreshToken;
            sessionStorage.setItem("accessToken", newAccessToken);
            sessionStorage.setItem("refreshToken", newRefreshToken);
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
            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken"); 
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
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken"); 
        setTimeout(() => {
            window.location.href = '/auth';
        },2000)
      }
    }
    return Promise.reject(error);
  }
);

export const getAllChatSectionsService = async (memberId) => {
    
    try{
        const chatSectionsResponse = await apiClient.get(`/chat-sections/${memberId}`);
        return await chatSectionsResponse.data;
    }catch(error){
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return { success : false }
    }
}

export const createChatSectionService = async (memberId,title) => {

    try{
        const createSectionsResponse = await apiClient.post(`/chat-section/${memberId}/${title}`);
        return await createSectionsResponse.data;
    }catch(error){
        if (error.response){
            return error.response.data;
        }
        toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        return { success : false }
    }
};

export const deleteChatSectionService = async (chatSectionId) => {

  try{
      const deleteSectionsResponse = await apiClient.delete(`/chat-section/${chatSectionId}`);
      return await deleteSectionsResponse.data;
  }catch(error){
      if (error.response){
          return error.response.data;
      }
      toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
      return { success : false }
  }
};

export const editChatSectionService = async (chatSectionId, title) => {

  try{
      const editSectionResponse = await apiClient.patch(`/chat-section/${chatSectionId}/${title}`);
      return await editSectionResponse.data;
  }catch(error){
      if (error.response){
          return error.response.data;
      }
      toast.error(`일시적 네트워크 오류입니다.\n 잠시 후 다시 시도해주세요.`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
      return { success : false }
  }
};
