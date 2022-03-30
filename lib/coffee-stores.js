import axios from "axios";
import { createApi } from "unsplash-js";

const getCoffeeStoresNear = (latLong, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&limit=${limit}`;
};
//L99
//https://github.com/unsplash/unsplash-js
//https://unsplash.com/documentation
//有分是在SERVER跑or在CLIENT跑的
// on your node server
//補充:寫在.env檔案裏面的全域變數如無加上NODE_XXX開頭就代表是在CLIENT端跑的喔
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});
const config = {
  headers: {
    Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
  },
};
//3.12 把call unslpash api的函數拉出來另外寫個
const getPhotos = async () => {
  const {
    response: { results: photos },
  } = await unsplashApi.search.getPhotos({
    query: "small store",
    perPage: 40,
  });
  //取出來的photos是陣列
  //最後會產生一個由photos裡面每個元素(物件)的urls裡面的small屬性的value所組成的陣列，如下
  //photos: Array(30)
  // 0: "https://images.unsplash.com/photo-1557374800-8ba4ccd60e9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMDkwMjJ8MHwxfHNlYXJjaHwxfHxob3JzZXxlbnwwfHx8fDE2NDcwNzMyNTU&ixlib=rb-1.2.1&q=80&w=400"
  // 1: "https://images.unsplash.com/photo-1534307250431-ef2530a9d8c5?
  return photos.map((i) => i.urls["small"]);
};
export const getData = async (
  latLong = "43.65267326999575,-79.39545615725015",
  limit = 20
) => {
  //we've hardcored latlong ,but now we need the dynamic data ,so add that latlong param and set the default value .
  //拿照片
  const photos = await getPhotos();

  // console.log("照片", photos);

  //"43.65267326999575,-79.39545615725015";
  const api = getCoffeeStoresNear(latLong, limit);
  //limit就是筆數
  const {
    data: { results: stores },
  } = await axios.get(api, config);
  // console.log(stores);
  //最後要回傳的是我們自組的商店資訊陣列(specific stores data & add imgUrl(因為用foursquare的imng要收錢))
  //但有時候會發現neighborhood不是在每間商店都會出現
  //因此我們在這裡就先判斷(較簡單)
  //不用到[id].js解構賦值拿到後才去判斷他存不存在
  return stores.map((store, idx) => {
    return {
      // ...store, 要在這邊把每個屬性都寫出來，這樣才能寫較細節的回傳值
      //we'll be specific in  terms of what we get from the store
      id: store.fsq_id,
      address: store.location.address || "",
      name: store.name,
      neighbourhood:
        store.location.neighbourhood || store.location.cross_street || "",
      imgUrl: photos[idx],
    };
  });
};
