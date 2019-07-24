import React, { Component } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `none`
  }));

const getFileItems = files =>
  Array.from(files[0].values, (value, index) => value).map(x => ({
    id: `${x[0]}`,
    content: `${x[1]}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 4;

let dbData = {};

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: '0.2vh',
  margin: `0 2vw ${grid}px 2vw`,
  fontSize: `0.8vw`,
  textAlign: `left`,
  color: '#fff',

  // change background colour if dragging
  background: isDragging ? "rgb(47, 138, 224)" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
 // background: isDraggingOver ? "white" : "white",
  padding: grid,
  width: `82vw`,
  margin:`1vh`
});

class ListEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getItems(1),
      isLoaded: false
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  setList(files) {
    console.log(getFileItems(files));
    this.setState({
      items: getFileItems(files),
      isLoaded: true
    });
    this.dbData = Object.assign(dbData, files);
  }

  dbData() {}

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    if (this.state.isLoaded) {
      const id1 = result.source.index;
      const id2 = result.destination.index;
      const src = this.state.items[id1].id;
      const dest = this.state.items[id2].id;
      console.log(dest);
      this.props.listedFunc(src, dest);
    }

    this.setState({
      items
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.content}
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
  }
}
export default ListEdit;
