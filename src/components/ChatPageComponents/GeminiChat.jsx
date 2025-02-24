import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef, } from "react";
import classes from "./GeminiChat.module.css";
import { geminiChatService } from "../../api/ChatApiService";
import gptImg from "../../assets/gpt.png";
import { motion, AnimatePresence } from "framer-motion";

const GeminiChat = forwardRef((props, ref) => {

    const [isLoading,setIsLoading] = new useState(false);
    const [question,setQuestion] = new useState('');
    const [geminiResponses,setGeminiResponses] = new useState([]);
    const textareaRef = useRef(null);
    const chatContainerRef = useRef(null);

    useImperativeHandle(ref, () => ({
        resetChat() {
            setGeminiResponses([]);
        }
    }));

    const questionChangeHandler = (event) => {
        setQuestion(event.target.value);
        adjustTextareaHeight();
    };
    const insertGeminiResponseHandler = (question, answer) => {
        setGeminiResponses(prev => [
            ...prev,
            { question, answer }
        ]);
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
            if (textareaRef.current){
                textareaRef.current.style.height = "auto";
                textareaRef.current.blur();
                setIsLoading(true);
                setQuestion('');
            }
            const geminiAnswerResponseData = await geminiChatService(question);
            insertResponseHandler(question, markdownToHTMLHandler(geminiAnswerResponseData));
            setIsLoading(false);
        }
    };

    const insertResponseHandler = (question,answer) => {
        insertGeminiResponseHandler(question,answer);
    };
    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    };

    const markdownToHTMLHandler = (answer) => {
        let html = answer
            .replace(/(^|\n)###\s*(.+)/g, '$1<h3>$2</h3>')
            .replace(/(^|\n)##\s*(.+)/g, '$1<h2>$2</h2>')
            .replace(/(^|\n)#\s*(.+)/g, '$1<h1>$2</h1>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/(^|\n)\*\s*(.+)/g, '$1- $2')
            .replace(/(^|\n)-\s*(.+)/g, '$1<li>$2</li>');
        html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        html = html.replace(/<\/ul><ul>/g, '');
        html = html.replace(/\n/g, '<br>');
        return html;
    };

    useEffect(() => {
      if (textareaRef.current && chatContainerRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [question]);

    return (
        <>
            <div className={classes.chat_wrapper}>
                <div className={classes.chat_container} ref={chatContainerRef}>
                    <div className={classes.chat_header_container}>
                        <img className={classes.chat_main_image} src={gptImg} alt="gpt-img"/>
                        <p className={classes.chat_main_text}>
                            VeTT Chat <br/>
                            반려동물과 관련된 궁금하신 것을 검색해보세요!
                        </p>
                    </div>
                    <div className={classes.chat_response_container}>
                        <AnimatePresence>
                            {geminiResponses.map((item, index) => (
                                <motion.div
                                    key={index}
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
                                            ✅ VeTT Answer
                                        </p>
                                        <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                    {isLoading && (
                        <div className={classes.loading_container}>
                            <p className={classes.loading_text}>
                                답변을 작성중입니다.
                                잠시만 기다려주세요.
                            </p>
                        </div>
                    )}
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
        </>
    )
});

export default GeminiChat;