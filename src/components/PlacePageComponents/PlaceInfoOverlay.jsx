import React from 'react';
import classes from './PlaceInfoOverlay.module.css';

const PlaceInfoOverlay = ({ place, onClose, currentCenter }) => {
  const {
    placeName, category, address, operatingInfo,
    isParking, isInside, isOutside, phoneNumber, holidayInfo
  } = place;

  // 운영시간을 요일별로 줄바꿈 
  const formattedOperatingInfo = operatingInfo
    ? operatingInfo.split(',').map((line, idx) => <div key={idx}>{line}</div>)
    : null;

  return (
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
      
      <button
        onClick={() => {

          const naverMapURL = "http://map.naver.com/index.nhn?";
 
          const slng = currentCenter?.longitude;
          const slat = currentCenter?.latitude;
          const elng = place.longitude;
          const elat = place.latitude;
          const etext = place.placeName;

          if (!slng || !slat || !elng || !elat) {
            alert("길찾기 좌표 정보가 부족합니다.");
            return;
          }

          const routeNaverUrl = `${naverMapURL}slng=${slng}&slat=${slat}&stext=${'현재 위치'}&elng=${elng}&elat=${elat}&pathType=1&showMap=false&etext=${etext}&menu=route"`;   
   

          window.open(
            routeNaverUrl,
            "naverMap",
            "width=355,height=700,scrollbars=yes,resizable=yes,menubar=no,toolbar=no,status=no"
          );
        }}
        className={classes.directionButton}
      >
        길찾기 
      </button>

    </div>
  );
};

export default PlaceInfoOverlay;
