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
  return data.map((i) => ({ ...i.fields }));
};
export { table, getMinifiedRecords };
