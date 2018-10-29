Anomaly チュートリアル (Java)
============================================

ここではJava版のAnomalyサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習の設定をするconfig.jsonと外れ値検知を行うlof.javaを利用します。以下にソースコードを記載します。

**config.json**

.. code-block:: python
 :linenos:

 {
  "method" : "lof",
  "parameter" : {
   "nearest_neighbor_num" : 10,
   "reverse_nearest_neighbor_num" : 30,
   "method" : "euclid_lsh",
   "parameter" : {
    "hash_num" : 8,
    "table_num" : 16,
    "probe_num" : 64,
    "bin_width" : 10,
    "seed" : 1234
   }
  },
 
  "converter" : {
   "string_filter_types": {},
   "string_filter_rules": [],
   "num_filter_types": {},
   "num_filter_rules": [],
   "string_types": {},
   "string_rules": [{"key":"*", "type":"str", "global_weight" : "bin", "sample_weight" : "bin"}],
   "num_types": {},
   "num_rules": [{"key" : "*", "type" : "num"}]
  }
 }


**anomaly.java**


.. code-block:: java
 :linenos:

   package us.jubat.example.kddcup;

   import us.jubat.anomaly.AnomalyClient;
   import us.jubat.anomaly.IdWithScore;
   import us.jubat.common.Datum;

   import java.io.*;
   import java.util.ArrayList;
   import java.util.Arrays;
   import java.util.List;

   public class Lof {
       public static final String HOST = "127.0.0.1";
       public static final int PORT = 9199;
       public static final String NAME = "anom_kddcup";
       public static final String FILE_PATH = "../";
       public static final String TEXT_NAME = "kddcup.data_10_percent.txt";

       // Define TEXT column names
       public static String[] TEXT_COLUMN = {
               "duration",
               "protocol_type",
               "service",
               "flag",
               "src_bytes",
               "dst_bytes",
               "land",
               "wrong_fragment",
               "urgent",
               "hot",
               "num_failed_logins",
               "logged_in",
               "num_compromised",
               "root_shell",
               "su_attempted",
               "num_root",
               "num_file_creations",
               "num_shells",
               "num_access_files",
               "num_outbound_cmds",
               "is_host_login",
               "is_guest_login",
               "count",
               "srv_count",
               "serror_rate",
               "srv_serror_rate",
               "rerror_rate",
               "srv_rerror_rate",
               "same_srv_rate",
               "diff_srv_rate",
               "srv_diff_host_rate",
               "dst_host_count",
               "dst_host_srv_count",
               "dst_host_same_srv_rate",
               "dst_host_diff_srv_rate",
               "dst_host_same_src_port_rate",
               "dst_host_srv_diff_host_rate",
               "dst_host_serror_rate",
               "dst_host_srv_serror_rate",
               "dst_host_rerror_rate",
               "dst_host_srv_rerror_rate",
               "label"
       };

       // Define STRING column names
       public static String[] STRING_COLUMN = {
               "protocol_type",
               "service",
               "flag",
               "land",
               "logged_in",
               "is_host_login",
               "is_guest_login"
       };

       // Define DOUBLE column names
       public static String[] DOUBLE_COLUMN = {
               "duration",
               "src_bytes",
               "dst_bytes",
               "wrong_fragment",
               "urgent",
               "hot",
               "num_failed_logins",
               "num_compromised",
               "root_shell",
               "su_attempted",
               "num_root",
               "num_file_creations",
               "num_shells",
               "num_access_files",
               "num_outbound_cmds",
               "count",
               "srv_count",
               "serror_rate",
               "srv_serror_rate",
               "rerror_rate",
               "srv_rerror_rate",
               "same_srv_rate",
               "diff_srv_rate",
               "srv_diff_host_rate",
               "dst_host_count",
               "dst_host_srv_count",
               "dst_host_same_srv_rate",
               "dst_host_same_src_port_rate",
               "dst_host_diff_srv_rate",
               "dst_host_srv_diff_host_rate",
               "dst_host_serror_rate",
               "dst_host_srv_serror_rate",
               "dst_host_rerror_rate",
               "dst_host_srv_rerror_rate"
       };

       public void execute() throws Exception {
           // 1. Connect to Jubatus Server
           AnomalyClient client = new AnomalyClient(HOST, PORT , NAME, 5);

           // 2. Prepare training dataset
           Datum datum = null;
           IdWithScore result = null;

           try {
               BufferedReader br = new BufferedReader(new FileReader(new File(FILE_PATH , TEXT_NAME)));

               List<String> strList = new ArrayList<String>();
               List<String> doubleList = new ArrayList<String>();

               String line = "";

               while ((line = br.readLine()) != null) {
                   strList.clear();
                   doubleList.clear();

                   String[] strAry = line.split(",");

                   // make STRING list and DOUBLE list
                   for (int i = 0; i < strAry.length; i++) {
                       if (Arrays.toString(STRING_COLUMN).contains(TEXT_COLUMN[i])) {
                           strList.add(strAry[i]);
                       } else if (Arrays.toString(DOUBLE_COLUMN).contains(TEXT_COLUMN[i])) {
                           doubleList.add(strAry[i]);
                       }
                   }
                   // make Datum
                   datum = makeDatum(strList, doubleList);

                   // 3. Update the training model
                   result = client.add(datum);

                   // 4. Output results
                   if (!(Double.isInfinite(result.score)) && result.score != 1.0) {
                       System.out.print("('" + result.id + "', " + result.score + ") " + strAry[strAry.length - 1] + "\n");
                   }
               }
               br.close();

           } catch (FileNotFoundException e) {
               e.printStackTrace();
           } catch (IOException e) {
               e.printStackTrace();
           }
           return;
       }

       private Datum makeDatum(List<String> strList, List<String> doubleList) {

           Datum datum = new Datum();

           for (int i = 0; i < strList.size(); i++) {
               datum.addString(STRING_COLUMN[i],strList.get(i));
           }

           try {
               for (int i = 0; i < doubleList.size(); i++) {
                   datum.addNumber(DOUBLE_COLUMN[i],Double.parseDouble(doubleList.get(i)));
               }
           } catch (NumberFormatException e) {
               e.printStackTrace();
               return null;
           }

           return datum;
       }

       public static void main(String[] args) throws Exception {

           new Lof().execute();
           System.exit(0);
       }
   }


