import Head from "next/head";
import Link from "next/Link";
import styled from "styled-components";
import Banner from "../components/banner";
import Card from "../components/card";
import Image from "next/image";
import GlobalCSS from "../styles/global.css.js";
import { getData } from "../lib/coffee-stores";
// import coffee from "../data/coffee-stores.json";
const handleClick = () => {
  console.log("點擊按鈕");
};

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
  // const rr = coffeeData.map((i) => i.name);
  // console.log(rr);
  return (
    <Container>
      <GlobalCSS />
      <Head>
        <title>Coffee</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Banner buttonText="View stores nearby" handleClick={handleClick} />
        <ImgWrapper>
          <Image src="/static/hero-image.png" width={700} height={400} />
        </ImgWrapper>
        {/* {coffeeData.map((c) => {
          return <h1>{c.location.address}</h1>;
        })} */}
        {coffeeData.length > 0 && (
          <>
            <SubTitle>Toronto Coffee Stores</SubTitle>
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
  padding-top: 2rem;
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
