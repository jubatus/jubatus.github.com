Java
==========================

ここではJava版のClassifierサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするshogun.jsonとデータの学習及び学習データに基づく予測を行うShogun.javaを利用します。以下にshogun.jsonとShogun.javaのソースコードを記載します。

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


**Shogun.java**

.. code-block:: java

 001 : import java.util.ArrayList;
 002 : import java.util.Collections;
 003 : import java.util.List;
 004 : 
 005 : import us.jubat.classifier.ClassifierClient;
 006 : import us.jubat.classifier.Datum;
 007 : import us.jubat.classifier.EstimateResult;
 008 : import us.jubat.classifier.TupleStringDatum;
 009 : import us.jubat.classifier.TupleStringDouble;
 010 : import us.jubat.classifier.TupleStringString;
 011 : 
 012 : public class Shogun {
 013 : 	public static final String HOST = "127.0.0.1";
 014 : 	public static final int PORT = 9199;
 015 : 	public static final String NAME = "shogun";
 016 : 
 017 : 	String[] data1 = {
 018 : 	        "家康", "秀忠", "家光", "家綱", "綱吉",
 019 : 	        "家宣", "家継", "吉宗", "家重", "家治",
 020 : 	        "家斉", "家慶", "家定", "家茂"
 021 : 	};
 022 : 	String[] data2 = {
 023 : 	        "尊氏", "義詮", "義満", "義持", "義量",
 024 : 	        "義教", "義勝", "義政", "義尚", "義稙",
 025 : 	        "義澄", "義稙", "義晴", "義輝", "義栄"
 026 : 	};
 027 : 	String[] data3 = {
 028 : 	        "時政", "義時", "泰時", "経時", "時頼",
 029 : 	        "長時", "政村", "時宗", "貞時", "師時",
 030 : 	        "宗宣", "煕時", "基時", "高時", "貞顕"
 031 : 	};
 032 : 
 033 : 	private final void start() throws Exception {
 034 : 		// 1.Jubatus Serverへの接続設定
 035 : 		ClassifierClient client = new ClassifierClient(HOST, PORT, 5);
 036 : 
 037 : 		// 2.学習用データの準備
 038 : 		List<TupleStringDatum> studyData = this.makeStudyData();
 039 : 
 040 : 		// 3.データの学習（学習モデルの更新）
 041 : 		client.train(NAME, studyData);
 042 : 
 043 : 		// 4.予測用データの準備
 044 : 		List<Datum> exData = this.makeExData();
 045 : 
 046 : 		// 5.学習データに基づく予測
 047 : 		List<List<EstimateResult>> result = client.classify(NAME, exData);
 048 : 
 049 : 		// 6.結果の出力
 050 : 		this.output(exData, result);
 051 : 
 052 : 		return;
 053 : 	}
 054 : 
 055 : 	// 2.学習用データの準備
 056 : 	private final List<TupleStringDatum> makeStudyData() {
 057 : 		List<TupleStringDatum> result = new ArrayList<TupleStringDatum>();
 058 : 		String familyName = "";
 059 : 
 060 : 		// ループ処理にて、各将軍の姓と名のセットを作成
 061 : 		for (int i = 0; i < 3; i++) {
 062 : 			String[] nameList = null;
 063 : 			switch (i) {
 064 : 			case 0:
 065 : 				familyName = "徳川";
 066 : 				nameList = this.data1;
 067 : 				break;
 068 : 			case 1:
 069 : 				familyName = "足利";
 070 : 				nameList = this.data2;
 071 : 				break;
 072 : 			case 2:
 073 : 				familyName = "北条";
 074 : 				nameList = this.data3;
 075 : 				break;
 076 : 			}
 077 : 
 078 : 			for (String name : nameList) {
 079 : 				TupleStringDatum train = new TupleStringDatum();
 080 : 
 081 : 				// datumを作成
 082 : 				Datum datum = new Datum();
 083 : 				datum.string_values = new ArrayList<TupleStringString>();
 084 : 				datum.num_values = new ArrayList<TupleStringDouble>();
 085 : 
 086 : 				// インスタンス変数firstにkey、secondにvalueを格納
 087 : 				TupleStringString tss = new TupleStringString();
 088 : 				tss.first = "name";
 089 : 				tss.second = name;
 090 : 
 091 : 				datum.string_values.add(tss);
 092 : 
 093 : 				train.first = familyName;
 094 : 				train.second = datum;
 095 : 
 096 : 				result.add(train);
 097 : 			}
 098 : 		}
 099 : 		// 学習用データをシャッフル
 100 : 		Collections.shuffle(result);
 101 : 
 102 : 		return result;
 103 : 	}
 104 : 
 105 : 	// 4.予測用データの準備
 106 : 	private List<Datum> makeExData() {
 107 : 		List<Datum> result = new ArrayList<Datum>();
 108 : 
 109 : 		String name = null;
 110 : 		for (int i = 0; i < 3; i++) {
 111 : 			switch (i) {
 112 : 			case 0:
 113 : 				name = "慶喜";
 114 : 				break;
 115 : 			case 1:
 116 : 				name = "義昭";
 117 : 				break;
 118 : 			case 2:
 119 : 				name = "守時";
 120 : 				break;
 121 : 			}
 122 : 
 123 : 			// datumを作成
 124 : 			Datum datum = new Datum();
 125 : 			datum.string_values = new ArrayList<TupleStringString>();
 126 : 			datum.num_values = new ArrayList<TupleStringDouble>();
 127 : 
 128 : 			TupleStringString tss = new TupleStringString();
 129 : 
 130 : 			// インスタンス変数firstにkey、secondにvalueを格納
 131 : 			tss.first = "name";
 132 : 			tss.second = name;
 133 : 
 134 : 			datum.string_values.add(tss);
 135 : 
 136 : 			result.add(datum);
 137 : 		}
 138 : 		return result;
 139 : 	}
 140 : 
 141 : 	private void output(List<Datum> exData, List<List<EstimateResult>> result) {
 142 : 		// 結果の出力
 143 : 		int i = 0;
 144 : 		int j = 0;
 145 : 		int iMax = 0;
 146 : 		double max = 0;
 147 : 		for (List<EstimateResult> res : result) {
 148 : 			// 結果リストの中でscoreが最大のものを判定
 149 : 			for (j = 0; j < res.size(); j++) {
 150 : 				if (res.get(j).score > max || max == 0) {
 151 : 					max = res.get(j).score;
 152 : 					iMax = j;
 153 : 				}
 154 : 			}
 155 : 			// 結果表示
 156 : 			System.out.print(res.get(iMax).label + " "
 157 : 					+ exData.get(i).string_values.get(0).second + "\n");
 158 : 			max = 0;
 159 : 			i++;
 160 : 		}
 161 : 		System.out.println();
 162 : 	}
 163 : 
 164 : 	public static void main(String[] args) throws Exception {
 165 : 		new Shogun().start();
 166 : 		System.exit(0);
 167 : 	}
 168 : 

 
 
--------------------------------
解説
--------------------------------

**shogun.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下の通りです。

 * method
 
  分類に使用するアルコリズムを指定します。
  今回は、AROW (Adaptive Regularization of Weight vectors)を指定しています。


 * converter
 
   特徴変換の設定を指定します。
   サンプルでは、将軍の名が"家康"の場合、"家"と"康"に分割し、これらの文字（漢字）を含む名の姓は"徳川"であるというようなグループ分けをしたいので、"string_types"でunigramを定義しています。また今回は、将軍の名を文字列データとして扱うので、数値型のフィルター及び特徴抽出器の設定はしていません。

 * parameter

   アルゴリズムに渡すパラメータを指定します。
   methodに応じて渡すパラメータは異なります。今回はmethodで"AROW"を指定していますので、「"regularization_weight": 1.0」を指定します。なお、各アルゴリズムのregularization_weightパラメータ（学習に対する感度パラメータ）はアルゴリズム中における役割が異なるため、アルゴリズム毎に適切な値は異なることに注意してください。regularization_weightパラメータは大きくすると学習が早くなりますが、代わりにノイズに弱くなります。
   
   
**Shogun.java**

学習と予測の手順を説明します。

Classifierのクライアントプログラムは、us.jubat.classifierクラス内で定義されているClassifierClientクラスを利用して作成します。使用するメソッドは、学習を行うtrainメソッドと、与えられたデータから予測を行うclassifyメソッドの2つです。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（35行目）。
  Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号，接続待機時間を設定します。

 2. 学習用データの準備

  Jubatus Serverに学習させるデータList<TupleStringDatum>を作成します（38行目）。
  
  ClassifierClientでは、TupleStringDatumのArrayListを作成し、ClassifierClientのtrainメソッドに与えることで、学習が行われます。下図に、今回作成する学習データの構造を示します。
  
  +-----------------------------------------------------------------+
  |                         TupleStringDatum                        |
  +-------------+---------------------------------------------------+
  |label(String)|Datum                                              |
  +-------------+-------------------------+-------------------------+
  |             |TupleStringString        |TupleStringDoubel        |
  +-------------+-----------+-------------+-----------+-------------+
  |             |key(String)|value(String)|key(String)|value(double)|
  +=============+===========+=============+===========+=============+
  |"徳川"       |"name"     |"家康"       |           |             |
  +-------------+-----------+-------------+-----------+-------------+
  |"徳川"       |"name"     |"秀忠"       |           |             |
  +-------------+-----------+-------------+-----------+-------------+
  |"徳川"       |"name"     |"家光"       |           |             |
  +-------------+-----------+-------------+-----------+-------------+
  |"徳川"       |"name"     |"家綱"       |           |             |
  +-------------+-----------+-------------+-----------+-------------+
  |"足利"       |"name"     |"尊氏"       |           |             |
  +-------------+-----------+-------------+-----------+-------------+
  |"足利"       |"name"     |"義詮"       |           |             |
  +-------------+-----------+-------------+-----------+-------------+
  |"北条"       |"name"     |"時政"       |           |             |
  +-------------+-----------+-------------+-----------+-------------+
  |"北条"       |"name"     |"義時"       |           |             |
  +-------------+-----------+-------------+-----------+-------------+


  TupleStringDatumはDatumとそのlabelの組みです。サンプルでは、labelに将軍の姓を格納しています。Datumとは、Jubatus で利用できるkey-valueデータ形式のことです。特徴ベクトルに置き換えると、keyが特徴、valueが特徴量に相当します。Datumには2つのkey-valueが存在します。1つはキーも値も文字列の文字列データ（string_values）です。もう一方は、キーは同様に文字列で、値は数値の数値データ(num_values)です。それぞれ、TupleStringStringクラスとTupleStringDoubleクラスで表します。今回は、将軍の名から姓を当てるプログラムなので、string_valuesのkeyに文字列 "name"、valueに歴代将軍の名を格納します。今回のサンプルには含まれませんが、仮に"徳川"というグループに「徳川家の身長(height)は170cm以上である」という特徴を追加したい場合は、num_valuesのkeyに文字列 "height"、valueに170を格納します。

  このサンプルでの学習データ作成の手順は下記の流れで行います。

  学習データを作成するprivateメソッド「makeStudyData」（56-103行目）で、TupleStringDatumのArrayListを宣言します（57行目）。続いて、TupleStringDatumクラスで表される学習データを作成します。今回は、各時代の将軍データを作成するため、for文にて各将軍の姓ごとに作成していきます。（61-98行目）

  今回の場合、将軍の姓をlabel、歴代将軍の名をDatumとして扱います。まず、switch文にてループごとに使用するデータを設定します。具体的に、case0では姓は"徳川"で名前のリストはdata1を使用します。（63-76行目）

  次に、for文にて名前のリスト分（"徳川"の場合、data1のリスト分）ループ処理にて姓と名のセットを作成します。（78-97行目）セットに必要なTupleStringDatumクラス、Datumクラスをそれぞれ生成します。（79-82行目）続いて、Datumに格納するためのkeyとvalueのセットを作成します。TupleStringStringとTupleStringDoubleのListをそれぞれ宣言して、Datumに格納します（83,84行目）。今回は将軍の名を文字列データとして扱うため、TupleStringStringの、keyを文字列"name"として、valueに各将軍の名を格納し、Datumのstring_values（List<TupleStringString>）に追加します(87-91行目)。最後にTupleStringDatumのfirstに姓を、secondに先ほど作成したDatumを設定し、Listに格納しループ処理を続けます。（93-96行目）

  以上のようにして作成したList<TuplestringDatum>をシャッフルします。（100行目）これで、学習用データの作成が完了します。

 3. データの学習（学習モデルの更新）

  2の工程で作成した学習データを、trainメソッドに渡すことで学習が行われます（41行目）。trainメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。

 4. 予測用データの準備

  予測も学習時と同様に、入力データからDatumを作成します。DatumのArrayListをClassifierClientのclassifyメソッドに与えることで、予測が行われます。予測用データを作成するprivateメソッド「makeExData」で、DatumのArrayListを宣言します（107行目）。「nameが"慶喜"」の将軍の姓は何かを予測させるため、学習時と同様にDatumを作成し、作成したDatumをArrayListに追加します（109-131行目）。

 5. 学習データに基づく予測

  4. で作成したDatumのArrayListを、classifyメソッドに渡すことで、予測値のListを得ることができます（47行目）。

 6. 結果の出力

  結果出力用のprivateメソッド「output」に、5. で得たListを渡し、Listを参照することで予測値を見ることができます。サンプルでは、「確からしさの値」を表すscoreが最大であるlabel（姓）を判断し（149-154行目）、名と組み合わせて表示しています。

------------------------------------
サンプルプログラムの実行
------------------------------------

［Jubatus Serverでの作業］
 jubaclassifierを起動します。

::

 $ jubaclassifier --configpath shogun.json

［Jubatus Clientでの作業］
 必要なパッケージとJavaクライアントを用意し、実行します。

