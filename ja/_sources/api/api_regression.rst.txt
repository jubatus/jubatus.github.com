Regression
----------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/regression.idl>`_ を参照してください。
* 使用されているアルゴリズムの詳細については :doc:`../method` を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: method

   回帰に使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ================ ==================================================================== ============
      設定値           手法                                                                 回帰方法
      ================ ==================================================================== ============
      ``"perceptron"`` パーセプトロン法を利用する。                                         線形回帰
      ``"PA"``         Passive Aggressive (PA) を利用する。 [Crammer06]_                    線形回帰
      ``"PA1"``        PA-I を利用する。 [Crammer06]_                                       線形回帰
      ``"PA2"``        PA-II を利用する。 [Crammer06]_                                      線形回帰
      ``"CW"``         Confidence Weighted Learning を利用する。 [Dredze08]_                線形回帰
      ``"AROW"``       Adaptive Regularization of Weight vectors を利用する。 [Crammer09b]_ 線形回帰
      ``"NHERD"``      Normal Herd を利用する。 [Crammer10]_                                線形回帰
      ``"NN"``         ``nearest_neighbor`` を利用する。                                    k-近傍法
      ``"cosine"``     コサイン類似度による近傍探索結果を利用する。                         k-近傍法
      ``"euclidean"``  ユークリッド距離による近傍探索結果を利用する。                       k-近傍法
      ================ ==================================================================== ============

.. describe:: parameter

   アルゴリズムに渡すパラメータを指定する。
   ``method`` に応じて渡すパラメータは異なる。

   perceptron
     :learning_rate:
	    学習率パラメータを設定する。
	    大きくすると学習が早くなる代わりに、ノイズに弱くなる。
	    (Float)

        * 値域: 0.0 < ``learning_rate``

   PA
     :sensitivity:
        許容する誤差の幅を指定する。
        大きくするとノイズに強くなる代わりに、誤差が残りやすくなる。
        (Float)

        * 値域: 0.0 <= ``sensitivity``

   PA1
     :sensitivity:
        許容する誤差の幅を指定する。
        大きくするとノイズに強くなる代わりに、誤差が残りやすくなる。
        (Float)

        * 値域: 0.0 <= ``sensitivity``

     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer06]_ における :math:`C` に相当する。
        (Float)

        * 値域: 0.0 < ``regularization_weight``

   PA2
     :sensitivity:
        許容する誤差の幅を指定する。
        大きくするとノイズに強くなる代わりに、誤差が残りやすくなる。
        (Float)

        * 値域: 0.0 <= ``sensitivity``

     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer06]_ における :math:`C` に相当する。
        (Float)

        * 値域: 0.0 < ``regularization_weight``

   CW
     :sensitivity:
        許容する誤差の幅を指定する。
        大きくするとノイズに強くなる代わりに、誤差が残りやすくなる。
        (Float)

        * 値域: 0.0 <= ``sensitivity``

     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Dredze08]_ における :math:`\phi` に相当する。
        (Float)

        * 値域: 0.0 < ``regularization_weight``

   AROW
     :sensitivity:
        許容する誤差の幅を指定する。
        大きくするとノイズに強くなる代わりに、誤差が残りやすくなる。
        (Float)

        * 値域: 0.0 <= ``sensitivity``

     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer09b]_ における :math:`1/r` に相当する。
        (Float)

        * 値域: 0.0 < ``regularization_weight``

   NHERD
     :sensitivity:
        許容する誤差の幅を指定する。
        大きくするとノイズに強くなる代わりに、誤差が残りやすくなる。
        (Float)

        * 値域: 0.0 <= ``sensitivity``

     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer10]_ における :math:`C` に相当する。
        (Float)

        * 値域: 0.0 < ``regularization_weight``

   NN
     :method:
        近傍探索に使用するアルゴリズムを指定する。
        使用可能なアルゴリズムの一覧は :doc:`api_nearest_neighbor` を参照のこと。

     :parameter:
        アルゴリズムに渡すパラメータを指定する。
        パラメータの一覧は :doc:`api_nearest_neighbor` を参照のこと。

     :nearest_neighbor_num:
        スコア算出時に使われるデータの数を指定する。
        (Integer)

        * 値域: 1 <= ``nearest_neighbor_num``

     :weight:
        スコア算出時に重み付けを行う手法を指定する。
        以下の手法を指定できる。

        .. table::

           ============== ===================================================================================
           設定値　　　　 手法
           ============== ===================================================================================
           ``"distance"`` 近傍点との距離(類似度)に基づいた重み付けを行う。近い点ほど予測に大きな影響を与える。
           ``"uniform"``  近傍点に対して均等に重み付けを行う。
           ============== ===================================================================================

        このパラメータは省略可能であり、デフォルトでは ``uniform`` と同じ動作をする。

   cosine
     :nearest_neighbor_num:
        スコア算出時に使われるデータの数を指定する。
        (Integer)

        * 値域: 1 <= ``nearest_neighbor_num``

     :weight:
        スコア算出時に重み付けを行う手法を指定する。
        以下の手法を指定できる。

        .. table::

           ============== ===================================================================================
           設定値　　　　 手法
           ============== ===================================================================================
           ``"distance"`` 近傍点との類似度に基づいた重み付けを行う。近い点ほど予測に大きな影響を与える。
           ``"uniform"``  近傍点に対して均等に重み付けを行う。
           ============== ===================================================================================

        このパラメータは省略可能であり、デフォルトでは ``uniform`` と同じ動作をする。

   euclidean
     :nearest_neighbor_num:
        スコア算出時に使われるデータの数を指定する。
        (Integer)

        * 値域: 1 <= ``nearest_neighbor_num``

     :weight:
        スコア算出時に重み付けを行う手法を指定する。
        以下の手法を指定できる。

        .. table::

           ============== ===================================================================================
           設定値　　　　 手法
           ============== ===================================================================================
           ``"distance"`` 近傍点との距離に基づいた重み付けを行う。近い点ほど予測に大きな影響を与える。
           ``"uniform"``  近傍点に対して均等に重み付けを行う。
           ============== ===================================================================================

        このパラメータは省略可能であり、デフォルトでは ``uniform`` と同じ動作をする。

.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`../fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "method": "PA1",
       "parameter" : {
         "sensitivity" : 0.1,
         "regularization_weight" : 3.402823e+38
       },
       "converter" : {
         "string_filter_types" : {},
         "string_filter_rules" : [],
         "num_filter_types" : {},
         "num_filter_rules" : [],
         "string_types": {},
         "string_rules": [
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

.. mpidl:message:: scored_datum

   スコア付きのデータを表す。

   .. mpidl:member:: 0: float score

      このデータに紐付けられたスコアを表す。このスコアを当てるのが、回帰問題の目的となる。

   .. mpidl:member:: 1: datum data

      ラベルに紐付けられたデータを表す。

   .. code-block:: c++

      message scored_datum {
        0: float score
        1: datum data
      }


Methods
~~~~~~~

.. mpidl:service:: regression

   .. mpidl:method:: int train(0: list<scored_datum> train_data)

      :param train_data: float と :mpidl:type:`datum` で構成される組のリスト
      :return:           学習した件数 (``train_data`` の長さに等しい)

      学習し、モデルを更新する。
      この関数は ``scored_datum`` をリスト形式でまとめて同時に受け付けることができる (バルク更新)。

   .. mpidl:method:: list<float>  estimate(0: list<datum>  estimate_data)

      :param estimate_data: 推定する :mpidl:type:`datum` のリスト
      :return:              推定値のリスト (入れられた :mpidl:type:`datum` の順に並ぶ)

      与えられた ``estimate_data`` から結果を推定する。
      この関数は :mpidl:type:`datum` をリスト形式でまとめて同時に受け付けることができる (バルク推定)。
