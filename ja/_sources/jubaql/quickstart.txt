JubaQL クイックスタート
=======================


JubaQL 要件
-----------

JubaQLを動作させるために必要なソフトウェアは以下の通りです。

=================== ============ ========= ======================================================
ソフトウェア        バージョン   必須      備考
=================== ============ ========= ======================================================
JDK                 7
Spark               1.2.1+ [1]_  ✔ [2]_
Jubatus             0.8.0        ✔ [3]_
Hadoop YARN         -                      JubaQLをProductionモードで動作させる場合のみ必要。
Jubatus on YARN     1.0                    JubaQLをProductionモードで動作させる場合のみ必要。
=================== ============ ========= ======================================================

.. [1] Spark 1.1.x 以前, 1.2.0, 1.3.x 以降では動作しません。
.. [2] JubaQL Gatewayを実行するノードにSparkをインストールする必要があります。
.. [3] JubaQLをDevelopmentモードで動作させる場合、JubaQL Gatewayを実行するノードにJubatusをインストールする必要があります。
       JubaQLをProductionモードで動作させる場合、すべてのYARNノード上にJubatusをインストールする必要があります。

JubaQLおよびJubatus on YARNをビルドするためには、 `sbt <http://www.scala-sbt.org/>`_ コマンドのインストールが必要です。

Mavenリポジトリの利用方法
~~~~~~~~~~~~~~~~~~~~~~~~~

Jubatus on YARNをScalaアプリケーションから利用する場合は、Mavenリポジトリを利用することができます。
build.sbtに以下の情報を追記してください。

::

  // Jubatus Maven Repository
  resolvers += "Jubatus" at "http://download.jubat.us/maven"

  // Dependencies
  libraryDependencies ++= Seq(
    "us.jubat"                   %% "jubatus-on-yarn-client"    % "1.0"
  )


Developmentモード
-----------------
はじめに、簡易な設定のDevelopmentモードのセットアップについて紹介します。
このモードではHadoopクラスタを用意することなくJubaQLを動作させることができます。

セットアップ
~~~~~~~~~~~~
Hadoopが利用可能な `Apache Spark <http://spark.apache.org/>`_ 1.2.2 をダウンロードし、環境変数を設定します。

::

   wget http://d3kbcqa49mib13.cloudfront.net/spark-1.2.2-bin-hadoop2.4.tgz
   tar -xzf spark-1.2.2-bin-hadoop2.4.tgz && export SPARK_DIST="$(pwd)/spark-1.2.2-bin-hadoop2.4/"

JubaQLClientをビルドします。

::

   git clone https://github.com/jubatus/jubaql-client.git
   cd jubaql-client && sbt start-script && cd ..

JubaQLServerをビルドします。

::

  git clone https://github.com/jubatus/jubaql-server.git
  cd jubaql-server/processor && sbt assembly && cd ../..
  cd jubaql-server/gateway && sbt assembly && cd ../..


動作確認
~~~~~~~~
JubaQLでDevelopモードの動作確認をします。
動作の確認には jubaql-server/data/shogun_data.jsonのデータを使用します。


JubaQL Serverを起動します。

::

   cd jubaql-server && \
   java -Dspark.distribution="$SPARK_DIST" \
        -Djubaql.processor.fatjar=processor/target/scala-2.10/jubaql-processor-assembly-1.3.0.jar \
        -jar gateway/target/scala-2.10/jubaql-gateway-assembly-1.3.0.jar \
        -i 127.0.0.1

JubaQL Clientを起動します。

::

  ./jubaql-client/target/start

次にJubaQL Clientから以下のクエリを実行します。

::

   CREATE CLASSIFIER MODEL test (label: label) AS name WITH unigram CONFIG '{"method": "AROW", "parameter": {"regularization_weight" : 1.0}}'
   CREATE DATASOURCE shogun (label string, name string) FROM (STORAGE: "file://jubaql-server/data/shogun_data.json")
   UPDATE MODEL test USING train FROM shogun
   START PROCESSING shogun
   ANALYZE '{"name": "慶喜"}' BY MODEL test USING classify
   SHUTDOWN


Productionモード(GatewayとClientが同一ノード)
---------------------------------------------

YARN、HDFSを利用するProductionモードのセットアップを説明します。
はじめにJubaQL GatewayとJubaQL Clientが同一ノード上で動作する場合のセットアップについて説明します。

