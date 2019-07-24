import React, { Component } from "react";
import saveAs from "file-saver";
import SaveIcon from "./img/Rounded-Icon-Set-Download.svg";
import {SQL} from "./App";

class SaveFile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    console.log("click");
    console.log(this.props.loaded);
    if (this.props.loaded) {
      SQL.postMessage({
        id: 21,
        action: "export"
      });

      SQL.onmessage = event => {
        // const array_ui8 = new Uint8Array(event.data);
        console.log(event.data);
        const blob = new Blob([event.data.buffer], { type: "text/csv" });
        saveAs.saveAs(blob, "default.psv");
      };
    }
  }

  render() {
    return (
      <div
        className="save-button"
        onClick={() => this.handleClick()}
      >
      <div className="save-button-body">
        <div className="save-button-icon">
        <SaveIcon width={32} height={32} /></div>
        <div  className="save-button-desc">SAVE</div>
      </div>

      </div>
    );
  }
}

export default SaveFile;
