import React from "react";
import classes from "./Footer.module.css";
import { FaEnvelope, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className={`${classes.main_footer} ${classes.user_footer}`}>
            <div className={classes.goto_top}>
                <a href="#" className={classes.lnk_top}>
                    <span>TOP</span>
                </a>
            </div>
            <div className={classes.name}>OhKyuChan | okc0202@naver.com</div>
            <div className={classes.name}>LeeWonJin | leewj20780@naver.com</div>
            <div className={classes.copyright}>@ VeTT Service.</div>
            <div className={classes.icon_container}>
                <a className={classes.icon_link} href="mailto:okc0202@naver.com">
                    <FaEnvelope className={classes.icon} />
                </a>
                <a className={classes.icon_link} href="https://github.com/DKU-VeTT" target="_blank" rel="noopener noreferrer">
                    <FaGithub className={classes.icon}/>
                </a>
            </div>
        </div>
    );
};

export default Footer;
