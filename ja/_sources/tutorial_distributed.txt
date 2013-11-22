===================================================
分散モードでのセットアップ 
===================================================

本項では、Jubatusを複数のサーバで分散させた環境構築を説明します。

なお、本項を始める前に、スタンドアローン構成での構築を試すことをお勧めします。

Jubatusを分散モードで動かす前に
==================================================

JubatusではZooKeeperを用いて複数のサーバプロセス間を協調動作させることで、分散処理を行うことができます。

ZooKeeperは分散環境で動作するソフトウェアを運用するうえでの困難を低減するためのサービスを提供します。

Jubatusを分散環境で動作させる際、ZooKeeperが利用できない状況は致命的です。
ZooKeeperを高い信頼性で動作させるために、以下のことを注意します。
詳細は `ZooKeeperのドキュメント <http://oss.infoscience.co.jp/hadoop/zookeeper/docs/current/>`_ を参照して下さい。

1. 奇数台のマシンによるクラスタ構成(アンサンブル)で運用します。
2. ZooKeeperのパフォーマンスが低下し、Jubatusの動作が不安定になることを避けるため、ZooKeeper専用のマシンを用意することを推奨します。

ここでは、1台のマシン内に複数のサーバプロセスを動作させる方法（分散処理）と3台のマシンで1サーバプロセスずつ動作させる方法（クラスタ構成）を説明していきます。


分散モード
========================================

1. ZooKeeperのインストール
 
 Apache ZooKeeperの `ダウンロードサイト <http://www.apache.org/dyn/closer.cgi/zookeeper/>`_ からZooKeeperを取得します。
 
 ::
 
  $ sudo wget http://ftp.meisei-u.ac.jp/mirror/apache/dist/zookeeper/stable/zookeeper-3.4.5.tar.gz
  $ tar xvf zookeeper-3.4.5.tar.gz


 ※ プロキシを経由している場合は以下の1行を /etc/wgetrc に追記してください。
 
 ::
 
  $ sudo vi /etc/wgetrc

 ::
 
  http_proxy=http://username:password@proxy.example.com:port/


2. ZooKeeperの設定ファイル（zoo.cfg）の作成

 zookeeper-3.4.5/conf 配下にサンプルの設定ファイルがありますので、そちらをコピーして作成してください。
 
 ::
 
  $ sudo cp /path/to/zookeeper/conf/zoo_sample.cfg /path/to/zookeeper/conf/zoo.cfg

 ここでは、zoo.cfgの各設定項目の説明は省きます。
 
3. ZooKeeperの起動
 
 ZooKeeperは以下のようにして起動します。
 
 ::
  
  $ sudo /path/to/zookeeper/bin/zkServer.sh start
  JMX enabled by default
  Using config: /path/to/zookeeper/bin/../conf/zoo.cfg
  Starting zookeeper ... STARTED

 以降では、ZooKeeperがlocalhost:2181で動作していると仮定します。この設定はzoo.cfgで変更可能です。

4. 設定ファイルをZooKeeperに設定

 分散環境では、事前に設定ファイルをZooKeeperに登録します。登録にはjubaconfigというツールを使用します。
 
 ::
 
  $ jubaconfig --cmd write --zookeeper=localhost:2181 --file jubatus-example/shogun/shogun.json --name shogun --type classifier

5. Jubatus Proxyの起動

 Jubatus ProxyはRPCリクエストをクライアントからサーバに中継(プロキシ)します。
 分散環境では、クライアントからのRPCリクエストを直接サーバに送るのではなく、一度Proxyに送ります。

 Jubatus Proxyは各Jubatusサーバの種類ごとに提供されています。
 shogunに対応するProxyはjubaclassifier_proxyとなります。

 ::
 
  $ jubaclassifier_proxy --zookeeper=localhost:2181 --rpc-port=9198

 これにより、jubaclassifier_proxyは、TCP 9198番ポートでRPCリクエストを待ち受けます。
 

6. サーバプロセスの起動

 Jubatusサーバを分散環境で開始するには、--nameと--zookeeperオプションをサーバの起動時に指定します。
 同じ--nameで起動されたサーバプロセスは同じクラスタに所属し、お互いに協調動作します。

 一つのマシン内で複数のサーバを起動する場合は、各サーバプロセスごとにポート番号を変える必要があることに注意してください。

 ::
 
  $ jubaclassifier --rpc-port=9180 --name=shogun --zookeeper=localhost:2181 &
  $ jubaclassifier --rpc-port=9181 --name=shogun --zookeeper=localhost:2181 &
  $ jubaclassifier --rpc-port=9182 --name=shogun --zookeeper=localhost:2181 &

 Jubatusサーバが分散環境で開始する際に、ZooKeeperシステムの中にノードが作成されます。
 ZooKeeperのクライアント（zkCli.sh）を用いて、3つのプロセスがZooKeeperシステムに登録されていることが確認できます。

 ::
 
  $ sudo /path/to/zookeeper/bin/zkCli.sh -server localhost:2181
  [zk: localhost:2181(CONNECTED) 0] ls /jubatus/actors/classifier/shogun/nodes
  [XXX.XXX.XXX.XXX_9180, XXX.XXX.XXX.XXX_9181, XXX.XXX.XXX.XXX_9182]


7. プログラムの実行

 今回はサーバではなくProxyに接続するため、ポート番号にはjubaclassifier_proxyで指定したポート番号を指定します。
 また、分散環境では、RPCリクエストをProxyへ送る際にクラスタ名を指定する必要があります。

 ::
 
  $ python shogun.py

