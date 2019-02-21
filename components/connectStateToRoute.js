import React from "react";
import PropTypes from "prop-types";
import createHistory from "history/createBrowserHistory";
import { connect } from "react-redux";
import { fromJS, is } from "immutable";
import { parse, stringify } from "query-string";
import { selectTrail, selectBoundary } from "../state/actions";

class ConnectStateToRoute extends React.Component {
  componentDidMount() {
    this.history = createHistory();
    const query = parse(window.location.search);
    if (query.boundary)
      return this.props.selectBoundary({ id: parseInt(query.boundary) });
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

    if (
      !trails.length &&
      !boundary &&
      !handles.length &&
      (prevProps.trails.length ||
        prevProps.boundary ||
        prevProps.handles.length)
    )
      return this.history.replace("/");

    if (boundary) {
      if (prevProps.boundary && prevProps.boundary.id == boundary.id) return;
      return this.history.replace(
        "/?" +
          stringify({
            boundary: boundary.id
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
    return this.props.children;
  }
}

ConnectStateToRoute.propTypes = {
  trails: PropTypes.array,
  boundary: PropTypes.object,
  handles: PropTypes.array,
  children: PropTypes.node,
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
