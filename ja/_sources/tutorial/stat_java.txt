Java
==================

ここではJava版のStatサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習の設定をするstat.jsonと統計分析を行うstat.javaを利用します。以下にソースコードを記載します。

**stat.json**

.. code-block:: python

 1 : {
 2 :   "window_size": 500
 3 : }
 

**stat.java**

.. code-block:: java

 01 : package stat;
 02 : 
 03 : import java.io.BufferedReader;
 04 : import java.io.File;
 05 : import java.io.FileNotFoundException;
 06 : import java.io.FileReader;
 07 : import java.io.IOException;
 08 : import java.util.ArrayList;
 09 : import java.util.HashMap;
 10 : 
 11 : import us.jubat.stat.*;
 12 : 
 13 : public class Stat {
 14 : 	public static final String HOST = "127.0.0.1";
 15 : 	public static final int PORT = 9199;
 16 : 	public static final String NAME = "stat_tri";
 17 : 	public static final String FILE_PATH = "./src/main/resources/";
 18 : 	public static final String CSV_NAME = "fruit.csv";
 19 : 
 20 : 	// CSVのカラム名定義
 21 : 	public static String[] CSV_COLUMN = { "fruit", "diameter", "weight", "price" };
 22 : 
 23 : 	@SuppressWarnings("serial")
 24 : 	public void execute() throws Exception {
 25 : 		// 1. Jubatus Serverへの接続設定
 26 : 		StatClient stat = new StatClient(HOST, PORT, 5);
 27 : 
 28 : 		HashMap<String, String> fruit = new HashMap<String, String>();
 29 : 
 30 : 		// 2. 学習用データの準備
 31 : 		try {
 32 : 			File csv = new File(FILE_PATH + CSV_NAME ); // CSVデータファイル
 33 : 
 34 : 			BufferedReader br = new BufferedReader(new FileReader(csv));
 35 : 			String line = "";
 36 : 
 37 : 			// 最終行まで、1行ずつループでまわして読み込む
 38 : 			while ((line = br.readLine()) != null) {
 39 : 				// 1行をデータの要素ごとに分割
 40 : 				String[] strAry = line.split(",");
 41 : 
 42 : 				for (int i=0; i<strAry.length; i++) {
 43 : 					fruit.put(CSV_COLUMN[i], strAry[i]);
 44 : 				}
 45 : 				// 3. データの学習（学習モデルの更新）
 46 : 				stat.push(NAME, fruit.get("fruit") + "dia" , Float.valueOf(fruit.get("diameter")));
 47 : 				stat.push(NAME, fruit.get("fruit") + "wei" , Float.valueOf(fruit.get("weight")));
 48 : 				stat.push(NAME, fruit.get("fruit") + "pri" , Float.valueOf(fruit.get("price")));
 49 : 			}
 50 : 			br.close();
 51 : 
 52 : 			stat.save(NAME, "stat.dat");
 53 : 			stat.load(NAME, "stat.dat");
 54 : 
 55 : 			// 4. 結果の出力
 56 : 			for (String fr : new ArrayList<String>(3) {{add("orange");add("apple");add("melon");}}) {
 57 : 				for ( String par : new ArrayList<String>(3) {{add("dia");add("wei");add("pri");}}) {
 58 : 					System.out.print("sum : " + fr +  par + " " + stat.sum(NAME, fr + par) + "\n");
 59 : 					System.out.print("sdv : " + fr +  par + " " + stat.stddev(NAME, fr + par) + "\n");
 60 : 					System.out.print("max : " + fr +  par + " " + stat.max(NAME, fr + par) + "\n");
 61 : 					System.out.print("min : " + fr +  par + " " + stat.min(NAME, fr + par) + "\n");
 62 : 					System.out.print("ent : " + fr +  par + " " + stat.entropy(NAME, fr + par) + "\n");
 63 : 					System.out.print("mmt : " + fr +  par + " " + stat.moment(NAME, fr + par, 1, 0.0) + "\n");
 64 : 				}
 65 : 			}
 66 : 		} catch (FileNotFoundException e) {
 67 : 			 // Fileオブジェクト生成時の例外捕捉
 68 : 			 e.printStackTrace();
 69 : 		} catch (IOException e) {
 70 : 			 // BufferedReaderオブジェクトのクローズ時の例外捕捉
 71 : 			 e.printStackTrace();
 72 : 		}
 73 : 
 74 : 		return;
 75 : 	}
 76 : 
 77 : 	// メインメソッド
 78 : 	public static void main(String[] args) throws Exception {
 79 : 
 80 : 		new Stat().execute();
 81 : 		System.exit(0);
 82 : 	}
 83 : }


