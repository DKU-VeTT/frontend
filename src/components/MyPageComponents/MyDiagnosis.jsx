import React from "react";
import classes from "./MyDiagnosis.module.css";
import { motion, AnimatePresence } from "framer-motion";


const MyDiagnosis = () => {

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className={classes.container}>
                <div className={classes.resultContainer}>
                    <div className={classes.diagnosisContainer}>
                        <h2 className={classes.diagnosisHeader}># AI 진단 결과 모음</h2>

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default MyDiagnosis;