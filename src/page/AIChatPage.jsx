import React from "react";
import classes from "./AIChatPage.module.css";
import Header from '../components/LayoutComponents/Header';
import Footer from "../components/LayoutComponents/Footer";
import AIChatList from "../components/AIChatPageComponents/AIChatList";

const AIChatPage = () => {

    return (
        <>
            <Header/>
            <div className={classes.pageWrapper}>
                <AIChatList />
            </div>
            <Footer/>
        </>
    );
};

export default AIChatPage;