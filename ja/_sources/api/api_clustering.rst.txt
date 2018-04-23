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
      ``"dbscan"``         dbscanを利用する
      ==================== ===================================

.. describe:: parameter

   アルゴリズムに渡すパラメータを指定する。
   ``method`` に応じて渡す一部のパラメータが異なる。

   kmeans, gmm 共通
     :k:
        いくつのクラスタに分割するか、を指定する。
        (Integer)

        * 値域: 1 <= ``k``

     :seed:
        乱数の生成に使用するシードを指定する。
        (Integer)

        * 値域: 0 <= ``seed`` <= :math:`2^{32} - 1`
          
   dbscan
     :eps:
       近傍点とみなす距離を指定する。
       大きな値を指定するほど、離れている点でも近傍点とみなすようになる。
       (Float)

       * 値域: 0.0 < ``eps``

     :min_core_point:
        クラスタの形成に必要な密集度(近傍点の数)の下限を設定する。
        大きな値を指定するほど、密集度の高い領域のみがクラスタを形成するようになる。
        (Integer)

        * 値域: 1 <= ``min_core_point``

.. describe:: compressor_method

   データ点を圧縮するアルゴリズムを指定する。
   ``method`` によって使用できるメソッドが異なる。

   .. table::

      ==================== ===========================================
      設定値               手法
      ==================== ===========================================
      ``"simple"``         圧縮を行わない
      ``"compressive"``    コアセットによる圧縮を行う(kmeans, gmmのみ)
      ==================== ===========================================

.. describe:: compressor_parameter

   compressorに渡すパラメータを指定する。
   ``compressor_method`` に応じて渡すパラメータが異なる。

   simple
     :bucket_size:
        ミニバッチを実行するデータの件数。
        ``bucket_size`` 件のデータが登録される度にクラスタリングが実行される。
        ただし ``method`` が ``kmeans`` または ``gmm`` の場合、初回のクラスタリングは ``k`` 件のデータが登録されるまで実行されない。
        (Integer)

        * 値域: 2 <= ``bucket_size``

   compressive
     :bucket_size:
        ミニバッチおよび圧縮を実行するデータの件数。
        ``bucket_size`` 件のデータが登録される度にクラスタリングが実行される。
        ただし ``method`` が ``kmeans`` または ``gmm`` の場合、初回のクラスタリングは ``k`` 件のデータが登録されるまで実行されない。
        (Integer)

        * 値域: 2 <= ``bucket_size``

     :bucket_length:
        ミニバッチのサイズ。
        (Integer)

        * 値域: 2 <= ``bucket_length``

     :compressed_bucket_size:
        ``bucket_size`` を何点に圧縮するかを指定する。
        圧縮率 = (``compressed_bucket_size`` / ``bucket_size`` )である。
        (Integer)

        * 値域: ``bicriteria_base_size`` <= ``compressed_bucket_size`` < ``bucket_size``

     :bicriteria_base_size:
        圧縮の粗さに関係するパラメータ。
        (Integer)

        * 値域: 1 <= ``bicriteria_base_size`` <= ``compressed_bucket_size``

     :forgetting_factor:
        忘却定数 ``c_f`` 。
        (Float)

        * 値域: 0.0 <= ``forgetting_factor``

     :forgetting_threshold:
        重みにかけられた忘却係数の和がこの値を超えたら、それより上位のレベルには圧縮しないようにする。
        (Float)

        * 値域: 0.0 <= ``forgetting_threshold`` <= 1.0

     :seed:
        乱数の生成に使用するシードを指定する。
        (Integer)

        * 値域: 0 <= ``seed`` <= :math:`2^{32} - 1`

.. describe:: distance(optional)

   データ間の距離を測る手法を指定する。
   設定可能な値は下表の通りである。
   このオプションは省略可能であり、省略された場合は ``euclidean`` が使用される。
   このオプションは ``method`` が ``kmeans``, ``dbscan`` の時のみ有効である。

   .. table::

      ==================== ===========================================
      設定値               手法
      ==================== ===========================================
      ``"euclidean"``      ユークリッド距離を使用する
      ``"cosine"``         コサイン距離を使用する
      ==================== ===========================================

   

.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`../fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "method" : "kmeans",
       "parameter" : {
         "k" : 3,
         "seed" : 0
       },
       "compressor_method" : "compressive",
       "compressor_parameter" : {
         "bucket_size" : 1000,
         "compressed_bucket_size" : 100,
         "bicriteria_base_size" : 10,
         "bucket_length" : 2,
         "forgetting_factor" : 0.0,
         "forgetting_threshold" : 0.5,
         "seed" : 0
       },
       "distance": "euclidean"
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

.. mpidl:message:: indexed_point

   .. mpidl:member:: 0: string id

   .. mpidl:member:: 1: datum point

.. mpidl:message:: weighted_index

   .. mpidl:member:: 0: double weight

   .. mpidl:member:: 1: string id

Methods
~~~~~~~

.. mpidl:service:: clustering

   .. mpidl:method:: bool push(0: list<indexed_point> points)

      :param points: 追加する点のリスト
      :return:       点の追加に成功した場合 True

      点データを追加する。

   .. mpidl:method:: uint get_revision()

      :return:     クラスタ状態のバージョン

      クラスタ状態のバージョンを返す。

   .. mpidl:method:: list<list<weighted_datum > > get_core_members()

      :return:     クラスタの概略

      クラスタのコアセットをdatum形式で返す。

   .. mpidl:method:: list<list<weighted_index > > get_core_members_light()

      :return:     クラスタの概略

      クラスタのコアセットのindexを返す。

   .. mpidl:method:: list<datum> get_k_center()

      :return:     クラスタ中心

      ``k`` 個のクラスタ中心を返す。
      アルゴリズムに ``dbscan`` を選択した場合、このメソッドは使用できない。

   .. mpidl:method:: datum get_nearest_center(0: datum point)

      :param point:  :mpidl:type:`datum`
      :return:     与えられた点に最も近いクラスタ中心

      点を追加せずに、与えられた点データ ``point`` に最も近いクラスタ中心を返す。
      アルゴリズムに ``dbscan`` を選択した場合、このメソッドは使用できない。

   .. mpidl:method:: list<weighted_datum > get_nearest_members(0: datum point)

      :param point: 指定する点
      :return:     点のリスト

      ``point`` で指定した点から最も近いクラスタの概略をdatum形式で返す。
      アルゴリズムに ``dbscan`` を選択した場合、このメソッドは使用できない。

   .. mpidl:method:: list<weighted_index > get_nearest_members_light(0: datum point)

      :param point: 指定する点
      :return:     点のリスト

      ``point`` で指定した点から最も近いクラスタの概略をindexで返す。
      アルゴリズムに ``dbscan`` を選択した場合、このメソッドは使用できない。
