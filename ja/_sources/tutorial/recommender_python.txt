Python
==================

ここではPython版のRecommenderサンプルプログラムの解説をします。

-----------------------------------
ソースコード
-----------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするnpb_similar_player.jsonと野手データの学習を行うUpdate.py、推薦を実行して結果を出力するAnalyze.py、
また学習用データとしてbaseball.csvを使用します。
以下にnpb_similar_player.jsonとUpdate.pyおよびAnalyze.pyのソースコードを記載します。

**npb_similar_player.json**

.. code-block:: python

 01 : {
 02 :   "method": "inverted_index",
 03 :   "converter": {
 04 :     "string_filter_types": {},
 05 :     "string_filter_rules": [],
 06 :     "num_filter_types": {},
 07 :     "num_filter_rules": [],
 08 :     "string_types": {},
 09 :     "string_rules": [],
 10 :     "num_types": {},
 11 :     "num_rules": [
 12 :       {"key" : "*", "type" : "num"}
 13 :     ]
 14 :   },
 15 :   "parameter": {}
 16 : }


**Update.py**

.. code-block:: python

 01 : #!/usr/bin/env python
 02 : # -*- coding: utf-8 -*-
 03 : 
 04 : import sys, json
 05 : from jubatus.recommender import client
 06 : from jubatus.recommender import types
 07 : 
 08 : NAME = "recommender_baseball";
 09 : 
 10 : if __name__ == '__main__':
 11 :     # 1. Jubatus Serverへの接続設定
 12 :     recommender = client.recommender("127.0.0.1",9199)
 13 :     # 2. 学習用データの準備
 14 :     for line in open('dat/baseball.csv'):
 15 :         pname, team, bave, games, pa, atbat, hit, homerun, runsbat, stolen, bob, hbp, strikeout, sacrifice, dp, slg, obp, ops, rc27, xr27 = line[:-1].split(',')
 16 :         datum = types.datum(
 17 :         [
 18 :           ["チーム", team]
 19 :         ],
 20 :         [
 21 :           ["打率", float(bave)],
 22 :           ["試合数", float(games)],
 23 :           ["打席", float(pa)],
 24 :           ["打数", float(atbat)],
 25 :           ["安打", float(hit)],
 26 :           ["本塁打", float(homerun)],
 27 :           ["打点", float(runsbat)],
 28 :           ["盗塁", float(stolen)],
 29 :           ["四球", float(bob)],
 30 :           ["死球", float(hbp)],
 31 :           ["三振", float(strikeout)],
 32 :           ["犠打", float(sacrifice)],
 33 :           ["併殺打", float(dp)],
 34 :           ["長打率", float(slg)],
 35 :           ["出塁率", float(obp)],
 36 :           ["OPS", float(ops)],
 37 :           ["RC27", float(rc27)],
 38 :           ["XR27", float(xr27)]
 39 :         ]
 40 :         )
 41 :         # 3. データの学習（学習モデルの更新）
 42 :         recommender.update_row(NAME, pname, datum)
 43 : 

**Analyze.py**

.. code-block:: python

 01 : #!/usr/bin/env python
 02 : # -*- coding: utf-8 -*-
 03 : 
 04 : import sys
 05 : from jubatus.recommender import client
 06 : from jubatus.recommender import types
 07 : 
 08 : NAME = "recommender_baseball";
 09 : 
 10 : if __name__ == '__main__':
 11 :     # 1. Jubatus Serverへの接続設定
 12 :     recommender = client.recommender("127.0.0.1",9199)
 13 :     # 2. 推薦用データの準備
 14 :     for line in open('dat/baseball.csv'):
 15 :       pname, team, bave, games, pa, atbat, hit, homerun, runsbat, stolen, bob, hbp, strikeout, sacrifice, dp, slg, obp, ops, rc27, xr27 = line[:-1].split(',')
 16 :       # 3. 学習モデルに基づく推薦
 17 :       sr = recommender.similar_row_from_id(NAME, pname , 4)
 18 :       # 4. 結果の出力
 19 :       print "player ", pname,  " is similar to :", sr[1][0], sr[2][0], sr[3][0] 
 20 : 



