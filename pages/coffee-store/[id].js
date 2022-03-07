import { useRouter } from "next/router";
import React from "react";
import Link from "next/Link";
import Head from "next/Head";
import Image from "next/image";
import styled from "styled-components";
import coffee from "../../data/coffee-stores.json";

//用這參數拿到要渲染的資料
export async function getStaticProps(staticProps) {
  //解決方法就是使用getStaticProps提供的參數staticProps的params!
  //他就像是react hooks的props!
  //長這樣
  //staticProps {
  //   params: { id: '1' },
  //   locales: undefined,
  //   locale: undefined,
  //   defaultLocale: undefined
  // }
  //很神奇地可以拿到router的id
  //也可以像{params}這樣解構出來!--> ({params})

  const params = staticProps.params;
  console.log("staticProps", staticProps);
  console.log(params);
  return {
    props: {
      coffeeData: coffee.find((i) => i.id.toString() === params.id),
      //i.id會等於一個dymamic id，就是我們要渲染的那一個商店的id!

      //這邊也可以這樣去給予特定單一的值喔!
      //要注意的是，因為這一段其實是在server跑的(會比client還要早)
      //所以理論上這一段code想要拿到要預渲染的那個商店的id的話是不可能的
      //因為id是從router傳進來的嘛!
    },
  };
}
//然後之前也有提到，如果你要愈渲染動態葉面
//getStaticProps和path一定要同時使用
//不然會報錯
export function getStaticPaths() {
  return {
    paths: [{ params: { id: "0" } }, { params: { id: "1" } }],
    fallback: true,

    //CH7 L82-fallback true
    //如果設成false 他就會在沒有符合id時給你看404
    //如果是true 又細分成兩種結果
    //1.如果該id存在於json檔案中(這邊都是假定完整資料皆為靜態，例如我們的資料都存在COFFEE-STORES.json中)
    //只是沒有寫到這個getStaticPaths的path的params中(例如現在id=300，但params中沒有300)，
    //那麼next會自己馬上去幫你產生那一葉的html葉面 再正常show給你看
    //這時候你會需要等等，所以下方寫了一個loading

    //2.連json檔案中都沒有 那就是直接抱錯!
    //至於他報錯的順序依序是:
    //
  };
}

