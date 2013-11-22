Commands
========

* ``[]`` はデフォルト値を意味する。
* ``<zookeeper_list>`` は ZooKeeper サーバの ``ホスト:ポート`` をカンマで区切ったものである (例: ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``)。
  値の中にスペースを含めることはできない。
  ZooKeeper が 1 台のみの構成の場合は、カンマを含めず単に ``ホスト:ポート`` を指定する (例: ``10.0.0.1:2181``)。

Jubatus サーバ
---------------

Jubatus サーバは機械学習の機能を提供する。

.. program:: server

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

   ログファイルを出力するディレクトリ。

   指定されていない場合、ログは標準エラーに出力される。

.. option:: -e <level>, --loglevel <level>

   出力するログの下限を指定する。 [0]

   INFO, WARNING, ERROR, FATAL はそれぞれ 0, 1, 2, 3 に相当する。

.. option:: -f <config>, --configpath <config>

   サーバの設定ファイルへのパスを指定する。

   ``--zookeeper`` を指定しない (スタンドアローンモードで動作させる) 場合のみ、このオプションを使用する必要がある。

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   ZooKeeper サーバの一覧。

   指定されていない場合、Jubatus サーバはスタンドアローンモードで動作する。

.. option:: -m <model>, --model_file <model>

   サーバ起動時に読み込むモデルファイルへのパスを指定する。

.. option:: -n <name>, --name <name>

   インスタンス名 (タスクを識別する ZooKeeper クラスタ内でユニークな名前)。

   ``--zookeeper`` が指定されている場合のみ、このオプションを指定する必要がある。

   ``<name>`` には、ZooKeeper のノード名として使用できない文字 (``/`` など) を使用することはできない。

.. option:: -x <mixer>, --mixer <mixer>

   MIX ノードの選択に使用する MIX 戦略を指定する。 [linear_mixer]

   ``linear_mixer``, ``random_mixer``, ``broadcast_mixer``, ``skip_mixer`` のいずれかが指定できる。
   エンジンによって、使用可能な MIX 戦略は異なる。

.. option:: -j, --join

   既存のクラスタに参加する。

   新しいプロセスは、このオプションを指定してクラスタに参加しなければ機械学習が動作しない。

   このオプションは現在実装されていない。

.. option:: -s <seconds>, --interval_sec <seconds>

   毎 ``<seconds>`` 秒おきに mix を行う。 [16]

.. option:: -i <count>, --interval_count <count>

   毎 ``<count>`` 更新ごとに mix を行う。 [512]

   更新カウントは、学習モデルを更新する API (分類器の ``train`` など) を呼ぶたびにインクリメントされる。

.. option:: -Z <seconds>, --zookeeper_timeout <seconds>

   ZooKeeper と Jubatus サーバ間のセッションのタイムアウト時間 (秒)。 [10]

.. option:: -I <seconds>, --interconnect_timeout <seconds>

   Jubatus サーバ間で利用する RPC リクエストのタイムアウト時間 (秒)。 [10]

.. option:: -v, --version

   Jubatus サーバのバージョンを表示する。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。

分散環境
-----------------------

Jubatus Proxy
~~~~~~~~~~~~~

Jubatus Proxy は、分散環境においてクライアントからのリクエストをサーバ間で分散する。

.. program:: proxy

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

   RPC リクエストを受け付けるスレッド数。 [16]

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

   ログファイルを出力するディレクトリ。

   指定されていない場合、ログは標準エラーに出力される。

.. option:: -e <level>, --loglevel <level>

   出力するログの下限を指定する。 [0]

   INFO, WARNING, ERROR, FATAL はそれぞれ 0, 1, 2, 3 に相当する。

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

jubavisor
~~~~~~~~~

``jubavisor`` は ``jubactl`` から操作するデーモンプロセスである。

.. program:: jubavisor

.. option:: -p <port>, --rpc-port <port>

   RPC リクエストを受け付けるポート番号。 [9198]

.. option:: -t <seconds>, --timeout <seconds>

   RPC セッションのタイムアウト時間 (秒)。 [10]

.. option:: -l <dirpath>, --logdir <dirpath>

   ログファイルを出力するディレクトリ。

   指定されていない場合、ログは標準エラーに出力される。

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   ZooKeeper サーバの一覧。

.. option:: -d, --daemon

   プロセスをデーモンとして動作させる。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。

jubactl
~~~~~~~

``jubactl`` は分散環境においてサーバプロセスの管理を行うコマンドである。

.. program:: jubactl

