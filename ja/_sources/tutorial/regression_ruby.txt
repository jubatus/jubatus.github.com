Ruby
================================

ここではRuby版のRegressionサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするrent.jsonとデータの学習及び学習モデルに基づく推定を行うrent.rb、
また学習用データとしてrent-data.csv、推定用データとしてmyhome.ymlを使用します。
以下にrent.jsonとrent.rbおよびmyhome.ymlのソースコードを記載します。

**rent.json**

.. code-block:: python

 01 : {
 02 :   "method": "PA",
 03 :   "converter": {
 04 :     "num_filter_types": {},
 05 :     "num_filter_rules": [],
 06 :     "string_filter_types": {},
 07 :     "string_filter_rules": [],
 08 :     "num_types": {},
 09 :     "num_rules": [
 10 :       { "key": "*", "type": "num" }
 11 :     ],
 12 :     "string_types": {},
 13 :     "string_rules": [
 14 :       { "key": "aspect", "type": "str", "sample_weight": "bin", "global_weight": "bin" }
 15 :     ]
 16 :   },
 17 :   "parameter": {
 18 :     "sensitivity": 0.1,
 19 :     "regularization_weight": 3.402823e+38
 20 :   }
 21 : }

**rent.rb**

.. code-block:: ruby

 01 : #!/usr/bin/env ruby
 02 : # -*- coding: utf-8 -*-
 03 : 
 04 : $host = "127.0.0.1"
 05 : $port = 9199
 06 : $name = "rent"
 07 : 
 08 : require 'json'
 09 : 
 10 : require 'jubatus/regression/client'
 11 : require 'jubatus/regression/types'
 12 : require 'optparse'
 13 : require 'csv'
 14 : require 'yaml'
 15 : 
 16 : args = {}
 17 : OptionParser.new do |opt|
 18 :   # バージョン情報
 19 :   Version = "1.0.0"
 20 : 
 21 :   opt.on('-a VAL', '--analyze','analyze data file path (YAML)') {|val| args[:analyzedata] = val }
 22 :   opt.on('-t VAL', '--train', 'train data file path (CSV)') {|val| args[:traindata]= val }
 23 : 
 24 :   opt.parse!(ARGV)
 25 : end
 26 : 
 27 : # 1. Jubatus Serverへの接続
 28 : client = Jubatus::Regression::Client::Regression.new($host, $port)
 29 : 
 30 : # train
 31 : if args.has_key?(:traindata) then
 32 : 
 33 :   # 2. 学習用データの準備
 34 :   num = 0
 35 :   
 36 :   CSV.foreach(args[:traindata].to_s, "r") do |traindata|
 37 :  
 38 :     # skip comments
 39 :     if not traindata.length > 0 or traindata[0].to_s.start_with?("#") then
 40 :       next
 41 :     end
 42 :     num += 1
 43 :         
 44 :     rent, distance, space, age, stair, aspect = traindata
 45 : 
 46 :     string_values = [
 47 :       ['aspect', aspect]
 48 :     ]
 49 :     num_values = [
 50 :       ['distance', distance.to_f],
 51 :       ['space', space.to_f],
 52 :       ['age', age.to_f],
 53 :       ['stair', stair.to_f]
 54 :     ]
 55 : 
 56 :     d = Jubatus::Regression::Datum.new(string_values, num_values)
 57 :     train_data = [[rent.to_f, d]]
 58 : 
 59 :     # 3. データの学習（学習モデルの更新）
 60 :     client.train('', train_data)
 61 :   end
 62 : 
 63 :   # print train number
 64 :   print 'train ...', num , "\n"
 65 : 
 66 : end
 67 : 
 68 : # anaylze
 69 : # 4. 推定用データの準備
 70 : File.open(args[:analyzedata].to_s) do |analyzedata|
 71 : 
 72 :   YAML.load_documents(analyzedata) do |myhome|
 73 :     string_values = [
 74 :       ['aspect', myhome['aspect'].to_s]
 75 :     ]
 76 :     num_values = [
 77 :       ['distance', myhome['distance'].to_f],
 78 :       ['space', myhome['space'].to_f],
 79 :       ['age', myhome['age'].to_f],
 80 :       ['stair', myhome['stair'].to_f]
 81 :     ]
 82 :     d = Jubatus::Regression::Datum.new(string_values, num_values)
 83 :     analyze_data = [d]
 84 :     # 5. 学習モデルに基づく推定
 85 :     result = client.estimate('', analyze_data)
 86 :     # 6. 結果の出力
 87 :     print 'rent ....', result[0].round(1)
 88 :   end
 89 : end
 

