Classifier
----------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/classifier.idl>`_ を参照してください。
* 使用されているアルゴリズムの詳細については :doc:`method` を参照してください。

Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: method

   分類に使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ================ ==================================================================== ============
      設定値           手法                                                                 分類方法
      ================ ==================================================================== ============
      ``"perceptron"`` パーセプトロン法を利用する。                                         線形分類
      ``"PA"``         Passive Aggressive (PA) を利用する。 [Crammer06]_                    線形分類
      ``"PA1"``        PA-I を利用する。 [Crammer06]_                                       線形分類
      ``"PA2"``        PA-II を利用する。 [Crammer06]_                                      線形分類
      ``"CW"``         Confidence Weighted Learning を利用する。 [Dredze08]_                線形分類
      ``"AROW"``       Adaptive Regularization of Weight vectors を利用する。 [Crammer09b]_ 線形分類
      ``"NHERD"``      Normal Herd を利用する。 [Crammer10]_                                線形分類
      ``"NN"``         ``nearest_neighbor`` を利用する。                                    k-近傍法
      ``"cosine"``     コサイン類似度による近傍探索結果を利用する。[1]_                     k-近傍法
      ``"euclidean"``  ユークリッド距離による近傍探索結果を利用する。[1]_                   k-近傍法
      ================ ==================================================================== ============

   .. [1] これらの手法では ``delete_label`` APIおよび ``unlearner`` を使用することができない。

.. describe:: parameter

   アルゴリズムに渡すパラメータを指定する。
   ``method`` に応じて渡すパラメータは異なる。
   なお、各アルゴリズムの ``regularization_weight`` パラメータはアルゴリズム中における役割が異なるため、アルゴリズム毎に適切な値は異なることに注意する。

   共通
     :unlearner:
        忘却機能に利用するUnlearnerのアルゴリズムを指定する。
        忘却機能を利用しない場合、 このパラメータを省略する。
        :doc:`api_unlearner` で説明される ``unlearner`` を指定する。
        ここで指定された方法に基づいてデータを忘却する。忘却の単位はラベル単位である。
        ただし、``method`` が ``"NN"`` の場合、ラベル単位ではなく、 学習データ( ``labeled_datum`` )単位である。

     :unlearner_parameter:
        忘却機能に利用するUnlearnerに渡すパラメータを指定する。
        :doc:`api_unlearner` で説明される ``unlearner_parameter`` を指定する。
        ``unlearner`` を設定する場合、 ``unlearner_parameter`` の指定は必須である。
        ここで指定された件数以上のラベルまたはデータを忘却する。

     これら2つのパラメータは **省略可能** である。

   perceptron
     なし

   PA
     なし

   PA1
     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer06]_ における :math:`C` に相当する。
        (Float)

        * 値域: 0.0 < ``regularization_weight``

   PA2
     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer06]_ における :math:`C` に相当する。
        (Float)

        * 値域: 0.0 < ``regularization_weight``

   CW
     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Dredze08]_ における :math:`\phi` に相当する。
        (Float)

        * 値域: 0.0 < ``regularization_weight``

   AROW
     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer09b]_ における :math:`1/r` に相当する。
        (Float)

        * 値域: 0.0 < ``regularization_weight``

   NHERD
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

     :local_sensitivity:
        スコア算出時に使われる感度パラメータを指定する。
        0 の場合は近傍探索で得られた全てのデータを同じ重みで評価し、
        大きくすると距離の近いデータをより重視するようになる。
        (Float)

        * 値域: 0.0 <= ``local_sensitivity``

   cosine
     :nearest_neighbor_num:
        スコア算出時に使われるデータの数を指定する。
        (Integer)

        * 値域: 1 <= ``nearest_neighbor_num``

     :local_sensitivity:
        スコア算出時に使われる感度パラメータを指定する。
        0 の場合は近傍探索で得られた全てのデータを同じ重みで評価し、
        大きくすると距離の近いデータをより重視するようになる。
        (Float)

        * 値域: 0.0 <= ``local_sensitivity``

   euclidean
     :nearest_neighbor_num:
        スコア算出時に使われるデータの数を指定する。
        (Integer)

        * 値域: 1 <= ``nearest_neighbor_num``

     :local_sensitivity:
        スコア算出時に使われる感度パラメータを指定する。
        0 の場合は近傍探索で得られた全てのデータを同じ重みで評価し、
        大きくすると距離の近いデータをより重視するようになる。
        (Float)

        * 値域: 0.0 <= ``local_sensitivity``

.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "method" : "AROW",
       "parameter" : {
         "regularization_weight" : 1.0
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

.. mpidl:message:: estimate_result

   分類の結果を表す。

   .. mpidl:member:: 0: string label

      推定されたラベルを表す。

   .. mpidl:member:: 1: double score

      ラベルに付けられた対する確からしさの値である。
      ``score`` の値が大きいほど、より推定されたラベルの信頼性が高いことを意味する。

   .. code-block:: c++

      message estimate_result {
        0: string label
        1: double score
      }

.. mpidl:message:: labeled_datum

   ラベル付きのデータを表す。

   .. mpidl:member:: 0: string label

      このデータに紐付けられたラベルを表す。

   .. mpidl:member:: 1: datum data

      ラベルに紐付けられたデータを表す。

   .. code-block:: c++

      message labeled_datum {
        0: string label
        1: datum data
      }


Methods
~~~~~~~

.. mpidl:service:: classifier

   .. mpidl:method:: int train(0: list<labeled_datum> data)

      :param data:  label と :mpidl:type:`datum` で構成される組のリスト
      :return:      学習した件数 (``data`` の長さに等しい)

      学習しモデルを更新する。
      ``labeled_datum`` は、 :mpidl:type:`datum` とその label の組である。
      この API は ``labeled_datum`` をリスト形式でまとめて同時に受け付けることができる (バルク更新)。

   .. mpidl:method:: list<list<estimate_result> > classify(0: list<datum> data)

      :param data: 分類する :mpidl:type:`datum` のリスト
      :return:     :mpidl:type:`estimate_result` のリストのリスト (入れられた :mpidl:type:`datum` の順に並ぶ)

      与えられた ``data`` から、ラベルを推定する。
      この API は、 :mpidl:type:`datum` をリスト形式でまとめて同時に受け付けることができる (バルク分類)。

   .. mpidl:method:: map<string, ulong> get_labels()

      :return:     現在登録されているラベルと学習した件数の組

      登録されているラベルとそれぞれのラベルを学習した件数を返却する。
      method が ``NN`` の場合、忘却機能によって削除された学習データの件数は含まれない。

   .. mpidl:method:: bool set_label(0: string new_label)

      :param new_label: 追加するラベル名
      :return:          追加に成功した場合 True 既にラベルが存在した場合 False

      新しいラベルを追加する。
      既に同名のラベルが登録されていた場合失敗する。
      ラベルは ``train`` 実行時にも自動的に追加される。

   .. mpidl:method:: bool delete_label(0: string target_label)

      :param target_label: 消去するラベル名
      :return:          消去に成功した場合 True ラベルが存在しなかった場合 False

      ラベルを消去する。
      成功時に True 失敗時に False を返す。