.. option:: -c <command>, --cmd <command>

   ZooKeeper に登録されている jubavisor に指定したコマンドを送信する。
   ``<command>`` の値は以下のいずれかを指定する。

   ========= =====================================================================================
   コマンド  説明
   ========= =====================================================================================
   start     Jubatus サーバを起動する
   stop      Jubatus サーバを停止する
   save      :option:`server -d` で指定されたディレクトリに学習モデルを保存する
   load      :option:`server -d` で指定されたディレクトリから学習モデルを復元する
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

   サーバプロセスの開始時のオプションを指定する (:option:`server -B`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -C <num>, --thread <num>

   サーバプロセスの開始時のオプションを指定する (:option:`server -c`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -T <seconds>, --timeout <seconds>

   サーバプロセスの開始時のオプションを指定する (:option:`server -t`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -D <dirpath>, --datadir <dirpath>

   サーバプロセスの開始時のオプションを指定する (:option:`server -d`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -L <dirpath>, --logdir <dirpath>

   サーバプロセスの開始時のオプションを指定する (:option:`server -l`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -E <level>, --loglevel <level>

   サーバプロセスの開始時のオプションを指定する (:option:`server -e`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -X, --mixer

   サーバプロセスの開始時のオプションを指定する (:option:`server -x`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -J, --join

   サーバプロセスの開始時のオプションを指定する (:option:`server -j`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -S <seconds>, --interval_sec <seconds>

   サーバプロセスの開始時のオプションを指定する (:option:`server -s`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -I <count>, --interval_count <count>

   サーバプロセスの開始時のオプションを指定する (:option:`server -i`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -Z <seconds>, --zookeeper_timeout <seconds>

   サーバプロセスの開始時のオプションを指定する (:option:`server -Z`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -R <seconds>, --interconnect_timeout <seconds>

   サーバプロセスの開始時のオプションを指定する (:option:`server -I`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -d, --debug

   デバッグモードで実行する。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。

jubaconfig
~~~~~~~~~~

``jubaconfig`` は分散環境において、ZooKeeper に配置される Jubatus サーバの設定ファイルを管理するためのコマンドである。

.. program:: jubaconfig

.. option:: -c <command>, --cmd <command>

   実行したい操作を指定する。
   ``<command>`` の値は以下のいずれかを指定する。

   ========= =====================================================================================
   コマンド  説明
   ========= =====================================================================================
   write     ローカルファイルシステム上の設定ファイルを ZooKeeper 上に登録する
   read      ZooKeeper 上に登録された設定ファイルの内容を表示する
   delete    ZooKeeper 上に登録された設定ファイルを削除する
   list      ZooKeeper 上に登録された設定ファイルの一覧を表示する
   ========= =====================================================================================

.. option:: -f <file>, --file <file>

   ZooKeeper に登録する設定ファイルのパスを指定する。

   ``--cmd write`` を指定した場合のみ有効である。

.. option:: -t <type>, --type <type>

   サーバプログラムの種類 (例: ``classifier``, ``recommender``, ...)。

   ``--cmd write``, ``--cmd read``, ``--cmd delete`` のいずれかを指定した場合のみ有効である。

.. option:: -n <name>, --name <name>

   インスタンス名 (タスクを識別する ZooKeeper クラスタ内でユニークな名前)。

   ``--cmd write``, ``--cmd read``, ``--cmd delete`` のいずれかを指定した場合のみ有効である。

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   ZooKeeper サーバの一覧。

   指定されない場合は、環境変数 ``ZK`` が使用される。

.. option:: -d, --debug

   デバッグモードで実行する。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。

ユーティリティ
---------------

.. _jubaconv:

jubaconv
~~~~~~~~

``jubaconv`` は fv_converter の設定をテストするためのツールである。

``jubaconv`` は fv_converter 内部の動作をシミュレーションし、変換結果をコマンドラインで表示することができる。

利用例を以下に示す:

.. code-block:: none

   $ cat data.json
   { "message": "hello world", "age": 31 }

   $ jubaconv -i json -o fv -c /opt/jubatus/share/jubatus/example/config/classifier/pa.json < data.json
   /message$hello world@str#bin/bin: 1
   /age@num: 31

   $ cat datum.json
   {
     "string_values": {
       "hello": "world"
     },
     "num_values": {
       "age": 31
     }
   }

   $ jubaconv -i datum -o fv -c /opt/jubatus/share/jubatus/example/config/classifier/pa.json < datum.json
   hello$world@str#bin/bin: 1
   age@num: 31

.. program:: jubaconv

.. option:: -i <format>, --input-format <format>

   入力のフォーマット。 [json]

   ``<format>`` には ``json`` または ``datum`` のいずれかを指定する。

.. option:: -o <format>, --output-format <format>

   出力のフォーマット。 [fv]

   ``<format>`` には ``json``, ``datum`` または ``fv`` のいずれかを指定する。

.. option:: -c <config>, --conf <config>

   JSON で記述された Jubatus サーバの設定ファイル (:doc:`fv_convert` を参照)。

   :option:`-o` に ``fv`` が指定されている場合のみ、このオプションを指定する必要がある。

.. _jenerator:

jenerator
~~~~~~~~~

``jenerator`` は拡張 MessagePack-IDL ファイルから、Proxy の実装、サーバのテンプレート、C++ クライアントを生成する。詳細は :doc:`server` を参照すること。

``jenerator`` はデフォルトではインストールされない (ソースの ``tools/jenerator`` ディレクトリを参照)。

.. code-block:: none

  $ jenerator -l <lang> [options ...] <idl-file> ...

.. program:: jenerator

.. option:: -l <lang>

   生成するクライアントコードの言語。現在は ``cpp``, ``java``, ``python``, ``ruby`` がサポートされている。
   サーバ/Proxy を生成したい場合は ``server`` を指定する。

.. option:: -o <dirpath>

   生成されたソースファイルを出力するディレクトリ。

   指定されない場合は、カレントディレクトリが使用される。

.. option:: -i

   ``#include`` 命令に相対パスを使用する。

   C++ コード (サーバ/Proxy/C++ クライアント) を生成する場合のみ有効である。
   このオプションは Jubatus 開発者による利用を想定している。
   生成されたコードを Jubatus のソースツリー内でビルドする場合を除き、指定する必要はない。

.. option:: -n <namespace>

   生成されたソースで指定された名前空間を宣言する。

.. option:: -t

   サーバのテンプレートを生成する。

   サーバ/Proxy を生成する場合のみ有効である。

.. option:: -g <guard>

   ヘッダファイルに使用するインクルードガードのプレフィックスを指定する。

   C++ コード (サーバ/Proxy/C++ クライアント) を生成する場合のみ有効である。

.. option:: -help, --help

   このコマンドの簡単な使い方を表示する。