const CoffeeStore = (props) => {
  //可以看到上面的staticProps給出的是和路由id相同的那個商店資料
  //所以假設我們是點id:0的商店
  //那我們就只會拿到他一間商店的資料
  console.log("props", props);
  const router = useRouter();
  console.log(router);
  const query = router.query.id; //這個是自己會去url裡面讀取的(看檔名就知道了)
  // const imgUrl = router.query.imgUrl; //這個是我們在link標籤上自己設定的
  // console.log(imgUrl);
  //不知為何從router取不到直??
  //但總之可以從getStaticProps中取道!

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  //In the “fallback” version of a page, the page’s props will be empty.
  //如果把取props的函式寫在if router.isFallback前面的話
  //會發現居然報錯~ 原因寫在上面了 就是因為在router.isFallback = true時
  //那個時刻 就是處在fallback ver的page
  //而那個當下 page的props就是空的喔!
  //所以必須寫在那個loading後面喔!
  const { address, name, neighbourhood, imgUrl } = props.coffeeData;
  const handleUpvote = () => console.log("投票囉!");
  return (
    <Layout>
      <Head>
        <title>{name}</title>
      </Head>
      <Container>
        <LeftCol>
          <LinkBox>
            <Link href="/">Back to home</Link>
          </LinkBox>
          <NameWrapper>
            <h1>{name}</h1>
          </NameWrapper>
          <ImgWrapper>
            <Image
              src={imgUrl}
              width={600}
              height={360}
              alt={name}
              className="storeImg"
            />
          </ImgWrapper>
        </LeftCol>

        <RightCol className="glass">
          <IconWrapper>
            <Image width="24" height="24" src="/static/icons/places.svg" />
            <p>{address}</p>
          </IconWrapper>
          <IconWrapper>
            <Image width="24" height="24" src="/static/icons/nearMe.svg" />
            <p>{neighbourhood}</p>
          </IconWrapper>
          <IconWrapper>
            <Image width="24" height="24" src="/static/icons/star.svg" />
            <p>2</p>
          </IconWrapper>
          <UpvoteBtn onClick={handleUpvote}>Up vote!</UpvoteBtn>
        </RightCol>
      </Container>
    </Layout>
  );
};
const Layout = styled.div`
  height: 100%;
  @media (min-width: 1024px) {
    padding-left: 2.5rem /* 40px */;
    padding-right: 2.5rem /* 40px */;
    height: 100vh;
  }
  @media (min-width: 768px) {
    padding-left: 2.5rem /* 40px */;
    padding-right: 2.5rem /* 40px */;
  }
  @media (min-width: 640px) {
    padding-left: 1rem /* 16px */;
    padding-right: 1rem /* 16px */;
  }
`;
const Container = styled.div`
  /* 這些basic設定都是應用在手機的喔! */
  display: grid;
  padding-top: 1.75rem /* 28px */;
  padding-bottom: 1.75rem /* 28px */;
  padding-left: 1.75rem /* 12px */;
  padding-right: 0.75rem /* 12px */;

  /* 隨著螢幕越來越大才要變成2col */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (min-width: 640px) {
    //小螢幕就會由本來左右遍成左右col各自佔滿
    width: 100%;
  }
  p {
    padding-left: 0.5rem /* 8px */;
    font-size: 1.5rem /* 24px */;
    line-height: 2rem /* 32px */;
    margin: 0;
    font-weight: 700;
  }
`;
const LeftCol = styled.div`
  place-self: center;
`;
const RightCol = styled.div`
  border-radius: 1rem /* 16px */;
  padding: 1rem /* 16px */;
  display: flex;
  flex-direction: column;
  margin-left: 0.5rem /* 8px */;
  align-self: center;
  margin-top: 4rem /* 64px */;
  color: rgba(55, 59, 100, 1);
  @media (min-width: 1024px) {
    width: 75%;
  }
`;
const LinkBox = styled.div`
  margin-top: 6rem /* 96px */;
  font-size: 1.125rem /* 18px */;
  line-height: 1.75rem /* 28px */;
  margin-bottom: 0.5rem /* 8px */;
  font-weight: 700;
`;
const NameWrapper = styled.div`
  margin-bottom: 1rem /* 16px */;
  margin-top: 1rem /* 16px */;
  h1 {
    color: white;
    font-size: 2.25rem /* 36px */;
    line-height: 2.5rem /* 40px */;
    text-overflow: ellipsis;
    white-space: normal;
    overflow: hidden;
  }
`;
const ImgWrapper = styled.div`
  .storeImg {
    box-shadow: var(0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 #0000),
      0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 #0000,
      0 25px 50px -12px rgba(0, 0, 0, 0.25);

    border-radius: 0.75rem /* 12px */;
    max-width: 100%;
    height: auto;
    vertical-align: middle;
    border-style: none;
  }
`;
const IconWrapper = styled.div`
 display: flex;
  margin-bottom: 1rem /* 16px */;
}
`;
const UpvoteBtn = styled.button`
  width: fit-content;
  color: white;
  margin-top: 1rem /* 16px */;
  margin-bottom: 1rem /* 16px */;
  padding-left: 0.5rem /* 8px */;
  padding-right: 0.5rem /* 8px */;
  padding-top: 0.5rem /* 8px */;
  padding-bottom: 0.5rem /* 8px */;

  background-color: blue;
  cursor: pointer;
  color: white;
  outline: 0;
  border: 0px;

  font-size: 1rem;
  &:hover {
    background-color: white;
    color: blue;
  }
`;
export default CoffeeStore;
