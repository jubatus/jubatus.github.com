Recommender
-----------

詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/recommender.idl>`_ を参照してください。

Data Structures
~~~~~~~~~~~~~~~

.. describe:: config_data

 サーバの設定を表す。
 ``method`` は推薦に使用するアルゴリズムである。
 現在、 ``inverted_index``, ``minhash`` または ``lsh`` のいずれかが指定可能である。
 ``converter`` は :doc:`fv_convert` で説明されている JSON 形式の文字列である。

.. code-block:: c++

   message config_data {
     0: string method
     1: string converter
   }

.. describe:: similar_result

 近傍性の結果を表す。
 string と float のタプルのリストである。
 string の値は行 ID であり、float の値はその ID に対応する近傍性である。
 近傍性の値が大きいほど、よりお互いの近傍性が高いことを意味する。

.. code-block:: c++

   type similar_result = list<tuple<string, float> >

Methods
~~~~~~~

.. describe:: bool clear_row(string name, string id)

 - 引数:

  - ``name`` : タスクを識別するクラスタ内でユニークな名前
  - ``id`` : 削除する行 ID

 - 戻り値:

  - 行の削除に成功した場合 True 

 ``id`` で指定される行を推薦テーブルから削除する。 

.. describe:: bool update_row(string name, string id, datum d)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``id`` : 行 ID 
  - ``d`` : datum

 - 戻り値:

  - モデルの更新に成功した場合 True

 行 ID ``id`` のデータを ``d`` を利用して差分更新する。
 同じ ``id`` を持つ行が既に存在する場合は、 ``d`` で上書きされる。
 存在しない場合は、新しい行のエントリが作成される。
 更新操作を受け付けたサーバが当該行を持つサーバーと同一であれば、操作は即次反映される。
 異なるサーバーであれば、MIX 後に反映される。

.. describe:: bool clear(0: string name)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
 
 - 戻り値:

  - モデルの削除に成功した場合 True
 
 モデルを完全に消去する。

.. describe:: datum complete_row_from_id(0: string name, 1: string id)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``id`` : 行 ID

 - 戻り値:

  - ``id`` の近傍から未定義の値を補完したdatum 

 指定したidのrowの中で欠けている値を予測して返す。

.. describe:: datum complete_row_from_data(0: string name, 1: datum dat)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``dat`` : 補完したい値が欠けたdatum

 - 戻り値:

  - 指定したdatumで構成されるrowの中で欠けている値を補完したdatum

 指定したdatumで構成されるrowの中で欠けている値を予測して返す。

.. describe:: similar_result similar_row_from_id(0: string name, 1: string id, 2: uint size)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``id`` : 推薦テーブル内の行を表すID
  - ``size`` : 返す近傍の数

 - 戻り値:

  - ``id`` で指定した近傍のidとその近傍性の値のリスト

 ``similar_result`` で定義された指定したidに近い行とその近傍性のリストを ``size`` 個返す。

.. describe:: similar_result similar_row_from_data(0: string name, 1: datum dat, 2: uint size)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``dat`` : 補完したいdatum
  - ``ret_num`` : 返す近傍の数

 - 戻り値:

  - ``dat`` から構成された ``similar_result`` .

 ``similar_result`` で定義された指定したdatumに近い行とその近傍性のリストを``size``個返す。

.. describe:: datum decode_row(0: string name, 1: string id)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``id`` : 推薦テーブル内の行を表すID

 - 戻り値:

  - 行 ID ``id`` に対応する datum

 ``id`` で指定した行の ``datum`` 表現を返す。
 ただし、fv_converterで不可逆な処理を行なっている ``datum`` は復元されない。

.. describe:: list<string> get_all_rows(0:string name)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``id`` : 行 ID

 - 戻り値:

  - すべての列のリスト

 すべての列のリストを返す。

.. describe:: float similarity(0: string name, 1: datum lhs, 2: datum rhs)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``lhs`` : datum
  - ``rhs`` : 別の datum

 - 戻り値:

  - ``lhs`` と ``rhs`` の近傍性

 指定した2つの datum の近傍性を返す。

.. describe:: float l2norm(0: string name, 1: datum d)

 - 引数:

  - ``name`` : タスクを識別するユニークな名前
  - ``d`` : datum

 - 戻り値:

  - ``d`` の L2 ノルム
 
 指定した ``datum`` の L2 ノルムを返す。
