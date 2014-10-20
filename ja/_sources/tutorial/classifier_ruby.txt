Ruby
==========================

ここではRuby版のClassifierサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするshogun.jsonとデータの学習及び学習データに基づく予測を行うshogun.rbを利用します。
以下にshogun.jsonとshogun.rbのソースコードを記載します。

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


**shogun.rb**

.. code-block:: ruby
 :linenos:

 #!/usr/bin/env ruby
 # -*- coding: utf-8 -*-

 $host = "127.0.0.1"
 $port = 9199
 $name = "test"

 require 'json'

 require 'jubatus/classifier/client'

 def train(client)
   # prepare training data
   # predict the last ones (that are commented out)
   train_data =
     [
      ["徳川", Jubatus::Common::Datum.new("name" => "家康")],
      ["徳川", Jubatus::Common::Datum.new("name" => "秀忠")],
      ["徳川", Jubatus::Common::Datum.new("name" => "家光")],
      ["徳川", Jubatus::Common::Datum.new("name" => "家綱")],
      ["徳川", Jubatus::Common::Datum.new("name" => "綱吉")],
      ["徳川", Jubatus::Common::Datum.new("name" => "家宣")],
      ["徳川", Jubatus::Common::Datum.new("name" => "家継")],
      ["徳川", Jubatus::Common::Datum.new("name" => "吉宗")],
      ["徳川", Jubatus::Common::Datum.new("name" => "家重")],
      ["徳川", Jubatus::Common::Datum.new("name" => "家治")],
      ["徳川", Jubatus::Common::Datum.new("name" => "家斉")],
      ["徳川", Jubatus::Common::Datum.new("name" => "家慶")],
      ["徳川", Jubatus::Common::Datum.new("name" => "家定")],
      ["徳川", Jubatus::Common::Datum.new("name" => "家茂")],
      # ["徳川", Jubatus::Common::Datum.new("name" => "慶喜")],

      ["足利", Jubatus::Common::Datum.new("name" => "尊氏")],
      ["足利", Jubatus::Common::Datum.new("name" => "義詮")],
      ["足利", Jubatus::Common::Datum.new("name" => "義満")],
      ["足利", Jubatus::Common::Datum.new("name" => "義持")],
      ["足利", Jubatus::Common::Datum.new("name" => "義量")],
      ["足利", Jubatus::Common::Datum.new("name" => "義教")],
      ["足利", Jubatus::Common::Datum.new("name" => "義勝")],
      ["足利", Jubatus::Common::Datum.new("name" => "義政")],
      ["足利", Jubatus::Common::Datum.new("name" => "義尚")],
      ["足利", Jubatus::Common::Datum.new("name" => "義稙")],
      ["足利", Jubatus::Common::Datum.new("name" => "義澄")],
      ["足利", Jubatus::Common::Datum.new("name" => "義稙")],
      ["足利", Jubatus::Common::Datum.new("name" => "義晴")],
      ["足利", Jubatus::Common::Datum.new("name" => "義輝")],
      ["足利", Jubatus::Common::Datum.new("name" => "義栄")],
      # ["足利", Jubatus::Common::Datum.new("name" => "義昭")],

      ["北条", Jubatus::Common::Datum.new("name" => "時政")],
      ["北条", Jubatus::Common::Datum.new("name" => "義時")],
      ["北条", Jubatus::Common::Datum.new("name" => "泰時")],
      ["北条", Jubatus::Common::Datum.new("name" => "経時")],
      ["北条", Jubatus::Common::Datum.new("name" => "時頼")],
      ["北条", Jubatus::Common::Datum.new("name" => "長時")],
      ["北条", Jubatus::Common::Datum.new("name" => "政村")],
      ["北条", Jubatus::Common::Datum.new("name" => "時宗")],
      ["北条", Jubatus::Common::Datum.new("name" => "貞時")],
      ["北条", Jubatus::Common::Datum.new("name" => "師時")],
      ["北条", Jubatus::Common::Datum.new("name" => "宗宣")],
      ["北条", Jubatus::Common::Datum.new("name" => "煕時")],
      ["北条", Jubatus::Common::Datum.new("name" => "基時")],
      ["北条", Jubatus::Common::Datum.new("name" => "高時")],
      ["北条", Jubatus::Common::Datum.new("name" => "貞顕")],
      # ["北条", Jubatus::Common::Datum.new("name" => "守時")],
     ]

   # training data must be shuffled on online learning!
   train_data.sort_by{rand}

   # run train
   client.train(train_data)
 end

 def predict(client)
   # predict the last shogun
   data =
     [
      Jubatus::Common::Datum.new("name" => "慶喜"),
      Jubatus::Common::Datum.new("name" => "義昭"),
      Jubatus::Common::Datum.new("name" => "守時"),
     ]
   data.each { |d|
     res = client.classify([d])
     # get the predicted shogun name
     puts res[0].max_by{ |x| x.score }.label + d.string_values[0][1]
   }
 end

 # connect to the jubatus
 client = Jubatus::Classifier::Client::Classifier.new($host, $port, $name)
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
    一般に、regularization_weightパラメータは大きくすると学習が早くなりますが、代わりにノイズに弱くなります。

**shogun.rb**

