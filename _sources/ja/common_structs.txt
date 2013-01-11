Common Data Structures and Methods
----------------------------------

以下のデータ構造とメソッドは各サーバで利用可能である。

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


.. describe:: string get_config(0: string name)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前

   - 戻り値:

     - 初期化時に設定した設定情報

   サーバの設定を取得する。
   取得される設定情報内容については、各サービスの API リファレンスを参照のこと。


.. describe:: map<string, map<string, string> >  get_status(0: string name)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前

   - 戻り値:

     - それぞれのサーバの内部状態。最上位の map のキーは ``ホスト名_ポート番号`` 形式である。

   **すべての** サーバの内部状態を取得する。
   サーバはホスト名、ポート番号で識別する。
