Clustering
----------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/clustering.idl>`_ を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: method

   クラスタリングに使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ==================== ===================================
      設定値               手法
      ==================== ===================================
      ``"kmeans"``         k-meansを利用する
      ``"gmm"``            混合ガウスモデルを利用する
      ==================== ===================================

.. describe:: parameter

   アルゴリズムに渡すパラーメータを指定する。
   ``method`` に応じて渡す一部のパラメータが異なる。

   kmeans, gmm 共通
     :k:
        いくつのクラスタに分割するか、を指定する。
        (Integer)

        * 値域: 1 <= ``k``

     :bucket_size:
        一度に圧縮する点数．データセットのサイズに等しく設定する。
        (Integer)

        * 値域: 2 <= ``bucket_size``

     :bucket_length:
        ミニバッチのサイズ。
        (Integer)

        * 値域: 2 <= ``bucket_length``

     :compresed_backet_size:
        ``backet_size`` を何点に圧縮するかを指定する。
        圧縮率 = (``compressed_backet_size`` / ``backet_size`` )である。
        (Integer)

        * 値域: ``bicriteria_base_size`` < ``compresed_backet_size`` < ``bucket_size``

     :bicriteria_base_size:
        圧縮の粗さに関係するパラメータ。
        (Integer)

        * 値域: 1 <= ``bicriteria_base_size`` < ``compresed_backet_size``

     :forgetting_factor:
        忘却定数 ``c_f`` 。
        (Float)

        * 値域: 0.0 <= ``forgetting_factor``

     :forgetting_threshold:
        重みにかけられた忘却係数の和がこの値を超えたら、それより上位のレベルには圧縮しないようにする。
        (Float)

        * 値域: 0.0 <= ``forgetting_threshold`` <= 1.0

   kmeans
     :compressor_method:
        点を圧縮するアルゴリズムを指定する。
        ``simple``, ``compressive_kmeans`` から選ぶことができる。
        (String)

   gmm
     :compressor_method:
        点を圧縮するアルゴリズムを指定する。
        ``simple``, ``compressive_gmm`` から選ぶことができる。
        (String)

.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "method" : "kmeans",
       "parameter" : {
         "k" : 3,
         "compressor_method" : "compressive_kmeans",
         "bucket_size" : 1000,
         "compressed_bucket_size" : 100,
         "bicriteria_base_size" : 10,
         "bucket_length" : 2,
         "forgetting_factor" : 0.0,
         "forgetting_threshold" : 0.5
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

.. mpidl:message:: weighted_datum

   .. mpidl:member:: 0: double weight

   .. mpidl:member:: 1: datum point


Methods
~~~~~~~

.. mpidl:service:: clustering

   .. mpidl:method:: bool push(0: list<datum> points)

      :param points: 追加する点のリスト
      :return:       点の追加に成功した場合 True

      点データを追加する。

   .. mpidl:method:: uint get_revision()

      :return:     クラスタ状態のバージョン

      クラスタ状態のバージョンを返す．

   .. mpidl:method:: list<list<weighted_datum > > get_core_members()

      :return:     クラスタの概略

      クラスタのコアセットを返す。

   .. mpidl:method:: list<datum> get_k_center()

      :return:     クラスタ中心

      ``k`` 個のクラスタ中心を返す．

   .. mpidl:method:: datum get_nearest_center(0: datum point)

      :param point:  :mpidl:type:`datum`
      :return:     与えられた点に最も近いクラスタ中心

      点を追加せずに、与えられた点データ ``point`` に最も近いクラスタ中心を返す．

   .. mpidl:method:: list<weighted_datum > get_nearest_members(0: datum point)

      :param point: 指定する点
      :return:     点のリスト

      ``point`` で指定した点から最も近いクラスタの概略を返す。
