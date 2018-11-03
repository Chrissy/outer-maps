import React from "react";
import PropTypes from "prop-types";
import styled from "react-emotion";
import LoadingSpinner from "./loadingSpinner";
import FlatMercatorViewport from "../node_modules/viewport-mercator-project/dist/flat-mercator-viewport";
import pin from "../data/pin";

class Terrain extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = {
      imageLoaded: false
    };
  }

  projectPoints({ points, zoom, center }) {
    if (!points || !zoom || !center) return [];

    const projecter = FlatMercatorViewport({
      longitude: center[0],
      latitude: center[1],
      zoom: zoom - 1,
      width: 1024,
      height: 1024
    });

    return points.map(p => {
      return { ...p, coordinates: projecter.project(p.coordinates) };
    });
  }

  drawPath(points, ctx) {
    if (!points.length) return;

    ctx.beginPath();
    ctx.moveTo(...points[0].coordinates);
    points.slice(1).forEach(p => ctx.lineTo(...p.coordinates));
    ctx.lineJoin = "round";
    ctx.lineWidth = 8;
    ctx.strokeStyle = "white";
    ctx.setLineDash([10, 10]);
    ctx.stroke();

    const image = new Image();
    const [x1, y1] = points[0].coordinates;
    const [x2, y2] = points[points.length - 1].coordinates;
    const pinWidth = 44;
    const pinHeight = 60;
    image.onload = () => {
      ctx.drawImage(
        image,
        x1 - pinWidth / 2,
        y1 - pinHeight - 2,
        pinWidth,
        pinHeight
      );
      ctx.drawImage(
        image,
        x2 - pinWidth / 2,
        y2 - pinHeight - 2,
        pinWidth,
        pinHeight
      );
    };
    image.src = pin;
  }

  componentDidUpdate() {
    const canvas = this.canvas.current;
    const ctx = canvas.getContext("2d");
    const { zoom, center } = this.props;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (this.props.points && this.props.points.length && this.imageIsLoaded()) {
      this.props.points.map(points => {
        this.drawPath(this.projectPoints({ points, zoom, center }), ctx);
      });
    }
  }

  imageUrl() {
    return `/api/terrain/${this.props.center.join("/")}/${this.props.zoom}.jpg`;
  }

  handleImageLoaded() {
    this.setState({ loadedImage: this.imageUrl() });
  }

  imageIsLoaded() {
    return this.state.loadedImage == this.imageUrl();
  }

  render() {
    const imageIsLoaded = this.imageIsLoaded();

    return (
      <Container>
        <Img
          src={`/api/terrain/${this.props.center.join("/")}/${
            this.props.zoom
          }.jpg`}
          onLoad={this.handleImageLoaded.bind(this)}
          visible={imageIsLoaded}
        />
        <Canvas
          innerRef={this.canvas}
          visible={imageIsLoaded}
          width="1026"
          height="1026"
        />
        <StyledLoadingSpinner speed="1s" visible={!imageIsLoaded} />
      </Container>
    );
  }
}

Terrain.propTypes = {
  points: PropTypes.array,
  shape: PropTypes.bool,
  paths: PropTypes.bool,
  zoom: PropTypes.number,
  center: PropTypes.array
};

const Container = styled("div")`
  width: 100%;
  max-height: 380px;
  height: 42vw;
  background-color: ${p => p.theme.gray7};
  position: relative;
  overflow: hidden;

  @media (max-width: 600px) {
    height: 250px;
  }
`;

const base = `
  transform: translateY(-50%) translateX(-50%);
  left: 50%;
  top: 50%;
  position: absolute;
  opacity: 0;
  transition: .2s opacity;
`;

const StyledLoadingSpinner = styled(({ className, speed }) => (
  <LoadingSpinner className={className} speed={speed} />
))`
  ${base};
  width: ${p => p.theme.ss(2)};
  height: ${p => p.theme.ss(2)};
  opacity: ${p => (p.visible ? 1 : 0)};
`;

const Img = styled("img")`
  ${base};
  width: 100%;
  height: auto;
  opacity: ${p => (p.visible ? 1 : 0)};
`;

const Canvas = styled("canvas")`
  ${base};
  width: 100%;
  height: auto;
  opacity: ${p => (p.visible ? 1 : 0)};
`;

export default Terrain;
