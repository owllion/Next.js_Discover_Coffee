export const isEmpty = (obj) => {
  //object.keys他會回傳陣列
  //===0意思就是沒有key
  //也就代表:物件是空的
  return Object.keys(obj).length === 0;
};
