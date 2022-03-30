import {
  findRecordByFilter,
  table,
  getMinifiedRecords,
} from "../../lib/airtable";
const createStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, neighbourhood, imgUrl, address, voting } = req.body;
    try {
      if (id) {
        //如果已經存在 就直接回傳 不用創建
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          //用平常用的{data:{...}}這樣解構是不行的喔
          //因為那是解構'物件'(平常都是拿到res物件)
          //但這裡拿到的是陣列..所以必須使用map後才能解構
          res.json(records);
        } else {
          //找不到id = 不存在 = 創建新商店
          //注意! 要用[]包住多個fields物件 不能直接寫物件
          if (name) {
            const createRecord = await table.create([
              {
                //現在會從req.body裡面動態取出值
                fields: {
                  id,
                  name,
                  address,
                  voting,
                  neighbourhood,
                  imgUrl,
                },
              },
            ]);
            //Refactor
            const records = getMinifiedRecords(createRecord);
            res.json({ message: "new store created", records });
          } else {
            //if(name)範圍
            res.status(400);
            res.json({ message: "Id or name is missing" });
          }
        }
      } else {
        //if(id)範圍
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (error) {
      //有錯誤是兩種情況都有可能
      console.log("Error creating or finding store", error);
      res
        .status(500)
        .json({ message: "Error creating or finding store", error });
    }
  }
};
export default createStore;
