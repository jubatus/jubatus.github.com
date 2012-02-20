Tutorial
========



Overview and Scenario
----------------------
This tutorial made up of following four sections:


このチュートリアルでは、自然言語の分類に対する評価用データとして有名な、 `News20(20news-bydate.tar.gz) <http://people.csail.mit.edu/jrennie/20Newsgroups/>`_ を利用します。
News20では、話題が20個のnewsgroupに分かれており、人々は自分が適していると思ったnewsgroupに投稿します。
News20は便宜上、80%の学習用データ(20news-bydate-train)と、20%の実験用データ(20news-bydata-test)の二種類に分けられています。
このチュートリアルの目的は、学習用データを(投稿先newsgroup, 投稿内容)のセットとして学習し、テスト用データ(投稿内容)から、投稿先newsgroupを推測することです。


Prequisites
~~~~~~~~~~~

This tutorial requires following softwares installed:

- Linux 2.6 +
- gcc 4.0 +
- pkg-config
- python 2.6+ and `msgpack-python <http://pypi.python.org/pypi/msgpack-python/>`_
- `libmsgpack <http://msgpack.org>`_
- `pficommon <http://github.com/pfi/pficommon>`_ - must be configured with msgpack enabled.
- `re2 <http://code.google.com/p/re2/>`_
- `google-glog <http://code.google.com/p/google-glog/>`_
- `ux-trie <http://code.google.com/p/ux-trie/>`_ / `MeCab <http://mecab.sourceforge.net/>`_ (optional)
- `ZooKeeper <http://zookeeper.apache.org/>`_ server and C client (optional, for multiple processes)


Setup a single process Jubatus Server
------------------------------------=

ここでは、Jubatusをインストールするための手順を示します。 他のdisutributionを利用する場合は、適時読み替えてください。

building and installing Jubatus
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

上記を事前にインストールした上で、Jubatusをbuild, installしてください。

::

  $ git clone git://github.com/jubatus/jubatus.git
  $ cd jubatus
  $ ./waf configure
  $ ./waf build
  # ./waf install
  $ jubaclassifier --name tutorial

これで、1プロセス構成でのセットアップと起動が完了しました。

``--name`` オプションは、複数のJubatusプロセスを利用する際に使います。
詳しくは、 :ref:`multiprocess` を参照してください。

JubatusはデフォルトでMessagePack RPCサーバとして9199ポートで待ち受けます。
他のサービスなどが同じポートを利用している場合は、オプションを利用して、他のポートを利用してください。
例えば、RPCサーバを9181番で待ち受ける場合は、

::

  $ jubaclassifier --rpc-port=9181 --name=tutorial

になります。

installing Python client for Jubatus
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Python client of Jubatus requires `msgpack-python <http://pypi.python.org/pypi/msgpack-python/>`_.

::

  $ git clone git://github.com/jubatus/jubatus-python-client.git
  $ cd jubatus-python-client
  $ python setup.py build
  # python setup.py install

Check your python installation by running tests:

::

  $ python setup.py test


.. TODO: check "Expert Python Programming" and do in a pythonic way

Sending query to a Jubatus server
--------------------------------=

.. Jubatus communicates with its clients in `MessagePack-RPC <http://msgpack.org>`_ protocol.


Prepairing dataset
~~~~~~~~~~~~~~~~~~


20news-bydate.tar.gzを展開すると、

::

  -20news-bydate-train
    alt.atheism
      49960
      51060
      ...
    comp.graphics
    comp.os.ms-windows.misc
    comp.sys.ibm.pc.hardware
    comp.sys.mac.hardware
    comp.windows.x
    misc.forsale
    rec.autos
    rec.motorcycles
    rec.sport.baseball
    rec.sport.hockey
    sci.crypt
    sci.electronics
    sci.med
    sci.space
    soc.religion.christian
    talk.politics.guns
    talk.politics.mideast
    talk.politics.misc
    talk.religion.misc

のファイル群が展開されます。数値49960がファイル名で、newsgroup名がalt.atheismになります。
例えば、20news-bydate-train/rec.motorcycles/104435の中身は、

 
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


のようなテキストファイルです。
これらのテキストファイルを学習データとして利用します。

