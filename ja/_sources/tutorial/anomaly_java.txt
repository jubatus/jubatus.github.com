Java
==================

ここではJava版のAnomalyサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習の設定をするconfig.jsonと外れ値検知を行うlof.javaを利用します。以下にソースコードを記載します。

**config.json**

.. code-block:: python

 01 : {
 02 :  "method" : "lof",
 03 :  "parameter" : {
 04 :   "nearest_neighbor_num" : 10,
 05 :   "reverse_nearest_neighbor_num" : 30,
 06 :   "method" : "euclid_lsh",
 07 :   "parameter" : {
 08 :    "lsh_num" : 8,
 09 :    "table_num" : 16,
 10 :    "probe_num" : 64,
 11 :    "bin_width" : 10,
 12 :    "seed" : 1234,
 13 :    "retain_projection" : true
 14 :   }
 15 :  },
 16 : 
 17 :  "converter" : {
 18 :   "string_filter_types": {},
 19 :   "string_filter_rules": [],
 20 :   "num_filter_types": {},
 21 :   "num_filter_rules": [],
 22 :   "string_types": {},
 23 :   "string_rules": [{"key":"*", "type":"str", "global_weight" : "bin", "sample_weight" : "bin"}],
 24 :   "num_types": {},
 25 :   "num_rules": [{"key" : "*", "type" : "num"}]
 26 :  }
 27 : }

 

**anomaly.java**

