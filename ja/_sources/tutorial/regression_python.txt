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

.. code-block:: js
 :linenos:

 {
   "method": "PA",
   "converter": {
     "num_filter_types": {},
     "num_filter_rules": [],
     "string_filter_types": {},
     "string_filter_rules": [],
     "num_types": {},
     "num_rules": [
       { "key": "*", "type": "num" }
     ],
     "string_types": {},
     "string_rules": [
       { "key": "aspect", "type": "str", "sample_weight": "bin", "global_weight": "bin" }
     ]
   },
   "parameter": {
     "sensitivity": 0.1,
     "regularization_weight": 3.402823e+38
   }
 }

**main.py**

.. code-block:: python
 :linenos:

 import argparse
 import yaml
 
 from jubatus.common import Datum
 from jubatus.regression.client import Regression
 from jubatus.regression.types import *
 from jubahomes.version import get_version
 
 def parse_options():
   parser = argparse.ArgumentParser()
   parser.add_argument(
     '-a',
     required = True,
     help     = 'analyze data file (YAML)',
     metavar  = 'FILE',
     dest     = 'analyzedata'
   )
   parser.add_argument(
     '-t',
     help     = 'train data file (CSV)',
     metavar  = 'FILE',
     dest     = 'traindata'
   )
   parser.add_argument(
     '-v',
     '--version',
     action   = 'version',
     version  = '%(prog)s ' + get_version()
   )
   return parser.parse_args()
 
 def main():
   args = parse_options()
 
   client = Regression('127.0.0.1', 9199, '')
 
   # train
   num = 0
   if args.traindata:
     with open(args.traindata, 'r') as traindata:
       for data in traindata:
 
         # skip comments
         if not len(data) or data.startswith('#'):
           continue
         num += 1
 
         rent, distance, space, age, stair, aspect = map(str.strip, data.strip().split(','))
         d = Datum({
             'aspect': aspect,
             'distance': float(distance),
             'space': float(space),
             'age': float(age),
             'stair': float(stair) })
         train_data = [[float(rent), d]]
 
         # train
         client.train(train_data)
 
     # print train number
     print 'train ...', num
 
   # anaylze
   with open(args.analyzedata, 'r') as analyzedata:
     myhome = yaml.load(analyzedata)
     d = Datum({
         'aspect': str(myhome['aspect']),
         'distance': float(myhome['distance']),
         'space': float(myhome['space']),
         'age': float(myhome['age']),
         'stair': float(myhome['stair'])
         })
     analyze_data = [d]
     result = client.estimate(analyze_data)
 
     print 'rent ....', round(result[0], 1)


**myhome.yml**

::

 #
 # distance : 駅からの徒歩時間 (分)
 # space    : 専有面積 (m*m)
 # age      : 築年数 (年)
 # stair    : 階数
 # aspect   : 向き [ N / NE / E / SE / S / SW / W / NW ]
 #
 distance : 8
 space    : 32.00
 age      : 15
 stair    : 5
 aspect   : "S"


--------------------------------
解説
--------------------------------

**rent.json**

設定は単体のJSONで与えられます。
JSONの各フィールドは以下の通りです。

* method
   使用するアルコリズムを指定します。
   Regressionで指定できるのは、現在"PA"のみなので"PA"（Passive Aggressive）を指定します。

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
   アルゴリズムに渡すパラメータを指定します。
   methodに応じて渡すパラメータは異なります。

   ここではmethodで“PA”を指定していますので、"sensitivity"と"regularization_weight"を設定します。

   sensitivity：許容する誤差の幅を指定する。
   大きくするとノイズに強くなる代わりに、誤差が残りやすくなる。
   regularization_weight：学習に対する感度パラメータを指定する。
   大きくすると学習が早くなる代わりに、ノイズに弱くなる。

   なお、各アルゴリズムのregularization_weightパラメータ（学習に対する感度パラメータ）はアルゴリズム中における役割が異なるため、アルゴリズム毎に適切な値は異なることに注意してください。


**main.py**

学習と推定の手順を説明します。

Regressionのクライアントプログラムは、jubatus.Regressionを利用して作成します。
使用するメソッドは、学習を行うtrainメソッドと、与えられたデータから推定を行うestimateメソッドの2つです。

1. Jubatus Serverへの接続設定
    Jubatus Serverへの接続を行います（35行目）。
    Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号, タスクを識別するZookeeperクラスタ内でユニークな名前を設定します。

