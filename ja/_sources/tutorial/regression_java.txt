Java
================================

ここではJava版のRegressionサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするrent.jsonとデータの学習及び学習モデルに基づく推定を行うrent.java、
また学習用データとしてrent-data.csv、推定用データとしてmyhome.ymlを使用します。
以下にrent.jsonとrent.javaおよびmyhome.ymlのソースコードを記載します。

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

**rent.java**

.. code-block:: java

 001 : package rent;
 002 : 
 003 : import java.io.BufferedReader;
 004 : import java.io.File;
 005 : import java.io.FileNotFoundException;
 006 : import java.io.FileReader;
 007 : import java.io.IOException;
 008 : import java.math.BigDecimal;
 009 : import java.util.ArrayList;
 010 : import java.util.Arrays;
 011 : import java.util.Collections;
 012 : import java.util.List;
 013 : import java.util.Map;
 014 : import java.util.HashMap;
 015 : 
 016 : import org.ho.yaml.Yaml;
 017 : 
 018 : import us.jubat.regression.Datum;
 019 : import us.jubat.regression.RegressionClient;
 020 : import us.jubat.regression.TupleFloatDatum;
 021 : import us.jubat.regression.TupleStringDouble;
 022 : import us.jubat.regression.TupleStringString;
 023 : 
 024 : public class rent {
 025 : 	public static final String HOST = "127.0.0.1";
 026 : 	public static final int PORT = 9199;
 027 : 	public static final String NAME = "rent";
 028 : 	public static final String FILE_PATH = "./src/main/resources/";
 029 : 
 030 : 	// CSVのカラム名定義
 031 : 	public static String[] CSV_COLUMN = {
 032 : 		"rent",
 033 : 		"distance",
 034 : 		"space",
 035 : 		"age",
 036 : 		"stair",
 037 : 		"aspect"
 038 : 		};
 039 : 
 040 : 	// String型の項目
 041 : 	public static String[] STRING_COLUMN = {
 042 : 		"aspect"
 043 : 		};
 044 : 
 045 : 	// Double型の項目
 046 : 	public static String[] DOUBLE_COLUMN = {
 047 : 		"distance",
 048 : 		"space",
 049 : 		"age",
 050 : 		"stair",
 051 : 		};
 052 : 
 053 : 	public void update(String cvsName) throws Exception {
 054 : 		// 1.Jubatus Serverへの接続設定
 055 : 		RegressionClient client = new RegressionClient(HOST, PORT, 5);
 056 : 
 057 : 		// 2.学習用データの準備
 058 : 		List<TupleFloatDatum> trainData = new ArrayList<TupleFloatDatum> ();
 059 : 		Datum datum = null;
 060 : 
 061 : 		 try {
 062 : 			File csv = new File(FILE_PATH + cvsName ); // CSVデータファイル
 063 : 
 064 : 			BufferedReader br = new BufferedReader(new FileReader(csv));
 065 : 			List<String> strList = new ArrayList<String> ();
 066 : 			List<String> doubleList = new ArrayList<String> ();
 067 : 
 068 : 			String line = "";
 069 : 
 070 : 			// 最終行までループでまわし、1行ずつ読み込む
 071 : 			while ((line = br.readLine()) != null) {
 072 : 				strList.clear();
 073 : 				doubleList.clear();
 074 : 				TupleFloatDatum train = new TupleFloatDatum();
 075 : 
 076 : 				// 1行をデータの要素に分割
 077 : 				String[] strAry = line.split(",");
 078 : 
 079 : 				// CSVのカラム数、コメントのチェック
 080 : 				if( strAry.length != CSV_COLUMN.length || strAry[0].startsWith("#")){
 081 : 					continue;
 082 : 				}
 083 : 
 084 : 				// StringとDoubleの項目ごとにListを作成
 085 : 				for (int i=0; i<strAry.length; i++) {
 086 : 					if(Arrays.toString(STRING_COLUMN).contains(CSV_COLUMN[i])){
 087 : 						strList.add(strAry[i]);
 088 : 					} else if(Arrays.toString(DOUBLE_COLUMN).contains(CSV_COLUMN[i])){
 089 : 						doubleList.add(strAry[i]);
 090 : 					}
 091 : 				}
 092 : 				// datumを作成
 093 : 				datum = makeDatum(strList, doubleList);
 094 : 
 095 : 				train.first = Float.parseFloat(strAry[0]);
 096 : 				train.second = datum;
 097 : 
 098 : 				trainData.add(train);
 099 : 			}
 100 : 			br.close();
 101 : 
 102 : 			// 学習データをシャッフル
 103 : 			Collections.shuffle(trainData);
 104 : 
 105 : 			// 3.データの学習（学習モデルの更新）
 106 : 			int trainCount = client.train( NAME, trainData);
 107 : 
 108 : 			System.out.print("train ... " + trainCount + "\n");
 109 : 
 110 : 		 } catch (FileNotFoundException e) {
 111 : 			 // Fileオブジェクト生成時の例外捕捉
 112 : 			 e.printStackTrace();
 113 : 		 } catch (IOException e) {
 114 : 			 // BufferedReaderオブジェクトのクローズ時の例外捕捉
 115 : 			 e.printStackTrace();
 116 : 		 }
 117 : 		return;
 118 : 	}
 119 : 
 120 : 	@SuppressWarnings("unchecked")
 121 : 	public void analyze(String yamlName) throws Exception {
 122 : 		RegressionClient client = new RegressionClient(HOST, PORT, 5);
 123 : 
 124 : 		// 4.推定用データの準備
 125 : 		List<Datum> datumList = new ArrayList<Datum> ();
 126 : 		// 結果リスト
 127 : 		List<Float> result = new ArrayList<Float> ();
 128 : 
 129 : 		try {
 130 : 			// YAMLファイルから設定を読み込む
 131 : 			Map<String, Object> hash = (HashMap<String, Object>) Yaml.load(new File(FILE_PATH + yamlName ));
 132 : 
 133 : 			// 推定用データ作成
 134 : 			datumList.add(makeDatum(hash));
 135 : 
 136 : 			// 5.学習モデルに基づく推定
 137 : 			result.addAll(client.estimate( NAME, datumList));
 138 : 
 139 : 			// 結果をBigDecimal型にする
 140 : 			BigDecimal bd = new BigDecimal(result.get(0));
 141 : 			// 少数第2位で四捨五入
 142 : 			BigDecimal bd2 = bd.setScale(1, BigDecimal.ROUND_HALF_UP);
 143 : 
 144 : 			// 6.結果の出力
 145 : 			System.out.print("rent .... " + bd2 );
 146 : 
 147 : 		} catch (FileNotFoundException e) {
 148 : 			 // Fileオブジェクト生成時の例外捕捉
 149 : 			 e.printStackTrace();
 150 : 		}
 151 : 
 152 : 		return;
 153 : 	}
 154 : 
 155 : 	// Datumを指定された名称で、リスト分作成（List用）
 156 : 	private Datum makeDatum(List<String> strList, List<String> doubleList) {
 157 : 
 158 : 		Datum datum = new Datum();
 159 : 		datum.string_values = new ArrayList<TupleStringString>();
 160 : 		datum.num_values = new ArrayList<TupleStringDouble>();
 161 : 
 162 : 		for( int i = 0 ; i < strList.size() ; i++) {
 163 : 			TupleStringString data = new TupleStringString();
 164 : 			data.first = STRING_COLUMN[i];
 165 : 			data.second = strList.get(i);
 166 : 
 167 : 			datum.string_values.add(data);
 168 : 		}
 169 : 
 170 : 		try {
 171 : 			for( int i = 0 ; i < doubleList.size() ; i++) {
 172 : 				TupleStringDouble data = new TupleStringDouble();
 173 : 				data.first = DOUBLE_COLUMN[i];
 174 : 				data.second = Double.parseDouble(doubleList.get(i));
 175 : 
 176 : 				datum.num_values.add(data);
 177 : 			}
 178 : 		} catch (NumberFormatException e){
 179 : 			e.printStackTrace();
 180 : 			return null;
 181 : 		}
 182 : 
 183 : 		return datum;
 184 : 	}
 185 : 
 186 : 	// Datumを指定された名称で、リスト分作成（Map用）
 187 : 	private Datum makeDatum(Map<String, Object> hash) {
 188 : 
 189 : 		Datum datum = new Datum();
 190 : 		datum.string_values = new ArrayList<TupleStringString>();
 191 : 		datum.num_values = new ArrayList<TupleStringDouble>();
 192 : 
 193 : 		for( int i = 0 ; i < STRING_COLUMN.length ; i++) {
 194 : 			// HashMapに項目が含まれている、かつNULLでない場合Datumに追加
 195 : 			if( hash.containsKey(STRING_COLUMN[i]) && hash.get(STRING_COLUMN[i]) != null ) {
 196 : 				TupleStringString data = new TupleStringString();
 197 : 
 198 : 				data.first = STRING_COLUMN[i];
 199 : 				data.second = hash.get(STRING_COLUMN[i]).toString();
 200 : 
 201 : 				datum.string_values.add(data);
 202 : 			}
 203 : 		}
 204 : 
 205 : 		try {
 206 : 			for( int i = 0 ; i < DOUBLE_COLUMN.length ; i++) {
 207 : 				// HashMapに項目が含まれている、かつNULLでない場合Datumに追加
 208 : 				if( hash.containsKey(DOUBLE_COLUMN[i]) && hash.get(DOUBLE_COLUMN[i]) != null ) {
 209 : 					TupleStringDouble data = new TupleStringDouble();
 210 : 
 211 : 					data.first = DOUBLE_COLUMN[i];
 212 : 					data.second = Double.parseDouble(hash.get(DOUBLE_COLUMN[i]).toString());
 213 : 
 214 : 					datum.num_values.add(data);
 215 : 				}
 216 : 			}
 217 : 		} catch (NumberFormatException e){
 218 : 			e.printStackTrace();
 219 : 			return null;
 220 : 		}
 221 : 
 222 : 		return datum;
 223 : 	}
 224 : 
 225 : 	// メインメソッド
 226 : 	public static void main(String[] args) throws Exception {
 227 : 
 228 : 		if(args.length < 1){
 229 : 			System.out.print("引数を指定してください。\n" +
 230 : 							"第１引数：YMLファイル名（必須）\n" +
 231 : 							"第２引数：CSVファイル名（学習データありの場合）\n");
 232 : 			return;
 233 : 		}
 234 : 
 235 : 		// 第２引数がある場合、学習モデル更新メソッドを起動
 236 : 		if(args.length > 1 && !"".equals(args[1])){
 237 : 			new rent().update(args[1]);
 238 : 		}
 239 : 		if(!"".equals(args[0])){
 240 : 			new rent().analyze(args[0]);
 241 : 		}
 242 : 
 243 : 		System.exit(0);
 244 : 	}
 245 : }
 

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


