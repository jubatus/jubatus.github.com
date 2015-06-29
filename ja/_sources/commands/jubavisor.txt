jubavisor
=========

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubavisor [options ...]

Description
--------------------------------------------------

``jubavisor`` は ``jubactl`` から操作するデーモンプロセスである。

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` はデフォルト値を意味する。
* ``<zookeeper_list>`` は ZooKeeper サーバの ``ホスト:ポート`` をカンマで区切ったものである (例: ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``)。
  値の中にスペースを含めることはできない。
  ZooKeeper が 1 台のみの構成の場合は、カンマを含めず単に ``ホスト:ポート`` を指定する (例: ``10.0.0.1:2181``)。

.. program:: jubavisor

.. option:: -p <port>, --rpc-port <port>

   RPC リクエストを受け付けるポート番号。 [9198]

.. option:: -t <seconds>, --timeout <seconds>

   RPC セッションのタイムアウト時間 (秒)。 [10]

.. option:: -l <dirpath>, --logdir <dirpath>

   ZooKeeper のログファイルを出力するディレクトリ。

   指定されていない場合、ログは標準エラーに出力される。

.. option:: -g <log_config>, --log_config <log_config>

   ログの出力設定を log4cxx 設定ファイル (XML) で指定する。

   指定されていない場合、ログは標準出力に出力される。

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   ZooKeeper サーバの一覧。

.. option:: -d, --daemon

   プロセスをデーモンとして動作させる。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。