8. ZooKeeperの停止

 ZooKeeperを停止する場合は以下のようにして停止します。
 
 ::
 
  $ sudo /path/to/zookeeper/bin/zkServer.sh stop


クラスタの設定
==================================================

 Jubatusは各種プロセスを一括管理するための仕組みを備えています。
 今、それぞれのサーバに対して、以下の表に対応したプロセスを起動させることを考えます。

  +-------------+------------------------------------+
  |IP Address   |Processes                           |
  +=============+====================================+
  |192.168.0.1  |  Terminal                          |
  +-------------+------------------------------------+
  |192.168.0.11 | | jubaclassifier - 1               |
  |             | | jubaclassifier_proxy/client - 1  |
  |             | | ZooKeeper - 1                    |
  +-------------+------------------------------------+
  |192.168.0.12 | | jubaclassifier - 2               |
  |             | | jubaclassifier_proxy/client - 2  |
  |             | | ZooKeeper - 2                    |
  +-------------+------------------------------------+
  |192.168.0.13 | | jubaclassifier - 3               |
  |             | | jubaclassifier_proxy/client - 3  |
  |             | | ZooKeeper - 3                    |
  +-------------+------------------------------------+

1. ZooKeeperの設定

 複数台でZooKeeperを起動する場合、それぞれのzoo.cfgに設定を追加します。
 
 ::
 
  $ sudo vi /path/to/zookeeper/conf/zoo.cfg

  server.1=192.168.0.11:2888:3888
  server.2=192.168.0.12:2888:3888
  server.3=192.168.0.13:2888:3888

 また、zoo.cfgのdataDir=に指定したフォルダにmyidファイルを作成する必要があります。
 
 myidファイルの中身は上記の server.n=xxx.xxx.x.xxx:xxxx:xxxx の n に対応する数字を記述します。
 
 ::
 
  $ cd /tmp/zookeeper         （dataDir=に指定しているディレクトリ）
  $ sudo vi myid
  
2. ZooKeeperの起動
 
 ZooKeeperサーバを起動します(これらの間でアンサンブル構成を行う必要があります)。
 
 ::
 
  [192.168.0.11]$ bin/zkServer.sh start
  [192.168.0.12]$ bin/zkServer.sh start
  [192.168.0.13]$ bin/zkServer.sh start
 
3. Jubatus Proxyの起動

 jubaclassifier_proxyプロセスを起動します。jubaclassifier_proxyはTCP 9199番ポートをデフォルトで使用します。
 
 ::
 
  [192.168.0.11]$ jubaclassifier_proxy --zookeeper 192.168.0.11:2181,192.168.0.12:2181,192.168.0.13:2181
  [192.168.0.12]$ jubaclassifier_proxy --zookeeper 192.168.0.11:2181,192.168.0.12:2181,192.168.0.13:2181
  [192.168.0.13]$ jubaclassifier_proxy --zookeeper 192.168.0.11:2181,192.168.0.12:2181,192.168.0.13:2181
  

4. Jubavisor:サーバプロセス管理のエージェント

 jubavisorはサーバプロセスを管理するためのエージェントプロセスです。

 jubavisorを使うことで、Jubatusサーバの各プロセスを、操作用コマンドであるjubactlからのRPCリクエストによって管理することができます。
 jubavisorはTCP 9198番ポートをデフォルトで使用します。
 
 ::
 
  [192.168.0.11]$ jubavisor --zookeeper 192.168.0.11:2181,192.168.0.12:2181,192.168.0.13:2181 --daemon
  [192.168.0.12]$ jubavisor --zookeeper 192.168.0.11:2181,192.168.0.12:2181,192.168.0.13:2181 --daemon
  [192.168.0.13]$ jubavisor --zookeeper 192.168.0.11:2181,192.168.0.12:2181,192.168.0.13:2181 --daemon
 
 jubactlからjubavisorに命令を送信してみましょう。
 
 ::
 
  [192.168.0.1]$ jubactl -c start  --server=jubaclassifier --type=classifier --name=shogun --zookeeper 192.168.0.11:2181,192.168.0.12:2181,192.168.0.13:2181
   sending start / jubaclassifier/shogun to 192.168.0.11_9198...ok.
   sending start / jubaclassifier/shogun to 192.168.0.12_9198...ok.
   sending start / jubaclassifier/shogun to 192.168.0.13_9198...ok.
  [192.168.0.1]$ jubactl -c status --server=jubaclassifier --type=classifier --name=shogun --zookeeper 192.168.0.11:2181,192.168.0.12:2181,192.168.0.13:2181
  active jubaclassifier_proxy members:
   192.168.0.11_9199
   192.168.0.12_9199
   192.168.0.13_9199
  active jubavisor members:
   192.168.0.11_9198
   192.168.0.12_9198
   192.168.0.13_9198
  active shogun members:
   192.168.0.11_9200
   192.168.0.12_9200
   192.168.0.13_9200
   
 membersの表示から、サーバが起動していることが分かります。
 複数のホストでクライアントを同時に動かしてみましょう。
 
 ::
 
  $ python shogun.py
 
 なお、Jubatusサーバの停止もjubactlから行うことができます。
 
 ::
 
  [192.168.0.1]$ jubactl -c stop --server=jubaclassifier --type=classifier --name=shogun --zookeeper 192.168.0.11:2181,192.168.0.12:2181,192.168.0.13:2181
  
  
