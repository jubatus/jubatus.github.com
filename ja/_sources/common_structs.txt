データ構造と共通メソッド
----------------------------------

以下のデータ構造とメソッドは各サーバで利用可能である。

データ構造
~~~~~~~~~~~~~~~

.. mpidl:message:: datum

   Jubatus で機械学習の対象となるデータを表す。
   詳細は :doc:`fv_convert` を参照すること。

   datumは以下の様なインターフェースを通して、内部情報の更新を行う。

   .. mpidl:method:: datum add_string(0: string key, 1: string value)

      :param key: 追加するデータのキーを指定する。"$" 記号を含めることはできない。
      :param value: 追加するデータの値を指定する。
      :return:     自分自身に対する参照を返す。

      文字列データの追加を行う。

   .. mpidl:method:: datum add_number(0: string key, 1: double value)

      :param key: 追加するデータのキーを指定する。
      :param value: 追加するデータの値を指定する。
      :return:     自分自身に対する参照を返す。

      数値データの追加を行う。

   .. mpidl:method:: datum add_binary(0: string key, 1: raw value)

      :param key: 追加するデータのキーを指定する。
      :param value: 追加するデータの値を指定する。
      :return:     自分自身に対する参照を返す。

      バイナリデータの追加を行う。

   なお、datumの内部表現は以下のようになっている。

   .. mpidl:member:: 0: list<tuple<string, string> > string_values

      文字列で表現される入力データである。
      データのキーと値のペアの集合として表現される。
      キーの名前に "$" 記号を含めることはできない。

   .. mpidl:member:: 1: list<tuple<string, double> > num_values

      数値で表現される入力データである。
      データのキーと値のペアの集合として表現される。

   .. mpidl:member:: 2: list<tuple<string, raw> > binary_values

      バイナリデータで表現される入力データである。
      データのキーと値のペアの集合として表現される。

   .. code-block:: c++

      message datum {
        0: list<tuple<string, string> > string_values
        1: list<tuple<string, double> > num_values
        2: list<tuple<string, raw> > binary_values
      }


Constructor
~~~~~~~~~~~

.. describe:: constructor(string host, int port, string name, int timeout_sec)

   新しい RPC クライアントのインスタンスを作成する。
   ``name`` には、タスクを識別する ZooKeeper クラスタ内でユニークな名前である。
   スタンドアロン構成では、空文字列 (``""``) を指定する。
   ``timeout_sec`` には RPC メソッドの実行からレスポンスまでのタイムアウト時間を指定する。

   コンストラクタの利用方法を以下に示す:

.. code-block:: cpp

   // C++
   #include <jubatus/client.hpp>
   using jubatus::classifier::client::classifier;
   // ...
   classifier client("localhost", 9199, "cluster", 10);

.. code-block:: python

   # Python
   from jubatus.classifier.client import Classifier
   # ...
   client = Classifier("localhost", 9199, "cluster", 10);

.. code-block:: ruby

   // Ruby
   require 'jubatus/classifier/client'
   include Jubatus::Classifier::Client
   // ...
   client = Classifier.new("localhost", 9199, "cluster", 10)

.. code-block:: java

   // Java
   import us.jubat.classifier.ClassifierClient;
   // ...
   ClassifierClient client = new ClassifierClient("localhost", 9199, "cluster", 10);


Methods
~~~~~~~

.. mpidl:method:: bool save(0: string id)

   :param name: タスクを識別する ZooKeeper クラスタ内でユニークな名前
   :param id:   保存されるファイル名
   :return:     すべてのサーバで保存が成功したらTrue

   **すべて** のサーバで学習モデルをローカルディスクに保存する。

.. mpidl:method:: bool load(0: string id)

   :param name: タスクを識別する ZooKeeper クラスタ内でユニークな名前
   :param id:   読み出すファイル名
   :return:     すべてのサーバで読み出しに成功したらTrue

   **すべて** のサーバで、保存された学習モデルをローカルディスクから読み出す。

.. mpidl:method:: bool clear()

   :param name: タスクを識別する ZooKeeper クラスタ内でユニークな名前
   :return:     モデルの削除に成功した場合 True

   **すべて** のサーバで、モデルを完全に消去する。

.. mpidl:method:: string get_config()

   :param name: タスクを識別する ZooKeeper クラスタ内でユニークな名前
   :return:     初期化時に設定した設定情報

   サーバの設定を取得する。
   取得される設定情報内容については、各サービスの API リファレンスを参照のこと。

.. mpidl:method:: map<string, map<string, string> > get_status()

   :param name: タスクを識別する ZooKeeper クラスタ内でユニークな名前
   :return:     それぞれのサーバの内部状態。最上位の map のキーは ``ホスト名_ポート番号`` 形式である。

   **すべての** サーバの内部状態を取得する。
   サーバはホスト名、ポート番号で識別する。

.. mpidl:method:: mprpc_client get_client()

   :return: MessagePack-RPC クライアントインスタンス

   Jubatus クライアントライブラリが利用している内部の MessagePack-RPC クライアントインスタンスに対する参照を返却する。
   これは RPC メソッドではない。

   このメソッドは、主に TCP 接続を明示的に切断したり、タイムアウトを変更したりするために使用する。

   ``mprpc_client`` は MessagePack-RPC クライアントの型で、言語により異なる (`C++ <http://ci.jubat.us/job/msgpack-rpc/doxygen/classmsgpack_1_1rpc_1_1client.html>`_ / `Python <https://github.com/msgpack/msgpack-rpc-python/blob/master/msgpackrpc/client.py>`_ / `Ruby <http://msgpack.org/rpc/rdoc/current/MessagePack/RPC/Client.html>`_ / `Java <http://msgpack.org/rpc/javadoc/current/org/msgpack/rpc/Client.html>`_)。
