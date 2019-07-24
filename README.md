This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# SUBVIEW SORT TOOL

## これは何？

Celsys社のペイントソフトウェア「CLIP STUDIO PAINT EX/PRO」のサブビューファイルを編集するウェブアプリです。  
サブビューファイルの順番入れ替え機能が~~なかなか実装され~~ないので作りました。

## 使い方

設定ファイルを読み込んでD&Dでお好みに並び替えて出力するだけです。  
ファイルの位置などの詳しいことは[Pagesで公開しているアプリ](https://suigensoba.github.io/subviewtool/)を参照下さい。

sql.jsを使用しているので設定ファイルは送信されずにwebブラウザ内でこねこねされます。  
sqlite3ファイルのまま読み込んで、並び替えをするごとにJavaScriptでSQL文を発行してレコードを入れ替えているだけです。  
sql.jsすごい。

## 使用したライブラリなど

react  
webpack  
sql.js