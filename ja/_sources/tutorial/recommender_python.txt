Python
==================

ここではPython版のRecommenderサンプルプログラムの解説をします。

-----------------------------------
ソースコード
-----------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするnpb_similar_player.jsonと野手データの学習を行うupdate.py、推薦を実行して結果を出力するanalyze.py、また学習用データとしてbaseball.csvを使用します。
以下にnpb_similar_player.jsonとupdate.pyおよびanalyze.pyのソースコードを記載します。

**npb_similar_player.json**

.. code-block:: js
 :linenos:

 {
   "method": "inverted_index",
   "converter": {
     "string_filter_types": {},
     "string_filter_rules": [],
     "num_filter_types": {},
     "num_filter_rules": [],
     "string_types": {},
     "string_rules": [],
     "num_types": {},
     "num_rules": [
       {"key" : "*", "type" : "num"}
     ]
   },
   "parameter": {}
 }

**update.py**

.. code-block:: python
 :linenos:

 #!/usr/bin/env python
 # -*- coding: utf-8 -*-

 import sys, json
 from jubatus.recommender import client
 from jubatus.recommender import types
 from jubatus.common import Datum

 NAME = "recommender_baseball";

 if __name__ == '__main__':

     recommender = client.Recommender("127.0.0.1", 9199, NAME)

     for line in open('dat/baseball.csv'):
         pname, team, bave, games, pa, atbat, hit, homerun, runsbat, stolen, bob, hbp, strikeout, sacrifice, dp, slg, obp, ops, rc27, xr27 = line[:-1].split(',')
         d = Datum({
           "チーム": team,
           "打率": float(bave),
           "試合数": float(games),
           "打席": float(pa),
           "打数": float(atbat),
           "安打": float(hit),
           "本塁打": float(homerun),
           "打点": float(runsbat),
           "盗塁": float(stolen),
           "四球": float(bob),
           "死球": float(hbp),
           "三振": float(strikeout),
           "犠打": float(sacrifice),
           "併殺打": float(dp),
           "長打率": float(slg),
           "出塁率": float(obp),
           "OPS": float(ops),
           "RC27": float(rc27),
           "XR27": float(xr27)
           })
         recommender.update_row(pname, d)

**analyze.py**

.. code-block:: python
 :linenos:

 #!/usr/bin/env python
 # -*- coding: utf-8 -*-

 import sys
 from jubatus.recommender import client
 from jubatus.recommender import types

 NAME = "recommender_baseball";

 if __name__ == '__main__':

     recommender = client.Recommender("127.0.0.1", 9199, NAME)

     for line in open('dat/baseball.csv'):
       pname, team, bave, games, pa, atbat, hit, homerun, runsbat, stolen, bob, hbp, strikeout, sacrifice, dp, slg, obp, ops, rc27, xr27 = line[:-1].split(',')
       sr = recommender.similar_row_from_id(pname , 4)
       print "player ", pname,  " is similar to :", sr[1].id, sr[2].id, sr[3].id 


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
    アルゴリズムに渡すパラメータを指定します。
    methodに応じて渡すパラメータは異なります。

    methodで“inverted_index”を指定していますので、設定不要です。

**update.py**

学習の手順を説明します。

Recommenderのクライアントプログラムは、jubatus.Recommenderクラスを利用して作成します。
使用するメソッドは、1データ分の学習を行うupdate_rowメソッドです。

1. Jubatus Serverへの接続設定
    Jubatus Serverへの接続を行います（13行目）。

    Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号, タスクを識別するZookeeperクラスタ内でユニークな名前を設定します。

