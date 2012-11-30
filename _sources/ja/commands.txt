Commands
========

``[]`` はデフォルト値を意味する。

Jubatus Servers
---------------

.. program:: server

.. option:: -p <port>, --rpc-port <port>

   RPC リクエストを受け付けるポート番号。 [9199]

.. option:: -c <num>, --thread <num>

   RPC リクエストを受け付けるスレッド数。 [2]

.. option:: -t <seconds>, --timeout <seconds>

   RPC セッションのタイムアウト時間 (秒)。 [10]

.. option:: -d <dirpath>, --tmpdir <dirpath>

   ``save``/``load`` RPC リクエストを受信したときに学習モデルを保存/復元するディレクトリ。 [/tmp]

.. option:: -l <dirpath>, --logdir <dirpath>

   ログファイルを出力するディレクトリ。

   指定されていない場合、ログは標準エラーに出力される。

.. option:: -z <list>, --zookeeper <list>

   ZooKeeper サーバの一覧。

   指定されていない場合、Jubatus サーバはスタンドアローンモードで動作する。

   ``<list>`` は ZooKeeper サーバの ``ホスト:ポート`` をカンマで区切ったものである (例: ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``)。
   ZooKeeper が 1 台のみの構成の場合は、カンマを含めず単に ``ホスト:ポート`` を指定する (例: ``10.0.0.1:2181``)。

   値の中にスペースを含めることはできない。

.. option:: -n <name>, --name <name>

   インスタンス名 (タスクを識別する ZooKeeper クラスタ内でユニークな名前)。

   ``--zookeeper`` が指定されている場合のみ、このオプションを指定する必要がある。

   ``<name>`` には、ZooKeeper のノード名として使用できない文字 (``/`` など) を使用することはできない。

.. option:: -j, --join

   既存のクラスタに参加する。

   新しいプロセスは、このオプションを指定してクラスタに参加しなければ機械学習が動作しない。

   このオプションは現在実装されていない。

.. option:: -s <seconds>, --interval_sec <seconds>

   毎 ``<seconds>`` 秒おきに mix を行う。 [16]

.. option:: -i <count>, --interval_count <count>

   毎 ``<count>`` 更新ごとに mix を行う。 [512]

   更新カウンタは、学習モデルを更新する API (分類器の ``train`` など) を呼ぶたびにインクリメントされる。

.. option:: -v, --version

   Jubatus サーバのバージョンを表示する。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。

Cluster Management
------------------

Jubatus Keepers
~~~~~~~~~~~~~~~

.. program:: keeper

.. option:: -p <port>, --rpc-port <port>

   RPC リクエストを受け付けるポート番号。 [9199]

.. option:: -c <num>, --thread <num>

   RPC リクエストを受け付けるスレッド数。 [16]

.. option:: -t <seconds>, --timeout <seconds>

   RPC セッションのタイムアウト時間 (秒)。 [10]

.. option:: -l <dirpath>, --logdir <dirpath>

   ログファイルを出力するディレクトリ。

   指定されていない場合、ログは標準エラーに出力される。

.. option:: -z <list>, --zookeeper <list>

   ZooKeeper サーバの一覧。

   ``<list>`` は ZooKeeper サーバの ``ホスト:ポート`` をカンマで区切ったものである (例: ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``)。
   ZooKeeper が 1 台のみの構成の場合は、カンマを含めず単に ``ホスト:ポート`` を指定する (例: ``10.0.0.1:2181``)。

   値の中にスペースを含めることはできない。

.. option:: -v, --version

   Jubatus Keeper のバージョンを表示する。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。

jubavisor
~~~~~~~~~

.. program:: jubavisor

.. option:: -p <port>, --rpc-port <port>

   RPC リクエストを受け付けるポート番号。 [9198]

.. option:: -t <seconds>, --timeout <seconds>

   RPC セッションのタイムアウト時間 (秒)。 [10]

.. option:: -l <dirpath>, --logdir <dirpath>

   ログファイルを出力するディレクトリ。

   指定されていない場合、ログは標準エラーに出力される。

.. option:: -z <list>, --zookeeper <list>

   ZooKeeper サーバの一覧。

   ``<list>`` は ZooKeeper サーバの ``ホスト:ポート`` をカンマで区切ったものである (例: ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``)。
   ZooKeeper が 1 台のみの構成の場合は、カンマを含めず単に ``ホスト:ポート`` を指定する (例: ``10.0.0.1:2181``)。

   値の中にスペースを含めることはできない。

