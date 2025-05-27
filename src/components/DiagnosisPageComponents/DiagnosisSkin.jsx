import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import classes from './DiagnosisSkin.module.css';
import ReactMarkdown from 'react-markdown';
import { BsUpload } from "react-icons/bs";
import { toast } from "react-toastify";
import DiagnosisModal from './DiagnosisModal';
import { MdKeyboardArrowRight } from "react-icons/md";


const modelBaseURL = 'https://mongrel-wondrous-cheetah.ngrok-free.app/py/predict/skin'
const llmBaseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:9000/py/llm/diagnosis'
  : `${import.meta.env.VITE_VETT_BACKEND_URL}/py/llm/diagnosis`;

const DiagnosisSkin = () => {

  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [noSymptom, setNoSymptom] = useState(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef();
  

  const [isModal,setIsModal] = useState(false);
    
  const closeModal = () => {
      setIsModal(false);
  };

  const handleImageChange = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.warning('사진 이미지를 업로드해주세요.', {
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
    setLoading(true);
    setResult(null);
    setNoSymptom(null);

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch(modelBaseURL, {
          method: "POST",
          headers: {
              "X_VETT_TOKEN": `${import.meta.env.VITE_X_VETT_TOKEN}`,
          },
          body: formData
      });
      const data = await response.json();
      const detectionCount = data.count;

      if (detectionCount > 0){
        const llmResponse = await fetch(llmBaseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X_VETT_TOKEN": `${import.meta.env.VITE_X_VETT_TOKEN}`,
            },
            body: JSON.stringify({
              confidence : data.detections[0].confidence,
              disease : data.main_symptom,
              description: description,
            }),
        });
        const llmData = await llmResponse.json();
        setResult({
          disease : data.main_symptom,
          targetImage : URL.createObjectURL(image),
          diagnosisImage : data.img_base64,
          confidence : data.detections[0].confidence,
          content: llmData.content,
          diagnosis: llmData.diagnosis,
        })
      }else{
        setNoSymptom({
          disease : '무증상',
          targetImage : URL.createObjectURL(image),
          diagnosisImage : image,
          confidence : 92,
          content: '해당 증상에 대한 정보가 존재하지 않거나, 의심 증상이 없습니다.',
          diagnosis: '매우 낮음',
        })
      }
      setIsModal(true);
    } catch (error) {
      toast.error(`진단 중 오류가 발생하였습니다. \n ${error.message}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
      });
    } finally {
      setLoading(false);
      setPreview(null);
      setImage(null);
      setDescription('');
    }
  };

  return (
    <motion.div 
      className={classes.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={classes.title}>피부 질환 진단</h2>
      <form className={classes.form} onSubmit={handleSubmit}>
        <label className={classes.label}>증상 설명</label>
        <textarea
          className={classes.textarea}
          placeholder="예: 두드러기나 발진이 존재합니다."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <label className={classes.label}>피부 이미지 업로드 <span className={classes.required}>*</span></label>
          <div
            className={`${classes.dropZone} ${dragging ? classes.dragOver : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current.click()}
          >
            {preview ? (
              <img src={preview} alt="미리보기" className={classes.previewImage} />
            ) : (
              <p className={classes.dropText}>
                파일을 이곳에 드래그하거나 클릭해서 선택하세요. <br/><br/>
                <BsUpload size={35}/>
              </p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e.target.files[0])}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            type="submit" className={classes.button} disabled={loading}>
            {loading ? '진단 중...' : '진단하기'}
          </motion.button>
        </form>
        {result && isModal && (
            <DiagnosisModal isOpen={isModal} onClose={closeModal}>
              <motion.div
                className={classes.resultBox}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className={classes.resultTitle}>예측 결과</h3>
                <div className={classes.resultInfo}>
                  <img src={result.targetImage} alt="원본 이미지" className={classes.resultImage} />
                  <img src={result.diagnosisImage} alt="진단 이미지" className={classes.resultImage} />
                  <div className={classes.resultDetails}>
                    <p className={classes.resultDetail}>질병명 <MdKeyboardArrowRight size={25}/> {result.disease}</p>
                    <p className={classes.resultDetail}>중증도 <MdKeyboardArrowRight size={25}/> {result.diagnosis}</p>
                    <p className={classes.resultDetail}>신뢰도 <MdKeyboardArrowRight size={25}/>{Math.floor(result.confidence * 100)}%</p>
                  </div>
                </div>
                <hr/>
                <article className={classes.markdown}>
                    {result.content}
                </article>
              </motion.div>
          </DiagnosisModal>
      )}
      {noSymptom && isModal && (
            <DiagnosisModal isOpen={isModal} onClose={closeModal}>
               <motion.div
                  className={classes.resultBox}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h3 className={classes.resultTitle}>예측 결과</h3>
                  <div className={classes.resultInfo}>
                    <img src={noSymptom.targetImage} alt="진단 이미지" className={classes.resultImage} />
                    <div className={classes.resultDetails}>
                      <p className={classes.resultDetail}>질병명 <MdKeyboardArrowRight size={25}/> {noSymptom.disease}</p>
                      <p className={classes.resultDetail}>중증도 <MdKeyboardArrowRight size={25}/> {noSymptom.diagnosis}</p>
                      <p className={classes.resultDetail}>신뢰도 <MdKeyboardArrowRight size={25}/> {noSymptom.confidence}%</p>
                    </div>
                  </div>
                  <hr/>
                  <article className={classes.noSymptomContent}>
                      {noSymptom.content}
                  </article>
              </motion.div>
          </DiagnosisModal>
      )}
    </motion.div>
  );
};

export default DiagnosisSkin;
