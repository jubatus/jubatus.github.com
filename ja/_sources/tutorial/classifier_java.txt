Java
==========================

ここではJava版のClassifierサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするshogun.jsonとデータの学習及び学習データに基づく予測を行うShogun.javaを利用します。
以下にshogun.jsonとShogun.javaのソースコードを記載します。

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

**Shogun.java**

.. code-block:: java
 :linenos:

 package us.jubat.example.shogun;

 import java.io.OutputStreamWriter;
 import java.util.ArrayList;
 import java.util.Arrays;
 import java.util.Collections;
 import java.util.List;
 import java.util.Random;

 import us.jubat.classifier.ClassifierClient;
 import us.jubat.classifier.EstimateResult;
 import us.jubat.classifier.LabeledDatum;
 import us.jubat.common.Datum;

 public class Shogun {
     private final ClassifierClient client;
     private final Random random;

     public Shogun(ClassifierClient client) {
         this.client = client;
         this.random = new Random(0);
     }

     /**
      * Helper function for making Datum object.
      * 
      * @param name
      * @return
      */
     private static Datum makeDatum(String name) {
         return new Datum().addString("name", name);
     }

     private static LabeledDatum makeTrain(String tag, String name) {
         return new LabeledDatum(tag, makeDatum(name));
     }

     private void train() {
         LabeledDatum[] trainData = {
                 makeTrain("徳川", "家康"),
                 makeTrain("徳川", "秀忠"),
                 makeTrain("徳川", "家光"),
                 makeTrain("徳川", "家綱"),
                 makeTrain("徳川", "綱吉"),
                 makeTrain("徳川", "家宣"),
                 makeTrain("徳川", "家継"),
                 makeTrain("徳川", "吉宗"),
                 makeTrain("徳川", "家重"),
                 makeTrain("徳川", "家治"),
                 makeTrain("徳川", "家斉"),
                 makeTrain("徳川", "家慶"),
                 makeTrain("徳川", "家定"),
                 makeTrain("徳川", "家茂"),
                 // makeTrain("徳川", "慶喜"),

                 makeTrain("足利", "尊氏"), makeTrain("足利", "義詮"),
                 makeTrain("足利", "義満"),
                 makeTrain("足利", "義持"),
                 makeTrain("足利", "義量"),
                 makeTrain("足利", "義教"),
                 makeTrain("足利", "義勝"),
                 makeTrain("足利", "義政"),
                 makeTrain("足利", "義尚"),
                 makeTrain("足利", "義稙"),
                 makeTrain("足利", "義澄"),
                 makeTrain("足利", "義稙"),
                 makeTrain("足利", "義晴"),
                 makeTrain("足利", "義輝"),
                 makeTrain("足利", "義栄"),
                 // makeTrain("足利", "義昭"),

                 makeTrain("北条", "時政"), makeTrain("北条", "義時"),
                 makeTrain("北条", "泰時"), makeTrain("北条", "経時"),
                 makeTrain("北条", "時頼"), makeTrain("北条", "長時"),
                 makeTrain("北条", "政村"), makeTrain("北条", "時宗"),
                 makeTrain("北条", "貞時"), makeTrain("北条", "師時"),
                 makeTrain("北条", "宗宣"), makeTrain("北条", "煕時"),
                 makeTrain("北条", "基時"), makeTrain("北条", "高時"),
                 makeTrain("北条", "貞顕"),
                // makeTrain("北条", "守時"),
         };
         // prepare training data
         // predict the last ones (that are commented out)
         List<LabeledDatum> t = new ArrayList<LabeledDatum>(
                 Arrays.asList(trainData));
         Collections.shuffle(t, random);

         // run train
         client.train(t);
     }

     private static EstimateResult findBestResult(List<EstimateResult> res) {
         EstimateResult best = null;
         for (EstimateResult r : res) {
             if (best == null || best.score < r.score) {
                 best = r;
             }
         }
         return best;
     }

     private void predict() {
         // predict the last shogun
         Datum[] data = { makeDatum("慶喜"), makeDatum("義昭"), makeDatum("守時"), };
         for (Datum datum : data) {
             List<List<EstimateResult>> res = client.classify(
                     Arrays.asList(datum));
             // get the predicted shogun name
             System.out.println(findBestResult(res.get(0)).label
                     + datum.stringValues.get(0).value);
         }
     }

     public static void main(String[] args) {
         try {
             ClassifierClient client = new ClassifierClient("127.0.0.1", 9199, "test", 1);
             Shogun s = new Shogun(client);
             s.train();
             s.predict();
         } catch (Exception e) {
             e.printStackTrace();
         }
         System.exit(0);
     }
 }


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
    regularization_weightパラメータは大きくすると学習が早くなりますが、代わりにノイズに弱くなります。

