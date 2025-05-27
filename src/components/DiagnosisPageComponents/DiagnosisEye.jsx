import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import classes from './DiagnosisEye.module.css';
import { BsUpload } from "react-icons/bs";
import { toast } from "react-toastify";
import DiagnosisModal from './DiagnosisModal';
import { MdKeyboardArrowRight } from "react-icons/md";


const modelBaseURL = 'https://mongrel-wondrous-cheetah.ngrok-free.app/py/predict/eye'
const llmBaseURL = window.location.hostname === 'localhost'
  ? 'http://localhost:9000/py/llm/diagnosis'
  : `${import.meta.env.VITE_VETT_BACKEND_URL}/py/llm/diagnosis`;


const DiagnosisEye = () => {
    
  const [image, setImage] = useState(null);
  const [species, setSpecies] = useState('dog');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [noSymptom, setNoSymptom] = useState(false);
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
      const response = await fetch(`${modelBaseURL}?species=${species}`, {
          method: "POST",
          headers: {
              "X_VETT_TOKEN": `${import.meta.env.VITE_X_VETT_TOKEN}`,
          },
          body: formData
      });

      const data = await response.json();
      if (!data.high_data){
        const lowestConfidence = data.all_list.reduce((min, item) => {
          return item.confidence < min ? item.confidence : min;
        }, Infinity);

        setNoSymptom({
          targetImage : URL.createObjectURL(image),
          disease : '무증상',
          confidence : lowestConfidence,
          content: '해당 증상에 대한 정보가 존재하지 않거나, 의심 증상이 없습니다.',
          diagnosis: '매우 낮음',
        })
      }else{
        const llmResponse = await fetch(llmBaseURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X_VETT_TOKEN": `${import.meta.env.VITE_X_VETT_TOKEN}`,
            },
            body: JSON.stringify({
              disease: data.high_data.disease,
              confidence: data.high_data.confidence,
              description: description,
            }),
        });
        const llmData = await llmResponse.json();
        setResult({
          targetImage : URL.createObjectURL(image),
          disease: data.high_data.disease,
          confidence: data.high_data.confidence,
          content: llmData.content,
          diagnosis: llmData.diagnosis,
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
      setPreview(null);
      setImage(null);
      setDescription('');
      setSpecies('dog');
      setLoading(false);
    }
  };

  return (
    <motion.div
      className={classes.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={classes.title}>눈 질환 진단</h2>

      <form className={classes.form} onSubmit={handleSubmit}>
        <label className={classes.label}>동물 선택 <span className={classes.required}>*</span></label>
        <select
          value={species}
          onChange={(e) => setSpecies(e.target.value)}
          className={classes.select}
        >
          <option value="dog">강아지</option>
          <option value="cat">고양이</option>
        </select>

        <label className={classes.label}>증상 설명</label>
        <textarea
          className={classes.textarea}
          placeholder="예: 최근 눈을 자주 깜빡이고 눈곱이 많이 낍니다."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <label className={classes.label}>안구 이미지 업로드 <span className={classes.required}>*</span></label>
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
                  <img src={result.targetImage} alt="진단 이미지" className={classes.resultImage} />
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
                      <p className={classes.resultDetail}>신뢰도 <MdKeyboardArrowRight size={25}/> {Math.floor(noSymptom.confidence * 100)}%</p>
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

export default DiagnosisEye;
