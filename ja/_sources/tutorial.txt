チュートリアル
===============

チュートリアルを始める前に、Jubatus および Jubatus Python クライアントをインストールする必要があります。この手順については :doc:`quickstart` を参照してください。


シナリオ
----------

このチュートリアルでは、自然言語の分類に対する評価用データとして有名な `News20 <http://people.csail.mit.edu/jrennie/20Newsgroups/>`_ (``20news-bydate.tar.gz``) を利用します。
News20では、話題が20個のニュースグループに分かれており、人々は自分が適していると思ったニュースグループに投稿します。
News20は便宜上、80%の学習用データ(20news-bydate-train)と、20%の実験用データ(20news-bydata-test)の二種類に分けられています。

このチュートリアルプログラムの目的は、学習用データを(投稿先ニュースグループ, 投稿内容)のセットとして学習し、テスト用データ(投稿内容)から、投稿先ニュースグループを推測することです。

このチュートリアルでは、以下のトピックをカバーします。

* Jubatus サーバをスタンドアローン構成で起動する

  * 分散環境での動作に興味がある方は、このチュートリアルの *後で* :doc:`tutorial_distributed` をご覧ください。

* Jubatus サーバを JSON スタイル で設定する
* Jubatus の分類器を ``train`` と ``classify`` API で使用する
* 分類に関する基本的なコンセプト


動作させてみる
----------------

分類器の機能を提供する ``jubaclassifier`` プログラムを設定ファイルを指定して起動します。設定ファイルのサンプルは ``$PREFIX/share/jubatus/example/config`` ディレクトリに格納されています。

::

  $ jubaclassifier -f /path/to/share/jubatus/example/config/classifier/pa.json
  I0110 13:43:07.789201  1855 server_util.cpp:250] starting jubaclassifier 0.5.0 RPC server at 192.168.0.1:9199
      pid                  : 1855
      user                 : oda
      mode                 : standalone mode
      timeout              : 10
      thread               : 2
      datadir              : /tmp
      logdir               : 
      loglevel             : INFO(0)
      zookeeper            : 
      name                 : 
      join                 : false
      interval sec         : 16
      interval count       : 512
      zookeeper timeout    : 10
      interconnect timeout : 10
  I0110 13:43:07.789721  1855 server_util.cpp:77] load config from local file :/path/to/share/jubatus/example/config/classifier/pa.json
  I0110 13:43:07.790897  1855 classifier_serv.cpp:117] config loaded: {
    "converter" : {
      "string_filter_types" : {},
      "string_filter_rules" : [],
      "num_filter_types" : {},
      "num_filter_rules" : [],
      "string_types" : {},
      "string_rules" : [
        { "key" : "*", "type" : "str", "sample_weight" : "bin", "global_weight" : "bin" }
      ],
      "num_types" : {},
      "num_rules" : [
        { "key" : "*", "type" : "num" }
      ]
    },
    "method" : "PA"
  }

Jubatus の分類器サーバが起動しました。
Jubatus サーバは、デフォルトでは TCP 9199 番ポートを利用して待ち受けます。
その他のポートを使用したい場合は、 ``--rpc-port`` オプションで指定することができます。
例えば、19199 番ポートを使用するには、次のようにします。

::

  $ jubaclassifier  --configpath /path/to/share/jubatus/example/config/classifier/pa.json --rpc-port 19199

Jubatus と Jubatus クライアントは、TCP/IP ネットワーク経由で `MessagePack-RPC <http://msgpack.org>`_ プロトコルを使用して通信します。

.. blockdiag::

    blockdiag single_single {
      group classifier{
      color = "#77FF77"
      jubaclassifier;
      }

      group client{
      color = "#FF7777"
      client;
      }

      client -> jubaclassifier;
    }




それでは、 `チュートリアルプログラム <https://github.com/jubatus/jubatus-tutorial-python>`_ とデータセットをダウンロードしましょう。

::

  $ git clone https://github.com/jubatus/jubatus-tutorial-python.git
  $ cd jubatus-tutorial-python
  $ wget http://people.csail.mit.edu/jrennie/20Newsgroups/20news-bydate.tar.gz
  $ tar xvzf 20news-bydate.tar.gz
  $ jubaclassifier --configpath config.json

チュートリアルプログラムを実行します。

::

  $ python tutorial.py

分類の結果が表示されました!
それぞれのメッセージについて、 ``OK`` は Jubatus の分類したラベルが正しかったことを、 ``NG`` は誤っていたことを表します。

より詳しい説明は以下を参照してください。


チュートリアルの詳細
----------------------

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