--------------------------------
解説
--------------------------------

**config.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下のとおりです。

* method

 異常検知に使用するアルコリズムを指定します。
 Anomalyで指定できるのは、Recommenderベースの"lof"およびNearest Neighborベースの"light lof"です。
 今回は"lof"（Local Outlier Factor）を指定します。


* parameter

　methodで設定した異常検知アルゴリズムのパラメータを設定します。 
 今回は"lof"を利用するため、`Recommender API <http://jubat.us/ja/api/api_recommender.html>`_ に従ってパラメータを設定します。
 

* converter

 特徴変換の設定を指定します。
 ここでは、"num_rules"と"string_rules"を設定しています。
 
 "num_rules"は数値特徴の抽出規則を指定します。
 "key"は"*"つまり、すべての"key"に対して、"type"は"num"なので、指定された数値をそのまま重みに利用する設定です。
 具体的には、valueが"2"であれば"2"を、"6"であれば"6"を重みとします。
 
 "string_rules"は文字列特徴の抽出規則を指定します。
 "key"は"*"、"type"は"str"、"sample_weight"は"bin"、"global_weight"は"bin"としています。
 これは、すべての文字列に対して、指定された文字列をそのまま特徴として利用し、各key-value毎の重みと今までの通算データから算出される、大域的な重みを常に"1"とする設定です。


**anomaly.java**

 anomaly.javaでは、textから読み込んだデータをJubatusサーバ与え、外れ値を検出し出力します。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（116行目）。
  Jubatus ServerのIPアドレス、Jubatus ServerのRPCポート番号、接続待機時間を設定します。
  
 2. 学習用データの準備

  AnomalyClientでは、Datumをaddメソッドに与えることで、学習および外れ値検知が行われます。
  今回はKDDカップ（Knowledge Discovery and Data Mining Cup）の結果（TEXTファイル）を元に学習用データを作成していきます。
  まず、学習用データの元となるTEXTファイルを読み込みます。
  ここでは、FileReaderとBuffererdReaderを利用して1行ずつループで読み込んで処理します（130-155行目）。
  このTEXTファイルはカンマ区切りで項目が並んでいるので、取得した1行を’,’で分割し要素ごとに分けます（134行目）。
  定義したTEXTファイルの項目リスト（TEXT_COLUMN）とStringとDoubleの項目を定義したリスト（STRING_COLUMN、DOUBLE_COLUMN）を用い、型ごとにリストを作成します（137-143行目）。
  作成した２つのリストを引数としてDatumを作成するprivateメソッド「makeDatum」を呼び出します（145行目）。
   
  「makeDatum」では、String項目リストとDouble項目リストにデータを登録してdatumを作成します( 165-183行目)。定義しているString項目リスト（STRING_COLUMN）と引数のstrListの順番は対応しているので、addString(...)メソッドを使い、添字を揃えてdatumにStringを追加します。
  Double項目リストもString項目と同様にaddNumber(...)メソッドを使い、添字を揃えてdatumにNumberを追加します。ここで明示的にDoubleに変換する必要があることに注意してください（175行目）。
  これで、Datumの作成が完了しました。

  
 3. データの学習（学習モデルの更新）

  AnomalyClientのaddメソッドに2. で作成したデータを渡します（147行目）
  戻り値として、tuple<string, double>型で点IDと異常値を返却します。
  
 4. 結果の出力

  addメソッドの戻り値である異常値から外れ値かどうかを判定します（151行目）。
  異常値が無限ではなく、1.0以外の場合は外れ値と判断し出力します（152行目）。

-------------------------------------
サンプルプログラムの実行
-------------------------------------

**[データのダウンロード]**

 :: 
 
  $ wget http://kdd.ics.uci.edu/databases/kddcup99/kddcup.data_10_percent.gz
  $ gunzip kddcup.data_10_percent.gz
  $ mv kddcup.data_10_percent kddcup.data_10_percent.txt


**［Jubatus Serverでの作業］**

 jubaanomalyを起動します。
 
 ::
 
  $ jubaanomaly --configpath config.json
 

**［Jubatus Clientでの作業］**

 必要なパッケージとJavaクライアントを用意し、実行します。
 詳しくは `Jubatus Example <https://github.com/jubatus/jubatus-example/tree/master/network_intrusion_detection>`_ をご覧ください。
 

**［実行結果］**

  ::

   ('194', 1.0000441074371338) normal.
   ('494', 1.4595649242401123) normal.
   ('1127', 1.0642377138137817) normal.
   ('1148', 1.0404019355773926) normal.
   ('1709', 1.2717968225479126) normal.
   ('2291', 1.388629674911499) normal.
   ('2357', 1.0560613870620728) normal.
   ('2382', 0.9994010925292969) normal.
   ('2499', 0.7581642270088196) normal.


   …（以下略）
