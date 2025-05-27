import React from 'react';
import { motion } from 'framer-motion';
import classes from './DiagnosisModal.module.css';

const DiagnosisModal = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  return (
    <div className={classes.backdrop} onClick={onClose}>
      <motion.div
        className={classes.modal}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default DiagnosisModal;
