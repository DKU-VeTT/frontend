import React, { useEffect, useState } from 'react';
import Header from "../components/LayoutComponents/Header";
import Footer from "../components/LayoutComponents/Footer";

import PlaceMap from '../components/PlacePageComponents/PlaceMap';
import EmergencyButton from '../components/PlacePageComponents/EmergencyForm';
import FilterForm from '../components/PlacePageComponents/FilterForm';
import KeywordForm from '../components/PlacePageComponents/KeywordForm';
import Modal from '../components/PlacePageComponents/PlaceModal';
import { getOpenPlacesByCategoryAndDistService } from '../api/PlaceService';
import RoadView from '../components/PlacePageComponents/RoadView';

import classes from './PlacePage.module.css';

const DEFAULT_COORDINATE = { latitude: 37.3211, longitude: 127.1325 };

const PlacePage = () => {
  const [roadViewPlace, setRoadViewPlace] = useState(null);//로드뷰 상태
  const [myLocation, setMyLocation] = useState(DEFAULT_COORDINATE); // 내 위치 마커용
  const [mapCenter, setMapCenter] = useState(DEFAULT_COORDINATE);   // 지도 중심 이동용

  const [places, setPlaces] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isKeywordOpen, setIsKeywordOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(true);

  const fetchNearbyPlaces = async (coordinate) => {
    try {
      const response = await getOpenPlacesByCategoryAndDistService("동물병원", coordinate);
      if (response.success && response.data?.places) {
        setPlaces(response.data.places.slice(0, 50)); // 최대 50개만 표시
      }
    } catch (e) {
      console.warn("장소 데이터를 불러오지 못했습니다.");
    }
  };

  const handleAllowLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coord = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setMyLocation(coord);        // 마커 위치 갱신
        setMapCenter(coord);         // 지도 중심 이동
        fetchNearbyPlaces(coord);
        setIsLocationModalOpen(false);
      },
      () => {
        setMyLocation(DEFAULT_COORDINATE);
        setMapCenter(DEFAULT_COORDINATE);
        fetchNearbyPlaces(DEFAULT_COORDINATE);
        setIsLocationModalOpen(false);
      }
    );
  };

  const handleDenyLocation = () => {
    setMyLocation(DEFAULT_COORDINATE);
    setMapCenter(DEFAULT_COORDINATE);
    fetchNearbyPlaces(DEFAULT_COORDINATE);
    setIsLocationModalOpen(false);
  };

  return (
    <div className={classes.map_page_wrapper}>
      <Header />

      <Modal isOpen={isLocationModalOpen} onClose={handleDenyLocation}>
        <div className={classes.modalContent}>
          <h3>위치 정보 제공</h3>
          <p>현재 위치를 사용하여 주변 장소를 검색하시겠습니까?</p>
          <button onClick={handleAllowLocation}>예, 위치 사용</button>
          <button onClick={handleDenyLocation}>아니요, 기본 위치 사용</button>
        </div>
      </Modal>

      <div className={classes.button_panel}>
        <EmergencyButton center={myLocation} onSetPlaces={(p) => setPlaces(p.slice(0, 50))} />
        <button onClick={() => setIsFilterOpen(true)}>필터 선택</button>
        <button onClick={() => setIsKeywordOpen(true)}>주소 입력</button>
      </div>

      <PlaceMap coordinate={mapCenter} myLocation={myLocation} places={places} onSelectRoadView={setRoadViewPlace} />

      <Modal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <FilterForm
          onSetPlaces={(data) => {
            setPlaces(data.slice(0, 50));
            setIsFilterOpen(false);
          }}
        />
      </Modal>

      <Modal isOpen={isKeywordOpen} onClose={() => setIsKeywordOpen(false)}>
        <KeywordForm
          onSelectPlace={(place) => {
            setMapCenter({ latitude: place.latitude, longitude: place.longitude });
            setPlaces([place]);
            setIsKeywordOpen(false);
          }}
        />
      </Modal>

       {/*로드뷰 영역: 오른쪽 고정 위치 */}
      {roadViewPlace && (
        <div className={classes.roadviewOverlay}>
          <button className={classes.closeRoadview} onClick={() => setRoadViewPlace(null)}>✕</button>
          <RoadView location={{ latitude: roadViewPlace.latitude, longitude: roadViewPlace.longitude }} />
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PlacePage;
