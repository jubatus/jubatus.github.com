Command Lines
=============

Process Composition
----------------------------

Jubatus is client-server configuration. The simplest configuration is single client process and single server process like following figure.

.. jubatusは、クライアントサーバ型のプロセス構成をしている。最も基本的な構成は、single client process and single server process like following figure.

.. figure:: ../_static/single_single.png
   :width: 70 %
   :alt: single client, single server



Jubatus can make use of multiple server processes in order to scale out the system.
By throwing queries to jubakeeper, we can execute train/classify with multiple server processes as if clients are interacting with a single server.
jubakeeper does alive monitoring and load balancing with Zookeeper.

.. jubatusは、処理をスケールアウトさせるために、複数のサーバプロセスを利用することが可能である。クライアントは、あたかも1台のサーバに対してjubakeeperに対してクエリーを投げることで、複数のサーバプロセスで分散して学習・分類を行うことが出来る。jubakeeperはZooKeeperを利用して、死活監視及び、負荷分散を行っている。


.. figure:: ../_static/single_multi.png
   :width: 70 %
   :alt: single client, multi servers


Sometimes we want to distribute clients because data size is huge, or source of data is far from server.
Jubatus can achieve this by creating multiple jubakeepers and assigning different jubakeeper to each client.

.. jubatusは、データ量が膨大である、データソースが離れているなどの理由でクライアントも分散させることが可能である。この際、クライアントごとに複数のjubakeeperを指定することが出来る。

.. figure:: ../_static/multi_multi.png
   :width: 70 %
   :alt: multi clients, multi servers



Online Machine Learning Algorithms
---------------------------------------

jubaclassifier
~~~~~~~~~~~~~~~~~~~

.. program:: jubaclassifier, jubarecommender, jubastat, jubaregression

.. option:: -p, --rpc-port

   Port number for RPC([= 9198])
  
.. option:: -c, --thread

   The number of threads RPC can handle similtaneously([= 2])

.. option::  -t, --timeout

   Session timeout of RPC in second([= 10])

.. option::  -z, --zookeeper

   Server and port number of Zookeeper. If this option is not specified, Zookeeper runs standalone mode. This option must be specified unless ``--storage`` option is local.
   Format of this option must be  ``ipaddress:port,hostname:port,...`` . No spaces between values are allowed.

.. option::  -n, --name

   Instance name, which is unique among zookeeper cluster specified with ``--zookeeper`` .
   If local_mixture is specified in ``--storage`` , parameters are mixed among all instances whose names are identical.   
   This option must not contain characters which are not available as znode (such as '/').

.. option::  -d, --tmpdir([=/tmp])

   ``save`` Location where training model is saved when "save" API is published. Default value is ``/tmp`` .
   ``load`` Location from where training model is loaded when "load" API is publised. Default value is ``/tmp`` .

.. option::  -j, --join

   Join to the existing clister. New processes should not join to the existing cluster without specifying this option otherwise the machine learning won't work.

.. option:: -s, --interval_sec([=16])

   Interval time of one of ''mix'' trigger in seconds.

.. option:: -i, --interval_count([=512])

   Another ''mix'' trigger: By default, in each 512 update requests (in single server) mix is tried to be invoked.

.. option::  -?, --help

   Print this message.


Process Management
---------------------

jubavisor
~~~~~~~~~

(TODO: update to the latest spec.)
jubavisor receives the commands from jubactl and start jubaclassifier.

.. program:: jubavisor

.. option:: -p, --rpc-port

   Port number for RPC([= 9198])

.. option::  -z, --zookeeper

   Server and port number of Zookeeper. If this option is not specified, Zookeeper runs standalone mode. This option must be specified unless ``--storage`` option is local.
   Format of this option must be  ``ipaddress:port,hostname:port,...`` . No spaces between values are allowed.


Jubatus Keepers
~~~~~~~~~~~~~~~

.. program:: jubaclassifier_keeper, jubaregression_keeper, jubastat_keeper, jubarecommender_keeper

.. option:: -p, --rpc-port

   Port number for RPC([= 9198])

.. option:: -c, --thread([=16])

   Number of threads that accepts requests from clients.

.. option::  -z, --zookeeper

   Server and port number of Zookeeper. If this option is not specified, Zookeeper runs standalone mode. This option must be specified unless ``--storage`` option is local.
   Format of this option must be  ``ipaddress:port,hostname:port,...`` . No spaces between values are allowed.


jubactl
~~~~~~~~~


(TODO: update to latest)
jubactl sends commands to jubavisor.

.. program:: jubactl

.. option::  -c, --cmd

   Send specified command to registered to Zookeeper. Command should be one of the followings.

   ========= =====================================================================================
   start     start N jubaclassifiers with option --name=NAME --storage=STORAGE --zookeeper=ZOOKEEPER.  N, NAME, STORAGE and ZOOKEEPER are the ones specified with ``--name`` , ``--storage`` , ``--zookeeper`` , and ``--zookeeper`` , respectively. 
   stop      stop jubaclassifier.                                                          
   save      save trained model in binary format to local directory specified ``--tmpdir`` 
   load      load trained model to local directory specified ``--tmpdir``                  
   status    print nodes which are relevant classified specified by name                    
   ========= =====================================================================================


.. option::  -t, --type

   supported only "classifier".

.. option::  -n, --name

   Instance name, which is unique among zookeeper cluster specified with ``--zookeeper`` .
   If local_mixture is specified in ``--storage`` , parameters are mixed among all instances whose names are identical.   
   This option must not contain characters which are not available as znode (such as '/').

.. option::  -s, --storage

   Location where training model is saved.

   =================== ======================================================================
   local               runs in standalone mode
   local_mixture       coordinate performance of Classifiers among multiple servers
   =================== ======================================================================


.. option::  -z, --zookeeper

   Server and port number of Zookeeper. If this option is not specified, Zookeeper runs standalone mode. This option must be specified unless ``--storage`` option is local.
   Format of this option must be  ``ipaddress:port,hostname:port,...`` . No spaces between values are allowed.

.. option::  -N, --num

   Argument used in start command in cmd option. If other command is specified in cmd, this option is ignored.
   If 0 is specified, the number of classifier started is same as the number of servers.

.. option::  -?, --help
   Print this message.


<FIXME: "semimaster" in figure: semimaster=jubakeeper>
The following picture describes how to run programs used by management process.

.. management process で利用されるプログラムの使い方手順をまとめます。

.. figure:: ../_static/processes.png
   :width: 90 %
   :alt: relationship of processes

   figure: relationship of processes 


tools
-----

jubaconv
~~~~~~~~~~~

jubaconv is a debug tool which converts specified data is converted in a scecified format.
It simulates internal behavior of fv_converter in the console.
We can utilize this in order to check if converter_config works correctly.

.. 指定した形式のデータを指定した形式の出力に変換するデバッグツール。fv_converter内部で行われていることをコンソールで実施する。converter_configが意図したとおりに動作しているかどうかを確認するのに使う。

.. program:: jubaconv

.. option::  -i (json/datum)

    Specifies input format.

.. option::  -o (json/datum/fv)

    Specifies output format. Processing is simulated until specified format is obtained.

.. option::  -c converter_config

    Specifies converter_config.


.. _jenerator:

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
