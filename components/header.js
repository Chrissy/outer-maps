import React from "react";
import Wordmark from "../svg/wordmark.svg";
import styled from "react-emotion";
import { flexCenter } from "../styles/flex";

const Header = () => {
  return (
    <Container>
      <Mark src="/mark.png" />
      <StyledWordmark />
    </Container>
  );
};

const Container = styled("div")`
  ${flexCenter};
  background: ${p => p.theme.gray2};
`;

const Mark = styled("img")`
  width: ${p => p.theme.ss(8)};
  height: ${p => p.theme.ss(8)};
  border-radius: 50%;
  border: 1px solid white;
  margin-right: ${p => p.theme.ss(2)};
`;

const StyledWordmark = styled(Wordmark)`
  width: 100px;
  height: auto;
  line-height: 0;

  path {
    fill: ${p => p.theme.brandColor};
  }
`;

export default Header;
