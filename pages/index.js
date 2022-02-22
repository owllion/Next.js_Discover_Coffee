import Head from "next/head";
import Link from "next/Link";
import styled from "styled-components";
import Banner from "../components/banner";
import Card from "../components/card";
import Image from "next/image";
import GlobalCSS from "../styles/global.css.js";
const handleClick = () => {
  console.log("點擊按鈕");
};

export default function Home() {
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
        <Card
          shopName="Charlie"
          href="/coffee-store/111"
          imgUrl="/static/charlie.jpg"
        />
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
    .cardLayout {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media (min-width: 1280px) {
    .cardLayout {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
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
    & {
      margin-top: 7rem;
    }
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
