import React, { useContext, useState, useEffect } from "react";
import classes from "./MyInformation.module.css";
import { motion, AnimatePresence } from "framer-motion";   
import loginContext from "../../store/login-context";
import { getMemberService } from '../../api/MemberService';
import { IoSettingsSharp } from "react-icons/io5";
import { FaRegChartBar } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "../LayoutComponents/Loading";
import { getAllChatSectionsService } from "../../api/AIChatSectionService";
import { getMyChatRootService } from "../../api/ChatRoomService";
import { isPinService } from "../../api/ChatRoomPinService";
import { getUnreadCountService } from "../../api/ChatApiService";
import EditUserInfo from "./EditUserInfo"; 
import { CiEdit } from "react-icons/ci";

const MyInformation = () => {  

    const [memberInfo,setMemberInfo] = useState(null);
    const [isWait,setIsWait] = useState(false);
    const [chatRoomData,setChatRoomData] = useState(null);

    const loginCtx = useContext(loginContext);
    const memberId = loginCtx.memberId;

    const isPinHandler = async (roomId) => {
        const isPinResponse = await isPinService(roomId,memberId);
        const isPinResponseData = await isPinResponse.data;
        return isPinResponseData;
    };

    const triggerEditUserInfo = () => {
        fetchMemberData();
    };

    const fetchMemberData = async () => {
        setIsWait(true);
        const memberResponse = await getMemberService(memberId);
        const myChatRoomsResponse = await getMyChatRootService(memberId);
        if (myChatRoomsResponse.success){
            const myChatRoomsResponseData = await myChatRoomsResponse.data.chatRoomList;
            let pinCnt = 0;
            let unreadCountCnt = 0;
            for(var i=0;i<myChatRoomsResponseData.length;i++){
                const pinId = await isPinHandler(myChatRoomsResponseData[i].roomId);
                const unreadCountResponse = await getUnreadCountService(myChatRoomsResponseData[i].roomId, memberId);
                const unreadCount = unreadCountResponse.data;
                if (pinId) pinCnt++;
                unreadCountCnt += unreadCount;
            }
            setChatRoomData({
                totalCount : myChatRoomsResponseData.length,
                pinCount : pinCnt,
                unreadCount : unreadCountCnt,
            })
            setIsWait(false);
        }else{
            const errorMessage = myChatRoomsResponse.message;
            toast.error(`일시적 오류입니다. \n ${errorMessage}`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setIsWait(false);
        }
        let userShowId = memberResponse.data.userId;
        if (userShowId.startsWith("kakao_")) userShowId = "카카오 계정 사용 중";
        else if (userShowId.startsWith("naver_")) userShowId = "네이버 계정 사용 중";
        else if (userShowId.startsWith("google_")) userShowId = "구글 계정 사용 중";
        const chatSectionResult = await getAllChatSectionsService(memberId);
        setMemberInfo({
            ...memberResponse.data,
            userId: userShowId,
            chatSectionCount : chatSectionResult.data.length
        });
        setIsWait(false);
    };

    useEffect(() => {
        fetchMemberData();
    },[memberId]);

    return (
        <>
            {isWait && <Loading/>}
            <AnimatePresence>
                {memberInfo && chatRoomData && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        className={classes.container}
                    >
                        <div className={classes.card}>
                            <h2 className={classes.sectionTitle}><IoSettingsSharp/> 기본 정보</h2>
                            <div className={classes.infoItem}><span>사용자 이름</span><p>{memberInfo.name}</p></div>
                            <div className={classes.infoItem}><span>사용자 권한</span><p>{memberInfo.roles === "ROLE_USER" ? "사용자" : "관리자" }</p></div>
                            <div className={classes.infoItem}><span>사용자 이메일</span><p>{memberInfo.email}</p></div>
                            <div className={classes.infoItem}><span>사용자 아이디</span><p>{memberInfo.userId}</p></div>
                            <div className={classes.infoItem}><span>최초 가입일</span><p>{memberInfo.createTime.split('T')[0]}</p></div>
                        </div>
                        <div className={classes.card}>
                            <h2 className={classes.sectionTitle}><CiEdit/> 내 정보 수정</h2>
                            <EditUserInfo onTrigger={triggerEditUserInfo}/>
                        </div>
                        <div className={classes.card}>
                            <h2 className={classes.sectionTitle}><FaRegChartBar/> 서비스 활동 통계</h2>
                            <div className={classes.infoItem}><span>나의 그룹 채팅방</span><p>{`${chatRoomData.totalCount}개`}</p></div>
                            <div className={classes.infoItem}><span>나의 고정 채팅방</span><p>{`${chatRoomData.pinCount}개`}</p></div>
                            <div className={classes.infoItem}><span>내 읽지 않은 메시지</span><p>{`${chatRoomData.unreadCount}개`}</p></div>
                            <div className={classes.infoItem}><span>AI 진단 개수</span><p>{`3개`}</p></div>
                            <div className={classes.infoItem}><span>AI 채팅방 개수</span><p>{`${memberInfo.chatSectionCount}개`}</p></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default MyInformation;