import { findRecordByFilter } from "../../lib/airtable";

const getStoreById = async (req, res) => {
  //這是get 所以從query
  const { id } = req.query;
  try {
    if (id) {
      //03.30 這些都已經拉到airtable.js裡面去重構了
      // //***1.有給id 就尋找
      // const getStore = await table
      //   .select({
      //     //範例是用view 但用這個filter可以更精確縮小到某個id
      //     //id的值一定要是字串喔! 所以這邊加上""
      //     filterByFormula: `id="${id}"`,
      //   })
      //   .firstPage();
      // // If you only want the first page of records, you can
      // // use `firstPage` instead of `eachPage`.

      // //***2.有回傳資料 就提取所需
      // if (getStore.length !== 0) {
      //   //因為有太多不必要資訊了
      //   //所以就直接把他解構出來
      //   //這邊拿到的資料結構是一個json陣列
      //   //裡面包含1個物件
      //   //這個i就是該物件
      //   //而fields就是物件的其中一個屬性(他也是物件)
      //   //所以就再解構出來
      //   //03.27 refactor之後 變成另寫一函數( getMinifiedRecords)來使用
      //--------------------------------------------------------
      const records = await findRecordByFilter(id);
      if (records.length !== 0) {
        //用平常用的{data:{...}}這樣解構是不行的喔
        //因為那是解構'物件'(平常都是拿到res物件)
        //但這裡拿到的是陣列..所以必須使用map後才能解構
        res.json(records);
      } else {
        //找不到id 就報錯
        res.json({ message: "id could not be found" });
      }
    } else {
      //沒給id
      res.status(400).json({ msg: "Id is missing!" });
    }
  } catch (e) {
    res.status(500).json({ message: "something wrong!" });
  }
};
export default getStoreById;
