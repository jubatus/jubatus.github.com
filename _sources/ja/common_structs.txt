Common Data Structures and Methods
----------------------------------

以下のデータ構造とメソッドは各サーバで利用可能である。
ただし、Graph では ``get_config`` と ``set_config`` は利用できない。

Data Structures
~~~~~~~~~~~~~~~

.. describe:: datum

 Jubatus で機械学習の対象となるデータを表す。
 詳細は :doc:`fv_convert` を参照すること。

.. code-block:: c++

   message datum {
     0: list<tuple<string, string> > string_values
     1: list<tuple<string, double> > num_values
   }

Methods
~~~~~~~

各メソッドの最初のパラメタ ``name`` は、タスクを識別する ZooKeeper クラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. describe:: bool save(0: string name, 1: string id)

 - 引数:

  - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
  - ``id`` : 保存されるファイル名

 - 戻り値:

  - すべてのサーバで保存が成功したらTrue

 **すべて** のサーバで学習モデルをローカルディスクに保存する。

.. describe:: bool load(0: string name, 1: string id)

 - 引数:

  - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
  - ``id`` : 読み出すファイル名

 - 戻り値:

  - すべてのサーバで読み出しに成功したらTrue

 **すべて** のサーバで、保存された学習モデルをローカルディスクから読み出す。

.. describe:: bool set_config(0: string name, 1: config_data c)

 - 引数:

  - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
  - ``c`` : 設定データ

 - 戻り値:

  - すべてのサーバで設定に成功したらTrue

 **すべての** サーバの設定を更新する。
 ``config_data`` の定義については、各サービスの API リファレンスを参照のこと。

.. describe:: config_data get_config(0: string name)

 - 引数:

  - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前

 - 戻り値:

  - ``set_config`` で設定した設定情報

 サーバの設定を取得する。
 ``config_data`` の定義については、各サービスの API リファレンスを参照のこと。

.. describe:: map<string, map<string, string > > get_status(string name)

 - 引数:

  - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前

 - 戻り値:

  - それぞれのサーバの内部状態。最上位の map のキーは ``ホスト名_ポート番号`` 形式である。

 **すべての** サーバの内部状態を取得する。
 サーバはホスト名、ポート番号で識別する。
