import React, { useContext, useEffect, useState } from 'react';
import loginContext from '../../store/login-context';
import { getMemberService, editMemberService } from '../../api/MemberService';
import { toast } from 'react-toastify';
import classes from "./UserInfo.module.css";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const userIdRegex = /^[a-zA-Z0-9]{7,30}$/;

const UserInfo = () => {

    const loginCtx = useContext(loginContext);

    const [currentUserInfo, setCurrentUserInfo] = useState({});
    const [formData, setFormData] = new useState({});

    const [errors, setErrors] = new useState({});
    const [touched, setTouched] = new useState({});
    const [checking, setChecking] = new useState({});

    const validateField = (name, value) => {
        switch (name) {
            case "name":
                return value.length >= 2 && value.length <= 50 ? "" : "이름은 2자 이상 50자 이하로 입력해주세요.";
            case "email":
                return emailRegex.test(value) ? "" : "올바른 이메일 형식을 입력해주세요.";
            case "userId":
                return userIdRegex.test(value) ? "" : "아이디는 7~30자의 영문/숫자만 가능합니다.";
            default:
                return "";
        }
    };
    const handleFocus = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        const error = validateField(name, formData[name].value);
        setErrors({ ...errors, [name]: error });
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: { ...formData[name], value } });
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors({ ...errors, [name]: error });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newErrors = {};
        Object.keys(formData).forEach((key) => {
            newErrors[key] = validateField(key, formData[key].value);
        });
        setErrors(newErrors);
        if (formData["userId"]){
            setTouched({ name: true, email: true, userId : true});
        }else{
            setTouched({ name: true, email: true });
        }
        if (Object.values(newErrors).every((err) => err === "")) {
            setChecking((prev) => ({ ...prev, ["formData"]: true }));
            let editMemberRequest;
            if (formData["userId"]){
                editMemberRequest = {
                    name : formData.name.value,
                    email : formData.email.value,
                    userId : formData.userId.value,
                }
            }else{
                editMemberRequest = {
                    name : formData.name.value,
                    email : currentUserInfo.email,
                    userId : currentUserInfo.userId
                }
            }
            const editMemberResponse = await editMemberService(loginCtx.memberId, editMemberRequest);
            if (editMemberResponse.success){
                setTimeout(() => {
                    setChecking((prev) => ({ ...prev, ["formData"]: false }));
                    const tokenData = editMemberResponse.data;
                    const accessToken = tokenData.accessToken;
                    const refreshToken = tokenData.refreshToken;

                    localStorage.setItem('accessToken',accessToken);
                    localStorage.setItem('refreshToken',refreshToken);
                    fetchUserInfoHandler();
                    toast.success('회원정보를 성공적으로 변경하였습니다.', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTouched({});
                }, 1000)
            }else{
                const errorMessage = editMemberResponse.message;
                if (errorMessage === 'This is duplicated Id.'){
                    toast.warning('아이디가 중복됩니다. \n 다른 아이디를 사용해주세요.', {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }else{
                    toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                        position: "top-center",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                }
                setChecking((prev) => ({ ...prev, ["formData"]: false }));
            }
        } else {
            toast.error("입력값을 정확히 입력해주세요.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
    };

    const fetchUserInfoHandler = async () => {
        
        const memberResponseData = await getMemberService(loginCtx.memberId);

        if (memberResponseData.success) {
            const userData = memberResponseData.data;
            let userShowId = userData.userId;
            let isEditUserId = false;
            if (userShowId.startsWith("kakao_")) userShowId = "카카오 계정 사용 중";
            else if (userShowId.startsWith("naver_")) userShowId = "네이버 계정 사용 중";
            else if (userShowId.startsWith("google_")) userShowId = "구글 계정 사용 중";
            else isEditUserId = true;

            let userRole = userData.roles;
            if (userRole === 'ROLE_USER') userRole = "사용자";
            else if (userRole === "ROLE_ADMIN") userRole = "관리자";
            else if (userRole === "ROLE_MANAGER") userRole = "매니저";

            const memberData = {
                ...userData,
                userShowId,
                createTime: userData.createTime.split('T')[0],
                role: userRole
            };
            setCurrentUserInfo(memberData);
            if (isEditUserId){
                setFormData({
                    name: { value: memberData.name, placeholder: memberData.name },
                    userId :{ value: userShowId , placeholder: userShowId },
                    email: { value: memberData.email , placeholder: memberData.email },
                })
            }else{
                setFormData({
                    name: { value: memberData.name, placeholder: memberData.name },
                })
            }   
        } else {
            toast.error(`일시적 오류입니다. \n ${memberResponseData.message}`, {
                position: "top-center",
                autoClose: 2000,
            });
        }
    };

    useEffect(() => {
        if (loginCtx.memberId){
            fetchUserInfoHandler();
        }
    }, [loginCtx]);

    return (
        <div className={classes.userInfo_container}>
            <div className={classes.container}>
                <h2 className={classes.userInfo_container_header_text}>User Infomation</h2>
                <div className={classes.not_edit_container}>
                    <p>{currentUserInfo.role} 계정</p>
                    <p>{currentUserInfo.createTime}</p>
                </div>
                <motion.div
                    className={classes.user_form}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {Object.keys(formData).map((key) => (
                        <div key={key} className={classes.input_group}>
                            <div className={classes.input_wrapper}>
                                <input
                                    type="text"
                                    name={key}
                                    value={formData[key].value}
                                    onChange={handleChange}
                                    onFocus={handleFocus}
                                    className={`${classes.input} ${errors[key] ? classes.input_error : ""}`}
                                    placeholder={formData[key].placeholder}
                                />
                                {!errors[key] && touched[key] && formData[key] &&
                                    ["name", "email", "userId"].includes(key) &&
                                    (
                                        <CheckCircle className={classes.check_icon} color="green" size={20} />
                                    )
                                }
                            </div>
                            <AnimatePresence>
                                {touched[key] && errors[key] && (
                                    <motion.p
                                        className={classes.error}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                    >
                                        {errors[key]}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                    {!formData["userId"] && (
                        <>
                            <p className={classes.social_login_id}>
                                <CheckCircle className={classes.social_icon} color="green" size={20} /> {currentUserInfo.userShowId}
                            </p> 
                            <p className={classes.social_email}>
                                연동 계정 : {currentUserInfo.email}
                            </p>
                        </>
                    )}
                    <motion.button
                        onClick={handleSubmit}
                        className={classes.submit_button}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={checking['formData']}
                    >
                        {checking['formData'] ? 'Submit...' : '사용자 정보 변경'}
                    </motion.button>
                </motion.div>
                {formData["userId"] && (
                    <Link className={classes.edit_password_link} as={Link} to="/auth?type=4">Forget Password?</Link>
                )}
            </div>
        </div>
       
    );
};

export default UserInfo;
