import axios from "axios";

const apiClient = axios.create(
    {
        baseURL : 'http://localhost:9000/auth',
        withCredentials: true,
    }
)

export const checkDuplicateUserIdService = async (userId) => {
    try{
        const checkDuplicateResponse = await apiClient.get(`/identity/is-duplicate/${userId}`);
        return await checkDuplicateResponse.data;
    }catch(error){
        return error.response.data;
    }
}

export const signupService = async (signupRequest) => {
    try {
        const signupResponse = await apiClient.post('/identity/sign-up', signupRequest);
        return await signupResponse.data;
    } catch (error) {
        return error.response.data;
    }
};

export const signinService = async (signinRequest) => {
    try {
        const signinResponse = await apiClient.post('/identity/sign-in', signinRequest);
        return signinResponse.data;
    } catch (error) {
        return error.response.data;
    }
};

export const socialLoginService = async (socialSignInRequest) => {
    try {
        const socialLoginResponse = await apiClient.post('/identity/social', socialSignInRequest);
        return socialLoginResponse.data;
    } catch (error) {
        return error.response.data;
    }
};

export const findIdService = async (findIdRequest) => {
    try{
        const findIdResponse = await apiClient.post("/identity/find-id",findIdRequest);
        return await findIdResponse.data;
    }catch (error){
        return error.response.data;
    }
};

export const sendVerifyCodeService = async (userId) => {
    try{
        const sendVerifyCodeResponse = await apiClient.post(`/identity/verify-code/${userId}`);
        return await sendVerifyCodeResponse.data;
    }catch (error){
        return error.response.data;
    }
};

export const isVerifyCodeService = async (verifyCodeRequest) => {
    try{
        const isVerifyResponse = await apiClient.post('/identity/is-verify',verifyCodeRequest);
        return await isVerifyResponse.data;
    }catch (error){
        return error.response.data;
    }
};

export const changePasswordService = async (passwordChangeRequest) => {
    try{
        const changePasswordResponse = await apiClient.patch('/identity/password',passwordChangeRequest);
        return await changePasswordResponse.data;
    }catch (error){
        return error.response.data;
    }
};

export const reIssueTokenService = async (refreshToken) => {
    try{
        const reissueTokenResponse = await apiClient.post("/identity/reissue", refreshToken);
        return await reissueTokenResponse.data;
    }catch (error){
        return error.response.data;
    }
};
