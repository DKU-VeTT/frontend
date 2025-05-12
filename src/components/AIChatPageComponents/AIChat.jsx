import React, { useState, useRef, useEffect } from "react";
import classes from "./AIChat.module.css";
import { getAllChatsService, saveNewChatService } from "../../api/AIChatService";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "../../assets/VeTT_Logo.png";


const baseURL =  window.location.hostname === 'localhost' 
  ? 'http://localhost:9000/py/llm/chat' 
  : `${import.meta.env.VITE_VETT_BACKEND_URL}/py/llm/chat`

const AIChat = ({ section }) => {

    const [isLoading,setIsLoading] = useState(false);
    const [previousMessages, setPreviousMessages] = useState([]);
    const [question,setQuestion] = new useState('');
    const textareaRef = useRef(null);
    const chatContainerRef = useRef(null);
    const latestAnswerRef = useRef(null);

    useEffect(() => {
        if (latestAnswerRef.current) {
            latestAnswerRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [previousMessages]);

    useEffect(() => {
        if (textareaRef.current && chatContainerRef.current) {
                textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
                chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [question]);

    const questionChangeHandler = (event) => {
        setQuestion(event.target.value);
        adjustTextareaHeight();
    };
    
    const questionSubmitHandler = async (event) => {
        if (event.key === 'Enter') {
            if (event.shiftKey) {
                event.preventDefault();
                setQuestion(prev => prev + "\n");
                return;
            }
            if (question.trim().length === 0) {
                event.preventDefault();
                return;
            }
    
            event.preventDefault();
            if (textareaRef.current){
                textareaRef.current.style.height = "auto";
                textareaRef.current.blur();
            }
    
            setIsLoading(true);
            const currentQuestion = question;
            setQuestion('');
            setPreviousMessages((prev) => [...prev, { question: currentQuestion, answer: "" }]);
    
            const res = await fetch(baseURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X_VETT_TOKEN": `${import.meta.env.VITE_X_VETT_TOKEN}`,
                },
                body: JSON.stringify({
                    message : currentQuestion,
                    session_id : section.id,
                }),
            });
    
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let fullAnswer = "";
            let receivedFirstChunk = false;

            while (!done && reader) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunk = decoder.decode(value);
                fullAnswer += chunk;

                if (!receivedFirstChunk && chunk.trim() !== "") {
                    setIsLoading(false);
                    receivedFirstChunk = true;
                }

                setPreviousMessages((prevMessages) => {
                    const updatedMessages = [...prevMessages];
                    const lastIndex = updatedMessages.length - 1;
                    updatedMessages[lastIndex] = {
                        ...updatedMessages[lastIndex],
                        answer: updatedMessages[lastIndex].answer + chunk,
                    };
                    return updatedMessages;
                });
            }
            const llmChatRequest = {
                question : currentQuestion,
                answer : fullAnswer
            };
            const saveChatResponse = await saveNewChatService(section.id, llmChatRequest);
            if (!saveChatResponse.success) {
                console.error("Failed to save chat:", saveChatResponse.message);
            }
        }
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    useEffect(() =>  {
        const fetchChatHistory = async () => {
            setQuestion("");
            const chatHistoryResponse = await getAllChatsService(section.id);
            if (chatHistoryResponse.success){
                setPreviousMessages(chatHistoryResponse.data);
            }
        };
        fetchChatHistory();
    },[section.id])

    return (
        <div className={classes.wrapper}>
            <h1>{section.title}</h1>
            <div className={classes.chat_wrapper}>
                <div className={classes.chat_container} ref={chatContainerRef}>
                    <div className={classes.chat_header_container}>
                        <img className={classes.chat_main_image} src={logoImg} alt="gpt-img"/>
                        <p className={classes.chat_main_text}>
                            VeTT <br/>
                            반려동물 건강 정보 및 케어에 대해 원하는것을 질문해보세요! <br/>
                            해당 답변은 반려동물 건강 정책 자료를 기반으로 생성됩니다.
                        </p>
                    </div>
                    <div className={classes.chat_response_container}>
                        {previousMessages.length === 0 && (
                            <p className={classes.no_chat_message}>아직 질문하신 내역이 없습니다.</p>   
                        )}
                        <AnimatePresence>
                            {previousMessages.map((item, index) => {
                                const isLast = index === previousMessages.length - 1;
                                return (
                                    <motion.div
                                        key={index}
                                        ref={isLast ? latestAnswerRef : null}
                                        className={classes.chat_response_wrapper}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={classes.question_container}>
                                            <p className={classes.question_text}>{item.question}</p>
                                        </div>
                                        <div className={classes.answer_container}>
                                            <p className={classes.answer}>
                                                ✅ VeTT
                                            </p>
                                            <div className={classes.answer_text} dangerouslySetInnerHTML={{ __html: item.answer }} />
                                        </div>
                                        {isLast && isLoading && (
                                            <p className={classes.loading_text}>
                                                답변을 생성중입니다.
                                                잠시만 기다려주세요.
                                            </p>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                    <div className={classes.input_container}>
                        <textarea
                            className={classes.gemini_input}
                            value={question}
                            ref={textareaRef}
                            onChange={questionChangeHandler}
                            onKeyDown={questionSubmitHandler}
                            placeholder="Message Prompt..."></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIChat;