import "../styles/globals.css";
import { useReducer } from "react";
//加入context
//有成功的話 去react devtools應該要看到myApp下面有兩層StoreProvide和Context.Provider
//我們設定的state會在contextProvider裡面的values~
import { createContext } from "react";

const StoreContext = createContext();

//加入useReducer 用處是把useState集中管理
//另外設action.type這在文件上沒有
//官方是直接在reducer裡面設定會接收到的action.type
const ACTION_TYPES = {
  SET_LATLONG: "SET_LATLONG",
  SET_STORES: "SET_STORES",
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LATLONG:
      return { ...state, latLong: action.payload.latLong };
    case ACTION_TYPES.SET_STORES:
      return { ...state, storeList: action.payload.storeList };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: "",
    storeList: [],
  };
  const [state, dispatch] = useReducer(storeReducer, initialState);
  return (
    // 原本下面的value是 state: initialState
    // 但因為已經把state放到useReducer裡面了
    // 所以這邊就改成state和dispatch 這樣我們就可從context中取道共用state&發送dispatch去更改state
    //實際使用會是這樣
    // in use-track-location.js
    // const {dispatch} = useContext(StoreContext)
    // 其中useContext和StoreContext都是要另外引入的喔
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};
function MyApp({ Component, pageProps }) {
  return (
    //context設定順序
    // storeContext -> storeProvider裡面使用storeContext.provider -> 在MyApp外包覆設定好的storeProvider
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
