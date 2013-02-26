Tutorial in Distributed Mode
============================

このチュートリアルを始める前に、 :doc:`tutorial` をスタンドアローン構成で試すことをお勧めします。


Distributed Mode
----------------

Jubatus では ZooKeeper を用いて複数のサーバプロセス間を協調動作させることで、分散処理を行うことができます。

.. figure:: ../_static/single_multi.png
   :width: 70 %
   :alt: single client, multi servers

Setup ZooKeeper
~~~~~~~~~~~~~~~

`ZooKeeper <http://zookeeper.apache.org/>`_ は分散コーディネーションサービスです。
Jubatus を分散環境で動作させる場合、ZooKeeper を使って Jubatus サーバと Keeper を管理することができます。

ZooKeeper は以下のようにして起動します。

::

    $ /path/to/zookeeper/bin/zkServer.sh start
    JMX enabled by default
    Using config: /path/to/zookeeper/bin/../conf/zoo.cfg
    Starting zookeeper ...
    STARTED

以降では、ZooKeeper が localhost:2181 で動作していると仮定します。この設定は ``zoo.cfg`` で変更可能です。


Register configuration file to ZooKeeper
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

分散環境では、事前に設定ファイルを ZooKeeper に登録します。
登録には jubaconfig というツールを使用します。

::

    $ jubaconfig --cmd write --zookeeper=localhost:2181 --file config.json --name tutorial --type classifier

Jubatus Keeper
~~~~~~~~~~~~~~

Jubatus Keeper は RPC リクエストをクライアントからサーバに中継 (プロキシ) します。
分散環境では、クライアントからの RPC リクエストを直接サーバに送るのではなく、一度 Keeper に送ります。

Jubatus Keeper は各 Jubatus サーバの種類ごとに提供されています。
分類器に対応する Keeper は ``jubaclassifier_keeper`` となります。

::

    $ jubaclassifier_keeper --zookeeper=localhost:2181 --rpc-port=9198

これにより、jubaclassifier_keeper は、TCP 9198 番ポートで RPC リクエストを待ち受けます。

Join Jubatus Servers to Cluster
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Jubatus サーバを分散環境で開始するには、 ``--name`` と ``--zookeeper`` オプションをサーバの起動時に指定します。
同じ ``--name`` で起動されたサーバプロセスは同じクラスタに所属し、お互いに協調動作します。

一つのマシン内で複数のサーバを起動する場合は、各サーバプロセスごとにポート番号を変える必要があることに注意してください。

::

    $ jubaclassifier --rpc-port=9180 --name=tutorial --zookeeper=localhost:2181 &
    $ jubaclassifier --rpc-port=9181 --name=tutorial --zookeeper=localhost:2181 &
    $ jubaclassifier --rpc-port=9182 --name=tutorial --zookeeper=localhost:2181 &

Jubatus サーバが分散環境で開始する際に、ZooKeeper システムの中にノードが作成されます。
ZooKeeper のクライアントを用いて、3 つのプロセスが ZooKeeper システムに登録されていることが確認できます。

::

    $ /path/to/zookeeper/bin/zkCli.sh -server localhost:2181
    [zk: localhost:2181(CONNECTED) 0] ls /jubatus/actors/classifier/tutorial/nodes 
    [XXX.XXX.XXX.XXX_9180, XXX.XXX.XXX.XXX__9181, XXX.XXX.XXX.XXX__9182]

Run Tutorial
~~~~~~~~~~~~

チュートリアルプログラムを再び実行します。ただし、今回はサーバではなく Keeper に接続するため、ポート番号をオプションとして指定します。
また、分散環境では、RPC リクエストを Keeper へ送る際にクラスタ名を指定する必要があります。

::

    $ python tutorial.py --server_port=9198 --name=tutorial

接続先がスタンドアロンであっても、分散環境であっても、クライアントコードの変更が不要であることに着目してください。


Cluster Management in Jubatus
-----------------------------

Jubatus は各種プロセスを一括管理するための仕組みを備えています。
今、それぞれのサーバに対して、以下の表に対応したプロセスを起動させることを考えます。

=============  =======================================
IP Address     Processes
=============  =======================================
192.168.0.1    Terminal
192.168.0.11   jubaclassifier - 1
192.168.0.12   jubaclassifier - 2
192.168.0.13   jubaclassifier - 3
192.168.0.101  jubaclassifier_keeper/client - 1
192.168.0.102  jubaclassifier_keeper/client - 2
192.168.0.103  jubaclassifier_keeper/client - 3
192.168.0.211  ZooKeeper - 1
192.168.0.212  ZooKeeper - 2
192.168.0.213  ZooKeeper - 3
=============  =======================================

ベストプラクティスについては :doc:`admin` を参照してください。

.. figure:: ../_static/multi_multi.png
   :width: 70 %
   :alt: multi clients, multi servers

ZooKeepers & Jubatus Keepers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

ZooKeeper サーバを起動します (これらの間でアンサンブル構成を行う必要があります)。

::

    [192.168.0.211]$ bin/zkServer.sh start
    [192.168.0.212]$ bin/zkServer.sh start
    [192.168.0.213]$ bin/zkServer.sh start

``jubaclassifier_keeper`` プロセスを起動します。 ``jubaclassifier_keeper`` は TCP 9199 番ポートをデフォルトで使用します。

::

    [192.168.0.101]$ jubaclassifier_keeper --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
    [192.168.0.102]$ jubaclassifier_keeper --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
    [192.168.0.103]$ jubaclassifier_keeper --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181

Jubavisor: Process Management Agent
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``jubavisor`` はサーバプロセスを管理するためのエージェントプロセスです。

``jubavisor`` を使うことで、Jubatus サーバの各プロセスを、操作用コマンドである ``jubactl`` からの RPC リクエストによって管理することができます。
``jubavisor`` は TCP 9198 番ポートをデフォルトで使用します。

::

    [192.168.0.11]$ jubavisor --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181 --daemon
    [192.168.0.22]$ jubavisor --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181 --daemon
    [192.168.0.33]$ jubavisor --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181 --daemon

``jubactl`` から ``jubavisor`` に命令を送信してみましょう。

::

    [192.168.0.1]$ jubactl -c start  --server=jubaclassifier --type=classifier --name=tutorial --zookeeper=192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
    [192.168.0.1]$ jubactl -c status --server=jubaclassifier --type=classifier --name=tutorial --zookeeper=192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
    active jubaclassifier_keeper members:
     192.168.0.101_9199
     192.168.0.102_9199
     192.168.0.103_9199
    active jubavisor members:
     192.168.0.11_9198
     192.168.0.12_9198
     192.168.0.13_9198
    active tutorial members:
     192.168.0.11_9199
     192.168.0.12_9199
     192.168.0.13_9199

members の表示から、サーバが起動していることが分かります。
複数のホストでクライアントを同時に動かしてみましょう。

::

    [192.168.0.101]$ python tutorial.py --name=tutorial --server_ip 127.0.0.1:9199
    [192.168.0.102]$ python tutorial.py --name=tutorial --server_ip 127.0.0.1:9199
    [192.168.0.103]$ python tutorial.py --name=tutorial --server_ip 127.0.0.1:9199

なお、Jubatus サーバの停止も ``jubactl`` から行うことができます。

::

    [192.168.0.1]$ jubactl -c stop --server=jubaclassifier --type=classifier --name=tutorial --zookeeper=192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