``49960`` はメッセージの一つで、 ``alt.atheism`` はそのメッセージが投稿されたニュースグループの名前です。
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

サーバの設定
~~~~~~~~~~~~~~~~~~~~

分類器サービスを使用するためには JSONの設定ファイルを用いて ``jubaclassifier`` の動作を規定する必要があります。
``method`` と ``converter`` と ``parameter`` の 3 つの設定可能なパラメタがあります。
これらのパラメタのサンプルを以下に示します。

.. code-block:: python

  {
    "method": "PA",
    "converter": {
      "string_filter_types": {
        "detag": { "method": "regexp", "pattern": "<[^>]*>", "replace": "" }
      },
      "string_filter_rules": [
        { "key": "message", "type": "detag", "suffix": "-detagged" }
      ],
      "num_filter_types": {},
      "num_filter_rules": [],
      "string_types": {},
      "string_rules": [
        { "key": "message-detagged", "type": "space", "sample_weight": "bin", "global_weight": "bin"}
      ],
      "num_types": {},
      "num_rules": []
    },
    "parameter": {}
  }

``method`` は、以下のアルゴリズムのうちいずれかを指定することができます。

- ``perceptron``
- ``PA``, ``PA1``, ``PA2``
- ``CW``
- ``AROW``
- ``NHERD``

このチュートリアルでは、 ``PA`` を選択します。

``converter`` は、入力データをどのように加工して、特徴ベクトルに変換するのかを指定します (詳細は :doc:`fv_convert` を参照してください)。

このチュートリアルで使用する学習データは、自然言語のテキストです。
英語など多くの言語は、空白と改行で区切るだけで単語を抽出できます。
Jubatus はこのような特徴ベクトルの抽出機能 (ここでは、自然言語のテキストを単語に分割) をデフォルトで備えています。
また、HTML タグなどは、内容を分類するのにノイズになりそうなので、 ``<`` と ``>`` で囲まれた部分を除去することにしましょう。

この機能を使用すると、こういった自然言語処理や与えられた値の重み付けなど、様々なルール付けを行うことができます。
今回のルールを JSON で表現すると、以下のようになります。

.. code-block:: python

  "converter": {
    "string_filter_types": {
      "detag": { "method": "regexp", "pattern": "<[^>]*>", "replace": "" }
    },
    "string_filter_rules": [
      { "key": "message", "type": "detag", "suffix": "-detagged" }
    ],
    "num_filter_types": {},
    "num_filter_rules": [],
    "string_types": {},
    "string_rules": [
      { "key": "message-detagged", "type": "space", "sample_weight": "bin", "global_weight": "bin"}
    ],
    "num_types": {},
    "num_rules": []
  }

Classifier API: 学習(train) と 分類(classify)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

分類器に学習させる場合は、 ``train`` という API (RPC メソッド) を利用します。
以下の例で、 ``d1`` はメッセージから作成された datum であり、 ``"comp.sys.mac.hardware"`` はそのメッセージのラベル (ニュースグループの名前) です。

.. code-block:: python

  d1 = Datum({"message" : "I want to buy mac book air..."})
  client.train([("comp.sys.mac.hardware", d1)])

この要領で、ラベルとメッセージの組み合わせを多数学習させます。

学習結果を使って分類を行う場合は、 ``classify`` という API を利用します。
``d2`` はメッセージから作成された datum ですが、どのニュースグループに投稿されたものであるかは判りません。Jubatus に推測させてみましょう。

.. code-block:: python

  d2 = Datum({"message" : "Just bought a new mac book air..."})
  result = client.classify([d2])

その結果、以下のような値が得られます。

.. code-block:: python

   [[
        ["comp.sys.mac.hardware", 1.10477745533],
        ...
        ["rec.sport.hockey", 0.2273217487300002],
        ["comp.os.ms-windows.misc", -0.065333858132400002],
        ["sci.electronics", -0.184129983187],
        ["talk.religion.misc", -0.092822007834899994]
   ]]

メッセージ ``d2`` は ``"comp.sys.mac.hardware"`` に投稿された可能性が高いことが分かりました。

その他のチュートリアル
-------------------------

本項では、Jubatus Clientの使い方を、サンプルプログラムを利用して解説します。

.. toctree::
   :maxdepth: 1

   tutorial/classifier
   tutorial/recommender
   tutorial/regression
   tutorial/graph
   tutorial/stat

.. toctree::
   :hidden:

   tutorial/anomaly

Anomaly、Nearnest_Neighbor、Clustering のチュートリアルは、現在準備中です。
