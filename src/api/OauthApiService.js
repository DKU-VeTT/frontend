import axios from "axios";

export const getNaverData = async (token) => {
  try {
    const res = await axios.get("/api/naver/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.data.response;
  } catch (error) {
    console.log("Naver Authentication error - ", error);
    return error;
  }
};

export const getNaverToken = async (code,state) => {
  try {
    const response = await axios.post(
      "/api/naver/token",
      new URLSearchParams({
          grant_type: "authorization_code",
          client_id: import.meta.env.VITE_NAVER_REST_API_KEY,
          client_secret: import.meta.env.VITE_NAVER_SECRET,
          code: code,
          state: state
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      }
    );
    const token = response.data.access_token;
    return token;
  } catch (error) { 
      console.log("Naver Authentication error - ", error);
      return error;
  }
};

export const getKakaoToken = async (code) => {
  
  const baseUrl = window.location.origin;
  const redirectUri = `${baseUrl}/oauth/kakao`;

  try {
    const response = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      new URLSearchParams({
          grant_type: "authorization_code",
          client_id: import.meta.env.VITE_KAKAO_REST_API_KEY,
          client_secret: import.meta.env.VITE_KAKAO_SECRET,
          redirect_uri: redirectUri,
          code: code
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
      }
    );
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.log("Kakao Authentication error - ", error);
    return error;
  }
};

export const getKakaoData = async (token) => {
    try {
        const res = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });
        return await res.data;
    } catch (error) {
        console.log("Kakao Authentication error - ", error);
        return error;
    }
};