import { createGlobalStyle } from "styled-components";
export default createGlobalStyle`
 /* glass-morphism */
.glass {
  /* background: hsla(0, 0%, 100%, 0.4);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid hsla(0, 0%, 100%, 0.2);
  transition: all 0.5s ease-in; */
   backdrop-filter: blur(10px);
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
}


`;
