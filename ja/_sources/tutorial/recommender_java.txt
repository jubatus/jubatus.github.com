Java
==================

ここではJava版のRecommenderサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするnpb_similar_player.jsonと野手データの学習を行うUpdate.java、推薦を実行して結果を出力するAnalyze.java、
また学習用データとしてbaseball.csvを使用します。
以下にnpb_similar_player.jsonとUpdate.javaおよびAnalyze.javaのソースコードを記載します。

**npb_similar_player.json**

.. code-block:: python

 01 : {
 02 :   "method": "inverted_index",
 03 :   "converter": {
 04 :     "string_filter_types": {},
 05 :     "string_filter_rules": [],
 06 :     "num_filter_types": {},
 07 :     "num_filter_rules": [],
 08 :     "string_types": {},
 09 :     "string_rules": [],
 10 :     "num_types": {},
 11 :     "num_rules": [
 12 :       {"key" : "*", "type" : "num"}
 13 :     ]
 14 :   },
 15 :   "parameter": {}
 16 : }


**Update.java**

.. code-block:: java

 001 : package NpbSimilarPlayer;
 002 : 
 003 : import java.io.BufferedReader;
 004 : import java.io.File;
 005 : import java.io.FileNotFoundException;
 006 : import java.io.FileReader;
 007 : import java.io.IOException;
 008 : import java.util.ArrayList;
 009 : import java.util.Arrays;
 010 : import java.util.List;
 011 : 
 012 : 
 013 : import us.jubat.recommender.RecommenderClient;
 014 : import us.jubat.recommender.Datum;
 015 : import us.jubat.recommender.TupleStringDouble;
 016 : import us.jubat.recommender.TupleStringString;
 017 : 
 018 : public class Update {
 019 : 	public static final String HOST = "127.0.0.1";
 020 : 	public static final int PORT = 9199;
 021 : 	public static final String NAME = "NpbSimilarPlayer";
 022 : 	public static final String CSV_PATH = "./src/main/resources/baseball.csv";
 023 : 
 024 : 	// CSVのカラム名定義
 025 : 	public static String[] CSV_COLUMN = {
 026 : 		"名前",
 027 : 		"チーム",
 028 : 		"打率",
 029 : 		"試合数",
 030 : 		"打席",
 031 : 		"打数",
 032 : 		"安打",
 033 : 		"本塁打",
 034 : 		"打点",
 035 : 		"盗塁",
 036 : 		"四球",
 037 : 		"死球",
 038 : 		"三振",
 039 : 		"犠打",
 040 : 		"併殺打",
 041 : 		"長打率",
 042 : 		"出塁率",
 043 : 		"OPS" ,
 044 : 		"RC27",
 045 : 		"XR27"
 046 : 		};
 047 : 
 048 : 	// String型のカラム定義
 049 : 	public static String[] STRING_COLUMN = {
 050 : 		"チーム"
 051 : 		};
 052 : 
 053 : 	// Double型のカラム定義
 054 : 	public static String[] DOUBLE_COLUMN = {
 055 : 		"打率",
 056 : 		"試合数",
 057 : 		"打席",
 058 : 		"打数",
 059 : 		"安打",
 060 : 		"本塁打",
 061 : 		"打点",
 062 : 		"盗塁",
 063 : 		"四球",
 064 : 		"死球",
 065 : 		"三振",
 066 : 		"犠打",
 067 : 		"併殺打",
 068 : 		"長打率",
 069 : 		"出塁率",
 070 : 		"OPS" ,
 071 : 		"RC27",
 072 : 		"XR27"
 073 : 		};
 074 : 
 075 : 	public void start() throws Exception {
 076 : 		// 1. Jubatus Serverへの接続設定
 077 : 		RecommenderClient client = new RecommenderClient(HOST, PORT, 5);
 078 : 
 079 : 		// 2. 学習用データの準備
 080 : 		Datum datum = null;
 081 : 
 082 : 		try {
 083 : 			File csv = new File(CSV_PATH); // CSVデータファイル
 084 : 
 085 : 			BufferedReader br = new BufferedReader(new FileReader(csv));
 086 : 			List<String> strList = new ArrayList<String> ();
 087 : 			List<String> doubleList = new ArrayList<String> ();
 088 : 
 089 : 			String line = "";
 090 : 
 091 : 			// 最終行まで、1行ずつループでまわして読み込む
 092 : 			while ((line = br.readLine()) != null) {
 093 : 				strList.clear();
 094 : 				doubleList.clear();
 095 : 
 096 : 				// 1行をデータの要素ごとに分割
 097 : 				String[] strAry = line.split(",");
 098 : 
 099 : 				for (int i=0; i<strAry.length; i++) {
 100 : 					if(Arrays.toString(STRING_COLUMN).contains(CSV_COLUMN[i])){
 101 : 						strList.add(strAry[i]);
 102 : 					} else if(Arrays.toString(DOUBLE_COLUMN).contains(CSV_COLUMN[i])){
 103 : 						doubleList.add(strAry[i]);
 104 : 					}
 105 : 				}
 106 : 				// datumを作成
 107 : 				datum = makeDatum(strList, doubleList);
 108 : 				// 3. データの学習（学習モデルの更新）
 109 : 				client.update_row( NAME, strAry[0], datum);
 110 : 			}
 111 : 			br.close();
 112 : 
 113 : 		} catch (FileNotFoundException e) {
 114 : 			 // Fileオブジェクト生成時の例外捕捉
 115 : 			 e.printStackTrace();
 116 : 		} catch (IOException e) {
 117 : 			 // BufferedReaderオブジェクトのクローズ時の例外捕捉
 118 : 			 e.printStackTrace();
 119 : 		}
 120 : 		return;
 121 : 	}
 122 : 
 123 : 	// Datumを指定された名称で、リスト分作成
 124 : 	private Datum makeDatum(List<String> strList, List<String> doublelist) {
 125 : 
 126 : 		Datum datum = new Datum();
 127 : 		datum.string_values = new ArrayList<TupleStringString>();
 128 : 		datum.num_values = new ArrayList<TupleStringDouble>();
 129 : 
 130 : 		for( int i = 0 ; i < strList.size() ; i++) {
 131 : 			TupleStringString data = new TupleStringString();
 132 : 			data.first = STRING_COLUMN[i];
 133 : 			data.second = strList.get(i);
 134 : 
 135 : 			datum.string_values.add(data);
 136 : 		}
 137 : 
 138 : 		try {
 139 : 			for( int i = 0 ; i < doublelist.size() ; i++) {
 140 : 				TupleStringDouble data = new TupleStringDouble();
 141 : 				data.first = DOUBLE_COLUMN[i];
 142 : 				data.second = Double.parseDouble(doublelist.get(i));
 143 : 
 144 : 				datum.num_values.add(data);
 145 : 			}
 146 : 		} catch (NumberFormatException e){
 147 : 			return null;
 148 : 		}
 149 : 
 150 : 		return datum;
 151 : 	}
 152 : 
 153 : 
 154 : 	// メインメソッド
 155 : 	public static void main(String[] args) throws Exception {
 156 : 		new Update().start();
 157 : 		System.exit(0);
 158 : 	}
 159 : }

