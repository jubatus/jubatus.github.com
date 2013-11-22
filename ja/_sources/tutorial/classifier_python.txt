Python
==========================

ここではPython版のClassifierサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするshogun.jsonとデータの学習及び学習データに基づく予測を行うshogun.pyを利用します。
以下にshogun.jsonとshogun.pyのソースコードを記載します。

**shogun.json**

.. code-block:: js
 :linenos:

 {
   "method": "AROW",
   "converter": {
     "num_filter_types": {},
     "num_filter_rules": [],
     "string_filter_types": {},
     "string_filter_rules": [],
     "num_types": {},
     "num_rules": [],
     "string_types": {
       "unigram": { "method": "ngram", "char_num": "1" }
     },
     "string_rules": [
       { "key": "*", "type": "unigram", "sample_weight": "bin", "global_weight": "bin" }
     ]
   },
   "parameter": {
     "regularization_weight" : 1.0
   }
 }


**shogun.py**

.. code-block:: python
 :linenos:

 #!/usr/bin/env python
 # coding: utf-8

 host = '127.0.0.1'
 port = 9199
 name = 'test'

 import sys
 import json
 import random

 import jubatus
 from jubatus.common import Datum

 def train(client):
     # prepare training data
     # predict the last ones (that are commented out)
     train_data = [
         (u'徳川', Datum({'name': u'家康'})),
         (u'徳川', Datum({'name': u'秀忠'})),
         (u'徳川', Datum({'name': u'家光'})),
         (u'徳川', Datum({'name': u'家綱'})),
         (u'徳川', Datum({'name': u'綱吉'})),
         (u'徳川', Datum({'name': u'家宣'})),
         (u'徳川', Datum({'name': u'家継'})),
         (u'徳川', Datum({'name': u'吉宗'})),
         (u'徳川', Datum({'name': u'家重'})),
         (u'徳川', Datum({'name': u'家治'})),
         (u'徳川', Datum({'name': u'家斉'})),
         (u'徳川', Datum({'name': u'家慶'})),
         (u'徳川', Datum({'name': u'家定'})),
         (u'徳川', Datum({'name': u'家茂'})),
         # (u'徳川', Datum({'name': u'慶喜'})),

         (u'足利', Datum({'name': u'尊氏'})),
         (u'足利', Datum({'name': u'義詮'})),
         (u'足利', Datum({'name': u'義満'})),
         (u'足利', Datum({'name': u'義持'})),
         (u'足利', Datum({'name': u'義量'})),
         (u'足利', Datum({'name': u'義教'})),
         (u'足利', Datum({'name': u'義勝'})),
         (u'足利', Datum({'name': u'義政'})),
         (u'足利', Datum({'name': u'義尚'})),
         (u'足利', Datum({'name': u'義稙'})),
         (u'足利', Datum({'name': u'義澄'})),
         (u'足利', Datum({'name': u'義稙'})),
         (u'足利', Datum({'name': u'義晴'})),
         (u'足利', Datum({'name': u'義輝'})),
         (u'足利', Datum({'name': u'義栄'})),
         # (u'足利', Datum({'name': u'義昭'})),

         (u'北条', Datum({'name': u'時政'})),
         (u'北条', Datum({'name': u'義時'})),
         (u'北条', Datum({'name': u'泰時'})),
         (u'北条', Datum({'name': u'経時'})),
         (u'北条', Datum({'name': u'時頼'})),
         (u'北条', Datum({'name': u'長時'})),
         (u'北条', Datum({'name': u'政村'})),
         (u'北条', Datum({'name': u'時宗'})),
         (u'北条', Datum({'name': u'貞時'})),
         (u'北条', Datum({'name': u'師時'})),
         (u'北条', Datum({'name': u'宗宣'})),
         (u'北条', Datum({'name': u'煕時'})),
         (u'北条', Datum({'name': u'基時'})),
         (u'北条', Datum({'name': u'高時'})),
         (u'北条', Datum({'name': u'貞顕'})),
         # (u'北条', Datum({'name': u'守時'})),
     ]

     # training data must be shuffled on online learning!
     random.shuffle(train_data)

     # run train
     client.train(train_data)

 def predict(client):
     # predict the last shogun
     data = [
         Datum({'name': u'慶喜'}),
         Datum({'name': u'義昭'}),
         Datum({'name': u'守時'}),
     ]
     for d in data:
         res = client.classify([d])
         # get the predicted shogun name
         sys.stdout.write(max(res[0], key=lambda x: x.score).label)
         sys.stdout.write(' ')
         sys.stdout.write(d.string_values[0][1].encode('utf-8'))
         sys.stdout.write('\n')

 if __name__ == '__main__':
     # connect to the jubatus
     client = jubatus.Classifier(host, port, name)
     # run example
     train(client)
     predict(client)


--------------------------------
解説
--------------------------------

**shogun.json**

設定は単体のJSONで与えられます。
JSONの各フィールドは以下の通りです。

* method
    分類に使用するアルゴリズムを指定します。
    今回は、AROW(Adaptive Regularization of Weight vectors)を指定しています。

