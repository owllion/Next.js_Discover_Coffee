import "../styles/globals.css";
import StoreProvider from "../store/store-index";
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
