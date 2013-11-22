Python
==================

ここではPython版のStatサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習の設定をするstat.jsonと統計分析を行うstat.pyを利用します。
以下にソースコードを記載します。

**stat.json**

.. code-block:: python
 :linenos:

 {
   "window_size": 500
 }
 

**stat.py**

.. code-block:: python
 :linenos:

 #!/usr/bin/env python
 # -*- coding: utf-8 -*-

 import sys
 from jubatus.stat.client import Stat

 NAME = "stat_tri";

 if __name__ == '__main__':

   # 1. Jubatus Serverへの接続設定
   stat = Stat("127.0.0.1", 9199, NAME)

   # 2. 学習用データの準備
   for line in open('../dat/fruit.csv'):
     fruit, diameter, weight , price = line[:-1].split(',')

     # 3. データの学習（学習モデルの更新）
     stat.push(fruit + "dia", float(diameter))
     stat.push(fruit + "wei", float(weight))
     stat.push(fruit + "pri", float(price))

   # 4. 結果の出力
   for fr in ["orange", "apple","melon"]:
     for par in ["dia","wei", "pri"]:
       print "sum :", fr + par,stat.sum(fr + par)
       print "sdv :", fr + par,stat.stddev(fr + par)
       print "max :", fr + par,stat.max(fr + par)
       print "min :", fr + par,stat.min(fr + par)
       print "ent :", fr + par,stat.entropy(fr + par)
       print "mmt :", fr + par,stat.moment(fr + par, 1, 0.0)

--------------------------------
解説
--------------------------------

**stat.json**

設定は単体のJSONで与えられます。
JSONの各フィールドは以下のとおりです。

* window_size
    保持する値の数を指定する。 (Integer)

**stat.py**

stat.pyでは、csvから読み込んだフルーツの直径・重さ・値段の情報をJubatusサーバ与え、それぞれのフルーツごとに統計結果を出力します。
使用するメソッドは以下になります。

* bool push(0: string key, 1: double val)
    属性情報 key の値 val を与える。

* double sum(0: string key)
    属性情報 key を持つ値の合計値を返す。

* double stddev(0: string key)
    属性情報 key を持つ値の標準偏差を返す。

* double max(0: string key)
    属性情報 key を持つ値の最大値を返す。

* double min(0: string key)
    属性情報 key を持つ値の最小値を返す。

* double entropy(0: string key)
    属性情報 key を持つ値のエントロピーを返す。

* double moment(0: string key, 1: int degree, 2: double center)
    属性情報 key を持つ値の center を中心とした degree 次のモーメントを返す。

1. Jubatus Serverへの接続設定
    Jubatus Serverへの接続を行います（12行目）。

    Jubatus ServerのIPアドレス、Jubatus ServerのRPCポート番号を設定します。

2. 学習用データの準備
    Statでは、項目名と値をpushメソッドに与えることで、学習が行われます。
    今回はサンプル用に作成した"フルーツの種類"・"直径"・"重さ"・"価格"の情報を持つCSVファイルを元に学習用データを作成していきます。
    まず、学習用データの元となるCSVファイルを読み込みます。
    ここでは、CSVファイルを1行ずつループで読み込んで処理します（14-21行目）。

3. データの学習（学習モデルの更新）
    Statのpushメソッドに2. で作成したデータに項目名を付けて渡します（19-21行目）。
    ここでの項目名は"直径"の場合、フルーツの種類＋"dia"という形にして、"重さ"・"価格"についても同じようにpushメソッドを呼び出します。

4. 結果の出力
    Statの各統計分析メソッドを使用し、結果を出力します。
    まず、フルーツの種類ごとにループをまわして（24行目）、さらに残りの項目ごとにループでまわして出力していきます（25行目）。
    そのループ処理の中で、各統計分析メソッドを呼び出します（26-31行目）。
    各メソッドの内容は上記のメソッド一覧を参照してください。


-------------------------------------
サンプルプログラムの実行
-------------------------------------

* Jubatus Serverでの作業
    jubastatを起動します。

    ::

     $ jubastat --configpath stat.json


* Jubatus Clientでの作業
    必要なパッケージとPythonクライアントを用意し、実行します。

    実行結果:

    ::

     sum : orangedia 1503.399996995926
     sdv : orangedia 10.868084068651045
     max : orangedia 54.29999923706055
     min : orangedia -2.0999999046325684
     ent : orangedia 0.0
     mmt : orangedia 28.911538403767807
     sum : orangewei 10394.399948120117
     sdv : orangewei 54.92258724344468
     max : orangewei 321.6000061035156
     min : orangewei 39.5
     ent : orangewei 0.0
     mmt : orangewei 196.1207537381154
     sum : orangepri 1636.0
     sdv : orangepri 7.936154992801973
     max : orangepri 50.0
     min : orangepri 6.0
     ent : orangepri 0.0
     mmt : orangepri 30.867924528301888
     sum : appledia 2902.0000019073486
     sdv : appledia 15.412238321876663
     ...
     ...（以下略）
