import React from "react";
import Header from '../components/LayoutComponents/Header';
import ChatRoomList from "../components/ChatPageComponents/ChatRoomList";
import Footer from "../components/LayoutComponents/Footer";

const ChattingPage = () => {
    return (
        <>
            <Header/>
            <ChatRoomList/>
            <Footer/>
        </>
    )
};

export default ChattingPage;