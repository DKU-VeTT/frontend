import React, { useContext, useState } from "react";
import classes from "./ChattingPage.module.css";
import Header from '../components/LayoutComponents/Header';
import Footer from "../components/LayoutComponents/Footer";
import AllChatRoomList from "../components/ChatPageComponents/AllChatRoomList";
import loginContext from "../store/login-context";
import MyChatRoomList from "../components/ChatPageComponents/MyChatRoomList";
import { unreadClearService } from "../api/ChatApiService";
import Chat from "../components/ChatPageComponents/Chat";

const formatChatTime = (timestamp) => {

    if (!timestamp){
        return "등록된 채팅이 존재하지 않습니다."
    }
    
    const now = new Date();
    const chatTime = new Date(timestamp);
    const diffMs = now - chatTime;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const isSameDay = now.toDateString() === chatTime.toDateString();
    
    if (diffMinutes < 60) {
        if (diffMinutes === 0){
            return '1분 전';
        }
        return `${diffMinutes}분 전`;
    } else if (isSameDay) {
        return chatTime.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
    } else {
        return chatTime.toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" }) + "일";
    }
}

const ChattingPage = () => {

    const loginCtx = useContext(loginContext);
    const [isChat,setIsChat] = useState(false);
    const [chatRoom,setChatRoom] = useState({});
    const [isSignal, setIsSignal] = useState(false);

    const executeChatHandler = async (chatRoom) => {
        const unreadCountClearResponse = await unreadClearService(
            chatRoom.roomId,loginCtx.memberId);
        setIsChat(true);
        setIsSignal(true);
        setChatRoom(chatRoom);
    };

    const addSignalHandler = () => {
        setIsSignal(true);
    }

    const resetSignalHandler = () => {
        setIsSignal(false); 
    };

    const disconnectChatHandler = () => {
        setIsChat(false);
        setIsSignal(true);
        setChatRoom({});
    };

    return (
        <>
            <Header/>
            <div className={classes.container}>
                {loginCtx.memberId && <AllChatRoomList  
                    onFormatChatTime={formatChatTime}
                    onChatExecute={executeChatHandler} 
                    member={loginCtx} signal={isSignal} onResetSignal={resetSignalHandler}/>
                }
                {loginCtx.memberId && <MyChatRoomList 
                    signal={isSignal}
                    chatRoom={chatRoom}
                    onResetSignal={resetSignalHandler}
                    onAddSignal={addSignalHandler}
                    onFormatChatTime={formatChatTime}
                    onChatExecute={executeChatHandler} member={loginCtx}/>}
                {isChat && <Chat 
                    onChatDisconnect={disconnectChatHandler} 
                    member={loginCtx} chatRoom={chatRoom}/>}
            </div>
            <Footer/>
        </>
    )
};

export default ChattingPage;