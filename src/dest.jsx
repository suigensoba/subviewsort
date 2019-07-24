import "rc-collapse/assets/index.css";

import Collapse, { Panel } from "rc-collapse";
import React from "react";
import "./App.css";

class Desc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accordion: false
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(activeKey){
    this.setState({
      activeKey
    });
  };

  getItems() {
    const items = [];
    const key = 1;
    items.push(
      <Panel header={`このツールについて`} key={key}>
        <div>
        CELSYS CLIP STUDIO PAINT PRO/EXのサブビューに登録されたアイテムの順番を並び替えるツールです。
        サブビューが定義されているdefault.psvは以下の場所にあります。
        <li>
          Windowsの場合
          マイドキュメント\CELSYS\CLIPStudioPaintVer1_5_0\SubView\
        </li>
        </div>
      </Panel>
    );
    return items;
  }

  setActivityKey(){
    this.setState({
      activeKey: ["2"]
    });
  };

  render() {
    const accordion = this.state.accordion;
    const btn = "Mode: accordion";
    const activeKey = this.state.activeKey;
    return (
      <div className="drag-and-drop-area-text2">
        <Collapse
          accordion={accordion}
          onChange={this.onChange}
          activeKey={activeKey}
        >
          {this.getItems()}

        </Collapse>
      </div>
    );
  }
}

export default Desc;
