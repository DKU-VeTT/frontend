import React, { useState, useRef, useEffect } from "react";
import classes from "./AIChatSection.module.css";

const AIChatSection = ({ section, onDelete, onEdit, onSetCurrent }) => {
    
    const [editTitle, setEditTitle] = useState(section.title);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);

    const editTitleChangeHandler = (event) => setEditTitle(event.target.value);

    const editTitleHandler = (currentTitle) => {
        setIsEditing(true);
        setEditTitle(currentTitle);
    };

    const onEditHandler = (id) => {
        onEdit(id, editTitle);
        setIsEditing(false);
    };

    const handleKeyDown = (e, sectionId) => {
        if (e.key === "Enter") {
            onEdit(sectionId, editTitle);
            setIsEditing(false);
        }
    };


    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <div key={section.id} className={classes.chatSection}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    value={editTitle}
                    onChange={editTitleChangeHandler}
                    onBlur={() => onEditHandler(section.id)}
                    onKeyDown={(e) => handleKeyDown(e, section.id)}
                />
            ) : (
                <h2>{section.title}</h2>
            )}
            <p>{section.time.split("T")[0]}</p>
            <button onClick={() => onSetCurrent(section)}>채팅방 열기</button>
            <button onClick={() => onDelete(section.id)}>채팅방 삭제</button>
            <button onClick={() => editTitleHandler(section.title)}>채팅방 제목 변경</button>
        </div>
    )
};

export default AIChatSection;