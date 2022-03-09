import axios from "axios";

const getCoffeeStoresNear = (latLong, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&limit=${limit}`;
};

const config = {
  headers: {
    Authorization: process.env.FOURSQUARE_API_KEY,
  },
};
export const getData = async () => {
  const api = getCoffeeStoresNear("43.65267326999575,-79.39545615725015", 15);
  const { data } = await axios.get(api, config);
  console.log(data.results);
  return data.results;
};
