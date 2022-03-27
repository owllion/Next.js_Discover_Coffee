import { table, getMinifiedRecords } from "../../lib/airtable";
const createStore = async (req, res) => {
  if (req.method === "POST") {
    const { id, name, neighbourhood, imgUrl, address, voting } = req.body;
    try {
      if (id) {
        const getStore = await table
          .select({
            //範例是用view 但用這個filter可以更精確縮小到某個id
            //id的值一定要是字串喔! 所以這邊加上""
            filterByFormula: `id="${id}"`,
          })
          .firstPage();
        // If you only want the first page of records, you can
        // use `firstPage` instead of `eachPage`.

        if (getStore.length !== 0) {
          //因為有太多不必要資訊了
          //所以就直接把他解構出來
          //這邊拿到的資料結構是一個json陣列
          //裡面包含1個物件
          //這個i就是該物件
          //而fields就是物件的其中一個屬性(他也是物件)
          //所以就再解構出來
          //03.27 refactor之後 變成另寫一函數來使用
          const records = getMinifiedRecords(getStore);
          //用平常用的{data:{...}}這樣解構是不行的喔
          //因為那是解構'物件'(平常都是拿到res物件)
          //但這裡拿到的是陣列..所以必須使用map後才能解構
          res.json({ records });
        } else {
          //不存在就創一個
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
