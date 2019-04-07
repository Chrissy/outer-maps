import React from "react";
import PropTypes from "prop-types";
import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import { featureCollection } from "@turf/helpers";
import createHistory from "history/createBrowserHistory";
import { connect } from "react-redux";
import { fromJS, is } from "immutable";
import { parse, stringify } from "query-string";
import { selectTrail, selectBoundary } from "../state/actions";

class ConnectStateToRoute extends React.Component {
  constructor(props) {
    super(props);

    this.history = createHistory();
    const query = parse(window.location.search, { arrayFormat: "bracket" });

    this.state = {
      boundary: query.boundary,
      trails: query.trails ? query.trails.map(id => parseInt(id)) : [],
      bounds: query.bounds,
      handles: query.handles,
      lastSelectedTrail: null,
      lastSelectedBoundary: null
    };
  }

  componentDidMount() {
    const { boundary, trails, handles } = this.state;

    if (boundary)
      return this.props.selectBoundary({ id: parseInt(this.state.boundary) });
    if (trails.length) {
      trails.forEach((id, index) => {
        this.props.selectTrail({
          properties: {
            id: parseInt(id)
          },
          withHandles: handles.slice(index * 2, index * 2 + 2)
        });
      });
    }
  }

  shouldComponentUpdate(prevProps) {
    const { trails, boundary, handles } = this.props;

    return (
      trails.length ||
      boundary ||
      handles.length ||
      prevProps.trails.length ||
      prevProps.boundary ||
      prevProps.handles.length
    );
  }

  componentDidUpdate(prevProps) {
    const { trails, boundary, handles } = this.props;
    const { lastSelectedBoundary } = this.state;

    if (!boundary && !trails.length) return this.history.replace("/");

    if (boundary && boundary.bounds) {
      if (lastSelectedBoundary == boundary.id) return;

      this.setState({ lastSelectedBoundary: boundary.id });

      return this.history.replace(
        "/?" +
          stringify(
            {
              boundary: boundary.id,
              bounds: boundary.bounds.map(b => parseFloat(b.toFixed(2)))
            },
            { arrayFormat: "bracket" }
          )
      );
    }

    if (trails.length) {
      const previousTrailIds = prevProps.trails.map(t => t.id);
      const trailIds = trails.map(t => t.id);
      const previousHandleIndeces = prevProps.handles.map(h => h.index);
      const handleIndeces = handles.map(h => h.index);

      if (
        is(fromJS(previousTrailIds), fromJS(trailIds)) &&
        is(fromJS(previousHandleIndeces), fromJS(handleIndeces))
      )
        return;

      const readyTrails = trails.filter(t => t.bounds);

      const bounds = readyTrails.length
        ? bbox(
          featureCollection(
            readyTrails.map(({ bounds }) => bboxPolygon(bounds))
          )
        )
        : this.state.bounds;

      return this.history.replace(
        "/?" +
          stringify(
            {
              trails: trailIds,
              bounds: bounds.map(b => parseFloat(b).toFixed(2)),
              handles: handleIndeces
            },
            { arrayFormat: "bracket" }
          )
      );
    }
  }

  render() {
    return this.props.children({ center: this.state.center });
  }
}

ConnectStateToRoute.propTypes = {
  trails: PropTypes.array,
  boundary: PropTypes.object,
  handles: PropTypes.array,
  children: PropTypes.func,
  selectBoundary: PropTypes.func,
  selectTrail: PropTypes.func
};

const mapStateToProps = state => {
  const sortedTrails = state.trails
    .filter(t => t.selected)
    .sort((a, b) => a.selectedId - b.selectedId);
  const boundary = state.boundaries.find(t => t.selected);
  const handles = sortedTrails.reduce((handles, trail) => {
    return [
      ...handles,
      ...state.handles.filter(h => h.uniqueId == trail.uniqueId)
    ];
  }, []);

  return {
    trails: sortedTrails,
    boundary: boundary,
    handles: handles
  };
};

const mapDispatchToProps = dispatch => {
  return {
    selectTrail: trail => dispatch(selectTrail(trail)),
    selectBoundary: boundary => dispatch(selectBoundary(boundary))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectStateToRoute);
