Command Lines
=============

Process composition
----------------------------
jubatusは、クライアントサーバ型のプロセス構成をしている。
最も基本的な構成は、single client process and single server process like following figure.

.. figure:: ../_static/single_single.png
   :width: 70 %
   :alt: single client, single server




jubatusは、処理をスケールアウトさせるために、複数のサーバプロセスを利用することが可能である。
クライアントは、あたかも1台のサーバに対してjubakeeperに対してクエリーを投げることで、
複数のサーバプロセスで分散して学習・分類を行うことが出来る。
jubakeeperはZooKeeperを利用して、死活監視及び、負荷分散を行っている。


.. figure:: ../_static/single_multi.png
   :width: 70 %
   :alt: single client, multi servers



jubatusは、データ量が膨大である、データソースが離れているなどの理由でクライアントも分散させることが可能である。
この際、クライアントごとに複数のjubakeeperを指定することが出来る。

.. figure:: ../_static/multi_multi.png
   :width: 70 %
   :alt: multi clients, multi servers



online machine learning algorithms
---------------------------------------

jubaclassifier
~~~~~~~~~~~~~~~~~~~

.. program:: jubaclassifier, jubarecommender, jubastat, jubaregression

.. option:: -p, --rpc-port

   RPC用の待受ポート番号([= 9198])
  
.. option:: -c, --thread

   RPCが同時に処理するスレッド数([= 2])

.. option::  -t, --timeout

   RPCのsession timeout秒([= 10])

.. option::  -z, --zookeeper

   zookeeperのサーバ、ポートを指定。オプションを指定しない場合は、standaloneで動作する。 ``--storage`` オプションにlocal以外を指定した場合は必須。
   書式は、 ``ipaddress:port,hostname:port,...`` の形式に従うこと。スペースを間にはさんではいけない。

.. option::  -n, --name

   ``--zookeeper`` で指定した ZooKeeper クラスタ内でユニークなインスタンス名。
   ``--storage`` でlocal_mixtureを指定した場合、 ``--name`` で指定したnameが同じインスタンス同士がパラメタをmixする。
   '/' 等、znodeに利用できない文字を含んではならない。

.. option::  -d, --tmpdir([=/tmp])

   ``save`` APIを発行されたときに、学習モデルを保管する場所。
   ``load`` APIを発行されたときには、この場所から学習モデルをロードする。デフォルトは ``/tmp`` である。

.. option::  -j, --join

   Join to the existing clister. New processes should not join to the existing cluster without specifying this option otherwise the machine learning won't work.

.. option:: -s, --interval_sec([=16])

   Interval time of one of ''mix'' trigger in seconds.

.. option:: -i, --interval_count([=512])

   Another ''mix'' trigger: By default, in each 512 update requests (in single server) mix is tried to be invoked.

.. option::  -?, --help

    オプションの一覧を表示
    
process management
---------------------

jubavisor
~~~~~~~~~

(TODO: update to the latest spec.) jubactlから指示を受けつけて、jubaclassifierを適切な場所で適切なオプションで起動する。

.. program:: jubavisor

.. option:: -p, --rpc-port

   RPC用の待受ポート番号([= 9198])

.. option::  -z, --zookeeper

   zookeeperのサーバ、ポートを指定。オプションを指定しない場合は、standaloneで動作する。 ``--storage`` オプションにlocal以外を指定した場合は必須。
   書式は、 ``ipaddress:port,hostname:port,...`` の形式に従うこと。スペースを間にはさんではいけない。


Jubatus Keepers
~~~~~~~~~~~~~~~


.. program:: jubaclassifier_keeper, jubaregression_keeper, jubastat_keeper, jubarecommender_keeper

.. option:: -p, --rpc-port

   RPC用の待受ポート番号([= 9198])

.. option:: -c, --thread([=16])

   Number of threads that accepts requests from clients.

.. option::  -z, --zookeeper

   zookeeperのサーバ、ポートを指定。オプションを指定しない場合は、standaloneで動作する。 ``--storage`` オプションにlocal以外を指定した場合は必須。
   書式は、 ``ipaddress:port,hostname:port,...`` の形式に従うこと。スペースを間にはさんではいけない。


jubactl
~~~~~~~~~

(TODO: update to latest) jubavisorに指示を送る。

.. program:: jubactl

.. option::  -c, --cmd

   zookeeperに登録されているjubavisorに対して

   ======== ==================================================================================================
   start    jubaclassifier --name={name} --storage={storage} --zookeeper={zookeeper}を{num}個起動する。
   stop     jubaclassifier を停止する。
   save     --tmpdirで指定したローカルディレクトリにバイナリ形式で学習済みのモデルを保存
   load     --tmpdirで指定したローカルディレクトリから学習済みのモデルをロードする
   status   nameで指定したclassifierに関係するノードを表示する
   ======== ==================================================================================================

.. option::  -t, --type

   supported only "classifier".

.. option::  -n, --name

   ``--zookeeper`` で指定した ZooKeeper クラスタ内でユニークなインスタンス名。
   ``--storage`` でlocal_mixtureを指定した場合、 ``--name`` で指定したnameが同じインスタンス同士がパラメタをmixする。
   '/' 等、znodeに利用できない文字を含んではならない。

.. option::  -s, --storage

   学習モデルをどこで保持するか

   =================== ======================================================================
   local               スタンドアローンでの動作
   local_mixture       複数サーバーでのClassifierの協調動作
   =================== ======================================================================


.. option::  -z, --zookeeper

   zookeeperのサーバ、ポートを指定。オプションを指定しない場合は、standaloneで動作する。 ``--storage`` オプションにlocal以外を指定した場合は必須。
   書式は、 ``ipaddress:port,hostname:port,...`` の形式に従うこと。スペースを間にはさんではいけない。

.. option::  -N, --num

    cmdにstart以外が指定されている場合は、無視される。
    0を指定すると、serverの台数分だけサーバを立ち上げる。


.. option::  -?, --help
         print this message


<FIXME: "semimaster" in figure: semimaster=jubakeeper>
management process で利用されるプログラムの使い方手順をまとめます。

.. figure:: ../_static/processes.png
   :width: 90 %
   :alt: relationship of processes

   figure: relationship of processes 


debug tools
-------------

jubaconv
~~~~~~~~~~~
指定した形式のデータを指定した形式の出力に変換するデバッグツール。
fv_converter内部で行われていることをコンソールで実施する。
converter_configが意図したとおりに動作しているかどうかを確認するのに使う。

.. program:: jubaconv

.. option::  -i (json/datum)

    入力形式を指定。

.. option::  -o (json/datum/fv)

    出力形式を指定。指定したところまで処理を行う。

.. option::  -c converter_config

    converter_configを指定。


