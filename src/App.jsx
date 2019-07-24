import React, { Component } from "react";
import ListEdit from "./ListEdit";
import LoadFile from "./LoadFile";
import SaveFile from "./SaveFile";
import Logo from "./img/logo.svg";
import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";

import "react-accessible-accordion/dist/fancy-example.css";

import "./App.css";

export const SQL = new Worker("js/worker.sql.js");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      db: null,
      loaded: false,
      loading: false
    };
    this.loadDbFile = this.loadDbFile.bind(this);
    this.swapDbLine = this.swapDbLine.bind(this);
    this.ListEditComponent = React.createRef();
  }

  componentDidMount() {
    if (typeof twttr === "undefined") {
      var twitterjs = document.createElement("script");
      twitterjs.async = true;
      twitterjs.src = "//platform.twitter.com/widgets.js";
      document.getElementsByTagName("body")[0].appendChild(twitterjs);
    } else {
      twttr.widgets.load();
    }
  }

  // データベースを読み込む
  loadDbFile(filePath) {
    this.setState({ loading: true });
    const reader = new FileReader();
    reader.onload = e => {
      console.log(SQL);
      const array_ui8 = new Uint8Array(reader.result);
      let dbdata;

      console.log("Database opened");

      SQL.onmessage = event => {
        console.log(event.data); // The result of the query
        if (event.data.id === 2) {
          this.setState({ loading: false, loaded: true });
          dbdata = event.data.results;
          this.ListEditComponent.current.setList(dbdata);
        }
      };

      SQL.postMessage({
        id: 1,
        action: "open",
        buffer: array_ui8
      });

      SQL.postMessage({
        id: 2,
        action: "exec",
        sql: "select _PW_ID,subviewfilepath from subviewimagecategory"
      });

      SQL.onerror = e => {
        console.log("Worker error: ", e);
        alert(
          "ファイル読み込みエラー\nクリスタのサブビューファイルではないかもしれません"
        );
        this.setState({
          loaded: false,
          loading: false
        });

        return;
      };
    };

    try {
      reader.readAsArrayBuffer(filePath);
    } catch (error) {
      alert("ファイル読み込みエラー");
    }
  }

  queryLoadFinish(files) {
    console.log("sqlSave");
    this.setList(files);
  }

  swapDbLine(src, dest) {
    if (src === dest) return;

    let srcdb, destdb;
    SQL.postMessage({
      id: 11,
      action: "exec",
      sql:
        "select _PW_ID,subviewfilepath,subviewscale,subviewpositionx,subviewpositiony,subviewangle,subviewreversehorizontal,subviewreversevertical from subviewimagecategory where _PW_ID=" +
        src
    });

    SQL.onmessage = event => {
      if (event.data.id === 11) {
        srcdb = event.data.results;
        SQL.postMessage({
          id: 12,
          action: "exec",
          sql:
            "select _PW_ID,subviewfilepath,subviewscale,subviewpositionx,subviewpositiony,subviewangle,subviewreversehorizontal,subviewreversevertical from subviewimagecategory where _PW_ID=" +
            dest
        });
      }
      if (event.data.id === 12) {
        destdb = event.data.results;

        const srctemp = srcdb[0].values[0];

        const ssql =
          "update subviewimagecategory SET subviewfilepath='" +
          srctemp[1] +
          "',subviewscale='" +
          srctemp[2] +
          "',subviewpositionx='" +
          srctemp[3] +
          "',subviewpositiony='" +
          srctemp[4] +
          "',subviewangle='" +
          srctemp[5] +
          "',subviewreversehorizontal='" +
          srctemp[6] +
          "',subviewreversevertical='" +
          srctemp[7] +
          "' where _PW_ID='" +
          dest +
          "'";

        console.log(ssql);
        SQL.postMessage({
          id: 13,
          action: "exec",
          sql: ssql
        });
      }
      if (event.data.id === 13) {
        console.log(destdb);
        const desttemp = destdb[0].values[0];
        const dsql =
          "update subviewimagecategory SET subviewfilepath='" +
          desttemp[1] +
          "',subviewscale='" +
          desttemp[2] +
          "',subviewpositionx='" +
          desttemp[3] +
          "',subviewpositiony='" +
          desttemp[4] +
          "',subviewangle='" +
          desttemp[5] +
          "',subviewreversehorizontal='" +
          desttemp[6] +
          "',subviewreversevertical='" +
          desttemp[7] +
          "' where _PW_ID='" +
          src +
          "'";
        SQL.postMessage({
          id: 14,
          action: "exec",
          sql: dsql
        });
      }
      if (event.data.id === 14) {
        SQL.postMessage({
          id: 15,
          action: "exec",
          sql:
            "select _PW_ID,subviewfilepath,subviewscale from subviewimagecategory"
        });
      }
      if (event.data.id === 15) {
        console.log("edited");
      }
    };
  }

  render() {
    return (
      <div className="App">
        <div className="App-title-text">
        <Logo title="CLIP STUDIO SUBVIEW SORT TOOL"/>
          
          <h5>クリスタのサブビューのアイテムを並び替えるだけのツール</h5>
        </div>
        <div className="App-author">
          作った人:<a href="https://blog.horizon-glow.com/">スイゲンソバ</a>
        </div>
        <div className="App-sns">
          <a
            href="https://twitter.com/share?ref_src=twsrc%5Etfw"
            className="twitter-share-button"
            data-show-count="false"
          >
            Tweet
          </a>
        </div>
        <div className="App-desc">
          <p>
            CELSYS CLIP STUDIO PAINT
            PRO/EXのサブビューに登録されたアイテムの順番を並び替えます。
          </p>
          <p>
            このツールは設定ファイルをローカルPCのみで処理します。(sql.jsすげえ)
            <br />
            <b>設定ファイルをどこかに送信することはありません。</b>
          </p>
          <p>
            確認したクリスタのバージョン: 1.86<br/>
            以下のブラウザで確認:Chrome/Mozilla Firefox/Edge/Safari
          </p>
          <div>
            <Accordion>
              <AccordionItem expanded={true}>
                <AccordionItemTitle>
                  <h2>使い方</h2>

                  <div className="accordion__arrow" role="presentation" />
                </AccordionItemTitle>
                <AccordionItemBody>
                  <div>
                    <ol type="1">
                      <li>サブビューの設定ファイルであるdefault.psvをLOAD</li>
                      <li>
                        画像へのパスが記されたアイテムリストをD&Dで並び替え
                      </li>
                      <li>並び替えが終わったらSAVE</li>
                    </ol>
                    ダウンロード先はブラウザの設定次第です。
                    <br />
                    デフォルトだと<span className="App-desc-Att"><b>ダウンロードフォルダに保存されているので、読み込んだフォルダへコピー</b></span>して上書きしてください。
                    <br />
                    クリスタ本体のバージョンアップにより対応しなくなる可能性がありますので、default.psvは<b>バックアップ</b>をとってからお使いください。
                    <br />
                    サブビューの設定ファイルはdefault.psvは以下の場所にあります。
                    <table>
                      <tbody>
                        <tr>
                          <th>Windowsの場合</th>
                          <td>
                            マイドキュメント\CELSYS\CLIPStudioPaintVer1_5_0\SubView\
                          </td>
                        </tr>
                        <tr>
                          <th>Macの場合</th>
                          <td>
                            ボリューム名\ユーザ\[ユーザー名]\ライブラリ\CELSYS\CLIPStudioPaintVer1_5_0\SubView\
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionItemBody>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <div className="App-loadButton">
          <LoadFile loadedFunc={filePath => this.loadDbFile(filePath)} loading={this.state.loading} />
          <SaveFile loaded={this.state.loaded} />
        </div>
        <ListEdit
          listedFunc={(src, dest) => this.swapDbLine(src, dest)}
          ref={this.ListEditComponent}
        />
        <div className="App-foot">build 20190228</div>
      </div>

    );
  }
}
export default App;
