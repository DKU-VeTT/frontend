import React, { useState } from 'react';
import RoadView from './RoadView';
import classes from './PlaceInfoOverlay.module.css';

const PlaceInfoOverlay = ({ place, onClose, myLocation, onSelectRoadView }) => {
  const [showRoadView, setShowRoadView] = useState(false);

  const {
    placeName, category, address, operatingInfo,
    isParking, isInside, isOutside, phoneNumber, holidayInfo
  } = place;

  const formattedOperatingInfo = operatingInfo
    ? operatingInfo.split(',').map((line, idx) => <div key={idx}>{line}</div>)
    : null;

  return (
    <div className={classes.container}>
      <div className={classes.overlayBox}>
        <div className={classes.titleBox}>
          <strong>{placeName}</strong>
          <button className={classes.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={classes.infoItem}><b>주소:</b> {address}</div>
        <div className={classes.infoItem}><b>카테고리:</b> {category}</div>
        <div className={classes.infoItem}><b>운영시간:</b> {formattedOperatingInfo}</div>
        <div className={classes.infoItem}><b>연락처:</b> {phoneNumber}</div>
        <div className={classes.infoItem}><b>주차:</b> {isParking}</div>
        <div className={classes.infoItem}><b>실내:</b> {isInside}</div>
        <div className={classes.infoItem}><b>실외:</b> {isOutside}</div>
        <div className={classes.infoItem}><b>휴무일:</b> {holidayInfo}</div>

        <div className={classes.buttonRow}>
          <button
            className={classes.directionButton}
            onClick={() => {
              const url = `http://map.naver.com/index.nhn?slng=${myLocation?.longitude}&slat=${myLocation?.latitude}&stext=현재 위치&elng=${place.longitude}&elat=${place.latitude}&etext=${place.placeName}&menu=route`;
              window.open(url, "_blank");
            }}
          >
            길찾기
          </button>
          <button
            className={classes.roadButton}
            onClick={() => onSelectRoadView(place)}
          >
            {showRoadView ? '로드뷰 닫기' : '로드뷰 보기'}
          </button>
        </div>
      </div>

      {showRoadView && (
        <div className={classes.roadFixedWrapper}>
          <RoadView location={{ latitude: place.latitude, longitude: place.longitude }} />
        </div>
      )}
    </div>
  );
};

export default PlaceInfoOverlay;
