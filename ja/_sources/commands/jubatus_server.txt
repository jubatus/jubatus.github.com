Jubatus サーバ
==============

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubaclassifier [options ...]
  jubaanomaly [options ...]
  ...

Description
--------------------------------------------------

Jubatus サーバは機械学習の機能を提供する。

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` はデフォルト値を意味する。
* ``<zookeeper_list>`` は ZooKeeper サーバの ``ホスト:ポート`` をカンマで区切ったものである (例: ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``)。
  値の中にスペースを含めることはできない。
  ZooKeeper が 1 台のみの構成の場合は、カンマを含めず単に ``ホスト:ポート`` を指定する (例: ``10.0.0.1:2181``)。

.. program:: jubatus_server

.. option:: -p <port>, --rpc-port <port>

   RPC リクエストを受け付けるポート番号。 [9199]

.. option:: -b <address>, --listen_addr <address>

   RPC リクエストを受け付ける IPv4 アドレス。

   指定されていない場合、すべての IPv4 アドレス上でリクエストを受け付ける。

.. option:: -B <interface>, --listen_if <interface>

   RPC リクエストを受け付けるネットワークインターフェース。

   指定されていない場合、すべてのネットワークインターフェース上でリクエストを受け付ける。

   ``--listen_addr`` と併用することはできない (同時に指定された場合は、このオプションは無視される)。

.. option:: -c <num>, --thread <num>

   RPC リクエストを受け付けるスレッド数。 [2]

.. option:: -t <seconds>, --timeout <seconds>

   RPC セッションのタイムアウト時間 (秒)。 [10]

   ``0`` はタイムアウトを無効にすることを示す。

.. option:: -d <dirpath>, --datadir <dirpath>

   ``save``/``load`` RPC リクエストを受信したときに学習モデルを保存/復元するディレクトリ。 [/tmp]

.. option:: -l <dirpath>, --logdir <dirpath>

   ZooKeeper のログファイルを出力するディレクトリ。

   指定されていない場合、ログは標準エラーに出力される。

.. option:: -g <log_config>, --log_config <log_config>

   ログの出力設定を log4cxx 設定ファイル (XML) で指定する。

   指定されていない場合、ログは標準出力に出力される。

.. option:: -f <config>, --configpath <config>

   サーバの設定ファイルへのパスを指定する。

   ``--zookeeper`` を指定しない (スタンドアローンモードで動作させる) 場合のみ、このオプションを使用する必要がある。

.. option:: -m <model>, --model_file <model>

   サーバ起動時に読み込むモデルファイルへのパスを指定する。

.. option:: -D, --daemon

   デーモンモードで起動する (コンソールから切り離す)。

.. option:: -T, --config_test

   設定ファイルの内容の妥当性を確認して、すぐに終了する。

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   ZooKeeper サーバの一覧。

   指定されていない場合、Jubatus サーバはスタンドアローンモードで動作する。

.. option:: -n <name>, --name <name>

   インスタンス名 (タスクを識別する ZooKeeper クラスタ内でユニークな名前)。

   ``--zookeeper`` が指定されている場合のみ、このオプションを指定する必要がある。

   ``<name>`` には、ZooKeeper のノード名として使用できない文字 (``/`` など) を使用することはできない。

.. option:: -x <mixer>, --mixer <mixer>

   MIX ノードの選択に使用する MIX 戦略を指定する。 [linear_mixer]

   ``linear_mixer``, ``random_mixer``, ``broadcast_mixer``, ``skip_mixer`` のいずれかが指定できる。
   エンジンによって、使用可能な MIX 戦略は異なる。

.. option:: -s <seconds>, --interval_sec <seconds>

   毎 ``<seconds>`` 秒おきに mix を行う。 [16]

   ``0`` を指定すると、時間契機での mix の起動を行わない。

.. option:: -i <count>, --interval_count <count>

   毎 ``<count>`` 更新ごとに mix を行う。 [512]

   更新カウントは、学習モデルを更新する API (分類器の ``train`` など) を呼ぶたびにインクリメントされる。

   ``0`` を指定すると、更新契機での mix の起動を行わない。

.. option:: -Z <seconds>, --zookeeper_timeout <seconds>

   ZooKeeper と Jubatus サーバ間のセッションのタイムアウト時間 (秒)。 [10]

.. option:: -I <seconds>, --interconnect_timeout <seconds>

   Jubatus サーバ間で利用する RPC リクエストのタイムアウト時間 (秒)。 [10]

.. option:: -v, --version

   Jubatus サーバのバージョンを表示する。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。
