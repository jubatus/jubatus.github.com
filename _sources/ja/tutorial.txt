
Tutorial
========

チュートリアルを始める前に、Jubatus および Jubatus Python クライアントをインストールする必要があります。この手順については :doc:`quickstart` を参照してください。


Scenario
--------

このチュートリアルでは、自然言語の分類に対する評価用データとして有名な `News20 <http://people.csail.mit.edu/jrennie/20Newsgroups/>`_ (``20news-bydate.tar.gz``) を利用します。
News20では、話題が20個のnewsgroupに分かれており、人々は自分が適していると思ったnewsgroupに投稿します。
News20は便宜上、80%の学習用データ(20news-bydate-train)と、20%の実験用データ(20news-bydata-test)の二種類に分けられています。

このチュートリアルの目的は、学習用データを(投稿先newsgroup, 投稿内容)のセットとして学習し、テスト用データ(投稿内容)から、投稿先newsgroupを推測することです。


Standalone Mode
---------------

分類器の機能を提供する ``jubaclassifier`` プログラムを単に起動します。

::

  $ jubaclassifier
  I1128 16:52:51.031333  4200 server_util.cpp:136] starting jubaclassifier 0.3.4 RPC server at 192.168.1.2:9199
    pid            : 4200
    user           : jubatus
    mode           : standalone mode
    timeout        : 10
    thread         : 2
    tmpdir         : /tmp
    logdir         :
    zookeeper      :
    name           :
    join           : false
    interval sec   : 16
    interval count : 512

Jubatus の分類器開始しました。
Jubatus サーバは、デフォルトでは TCP 9199 番ポートを利用して待ち受けます。
その他のポートを使用したい場合は、 ``--rcp-port`` オプションで指定することができます。
例えば、19199 バンを使用するには、次のようにします。

::

  $ jubaclassifier --rpc-port 19199

Jubatus と Jubatus クライアントは、TCP/IP ネットワーク経由で `MessagePack-RPC <http://msgpack.org>`_ プロトコルを使用して通信します。

.. figure:: ../_static/single_single.png
   :width: 70 %
   :alt: single client, single server

Run Tutorial
~~~~~~~~~~~~

`チュートリアルプログラム <https://github.com/jubatus/jubatus-tutorial-python>`_ とデータセットをダウンロードします。

::

  $ git clone https://github.com/jubatus/jubatus-tutorial-python.git
  $ cd jubatus-tutorial-python
  $ wget http://people.csail.mit.edu/jrennie/20Newsgroups/20news-bydate.tar.gz
  $ tar xvzf 20news-bydate.tar.gz

チュートリアルプログラムを実行します。

::

  $ python tutorial.py

分類の結果が表示されます。
より詳しい説明は以下を参照してください。


Tutorial in Detail
------------------

Dataset
~~~~~~~

``20news-bydate.tar.gz`` を展開すると、以下のようになります。