--------------------------------
解説
--------------------------------

**train_route.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下のとおりです。

 * window_size
 
  保持する値の数を指定する。 (Integer)
  

**stat.java**

 stat.javaでは、csvから読み込んだフルーツの直径・重さ・値段の情報をJubatusサーバ与え、それぞれのフルーツごとに統計結果を出力します。使用するメソッドは以下になります。
 
 * bool push(0: string name, 1: string key, 2: double val)

  属性情報 key の値 val を与える。

 * double sum(0: string name, 1: string key)

  属性情報 key を持つ値の合計値を返す。

 * double stddev(0: string name, 1: string key)

  属性情報 key を持つ値の標準偏差を返す。

 * double max(0: string name, 1: string key)

  属性情報 key を持つ値の最大値を返す。

 * double min(0: string name, 1: string key)

  属性情報 key を持つ値の最小値を返す。

 * double entropy(0: string name, 1: string key)

  属性情報 key を持つ値のエントロピーを返す。

 * double moment(0: string name, 1: string key, 2: int degree, 3: double center)

  属性情報 key を持つ値の center を中心とした degree 次のモーメントを返す。



 各メソッドの最初のパラメタnameは、タスクを識別するZooKeeperクラスタ内でユニークな名前である。 スタンドアロン構成では、空文字列 ("") を指定する。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（26行目）。
  Jubatus ServerのIPアドレス、Jubatus ServerのRPCポート番号、接続待機時間を設定します。
  
 2. 学習用データの準備

  StatClientでは、項目名と値をpushメソッドに与えることで、学習が行われます。
  今回はサンプル用に作成した"フルーツの種類"・"直径"・"重さ"・"価格"の情報を持つCSVファイルを元に学習用データを作成していきます。
  まず、学習用データの元となるCSVファイルを読み込みます。 ここでは、FileReaderとBuffererdReaderを利用して1行ずつループで読み込んで処理します（32-49行目）。 CSVファイルなので、取得した1行を’,’で分割し要素ごとに分けます（40行目）。 定義したCSVファイルの項目リスト（CSV_COLUMN）を用い、項目名と値をmapに詰めていきます（42-44行目）。
  
 3. データの学習（学習モデルの更新）

  StatClientのpushメソッドに2.で作成したデータに項目名を付けて渡します（46-48行目）。ここでの項目名は"直径"の場合、フルーツの種類＋"dia"という形にして、"重さ"・"価格"についても同じようにpushメソッドを呼び出します。
  
 4. 結果の出力

  StatClientの各統計分析メソッドを使用し、結果を出力します。
  まず、フルーツの種類ごとにループをまわして（56行目）、さらに残りの項目ごとにループでまわして出力していきます（57行目）。
  そのループ処理の中で、各統計分析メソッドを呼び出します（58-63行目）。各メソッドの内容は上記のメソッド一覧を参照してください。
  

-------------------------------------
サンプルプログラムの実行
-------------------------------------

**［Jubatus Serverでの作業］**

 jubastatを起動します。
 
 ::
 
  $ jubastat --configpath stat.json
 

**［Jubatus Clientでの作業］**

 必要なパッケージとJavaクライアントを用意し、実行します。
 
**［実行結果］**

::

 sum : orangedia 1503.399996995926
 sdv : orangedia 10.868084068651045
 max : orangedia 54.29999923706055
 min : orangedia -2.0999999046325684
 ent : orangedia 0.0
 mmt : orangedia 28.911538403767807
 sum : orangewei 10394.399948120117
 sdv : orangewei 54.92258724344468
 max : orangewei 321.6000061035156
 min : orangewei 39.5
 ent : orangewei 0.0
 mmt : orangewei 196.1207537381154
 sum : orangepri 1636.0
 sdv : orangepri 7.936154992801973
 max : orangepri 50.0
 min : orangepri 6.0
 ent : orangepri 0.0
 mmt : orangepri 30.867924528301888
 sum : appledia 2902.0000019073486
 sdv : appledia 15.412238321876663
 …
 …（以下略）
