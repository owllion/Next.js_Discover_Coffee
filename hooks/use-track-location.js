import { useState } from "react";
//useXXX都必須在Hook本體中使用
const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [latLong, setLatLong] = useState("");
  const success = (positions) => {
    const latitude = positions.coords.latitude;
    const longitude = positions.coords.longitude;
    //拿到經緯度就賦值
    setLatLong(`${latitude} ,${longitude}`);
    //同時為避免再取得正確資訊前，errorMsg會顯示出來
    //所以在這要清空一次以防萬一
    setLocationErrorMsg("");
  };
  const error = (err) => {
    setLocationErrorMsg(`ERROR:${err.message}`);
  };
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  return {
    latLong,
    getLocation,
    locationErrorMsg,
  };
};
export default useTrackLocation;
