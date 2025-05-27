import React, { useState } from "react";
import { motion } from "framer-motion";
import classes from "./DiagnosisPage.module.css";
import Header from "../components/LayoutComponents/Header";
import Footer from "../components/LayoutComponents/Footer";
import DiagnosisEye from "../components/DiagnosisPageComponents/DiagnosisEye";
import DiagnosisSkin from "../components/DiagnosisPageComponents/DiagnosisSkin";
import eyeImage from "../assets/eye-check.png";
import skinImage from "../assets/skin-check.png";
import { FaCheckSquare } from "react-icons/fa";

const DiagnosisPage = () => {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Header />
      <div className={classes.pageWrapper}>
        <motion.h1
          className={classes.pageTitle}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          반려동물 질병 AI 진단 서비스
        </motion.h1>

        <motion.p
          className={classes.pageDescription}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          AI Hub 데이터를 기반으로 반려동물의 <strong>안구와 피부 사진</strong>을 분석해 <br />
          다양한 질환 여부를 예측하고, 의심되는 부분에 대한 시각적 정보를 제공합니다.<br/>
          원하시는 항목을 클릭하신 후 진단을 받아보세요.
        </motion.p>

        <motion.div
          className={classes.cardContainer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div
            className={`${classes.card} ${selected === "eye" ? classes.selected : ""}`}
            onClick={() => setSelected("eye")}
          >
            <img src={eyeImage} alt="Eye Diagnosis" />
            <h3>안구 질환 진단</h3>
            <p>
              반려동물의 안구 사진을 업로드하면 AI가 <br />
              반려동물 종류에 따라 질환을 분석하고, <br/> 이에 맞는 진단 결과를 제공합니다. <br/>
            </p>
            <div className={classes.dogDetail}>
              <strong className={classes.detailHighlight}><FaCheckSquare/> 강아지</strong>
              안검내반증, 안검염, 안검종양, 유루증, 핵경화
            </div>
            <div className={classes.catDetail}>
              <strong className={classes.detailHighlight}><FaCheckSquare/> 고양이</strong>
              각막궤양, 각막부골편, 결막염, 안검염, 비궤양성각막염
            </div>
          </div>

          <div
            className={`${classes.card} ${selected === "skin" ? classes.selected : ""}`}
            onClick={() => setSelected("skin")}
          >
            <img src={skinImage} alt="Skin Diagnosis" />
            <h3>피부 질환 진단</h3>
            <p>
              피부 사진을 분석하여 AI가 <br />
              미란/궤양, 결정/종양 여부를 진단하고 <br />
              의심 부위를 시각적으로 표시합니다.
            </p>
            <ul className={classes.details}>
              <li><FaCheckSquare/> 의심 부위 시각적 표시</li>
              <li><FaCheckSquare/> 질병 명칭과 설명 제공</li>
              <li><FaCheckSquare/> 미란/궤양, 결정/종양 여부 판단</li>
              <li><FaCheckSquare/> 실제 의료 데이터 기반 진단</li>
            </ul>
          </div>
          <div className={classes.resultSection}>
            {selected === "eye" && <DiagnosisEye />}
            {selected === "skin" && <DiagnosisSkin />}
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default DiagnosisPage;
