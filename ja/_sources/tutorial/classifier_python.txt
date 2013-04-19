Python
==========================

ここではPython版のClassifierサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするshogun.jsonとデータの学習及び学習データに基づく予測を行うshogun.pyを利用します。以下にshogun.jsonとShogun.pyのソースコードを記載します。

**shogun.json**

.. code-block:: python

 01 : {
 02 :   "method": "AROW",
 03 :   "converter": {
 04 :     "num_filter_types": {},
 05 :     "num_filter_rules": [],
 06 :     "string_filter_types": {},
 07 :     "string_filter_rules": [],
 08 :     "num_types": {},
 09 :     "num_rules": [],
 10 :     "string_types": {
 11 :       "unigram": { "method": "ngram", "char_num": "1" }
 12 :     },
 13 :     "string_rules": [
 14 :       { "key": "*", "type": "unigram", "sample_weight": "bin", "global_weight": bin" }
 15 :     ]
 16 :   },
 17 :   "parameter": {
 18 :     "regularization_weight" : 1.0
 19 :   }
 20 : }


**shogun.py**

.. code-block:: python


 01 : #!/usr/bin/env python
 02 : # coding: utf-8
 03 : 
 04 : host = '127.0.0.1'
 05 : port = 9199
 06 : name = 'test'
 07 : 
 08 : import json
 09 : import random
 10 : 
 11 : import jubatus
 12 : from jubatus.classifier.types import datum
 13 : 
 14 : def train(client):
 15 :     # 2. 学習用データの準備
 16 :     # predict the last ones (that are commented out)
 17 :     train_data = [ 
 18 :         (u'徳川', datum([('name', u'家康')], [])),
 19 :         (u'徳川', datum([('name', u'秀忠')], [])),
 20 :         (u'徳川', datum([('name', u'家光')], [])),
 21 :         (u'徳川', datum([('name', u'家綱')], [])),
 22 :         (u'徳川', datum([('name', u'綱吉')], [])),
 23 :         (u'徳川', datum([('name', u'家宣')], [])),
 24 :         (u'徳川', datum([('name', u'家継')], [])),
 25 :         (u'徳川', datum([('name', u'吉宗')], [])),
 26 :         (u'徳川', datum([('name', u'家重')], [])),
 27 :         (u'徳川', datum([('name', u'家治')], [])),
 28 :         (u'徳川', datum([('name', u'家斉')], [])),
 29 :         (u'徳川', datum([('name', u'家慶')], [])),
 30 :         (u'徳川', datum([('name', u'家定')], [])),
 31 :         (u'徳川', datum([('name', u'家茂')], [])),
 32 :         # (u'徳川', datum([('name', u'慶喜')], [])),
 33 : 
 34 :         (u'足利', datum([('name', u'尊氏')], [])),
 35 :         (u'足利', datum([('name', u'義詮')], [])),
 36 :         (u'足利', datum([('name', u'義満')], [])),
 37 :         (u'足利', datum([('name', u'義持')], [])),
 38 :         (u'足利', datum([('name', u'義量')], [])),
 39 :         (u'足利', datum([('name', u'義教')], [])),
 40 :         (u'足利', datum([('name', u'義勝')], [])),
 41 :         (u'足利', datum([('name', u'義政')], [])),
 42 :         (u'足利', datum([('name', u'義尚')], [])),
 43 :         (u'足利', datum([('name', u'義稙')], [])),
 44 :         (u'足利', datum([('name', u'義澄')], [])),
 45 :         (u'足利', datum([('name', u'義稙')], [])),
 46 :         (u'足利', datum([('name', u'義晴')], [])),
 47 :         (u'足利', datum([('name', u'義輝')], [])),
 48 :         (u'足利', datum([('name', u'義栄')], [])),
 49 :         # (u'足利', datum([('name', u'義昭')], [])),
 50 : 
 51 :         (u'北条', datum([('name', u'時政')], [])),
 52 :         (u'北条', datum([('name', u'義時')], [])),
 53 :         (u'北条', datum([('name', u'泰時')], [])),
 54 :         (u'北条', datum([('name', u'経時')], [])),
 55 :         (u'北条', datum([('name', u'時頼')], [])),
 56 :         (u'北条', datum([('name', u'長時')], [])),
 57 :         (u'北条', datum([('name', u'政村')], [])),
 58 :         (u'北条', datum([('name', u'時宗')], [])),
 59 :         (u'北条', datum([('name', u'貞時')], [])),
 60 :         (u'北条', datum([('name', u'師時')], [])),
 61 :         (u'北条', datum([('name', u'宗宣')], [])),
 62 :         (u'北条', datum([('name', u'煕時')], [])),
 63 :         (u'北条', datum([('name', u'基時')], [])),
 64 :         (u'北条', datum([('name', u'高時')], [])),
 65 :         (u'北条', datum([('name', u'貞顕')], [])),
 66 :         # (u'北条', datum([('name', u'守時')], [])),
 67 :         ]
 68 : 
 69 :     # training data must be shuffled on online learning!
 70 :     random.shuffle(train_data)
 71 : 
 72 :     # 3. データの学習（学習モデルの更新）
 73 :     client.train(name, train_data)
 74 : 
 75 : def predict(client):
 76 :     # predict the last shogun
 77 :     # 4. 予測用データの準備
 78 :     data = [
 79 :         datum([('name', u'慶喜')], []),
 80 :         datum([('name', u'義昭')], []),
 81 :         datum([('name', u'守時')], []),
 82 :         ]
 83 :     for d in data:
 84 :         # 5. 学習モデルに基づく予測
 85 :         res = client.classify(name, [d])
 86 :         # 6. 結果の出力
 87 :         print max(res[0], key = lambda x: x.score).label, d.string_values[0][1]
 88 : 
 89 : if __name__ == '__main__':
 90 :     # 1. Jubatus Serverへの接続設定
 91 :     client = jubatus.Classifier(host, port)
 92 :     # run example
 93 :     train(client)
 94 :     predict(client)
 95 : 

 

 
--------------------------------
解説
--------------------------------

**shogun.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下の通りです。

 * method
 
  分類に使用するアルコリズムを指定します。
  今回は、AROW(Adaptive Regularization of Weight vectors)を指定しています。


 * converter
 
   特徴変換の設定を指定します。
   サンプルでは、将軍の名が"家康"の場合、"家"と"康"に分割し、これらの文字（漢字）を含む名の姓は"徳川"であるというようなグループ分けをしたいので、"string_types"でunigramを定義しています。また今回は、将軍の名を文字列データとして扱うので、数値型のフィルター及び特徴抽出器の設定はしていません。

 * parameter

   アルゴリズムに渡すパラメータを指定します。
   methodに応じて渡すパラメータは異なります。今回はmethodで"AROW"を指定していますので、「"regularization_weight" : 1.0」を指定します。なお、各アルゴリズムのregularization_weightパラメータ（学習に対する感度パラメータ）はアルゴリズム中における役割が異なるため、アルゴリズム毎に適切な値は異なることに注意してください。regularization_weightパラメータは大きくすると学習が早くなりますが、代わりにノイズに弱くなります。
   
   
**shogun.py**

学習と予測の手順を説明します。

Classifierのクライアントプログラムは、jubatus.classifierを利用して作成します。使用するメソッドは、学習を行うtrainメソッドと、与えられたデータから予測を行うclassifyメソッドの2つです。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（33行目）。
  Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号を設定します。

 2. 学習用データの準備

  Jubatus Serverに学習させるデータList<TupleStringDatum>を作成します（37行目）。
  
  ClassifierClientではlist<tuple<string, datum>>を作成し、ClassifierClientのtrainメソッドに与えることで、学習が行われます。下図に、今回作成する学習データの構造を示します。
  
  +-----------------------------------------------------------------------+
  |               list<tuple<string, datum>>                              |
  +-------------+---------------------------------------------------------+
  |label(String)|Datum                                                    |
  +-------------+----------------------------+----------------------------+
  |             |list<tuple<string, string>> |list<tuple<string, double>> |
  +-------------+-----------+----------------+------------+---------------+
  |             |key(String)|value(String)   |key(String) |value(double)  |
  +=============+===========+================+============+===============+
  |"徳川"       |"name"     |"家康"          |            |               |
  +-------------+-----------+----------------+------------+---------------+
  |"徳川"       |"name"     |"秀忠"          |            |               |
  +-------------+-----------+----------------+------------+---------------+
  |"徳川"       |"name"     |"家光"          |            |               |
  +-------------+-----------+----------------+------------+---------------+
  |"徳川"       |"name"     |"家綱"          |            |               |
  +-------------+-----------+----------------+------------+---------------+
  |"足利"       |"name"     |"尊氏"          |            |               |
  +-------------+-----------+----------------+------------+---------------+
  |"足利"       |"name"     |"義詮"          |            |               |
  +-------------+-----------+----------------+------------+---------------+
  |"北条"       |"name"     |"時政"          |            |               |
  +-------------+-----------+----------------+------------+---------------+
  |"北条"       |"name"     |"義時"          |            |               |
  +-------------+-----------+----------------+------------+---------------+


  tuple<string, datum>はDatumとそのlabelの組みです。サンプルでは、labelに将軍の姓を格納しています。Datumとは、Jubatusで利用できるkey-valueデータ形式のことです。特徴ベクトルに置き換えると、keyが特徴、valueが特徴量に相当します。Datumには2つのkey-valueが存在します。1つはキーも値も文字列の文字列データ（string_values）です。もう一方は、キーは同様に文字列で、値は数値の数値データ(num_values)です。今回は、将軍の名から姓を当てるプログラムなので、string_valuesのkeyに文字列"name"、valueに歴代将軍の名を格納します。今回のサンプルには含まれませんが、仮に"徳川"というグループに「徳川家の身長(height)は170cm以上である」という特徴を追加したい場合は、num_valuesのkeyに文字列"height"、valueに170を格納します。

  このサンプルでの学習データ作成の手順は下記の流れで行います。

  構造体train_dataの宣言で初期値として、上記の表どおりの構造で作成します。labelに"徳川"、Datumのstring_valuesに"name"と"家康”というセットを名の数だけ作成します。Datumのnum_valuesは空を指定します。（17-67行目）

 3. データの学習（学習モデルの更新）

  2.の工程で作成した学習データを、trainメソッドに渡すことで学習が行われます（73行目）。trainメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。

 4. 予測用データの準備

  予測も学習時と同様に、Datumを作成します。DatumのListをClassifierClientのclassifyメソッドに与えることで、予測が行われます。「nameが"慶喜"」の将軍の姓は何かを予測させるため、学習時と同様に構造体dataの宣言で初期値として、Datumのstring_valuesに"name"と"慶喜"を設定します。Datumのnum_valuesは空を指定します。（78-82行目）

 5. 学習データに基づく予測

  4で作成したDatumのListを、classifyメソッドに渡すことで、予測値のListを得ることができます（85行目）。

 6. 結果の出力

  結果出力、5.で得たListを渡し、Listを参照することで予測値を見ることができます。サンプルでは、「確からしさの値」を表すscoreが最大であるlabel（姓）を判断し（87行目）、名と組み合わせて表示しています。

------------------------------------
サンプルプログラムの実行
------------------------------------

［Jubatus Serverでの作業］
 jubaclassifierを起動します。

::

 $ jubaclassifier --configpath shogun.json

［Jubatus Clientでの作業］

::

 $ python shogun.py