Set configure
~~~~~~~~~~~~~
jubaclassifierは、method, converterのオプションを外部からのqueryで指定することによって、動作を指定することが出来ます。オプションのプロトタイプは、以下のとおりです。

.. code-block:: python

 config = {
            'converter': {
                'string_filter_types': {},
                'string_filter_rules': [],
                'num_filter_types': {},
                'num_filter_rules': [],
                'string_types': {},
                'string_rules': [],
                'num_types': {},
                'num_rules': []
                },
            'method': ''
            }

``'method'`` は、以下のアルゴリズムのうちいずれかを指定することが出来ます。

- ``perceptron``
- ``PA``, ``PA1``, ``PA2``
- ``CW``
- ``AROW``
- ``NHERD``

今回は、 ``PA`` を選択します。

``'converter'`` は、入力データをどのように加工して、特徴ベクトルに変換するのかを指定します。

今回は、自然言語のテキストです。
英語など多くの言語は、<space>, <Return>で単語に分割出来るので、単語化して特徴ベクトルにすることにしましょう。
また、HTMLタグなどは、内容を分類するのにノイズになりそうなので、"<>"で囲まれた部分を除去することにしましょう。

こういった自然言語処理、与えられた値の重み付けなど、様々なルール付けを行うことが出来ます。
今回のルールをPythonオブジェクトで表現すると、以下のようになります。

.. code-block:: python

  config = {
            'converter': {
              "string_filter_types": {
              "detag": { "method": "regexp", "pattern": "<[^>]*>", "replace": "" }
               },
   　          "string_filter_rules":
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
                },
            'method': 'PA'
            }

``get_config`` に対してRPC呼び出しを行うと、現在指定されているオプションが返ってきます。


Train/Classify
~~~~~~~~~~~~~~
学習器に学習させる場合は、 ``train`` というAPIを利用します。

.. code-block:: python

  train_dat = [
             (
               "comp.windows.x",
               [
                ["message" , "some messages about windows..."],
                ["from" , "hoge@n.tt"]
               ]
             ),
             (
               "comp.sys.mac.hardware",
               ["message" , "I want to buy a new mac book air...",]
             )
           ]

推定させる場合は、 ``classify`` というAPIを利用します。

.. code-block:: python

  classify_dat = [[
         ["some messages about windows..."],
         ["I bought a new mac book air..."],
       ]]	 


その結果は、以下のような値が得られます。

.. code-block:: python

   [[
        ["alt.atheism", 1.10477745533],
        ...
	["rec.sport.hockey", 2.0973217487300002],
 	["comp.os.ms-windows.misc", -0.065333858132400002],
	["sci.electronics", -0.184129983187],
        ["talk.religion.misc", -0.092822007834899994]
   ]]
   
それぞれのラベルごとの値が出るので、この中で一番大きい値を提示すればおそらくそれは正しい分類でしょう。
JubatusはMessagePack-RPCを利用できるあらゆる言語から利用することが出来ます。最後に、pythonのコードを示します。


.. code-block:: python

 #!/usr/bin/env python
 # -*- coding: utf-8 -*-
 
 import sys
 import jubatus
 
 def parse_args():
     from optparse import OptionParser, OptionValueError
     p = OptionParser()
     p.add_option('-s', '--server_list', action='store',
                  dest='server_list', type='string', default='localhost:9199')
     p.add_option('-n', '--name', action='store',
                  dest='name', type='string', default='test')
     p.add_option('-a', '--algo', action='store',
                  dest='algo', type='string', default="PA")
     return p.parse_args()
 
 def get_most_likely(estm):
     ans = None
     prob = None
     result = {}
     result[0] = ''
     result[1] = 0
     for res in estm:
         if prob == None or res[1] > prob :
             ans = res[0]
             prob = res[1]
             result[0] = ans
             result[1] = prob
     return result
 
 
 if __name__ == '__main__':
     options, remainder = parse_args()
 
     classifier = jubatus.Classifier(options.server_list, options.name)
 
     config = {
             'converter': {
               "string_filter_types": {
               "detag": { "method": "regexp", "pattern": "<[^>]*>", "replace": "" }
                },
               "string_filter_rules":
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
                 },
             'method': options.algo
             }
 
     print classifier.set_config(config)
     
     print classifier.get_config()
 
     print classifier.get_status()
 
     for line in open('train.dat'):
         label, file = line[:-1].split(',')
         dat = open(file).read()
         classifier.train(
             [( label ,  ([["message", dat]], ) ,)]
         )
         print classifier.get_status()
 
     print classifier.save("tutorial")
 
     print classifier.load("tutorial")
 
     print classifier.set_config(config)
 
     print classifier.get_config()
 
     for line in open('test.dat'):
         label, file = line[:-1].split(',')
         dat = open(file).read()        
         ans = classifier.classify(
             [([["message", dat]], )]
            )
 #        print ans
         if ans != None:
             estm = get_most_likely(ans[0])
             if (label == estm[0]):
                 result = "OK"
             else:
                 result = "NG"
             print result + "," + label + ", " + estm[0] + ", " + str(estm[1])