**Analyze.java**

.. code-block:: java

 01 : package NpbSimilarPlayer;
 02 : 
 03 : import java.io.BufferedReader;
 04 : import java.io.File;
 05 : import java.io.FileNotFoundException;
 06 : import java.io.FileReader;
 07 : import java.io.IOException;
 08 : import java.util.ArrayList;
 09 : import java.util.List;
 10 : 
 11 : 
 12 : import us.jubat.recommender.RecommenderClient;
 13 : import us.jubat.recommender.TupleStringFloat;
 14 : 
 15 : public class Analyze {
 16 : 	public static final String HOST = "127.0.0.1";
 17 : 	public static final int PORT = 9199;
 18 : 	public static final String NAME = "NpbSimilarPlayer";
 19 : 	public static final String CSV_PATH = "./src/main/resources/baseball.csv";
 20 : 
 21 : 	public void start() throws Exception {
 22 : 		// 1. Jubatus Serverへの接続設定
 23 : 		RecommenderClient client = new RecommenderClient(HOST, PORT, 5);
 24 : 
 25 : 		// 2. 推薦用データの準備
 26 : 		 List<TupleStringFloat> rec = new  ArrayList<TupleStringFloat>();
 27 : 
 28 : 		 try {
 29 : 			File csv = new File(CSV_PATH); // CSVデータファイル
 30 : 
 31 : 			BufferedReader br = new BufferedReader(new FileReader(csv));
 32 : 
 33 : 			// 最終行まで読み込む
 34 : 			String line = "";
 35 : 			while ((line = br.readLine()) != null) {
 36 : 
 37 : 				// 1行をデータの要素に分割
 38 : 				String[] strAry = line.split(",");
 39 : 
 40 : 				// 3. 学習モデルに基づく推薦
 41 : 				rec = client.similar_row_from_id(NAME, strAry[0], 4);
 42 : 
 43 : 				// 4. 結果の出力
 44 : 				System.out.print("player " + strAry[0] + " is similar to : " + rec.get(1).first +
 45 : 						" " +  rec.get(2).first + " " + rec.get(3).first );
 46 : 				System.out.println();
 47 : 			}
 48 : 			br.close();
 49 : 
 50 : 		 } catch (FileNotFoundException e) {
 51 : 			 // Fileオブジェクト生成時の例外捕捉
 52 : 			 e.printStackTrace();
 53 : 		 } catch (IOException e) {
 54 : 			 // BufferedReaderオブジェクトのクローズ時の例外捕捉
 55 : 			 e.printStackTrace();
 56 : 		 }
 57 : 
 58 : 		return;
 59 : 	}
 60 : 
 61 : 	// メインメソッド
 62 : 	public static void main(String[] args) throws Exception {
 63 : 		new Analyze().start();
 64 : 		System.exit(0);
 65 : 	}
 66 : }


