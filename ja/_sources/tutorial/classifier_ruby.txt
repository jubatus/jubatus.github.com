Ruby
==========================

ここではRuby版のClassifierサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするshogun.jsonとデータの学習及び学習データに基づく予測を行うshogun.rbを利用します。以下にshogun.jsonとshogun.rbのソースコードを記載します。

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
 14 :       { "key": "*", "type": "unigram", "sample_weight": "bin", "global_weight": "bin" }
 15 :     ]
 16 :   },
 17 :   "parameter": {
 18 :     "regularization_weight" : 1.0
 19 :   }
 20 : }


**shogun.rb**

.. code-block:: ruby

 01 : #!/usr/bin/env ruby
 02 : # -*- coding: utf-8 -*-
 03 : 
 04 : $host = "127.0.0.1"
 05 : $port = 9199
 06 : $name = "test"
 07 : 
 08 : require 'json'
 09 : 
 10 : require 'jubatus/classifier/client'
 11 : require 'jubatus/classifier/types'
 12 : 
 13 : def train(client)
 14 :   # 2. 学習用データの準備
 15 :   # predict the last ones (that are commented out)
 16 :   train_data =
 17 :     [ 
 18 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家康"]], [])],
 19 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "秀忠"]], [])],
 20 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家光"]], [])],
 21 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家綱"]], [])],
 22 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "綱吉"]], [])],
 23 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家宣"]], [])],
 24 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家継"]], [])],
 25 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "吉宗"]], [])],
 26 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家重"]], [])],
 27 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家治"]], [])],
 28 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家斉"]], [])],
 29 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家慶"]], [])],
 30 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家定"]], [])],
 31 :      ["徳川", Jubatus::Classifier::Datum.new([["name", "家茂"]], [])],
 32 :      # ["徳川", Jubatus::Classifier::Datum.new([["name", "慶喜"]], [])],
 33 : 
 34 :      ["足利", Jubatus::Classifier::Datum.new([["name", "尊氏"]], [])],
 35 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義詮"]], [])],
 36 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義満"]], [])],
 37 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義持"]], [])],
 38 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義量"]], [])],
 39 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義教"]], [])],
 40 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義勝"]], [])],
 41 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義政"]], [])],
 42 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義尚"]], [])],
 43 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義稙"]], [])],
 44 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義澄"]], [])],
 45 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義稙"]], [])],
 46 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義晴"]], [])],
 47 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義輝"]], [])],
 48 :      ["足利", Jubatus::Classifier::Datum.new([["name", "義栄"]], [])],
 49 :      # ["足利", Jubatus::Classifier::Datum.new([["name", "義昭"]], [])],
 50 : 
 51 :      ["北条", Jubatus::Classifier::Datum.new([["name", "時政"]], [])],
 52 :      ["北条", Jubatus::Classifier::Datum.new([["name", "義時"]], [])],
 53 :      ["北条", Jubatus::Classifier::Datum.new([["name", "泰時"]], [])],
 54 :      ["北条", Jubatus::Classifier::Datum.new([["name", "経時"]], [])],
 55 :      ["北条", Jubatus::Classifier::Datum.new([["name", "時頼"]], [])],
 56 :      ["北条", Jubatus::Classifier::Datum.new([["name", "長時"]], [])],
 57 :      ["北条", Jubatus::Classifier::Datum.new([["name", "政村"]], [])],
 58 :      ["北条", Jubatus::Classifier::Datum.new([["name", "時宗"]], [])],
 59 :      ["北条", Jubatus::Classifier::Datum.new([["name", "貞時"]], [])],
 60 :      ["北条", Jubatus::Classifier::Datum.new([["name", "師時"]], [])],
 61 :      ["北条", Jubatus::Classifier::Datum.new([["name", "宗宣"]], [])],
 62 :      ["北条", Jubatus::Classifier::Datum.new([["name", "煕時"]], [])],
 63 :      ["北条", Jubatus::Classifier::Datum.new([["name", "基時"]], [])],
 64 :      ["北条", Jubatus::Classifier::Datum.new([["name", "高時"]], [])],
 65 :      ["北条", Jubatus::Classifier::Datum.new([["name", "貞顕"]], [])],
 66 :      # ["北条", Jubatus::Classifier::Datum.new([["name", "守時"]], [])],
 67 :     ]
 68 : 
 69 :   # training data must be shuffled on online learning!
 70 :   train_data.sort_by{rand}
 71 : 
 72 :   # 3. データの学習（学習モデルの更新）
 73 :   client.train($name, train_data)
 74 : end
 75 : 
 76 : def predict(client)
 77 :   # predict the last shogun
 78 :   # 4. 予測用データの準備
 79 :   data = 
 80 :     [
 81 :      Jubatus::Classifier::Datum.new([["name", "慶喜"]], []),
 82 :      Jubatus::Classifier::Datum.new([["name", "義昭"]], []),
 83 :      Jubatus::Classifier::Datum.new([["name", "守時"]], []),
 84 :     ]
 85 :   data.each { |d|
 86 :     # 5. 学習モデルに基づく予測
 87 :     res = client.classify($name, [d])
 88 :     # 6. 結果の出力
 89 :     puts res[0].max{ |x, y| x[1] <=> y[1]}[0] + d.string_values[0][1]
 90 :   }
 91 : end
 92 : 
 93 : # 1. Jubatus Serverへの接続設定
 94 : client = Jubatus::Classifier::Client::Classifier.new($host, $port)
 95 : # run example
 96 : train(client)
 97 : predict(client)




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
   
   
**shogun.rb**

学習と予測の手順を説明します。

Classifierのクライアントプログラムは、jubatus/classifier/clientを利用して作成します。使用するメソッドは、学習を行うtrainメソッドと、与えられたデータから予測を行うclassifyメソッドの2つです。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（94行目）。
  Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号を設定します。

 2. 学習用データの準備

  Jubatus Serverに学習させるデータList<TupleStringDatum>を作成します。
  
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

  構造体train_dataの宣言で初期値として、上記の表どおりの構造で作成します。labelに"徳川"、Datumのstring_valuesに"name"と"家康”というセットを名の数だけ作成します。Datumのnum_valuesは空を指定します（16-67行目）。

 3. データの学習（学習モデルの更新）

  2.の工程で作成した学習データを、trainメソッドに渡すことで学習が行われます（73行目）。trainメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。

 4. 予測用データの準備

  予測も学習時と同様に、Datumを作成します。DatumのListをClassifierClientのclassifyメソッドに与えることで、予測が行われます。「nameが"慶喜"」の将軍の姓は何かを予測させるため、学習時と同様に構造体dataの宣言で初期値として、Datumのstring_valuesに"name"と"慶喜"を設定します。Datumのnum_valuesは空を指定します。（79-84行目）

 5. 学習データに基づく予測

  4. で作成したDatumのListを、classifyメソッドに渡すことで、予測値のListを得ることができます（87行目）。

 6. 結果の出力

  結果出力、5. で得たListを渡し、Listを参照することで予測値を見ることができます。サンプルでは、「確からしさの値」を表すscoreが最大であるlabel（姓）を判断し（89行目）、名と組み合わせて表示しています。

------------------------------------
サンプルプログラムの実行
------------------------------------

［Jubatus Serverでの作業］
 jubaclassifierを起動します。

::

 $ jubaclassifier --configpath shogun.json

［Jubatus Clientでの作業］

::

 $ ruby shogun.rb

