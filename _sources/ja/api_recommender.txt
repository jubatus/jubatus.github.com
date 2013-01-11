Recommender
-----------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/recommender.idl>`_ を参照してください。
* 使用されているアルゴリズムの詳細については :doc:`method` を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである

.. describe:: method

   レコメンドに使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ==================== ===================================
      設定値               手法
      ==================== ===================================
      ``"inverted_index"`` 転置インデックスを利用する。
      ``"minhash"``        MinHash を利用する。 [Li10]_
      ``"lsh"``            Locality Sensitive Hashing を利用する。
      ``"euclid_lsh"``     Euclid 距離版の LSH を利用する。 [Andoni06]_
      ==================== ===================================


.. describe:: parameter

   アルゴリズムに渡すパラーメータを指定する。
   ``method`` に応じて渡すパラメータは異なる。

   inverted_index:
     なし
   
   minhash
     :hash_num:
        ハッシュの個数を指定する。
        大きくすると正確な値に近づく代わりに、多くのメモリを消費する。
        (Integer)

   lsh
     :bit_num:
        ハッシュ値のビット数を指定する。
        大きくすると正確な値に近づく代わりに、多くのメモリを消費する。
        (Integer)

   euclid_lsh
     :lsh_num:
        ハッシュの数を指定する。
        大きくすると正確な値に近づく代わりに、再現率が低下し、また多くのメモリを消費する。
        (Integer)
     :table_num:
        テーブルの数を指定する。
        大きくすると再現率が向上する代わりに、多くのメモリを消費し、レスポンスに時間がかかる。
        (Integer)
     :bin_width:
        量子化幅を指定する。
        大きくすると再現率が向上する代わりに、レスポンスに時間がかかる。
        (Float)
     :probe_num:
        探索するビンの数を指定する。
        大きくすると再現率が向上する代わりに、レスポンスに時間がかかる。
        (Integer)
     :seed:
        内部で利用している乱数のシードを指定する。
        (Integer)
     :retain_projection:
        ``true`` ならハッシュに利用する射影ベクトルをキャッシュする。
        レスポンス時間が低下する代わりに、メモリを消費する。
        (Boolean)


.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "method": "inverted_index"
       "converter" : {
         "string_filter_types": {},
         "string_filter_rules":[],
         "num_filter_types": {},
         "num_filter_rules": [],
         "string_types": {},
         "string_rules":[
           {"key" : "*", "type" : "str", "sample_weight":"bin", "global_weight" : "bin"}
         ],
         "num_types": {},
         "num_rules": [
           {"key" : "*", "type" : "num"}
         ]
       },
     }


Data Structures
~~~~~~~~~~~~~~~

.. describe:: similar_result

   近傍性の結果を表す。
   string と float のタプルのリストである。
   string の値は行 ID であり、float の値はその ID に対応する近傍性である。
   近傍性の値が大きいほど、よりお互いの近傍性が高いことを意味する。

   .. code-block:: c++

      type similar_result = list<tuple<string, float> >


Methods
~~~~~~~

各メソッドの最初のパラメタ ``name`` は、タスクを識別する ZooKeeper クラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. function:: bool clear_row(0: string name, 1: string id)

   引数
     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``id`` : 削除する行 ID

   戻り値
     - 行の削除に成功した場合 True 

   ``id`` で指定される行を推薦テーブルから削除する。 

.. describe:: bool update_row(0: string name, 1: string id, 2: datum row)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``id`` : 行 ID 
     - ``row`` : datum

   - 戻り値:

     - モデルの更新に成功した場合 True

   行 ID ``id`` のデータを ``row`` を利用して更新する。
   同じ ``id`` を持つ行が既に存在する場合は、その行が ``row`` で差分更新される。
   存在しない場合は、新しい行のエントリが作成される。
   更新操作を受け付けたサーバが当該行を持つサーバーと同一であれば、操作は即次反映される。
   異なるサーバーであれば、mix 後に反映される。


.. describe:: bool clear(0: string name)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
 
   - 戻り値:

     - モデルの削除に成功した場合 True
 
   モデルを完全に消去する。


.. describe:: datum complete_row_from_id(0: string name, 1: string id)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``id`` : 行 ID

   - 戻り値:

     - ``id`` の近傍から未定義の値を補完したdatum 

   行 ``id`` の中で欠けている値を近傍から予測し、補完された datum を返す。

.. describe:: datum complete_row_from_datum(0: string name, 1: datum row)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``row`` : 補完したい値が欠けたdatum

   - 戻り値:

     - 指定したdatumで構成されるrowの中で欠けている値を補完したdatum

   指定した datum ``row`` で欠けている値を近傍から予測し、補完された datum を返す。


.. describe:: similar_result similar_row_from_id(0: string name, 1: string id, 2: uint size)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``id`` : 推薦テーブル内の行を表すID
     - ``size`` : 返す近傍の数

   - 戻り値:

     - ``id`` で指定した近傍のidとその近傍性の値のリスト

   指定した行 ``id`` に近い行とその近傍性のリストを (最大で) ``size`` 個返す。


.. describe:: similar_result similar_row_from_datum(0: string name, 1: datum row, 2: uint size)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``row`` : 補完したいdatum
     - ``ret_num`` : 返す近傍の数

   - 戻り値:

     - ``row`` から構成された ``similar_result``

   指定したdatum ``data`` に近い行とその近傍性のリストを ``size`` 個返す。


.. describe:: datum decode_row(0: string name, 1: string id)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``id`` : 推薦テーブル内の行を表すID

   - 戻り値:

     - 行 ID ``id`` に対応する datum

   行 ``id`` の ``datum`` 表現を返す。
   ただし、fv_converterで不可逆な処理を行なっている ``datum`` は復元されない。


.. describe:: list<string> get_all_rows(0:string name)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前

   - 戻り値:

     - すべての行の ID リスト

   すべての行の ID リストを返す。


.. describe:: float calc_similarity(0: string name, 1: datum lhs, 2:datum rhs)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``lhs`` : datum
     - ``rhs`` : 別の datum

   - 戻り値:

     - ``lhs`` と ``rhs`` の類似度

   指定した 2 つの datum の類似度を返す。


.. describe:: float calc_l2norm(0: string name, 1: datum row)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``row`` : datum

   - 戻り値:

     - ``row`` の L2 ノルム
 
   指定した datum ``row`` の L2 ノルムを返す。
