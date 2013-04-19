Python
================================

ここではPython版のRegressionサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするrent.jsonとデータの学習及び学習モデルに基づく推定を行うmain.py、
また学習用データとしてrent-data.csv、推定用データとしてmyhome.ymlを使用します。
以下にrent.jsonとmain.pyおよびmyhome.ymlのソースコードを記載します。

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

**main.py**

.. code-block:: python

 01 : import argparse
 02 : import yaml
 03 : 
 04 : from jubatus.regression.client import regression
 05 : from jubatus.regression.types import *
 06 : from jubahomes.version import get_version
 07 : 
 08 : def parse_options():
 09 :   parser = argparse.ArgumentParser()
 10 :   parser.add_argument(
 11 :     '-a',
 12 :     required = True,
 13 :     help     = 'analyze data file (YAML)',
 14 :     metavar  = 'FILE',
 15 :     dest     = 'analyzedata'
 16 :   )
 17 :   parser.add_argument(
 18 :     '-t',
 19 :     help     = 'train data file (CSV)',
 20 :     metavar  = 'FILE',
 21 :     dest     = 'traindata'
 22 :   )
 23 :   parser.add_argument(
 24 :     '-v',
 25 :     '--version',
 26 :     action   = 'version',
 27 :     version  = '%(prog)s ' + get_version()
 28 :   )
 29 :   return parser.parse_args()
 30 : 
 31 : def main():
 32 :   args = parse_options()
 33 :   # 1. Jubatus Serverへの接続設定
 34 :   client = regression('127.0.0.1', 9199)
 35 : 
 36 :   # 2. 学習用データの準備
 37 :   num = 0
 38 :   if args.traindata:
 39 :     with open(args.traindata, 'r') as traindata:
 40 :       for data in traindata:
 41 : 
 42 :         # skip comments
 43 :         if not len(data) or data.startswith('#'):
 44 :           continue
 45 :         num += 1
 46 : 
 47 :         rent, distance, space, age, stair, aspect = map(str.strip, data.strip().split(','))
 48 :         string_values = [
 49 :           ['aspect', aspect]
 50 :         ]
 51 :         num_values = [
 52 :           ['distance', float(distance)],
 53 :           ['space', float(space)],
 54 :           ['age', float(age)],
 55 :           ['stair', float(stair)]
 56 :         ]
 57 :         d = datum(string_values, num_values)
 58 :         train_data = [[float(rent), d]]
 59 : 
 60 :         # 3. データの学習（学習モデルの更新）
 61 :         client.train('', train_data)
 62 : 
 63 :     # print train number
 64 :     print 'train ...', num
 65 : 
 66 :   # 4. 推定用データの準備
 67 :   with open(args.analyzedata, 'r') as analyzedata:
 68 :     myhome = yaml.load(analyzedata)
 69 :     string_values = [
 70 :       ['aspect', str(myhome['aspect'])]
 71 :     ]
 72 :     num_values = [
 73 :       ['distance', float(myhome['distance'])],
 74 :       ['space', float(myhome['space'])],
 75 :       ['age', float(myhome['age'])],
 76 :       ['stair', float(myhome['stair'])]
 77 :     ]
 78 :     d = datum(string_values, num_values)
 79 :     analyze_data = [d]
 80 : 
 81 :     # 5. 学習モデルに基づく推定
 82 :     result = client.estimate('', analyze_data)
 83 : 
 84 :     # 6. 結果の出力
 85 :     print 'rent ....', round(result[0], 1)
 86 : 


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


**main.py**

学習と推定の手順を説明します。

Regressionのクライアントプログラムは、jubatus.regressionクラス内で定義されているRegressionClientクラスを利用して作成します。
使用するメソッドは、学習を行うtrainメソッドと、与えられたデータから推定を行うestimateメソッドの2つです。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（34行目）。
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
  
  まず、学習用データの元となるCSVファイルを読み込みます（39行目）。
  for文にて1行ずつループで読み込んで処理します（40-61行目）。
  CSVファイルなので、取得した1行を','で分割し要素ごとに分け、それぞれ変数に代入します（47行目）。
  
  文字列項目と数値項目の要素をそれぞれ、string_valuesとnum_valuesとして定義します（48-56行目）。
  次に、datum()を使って、Datumクラスを生成します（57行目）。
  そのDatumにlabelとして家賃（rent）を付与したものを学習用データの1つ（変数train_data）として使用します（58行目）。

 3. データの学習（学習モデルの更新）

  2.の工程で作成した学習用データを、trainメソッドに渡すことで学習が行われます（61行目）。
  trainメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。（スタンドアロン構成の場合、空文字（""）を指定）
  第2引数として、先ほど②で作成したtrainDataを指定します。

 4. 推定用データの準備

  推定も学習時と同様に、推定用のDatumを作成します。
  ここでは、推定用のデータをYAMLファイルから読み込む方法で実装します。
  YAML（ヤムル）とは、構造化データやオブジェクトを文字列にシリアライズ（直列化）するためのデータ形式の一種です。
  
  あらかじめ作成したYAMLファイル（myhome.yml）をyaml.load()で読み込むとdict型で返却します（68行目）。
  その要素から②の処理と同じ様に文字列項目と数値項目を作成しDatumを作成します（69-78行目）。
  
  作成したDatumを推定用データのListに追加し、RegressionClientのestimateメソッドに与えることで、推定が行われます。
  
 5. 学習モデルに基づく推定

  4.で作成したDatumのListを、estimateメソッドに渡すことで、推定結果のListを得ることができます（82行目）。

 6. 結果の出力

  5.で取得した、推定結果のリストは推定用データの順番で返却されます。（サンプルでは推定用データは1データなので1つしか返却されません）
  推定結果はFloat型なので、出力のために小数第二位で四捨五入しています（85行目）。

------------------------------------
サンプルプログラムの実行
------------------------------------
**［Jubatus Serverでの作業］**

 jubaregressionを起動します。

 ::

  $ jubaregression --configpath rent.json


**［Jubatus Clientでの作業］**

 このサンプルでは、コマンドラインアプリケーションをインストールして利用します。

 ::

  $ sudo python setup.py install

 オプションを指定し下記のコマンドで実行します。
 
 ::

  $ jubahomes -t dat/rent-data.csv -a dat/myhome.yml


 **-t** ：CSVファイルパス（学習データありの場合）

 **-a** ：YMLファイルパス（必須）

**［実行結果］**

 ::

  train ... 145
  rent .... 9.9

 dat/myhome.yaml を変更し、いろんな条件で物件の家賃を推測できます。

 ::

  $ edit dat/myhome.yml
  $ jubahomes -a dat/myhome.yml
  $ edit dat/myhome.yml
  $ jubahomes -a dat/myhome.yml
    :