**Shogun.java**

学習と予測の手順を説明します。

Classifierのクライアントプログラムは、us.jubat.classifierパッケージ内で定義されているClassifierClientクラスを利用して作成します。
使用するメソッドは、学習を行うtrainメソッドと、与えられたデータから予測を行うclassifyメソッドの2つです。

1. Jubatus Serverへの接続設定
    Jubatus Serverへの接続を行います（116行目）。

    Jubatus ServerのIPアドレス、Jubatus ServerのRPCポート番号、タスクを識別するZookeeperクラスタ内でユニークな名前、リクエストタイムアウト時間を設定します。

2. 学習用データの準備
    Jubatus Serverに学習させるデータを作成します（39-81行目）。

    ClassifierClientでは、LabeledDatumの配列を作成し、ClassifierClientのtrainメソッドに与えることで、学習が行われます。
    下図に、今回作成する学習データの構造を示します。

    +----------------------------------------------------------------------------------------------------+
    |LabeledDatum[]                                                                                      |
    +-------------+--------------------------------------------------------------------------------------+
    |label(String)|Datum                                                                                 |
    +-------------+----------------------------+----------------------------+----------------------------+
    |             |List<StringValue>           |List<NumValue>              |List<BinaryValue>           |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |             |key(String)|value(String)   |key(String) |value(double)  |key(String) |value(byte[])  |
    +=============+===========+================+============+===============+============+===============+
    |"徳川"       |"name"     |"家康"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"徳川"       |"name"     |"秀忠"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"徳川"       |"name"     |"家光"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"徳川"       |"name"     |"家綱"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"足利"       |"name"     |"尊氏"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"足利"       |"name"     |"義詮"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"北条"       |"name"     |"時政"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+
    |"北条"       |"name"     |"義時"          |            |               |            |               |
    +-------------+-----------+----------------+------------+---------------+------------+---------------+

    LabeledDatumはDatumとそのlabelの組みです。
    サンプルでは、labelに将軍の姓を格納しています。

    Datumとは、Jubatusで利用できるkey-valueデータ形式のことです。
    特徴ベクトルに置き換えると、keyが特徴、valueが特徴量に相当します。
    Datumには3つのkey-valueが存在します。
    1つはキーも値も文字列の文字列データ（stringValues）です。
    もう1つはキーが同様に文字列で、値は数値の数値データ(numValues)です。
    最後は、キーは同様に文字列で、値はバイト配列のバイナリデータ(binaryValues)です。
    それぞれ、StringValueクラス、NumValueクラス、BinaryValueクラスのリストで表します。

    今回は、将軍の名から姓を当てるプログラムなので、stringValuesのkeyに文字列"name"、valueに歴代将軍の名を格納します。
    今回のサンプルには含まれませんが、仮に"徳川"というグループに「徳川家の身長(height)は170cm以上である」という特徴を追加したい場合は、numValuesのkeyに文字列"height"、valueに170.0を格納します。

    このサンプルでの学習データ作成の手順は下記の流れで行います。

    学習を行うprivateメソッド「train」（38-90行目）で、LabeledDatumの配列を宣言します。
    それぞれの要素には、将軍の姓をlabelに、「addString」メソッドで名をstringValuesに追加したDatumから構成されるLabeledDatumを設定します（39-81行目）。

    以上のようにして作成したLabeledDatumの配列をシャッフルします（86行目）。
    これで、学習用データの作成が完了します。

3. データの学習（学習モデルの更新）
    2の工程で作成した学習データを、trainメソッドに渡すことで学習が行われます（89行目）。

4. 予測用データの準備
    予測も学習時と同様に、入力データからDatumを作成します。

    Datumの配列をClassifierClientのclassifyメソッドに与えることで、予測が行われます。
    予測を行うprivateメソッド「predict」で、Datumの配列を宣言します。
    「nameが"慶喜"」の将軍の姓は何かを予測させるため、学習時と同様にDatumを作成し、作成したDatumを配列に追加します（104行目）。

5. 学習データに基づく予測
    4\. で作成したDatumの配列を、classifyメソッドに渡すことで、予測値のListを得ることができます（106行目）。

6. 結果の出力
    「確からしさの値」を表すscoreが最大である予測値を返却するprivateメソッド「findBestResult」に、5. で得たListを渡し、返却結果を出力します（109-110行目）。
    返却されたListを参照することでそれぞれの予測値を見ることができます（94-98行目）。


------------------------------------
サンプルプログラムの実行
------------------------------------

* Jubatus Serverでの作業
    jubaclassifierを起動します。

    ::

     $ jubaclassifier --configpath shogun.json

* Jubatus Clientでの作業
    必要なパッケージとJavaクライアントを用意し、実行します。
