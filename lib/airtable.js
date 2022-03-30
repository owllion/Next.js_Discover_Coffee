//03.27 refactor API
//這些可能以後還會在別的地方用到~~
//全部抓到單獨檔案裏面export
//----------------------------
//去airtable developer裡面看就可以了
//要記得必須先安裝airtable.js 在introduction頁面有連結
const Airtable = require("airtable");
//....要看清楚 這邊有兩個KEY喔 = = API KEY還要自己去account裡面產生..base是原本就有給了
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);
const table = base("stores-data");

//看是要另寫這支放在map裡面來回傳--> map(i=> getMinifiedRecord(i))
//或是直接回傳物件(此處用法)都可，第一種可讀性較高
// const getMinifiedRecord = (data) => {
//   return { ...data.fields };
// };
const getMinifiedRecords = (data) => {
  //03.30
  //i就是那個很多資訊的物件
  //裡面有fields物件
  //還有其他屬性
  console.log({ data });
  return data.map((i) => ({ ...i.fields, recordId: i.id }));
};

//03.30 因為用table.select去get商店資料這個動作
// 在create和getStore這兩個檔案中都有執行
//所以就把他拉進這檔案一起管理~
const findRecordByFilter = async (id) => {
  const getStore = await table
    .select({
      //範例是用view 但用這個filter可以更精確縮小到某個id
      //id的值一定要是字串喔! 所以這邊加上""
      filterByFormula: `id="${id}"`,
    })
    .firstPage();
  // If you only want the first page of records, you can
  // use `firstPage` instead of `eachPage`.

  //***2.有回傳資料 就提取所需
  //03.30 這邊也不需要另外做判斷到底有沒有拿到東西了 因為那是api的責任
  //也就是說 api裡面才去判斷有沒有從這個函數拿到職 才去判斷值的長度
  // if (getStore.length !== 0) {
  //因為有太多不必要資訊了
  //所以就直接把他解構出來
  //這邊拿到的資料結構是一個json陣列
  //裡面包含1個物件
  //這個i就是該物件
  //而fields就是物件的其中一個屬性(他也是物件)
  //所以就再解構出來
  //03.27 refactor之後 變成另寫一函數( getMinifiedRecords)來使用
  return getMinifiedRecords(getStore);
  //3.30 這邊其實應該要另外return一個[](作為預設值)
  //因為可能getMinifiedRecords()是沒有拿到東西的
  //(if it does not able to process it for some reeson, then it need to return some default.)
  //但其實不需要
  //因為getMinifiedRecords它是用map去回傳值 map如果沒有收到值 他也會直接回傳[]
  //所以就不用我們手動添加了~
  // }
};

export { table, getMinifiedRecords, findRecordByFilter };
