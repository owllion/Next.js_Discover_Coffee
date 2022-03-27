//去airtable developer裡面看就可以了
//要記得必須先安裝airtable.js 在introduction頁面有連結
const Airtable = require("airtable");
//....要看清楚 這邊有兩個KEY喔 = = API KEY還要自己去account裡面產生..base是原本就有給了
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base("stores-data");
console.log(table);

const createStore = async (req, res) => {
  if (req.method === "POST") {
    try {
      const getStore = await table
        .select({
          //範例是用view 但用這個filter可以更精確縮小到某個id
          filterByFormula: `id="8"`,
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
        const records = getStore.map((i) => {
          return {
            ...i.fields,
          };
        });
        //用平常用的{data:{...}}這樣解構是不行的喔
        //因為那是解構'物件'(平常都是拿到res物件)
        //但這裡拿到的是陣列..所以必須使用map後才能解構
        res.json({ records });
      } else {
        //不存在就創一個
        //注意! 要用[]包住多個fields物件 不能直接寫物件
        const createRecord = await table.create([
          {
            fields: {
              id: "10",
              name: "信介",
              address: "nowhere.St",
              voting: 30,
              neighbourhood: "查察",
            },
          },
        ]);
        const records = createRecord.map((i) => {
          return {
            ...i.fields,
          };
        });
        res.json({ message: "new store created", records });
      }
    } catch (error) {
      console.log("something wrong", error);
      res.status(500).json({ message: error });
    }
  }
};
export default createStore;