.. code-block:: java

 001 : package lof;
 002 : 
 003 : import java.io.BufferedReader;
 004 : import java.io.FileNotFoundException;
 005 : import java.io.FileReader;
 006 : import java.io.IOException;
 007 : import java.util.ArrayList;
 008 : import java.util.Arrays;
 009 : import java.util.List;
 010 : 
 011 : import us.jubat.anomaly.*;
 012 : 
 013 : public class Lof {
 014 : 	public static final String HOST = "127.0.0.1";
 015 : 	public static final int PORT = 9199;
 016 : 	public static final String NAME = "anom_kddcup";
 017 : 	public static final String FILE_PATH = "./src/main/resources/";
 018 : 	public static final String TEXT_NAME = "kddcup.data_10_percent.txt";
 019 : 
 020 : 	// TEXTのカラム名定義
 021 : 	public static String[] TEXT_COLUMN = {
 022 : 		"duration",
 023 : 		"protocol_type",
 024 : 		"service",
 025 : 		"flag",
 026 : 		"src_bytes",
 027 : 		"dst_bytes",
 028 : 		"land",
 029 : 		"wrong_fragment",
 030 : 		"urgent",
 031 : 		"hot",
 032 : 		"num_failed_logins",
 033 : 		"logged_in",
 034 : 		"num_compromised",
 035 : 		"root_shell",
 036 : 		"su_attempted",
 037 : 		"num_root",
 038 : 		"num_file_creations",
 039 : 		"num_shells",
 040 : 		"num_access_files",
 041 : 		"num_outbound_cmds",
 042 : 		"is_host_login",
 043 : 		"is_guest_login",
 044 : 		"count",
 045 : 		"srv_count",
 046 : 		"serror_rate",
 047 : 		"srv_serror_rate",
 048 : 		"rerror_rate",
 049 : 		"srv_rerror_rate",
 050 : 		"same_srv_rate",
 051 : 		"diff_srv_rate",
 052 : 		"srv_diff_host_rate",
 053 : 		"dst_host_count",
 054 : 		"dst_host_srv_count",
 055 : 		"dst_host_same_srv_rate",
 056 : 		"dst_host_diff_srv_rate",
 057 : 		"dst_host_same_src_port_rate",
 058 : 		"dst_host_srv_diff_host_rate",
 059 : 		"dst_host_serror_rate",
 060 : 		"dst_host_srv_serror_rate",
 061 : 		"dst_host_rerror_rate",
 062 : 		"dst_host_srv_rerror_rate",
 063 : 		"label"
 064 : 	};
 065 : 
 066 : 	// String型の項目
 067 : 	public static String[] STRING_COLUMN = {
 068 : 		"protocol_type",
 069 : 		"service",
 070 : 		"flag",
 071 : 		"land",
 072 : 		"logged_in",
 073 : 		"is_host_login",
 074 : 		"is_guest_login"
 075 : 	};
 076 : 
 077 : 	// Double型の項目
 078 : 	public static String[] DOUBLE_COLUMN = {
 079 : 		"duration",
 080 : 		"src_bytes",
 081 : 		"dst_bytes",
 082 : 		"wrong_fragment",
 083 : 		"urgent",
 084 : 		"hot",
 085 : 		"num_failed_logins",
 086 : 		"num_compromised",
 087 : 		"root_shell",
 088 : 		"su_attempted",
 089 : 		"num_root",
 090 : 		"num_file_creations",
 091 : 		"num_shells",
 092 : 		"num_access_files",
 093 : 		"num_outbound_cmds",
 094 : 		"count",
 095 : 		"srv_count",
 096 : 		"serror_rate",
 097 : 		"srv_serror_rate",
 098 : 		"rerror_rate",
 099 : 		"srv_rerror_rate",
 100 : 		"same_srv_rate",
 101 : 		"diff_srv_rate",
 102 : 		"srv_diff_host_rate",
 103 : 		"dst_host_count",
 104 : 		"dst_host_srv_count",
 105 : 		"dst_host_same_srv_rate",
 106 : 		"dst_host_same_src_port_rate",
 107 : 		"dst_host_diff_srv_rate",
 108 : 		"dst_host_srv_diff_host_rate",
 109 : 		"dst_host_serror_rate",
 110 : 		"dst_host_srv_serror_rate",
 111 : 		"dst_host_rerror_rate",
 112 : 		"dst_host_srv_rerror_rate"
 113 : 	};
 114 : 
 115 : 	public void execute() throws Exception {
 116 : 		// 1. Jubatus Serverへの接続設定
 117 : 		AnomalyClient client = new AnomalyClient(HOST, PORT, 5);
 118 : 
 119 : 		// 2. 学習用データの準備
 120 : 		Datum datum = null;
 121 : 		TupleStringFloat result = null;
 122 : 
 123 : 		try {
 124 : 			BufferedReader br = new BufferedReader(new FileReader(FILE_PATH + TEXT_NAME));
 125 : 
 126 : 			List<String> strList = new ArrayList<String>();
 127 : 			List<String> doubleList = new ArrayList<String>();
 128 : 
 129 : 			String line = "";
 130 : 
 131 : 			// 最終行までループでまわし、1行ずつ読み込む
 132 : 			while ((line = br.readLine()) != null) {
 133 : 				strList.clear();
 134 : 				doubleList.clear();
 135 : 
 136 : 				// 1行をデータの要素に分割
 137 : 				String[] strAry = line.split(",");
 138 : 
 139 : 				// StringとDoubleの項目ごとにListを作成
 140 : 				for (int i = 0; i < strAry.length; i++) {
 141 : 					if (Arrays.toString(STRING_COLUMN).contains(TEXT_COLUMN[i])) {
 142 : 						strList.add(strAry[i]);
 143 : 					} else if (Arrays.toString(DOUBLE_COLUMN).contains(TEXT_COLUMN[i])) {
 144 : 						doubleList.add(strAry[i]);
 145 : 					}
 146 : 				}
 147 : 				// datumを作成
 148 : 				datum = makeDatum(strList, doubleList);
 149 : 
 150 : 				// 3. データの学習（学習モデルの更新）
 151 : 				result = client.add(NAME, datum);
 152 : 
 153 : 				// 4. 結果の出力
 154 : 				if ( !(Float.isInfinite(result.second)) && result.second != 1.0) {
 155 : 					System.out.print( "('" + result.first + "', " + result.second + ") " + strAry[strAry.length -1] + "\n" );
 156 : 				}
 157 : 			}
 158 : 			br.close();
 159 : 
 160 : 		} catch (FileNotFoundException e) {
 161 : 			// Fileオブジェクト生成時の例外捕捉
 162 : 			e.printStackTrace();
 163 : 		} catch (IOException e) {
 164 : 			// BufferedReaderオブジェクトのクローズ時の例外捕捉
 165 : 			e.printStackTrace();
 166 : 		}
 167 : 		return;
 168 : 	}
 169 : 
 170 : 
 171 : 	// Datumを指定された名称で、リスト分作成
 172 : 	private Datum makeDatum(List<String> strList, List<String> doubleList) {
 173 : 
 174 : 		Datum datum = new Datum();
 175 : 		datum.string_values = new ArrayList<TupleStringString>();
 176 : 		datum.num_values = new ArrayList<TupleStringDouble>();
 177 : 
 178 : 		for (int i = 0; i < strList.size(); i++) {
 179 : 			TupleStringString data = new TupleStringString();
 180 : 			data.first = STRING_COLUMN[i];
 181 : 			data.second = strList.get(i);
 182 : 
 183 : 			datum.string_values.add(data);
 184 : 		}
 185 : 
 186 : 		try {
 187 : 			for (int i = 0; i < doubleList.size(); i++) {
 188 : 				TupleStringDouble data = new TupleStringDouble();
 189 : 				data.first = DOUBLE_COLUMN[i];
 190 : 				data.second = Double.parseDouble(doubleList.get(i));
 191 : 
 192 : 				datum.num_values.add(data);
 193 : 			}
 194 : 		} catch (NumberFormatException e) {
 195 : 			e.printStackTrace();
 196 : 			return null;
 197 : 		}
 198 : 
 199 : 		return datum;
 200 : 	}
 201 : 
 202 : 	// メインメソッド
 203 : 	public static void main(String[] args) throws Exception {
 204 : 
 205 : 		new Lof().execute();
 206 : 		System.exit(0);
 207 : 	}
 208 : }

