import React from "react";
import PropTypes from "prop-types";
import createHistory from "history/createBrowserHistory";
import { connect } from "react-redux";
import { fromJS, is } from "immutable";
import { parse, stringify } from "query-string";
import { selectTrail, selectBoundary } from "../state/actions";

class ConnectStateToRoute extends React.Component {
  constructor(props) {
    super(props);

    this.history = createHistory();
    const query = parse(window.location.search);

    this.state = {
      boundary: query.boundary,
      lastSelectedTrail: null,
      lastSelectedBoundary: null
    };
  }

  componentDidMount() {
    if (this.state.boundary)
      return this.props.selectBoundary({ id: parseInt(this.state.boundary) });
    //if (query.trails)
    //return query.trails.map(({id, bounds}) => console.log(id, bounds));
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
    const { lastSelectedTrail, lastSelectedBoundary } = this.state;

    if (
      !trails.length &&
      !boundary &&
      !handles.length &&
      (lastSelectedTrail || lastSelectedBoundary)
    )
      return this.history.replace("/");

    if (boundary && boundary.bounds) {
      if (lastSelectedBoundary == boundary.id) return;

      this.setState({ lastSelectedBoundary: boundary.id });
      return this.history.replace(
        "/?" +
          stringify({
            boundary: boundary.id,
            bounds: boundary.bounds.map(b => parseFloat(b.toFixed(2)))
          })
      );
    }

    if (trails.length) {
      const previousTrailIds = prevProps.trails.map(t => t.id);
      const trailIds = trails.map(t => t.id);
      if (is(fromJS(previousTrailIds), fromJS(trailIds))) return;
      return this.history.replace(
        "/?" +
          stringify({
            trails: trails.map(({ id, bounds }) => stringify({ id, bounds }))
          })
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

  return {
    trails: sortedTrails,
    boundary: boundary,
    handles: state.handles
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
