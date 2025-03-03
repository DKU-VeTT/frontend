import axios from "axios";
import { toast } from "react-toastify";
import { reIssueTokenService } from "./AuthService";

const apiClient = axios.create({
    baseURL : 'https://8d26-59-13-67-70.ngrok-free.app/place',
    withCredentials: true,
})

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
// 모든 장소 데이터 
export const getAllPlacesService = async () => {
    try{
        const placeResponse = await apiClient.get('/all');
        return await placeResponse.data;
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
// 모든 장소 카테고리 
export const getAllCategoriesService = async () => {

    try{
        const categoriesResponse = await apiClient.get("/categories")
        return await categoriesResponse.data;
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

// 카테고리별 장소 데이터 
export const getPlacesByCategoryService = async (category) => {
    try{
        const placeResponse = await apiClient.get(`/category?category=${category}`);
        return await placeResponse.data;
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

// 카테고리별 현재 운영중인 장소 데이터 ( 거리순으로 반환 ) 
export const getOpenPlacesByCategoryAndDistService = async (category, coordinateRequest) => {

    try{
        const placeResponse = await apiClient.post(`/open/dist/${category}`,coordinateRequest);
        return await placeResponse.data;
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

// 거리순으로 데이터 정렬 ( 카테고리 + 좌표 필요 ) 
export const getPlacesByCategoryAndCooridinateDistService = async (category,coordinateRequest) => {
    try{
        const placeResponse = await apiClient.post(`/dist/${category}`,coordinateRequest);
        return await placeResponse.data;
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
// 거리순으로 데이터 정렬 ( 카테고리 + 주소 필요 ) 
export const getPlacesByCategoryAndAddressDistService = async (category, addressRequest) => {
    try{
        const placeResponse = await apiClient.post(`/dist/address/${category}`,addressRequest);
        return await placeResponse.data;
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
// 카테고리별 현재 운영중인 장소 데이터 
export const getOpenPlacesByCategoryService = async (category) => {
    try{
        const placeResponse = await apiClient.get(`/open/${category}`);
        return await placeResponse.data;
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
// 키워드 검색을 통한 장소 데이터 
export const getPlacesByKeywordService = async (keyword) => {
    try{
        const placeResponse = await apiClient.get(`/search/${keyword}`);
        return await placeResponse.data;
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
// 여러 필터를 통한 장소 데이터
export const getPlacesByFilterService = async (filterRequest) => {
    try{
        const placeResponse = await apiClient.post('/filter', filterRequest);
        return await placeResponse.data;
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