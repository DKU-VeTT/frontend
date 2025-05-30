import React, { useEffect, useState } from "react";
import classes from "./RoadView.module.css";
import SetTimeOutModal from "./SetTimeOutModal";

const RoadView = ({ location }) => {
  const [showCheckModal, setShowCheckModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const { kakao } = window;
    const mapContainer = document.getElementById("roadMap");
    const rvContainer = document.getElementById("roadViewViewer");

    if (!mapContainer || !rvContainer) return;

    const mapCenter = new kakao.maps.LatLng(location.latitude, location.longitude);

    const map = new kakao.maps.Map(mapContainer, {
      center: mapCenter,
      level: 3,
    });

    const roadview = new kakao.maps.Roadview(rvContainer);
    const roadviewClient = new kakao.maps.RoadviewClient();

    const markerImage = new kakao.maps.MarkerImage(
      "https://t1.daumcdn.net/localimg/localimages/07/2018/pc/roadview_minimap_wk_2018.png",
      new kakao.maps.Size(26, 46),
      {
        spriteSize: new kakao.maps.Size(1666, 168),
        spriteOrigin: new kakao.maps.Point(705, 114),
        offset: new kakao.maps.Point(13, 46),
      }
    );

    const marker = new kakao.maps.Marker({
      position: mapCenter,
      image: markerImage,
      draggable: true,
      map: map,
    });

    function updateRoadView(position) {
      roadviewClient.getNearestPanoId(position, 50, (panoId) => {
        if (!panoId) {
          setShowCheckModal(true);
          setModalMessage("근처에 로드뷰가 지원되지 않습니다.");
          return;
        }

        roadview.setPanoId(panoId, position);
        roadview.relayout();
      });
    }

    // 지도 클릭 → 위치 이동
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      const pos = mouseEvent.latLng;
      marker.setPosition(pos);
      updateRoadView(pos);
    });

    // 마커 드래그 → 위치 이동
    kakao.maps.event.addListener(marker, "dragend", function () {
      const pos = marker.getPosition();
      updateRoadView(pos);
    });

    updateRoadView(mapCenter);
  }, [location]);

  return (
    <div className={classes.roadviewContainer}>
      <SetTimeOutModal
        message={modalMessage}
        showModal={showCheckModal}
        setShowModal={setShowCheckModal}
      />

      <div className={classes.mapArea}>
        <div id="roadMap" className={classes.map}></div>
      </div>
      <div className={classes.viewArea}>
        <div id="roadViewViewer" className={classes.viewer}></div>
      </div>
    </div>
  );
};

export default RoadView;
