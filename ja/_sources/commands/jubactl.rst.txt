jubactl
=======

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubactl [options ...]

Description
--------------------------------------------------

``jubactl`` は分散環境においてサーバプロセスの管理を行うコマンドである。

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` はデフォルト値を意味する。
* ``<zookeeper_list>`` は ZooKeeper サーバの ``ホスト:ポート`` をカンマで区切ったものである (例: ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``)。
  値の中にスペースを含めることはできない。
  ZooKeeper が 1 台のみの構成の場合は、カンマを含めず単に ``ホスト:ポート`` を指定する (例: ``10.0.0.1:2181``)。

.. program:: jubactl

.. option:: -c <command>, --cmd <command>

   ZooKeeper に登録されている jubavisor に指定したコマンドを送信する。
   ``<command>`` の値は以下のいずれかを指定する。

   ========= =====================================================================================
   コマンド  説明
   ========= =====================================================================================
   start     Jubatus サーバを起動する
   stop      Jubatus サーバを停止する
   save      :option:`jubatus_server -d` で指定されたディレクトリに学習モデルを保存する
   load      :option:`jubatus_server -d` で指定されたディレクトリから学習モデルを復元する
   status    サーバ、Proxy および jubavisor の状態を表示する
   ========= =====================================================================================

.. option:: -s <program>, --server <program>

   サーバプログラムの実行ファイル (例: ``jubaclassifier``, ``jubarecommender``, ...)。

.. option:: -n <name>, --name <name>

   インスタンス名 (タスクを識別する ZooKeeper クラスタ内でユニークな名前)。

.. option:: -t <type>, --type <type>

   サーバプログラムの種類 (例: ``classifier``, ``recommender``, ...)。

.. option:: -N <num>, --num <num>

   クラスタ内のプロセス数。

   ``--cmd start`` を指定した場合のみ有効である。

   ``0`` が指定された場合、各 jubavisor ごとに 1 プロセスが起動される。

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   ZooKeeper サーバの一覧。

   指定されない場合は、環境変数 ``ZK`` が使用される。

.. option:: -i <id>, --id <id>

   学習モデルの保存、復元時に利用するファイル名のID。

   ``--cmd save`` または ``--cmd load`` を指定した場合のみ有効である。

   指定されない場合は、 ``--name`` で指定した値が使用される。

.. option:: -B <interface>, --listen_if <interface>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -B`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -C <num>, --thread <num>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -c`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -T <seconds>, --timeout <seconds>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -t`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -D <dirpath>, --datadir <dirpath>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -d`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -L <dirpath>, --logdir <dirpath>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -l`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -E <log_config>, --log_config <log_config>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -g`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -X <mixer>, --mixer <mixer>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -x`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -S <seconds>, --interval_sec <seconds>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -s`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -I <count>, --interval_count <count>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -i`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -Z <seconds>, --zookeeper_timeout <seconds>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -Z`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -R <seconds>, --interconnect_timeout <seconds>

   サーバプロセスの開始時のオプションを指定する (:option:`jubatus_server -I`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -d, --debug

   このオプションは廃止されたため使用されない。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。
