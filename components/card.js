import React from "react";
import Link from "next/link";
import Image from "next/image";
import styled from "styled-components";
const Card = ({ href, shopName, imgUrl }) => {
  return (
    <Link
      href={{
        pathname: href,
        query: { imgUrl },
      }}
    >
      <Container>
        <CardLink>
          <HeaderContainer>
            <Header>{shopName}</Header>
          </HeaderContainer>
          <ImgContainer>
            <Image src={imgUrl} width={260} height={160} />
          </ImgContainer>
        </CardLink>
      </Container>
    </Link>
  );
};
const Container = styled.div`
  cursor: pointer;
  width: 250px;
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(13px);
  -webkit-backdrop-filter: blur(13px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  transition: all 0.5s ease-in;
  &:hover {
    background: hsla(0, 0%, 100%, 0.7);
    border: 1px solid #fff;
  }
  border-radius: 0.75rem;
`;
const CardLink = styled.a`
  /* margin: auto;
  box-shadow: 0 0 transparent, 0 0 #0000, 0 0 transparent, 0 0 #0000,
    0 0 transparent;
  border: 1px solid red;
  border-radius: 0.75rem; */
  margin: auto;
`;
const Header = styled.h2`
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.25rem /* 20px */;
  line-height: 1.75rem /* 28px */;
  font-weight: 800;
  overflow: hidden;
  /* width: 16rem /* 256px */; */
`;
const HeaderContainer = styled.div`
  margin-top: 0.75rem /* 12px */;
  margin-bottom: 0.75rem /* 12px */;
`;
const ImgContainer = styled.div`
  img {
    width: 100%;
    object-fit: cover;
    border-radius: 0.75rem;
  }
`;
export default Card;
