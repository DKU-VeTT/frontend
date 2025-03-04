import { Map, MapMarker } from "react-kakao-maps-sdk";
import React, { useState, useRef } from "react";
import classes from "./PlaceMap.module.css";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";

const { kakao } = window;

const PlaceMap = (props) => {

  console.log(props);
    const mapRef = useRef(kakao.maps.Map);
    const defaultLevel = 5
    const [level, setLevel] = useState(defaultLevel);

    const handleLevel = (type) => {
      const map = mapRef.current
      if (!map) return
  
      if (type === "increase") {
        map.setLevel(map.getLevel() + 1)
        setLevel(map.getLevel())
      } else {
          map.setLevel(map.getLevel() - 1)
          setLevel(map.getLevel())
      }
    }
    
    return (
        <div className={classes.map_container}>
          {props.coordinate && (
            <Map
              id="map"
              className={classes.map}
              center={{
                  lat: props.coordinate.latitude,
                  lng: props.coordinate.longitude
              }}
              level={level}
              zoomable={true}
              ref={mapRef}
              >
              <MapMarker position=
                {{
                  lat: props.coordinate.latitude,
                  lng: props.coordinate.longitude
                }}>
              </MapMarker>
              <div className={classes.button_container}>
                  <div className={classes.plus_box} onClick={() => handleLevel("decrease")}>
                      <FaPlus/>
                  </div> 
                  <div className={classes.minus_box} onClick={() => handleLevel("increase")}>
                      <FaMinus/>
                  </div>
              </div>
            </Map>
          )}
        </div>
    );
}

export default PlaceMap;