``train.dat``, ``test.dat`` というファイルを作り、

::

  ラベル名,ファイルパス

と各行に書き込み、次のようにして利用します。

::

   $ python tutorial.py -s localhost:9199 -n tutorial2

ソースコードや設定ファイルは、

::

   $ git clone git://github.com/jubatus/jubatus-tutorial-python.git

から入手することが出来ます。


以上で、下記の構成でJubatusを実行しました。

.. figure:: _static/single_single.png
   :width: 70 %
   :alt: single client, single server



.. _multiprocess:

Setup Jubatus Server with multiple processes
--------------------------------------------

Jubatusでは、Zookeeperを用いて複数のサーバプロセス間を強調させることで、分散処理を行うことが出来ます。

Setup ZooKeeper
~~~~~~~~~~~~~~~

::

    $ cd /path/to/zookeeper
    $ bin/zkServer.sh start
    JMX enabled by default
    Using config: /zookeeper-3.3.3/bin/../conf/zoo.cfg
    Starting zookeeper ...
    STARTED
    ...

以後、zoo.cfgでの指定によりローカルマシンのポート2181で起動していることを想定します。


jubakeeper
~~~~~~~~~~~~~~~~~~~~~~~~
jubakeeperは、Jubatus内でクライアントからサーバ群へアクセスするためのインターフェースとなるプロセスです。
jubakeeperは、ZooKeeperを参照して、クライアントからのリクエストをclassifierへ仲介します。


::

    $ jubakeeper --zookeeper=localhost:2181 --rpc-port=9198

これにより、jubakeeperは、9198ポートでRPCを待ち受けます。
jubakeeperを介した場合、起動しているサーバを意識することなくスケールアウトするように実装されています。


Running two processes as one classifier instance
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

3並列でクライアントからのリクエストを受け付けたい場合は、jubaclassifierを3つ起動します。
``--name`` で同じ名前を指定することにより、3つのプロセスがひとつのインスタンスとして強調動作します。
同じマシン内で複数プロセスを起動する場合は、プロセスごとにポートを変えなければならないことに注意してください。

::

    $ jubaclassifier --rpc-port=9180 --name=tutorial2 --zookeeper=localhost:2181 --storage=local_mixture &
    $ jubaclassifier --rpc-port=9181 --name=tutorial2 --zookeeper=localhost:2181 --storage=local_mixture &
    $ jubaclassifier --rpc-port=9182 --name=tutorial2 --zookeeper=localhost:2181 --storage=local_mixture &

zookeeperのクライアントを用いて、たしかに二つのサーバプロセスが起動していることを確認することも出来ます。

::

    $ cd /path/to/zookeeper
    $ bin/zkCli.sh -server localhost:2181
    [zk: localhost:2181(CONNECTED) 0] ls /jubatus/actors/tutorial2/nodes 
    [XXX.XXX.XXX.XXX_9180, XXX.XXX.XXX.XXX__9181, XXX.XXX.XXX.XXX__9182]



以上で、下記の構成でJubatusを実行しました。

.. figure:: _static/single_multi.png
   :width: 70 %
   :alt: single client, multi servers




Setup Jubatus in cluster
------------------------

