import React from "react";
import styled from "styled-components";
const Banner = ({ handleClick, buttonText }) => {
  return (
    <Wrapper>
      <Title>
        <TitleSpan>Coffee</TitleSpan>
        <TitleSpan isBlue pl isBlock inline>
          Connoisseur
        </TitleSpan>
      </Title>
      <SubTitle>Discover your local coffee shops!</SubTitle>
      <Button onClick={handleClick}>{buttonText}</Button>
    </Wrapper>
  );
};

/** 
  Breakpoints:
  ------------
  sm: min-width: 640px; //small device
  md: min-width: 768px; // medium device
  lg: min-width: 1024px; // large device
  xl: min-width: 1280px; // extra large device
  2xl: min-width: 1536px; // 2 x extra large device
**/

const mt = "margin-top: 1.25rem;";
const Wrapper = styled.div`
  @media (min-width: 1024px) {
    text-align: left;
  }
`;
const Title = styled.h1`
  letter-spacing: -0.025em;
  font-weight: 900;
  font-size: 3rem;
  line-height: 1;
`;
const TitleSpan = styled.span`
  color: ${({ isBlue }) => (isBlue ? "#579d93" : "white")};

  ${({ isBlock }) => isBlock && " display: block;"}
  @media (min-width: 1280px) {
    ${({ inline }) => inline && " display: inline;"};
    padding-left: ${({ pl }) => (pl ? ".9rem" : 0)};
  }
`;
const SubTitle = styled.p`
  color: #579d93;
  font-weight: 200;
  font-size: 1rem;
  font-size: 1.5rem;
  line-height: 2rem;
  ${mt};
`;
const Button = styled.button`
  ${mt};
  border-radius: 8px;
  background: #579d93;
  border: none;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  outline: 0;
  cursor: pointer;
  color: white;
  font-weight: 600;
  letter-spacing: 1.2px;
  z-index: 2;
  position: relative;
`;
export default Banner;