**myhome.yml**

::

 01 :  #
 02 :  # distance : 駅からの徒歩時間 (分)
 03 :  # space    : 専有面積 (m*m)
 04 :  # age      : 築年数 (年)
 05 :  # stair    : 階数
 06 :  # aspect   : 向き [ N / NE / E / SE / S / SW / W / NW ]
 07 :  #
 08 :  distance : 8
 09 :  space    : 32.00
 10 :  age      : 15
 11 :  stair    : 5
 12 :  aspect   : "S"


--------------------------------
解説
--------------------------------

**rent.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下の通りです。

* method

 分類に使用するアルコリズムを指定します。
 Regressionで指定できるのは、現在"PA"のみなので"PA"（Passive Agressive）を指定します。


* converter

 特徴変換の設定を指定します。
 ここでは、"num_rules"と"string_rules"を設定しています。
 
 "num_rules"は数値特徴の抽出規則を指定します。
 "key"は"*"つまり、すべての"key"に対して、"type"は"num"なので、指定された数値をそのまま重みに利用する設定です。
 具体的には、築年数が"2"であれば"2"を、階数が"6"であれば"6"を重みとします。
 
 "string_rules"は文字列特徴の抽出規則を指定します。
 "key"は"aspect"、"type"は"str"、"sample_weight"は"bin"、"global_weight"は"bin"としています。
 これは、"aspect"という"key"は文字列として扱い、指定された文字列をそのまま特徴として利用し、各key-value毎の重みと今までの通算データから算出される、大域的な重みを常に"1"とする設定です。

* parameter

 アルゴリズムに渡すパラメータを指定します。methodに応じて渡すパラメータは異なります。
 ここではmethodで“PA”を指定していますので、"sensitivity"と"regularization_weight"を設定します。
 
 sensitivity：許容する誤差の幅を指定する。大きくするとノイズに強くなる代わりに、誤差が残りやすくなる。
 regularization_weight：学習に対する感度パラメータを指定する。大きくすると学習が早くなる代わりに、ノイズに弱くなる。
 
 なお、各アルゴリズムのregularization_weightパラメータ（学習に対する感度パラメータ）はアルゴリズム中における役割が異なるため、アルゴリズム毎に適切な値は異なることに注意してください。