.. option:: -d, --daemon

   プロセスをデーモンとして動作させる。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。

jubactl
~~~~~~~

.. program:: jubactl

.. option:: -c <command>, --cmd <command>

   ZooKeeper に登録されている jubavisor に指定したコマンドを送信する。
   ``<command>`` の値は以下のいずれかを指定する。

   ========= =====================================================================================
   コマンド  説明
   ========= =====================================================================================
   start     Jubatus サーバを起動する
   stop      Jubatus サーバを停止する
   save      :option:`server -t` で指定されたディレクトリに学習モデルを保存する
   load      :option:`server -t` で指定されたディレクトリから学習モデルを復元する
   status    サーバ、Keeper および jubavisor の状態を表示する
   ========= =====================================================================================

.. option:: -s <program>, --server <program>

   サーバプログラムの実行ファイル (例: ``jubaclassifier``, ``jubarecommender``, ...)。

.. option:: -n <name>, --name <name>

   インスタンス名 (タスクを識別する ZooKeeper クラスタ内でユニークな名前)。

.. option:: -t <type>, --type <type>

   サーバプログラムの種類 (例: ``classifier``, ``recommender``, ...).

.. option:: -N <num>, --num <num>

   クラスタ内のプロセス数。

   ``--cmd start`` を指定した場合のみ有効である。

   ``0`` が指定された場合、各 jubavisor ごとに 1 プロセスが起動される。

.. option:: -z <list>, --zookeeper <list>

   ZooKeeper サーバの一覧。

   指定されない場合は、環境変数 ``ZK`` が使用される。

   ``<list>`` は ZooKeeper サーバの ``ホスト:ポート`` をカンマで区切ったものである (例: ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``)。
   ZooKeeper が 1 台のみの構成の場合は、カンマを含めず単に ``ホスト:ポート`` を指定する (例: ``10.0.0.1:2181``)。

   値の中にスペースを含めることはできない。

.. option:: -C <num>, --thread <num>

   サーバプロセスの開始時のオプションを指定する (:option:`server -c`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -T <seconds>, --timeout <seconds>

   サーバプロセスの開始時のオプションを指定する (:option:`server -t`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -D <dirpath>, --tmpdir <dirpath>

   サーバプロセスの開始時のオプションを指定する (:option:`server -d`).

   ``--cmd start`` を指定した場合のみ有効である。

.. option:: -L <dirpath>, --logdir <dirpath>

   サーバプロセスの開始時のオプションを指定する (:option:`server -l`).

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

.. option:: -d, --debug

   デバッグモードで実行する。

.. option:: -?, --help

   このコマンドの簡単な使い方を表示する。

Utilities
---------

.. _jubaconv-ja:

jubaconv
~~~~~~~~

``jubaconv`` は fv_converter の設定をテストするためのツールである。

``jubaconv`` は fv_converter 内部の動作をシミュレーションし、変換結果をコマンドラインで表示することができる。

.. program:: jubaconv

.. option:: -i <format>, --input-format <format>

   入力のフォーマット。 [json]
   ``<format>`` には ``json`` または ``datum`` のいずれかを指定する。

.. option:: -o <format>, --output-format <format>

   出力のフォーマット。 [fv]
   ``<format>`` には ``json``, ``datum`` または ``fv`` のいずれかを指定する。

.. option:: -c <config>, --conf <config>

   JSON で記述された fv_converter の設定ファイル (see :doc:`fv_convert`)。

.. _jenerator-ja:

jenerator
~~~~~~~~~

``jenerator`` は拡張 MessagePack-IDL ファイルから、Keeper とサーバのスケルトン (C++ source) を生成する。

``jenerator`` はデフォルトではインストールされない (ソースの ``src/tools/generator`` ディレクトリを参照)。

.. code-block:: none

  $ jenerator <idl-file> [options...]

.. program:: jenerator

.. option:: -o <dirpath>

   生成されたソースファイルを出力するディレクトリ。

.. option:: -i

   ``#include`` 命令に相対パスを使用する。

   このオプションは Jubatus 開発者による利用を想定しているため、多くの場合、指定する必要はない。

.. option:: -n <namespace>

   生成されたソースで指定された名前空間を宣言する。

.. option:: -t

   サーバのテンプレートを生成する。

.. option:: -d

   デバッグモードで実行する。

.. option:: -help, --help

   このコマンドの簡単な使い方を表示する。
