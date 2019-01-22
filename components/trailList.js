import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "react-emotion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Svg from "./svg";
import theme from "../styles/theme";
import { flexCenter, flexHorizontalCenter } from "../styles/flex";

const TrailList = ({ trails, unselectTrail, setTrailSelectedId }) => {
  const onDragEnd = ({ source, destination }) => {
    setTrailSelectedId(source.index, destination.index);
  };

  const listElement = trail => {
    return (
      <ListElement key={trail.uniqueId} i={trail.uniqueId}>
        <Name>{trail.name}</Name>
        <CloseContainer onClick={() => unselectTrail(trail.uniqueId)}>
          <StyledClose src="exit" />
        </CloseContainer>
      </ListElement>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable" direction="horizontal">
        {provided => (
          <div
            ref={provided.innerRef}
            css={container}
            {...provided.droppableProps}
          >
            {trails.map((item, index) => (
              <Draggable
                key={item.id}
                style={{ display: "contents" }}
                draggableId={item.id}
                index={index}
              >
                {provided => (
                  <div
                    style={{ display: "contents" }}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {listElement(item, index)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

TrailList.propTypes = {
  unselectTrail: PropTypes.func,
  setTrailSelectedId: PropTypes.func,
  trails: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      hasElevationData: PropTypes.bool,
      id: PropTypes.number,
      points: PropTypes.arrayOf(
        PropTypes.shape({
          distanceFromPreviousPoint: PropTypes.number
        })
      )
    })
  )
};

const container = css`
  margin-top: ${theme.ss(0.5)};
  padding: 0 ${theme.ss(0.5)};
  ${flexHorizontalCenter};
  flex-wrap: wrap;
`;

const ListElement = styled("li")`
  ${flexHorizontalCenter};
  border-radius: 0.5em;
  background-color: ${p => p.theme.trailColor(p.i - 1)};
  box-sizing: border-box;
  color: #fff;
  font-size: ${p => p.theme.ts(0.75)};
  font-weight: 600;
  padding-left: ${p => p.theme.ss(0.75)};
  margin-right: ${p => p.theme.ss(0.75)};
  margin-bottom: ${p => p.theme.ss(0.5)};
  height: 2em;
`;

const Name = styled("div")`
  margin-bottom: 0.1em;
`;

const CloseContainer = styled("div")`
  width: 1.5em;
  padding-right: ${p => p.theme.ss(0.5)};
  height: 100%;
  ${flexCenter};
  cursor: pointer;
`;

const StyledClose = styled(Svg)`
  width: 0.66em;
  height: 0.66em;
  color: ${p => p.theme.accentColorTintLighter};
`;

export default TrailList;
