import React, { useState, useContext } from 'react';
import Header from '../components/LayoutComponents/Header';
import Footer from '../components/LayoutComponents/Footer';
import EditUserInfo from '../components/MyPageComponents/EditUserInfo';
import classes from "./MyPage.module.css"
import { motion } from 'framer-motion';
import loginContext from "../store/login-context";
import MyInformation from '../components/MyPageComponents/MyInformation';
import MyDiagnosis from '../components/MyPageComponents/MyDiagnosis';

const MyPage = () => {

    const [option,setOption] = useState(1);
    const loginCtx = useContext(loginContext);
    const memberId = loginCtx.memberId;

    return (
        <React.Fragment>
            <Header/>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={classes.background}>
                <div className={classes.page}>
                    <h1 className={classes.title}>VeTT Service</h1>
                    <div className={classes.selectContainer}>
                        <button className={option === 1 ? classes.selected : classes.unselected} onClick={() => setOption(1)}>기본 정보 및 서비스 통계</button>
                        <button className={option === 2 ? classes.selected : classes.unselected} onClick={() => setOption(2)}>내 AI 진단</button>
                   </div>
                    <div className={classes.sectionContainer}>
                        {option === 1 && memberId && <MyInformation memberId={memberId}/>}
                        {option === 2 && memberId && <MyDiagnosis  memberId={memberId}/>}
                    </div>
                </div>
            </motion.div>
            <Footer/>
        </React.Fragment>

    )
};

export default MyPage;