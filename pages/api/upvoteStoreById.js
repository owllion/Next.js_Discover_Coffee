import { findRecordByFilter } from "../../lib/airtable";
const upvoteStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      if (id) {
        //先去找這個商店存在不存在
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          //有存在才能更新or回傳
          res.json(records);
        } else {
          res.json({ message: "id does not exist!", id });
        }
      } else {
        res.status(400).json({ message: "id is missing!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error upvoting store", error });
    }
  }
};
export default upvoteStoreById;