--------------------------------
解説
--------------------------------

**npb_similar_player.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下の通りです。

* method

 分類に使用するアルコリズムを指定します。
 今回は、転置インデックスを利用したいので、"inverted_index"を指定します。
 Recommenderで指定できるアルゴリズムは上記以外に、"minhash"、"lsh"、"euclid_lsh"があります。


* converter

 特徴変換の設定を指定します。
 ここでは、"num_rules"を設定をしています。
 
 "num_rules"は数値特徴の抽出規則を指定します。
 "key"は"*"つまり、すべての"key"に対して、"type"は"num"なので、指定された数値をそのまま重みに利用する設定です。
 具体的には、打率が"0.33"であれば"0.33"を、打点が"30"であれば"30"を重みとします。
 
 "string_rules"は文字列特徴の抽出規則を指定します。
 今回は文字列は使用しないので指定していません。
 
* parameter

 アルゴリズムに渡すパラメータを指定します。methodに応じて渡すパラメータは異なります。
 methodで“inverted_index”を指定していますので、設定不要です。
  

**Update.java**

 学習と推薦の手順を説明します。

 Recommenderのクライアントプログラムは、us.jubat.Recommenderクラス内で定義されているRecommenderClientクラスを利用して作成します。
 使用するメソッドは、1データ分の学習を行うupdate_rowメソッドと、与えられたデータから推薦を行うestimateメソッドの2つです。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（33行目）。
  Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号，接続待機時間を設定します。

 2. 学習用データの準備

  Jubatus Serverに学習させるデータDatumを作成します（80行目）。
  
  RecommenderClientでは、Datumを学習用データとして作成し、RecommenderClientのupdate_rowメソッドに与えることで、学習が行われます。
  今回はプロ野球データfreakというサイトの野手データ（CSVファイル）を元に学習用データを作成していきます。
  野手データの要素として、"名前"、"チーム"、"打率"、"打数"、"安打"などがあります。
  下図に、今回作成する学習用データの構造を示します。

  +-------------+--------------------------------------------------------+
  |ID(String)   |Datum                                                   |
  |             +--------------------------+-----------------------------+
  |             |TupleStringString(List)   |TupleStringDoubel(List)      |
  |             +------------+-------------+---------------+-------------+
  |             |key(String) |value(String)|key(String)    |value(double)|
  +=============+============+=============+===============+=============+
  |"大島洋平"   |"チーム"    |"中日"       | | "打率"      | | 0.31      |
  |             |            |             | | "試合数"    | | 144       |
  |             |            |             | | "打席"      | | 631       |
  |             |            |             | | "打数"      | | 555       |
  |             |            |             | | "安打"      | | 172       |
  |             |            |             | | "本塁打"    | | 1         |
  |             |            |             | | "打点"      | | 13        |
  |             |            |             | | "盗塁"      | | 32        |
  |             |            |             | | "四球"      | | 46        |
  |             |            |             | | "死球"      | | 13        |
  |             |            |             | | "三振"      | | 80        |
  |             |            |             | | "犠打"      | | 17        |
  |             |            |             | | "併殺打"    | | 7         |
  |             |            |             | | "長打率"    | | 0.368     |
  |             |            |             | | "出塁率"    | | 0.376     |
  |             |            |             | | "OPS"       | | 0.744     |
  |             |            |             | | "RC27"      | | 5.13      |
  |             |            |             | | "XR27"      | | 4.91      |
  +-------------+------------+-------------+---------------+-------------+
  |"高橋由伸"   |"チーム"    |"巨人"       | | "打率"      | | 0.239     |
  |             |            |             | | "試合数"    | | 130       |
  |             |            |             | | "打席"      | | 442       |
  |             |            |             | | "打数"      | | 368       |
  |             |            |             | | ･･･         | | ･･･       |
  |             |            |             | | ･･･         | | ･･･       |
  +-------------+------------+-------------+---------------+-------------+
  
  
  Datumとは、Jubatusで利用できるkey-valueデータ形式のことです。Datumには2つのkey-valueが存在します。
  1つはキーも値も文字列の文字列データ（string_values）、もう一方は、キーは同様に文字列で、バリューは数値の数値データ（num_values）です。
  それぞれ、TupleStringStringクラスとTupleStringDoubleクラスで表します。
  
  | 表の1つ目のデータを例に説明すると、"チーム"は文字列なのでTupleStringStringクラスの
  | 1番目のListとしてキーに"チーム"、バリューに"中日"を設定します。
  | それ以外の項目は数値なので、TupleStringDoubleクラスの
  | 1番目のListとしてキーに"打率"、バリューに'0.31'、
  | 2番目のListとしてキーに"試合数"、バリューに'144'、
  | 3番目のListとしてキーに"打席"、バリューに'631'、
  | 4番目のListとしてキーに"打数"、バリューに'555'と
  | 最後の要素"XR27"の項目までListを作成し設定します。
  
  これらのListを保持したDatumをCSVの1行ずつ、つまり選手1人ずつ作成します。
  その、DatumとIDである選手の"名前"を学習用データとして使用します。

  このサンプルでの学習用データ作成の手順は下記の流れで行います。
  
  まず、学習用データの元となるCSVファイルを読み込みます。
  ここでは、FileReaderとBuffererdReaderを利用して1行ずつループで読み込んで処理します（83-112行目）。
  CSVファイルなので、取得した1行を','で分割し要素ごとに分けます（76行目）。
  定義したCSVファイルの項目リスト（CSV_COLUMN）とString項目リスト（STRING_COLUMN）、Double項目リスト（DOUBLE_COLUMN）を用い型ごとに分けてリストを作成します（99-105行目）。
  作成した 2 つのリストを引数としてDatumを作成するprivateメソッド「makeDatum」を呼び出します（107行目）。
  
  「makeDatum」では、引数のString項目のリストとDouble項目のリストから、String型はTupleStringStringのListを、Double型はTupleStringDoubleのListを作成します（124-151行目）。
  まず、Datumクラスを生成してDatumの要素であるstring_valuesとnum_valuesのListをそれぞれ生成します（126-128行目）。
  次に、定義しているString項目リスト（STRING_COLUMN）と引数のstrListの順番は対応しているので、ループでTupleStringStringを生成し、要素firstにキー（カラム名）をsecondにバリュー（値）を設定してstring_valuesのListに追加します（130-136行目）。
  Double項目リストもString項目と同様にループでTupleStringDoubleを生成し、要素を設定してからnum_valuesに追加します。ここで注意する点は、引数はString型ですがDatumのnum_valuesはDouble型の為、変換が必要になります（142行目）。
  これで、1人分の選手のデータが入ったDatumの作成が完了しました。

 3. データの学習（学習モデルの更新）

  2.の工程で作成した学習用データを、update_rowメソッドに渡すことで学習が行われます（109行目）。
  update_rowメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します（スタンドアロン構成の場合、空文字（""）を指定）。
  第2引数は、IDで学習データ内でユニークな名前を指定します。ここでは選手の"名前"をIDとして使用します。
  第3引数として、先ほど 2. で作成したDatumを指定します。
  これで、選手1人分のデータの学習が完了しました。ループ処理で 2. と 3. をCSVの行数分繰り返し実行すれば、データの学習は完了します。

