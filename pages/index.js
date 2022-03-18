import Head from "next/head";
import { useEffect, useState } from "react";
import Link from "next/Link";
import styled from "styled-components";
import Banner from "../components/banner";
import Card from "../components/card";
import Image from "next/image";
import GlobalCSS from "../styles/global.css.js";
import { getData } from "../lib/coffee-stores";
import useTrackLocation from "../hooks/use-track-location";
// import coffee from "../data/coffee-stores.json";

//這個是static generation(SSG)的函數
//預設就是static generation 的without external data ，也就是不用call api的靜態資源，他預設就會幫你預渲染
//那這個getStaticProps，則是ssg的另一種渲染方式，是當你有需要用到外部資源時才需要寫(例如call api)
//這一段code是在server被呼叫的喔!所以裡面寫console會從terminal顯示
//然後如果真的要call api才需要加上async喔
//沒有的話是不用加的!
export async function getStaticProps(context) {
  console.log("hi from termonal");
  //假資料out，要從api拿資料了
  //把原本寫在這的call api的code移出去，變成單獨的js檔案，看起來較整齊乾淨
  const coffeeData = await getData();
  return {
    props: {
      coffeeData,
    }, // will be passed to the page component as props
  };
}
export default function Home({ coffeeData }) {
  console.log(coffeeData);
  //3.13 isFindingLocation就是控制loading的值啦啦
  const { getLocation, latLong, locationErrorMsg, isFindingLocation } =
    useTrackLocation();
  //印出物件
  //就不用每次都要寫成console.log("latLong",latLong)這種麻煩的寫法了
  console.log({ latLong, locationErrorMsg });
  const handleClick = () => {
    //getLocation是用來拿到經緯度
    //getData則是取得經緯度、要拿的商店筆數去抓商店資料&照片
    getLocation();
  };
  const [storesData, setStores] = useState("");
  const [storesErr, setStoresErr] = useState(null);
  useEffect(async () => {
    //03.18
    //這邊用了useEffect是代表我們的資料是使用CSR(client side render)
    //因為SSG只能"預先載入"，意思就是他頂多就是只能"預先call api拿到靜態的資料"
    //但當使用者點及按鈕要動態得知自己位置附近有哪些商店時
    //他就沒用了，我們還是需要CSR，需要動態去抓資料~
    if (latLong) {
      try {
        //按下button
        //假如使用者同意獲取他們的位置資訊我們才會拿到latlong值
        //假設有拿到，就要重新取得一次資料-->使用getData
        const res = await getData(latLong, 30);
        console.log(res);
        setStores(res);
      } catch (error) {
        //error是一個物件 有message和name屬性
        //但不是error.response嗎... = =
        setStoresErr(error.message);
      }
    }
  }, [latLong]);
  return (
    <Container>
      <GlobalCSS />
      <Head>
        <title>Coffee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Banner
          buttonText={isFindingLocation ? "Loading..." : "View stores nearby"}
          handleClick={handleClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {storesErr && <p>Something went wrong: {storesErr}</p>}
        <ImgWrapper>
          <Image src="/static/hero-image.png" width={700} height={400} />
        </ImgWrapper>
        {storesData.length > 0 && (
          <>
            <SubTitle>Stores near me</SubTitle>
            <CardWrapper>
              {storesData.map((c) => {
                return (
                  <Card
                    key={`${c.id}${Math.random()}`}
                    shopName={c.name}
                    href={`/coffee-store/${c.id}`}
                    imgUrl={
                      c.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                  />
                );
              })}
            </CardWrapper>
          </>
        )}
        {coffeeData.length > 0 && (
          <>
            <SubTitle>Tronto Stores</SubTitle>
            <CardWrapper>
              {coffeeData.map((c) => {
                return (
                  <Card
                    key={`${c.id}${Math.random()}`}
                    shopName={c.name}
                    href={`/coffee-store/${c.id}`}
                    imgUrl={
                      c.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                  />
                );
              })}
            </CardWrapper>
          </>
        )}

        {/* <Link
          href={{
            pathname: "/coffee-store/[id]",
            query: { id: "changeet" },
          }}
        >
          To one of coffee shop
        </Link> */}
      </Main>
    </Container>
  );
}

const Container = styled.div`
  margin-bottom: 14rem;
  @media (min-width: 1024px) {
    padding-left: 2.5rem /* 40px */;
    padding-right: 2.5rem /* 40px */;
    /* .cardLayout {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    } */
  }
  /* @media (min-width: 1280px) {
    .cardLayout {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  } */
`;
const SubTitle = styled.h2`
  color: #607d8b;
  font-size: 2.1rem;
  line-height: 28px;
  padding-top: 5rem;
`;
const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  column-gap: 1.5rem;
  row-gap: 1.5rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  /* @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (min-width: 1280px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  } */
`;
const Main = styled.main`
  margin-top: 2.5rem /* 40px */;
  margin-left: auto;
  margin-right: auto;
  max-width: 72rem /* 1152px */;
  padding-left: 1rem /* 16px */;
  padding-right: 1rem /* 16px */;
  @media (min-width: 1024px) {
    margin-top: 5rem /* 80px */;
    padding-left: 2rem /* 32px */;
    padding-right: 2rem /* 32px */;
  }
  @media (min-width: 1280px) {
    margin-top: 7rem;
  }
`;
const ImgWrapper = styled.div`
  position: absolute;
  top: 0;
  z-index: 0;
  @media (min-width: 1024px) {
    right: 10%;
  }
`;
