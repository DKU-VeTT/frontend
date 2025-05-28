import React from 'react';
import { getOpenPlacesByCategoryAndDistService } from '../../api/PlaceService';
import { toast } from 'react-toastify';
import classes from './EmergencyForm.module.css';

const EmergencyForm = ({ center, onSetPlaces }) => {
  const handleClick = async () => {
    if (!center) {
      toast.warning("위치 정보가 필요합니다.");
      return;
    }
    
    try {
    const response = await getOpenPlacesByCategoryAndDistService("동물병원", center);

    console.log("응답 전체:", response);

    const places = Array.isArray(response.data)
      ? response.data.map(item => ({
          ...item.place,
          distance: item.distance
        }))
      : [];

    if (response.success && places.length > 0) {
      onSetPlaces(places.slice(0, 50));
      toast.success(`${places.length}개 병원 중 50개 표시`);
    } else {
      toast.warn("운영 중인 동물병원이 없습니다.");
      onSetPlaces([]);
    }
  } catch (err) {
    toast.error("병원 정보를 불러오는 데 실패했습니다.");
  }
};

  return (
    <button onClick={handleClick} className={classes.emergencyButton}>
      응급상황 (동물병원 찾기)
    </button>
  );
};

export default EmergencyForm;
