Jubatus プロキシ
================

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubaclassifier_proxy -z <zookeeper_list> [options ...]
  jubaanomaly_proxy -z <zookeeper_list> [options ...]
  ...

Description
--------------------------------------------------

Jubatus Proxy は、分散環境においてクライアントからのリクエストをサーバ間で分散する。

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` はデフォルト値を意味する。
* ``<zookeeper_list>`` は ZooKeeper サーバの ``ホスト:ポート`` をカンマで区切ったものである (例: ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``)。
  値の中にスペースを含めることはできない。
  ZooKeeper が 1 台のみの構成の場合は、カンマを含めず単に ``ホスト:ポート`` を指定する (例: ``10.0.0.1:2181``)。

.. program:: jubatus_proxy

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

   RPC リクエストを受け付けるスレッド数。 [4]

.. option:: -t <seconds>, --timeout <seconds>

   RPC セッションのタイムアウト時間 (秒)。 [10]

   ``0`` はタイムアウトを無効にすることを示す。

.. option:: -Z <seconds>, --zookeeper_timeout <seconds>

   ZooKeeper と Jubatus Proxy 間のセッションのタイムアウト時間 (秒)。 [10]

.. option:: -I <seconds>, --interconnect_timeout <seconds>

   Jubatus Proxy と Jubatus サーバ間の RPC リクエストのタイムアウト時間 (秒)。 [10]

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   ZooKeeper サーバの一覧。

.. option:: -l <dirpath>, --logdir <dirpath>

   ZooKeeper のログファイルを出力するディレクトリ。

   指定されていない場合、ログは標準エラーに出力される。

.. option:: -g <log_config>, --log_config <log_config>

   ログの出力設定を log4cxx 設定ファイル (XML) で指定する。

   指定されていない場合、ログは標準出力に出力される。

.. option:: -E <seconds>, --pool_expire <seconds>

   セッション・プールのタイムアウト時間 (秒)。 [60]

   ``0`` はセッションが 1秒以上 利用されなければ、破棄することを示す。

.. option:: -S <num>, --pool_size <num>

   スレッドごとに保持するセッション・プールの最大数。 [0]

   ``0`` は制限を設定しないことを示す。

.. option:: -v, --version

   Jubatus Proxy のバージョンを表示する。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。
