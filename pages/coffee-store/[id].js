import { useRouter } from "next/router";
import { useEffect, useState, useContext } from "react";
import { isEmpty } from "../../utils/index.js";
import { StoreContext } from "../../store/store-index";
import React from "react";
import Link from "next/Link";
import Head from "next/Head";
import Image from "next/image";
import styled from "styled-components";
import GlobalCSS from "../../styles/global.css.js";

// import coffee from "../../data/coffee-stores.json";
//要換成api的資料
import { getData } from "../../lib/coffee-stores";

//用這函數拿到要渲染的資料
export async function getStaticProps(staticProps) {
  console.log("這是staticProps");
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

  //這個staticProps可以讓伺服器先拿道路由參數
  const params = staticProps.params;
  // console.log("staticProps", staticProps);
  console.log({ params });
  //03.09
  //在index.js替換成用api拿資料後點進單個商店會報錯
  //因為單個商店是拿假資料的id和api資料的id在互相比對
  //當然不可能會有匹配的
  //所以這邊也要call api拿資料(預設是多倫多資料)
  //03.19 因為動態取得使用者位置渲染出來的商店id並不存在於coffee stores資料裡
  //會報fail to load static props的錯
  //所以這邊要多加一個{} 避免出現上面這個錯誤
  const coffee = await getData();
  const findStoreById = coffee.find((i) => i.id.toString() === params.id);
  // const id = coffee.find((i) => i.id.toString() === params.id);
  return {
    props: {
      //03.19 改這邊 加入一個{}
      //作用就是至少讓她不會抱錯
      //而如果真的是{}的話 顯示出來的就會是我們預設的圖片和星星數而已喔!
      coffeeData: findStoreById ? findStoreById : {},
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
export const getStaticPaths = async () => {
  //如果有寫這個 那就是path先執行 ->才換getStaticProps
  //官網說明
  //If a page has Dynamic Routes and uses getStaticProps, it needs to define a list of paths to be statically generated.

  // When you export a function called getStaticPaths (Static Site Generation) from a page that uses dynamic routes, Next.js will statically pre-render all the paths specified by getStaticPaths.

  console.log("這是StaticPaths 他會比getStaticProps先執行");
  const data = await getData();
  const paths = data.map((i) => {
    return {
      params: {
        id: i.id,
      },
    };
  });
  return {
    // [{ params: { id: "0" } }, { params: { id: "1" } }],
    paths, //map本身就回傳陣列，然後每一個元素從這裡的情況來看
    //剛好就是一個{params: {id:xx}}物件
    //所以直接賦值即可
    fallback: true,

    //CH7 L82-fallback true
    //如果設成false 他就會在沒有符合id時給你看404
    //如果是true 又細分成兩種結果
    //1.如果該id存在於json檔案中(這邊都是假定完整資料皆為靜態，例如我們的資料都存在COFFEE-STORES.json中)
    //只是沒有寫到這個getStaticPaths的path的params中(例如現在id=300，但params中沒有300)，
    //那麼next會自己馬上去幫你產生那一葉的html葉面 再正常show給你看
    //這時候你會需要等等，所以下方寫了一個loading
    //3.12
    //(利用一個只有在fallback:true時會變成true的isFallback屬性去判斷是否會有fallback page(當你設定成fallback:true，next其實也算是給了你一個錯誤葉面(你看不到)，同時也在產生你要的那個params的葉面，但總之用isFallback屬性去判斷是否顯示loading就是給next一點產生你要的頁面的緩衝時間啦))

    //2.連json檔案中都沒有 那就是直接抱錯!
    //3.18更新 L113
    //是在這邊報錯 所以也可以推導這個fn是先執行的
    //大致上流程就是
    //一進入此頁面 他就會先執行getStaticPath
    //先去 getData (當然是去取預設的tronto的stores資料囉)
    //然後把那些stores的id全都回傳給params
    //也就是在跟getStaticPath講: you should keep a note of the list of id.
    //因為我等等就要用getStaticProps去pre-render了
    //現在遇到的問題則是
    //我們已經把getData改成可傳入動態params的樣子了 所以當使用者按下explore按鈕
    //就會去產生它附近的店家 當使用者再去按下任意他附近店家 想要查看詳細資料時
    //就會發現報錯了!
    //這是因為上面寫到了 現在這頁固定都是先去抓(用getStaticProps)我們預設的多倫多資料(沒傳params 參數預設值為多倫多的經緯度!)
    //那當我們點進來 商店例如是活魚餐廳
    //這id不存在id list中(因為該list中的id是從coffee stores中獲取的)
    //paths就會先進入fallback 去檢查是否真的不存在
    //如果真的沒有該id 那就是繼續執行getStaticProps啦(從中端推測的執行順序)
    //但props也是call 咖啡店的資料 它裡面怎可能會有活魚餐廳的id 所以最後就
    //報了 fail to load static props的錯誤了
  };
};

//原本的props改成initialProps 這樣比較不會搞混
const CoffeeStore = (initialProps) => {
  const {
    state: { storeList },
  } = useContext(StoreContext);
  //可以看到上面的staticProps給出的是和路由id相同的那個商店資料
  //所以假設我們是點id:0的商店
  //那我們就只會拿到他一間商店的資料
  // console.log("props", props);

  //重整單一商店葉面 router完全取不到query那些 直接空物件
  //因此導致後續一連串錯誤 = =
  const router = useRouter();
  console.log(router);
  const id = router.query.id;
  console.log(id);
  //這個是自己會去url裡面讀取的(看檔名就知道了)
  // const imgUrl = router.query.imgUrl; //這個是我們在link標籤上自己設定的
  // console.log(imgUrl);
  //不知為何從router取不到直??
  //但總之可以從getStaticProps中取得

  //3.19 這邊是為了在id不存在時
  //我們必須去context裡面存的使用者附近店家的商店列表中
  //尋找對應的id來回傳
  //他的初始值一般情況下就是預先call api獲得的資料
  //但現在要先假設他是空的 那麼就會報錯
  const [storeData, setStoreData] = useState(initialProps.coffeeData || {});
  useEffect(() => {
    //如果再單一商店葉面重整 就會抱錯XD
    //因為initialProps.coffeeData不是物件 直接變成undefined了 = =
    //undefined放到isEmpty裡面她會說沒法把那種資料型態轉成物件
    //bug...
    console.log({ data: initialProps.coffeeData });
    //如果id不存在 拿到的initialsprops就會是空的(因為getStaticProps就是回空的)
    if (isEmpty(initialProps.coffeeData)) {
      //我們就必須去context裡面取得的state.storeList裡面找對應id
      //確認state裡面的storeList是有值的
      if (storeList.length > 0) {
        //最後面的id是從路由拿的那個id喔!
        const storeFromContext = storeList.find((i) => i.id.toString() === id);

        //確認context中有找到對應商店資料(find有回傳)
        if (storeFromContext) {
          //有 就把它存入這個頁面的useState中
          setStoreData(storeFromContext);
        }
      }
    }
    //路由id有變化時(即一進入此葉面時)就去檢查有沒有拿到資料
  }, [id]);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  //In the “fallback” version of a page, the page’s props will be empty.
  //如果把取props的函式寫在if router.isFallback前面的話
  //會發現居然報錯~ 原因寫在上面了 就是因為在router.isFallback = true時
  //那個時刻 就是處在fallback ver的page
  //而那個當下 page的props就是空的喔!
  //所以有要取props的話，就必須寫在那個loading後面喔!

  //原本這一頁的資料都是從getStaticProps傳入的props裡面取這些值
  //但是現在已經把props的值放到useState裡面了
  //所以不管getStaticProps友直還是空物件 都統一從useState取喔!
  const { name, imgUrl, neighborhood, address } = storeData;

  const handleUpvote = () => console.log("投票囉!");

  return (
    <Layout>
      <Head>
        <title>{name}</title>
      </Head>
      {/* 有要共用的style應該是只能直接加在要用的元件or app.js */}
      {/* 原本這個是寫在index.js結果都讀不到，一直都是讀到global.css..*/}
      <GlobalCSS />

      <Container>
        <LeftCol>
          <LinkBox>
            <Link href="/">← Back to home</Link>
          </LinkBox>
          <NameWrapper>
            <h1>{name}</h1>
          </NameWrapper>
          <ImgWrapper>
            <Image
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
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
          {/* 雖然在函數那邊就已經做回傳的一些判斷，但這邊要是沒有值，icon也不能顯示，所以還是要寫&& */}
          {neighborhood && (
            <IconWrapper>
              <Image width="24" height="24" src="/static/icons/nearMe.svg" />
              <p>{neighborhood}</p>
            </IconWrapper>
          )}
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
