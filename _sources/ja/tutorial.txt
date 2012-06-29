Tutorial
========



Overview and Scenario
----------------------
This tutorial uses `News20(20news-bydate.tar.gz) <http://people.csail.mit.edu/jrennie/20Newsgroups/>`_ data set which is a popular for experiments in text classiication.　News20 has 20 different newsgroups and they post thier message on a suitable newsgroup.News20 is divided into learning data (20news-bydate-train, 80%) and experimental data (20news-bydata-test, 20%).The goal of this tutorial is to learn model from 20news-bydate-train and to guess the newsgroup to post 20news-bydate-test.


Prequisites
~~~~~~~~~~~

This tutorial requires following softwares installed:

- Linux 2.6 +
- gcc 4.0 +
- pkg-config
- python 2.7+ and `msgpack-python <http://pypi.python.org/pypi/msgpack-python/>`_
- `libmsgpack <http://msgpack.org>`_
- `pficommon <http://github.com/pfi/pficommon>`_ - must be configured with msgpack enabled.
- `libevent 2.0.X <http://libevent.org/>`_ 
- `re2 <http://code.google.com/p/re2/>`_
- `google-glog <http://code.google.com/p/google-glog/>`_
- `ux-trie <http://code.google.com/p/ux-trie/>`_ / `MeCab <http://mecab.sourceforge.net/>`_ (optional)
- `ZooKeeper <http://zookeeper.apache.org/>`_ server and C client (optional, for multiple processes)

`These scripts <https://github.com/odasatoshi/jubatus-installer>`_ maybe the help your installation.

Setup a single process Jubatus Server
-----------------------------------------

In this section, We show how to install the Jubatus.

building and installing Jubatus
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You need to install the above library dependencies before building and installing jubatus.

::

  $ git clone git://github.com:jubatus/jubatus.git
  $ cd jubatus
  $ ./waf configure
  $ ./waf build
  # ./waf install
  $ jubaclassifier --name tutorial
  jubaclassifier I0514 07:45:30.165102 30546 server_util.cpp:84] starting jubaclassifier0.2.2 RPC server at 10.0.2.15:9199 with timeout: 10


Setup and starting a single process jubatus has been completed.

``--name`` option is a string value to uniquely identifies a task in zookeeper quorum. 

Jubatus listens on port 9199 as MessagePack RPC server by default.
If other services uses the same port, Please use another ports using rcp-port option.
If you want to listen RPC port at 9181, 

::

  $ jubaclassifier --rpc-port=9181 --name=tutorial


installing Python client for Jubatus
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Python client of Jubatus requires `msgpack-python <http://pypi.python.org/pypi/msgpack-python/>`_.
"pip" command will resolve this dependencies automatically.

::

  $ pip install jubatus
  $ pip install msgpack-rpc-python

.. TODO: check "Expert Python Programming" and do in a pythonic way

Quick Start
----------------------------------

::

  $ git clone git://github.com/jubatus/jubatus-tutorial-python.git
  $ cd jubatus-tutorial-python
  $ wget http://people.csail.mit.edu/jrennie/20Newsgroups/20news-bydate.tar.gz
  $ tar -xvzf 20news-bydate.tar.gz
  $ python tutorial.py

.. Jubatus communicates with its clients in `MessagePack-RPC <http://msgpack.org>`_ protocol.


Prepairing dataset
~~~~~~~~~~~~~~~~~~


Expanding 20news-bydate.tar.gz, 

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

"49960" is a file name and "alt.atheism" is a newsgroup name.
For example, "20news-bydate-train/rec.motorcycles/104435" contains

 
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

Jubatus uses this text as the training data


Set configure
~~~~~~~~~~~~~
You can change a behavior of jubaclassifier using method and converter options. Prototype of these options are as follows.

.. code-block:: python

 config = jubatus.classifier.types.config_data(algorithm, converter)
 converter = jubatus.classifier.types.converter_config(str_fil_types,
                                                       str_fil_rules,
                                                       num_fil_types, 
                                                       num_fil_rules,
                                                       str_type,
                                                       str_rules,
                                                       num_type,
                                                       num_rules)

You can choose one of the following algorithm as ``'method'`` 

- ``perceptron``
- ``PA``, ``PA1``, ``PA2``
- ``CW``
- ``AROW``
- ``NHERD``

Now, we choose ``PA`` .

``'converter'`` decides how to convert feature vector from input data.

In this tutorial, input data is the text of natural language.
Many languages ​​such as English, <space>　and <Return> can be split into words. Jubatus supports this feature such as standard.
HTML tags are noisy to classify the contents so we will remove the part that is enclosed in "<>".

こういった自然言語処理、与えられた値の重み付けなど、様々なルール付けを行うことが出来ます。
今回のルールをPythonオブジェクトで表現すると、以下のようになります。

.. code-block:: python

    str_fil_types = {"detag": {"method": "regexp", "pattern": "<[^>]*>", "replace": "" }}
    str_fil_rules = [types.filter_rule("message", "detag", "-detagged")]
    num_fil_types = {}
    num_fil_rules = []
    str_type= {}
    str_rules = [types.string_rule("message-detagged","space","bin","bin")]
    num_type = {}
    num_rules = []

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


以上で、下記の構成でJubatusを実行しました。

.. figure:: ../_static/single_single.png
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

.. figure:: ../_static/single_multi.png
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

In last section, 
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
192.168.0.100  jubaclassifier_keeper/zookeeper - 1
192.168.0.200  jubaclassifier_keeper/zookeeper - 2
=============  ==================


::

    [192.168.0.1  ]$ jubactl -c start --type=classifier --name=tutorial3 -z 192.168.0.100:2181,192.168.0.200:2181
    [192.168.0.2  ]$ python tutorial.py --name=tutorial3 -s 192.168.0.100:9198,192.168.0.200:9198
    [192.168.0.3  ]$ python tutorial.py --name=tutorial3 -s 192.168.0.100:9198,192.168.0.200:9198


Jubatus is available in the following configuration by the above command.

.. figure:: ../_static/multi_multi.png
   :width: 70 %
   :alt: multi clients, multi servers


Jubatus tutorial is now complete.
