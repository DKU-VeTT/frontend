import React, { useEffect, useRef, useState } from 'react';
import { Map, MapMarker, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { FaPlus } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa6';
import classes from './PlaceMap.module.css';
import PlaceInfoOverlay from './PlaceInfoOverlay';

import hospitalImg from '../../assets/Hospital.png';
import salonImg from '../../assets/Salon.png';
import pharmacyImg from '../../assets/Pharmacy.png';
import travelImg from '../../assets/Travel.png';
import petstoreImg from '../../assets/Petstore.png';

const categoryToImage = {
  '동물병원': hospitalImg,
  '미용': salonImg,
  '동물약국': pharmacyImg,
  '여행지': travelImg,
  '반려동물용품': petstoreImg,
};

const PlaceMap = ({ coordinate, places }) => {
  const mapRef = useRef(null);
  const [level, setLevel] = useState(4);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleLevel = (type) => {
    const map = mapRef.current;
    if (!map) return;
    if (type === 'increase') {
      map.setLevel(map.getLevel() + 1);
      setLevel(map.getLevel());
    } else {
      map.setLevel(map.getLevel() - 1);
      setLevel(map.getLevel());
    }
  };

  // ✅ 마커 범위 기준 자동 확대/축소
  useEffect(() => {
    if (!mapRef.current || !places.length) return;
    const bounds = new kakao.maps.LatLngBounds();
    places.forEach((p) => {
      if (p.latitude && p.longitude) {
        bounds.extend(new kakao.maps.LatLng(p.latitude, p.longitude));
      }
    });
    mapRef.current.setBounds(bounds);
  }, [places]);

  return (
    <div className={classes.map_container}>
      {coordinate && (
        <Map
          center={{ lat: coordinate.latitude, lng: coordinate.longitude }}
          level={level}
          zoomable={true}
          ref={mapRef}
          className={classes.map}
        >
          <MapMarker position={{ lat: coordinate.latitude, lng: coordinate.longitude }} />

          {places.map((place, idx) => (
            <React.Fragment key={place.id || `${place.latitude}-${place.longitude}-${idx}`}>
              {/* 실제 마커 */}
              <MapMarker
                position={{ lat: place.latitude, lng: place.longitude }}
                image={{
                  src: categoryToImage[place.category] || hospitalImg,
                  size: { width: 40, height: 42 },
                  options: { offset: { x: 20, y: 42 } },
                }}
                onClick={() => setSelectedPlace(place)}
              />

              {/* 마커 위 텍스트 오버레이 */}
              <CustomOverlayMap position={{ lat: place.latitude, lng: place.longitude }}>
                <div className={classes.markerLabel}>{place.placeName}</div>
              </CustomOverlayMap>
            </React.Fragment>
          ))}

          {selectedPlace && (
            <CustomOverlayMap position={{ lat: selectedPlace.latitude, lng: selectedPlace.longitude }}>
              <PlaceInfoOverlay place={selectedPlace} onClose={() => setSelectedPlace(null)} currentCenter={coordinate} />
            </CustomOverlayMap>
          )}

          <div className={classes.button_container}>
            <div className={classes.plus_box} onClick={() => handleLevel('decrease')}>
              <FaPlus />
            </div>
            <div className={classes.minus_box} onClick={() => handleLevel('increase')}>
              <FaMinus />
            </div>
          </div>
        </Map>
      )}
    </div>
  );
};

export default PlaceMap;