.. 複数台のマシンにログインしてJubatusを起動して設定していくのは、大変面倒です。

Jubatusは各種プロセスを一括管理するための仕組みを備えています。

今、それぞれのサーバに対して、以下の表に対応したプロセスを起動させることを考えます。


=============  ==================
IP address     processes
=============  ==================
192.168.0.1    操作端末
192.168.0.10   classifier - 1
192.168.0.20   classifier - 2
192.168.0.30   classifier - 3
192.168.0.100  jubakeeper/zookeeper - 1
192.168.0.200  jubakeeper/zookeeper - 2
=============  ==================

::

    [192.168.0.100]$ bin/zkServer.sh start
    [192.168.0.200]$ bin/zkServer.sh start

zookeeperをそれぞれで立ち上げます。zoo.confには二台で構成する設定を書いてください。
そして、クライアントから利用するためにjubakeeperを用意しておきます。jubakeeperはデフォルトで9198番ポートを利用します。

::

    [192.168.0.100]$ jubakeeper --zookeeper=192.168.0.100:2181,192.168.0.200:2181 -d
    [192.168.0.200]$ jubakeeper --zookeeper=192.168.0.100:2181,192.168.0.200:2181 -d



Jubavisor(Process Management with zookeeper)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

jubavisorは、マシンごとに一プロセスずつ存在するagentで、Jubatusctrlからの司令を受けて同サーバ内のプロセスを管理します。
このプロセスは、予めマシンごとに起動しておく必要があります。jubavisorはデフォルトで9199番ポートを利用します。


::

    [192.168.0.10 ]$ jubavisor -z 192.168.0.100:2181,192.168.0.200:2181 -d
    [192.168.0.20 ]$ jubavisor -z 192.168.0.100:2181,192.168.0.200:2181 -d
    [192.168.0.30 ]$ jubavisor -z 192.168.0.100:2181,192.168.0.200:2181 -d


jubavisorは、一台のサーバ内の複数プロセスのポートを調整して指定されたプロセスを指定された名前空間で起動し、zookeeperに登録します。
ここまで出来れば、後は操作端末から、自由にプロセスを管理することが出来ます。
Let's provisioning!!


::

    [192.168.0.1  ]$ jubactl -c start --type=classifier --name=tutorial2 -z 192.168.0.100:2181,192.168.0.200:2181
    [192.168.0.1  ]$ jubactl --name=tutorial2 --zookeeper=192.168.0.100:2181,192.168.0.200:2181 --type=classifier -c status
    active jubakeeper members:
     192.168.0.100_9198
     192.168.0.200_9198
    active jubavisor members:
     192.168.0.10_9199
     192.168.0.20_9199
     192.168.0.30_9199
    active tutorial2 members:
     192.168.0.10_9180
     192.168.0.20_9180
     192.168.0.30_9180

::

    [192.168.0.1  ]$ jubactl -c stop --type=classifier --name=tutorial2 -z 192.168.0.100:2181,192.168.0.200:2181
    



Client for multi process Jubatus Server
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

最後に、複数クライアント、複数サーバ環境でtutorialを実行しましょう。

=============  ==================
IP address     processes
=============  ==================
192.168.0.1    操作端末
192.168.0.2    client - 1
192.168.0.3    client - 2
192.168.0.3    client - 3
192.168.0.10   classifier - 1
192.168.0.20   classifier - 2
192.168.0.30   classifier - 3
192.168.0.100  jubakeeper/zookeeper - 1
192.168.0.200  jubakeeper/zookeeper - 2
=============  ==================


::

    [192.168.0.1  ]$ jubactl -c start --type=classifier --name=tutorial3 -z 192.168.0.100:2181,192.168.0.200:2181
    [192.168.0.2  ]$ python tutorial.py --name=tutorial3 -s 192.168.0.100:9198,192.168.0.200:9198
    [192.168.0.3  ]$ python tutorial.py --name=tutorial3 -s 192.168.0.100:9198,192.168.0.200:9198


以上で、下記の構成でJubatusを実行しました。

.. figure:: _static/multi_multi.png
   :width: 70 %
   :alt: multi clients, multi servers


以上でチュートリアルは終わりです。
