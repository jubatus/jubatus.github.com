
Common structs and interfaces
-----------------------------

以下の構造体と共通APIは、classifier, regression, recommender, graphで有効です。
statは共通APIのうちsave, load, get_statusのみサポートしています。

jubatus::converter_config
~~~~~~~~~~~~~~~~~~~~~~~~~

.. describe:: jubatus::converter_config

.. code-block:: c++

   type  param_t = map<string, string>

   message converter_config {
     0: map<string, param_t> string_filter_types

     1: list<filter_rule> string_filter_rules

     2: map<string, param_t> num_filter_types

     3: list<filter_rule> num_filter_rules

     4: map<string, param_t> string_types

     5: list<string_rule> string_rules

     6: map<string, param_t> num_types

     7: list<num_rule> num_rules
   }

converter_configの詳細は、 :ref:`conversion` を参照してください。

common methods
--------------

.. describe:: bool save(0: string name, 1: string id)

 - Parameters:

  - ``name`` : タスクを識別するユニークな名前
  - ``id`` : 保存されるファイル名

 - Returns:

  - すべてのサーバで保存が成功したらTrue

 **すべて** のサーバで学習モデルをローカルディスクに保存する。


.. describe:: bool load(0: string name, 1: string id)

 - Parameters:

  - ``name`` : タスクを識別するユニークな名前
  - ``id`` : 読み出すファイル名

 - Returns:

  - すべてのサーバで読みだした成功したらTrue

 **すべて** のサーバで学習モデルをローカルディスクから読み出す。

.. describe:: bool set_config(0: string name, 1: config_data c)

 - Parameters:

  - ``name`` : タスクを識別するユニークな名前
  - ``c`` : config_data

**すべての** サーバのconfigを更新する。

.. describe:: config_data get_config(0: string name)

 - Parameters:

  - ``name`` : タスクを識別するユニークな名前

 - Returns:

  - config_data

ランダムに選んだサーバのconfigを取得する。

.. describe:: map<string, map<string, string > > get_status(string name)

 - Parameters:

  - ``name`` : タスクを識別するユニークな名前

 - Returns:

  - それぞれのサーバの内部状態.

**すべての** サーバの内部状態を取得する。サーバはホスト名、ポート番号で識別する。

