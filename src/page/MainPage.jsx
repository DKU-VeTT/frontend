import React from 'react';
import Header from '../components/LayoutComponents/Header';
import Footer from '../components/LayoutComponents/Footer';
import mainImage from "../assets/main_bg.jpg";
import classes from './MainPage.module.css';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaMessage, FaGear, FaShare } from 'react-icons/fa6';
import { MdLocalHospital } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { FaCut } from "react-icons/fa";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaCommentSms } from "react-icons/fa6";
import { FaUserCog } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const MainPage = () => {

  const navigate = useNavigate();

  const goAiChatHandler = () => {
    navigate('/ai/chat');
  };

  const goDiagnosisHandler = () => {
    navigate('/diagnosis');
  }

  const goGroupChatHandler = () => {
    navigate('/chat');
  }

  const goMyPageHandler = () => {
    navigate('/me');
  }

  return (
    <>
      <Header />
      <div className={classes.content}>
        <motion.div
          className={classes.mainHeaderSection}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          <div className={classes.imgSection}>
            <img className={classes.mainImage} src={mainImage} alt="main" />
          </div>
          <div className={classes.descriptionContainer}>
            <h2 className={classes.descriptionMainHeader}>VeTT Service</h2>
            <h4 className={classes.descriptionSubHeader}>반려동물 문화 플랫폼</h4>
            <p className={classes.descriptionMainText}>
              반려동물과 함께하는 더 나은 일상을 위한 통합 플랫폼입니다. <br/>
              반려동물 동반 장소를 쉽고 빠르게 찾아보고, <br/>
              AI 기반 안구/피부 진단과 챗봇 상담으로 건강까지 챙기세요. <br/>
              또한, 반려인들과 소통할 수 있는 그룹 채팅방도 제공됩니다! <br/>
            </p>
            <div className={classes.cardContainer}>
              <a href="#first" className={classes.infoCard}>
                <h6>반려동물과 함께</h6>
                <p>반려동물 동반 가능한 <br/> 여러 장소들을 만나보세요!</p>
              </a>
              <a href="#second" className={classes.infoCard}>
                <h6>AI 건강 진단 & 챗봇</h6>
                <p>AI로 반려견의 안구/피부를 <br /> 간편하게 진단받고 상담해보세요!</p>
              </a>
              <a href="#third" className={classes.infoCard}>
                <h6>그룹 채팅방</h6>
                <p>반려인들과 자유롭게 <br /> 소통해보세요!</p>
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
            id='first'
          className={classes.firstSection}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h1 className={classes.sectionHeader}>반려동물과 함께</h1>
          <p className={classes.sectionDescription}>
            반려동물 동반 장소를 카테고리별로 확인해보세요. <br />
            위치 기반 교통정보는 물론, 지도와 로드뷰까지 제공합니다.
          </p>
          <div className={classes.sectionCardContainer}>
              <div className={classes.mainCard}>
                <div className={classes.mainCardIcon}><MdLocalHospital size={120} color='white' /></div>
                <h5 className={classes.mainCardTitle}>동물약국 및 동물병원</h5>
                <p className={classes.mainCardDescription}>
                  근처에 있는 동물병원과 <br /> 동물약국 정보를 확인해보세요!
                </p>
              </div>
              <div className={classes.mainCard}>
                <div className={classes.mainCardIcon}><FaBoxOpen size={120} color='white' /></div>
                <h5 className={classes.mainCardTitle}>반려동물용품</h5>
                <p className={classes.mainCardDescription}>
                  가까운 반려동물용품점과 <br /> 사료, 장난감 판매처를 찾아보세요!
                </p>
              </div>
              <div className={classes.mainCard}>
                <div className={classes.mainCardIcon}><FaCut size={120} color='white' /></div>
                <h5 className={classes.mainCardTitle}>미용</h5>
                <p className={classes.mainCardDescription}>
                  주변 반려동물 미용샵과 <br /> 위탁관리 시설 정보를 확인해보세요!
                </p>
              </div>
              <div className={classes.mainCard}>
                <div className={classes.mainCardIcon}><FaMapMarkedAlt size={120} color='white' /></div>
                <h5 className={classes.mainCardTitle}>여행지</h5>
                <p className={classes.mainCardDescription}>
                  반려동물과 함께할 수 있는 <br /> 산책로 및 관광지를 찾아보세요!
                </p>
              </div>
          </div>
        </motion.div>

        <motion.div
            id="second"
            className={classes.secondSection}
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
          <h1 className={classes.sectionHeader}>AI 진단 및 상담</h1>
          <p className={classes.sectionDescription}>
            반려동물의 건강과 궁금증을 AI로 간편하게 확인하세요. <br />
            텍스트 상담부터 안구·피부 사진 진단까지 제공합니다.
          </p>
          <div className={classes.sectionCardContainer}>
            <div className={classes.cardCommon}>
              <h4>AI 채팅</h4>
              <p>RAG 기반 AI 챗봇과 함께 <br /> 반려동물에 대한 궁금증을 해결해보세요.</p>
              <button onClick={goAiChatHandler}>바로가기</button>
            </div>
            <div className={classes.cardCommon}>
              <h4>반려동물 안구 진단</h4>
              <p>반려견의 안구 사진을 업로드하면 <br /> 이상 유무를 AI가 분석해드립니다.</p>
              <button onClick={goDiagnosisHandler}>바로가기</button>
            </div>
            <div className={classes.cardCommon}>
              <h4>반려동물 피부 진단</h4>
              <p>피부 질환이 의심되시나요? <br /> AI가 반려동물 사진을 분석해 <br/> 진단 결과를 알려드립니다.</p>
              <button onClick={goDiagnosisHandler}>바로가기</button>
            </div>
          </div>
        </motion.div>

        <motion.div
          id="third"
          className={classes.thirdSection}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h1 className={classes.sectionHeader}>그룹 채팅방</h1>
          <p className={classes.sectionDescription}>
            다양한 반려동물 주제별 채팅방에서 사용자들과 실시간으로 소통하세요. <br />
            궁금한 점, 정보 공유, 경험담 등을 나눌 수 있습니다.
          </p>
          <div className={classes.postContainer}>
            <div onClick={goGroupChatHandler} id="post" className={classes.postWrapper}>
              <h4><FaCommentSms /> 그룹 채팅방</h4>
              <p>
                반려동물 관련 주제로 구성된 채팅방에서 <br /> 자유롭게 대화하고 소통해보세요!
              </p>
            </div>
            <div onClick={goMyPageHandler} id="info" className={classes.myInfoWrapper}>
              <h4><FaUserCog /> 마이페이지</h4>
              <p>
                나의 안구·피부 진단 이력을 확인하고 <br />
                AI 채팅 통계 및 진단 결과를 관리할 수 있습니다. <br />
                자주 이용한 기능들도 확인 가능합니다.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className={classes.apiSection}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h1 className={classes.sectionHeader}>Data & API</h1>
          <p className={classes.sectionDescription}>
            본 서비스는 문화 빅데이터 플랫폼, Kakao, AI Hub, Upstage의 데이터를 기반으로 합니다.
          </p>
          <div className={classes.apiList}>
            <div className={classes.apiContainer}>
              <div className={classes.apiTitle}>문화 빅데이터 플랫폼</div>
              <div className={classes.apiText}>
                한국문화정보원 <br /> 전국 반려동물 동반 가능 <br /> 문화시설 위치 데이터
              </div>
            </div>
            <div className={classes.apiContainer}>
              <div className={classes.apiTitle}>Kakao</div>
              <div className={classes.apiText}>
                Kakao API를 통해 <br /> 실시간 교통정보 및 주소 검색 <br /> 기능을 제공합니다.
              </div>
            </div>
            <div className={classes.apiContainer}>
              <div className={classes.apiTitle}>AI Hub</div>
              <div className={classes.apiText}>
                AI 학습용 안구/피부 질환 <br/> 이미지 데이터 기반 <br /> AI 진단 서비스 제공
              </div>
            </div>
            <div className={classes.apiContainer}>
              <div className={classes.apiTitle}>Upstage</div>
              <div className={classes.apiText}>
                RAG 기반 <br/> 자연어 이해 기술을 활용한 <br /> 반려동물 상담형 AI 채팅 서비스
              </div>
            </div>
          </div>
          <div className={classes.apiLinkContainer}>
            <p className={classes.apiLinkText}>
              ※ 사용 API에 대한 자세한 정보는 아래 링크를 확인하세요.
            </p>
            <div className={classes.apiLinkList}>
              <div className={classes.apiLink}>
                문화 빅데이터 플랫폼 <FaShare />{' '}
                <a href="https://www.bigdata-culture.kr/bigdata/user/main.do" target="_blank" rel="noreferrer">https://www.bigdata-culture.kr</a>
              </div>
              <div className={classes.apiLink}>
                Kakao Developers <FaShare />{' '}
                <a href="https://developers.kakao.com/" target="_blank" rel="noreferrer">https://developers.kakao.com/</a>
              </div>
              <div className={classes.apiLink}>
                AI Hub <FaShare />{' '}
                <a href="https://www.aihub.or.kr/" target="_blank" rel="noreferrer">https://www.aihub.or.kr/</a>
              </div>
              <div className={classes.apiLink}>
                Upstage <FaShare />{' '}
                <a href="https://upstage.ai/" target="_blank" rel="noreferrer">https://upstage.ai/</a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;