--------------------------------
解説
--------------------------------

**npb_similar_player.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下の通りです。

* method

 分類に使用するアルコリズムを指定します。
 今回は、転置インデックスを利用したいので、"inverted_index"を指定します。
 Recommenderで指定できるアルゴリズムは上記以外に、"minhash"、"lsh"、"euclid_lsh"があります。

* converter

 特徴変換の設定を指定します。
 ここでは、"num_rules"を設定をしています。

 "num_rules"は数値特徴の抽出規則を指定します。
 "key"は"*"つまり、すべての"key"に対して、"type"は"num"なので、指定された数値をそのまま重みに利用する設定です。
 具体的には、打率が"0.33"であれば"0.33"を、打点が"30"であれば"30"を重みとします。

 "string_rules"は文字列特徴の抽出規則を指定します。
 今回は文字列は使用しないので指定していません。
 
* parameter

 アルゴリズムに渡すパラメータを指定します。methodに応じて渡すパラメータは異なります。
 methodで“inverted_index”を指定していますので、設定不要です。


**Update.py**

 学習と推薦の手順を説明します。

 Recommenderのクライアントプログラムは、jubatus.Recommenderクラス内で定義されているRecommenderClientクラスを利用して作成します。
 使用するメソッドは、1データ分の学習を行うupdate_rowメソッドと、与えられたデータから推薦を行うestimateメソッドの2つです。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（33行目）。
  Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号，接続待機時間を設定します。

 2. 学習用データの準備

  Jubatus Serverに学習させるデータDatumを作成します。
  
  RecommenderClientでは、Datumを学習用データとして作成し、RecommenderClientのupdate_rowメソッドに与えることで、学習が行われます。
  今回はプロ野球データfreakというサイトの野手データ（CSVファイル）を元に学習用データを作成していきます。
  野手データの要素として、"名前"、"チーム"、"打率"、"打数"、"安打"などがあります。
  下図に、今回作成する学習用データの構造を示します。
  

  +-------------+--------------------------------------------------------+
  |ID(String)   |Datum                                                   |
  |             +--------------------------+-----------------------------+
  |             |TupleStringString(List)   |TupleStringDoubel(List)      |
  |             +------------+-------------+---------------+-------------+
  |             |key(String) |value(String)|key(String)    |value(double)|
  +=============+============+=============+===============+=============+
  |"大島洋平"   |"チーム"    |"中日"       | | "打率"      | | 0.31      |
  |             |            |             | | "試合数"    | | 144       |
  |             |            |             | | "打席"      | | 631       |
  |             |            |             | | "打数"      | | 555       |
  |             |            |             | | "安打"      | | 172       |
  |             |            |             | | "本塁打"    | | 1         |
  |             |            |             | | "打点"      | | 13        |
  |             |            |             | | "盗塁"      | | 32        |
  |             |            |             | | "四球"      | | 46        |
  |             |            |             | | "死球"      | | 13        |
  |             |            |             | | "三振"      | | 80        |
  |             |            |             | | "犠打"      | | 17        |
  |             |            |             | | "併殺打"    | | 7         |
  |             |            |             | | "長打率"    | | 0.368     |
  |             |            |             | | "出塁率"    | | 0.376     |
  |             |            |             | | "OPS"       | | 0.744     |
  |             |            |             | | "RC27"      | | 5.13      |
  |             |            |             | | "XR27"      | | 4.91      |
  +-------------+------------+-------------+---------------+-------------+
  |"高橋由伸"   |"チーム"    |"巨人"       | | "打率"      | | 0.239     |
  |             |            |             | | "試合数"    | | 130       |
  |             |            |             | | "打席"      | | 442       |
  |             |            |             | | "打数"      | | 368       |
  |             |            |             | | ･･･         | | ･･･       |
  |             |            |             | | ･･･         | | ･･･       |
  +-------------+------------+-------------+---------------+-------------+
  
  
  Datumとは、Jubatusで利用できるkey-valueデータ形式のことです。Datumには2つのkey-valueが存在します。
  1つはキーも値も文字列の文字列データ（string_values）、もう一方は、キーは同様に文字列で、バリューは数値の数値データ（num_values）です。
  それぞれ、TupleStringStringクラスとTupleStringDoubleクラスで表します。
  
  | 表の1つ目のデータを例に説明すると、"チーム"は文字列なのでTupleStringStringクラスの
  | 1番目のListとしてキーに"チーム"、バリューに"中日"を設定します。
  | それ以外の項目は数値なので、TupleStringDoubleクラスの
  | 1番目のListとしてキーに"打率"、バリューに'0.31'、
  | 2番目のListとしてキーに"試合数"、バリューに'144'、
  | 3番目のListとしてキーに"打席"、バリューに'631'、
  | 4番目のListとしてキーに"打数"、バリューに'555'と
  | 最後の要素"XR27"の項目までListを作成し設定します。
  
  これらのListを保持したDatumをCSVの1行ずつ、つまり選手1人ずつ作成します。
  その、DatumとIDである選手の"名前"を学習用データとして使用します。

  このサンプルでの学習用データ作成の手順は下記の流れで行います。
  
  まず、学習用データの元となるCSVファイルを読み込みます（14行目）。
  for文にて1行ずつループで読み込んで処理します（14-42行目）。
  CSVファイルなので、取得した1行を’,’で分割し要素ごとに分け、それぞれ変数に代入します（15行目）。
  types関数にて、引数にそれぞれの要素を設定しDatumを作成します（16-40行目）。
  これで、1人分の選手のデータが入ったDatumの作成が完了しました。

 3. データの学習（学習モデルの更新）

  2.の工程で作成した学習用データを、update_rowメソッドに渡すことで学習が行われます（42行目）。
  update_rowメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。（スタンドアロン構成の場合、空文字（""）を指定）
  第2引数は、IDで学習データ内でユニークな名前を指定します。ここでは選手の"名前"をIDとして使用します。
  第3引数として、先ほど 2. で作成したDatumを指定します。
  これで、選手1人分のデータの学習が完了しました。ループ処理で 2. と 3. をCSVの行数分繰り返し実行すれば、データの学習は完了します。

