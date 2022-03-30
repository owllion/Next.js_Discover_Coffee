import {
  table,
  findRecordByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";
const upvoteStoreById = async (req, res) => {
  if (req.method === "PUT") {
    try {
      const { id } = req.body;
      if (id) {
        //先去找這個商店存在不存在
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          //有存在才能更新or回傳
          //records是陣列 商店資料就是唯一元素
          const record = records[0];
          //要每次+1就是直接賦直給變數就好
          const calc = parseInt(record.voting) + 1;
          //update record
          //L161 記得要傳的id必須是recordId喔! 不是我們自己設定的id
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calc,
              },
            },
          ]);
          if (updateRecord) {
            const minifiedRecord = getMinifiedRecords(updateRecord);
            res.json(minifiedRecord);
          }
        } else {
          res.json({ message: "id does not exist!", id });
        }
      } else {
        res.status(400).json({ message: "id is missing!" });
      }
    } catch (e) {
      res
        .status(500)
        .json({ message: "Error upvoting coffee store", error: e });
    }
  }
};
export default upvoteStoreById;