**Analyze.java**

 1. Jubatus Serverへの接続設定

  Update.javaと同様のため省略。
  
 2. 推薦用データの準備

  推薦で必要なデータは先ほど学習でIDに指定した選手の"名前"になります。
  学習時と同じ要領で、カラムの1番目である"名前"を取得し、RecommenderClientのsimilar_row_from_idメソッドに与えることで、推薦が行われます。

 3. 学習モデルに基づく推薦

  2.で取得した選手の"名前"を、similar_row_from_idメソッドに渡すことで、推薦結果のListを得ることができます（41行目）。
  similar_row_from_idメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します（スタンドアロン構成の場合、空文字（""）を指定）。
  第2引数に、"名前"を指定します。
  第3引数は、似ているタイプを近傍順にいくつ出力するかを指定します。ここでは、トップ3まで出力するので"4"を指定します。なぜ、"4"かというとトップは自身が出力される為です。

 4. 結果の出力

  3.で取得した、推薦結果のリストはsimilar_row_from_idメソッドの第3引数に"4"を指定したので、4つの要素を持ったListです。
  Listの1番目は自分自身なので、Listの2番目から4番目までを結果として出力します。
  Update.javaと同様、選手1人ずつループで処理し 2. ～ 4. を繰り返します。

------------------------------------
サンプルプログラムの実行
------------------------------------

**［Jubatus Serverでの作業］**

jubarecommenderを起動します。

::

 $ jubarecommender --configpath npb_similar_player.json


**［Jubatus Clientでの作業］**

 必要なパッケージとJavaクライアントを用意し、実行します。
 
**［実行結果］**

::

 player 長野久義 is similar to : 糸井嘉男 ミレッジ 栗山巧
 player 大島洋平 is similar to : 本多雄一 石川雄洋 荒波翔
 player 鳥谷敬 is similar to : サブロー 糸井嘉男 和田一浩
 player 坂本勇人 is similar to : 角中勝也 稲葉篤紀 秋山翔吾
 player 中田翔 is similar to : 井口資仁 新井貴浩 中村紀洋
 …
 …（以下略）