**Analyze.py**

 1. Jubatus Serverへの接続設定

  Update.pyと同様のため省略。
  
 2. 推薦用データの準備

  推薦で必要なデータは先ほど学習でIDに指定した選手の"名前"になります。
  学習時と同じ要領で、カラムの1番目である"名前"を取得し、RecommenderClientのsimilar_row_from_idメソッドに与えることで、推薦が行われます。

 3. 学習モデルに基づく推薦

  2.で取得した選手の"名前"を、similar_row_from_idメソッドに渡すことで、推薦結果のListを得ることができます（17行目）。
  similar_row_from_idメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。（スタンドアロン構成の場合、空文字（""）を指定）
  第2引数に、"名前"を指定します。
  第3引数は、似ているタイプを近傍順にいくつ出力するかを指定します。ここでは、トップ3まで出力するので"4"を指定します。なぜ、"4"かというとトップは自身が出力される為です。

 4. 結果の出力

  3.で取得した、推薦結果のリストはsimilar_row_from_idメソッドの第3引数に"4"を指定したので、4 つの要素を持ったListです。
  Listの1番目は自分自身なので、Listの2番目から4番目までを結果として出力します。
  Update.pyと同様、選手1人ずつループで処理し 2. ～ 4. を繰り返します。

------------------------------------
サンプルプログラムの実行
------------------------------------

**［Jubatus Serverでの作業］**

jubarecommenderを起動します。

::

 $ jubarecommender --configpath npb_similar_player.json


**［Jubatus Clientでの作業］**

下記のコマンドで実行します。

::

 $ python update.py
 $ python analyze.py

**［実行結果］**

::

 player 長野久義 is similar to : 糸井嘉男 ミレッジ 栗山巧
 player 大島洋平 is similar to : 本多雄一 石川雄洋 荒波翔
 player 鳥谷敬 is similar to : サブロー 糸井嘉男 和田一浩
 player 坂本勇人 is similar to : 角中勝也 稲葉篤紀 秋山翔吾
 player 中田翔 is similar to : 井口資仁 新井貴浩 中村紀洋
 …
 …（以下略）


