import { createGlobalStyle } from "styled-components";
export default createGlobalStyle`
 /* glass-morphism */
.glass {
  background: hsla(0, 0%, 100%, 0.4);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border: 1px solid hsla(0, 0%, 100%, 0.2);
}

.glass:hover {
  background: hsla(0, 0%, 100%, 0.7);
  border: 1px solid #fff;
}

`;
