Regression
----------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/regression.idl>`_ を参照してください。
* 使用されているアルゴリズムの詳細については :doc:`method` を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである

.. describe:: method

   回帰に使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ================ ===================================
      設定値           手法
      ================ ===================================
      ``"PA"``          Passive Agressive を利用する。 [Crammer06]_
      ================ ===================================


.. describe:: parameter

   アルゴリズムに渡すパラーメータを指定する。
   ``method`` に応じて渡すパラメータは異なる。

   PA
     :sensitivity:
        許容する誤差の幅を指定する。
        大きくするとノイズに強くなる代わりに、誤差が残りやすくなる。
        (Float)
     :regularization_weight:
        学習に対する感度パラメータを指定する。
        大きくすると学習が早くなる代わりに、ノイズに弱くなる。
        元論文 [Crammer06]_ における :math:`C` に相当する。
        (Float)


.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "method": "PA",
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

なし。


Methods
~~~~~~~

各メソッドの最初のパラメタ ``name`` は、タスクを識別する ZooKeeper クラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. mpidl:service:: regression

   .. mpidl:method:: int train(0: string name, 1: list<tuple<float, datum> > train_data)

      :param name:       タスクを識別する ZooKeeper クラスタ内でユニークな名前
      :param train_data: float と :mpidl:type:`datum` で構成される組のリスト
      :return:           学習した件数 (``train_data`` の長さに等しい)

      学習し、モデルを更新する。
      ``tuple<float, datum>`` は、 :mpidl:type:`datum` とその値の組である。
      この関数は ``tuple<float, datum>`` をリスト形式でまとめて同時に受け付けることができる (バルク更新)。

   .. mpidl:method:: list<float>  estimate(0: string name, 1: list<datum>  estimate_data)

      :param name:          タスクを識別する ZooKeeper クラスタ内でユニークな名前
      :param estimate_data: 推定する :mpidl:type:`datum` のリスト
      :return:              推定値のリスト (入れられた :mpidl:type:`datum` の順に並ぶ)

      与えられた ``estimate_data`` から結果を推定する。
      この関数は :mpidl:type:`datum` をリスト形式でまとめて同時に受け付けることができる (バルク推定)。