--------------------------------
解説
--------------------------------

**config.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下のとおりです。

* method

 分類に使用するアルコリズムを指定します。
 Regressionで指定できるのは、現在"LOF"のみなので"LOF"（Local Outlier Factor）を指定します。


* converter

 特徴変換の設定を指定します。
 ここでは、"num_rules"と"string_rules"を設定しています。
 
 "num_rules"は数値特徴の抽出規則を指定します。
 "key"は"*"つまり、すべての"key"に対して、"type"は"num"なので、指定された数値をそのまま重みに利用する設定です。
 具体的には、valueが"2"であれば"2"を、"6"であれば"6"を重みとします。
 
 "string_rules"は文字列特徴の抽出規則を指定します。
 "key"は"*"、"type"は"str"、"sample_weight"は"bin"、"global_weight"は"bin"としています。
 これは、すべての文字列に対して、指定された文字列をそのまま特徴として利用し、各key-value毎の重みと今までの通算データから算出される、大域的な重みを常に"1"とする設定です。

* parameter（要修正）

 ･･･

  

**anomaly.java**

 anomaly.javaでは、textから読み込んだデータをJubatusサーバ与え、外れ値を検出し出力します。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（117行目）。
  Jubatus ServerのIPアドレス、Jubatus ServerのRPCポート番号、接続待機時間を設定します。
  
 2. 学習用データの準備

  AnomalyClientでは、Datumをaddメソッドに与えることで、学習および外れ値検知が行われます。
  今回はKDDカップ（Knowledge Discovery and Data Mining Cup）の結果（TEXTファイル）を元に学習用データを作成していきます。
  まず、学習用データの元となるTEXTファイルを読み込みます。
  ここでは、FileReaderとBuffererdReaderを利用して1行ずつループで読み込んで処理します（132-157行目）。
  このTEXTファイルはカンマ区切りで項目が並んでいるので、取得した1行を’,’で分割し要素ごとに分けます（137行目）。
  定義したTEXTファイルの項目リスト（TEXT_COLUMN）とStringとDoubleの項目を定義したリスト（STRING_COLUMN、DOUBLE_COLUMN）を用い、型ごとにリストを作成します（140-145行目）。
  作成した２つのリストを引数としてDatumを作成するprivateメソッド「makeDatum」を呼び出します（91行目）。
   
  「makeDatum」では、引数のString項目のリストとDouble項目のリストから、String項目はTupleStringStringのListを、Double項目はTupleStringDoubleのListを作成します（172-200行目）。
  まず、Datumクラスを生成してDatumの要素であるstring_valuesとnum_valuesのListをそれぞれ生成します（174-176行目）。
  次に、定義しているString項目リスト（STRING_COLUMN）と引数のstrListの順番は対応しているので、ループでTupleStringStringを生成し、要素firstにキー（カラム名）をsecondにバリュー（値）を設定してstring_valuesのListに追加します（178-184行目）。
  Double項目リストもString項目と同様にループでTupleStringDoubleを生成し、要素を設定してからnum_valuesに追加します。ここで注意する点は、引数はString型のListですがDatumのnum_valuesはDouble型の為、変換が必要になります（190行目）。
  これで、Datumの作成が完了しました。

  
 3. データの学習（学習モデルの更新）

  AnomalyClientのaddメソッドに2. で作成したデータを渡します（151行目）。
  addメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。（スタンドアロン構成の場合、空文字（""）を指定）
  第2引数として、先ほど2. で作成したDatumを指定します。
  戻り値として、tuple<string, float>型で点IDと異常値を返却します。
  
 4. 結果の出力

  addメソッドの戻り値である異常値から外れ値かどうかを判定します（154行目）。
  異常値が無限ではなく、1.0以外の場合は外れ値と判断し出力します（155行目）。

-------------------------------------
サンプルプログラムの実行
-------------------------------------

**［Jubatus Serverでの作業］**

 jubaanomalyを起動します。
 
 ::
 
  $ jubaanomaly --configpath config.json
 

**［Jubatus Clientでの作業］**

 必要なパッケージとJavaクライアントを用意し、実行します。
 
**［実行結果］**

::

 ('574', 0.99721104) normal.
 ('697', 1.4958459) normal.
 ('1127', 0.79527026) normal.
 ('1148', 1.1487594) normal.
 ('1149', 1.2) normal.
 ('2382', 0.9994011) normal.
 ('2553', 1.2638165) normal.
 ('2985', 1.4081864) normal.
 ('3547', 1.275244) normal.
 ('3557', 0.90432936) normal.
 ('3572', 0.75777346) normal.
 ('3806', 0.9943142) normal.
 ('3816', 1.0017062) normal.
 ('3906', 0.5671135) normal.
 …
 …（以下略）
