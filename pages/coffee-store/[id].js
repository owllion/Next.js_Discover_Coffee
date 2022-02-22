import { useRouter } from "next/router";
import React from "react";
import Link from "next/Link";
import Head from "next/Head";
import Image from "next/image";
import styled from "styled-components";

const CoffeeStore = () => {
  const router = useRouter();
  const query = router.query.id;
  const imgUrl = router.query.imgUrl;
  return (
    <Container>
      <Head>
        <title>{query}</title>
      </Head>
      <Link href="/">Back to home</Link>
      <h1>shop id: {router.query.id}</h1>
      <Image src={imgUrl} width={400} height={250} />
    </Container>
  );
};
const Container = styled.div`
  padding: 5rem;
`;
export default CoffeeStore;