::

  20news-bydate-train
  |-- alt.atheism
  |   |-- 49960
  |   |-- 51060
  |   |-- 51119
  |   |-- 51120
  :   :     :
  |-- comp.graphics
  |-- comp.os.ms-windows.misc
  |-- comp.sys.ibm.pc.hardware
  |-- comp.sys.mac.hardware
  |-- comp.windows.x
  |-- misc.forsale
  |-- rec.autos
  |-- rec.motorcycles
  |-- rec.sport.baseball
  |-- rec.sport.hockey
  |-- sci.crypt
  |-- sci.electronics
  |-- sci.med
  |-- sci.space
  |-- soc.religion.christian
  |-- talk.politics.guns
  |-- talk.politics.mideast
  |-- talk.politics.misc
  `-- talk.religion.misc

``49960`` はメッセージの一つで、 ``alt.atheism`` はそのメッセージが投稿されたnewsgroupの名前です。
例えば、 ``20news-bydate-train/rec.motorcycles/104435`` の内容は次のようなものです。

::

 From: karr@cs.cornell.edu (David Karr)
 Subject: Re: BMW MOA members read this!
 Organization: Cornell Univ. CS Dept, Ithaca NY 14853
 Lines: 19
 
 In article <C5Joz9.HLn@cup.hp.com> Chris Steinbroner <hesh@cup.hp.com> writes:
 >Wm. L. Ranck (ranck@joesbar.cc.vt.edu) wrote:
 >: As a new BMW owner I was thinking about signing up for the MOA, but
 >: right now it is beginning to look suspiciously like throwing money
 >: down a rathole.
 >
 >[...] i'm going to
 >let my current membership lapse when it's
 >up for renewal.
 >
 >-- hesh
 
 In my case that's not for another 3+ years, so I'd appreciate any
 hints on what will keep the organization in business that long.  (And
 preferably longer, of course, and worth being part of.)
 
 -- David Karr (karr@cs.cornell.edu)

このチュートリアルでは、これらのテキストを学習データとして利用します。

Server Configuration
~~~~~~~~~~~~~~~~~~~~

``jubaclassifier`` の動作は ``set_config`` メソッドで設定します。
``method`` と ``converter`` の 2 つの設定可能なパラメタがあります。
これらのパラメタのサンプルを以下に示します。

.. code-block:: python

  converter = {
            'string_filter_types': {},
            'string_filter_rules':[],
            'num_filter_types': {},
            'num_filter_rules': [],
            'string_types': {},
            'string_rules': [],
            'num_types': {},
            'num_rules': []
           }
  config = types.config_data(options.algo, json.dumps(converter))

``method`` は、以下のアルゴリズムのうちいずれかを指定することができます。

- ``perceptron``
- ``PA``, ``PA1``, ``PA2``
- ``CW``
- ``AROW``
- ``NHERD``

このチュートリアルでは、 ``PA`` を選択します。

``converter`` は、入力データをどのように加工して、特徴ベクトルに変換するのかを指定します (詳細は :ref:`conversion` を参照してください)。

今回の学習データは、自然言語のテキストです。
英語など多くの言語は、<space> と <return> で単語に分割出来るので、単語化して特徴ベクトルにすることにしましょう。
Jubatus はこの機能をデフォルトで備えています。
また、HTMLタグなどは、内容を分類するのにノイズになりそうなので、"<>"で囲まれた部分を除去することにしましょう。

こういった自然言語処理、与えられた値の重み付けなど、様々なルール付けを行うことができます。
今回のルールをJSONで表現すると、以下のようになります。

.. code-block:: python

    converter = {
            'string_filter_types': {
            "detag": { "method": "regexp", "pattern": "<[^>]*>", "replace": "" }
             },
            'string_filter_rules':
               [
              { "key": "message", "type": "detag", "suffix": "-detagged" }
               ],
              'num_filter_types': {},
              'num_filter_rules': [],
              'string_types': {},
              'string_rules': [
                  {'key': 'message-detagged', 'type': "space", "sample_weight": "bin", "global_weight": "bin"}
                  ],
              'num_types': {},
              'num_rules': []
              }

``get_config`` を呼ぶと、現在指定されているオプションが返ってきます。

Use of Classifier API: Train & Classify
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

学習器に学習させる場合は、 ``train`` というAPIを利用します。

.. code-block:: python

  train_dat = [
                (
                  "comp.sys.mac.hardware",
                  [["message" , "I want to buy a new mac book air..."], []]
                )
              ]

推定 (ここでは、Jubatus に与えられたデータから分類) を行う場合は、 ``classify`` というAPIを利用します。

.. code-block:: python

  classify_dat = [
                   [["message" , "I bought a new mac book air..."], []]
                 ]

その結果、以下のような値が得られます。

.. code-block:: python

   [[
        ["comp.sys.mac.hardware", 1.10477745533],
        ...
        ["rec.sport.hockey", 2.0973217487300002],
        ["comp.os.ms-windows.misc", -0.065333858132400002],
        ["sci.electronics", -0.184129983187],
        ["talk.religion.misc", -0.092822007834899994]
   ]]


Cluster Mode
------------

Jubatusでは、Zookeeperを用いて複数のサーバプロセス間を協調動作させることで、分散処理を行うことが出来ます。

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

Jubatus Keeper
~~~~~~~~~~~~~~

Jubatus Keeper は RPC リクエストをクライアントからサーバに中継 (プロキシ) します。
分散環境では、クライアントからの RPC リクエストを直接サーバに送るのではなく、一度 Keeper に送ります。

Jubatus Keeper は各 Jubatus サーバの種類ごとに提供されています。
分類器に対応する Keeper は ``jubaclassifier_keeper`` となります。

::

    $ jubaclassifier_keeper --zookeeper=localhost:2181 --rpc-port=9198

これにより、jubaclassifier_keeperは、TCP 9198 番ポートでRPCを待ち受けます。

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

チュートリアルプログラムを再び実行します。ただし、今回はサーバではなく Keeper に接続するため、ポートをオプションとして指定します。
また、分散環境では、RPC リクエストを Keeper へ送る際にクラスタ名を指定する必要があります。

::

    $ python tutorial.py --server_port=9198 --name=tutorial

接続先がスタンドアロンであっても、分散環境であっても、クライアントコードの変更が不要であることに着目してください。


Cluster Management in Jubatus
-----------------------------

Jubatusは各種プロセスを一括管理するための仕組みを備えています。
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

    [192.168.0.1]$ jubactl -c start  --server=classifier --type=classifier --name=tutorial --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
    [192.168.0.1]$ jubactl -c status --server=classifier --type=classifier --name=tutorial --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
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

    [192.168.0.1]$ jubactl -c stop --server=classifier --type=classifier --name=tutorial --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181

