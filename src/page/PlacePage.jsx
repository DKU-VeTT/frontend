import React from 'react';
import Header from '../components/LayoutComponents/Header';
import Footer from '../components/LayoutComponents/Footer';
import { getAllCategoriesService, getAllPlacesService, getPlacesByCategoryService,
    getPlacesByCategoryAndCooridinateDistService, getPlacesByCategoryAndAddressDistService,
    getOpenPlacesByCategoryService,getPlacesByKeywordService,
    getOpenPlacesByCategoryAndDistService } from '../api/PlaceService';
import { convertAddressToCoordinateService, getRouteInfoService } from '../api/LocationService';
import classes from "./PlacePage.module.css";
import FilterForm from '../components/PlacePageComponents/FilterForm';
import KeywordForm from '../components/PlacePageComponents/KeywordForm';

const myHomeCoordinate = { latitude: 37.2906870184418, longitude: 126.994990959844 };
const dkCoordinate = {latitude: 37.3211938747541, longitude: 127.132535935195};
const dkAddress = "경기도 용인시 수지구 죽전로 152";

const PlacePage = () => {

    const getAllCategoriesHandler = async () => {
        const allCategoriesResponse = await getAllCategoriesService();
        console.log(allCategoriesResponse);
    };
    const getAllPlacesHandler = async () => {
        const allPlacesResponse = await getAllPlacesService();
        console.log(allPlacesResponse);
    };
    const getPlacesByCategoryHandler = async () => {
        const placeResponse = await getPlacesByCategoryService("여행지");
        console.log(placeResponse);
    };
    const getOpenPlacesByCategoryHandler = async () => {
        const placeResponse = await getOpenPlacesByCategoryService("동물약국");
        console.log(placeResponse);
    };
    const getOpenPlacesByCategoryAndDistHandler = async () => {
        const placeResponse = await getOpenPlacesByCategoryAndDistService("동물약국",dkCoordinate);
        console.log(placeResponse);
    };

    const getPlacesByCategoryAndCooridinateDistHandler = async () => {
        const placeResponse = await getPlacesByCategoryAndCooridinateDistService("동물약국",dkCoordinate);
        console.log(placeResponse)
    };
    const getPlacesByCategoryAndAddressDistHandler = async () => {
        const placeResponse = await getPlacesByCategoryAndAddressDistService("동물약국", { address : dkAddress});
        console.log(placeResponse)
    };
    const getPlacesByKeywordHandler = async () => {
        const placeResponse = await getPlacesByKeywordService("약국");
        console.log(placeResponse);
    };

    const convertToCoordinateHandler = async () => {
        const coordinteResponse = await convertAddressToCoordinateService({ address : dkAddress });
        console.log(coordinteResponse);
    };
    const getRouteHandler = async () => {
        const locationRequest = {
            startLatitude : myHomeCoordinate.latitude,
            startLongitude : myHomeCoordinate.longitude,
            endLatitude : dkCoordinate.latitude,
            endLongitude : dkCoordinate.longitude
        }
        const routeResponse = await getRouteInfoService(locationRequest);
        console.log(routeResponse);
    };

    return (
        <>
            <Header/>
            <div className={classes.place_container}>
            <h1>Place Page</h1>
            <div className={classes.formsAndButtonsContainer}>
                <div className={classes.formsContainer}>
                    <KeywordForm />
                    <FilterForm />
                </div>
                <div className={classes.buttonsContainer}>
                    <button onClick={getAllCategoriesHandler}>1. What Categories?</button>
                    <button onClick={getAllPlacesHandler}>2. All Places</button>
                    <button onClick={getPlacesByCategoryHandler}>3. Category Places</button>
                    <button onClick={getOpenPlacesByCategoryHandler}>4. Get Open Places By Category</button>
                    <button onClick={getOpenPlacesByCategoryAndDistHandler}>5. Get Open Places By Category And Sorting By Coordinate</button>
                    <button onClick={getPlacesByCategoryAndCooridinateDistHandler}>6. Get Places By Category And Sorting By Coordinate</button>
                    <button onClick={getPlacesByCategoryAndAddressDistHandler}>7. Get Places By Category And Sorting By Address</button>
                    <button onClick={getPlacesByKeywordHandler}>8. Get Places By Keyword</button>
                    <button onClick={convertToCoordinateHandler}>9. Get Coordinate</button>
                    <button onClick={getRouteHandler}>10. Get RouteInfo</button>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
};

export default PlacePage;