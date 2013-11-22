Nearest Neighbor
================

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/nearest_neighbor.idl>`_ を参照してください。
* 使用されているアルゴリズムの詳細については :doc:`method` を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: method

   近傍探索に使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ==================== ===============================================================
      設定値               類似度尺度
      ==================== ===============================================================
      ``"lsh"``            コサイン類似度のLocality Sensitive Hashingを利用する。
      ``"minhash"``        MinHashを利用する。 [Ping2010]_
      ``"euclid_lsh"``     コサイン類似度のLSHを用いてユークリッド距離での近傍探索を行う。
      ==================== ===============================================================


.. describe:: parameter

   アルゴリズムに渡すパラメータを指定する。
   ``method`` に応じて渡すパラメータは異なる。

   lsh
     :hash_num:
        ハッシュのビット数を指定する。
        大きくすると正確な値に近づく代わりに、多くのメモリを消費し、探索時間も増す。
        (Integer)

   minhash
     :hash_num:
        ハッシュのビット数を指定する。
        大きくすると正確な値に近づく代わりに、多くのメモリを消費し、探索時間も増す。
        (Integer)

   euclid_lsh
     :hash_num:
        ハッシュの個数を指定する。
        大きくすると正確な値に近づく代わりに、多くのメモリを消費し、探索時間も増す。
        (Integer)


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

.. mpidl:service:: nearest_neighbor

   .. mpidl:method:: bool set_row(0: string id, 1: datum d)

      :param id:   行 ID
      :param d:    行に対応する :mpidl:type:`datum`
      :return:     モデルの更新に成功した場合 True

      行 ID ``id`` のデータを ``d`` を利用して更新する。
      同じ ``id`` を持つ行が既に存在する場合は、その行が ``d`` で上書きされる。
      ``recommender`` の場合と異なり差分更新ではない。
      更新操作を受け付けたサーバが当該行を持つサーバと同一であれば、操作は即時反映される。
      異なるサーバであれば、mix 後に反映される。

   .. mpidl:method:: list<id_with_score> neighbor_row_from_id(0: string id, 1: uint size)

      :param id:   近傍探索テーブル内の行を表す ID
      :param size: 返す近傍点の個数
      :return:     ``id`` で指定した近傍の id とその距離の値のリスト

      指定した行 ``id`` に近い行とその距離のリストを (最大で) ``size`` 個返す。

   .. mpidl:method:: list<id_with_score> neighbor_row_from_data(0: datum query, 1: uint size)

      :param query: 近傍探索の対象となる :mpidl:type:`datum`
      :param size:  返す近傍点の個数
      :return:      ``query`` の近傍の id とその距離の値のリスト

      指定した ``query`` に近い :mpidl:type:`datum` を持つ行とその ``query`` との距離のリストを (最大で) ``size`` 個返す。

   .. mpidl:method:: list<id_with_score> similar_row_from_id(0: string id, 1: int ret_num)

      :param id:      近傍探索テーブル内の行を表す ID
      :param ret_num: 返す近傍点の個数
      :return:        ``id`` で指定した近傍の id とその距離の値のリスト

      指定した行 ``id`` に近い行とその類似度のリストを (最大で) ``size`` 個返す。

   .. mpidl:method:: list<id_with_score> similar_row_from_data(0: datum query, 1: int ret_num)

      :param query:   近傍探索の対象となる :mpidl:type:`datum`
      :param ret_num: 返す近傍点の個数
      :return:        ``query`` の近傍の id とその類似度の値のリスト

      指定した ``query`` に近い :mpidl:type:`datum` を持つ行とその ``query`` との類似度のリストを (最大で) ``size`` 個返す。
