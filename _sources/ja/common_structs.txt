
Common Data Structures and Methods
----------------------------------

以下のデータ構造とメソッドは各サーバで利用できます。
ただし、 ``graph`` では ``get_config`` と ``set_config`` は利用できません。


Datum
~~~~~

.. describe:: jubatus::datum

 Jubatus で機械学習の対象となるデータを表すクラス。詳細は :doc:`fv_convert` を参照してください。

.. code-block:: c++

   message datum {
     0: list<tuple<string, string> > string_values
     1: list<tuple<string, double> > num_values
   }


Methods
~~~~~~~

.. describe:: bool save(0: string name, 1: string id)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``id`` : 保存されるファイル名

 - 戻り値:

  - すべてのサーバで保存が成功したらTrue

 **すべて** のサーバで学習モデルをローカルディスクに保存する。


.. describe:: bool load(0: string name, 1: string id)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``id`` : 読み出すファイル名

 - 戻り値:

  - すべてのサーバで読み出しに成功したらTrue

 **すべて** のサーバで、保存された学習モデルをローカルディスクから読み出す。


.. describe:: bool set_config(0: string name, 1: config_data c)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``c`` : config_data

 - 戻り値:

  - すべてのサーバで設定に成功したらTrue

 **すべての** サーバの設定を更新する。


.. describe:: config_data get_config(0: string name)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前

 - 戻り値:

  - ``set_config`` で設定した設定情報

 ランダムに選んだサーバの設定を取得する。


.. describe:: map<string, map<string, string > > get_status(string name)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前

 - 戻り値:

  - それぞれのサーバの内部状態。最上位の map のキーは ``ホスト名_ポート番号`` 形式である。

 **すべての** サーバの内部状態を取得する。サーバはホスト名、ポート番号で識別する。