* converter
    特徴変換の設定を指定します。

    サンプルでは、将軍の名が"家康"の場合、"家"と"康"に分割し、これらの文字（漢字）を含む名の姓は"徳川"であるというようなグループ分けをしたいので、"string_types"でunigramを定義しています。
    また今回は、将軍の名を文字列データとして扱うので、数値型およびバイナリ型のフィルター及び特徴抽出器の設定はしていません。

* parameter
    アルゴリズムに渡すパラメータを指定します。
    methodに応じて渡すパラメータは異なります。

    今回はmethodで"AROW"を指定していますので、「"regularization_weight" : 1.0」を指定します。
    なお、各アルゴリズムのregularization_weightパラメータ（学習に対する感度パラメータ）はアルゴリズム中における役割が異なるため、アルゴリズム毎に適切な値は異なることに注意してください。
    regularization_weightパラメータは大きくすると学習が早くなりますが、代わりにノイズに弱くなります。

**shogun.py**

学習と予測の手順を説明します。

Classifierのクライアントプログラムは、jubatus.Classifierを利用して作成します。
使用するメソッドは、学習を行うtrainメソッドと、与えられたデータから予測を行うclassifyメソッドの2つです。

1. Jubatus Serverへの接続設定
    Jubatus Serverへの接続を行います（93行目）。

    Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号, タスクを識別するZookeeperクラスタ内でユニークな名前を設定します。

2. 学習用データの準備
    Jubatus Serverに学習させるデータを作成します（18行目）。

    ClassifierClientではlist<tuple<string, Datum>>を作成し、ClassifierClientのtrainメソッドに与えることで、学習が行われます。
    下図に、今回作成する学習データの構造を示します。

    +----------------------------------------------------------------------------------------------------+
    |list<tuple<string, Datum>>                                                                          |
    +-------------+--------------------------------------------------------------------------------------+
    |label(string)|Datum                                                                                 |
    +-------------+----------------------------+----------------------------+----------------------------+
    |             |list<tuple<string, string>> |list<tuple<string, double>> |list<tuple<string, string>> |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |             |key(string)|value(string)   |key(string) |value(double)  |key(string) |value(string)  |
    +=============+===========+================+============+===============+============+===============+
    |"徳川"       |"name"     |"家康"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"徳川"       |"name"     |"秀忠"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"徳川"       |"name"     |"家光"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"徳川"       |"name"     |"家綱"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"足利"       |"name"     |"尊氏"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"足利"       |"name"     |"義詮"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"北条"       |"name"     |"時政"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"北条"       |"name"     |"義時"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+

    tuple<string, Datum>はDatumとそのlabelの組みです。
    サンプルでは、labelに将軍の姓を格納しています。

    Datumとは、Jubatusで利用できるkey-valueデータ形式のことです。
    特徴ベクトルに置き換えると、keyが特徴、valueが特徴量に相当します。
    Datumには3つのkey-valueが存在します。
    1つはキーも値も文字列の文字列データ（string_values）です。
    1つはキーは同様に文字列で、値は数値の数値データ(num_values)です。
    もう1つは、キーは同様に文字列で、値は文字列のバイナリデータ(binary_values)です。

    今回は、将軍の名から姓を当てるプログラムなので、string_valuesのkeyに文字列"name"、valueに歴代将軍の名を格納します。
    今回のサンプルには含まれませんが、仮に"徳川"というグループに「徳川家の身長(height)は170cm以上である」という特徴を追加したい場合は、num_valuesのkeyに文字列"height"、valueに170を格納します。

    このサンプルでの学習データ作成の手順は下記の流れで行います。

    構造体train_dataの宣言で初期値として、上記の表どおりの構造で作成します。
    labelに"徳川"、Datumのstring_valuesに"name"と"家康”というセットを名の数だけ作成します。
    valueが文字列の場合は、string_valuesに値がセットされます（18-68行目）。

3. データの学習（学習モデルの更新）
    2.の工程で作成した学習データを、trainメソッドに渡すことで学習が行われます（74行目）。

4. 予測用データの準備
    予測も学習時と同様に、Datumを作成します。

    DatumのlistをClassifierClientのclassifyメソッドに与えることで、予測が行われます。
    「nameが"慶喜"」の将軍の姓は何かを予測させるため、学習時と同様に構造体dataの宣言で初期値として、Datumのstring_valuesに"name"と"慶喜"を設定します（78-82行目）。

5. 学習データに基づく予測
    4\. で作成したDatumのlistを、classifyメソッドに渡すことで、予測値のlistを得ることができます（84行目）。

6. 結果の出力
    結果出力、5.で得たlistを渡し、listを参照することで予測値を見ることができます。
    サンプルでは、「確からしさの値」を表すscoreが最大であるlabel（姓）を判断し（86行目）、名と組み合わせて表示しています。


------------------------------------
サンプルプログラムの実行
------------------------------------

* Jubatus Serverでの作業
    jubaclassifierを起動します。

    ::

     $ jubaclassifier --configpath shogun.json

* Jubatus Clientでの作業
    ::

     $ python shogun.py
