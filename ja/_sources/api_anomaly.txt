Anomaly
-------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/anomaly.idl>`_ を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: method

   異常検知に使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ==================== ===================================
      設定値               手法
      ==================== ===================================
      ``"lof"``            Recommenderベースの Local Outlier Factor を利用する。 [Breunig2000]_
      ``"light_lof"``      Nearest Neighborベースの LOF を利用する。
      ==================== ===================================

.. describe:: parameter

   アルゴリズムに渡すパラーメータを指定する。
   ``method`` に応じて渡すパラメータは異なる。

   lof
     :nearest_neighbor_num:
        対象データに対する近傍の数を指定する。
        大きくすると誤検出が減る代わりに、検出漏れが増える。
        (Integer)
     :reverse_nearest_neighbor_num:
        異常値の情報を更新する際に、逆近傍候補の個数を指定する。
        大きくすると検出が正確になる代わりに、更新に時間がかかる。
        (Integer)
     :method:
        近傍探索に利用するレコメンダーのアルゴリズムを指定する。
        :doc:`api_recommender` で説明される ``method`` を指定する。
     :parameter:
        近傍探索に利用するレコメンダーに渡すパラーメータを指定する。
        :doc:`api_recommender` で説明される ``parameter`` を指定する。

   light_lof
     :nearest_neighbor_num:
        対象データに対する近傍の数を指定する。
        大きくすると誤検出が減る代わりに、検出漏れが増える。
        (Integer)
     :reverse_nearest_neighbor_num:
        異常値の情報更新する際に、逆近傍候補の個数を指定する。
        大きくすると検出が正確になる代わりに、更新に時間がかかる。
        (Integer)
     :method:
        近傍探索に利用する近傍探索器のアルゴリズムを指定する。
        :doc:`api_nearest_neighbor` で説明される ``method`` を指定する。
     :parameter:
        近傍探索に利用する近傍探索器に渡すパラメータを指定する。
        :doc:`api_nearest_neighbor` で説明される ``parameter`` を指定する。


.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "method" : "lof",
       "parameter" : {
         "nearest_neighbor_num" : 10,
         "reverse_nearest_neighbor_num" : 30,
         "method" : "euclid_lsh",
         "parameter" : {
           "hash_num" : 64,
           "table_num" : 4,
           "seed" : 1091,
           "probe_num" : 64,
           "bin_width" : 100,
           "retain_projection" : false
         }
       },
       "converter" : {
         "string_filter_types" : {},
         "string_filter_rules" : [],
         "num_filter_types" : {},
         "num_filter_rules" : [],
         "string_types" : {},
         "string_rules" : [
           { "key" : "*", "type" : "str", "sample_weight" : "bin", "global_weight" : "bin" }
         ],
         "num_types" : {},
         "num_rules" : [
           { "key" : "*", "type" : "num" }
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

      IDに対して紐付かれたスコアを表す。

   .. code-block:: c++

      message id_with_score {
        0: string id
        1: float score
      }

Methods
~~~~~~~

.. mpidl:service:: anomaly

   .. mpidl:method:: bool clear_row(0: string id)

      :param id:   削除する点 ID
      :return:     点の削除に成功した場合 True

      ID ``id`` で指定される点データを削除する。

   .. mpidl:method:: id_with_score add(0: datum row)

      :param row:  点の :mpidl:type:`datum`
      :return:     点 ID と異常値のタプル

      点データ ``row`` を追加する。

   .. mpidl:method:: float update(0: string id, 1: datum row)

      :param id:   更新する点 ID
      :param row:  点の新しい :mpidl:type:`datum`
      :return:     異常値

      点 ``id`` をデータ ``row`` で更新する。

   .. mpidl:method:: float overwrite(0: string id, 1: datum row)

      :param id:  更新する点 ID
      :param row: 点の新しい :mpidl:type:`datum`
      :return:    異常値

      点 ``id`` をデータ ``row`` で上書き更新する。

   .. mpidl:method:: float calc_score(0: datum row)

      :param row:  :mpidl:type:`datum`
      :return:     与えられた ``row`` に対する異常度

      点を追加せずに、与えられた点データ ``row`` の異常度を計算する。

   .. mpidl:method:: list<string> get_all_rows()

      :return:     すべての点の ID リスト

      すべての点の ID リストを返す。
