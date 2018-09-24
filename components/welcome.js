import React from "react";
import styled from "react-emotion";
import Close from "../svg/close.svg";
import { flexCenter } from "../styles/flex";

class Welcome extends React.Component {
  close() {
    this.setState({ closed: true });
    localStorage.setItem("welcomeMessageClosed", true);
  }

  constructor(props) {
    super(props);
    this.state = {
      closed: localStorage.getItem("welcomeMessageClosed") == "true"
    };
  }

  render() {
    return (
      <Container closed={this.state.closed} onClick={e => this.close(e)}>
        <Content>
          <Image src="https://s3-us-west-2.amazonaws.com/chrissy-gunk/rocks.jpg" />
          <Title>Welcome to the Trail Gunk demo!</Title>
          <Text>
            It isn&apos;t totally done yet, but look—one doesn&apos;t simply
            build an interactive map of all your favorite parks overnight.
            <br />
            <br />
            It will work on all the latest modern browers. Currently only data
            for Washington, Utah, and Idaho are added. If you are interested in
            contributing to or following the progress of Trail Gunk, head over
            to the{" "}
            <Link
              href="https://github.com/Chrissy/trails-up"
              onClick={e => e.stopPropagation()}
            >
              Github Repo
            </Link>.
          </Text>
        </Content>
        <StyledClose />
      </Container>
    );
  }
}

const Container = styled("div")`
  ${flexCenter};
  width: 100vw;
  height: 100%;
  position: absolute;
  background: rgba(52, 70, 50, 0.9);
  flex-direction: column;
  overflow: scroll;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
  padding-top: 5em;
  display: ${p => p.closed && "none"};
`;

const Content = styled("div")`
  background: ${p => p.theme.gray2};
  width: 50vw;
  min-width: 300px;
  max-width: 600px;
  padding-bottom: ${p => p.theme.ss(9)};
  padding: 5vw;
  font-family: ${p => p.theme.bodyFont};
  border: 5px solid #fff;
  color: ${p => p.theme.brandColor};
  text-align: center;
`;

const Title = styled("div")`
  font-family: ${p => p.theme.headlineFont};
  font-size: ${p => p.theme.ts(12)};
  font-weight: 800;
  line-height: ${p => p.theme.ts(5)};
  border-bottom: 3px solid ${p => p.theme.accentColor};
  padding-bottom: ${p => p.theme.ss(2)};
  margin-top: ${p => p.theme.ts(5)};
`;

const Image = styled("img")`
  width: 30vw;
  min-width: 200px;
  min-height: 200px;
  max-width: 400px;
  max-height: 400px;
  margin-top: -20%;
  border-radius: 50%;
`;

const Text = styled("div")`
  font-size: ${p => p.theme.ts(5)};
  margin: ${p => p.theme.ss(5)} 0;
`;

const Link = styled("a")`
  color: ${p => p.theme.accentColor};
`;

const StyledClose = styled(Close)`
  position: absolute;
  top: ${p => p.theme.ts(5)};
  right: ${p => p.theme.ts(5)};
  cursor: pointer;
  width: ${p => p.theme.ts(8)};
  height: ${p => p.theme.ts(8)};
`;

export default Welcome;
