import React from "react";
import Svg from "./svg";
import styled from "react-emotion";
import { flexCenter } from "../styles/flex";

const Header = () => {
  return (
    <Container>
      <StyledLogo src="logo" />
      <CircleContainer>
        <StyledCircle src="circle" />
      </CircleContainer>
    </Container>
  );
};

const Container = styled("div")`
  ${flexCenter};
  background: ${p => p.theme.gray1};
  position: relative;
  z-index: 2;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 10px 5px;
`;

const StyledLogo = styled(Svg)`
  width: 150px;
  height: 100%;
  line-height: 0;
  position: relative;
  z-index: 1;

  path {
    fill: ${p => p.theme.brandColor};
  }
`;

const CircleContainer = styled("div")`
  width: 100px;
  height: 50%;
  overflow: hidden;
  left: 50%;
  top: 100%;
  position: absolute;
  transform: translate(-45.5%, 0);
`;

const StyledCircle = styled(Svg)`
  color: ${p => p.theme.gray1};
  width: 100%;
  height: 50px;
  top: -45px;
  position: absolute;
  filter: drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.1));
`;

export default Header;
