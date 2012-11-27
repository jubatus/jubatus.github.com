Classifier
----------

詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/classifier.idl>`_ を参照してください。


Data Structures
~~~~~~~~~~~~~~~

.. describe:: jubatus::config_data

.. code-block:: c++

   message config_data {
     0: string method
     1: string converter
   }

``converter`` は ``datum`` に対する特徴抽出方法を記述した JSON 文字列です。詳細は :doc:`fv_convert` を参照してください。

.. code-block:: c++

   message estimate_result {
     0: string label
     1: double prob
   }


Methods
~~~~~~~

.. describe:: int train(0: string name, 1: list<tuple<string, datum> > data)

 - 引数:

  - ``name`` : タスクを識別するクラスタ内でユニークな名前
  - ``data`` : labelとdatumで構成される組のリスト

 - 戻り値:

  - モデルの更新に成功した場合は 0

 学習しモデルを更新する。 ``tuple<string, datum>`` は、datumとそのlabelの組である。
 この関数は ``tuple<string, datum>`` をリスト形式でまとめて同時に受け付けることができる (バルク更新)。


.. describe:: list<list<estimate_result> > classify(0: string name, 1: list<datum> data)

 - 引数:

  - ``name`` : タスクを識別するクラスタ内でユニークな名前
  - ``data`` : 分類するdatumのリスト

 - 戻り値:

  - ``estimate_results`` のリスト

 与えられた ``data`` から、ラベルを推定する。
 ``estimate_results`` は、labelとその確からしさの値 (``prob``) の組のリストが、入れられたdatumの順番にリストで入っている。
 確からしさの値は [0,1] の範囲であり、高い値はより信頼性が高いことを意味する。
 この関数は、 ``datum`` をリスト形式でまとめて同時に受け付けることができる (バルク更新)。
