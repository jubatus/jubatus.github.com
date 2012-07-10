jubatus::client::recommender
----------------------------

..See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/recommender.idl>`_ for original and detailed spec.
詳細は `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/recommender.idl>`_ を参照してください。


typedef
~~~~~~~

.. describe:: jubatus::recommender::config_data

.. code-block:: c++

   message config_data {

     0: string method
     
     1: converter_config converter;

   }


recommender methods
~~~~~~~~~~~~~~~~~~~

.. describe:: bool clear_row(string name, string id)

- Parameters:

  - ``id`` : 推薦テーブル内の行を表すID

``id`` で指定されるテーブルを削除する。 


.. describe:: bool update_row(string name, string id, datum d)

- Parameters:

  - ``name`` : タスクを識別するユニークな名前
  - ``id`` : 推薦テーブル内の行を表すID
  - ``d`` : datum

- Returns:

  - 更新に成功した場合はTrue

rowデータをdataを利用して差分更新する．同じ特徴番号がある場合は上書き更新する．新しいrow idが指定された場合は，新しいrowエントリを作成する．更新操作は同じサーバーであれば即次反映され，異なるサーバーであれば，mix後に反映される．

.. describe:: bool clear(0: string name)


.. describe:: datum complete_row_from_id(0: string name, 1: string id)

- Parameters:

  - ``id`` : 推薦テーブル内の行を表すID

- Returns:

  - ``id`` の近傍から未定義の値を補完したdatum 

 指定したidのrowの中で欠けている値を予測して返す。

.. describe:: datum complete_row_from_data(0: string name, 1: datum dat)

- Parameters:

  - ``dat`` : 補完したい値が欠けたdatum.

- Returns:

 指定したdatumで構成されるrowの中で欠けている値を予測して返す。

.. describe:: similar_result similar_row_from_id(0: string name, 1: string id, 2: uint size)

- Parameters:

  - ``id`` : 推薦テーブル内の行を表すID
  - ``size`` : 返す近傍の数

- Returns:

  - ``id`` で指定した近傍のidとその近傍性の値のリスト .

``similar_result`` で定義された指定したidに近い行とその近傍性のリストを ``size`` 個返す。

.. describe:: similar_result similar_row_from_data(0: string name, 1: datum dat, 2: uint size)

- Parameters:

  - ``dat`` : 補完したいdatum
  - ``ret_num`` : 返す近傍の数

- Returns:

  - ``dat`` から構成された ``similar_result`` .

``similar_result`` で定義された指定したdatumに近い行とその近傍性のリストを``size``個返す。

.. describe:: datum decode_row(0: string name, 1: string id)

- Parameters:

  - ``id`` : 推薦テーブル内の行を表すID

- Returns:

  - ``id`` で指定した行の ``datum`` 表現を返す。ただし、fv_converterで不可逆な処理を行なっている ``datum`` は復元されない。


.. describe:: list<string> get_all_rows(0:string name)

- Returns:

  - すべての列のリスト

すべての列のリストを返す。

.. describe:: float similarity(0: string name, 1: datum lhs, 2: datum rhs)

指定した2つの ``datum`` の近傍性を返す。

.. describe:: float l2norm(0: string name, 1: datum d)

指定した ``datum`` のL2ノルムを返す。
