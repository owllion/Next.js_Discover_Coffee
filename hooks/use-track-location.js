import { useState } from "react";
//useXXX都必須在Hook本體中使用
const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [latLong, setLatLong] = useState("");
  //loading判斷
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  //如果getCurrentPosition成功就會進入此函數
  const success = (positions) => {
    const latitude = positions.coords.latitude;
    const longitude = positions.coords.longitude;

    //拿到經緯度就賦值
    setLatLong(`${latitude},${longitude}`);

    //同時為避免再取得正確資訊前，errorMsg會顯示出來
    //所以在這要清空一次以防萬一
    setLocationErrorMsg("");

    //在下方else區塊呼叫navigator函數
    //且在那之前就已經把loading設定成true了
    //當確定呼叫成功，才會跑進這個success函數 都執行得差不多了
    //才會把loading設定成false
    setIsFindingLocation(false);
  };
  const error = (err) => {
    //有錯誤也是要趕緊設成false
    setIsFindingLocation(false);

    setLocationErrorMsg(`ERROR:${err.message}`);
  };
  const getLocation = () => {
    //按下去就先變成true
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
      //確認不支援就變false
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };
  return {
    latLong,
    isFindingLocation,
    getLocation,
    locationErrorMsg,
  };
};
export default useTrackLocation;
