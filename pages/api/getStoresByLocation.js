import { getData } from "../../lib/coffee-stores";
const getStoresByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const list = await getData(latLong, limit);
    res.status(200).json(list);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export default getStoresByLocation;