**rent.rb**

 学習と推定の手順を説明します。

 Regressionのクライアントプログラムは、jubatus.regressionクラス内で定義されているRegressionClientクラスを利用して作成します。
 使用するメソッドは、学習を行うtrainメソッドと、与えられたデータから推定を行うestimateメソッドの2つです。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（28行目）。
  Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号を設定します。

 2. 学習用データの準備

  このサンプルでは、オプションとして"-t"を指定しCSVファイルパスを指定した場合のみ、2.～3.の学習を行います。
  オプションが指定された場合の、学習用データ作成の手順は下記の流れで行います。
  
  RegressionClientでは、list<tuple<float, datum>>のListを学習用データとして作成し、RegressionClientのtrainメソッドに与えることで、学習が行われます。
  今回は賃貸情報サイトのCSVファイルを元に学習用データを作成していきます。
  賃貸情報の要素として、家賃（rent）、向き（aspect）、駅からの徒歩時間（distance）、占有面積（space）、築年数（age）、階数（stair）があります。
  下図に、今回作成する学習用データの構造を示します。（rent-data.csvの内容は100件以上ありますが、ここでは4件を例として挙げています）
  
  +------------------------------------------------------------------------+
  |                         list<tuple<float, datum>>                      |
  +-------------+----------------------------------------------------------+
  |label(Float) |Datum                                                     |
  |             +----------------------------+-----------------------------+
  |             |list<tuple<string, string>> |list<tuple<string, double>>  |
  |             +------------+---------------+---------------+-------------+
  |             |key(String) |value(String)  |key(String)    |value(double)|
  +=============+============+===============+===============+=============+
  |5.0          |"aspect"    |"SW"           | | "distance"  | | 10        |
  |             |            |               | | "space"     | | 20.04     |
  |             |            |               | | "age"       | | 12        |
  |             |            |               | | "stair"     | | 1         |
  +-------------+------------+---------------+---------------+-------------+
  |6.3          |"aspect"    |"N"            | | "distance"  | | 8         |
  |             |            |               | | "space"     | | 21.56     |
  |             |            |               | | "age"       | | 23        |
  |             |            |               | | "stair"     | | 2         |
  +-------------+------------+---------------+---------------+-------------+
  |7.5          |"aspect"    |"SE"           | | "distance"  | | 25        |
  |             |            |               | | "space"     | | 22.82     |
  |             |            |               | | "age"       | | 23        |
  |             |            |               | | "stair"     | | 4         |
  +-------------+------------+---------------+---------------+-------------+
  |9.23         |"aspect"    |"S"            | | "distance"  | | 10        |
  |             |            |               | | "space"     | | 30.03     |
  |             |            |               | | "age"       | | 0         |
  |             |            |               | | "stair"     | | 2         |
  +-------------+------------+---------------+---------------+-------------+

  tuple<float, datum>はDatumとそのラベル（label）の組です。
  Datumとは、Jubatusで利用できるkey-valueデータ形式のことです。Datumには2つのkey-valueが存在します。
  1つはキーも値も文字列の文字列データ（string_values）、もう一方は、キーは同様に文字列で、バリューは数値の数値データ（num_values）です。
  それぞれ、list<tuple<string, string>>とlist<tuple<string, double>>で表します。
  
  | 表の1つ目のデータを例に説明すると、向き（aspect）は文字列なのでlist<tuple<string, string>>の
  | 1番目のListとしてキーに"aspect"、バリューに"SW"を設定します。
  | それ以外の項目は数値なので、list<tuple<string, double>>の
  | 1番目のListとしてキーに"distance"、バリューに'10'、
  | 2番目のListとしてキーに"space"、バリューに'20.04'、
  | 3番目のListとしてキーに"age"、バリューに'15'、
  | 4番目のListとしてキーに"stair"、バリューに'1'と設定します。
  
  これらの5つのListを保持したDatumにラベルとして家賃である'5.0'を付け加え、家賃が'5.0'である賃貸の条件を保持したtuple<float, datum>ができます。
  その家賃ごとのデータ（tuple<float, datum>）をListとしたものを学習用データとして使用します。
  
  
  まず、学習用データの元となるCSVファイルを読み込みます。（36行目）
  foreachメソッドにて1行ずつループで読み込んで処理します。（36-61行目）
  CSVファイルなので、取得した1行を','で分割し要素ごとに分け、それぞれ変数に代入します。（44行目）
  
  文字列項目と数値項目の要素をそれぞれ、string_valuesとnum_valuesとして定義します。（46-54行目）
  次に、Datumクラスを生成します。（56行目）
  そのDatumにlabelとして家賃（rent）を付与したものを学習用データの1つ（変数train_data）として使用します。（57行目）

 3. データの学習（学習モデルの更新）

  2.の工程で作成した学習用データを、trainメソッドに渡すことで学習が行われます（60行目）。
  trainメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。（スタンドアロン構成の場合、空文字（""）を指定）
  第2引数として、先ほど②で作成したtrainDataを指定します。

 4. 推定用データの準備

  推定も学習時と同様に、推定用のDatumを作成します。
  ここでは、推定用のデータをYAMLファイルから読み込む方法で実装します。
  YAML（ヤムル）とは、構造化データやオブジェクトを文字列にシリアライズ（直列化）するためのデータ形式の一種です。
  
  あらかじめ作成したYAMLファイル（myhome.yml）をオープンし、YAML.load_documents()で読み込むとhash型で取得できます。（72行目）
  その要素から②の処理と同じ様に文字列項目と数値項目を作成しDatumを作成します。（73-82行目）
   
  作成したDatumを推定用データのListに追加し、RegressionClientのestimateメソッドに与えることで、推定が行われます。
  
 5. 学習モデルに基づく推定

  4.で作成したDatumのListを、estimateメソッドに渡すことで、推定結果のListを得ることができます（85行目）。

 6. 結果の出力

  5.で取得した、推定結果のリストは推定用データの順番で返却されます。（サンプルでは推定用データは1データなので1つしか返却されません）
  推定結果はFloat型なので、出力のために小数第二位で四捨五入しています。（87行目）

------------------------------------
サンプルプログラムの実行
------------------------------------
**［Jubatus Serverでの作業］**

 jubaregressionを起動します。

 ::

  $ jubaregression --configpath rent.json


**［Jubatus Clientでの作業］**

 オプションを指定し下記のコマンドで実行します。
  
 ::

  $ ruby rent.rb -t dat/rent-data.csv -a dat/myhome.yml


 **-t** ：CSVファイルパス（学習データありの場合）

 **-a** ：YMLファイルパス（必須）


**［実行結果］**

 ::

  train ... 145
  rent .... 9.9
