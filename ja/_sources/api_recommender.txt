Recommender
-----------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/recommender.idl>`_ を参照してください。
* 使用されているアルゴリズムの詳細については :doc:`method` を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: method

   レコメンドに使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ======================= ===================================
      設定値                  手法
      ======================= ===================================
      ``"inverted_index"``    転置インデックスを利用する。
      ``"minhash"``           MinHash を利用する。 [Ping2010]_
      ``"lsh"``               Locality Sensitive Hashing を利用する。
      ``"euclid_lsh"``        Euclid 距離版の LSH を利用する。 [Andoni2005]_
      ``"nearest_neighbor:*`` ``nearest_neighbor`` 実装を利用する。 ``*`` に近傍探索のアルゴリズム名を入れる。
      ======================= ===================================


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
     :hash_num:
        ハッシュ値のビット数を指定する。
        大きくすると正確な値に近づく代わりに、多くのメモリを消費する。
        (Integer)

   euclid_lsh
     :hash_num:
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

   nearest_neighbor:*
      ``*`` に入れた近傍探索器のパラメータを記述する。
      詳細は :doc:`api_nearest_neighbor` を参照。


.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "method": "lsh",
       "parameter" : {
         "hash_num" : 64
       },
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
       }
     }


Data Structures
~~~~~~~~~~~~~~~

.. mpidl:message:: id_with_score

   スコア付きのデータIDを表す。 

   .. mpidl:member:: 0: string id

      データのIDを表す。

   .. mpidl:member:: 1: float score

      IDに対して紐付かれた近傍性のスコアを表す。
      近傍性の値が大きいほど、よりお互いの近傍性が高いことを意味する。

   .. code-block:: c++

      message id_with_score {
        0: string id
        1: float score
      }


Methods
~~~~~~~

各メソッドの最初のパラメタ ``name`` は、タスクを識別する ZooKeeper クラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. mpidl:service:: recommender

   .. mpidl:method:: bool clear_row(0: string id)

      :param id:   削除する行 ID
      :return:     行の削除に成功した場合 True

      ``id`` で指定される行を推薦テーブルから削除する。


   .. mpidl:method:: bool update_row(0: string id, 1: datum row)

      :param id:   行 ID
      :param row:  行に対応する :mpidl:type:`datum`
      :return:     モデルの更新に成功した場合 True

      行 ID ``id`` のデータを ``row`` を利用して更新する。
      同じ ``id`` を持つ行が既に存在する場合は、その行が ``row`` で差分更新される。
      存在しない場合は、新しい行のエントリが作成される。
      更新操作を受け付けたサーバが当該行を持つサーバーと同一であれば、操作は即次反映される。
      異なるサーバーであれば、mix 後に反映される。

   .. mpidl:method:: datum complete_row_from_id(0: string id)

      :param id:   行 ID
      :return:     ``id`` の近傍から未定義の値を補完した :mpidl:type:`datum`

      行 ``id`` の中で欠けている値を近傍から予測し、補完された :mpidl:type:`datum` を返す。

   .. mpidl:method:: datum complete_row_from_datum(0: datum row)

      :param row:  補完したい値が欠けた :mpidl:type:`datum`
      :return:     指定した :mpidl:type:`datum` で構成される row の中で欠けている値を補完した :mpidl:type:`datum`

      指定した ``row`` で欠けている値を近傍から予測し、補完された :mpidl:type:`datum` を返す。

   .. mpidl:method:: list<id_with_score> similar_row_from_id(0: string id, 1: uint size)

      :param id:   推薦テーブル内の行を表すID
      :param size: 返す近傍の数
      :return:     ``id`` で指定した近傍のidとその近傍性の値のリスト

      指定した行 ``id`` に近い行とその近傍性のリストを (最大で) ``size`` 個返す。

   .. mpidl:method:: list<id_with_score> similar_row_from_datum(0: datum row, 1: uint size)

      :param row:  補完したい :mpidl:type:`datum`
      :param size: 返す近傍の数
      :return:     ``row`` から構成された ``similar_result``

      指定した ``row`` に近い :mpidl:type:`datum` を持つ行とその近傍性のリストを (最大で) ``size`` 個返す。

   .. mpidl:method:: datum decode_row(0: string id)

      :param id:   推薦テーブル内の行を表すID
      :return:     行 ID ``id`` に対応する :mpidl:type:`datum`

      行 ``id`` の :mpidl:type:`datum` を返す。
      ただし、fv_converterで不可逆な処理を行なっている :mpidl:type:`datum` は復元されない。

   .. mpidl:method:: list<string> get_all_rows()

      :return:     すべての行の ID リスト

      すべての行の ID リストを返す。

   .. mpidl:method:: float calc_similarity(0: datum lhs, 1:datum rhs)

      :param lhs:  :mpidl:type:`datum`
      :param rhs:  別の :mpidl:type:`datum`
      :return:     ``lhs`` と ``rhs`` の類似度

      指定した 2 つの :mpidl:type:`datum` の類似度を返す。

   .. mpidl:method:: float calc_l2norm(0: datum row)

      :param row:  :mpidl:type:`datum`
      :return:     ``row`` の L2 ノルム

      指定した ``row`` の L2 ノルムを返す。
