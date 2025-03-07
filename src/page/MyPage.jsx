import React from 'react';
import Header from '../components/LayoutComponents/Header';
import UserInfo from '../components/MyPageComponents/UserInfo';
import classes from "./MyPage.module.css"

const MyPage = () => {

    return (
        <React.Fragment>
            <Header/>
            <div className={classes.user_container}>
                <UserInfo/>
            </div>
        </React.Fragment>

    )
};

export default MyPage;