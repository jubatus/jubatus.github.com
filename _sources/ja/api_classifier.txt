Classifier
----------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/classifier.idl>`_ を参照してください。
* 使用されているアルゴリズムの詳細については :doc:`method` を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである

.. describe:: method

   分類に使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ================ ===================================
      設定値           手法
      ================ ===================================
      ``"perceptron"`` パーセプトロン法を利用する。 
      ``"PA"``         Passive Agressive (PA) を利用する。 [Crammer06]_
      ``"PA1"``        PA-I を利用する。 [Crammer06]_
      ``"PA2"``        PA-II を利用する。 [Crammer06]_
      ``"CW"``         Confidence Weighted Learning を利用する。 [Dredze08]_
      ``"AROW"``       Adaptive Regularization of Weight vectors を利用する。 [Crammer09b]_
      ``"NHERD"``      Normal Herd を利用する。 [Crammer10]_
      ================ ===================================

.. describe:: parameter

   アルゴリズムに渡すパラーメータを指定する。
   ``method`` に応じて渡すパラメータは異なる。
   なお、各アルゴリズムの ``regularization_weight`` パラメータはアルゴリズム中における役割が異なるため、アルゴリズム毎に適切な値は異なることに注意する。

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

   PA2
     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer06]_ における :math:`C` に相当する。
        (Float)

   CW
     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Dredze08]_ における :math:`\phi` に相当する。
        (Float)

   AROW
     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer09b]_ における :math:`1/r` に相当する。
        (Float)

   NHERD
     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer10]_ における :math:`C` に相当する。
        (Float)


.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "method" : "perceptron",
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

.. describe:: estimate_result

   分類の結果を表す。
   ``label`` は推定されたラベル、 ``score`` はそのラベルに付けられた対する確からしさの値である。
   ``score`` の値が大きいほど、より推定されたラベルの信頼性が高いことを意味する。

   .. code-block:: c++

      message estimate_result {
        0: string label
        1: double score
      }


Methods
~~~~~~~

各メソッドの最初のパラメタ ``name`` は、タスクを識別する ZooKeeper クラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. describe:: int train(0: string name, 1: list<tuple<string, datum> > data)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``data`` : labelとdatumで構成される組のリスト

   - 戻り値:

     - 学習した件数 (``data`` の長さに等しい)

   学習しモデルを更新する。
   ``tuple<string, datum>`` は、datumとそのlabelの組である。
   この API は ``tuple<string, datum>`` をリスト形式でまとめて同時に受け付けることができる (バルク更新)。


.. describe:: list<list<estimate_result> > classify(0: string name, 1: list<datum> data)

   - 引数:

     - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
     - ``data`` : 分類するdatumのリスト

   - 戻り値:

     - estimate_result のリストのリスト (入れられたdatumの順に並ぶ)

   与えられた ``data`` から、ラベルを推定する。
   この API は、 ``datum`` をリスト形式でまとめて同時に受け付けることができる (バルク分類)。


