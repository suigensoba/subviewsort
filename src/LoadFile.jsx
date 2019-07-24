import React, { Component } from "react";
import Dropzone from "react-dropzone";
import "./App.css";
import UpLoadIcon from "./img/Rounded-Icon-Set-Upload.svg";
import ReactLoading from "react-loading";

const maxFileSize = 10000000;

// ファイルサイズが大きすぎないか調べる
const fileSizeCheck = (files, rejectedFiles) => {
  // 不正なファイルを調べる
  if (rejectedFiles && rejectedFiles.length > 0) {
    const currentRejectFile = rejectedFiles[0];
    if (currentRejectFile.size > maxFileSize) {
      alert("This file is too big size!");
      return false;
    }
  }
  // 正しいファイルも調べる
  if (files && files.length > 0) {
    const currentFile = files[0];
    if (currentFile.size > maxFileSize) {
      alert("This file is too big size!");
      return false;
    }
  }
  return true;
};

class LoadFile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleFileDrops = this.handleFileDrops.bind(this);
  }

  handleFileDrops(files, rejectedFiles) {
    if (fileSizeCheck(files, rejectedFiles)) {
      this.props.loadedFunc(files[0]);
    }
  }

  render() {
    return (
      <Dropzone onDrop={this.handleFileDrops} maxSize={maxFileSize}>
        {({ getRootProps, getInputProps }) => (
          <div className="load-button" {...getRootProps()}>
            <input {...getInputProps()} />

            <div className="save-button-body">
              {!this.props.loading && (
                <span>
                  <div className="save-button-icon">
                    <UpLoadIcon width={32} height={32} />
                  </div>
                  <div className="save-button-desc">LOAD</div>
                </span>
              )}
              {this.props.loading && (
                <span>
                  <div className="save-button-icon">
                    <ReactLoading
                      width={32}
                      height={32}
                      type={"spin"}
                      color={"#777"}
                    />
                  </div>
                  <div className="save-button-desc">LOADING</div>
                </span>
              )}
            </div>
          </div>
        )}
      </Dropzone>
    );
  }
}
export default LoadFile;