学習と予測の手順を説明します。

Classifierのクライアントプログラムは、 Jubatus::Classifier::Client::Classifierを利用して作成します。
使用するメソッドは、学習を行うtrainメソッドと、与えられたデータから予測を行うclassifyメソッドの2つです。

1. Jubatus Serverへの接続設定
    Jubatus Serverへの接続を行います（91行目）。

    Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号, タスクを識別するZookeeperクラスタ内でユニークな名前を設定します。

2. 学習用データの準備
    Jubatus Serverに学習させるデータを作成します。

    ClassifierClientではArray<Array<String, Datum>>を作成し、ClassifierClientのtrainメソッドに与えることで、学習が行われます。
    下図に、今回作成する学習データの構造を示します。

    +------------------------------------------------------------------------------------------------------+
    |Array<Array<String, Datum>>                                                                           |
    +-------------+----------------------------------------------------------------------------------------+
    |label(String)|Datum                                                                                   |
    +-------------+-----------------------------+----------------------------+-----------------------------+
    |             |Array<Array<String, String>> |Array<Array<String, Float>> |Array<Array<String, String>> |
    +-------------+-----------+-----------------+------------+---------------+------------+----------------+
    |             |key(String)|value(String)    |key(String) |value(Float)   |key(String) |value(String)   |
    +=============+===========+=================+============+===============+============+================+
    |"徳川"       |"name"     |"家康"           |            |               |            |                |
    +-------------+-----------+-----------------+------------+---------------+------------+----------------+
    |"徳川"       |"name"     |"秀忠"           |            |               |            |                |
    +-------------+-----------+-----------------+------------+---------------+------------+----------------+
    |"徳川"       |"name"     |"家光"           |            |               |            |                |
    +-------------+-----------+-----------------+------------+---------------+------------+----------------+
    |"徳川"       |"name"     |"家綱"           |            |               |            |                |
    +-------------+-----------+-----------------+------------+---------------+------------+----------------+
    |"足利"       |"name"     |"尊氏"           |            |               |            |                |
    +-------------+-----------+-----------------+------------+---------------+------------+----------------+
    |"足利"       |"name"     |"義詮"           |            |               |            |                |
    +-------------+-----------+-----------------+------------+---------------+------------+----------------+
    |"北条"       |"name"     |"時政"           |            |               |            |                |
    +-------------+-----------+-----------------+------------+---------------+------------+----------------+
    |"北条"       |"name"     |"義時"           |            |               |            |                |
    +-------------+-----------+-----------------+------------+---------------+------------+----------------+

    Array<String, Datum>はDatumとそのlabelの組です。
    サンプルでは、labelに将軍の姓を格納しています。

    Datumとは、Jubatusで利用できるkey-valueデータ形式のことです。
    特徴ベクトルに置き換えると、keyが特徴、valueが特徴量に相当します。
    Datumには3種類のkey-valueが存在します。
    1つはキーも値も文字列の文字列データ（string_values）です。
    1つはキーは同様に文字列で、値は数値の数値データ(num_values)です。
    もう1つは、キーは同様に文字列で、値は文字列のバイナリデータ(binary_values)です。

    今回は、将軍の名から姓を当てるプログラムなので、string_valuesのkeyに文字列"name"、valueに歴代将軍の名を格納します。
    今回のサンプルには含まれませんが、仮に"徳川"というグループに「徳川家の身長(height)は170cm以上である」という特徴を追加したい場合は、num_valuesのkeyに文字列"height"、valueに170を格納します。

    このサンプルでの学習データ作成の手順は下記の流れで行います。

    構造体train_dataの宣言で初期値として、上記の表どおりの構造で作成します。

    labelに"徳川"、Datumのstring_valuesに"name"と"家康”というセットを名の数だけ作成します。
    valueが文字列の場合は、string_valuesに値がセットされます。（15-66行目）。

3. データの学習（学習モデルの更新）
    2.の工程で作成した学習データを、trainメソッドに渡すことで学習が行われます（72行目）。

4. 予測用データの準備
    予測も学習時と同様に、Datumを作成します。

    DatumのArrayをClassifierClientのclassifyメソッドに与えることで、予測が行われます。
    「nameが"慶喜"」の将軍の姓は何かを予測させるため、学習時と同様に構造体dataの宣言で初期値として、Datumのstring_valuesに"name"と"慶喜"を設定します（77-82行目）。

5. 学習データに基づく予測
    4\. で作成したDatumのArrayを、classifyメソッドに渡すことで、予測値のArrayを得ることができます（84行目）。予測値は、あるlabelと、そのlabelに対する所属の確信度を表すscoreのペアで表されています。

6. 結果の出力
    結果出力、5. で得たArrayを参照することで予測値を見ることができます。
    サンプルでは、「確からしさの値」を表すscoreが最大であるlabel（姓）を判断し（86行目）、名と組み合わせて表示しています。


------------------------------------
サンプルプログラムの実行
------------------------------------

* Jubatus Serverでの作業
    jubaclassifierを起動します。

    ::

     $ jubaclassifier --configpath shogun.json

* Jubatus Clientでの作業
    サンプルクライアントプログラムを実行します。

    ::

     $ ruby shogun.rb