セットアップ
~~~~~~~~~~~~

ここでは上記開発モードのインストールに加え以下の条件を満たしている必要があります。

* YARN, HDFSと共にHadoopクラスタがセットアップされていること

  * `Cloudera Manager <http://www.cloudera.com/content/cloudera/en/downloads/cloudera_manager.html>`_ や `Hortonworks Packages <http://hortonworks.com/hdp/downloads/>`_ 等を参照

* Hadoopクラスタの全ノードにJubatusがインストールされていること

* `Jubatus-on-yarn <https://github.com/jubatus/jubatus-on-yarn>`_ がインストールされていること

  * `Jubatus-on-yarnのドキュメント <https://github.com/jubatus/jubatus-on-yarn/blob/master/document/instruction_ja.md>`_ 参照
  * HDFS上に/jubatus-on-yarn/application-master/jubaconfig/ が存在し、JubaQLProcessorの実行ユーザに書き込み権限があることを確認

動作確認
~~~~~~~~

動作確認用の訓練データshogun_data.jsonをHDFSにコピーします

::

   hdfs dfs -put ./jubaql-server/data/shogun_data.json /jubatus-on-yarn/sample/shogun_data.json

Hadoopクラスタの情報を持つcore-site.xml, yarn-site.xml, hdfs-site.xmlをJubaQL Gatewayが動作するマシンの適当なディレクトリにコピーし、環境変数HADOOP_CONF_DIRをそのディレクトリに設定します。

::

   cp core-site.xml yarn-site.xml hdfs-site.xml /etc/hadoop/conf
   export HADOOP_CONF_DIR="/etc/hadoop/conf"

JubaQL Gatewayが動作するマシンのIPアドレスを取得します。

::

   Linuxでは以下のようなコマンドで取得できます
   export MY_IP=$(ip route get 12.34.56.78 | grep -Po 'src \K.+')

得られたIPアドレスにHadoopクラスタからアクセスできることを確認してください。
アクセスできない場合にはネットワークの設定を確認してください。

Zookeeperが動作するノードを ``host:port`` の形式で環境変数に設定します。

::

   export MY_ZOOKEEPER=zk1:2181,zk2:2181

Spark の checkpoint のための HDFS 上のディレクトリを指定します

::

  export CHECKPOINT=hdfs:///tmp/spark

JubaQL Gatewayを起動します。

::

     cd jubaql-server && \
     java -Drun.mode=production \
          -Djubaql.checkpointdir=$CHECKPOINT \
          -Djubaql.zookeeper=$MY_ZOOKEEPER \
          -Dspark.distribution="$SPARK_DIST" \
          -Djubaql.processor.fatjar=processor/target/scala-2.10/jubaql-processor-assembly-1.3.0.jar \
          -jar gateway/target/scala-2.10/jubaql-gateway-assembly-1.3.0.jar \
          -i $MY_IP``

新たにシェルを立ち上げ、JubaQL Clientを起動します

::

   ./jubaql-client/target/start

``jubaql>`` というプロンプトが現れたら以下のようにクエリを実行します。

::

   CREATE CLASSIFIER MODEL test (label: label) AS name WITH unigram CONFIG '{"method": "AROW", "parameter": {"regularization_weight" : 1.0}}'
   CREATE DATASOURCE shogun (label string, name string) FROM (STORAGE: "hdfs:///jubatus-on-yarn/sample/shogun_data.json")
   UPDATE MODEL test USING train FROM shogun
   START PROCESSING shogun
   ANALYZE '{"name": "慶喜"}' BY MODEL test USING classify
   SHUTDOWN


Productionモード(GatewayとClientが異なるノード)
-----------------------------------------------

次に、JubaQL GatewayがJubaQL Clientとは異なるノードで動作する場合について説明します。
このモードでのセットアップ手順は上記同一ノード上で動作する場合のセットアップと概ね同様です。
注意すべき点は以下の２点です。

* jarファイルやHadoopの設定ファイルを配置するサーバ

  * これらはJubaQL Gatewayが動作するマシン上に配置する必要があります。

* JubaQL Clientの起動方法

  * JubaQL Clientの起動時に ``-h hostname`` でJubaQL Gatewayが動作するホストを指定しなければなりません。