2. 学習用データの準備
    Jubatus Serverに学習させるデータDatumを作成します。

    RecommenderClientでは、Datumを学習用データとして作成し、RecommenderClientのupdate_rowメソッドに与えることで、学習が行われます。
    今回はプロ野球データfreakというサイトの野手データ（CSVファイル）を元に学習用データを作成していきます。
    野手データの要素として、"名前"、"チーム"、"打率"、"打数"、"安打"などがあります。
    下図に、今回作成する学習用データの構造を示します。

    +-------------+---------------------------------------------------------------------------------------+
    |ID(string)   |Datum                                                                                  |
    |             +----------------------------+-----------------------------+----------------------------+
    |             |list<tuple<string, string>> |list<tuple<string, double>>  |list<tuple<string, string>> |
    |             +------------+---------------+---------------+-------------+------------+---------------+
    |             |key(string) |value(string)  |key(string)    |value(double)|key(string) |value(string)  |
    +=============+============+===============+===============+=============+============+===============+
    |"大島洋平"   |"チーム"    |"中日"         | | "打率"      | | 0.31      |            |               |
    |             |            |               | | "試合数"    | | 144       |            |               |
    |             |            |               | | "打席"      | | 631       |            |               |
    |             |            |               | | "打数"      | | 555       |            |               |
    |             |            |               | | "安打"      | | 172       |            |               |
    |             |            |               | | "本塁打"    | | 1         |            |               |
    |             |            |               | | "打点"      | | 13        |            |               |
    |             |            |               | | "盗塁"      | | 32        |            |               |
    |             |            |               | | "四球"      | | 46        |            |               |
    |             |            |               | | "死球"      | | 13        |            |               |
    |             |            |               | | "三振"      | | 80        |            |               |
    |             |            |               | | "犠打"      | | 17        |            |               |
    |             |            |               | | "併殺打"    | | 7         |            |               |
    |             |            |               | | "長打率"    | | 0.368     |            |               |
    |             |            |               | | "出塁率"    | | 0.376     |            |               |
    |             |            |               | | "OPS"       | | 0.744     |            |               |
    |             |            |               | | "RC27"      | | 5.13      |            |               |
    |             |            |               | | "XR27"      | | 4.91      |            |               |
    +-------------+------------+---------------+---------------+-------------+------------+---------------+
    |"高橋由伸"   |"チーム"    |"巨人"         | | "打率"      | | 0.239     |            |               |
    |             |            |               | | "試合数"    | | 130       |            |               |
    |             |            |               | | "打席"      | | 442       |            |               |
    |             |            |               | | "打数"      | | 368       |            |               |
    |             |            |               | | ･･･         | | ･･･       |            |               |
    |             |            |               | | ･･･         | | ･･･       |            |               |
    +-------------+------------+---------------+---------------+-------------+------------+---------------+

    Datumとは、Jubatusで利用できるkey-valueデータ形式のことです。
    Datumには3つのkey-valueが存在します。

    1つはキーも値も文字列の文字列データ（string_values）です。
    1つはキーは同様に文字列で、値は数値の数値データ(num_values)です。
    もう1つは、キーは同様に文字列で、値は文字列のバイナリデータ(binary_values)です。

    Datumのコンストラクタ引数で指定したdictのvalueが文字列の場合は、string_valuesに、valueが数値の場合はnum_valuesに値がセットされます。

    | 表の1つ目のデータを例に説明すると、"チーム"は文字列なのでstring_valuesとしてkeyに"チーム"、valueに"中日"をセットします。
    | それ以外の項目は数値なので、num_valuesに
    |  keyに"打率"、valueに'0.31'、
    |  keyに"試合数"、valueに'144'、
    |  keyに"打席"、valueに'631'、
    |  keyに"打数"、valueに'555'と
    | "XR27"の項目までをセットします。

    これらの情報を保持したDatumをCSVの1行ずつ、つまり選手1人ずつ作成します。
    その、DatumとIDである選手の"名前"を学習用データとして使用します。

    このサンプルでの学習用データ作成の手順は下記の流れで行います。

    まず、学習用データの元となるCSVファイルを読み込みます（15行目）。
    for文にて1行ずつループで読み込んで処理します（15-38行目）。
    CSVファイルなので、取得した1行を’,’で分割し要素ごとに分け、それぞれ変数に代入します（16行目）。
    コンストラクタにて、引数にそれぞれの要素を設定しDatumを作成します（17-37行目）。

3. データの学習（学習モデルの更新）
    2\.の工程で作成した学習用データを、update_rowメソッドに渡すことで学習が行われます（38行目）。
    第1引数は、IDで学習データ内でユニークな名前を指定します。
    ここでは選手の"名前"をIDとして使用します。
    第2引数として、先ほど 2. で作成したDatumを指定します。

    これで、選手1人分のデータの学習が完了しました。
    ループ処理で 2. と 3. をCSVの行数分繰り返し実行すれば、データの学習は完了します。

**analyze.py**

推薦の手順を説明します。

学習と同様にクライアントプログラムは、jubatus.Recommenderクラスを利用して作成します。
使用するメソッドは、与えられたデータから推薦を行うsimilar_row_from_idメソッドです。

1. Jubatus Serverへの接続設定
    update.pyと同様のため省略。

2. 推薦用データの準備
    推薦で必要なデータは先ほど学習でIDに指定した選手の"名前"になります。
    学習時と同じ要領で、カラムの1番目である"名前"を取得し、RecommenderClientのsimilar_row_from_idメソッドに与えることで、推薦が行われます。

3. 学習モデルに基づく推薦
    2\.で取得した選手の"名前"を、similar_row_from_idメソッドに渡すことで、推薦結果のlistを得ることができます（16行目）。
    第1引数に、"名前"を指定します。
    第2引数は、似ているタイプを近傍順にいくつ出力するかを指定します。
    ここでは、トップ3まで出力するので"4"を指定します。
    なぜ、"4"かというとトップは自身が出力される為です。

4. 結果の出力
    3\.で取得した、推薦結果のリストはsimilar_row_from_idメソッドの第2引数に"4"を指定したので、4 つの要素を持ったlistです。
    listの1番目は自分自身なので、2番目から4番目までを結果として出力します。
    update.pyと同様、選手1人ずつループで処理し 2. ～ 4. を繰り返します。


------------------------------------
サンプルプログラムの実行
------------------------------------

* Jubatus Serverでの作業
    jubarecommenderを起動します。

    ::

     $ jubarecommender --configpath npb_similar_player.json


* Jubatus Clientでの作業
    下記のコマンドで実行します。

    ::

     $ python update.py
     $ python analyze.py

    実行結果:

    ::

     player 長野久義 is similar to : 糸井嘉男 ミレッジ 栗山巧
     player 大島洋平 is similar to : 本多雄一 石川雄洋 荒波翔
     player 鳥谷敬 is similar to : サブロー 糸井嘉男 和田一浩
     player 坂本勇人 is similar to : 角中勝也 稲葉篤紀 秋山翔吾
     player 中田翔 is similar to : 井口資仁 新井貴浩 中村紀洋
     ...
     ...（以下略）