2. 学習用データの準備
    このサンプルでは、オプションとして"-t"を指定しCSVファイルパスを指定した場合のみ、2.～3.の学習を行います。
    オプションが指定された場合の、学習用データ作成の手順は下記の流れで行います。

    Regressionでは、list<tuple<float, Datum>のlistを学習用データとして作成し、Regressionのtrainメソッドに与えることで、学習が行われます。
    今回は賃貸情報サイトのCSVファイルを元に学習用データを作成していきます。
    賃貸情報の要素として、家賃（rent）、向き（aspect）、駅からの徒歩時間（distance）、占有面積（space）、築年数（age）、階数（stair）があります。
    下図に、今回作成する学習用データの構造を示します。（rent-data.csvの内容は100件以上ありますが、ここでは4件を例として挙げています）

    +-----------------------------------------------------------------------------------------------------+
    |                         list<tuple<float, Datum>>                                                   |
    +-------------+---------------------------------------------------------------------------------------+
    |label(float) |Datum                                                                                  |
    |             +----------------------------+-----------------------------+----------------------------+
    |             |list<tuple<string, string>> |list<tuple<string, double>>  |list<tuple<string, string>> |
    |             +------------+---------------+---------------+-------------+------------+---------------+
    |             |key(string) |value(string)  |key(string)    |value(double)|key(string) |value(string)  |
    +=============+============+===============+===============+=============+============+===============+
    |5.0          |"aspect"    |"SW"           | | "distance"  | | 10        |            |               |
    |             |            |               | | "space"     | | 20.04     |            |               |
    |             |            |               | | "age"       | | 12        |            |               |
    |             |            |               | | "stair"     | | 1         |            |               |
    +-------------+------------+---------------+---------------+-------------+------------+---------------+
    |6.3          |"aspect"    |"N"            | | "distance"  | | 8         |            |               |
    |             |            |               | | "space"     | | 21.56     |            |               |
    |             |            |               | | "age"       | | 23        |            |               |
    |             |            |               | | "stair"     | | 2         |            |               |
    +-------------+------------+---------------+---------------+-------------+------------+---------------+
    |7.5          |"aspect"    |"SE"           | | "distance"  | | 25        |            |               |
    |             |            |               | | "space"     | | 22.82     |            |               |
    |             |            |               | | "age"       | | 23        |            |               |
    |             |            |               | | "stair"     | | 4         |            |               |
    +-------------+------------+---------------+---------------+-------------+------------+---------------+
    |9.23         |"aspect"    |"S"            | | "distance"  | | 10        |            |               |
    |             |            |               | | "space"     | | 30.03     |            |               |
    |             |            |               | | "age"       | | 0         |            |               |
    |             |            |               | | "stair"     | | 2         |            |               |
    +-------------+------------+---------------+---------------+-------------+------------+---------------+

    tuple<float, Datum>はDatumとそのラベル（label）の組です。
    Datumとは、Jubatusで利用できるkey-valueデータ形式のことです。
    Datumには3つのkey-valueが存在します。
    1つはキーも値も文字列の文字列データ（string_values）です。
    1つはキーは同様に文字列で、値は数値の数値データ(num_values)です。
    もう1つは、キーは同様に文字列で、値は文字列のバイナリデータ(binary_values)です。

    Datumのコンストラクタ引数で指定したdictのvalueが文字列の場合は、string_valuesに、valueが数値の場合はnum_valuesに値がセットされます。

    | 表の1つ目のデータを例に説明すると、向き（aspect）は文字列なのでstring_valuesとして、キーに"aspect"、バリューに"SW"を設定します。
    | それ以外の項目は数値なので、num_valuesに
    |  キーに"distance"、バリューに'10'、
    |  キーに"space"、バリューに'20.04'、
    |  キーに"age"、バリューに'15'、
    |  キーに"stair"、バリューに'1'
    | と設定します。

    これらの5つの情報を保持したDatumにラベルとして家賃である'5.0'を付け加え、家賃が'5.0'である賃貸の条件を保持したtuple<float, Datum>ができます。
    その家賃ごとのデータ（tuple<float, Datum>）をlistとしたものを学習用データとして使用します。

    まず、学習用データの元となるCSVファイルを読み込みます（40行目）。
    for文にて1行ずつループで読み込んで処理します（40-58行目）。
    CSVファイルなので、取得した1行を','で分割し要素ごとに分け、それぞれ変数に代入します（48行目）。

    文字列項目と数値項目の要素をそれぞれ、Datumのコンストラクタに辞書オブジェクトとして指定します（49-55行目）。
    そのDatumにlabelとして家賃（rent）を付与したものを学習用データの1つ（変数train_data）として使用します（55行目）。

3. データの学習（学習モデルの更新）
    2\.の工程で作成した学習用データを、trainメソッドに渡すことで学習が行われます（58行目）。
    trainメソッドの引数は、先ほど作成したtrain_dataを指定します。

4. 推定用データの準備
    推定も学習時と同様に、推定用のDatumを作成します。
    ここでは、推定用のデータをYAMLファイルから読み込む方法で実装します。
    YAML（ヤムル）とは、構造化データやオブジェクトを文字列にシリアライズ（直列化）するためのデータ形式の一種です。

    あらかじめ作成したYAMLファイル（myhome.yml）をyaml.load()で読み込むとdict型で返却します（65行目）。
    その要素から2の処理と同じ様に文字列項目と数値項目を作成しDatumを作成します（66-72行目）。

    作成したDatumを推定用データのlistに追加し、Regressionのestimateメソッドに与えることで、推定が行われます。

5. 学習モデルに基づく推定
    4\.で作成したDatumのlistを、estimateメソッドに渡すことで、推定結果のlistを得ることができます（74行目）。

6. 結果の出力
    5\.で取得した、推定結果のリストは推定用データの順番で返却されます。（サンプルでは推定用データは1データなので1つしか返却されません）
    推定結果はfloat型なので、出力のために小数第二位で四捨五入しています（76行目）。


------------------------------------
サンプルプログラムの実行
------------------------------------

* Jubatus Serverでの作業
    jubaregressionを起動します。

    ::

     $ jubaregression --configpath rent.json


* Jubatus Clientでの作業
    このサンプルでは、コマンドラインアプリケーションをインストールして利用します。

    ::

     $ sudo python setup.py install

    オプションを指定し下記のコマンドで実行します。

    ::

     $ jubahomes -t dat/rent-data.csv -a dat/myhome.yml

       -t ：CSVファイルパス（学習データありの場合）
       -a ：YMLファイルパス（必須）

    実行結果:

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
