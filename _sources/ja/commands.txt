Commands
========

Jubatus Servers
---------------

.. program:: Jubatus Servers

.. option:: -p, --rpc-port

   RPC用の待受ポート番号([= 9199])

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

.. option::  -l, --logdir

   ログファイルの出力場所。
   指定しない場合は、標準エラーに出力される。

.. option::  -j, --join

   Join to the existing clister. New processes should not join to the existing cluster without specifying this option otherwise the machine learning won't work.

.. option:: -s, --interval_sec([=16])

   Interval time of one of ''mix'' trigger in seconds.

.. option:: -i, --interval_count([=512])

   Another ''mix'' trigger: By default, in each 512 update requests (in single server) mix is tried to be invoked.

.. option::  -?, --help

    オプションの一覧を表示


Jubatus Keepers
---------------

.. program:: Jubatus Keepers

.. option:: -p, --rpc-port

   RPC用の待受ポート番号([= 9199])

.. option:: -c, --thread([=16])

   Number of threads that accepts requests from clients.

.. option::  -z, --zookeeper

   zookeeperのサーバ、ポートを指定。オプションを指定しない場合は、standaloneで動作する。 ``--storage`` オプションにlocal以外を指定した場合は必須。
   書式は、 ``ipaddress:port,hostname:port,...`` の形式に従うこと。スペースを間にはさんではいけない。

.. option::  -l, --logdir

   ログファイルの出力場所。
   指定しない場合は、標準エラーに出力される。

Cluster Management
------------------

jubavisor
~~~~~~~~~

(TODO: update to the latest spec.)
jubactlから指示を受けつけて、jubaclassifierを適切な場所で適切なオプションで起動する。

.. program:: jubavisor

.. option:: -p, --rpc-port

   RPC用の待受ポート番号([= 9198])

.. option::  -z, --zookeeper

   zookeeperのサーバ、ポートを指定。オプションを指定しない場合は、standaloneで動作する。 ``--storage`` オプションにlocal以外を指定した場合は必須。
   書式は、 ``ipaddress:port,hostname:port,...`` の形式に従うこと。スペースを間にはさんではいけない。

jubactl
~~~~~~~

(TODO: update to latest)
jubavisorに指示を送る。

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


Tools
-----

jubaconv
~~~~~~~~

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

.. _jenerator-ja:

jenerator
~~~~~~~~~

jenerator is a converter to create a jubakeeper and basic server template from extended msgpack-idl format. jenerator takes first argument as an IDL filename to process, rest is for options.

.. program:: jenerator <filename>

.. option:: -t

    Generates server template.

.. option:: -i

    Generates the code as internal library to merged in Jubatus repository.
    If the generated code is separated from Jubatus repository and assumed
    Jubatus is installed, or you don't know well, *DO NOT* use this option.

.. option:: -o path

    (*NOT IMPLEMENTED*) Directory to output the generate source code files.