**rent.java**

学習と推定の手順を説明します。

 Regressionのクライアントプログラムは、us.jubat.regressionクラス内で定義されているRegressionClientクラスを利用して作成します。
 使用するメソッドは、学習を行うtrainメソッドと、与えられたデータから推定を行うestimateメソッドの2つです。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（55行目）。
  Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号，接続待機時間を設定します。

 2. 学習用データの準備

  RegressionClientでは、TupleFloatDatumのListを学習用データとして作成し、RegressionClientのtrainメソッドに与えることで、学習が行われます。
  今回は賃貸情報サイトのCSVファイルを元に学習用データを作成していきます。
  賃貸情報の要素として、家賃（rent）、向き（aspect）、駅からの徒歩時間（distance）、占有面積（space）、築年数（age）、階数（stair）があります。
  下図に、今回作成する学習用データの構造を示します。（rent-data.csvの内容は100件以上ありますが、ここでは4件を例として挙げています）
  
  +----------------------------------------------------------------------+
  |                         TupleFloatDatum                              |
  +-------------+--------------------------------------------------------+
  |label(Float) |Datum                                                   |
  |             +--------------------------+-----------------------------+
  |             |TupleStringString(List)   |TupleStringDoubel(List)      |
  |             +------------+-------------+---------------+-------------+
  |             |key(String) |value(String)|key(String)    |value(double)|
  +=============+============+=============+===============+=============+
  |5.0          |"aspect"    |"SW"         | | "distance"  | | 10        |
  |             |            |             | | "space"     | | 20.04     |
  |             |            |             | | "age"       | | 12        |
  |             |            |             | | "stair"     | | 1         |
  +-------------+------------+-------------+---------------+-------------+
  |6.3          |"aspect"    |"N"          | | "distance"  | | 8         |
  |             |            |             | | "space"     | | 21.56     |
  |             |            |             | | "age"       | | 23        |
  |             |            |             | | "stair"     | | 2         |
  +-------------+------------+-------------+---------------+-------------+
  |7.5          |"aspect"    |"SE"         | | "distance"  | | 25        |
  |             |            |             | | "space"     | | 22.82     |
  |             |            |             | | "age"       | | 23        |
  |             |            |             | | "stair"     | | 4         |
  +-------------+------------+-------------+---------------+-------------+
  |9.23         |"aspect"    |"S"          | | "distance"  | | 10        |
  |             |            |             | | "space"     | | 30.03     |
  |             |            |             | | "age"       | | 0         |
  |             |            |             | | "stair"     | | 2         |
  +-------------+------------+-------------+---------------+-------------+

  TupleFloatDatumはDatumとそのラベル（label）の組です。
  Datumとは、Jubatusで利用できるkey-valueデータ形式のことです。Datumには2つのkey-valueが存在します。
  1つはキーも値も文字列の文字列データ（string_values）、もう一方は、キーは同様に文字列で、バリューは数値の数値データ（num_values）です。
  それぞれ、TupleStringStringクラスとTupleStringDoubleクラスで表します。
  
  | 表の1つ目のデータを例に説明すると、向き（aspect）は文字列なのでTupleStringStringクラスの
  | 1番目のListとしてキーに"aspect"、バリューに"SW"を設定します。
  | それ以外の項目は数値なので、TupleStringDoubleクラスの
  | 1番目のListとしてキーに"distance"、バリューに'10'、
  | 2番目のListとしてキーに"space"、バリューに'20.04'、
  | 3番目のListとしてキーに"age"、バリューに'15'、
  | 4番目のListとしてキーに"stair"、バリューに'1'と設定します。
   
  これらの5つのListを保持したDatumにラベルとして家賃である'5.0'を付け加え、家賃が'5.0'である賃貸の条件を保持したTupleFloatDatumクラスができます。
  その家賃ごとのデータ（TupleFloatDatum）をListとしたものを学習用データとして使用します。
  
  
  このサンプルでの学習用データ作成の手順は下記の流れで行います。
  
  まず、学習用データの変数としてTupleFloatDatumのListであるtrainDataを宣言します（58行目）。
  次に、学習用データの元となるCSVファイルを読み込みます。
  ここでは、FileReaderとBuffererdReaderを利用して1行ずつループで読み込んで処理します（71-100行目）。
  CSVファイルなので、取得した1行を','で分割し要素ごとに分けます（77行目）。
  定義したCSVファイルの項目リスト（CSV_COLUMN）とString項目リスト（STRING_COLUMN）、Double項目リスト（FLOAT_COLUMN）を用い、CSVのデータをString項目はstrList、Double項目はdoubleListというリストを作成します（85-91行目）。
  作成した２つのリストを引数としてDatumを作成するprivateメソッド「makeDatum」を呼び出します（91行目）。
   
  「makeDatum」では、引数のString項目のリストとDouble項目のリストから、String項目はTupleStringStringのListを、Double項目はTupleStringDoubleのListを作成します（156-184行目）。
  まず、Datumクラスを生成してDatumの要素であるstring_valuesとnum_valuesのListをそれぞれ生成します（158-160行目）。
  次に、定義しているString項目リスト（STRING_COLUMN）と引数のstrListの順番は対応しているので、ループでTupleStringStringを生成し、要素firstにキー（カラム名）をsecondにバリュー（値）を設定してstring_valuesのListに追加します（162-168行目）。
  Double項目リストもString項目と同様にループでTupleStringDoubleを生成し、要素を設定してからnum_valuesに追加します。ここで注意する点は、引数はString型のListですがDatumのnum_valuesはDouble型の為、変換が必要になります（174行目）。
  これで、Datumの作成が完了しました。
  
  先ほどの、「makeDatum」で作成したDatumにlabelとして家賃（rent）を付与したものを学習用データの1つ（変数train）として使用します（95,96行目）。
  その作成した学習用データの1つを、CSVの読み込みループの中で学習用データの変数trainDataのListに追加する処理をCSVの行数分繰り返して、最終的にtrainDataをシャッフルすることで学習用データの作成が完了します（103行目）。

 3. データの学習（学習モデルの更新）

  2.の工程で作成した学習用データを、trainメソッドに渡すことで学習が行われます（106行目）。
  trainメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。（スタンドアロン構成の場合、空文字（""）を指定）
  第2引数として、先ほど2.で作成したtrainDataを指定します。
  戻り値として、学習した件数を返却します。

 4.推定用データの準備

  推定も学習時と同様に、推定用のDatumを作成します。
  ここでは、推定用のデータをYAMLファイルから読み込む方法で実装します。（別途ライブラリ `JYaml <http://jyaml.sourceforge.net/download.html>`_  が必要）
  YAML（ヤムル）とは、構造化データやオブジェクトを文字列にシリアライズ（直列化）するためのデータ形式の一種です。
  
  あらかじめ作成したYAMLファイル（myhome.yml）を読み込むとHashMapとして取得できます（131行目）。
  取得したHashMapを用い、2.でDatumを作成したのと同じ様にprivateメソッド「makeDatum」で作成します。
  
  ただし、ここで使用する「makeDatum」は引数がHashMapとなっているので、2.で使用したものと結果は同じですが処理が異なります（187-223行目）。
  また、推定用のデータなので全項目分を作成する必要はありません。条件としたい項目のみ作成します。
  
  作成したDatumを推定用データのListに追加し、RegressionClientのestimateメソッドに与えることで、推定が行われます。
  
 5.学習モデルに基づく推定

  4.で作成したDatumのListを、estimateメソッドに渡すことで、推定結果のListを得ることができます（137行目）。

 6.結果の出力

  5.で取得した、推定結果のリストは推定用データの順番で返却されます。（サンプルでは推定用データは1データなので1つしか返却されません）
  推定結果はFloat型なので、出力のために小数第二位で四捨五入しています。

-----------------------------------
サンプルプログラムの実行
-----------------------------------

**［Jubatus Serverでの作業］**

 jubaregressionを起動します。

 ::

  $ jubaregression --configpath rent.json

**［Jubatus Clientでの作業］**

 | 必要なパッケージとJavaクライアントを用意し、引数を指定して実行します。（第2引数は任意）
 |  第1引数：YMLファイル名（必須）
 |  第2引数：CSVファイル名（学習データありの場合）

**［実行結果］**

 ::

  train ... 145
  rent .... 9.9
