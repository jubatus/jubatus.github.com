Classifier
----------

詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/classifier.idl>`_ を参照してください。

Data Structures
~~~~~~~~~~~~~~~

.. describe:: config_data

 サーバの設定を表す。
 ``method`` は分類に使用するアルゴリズムである。
 現在、 ``perceptron``, ``PA``, ``PA1``, ``PA2``, ``CW``, ``AROW`` または ``NHERD`` のいずれかが指定可能である。
 ``converter`` は :doc:`fv_convert` で説明されている JSON 形式の文字列である。

.. code-block:: c++

   message config_data {
     0: string method
     1: string converter
   }

.. describe:: estimate_result

 分類の結果を表す。
 ``label`` は推定されたラベル、 ``prob`` はそのラベルに対する確からしさの値である。
 ``prob`` の値が大きいほど、より推定されたラベルの信頼性が高いことを意味する。

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

  - モデルの更新に成功した場合 0

 学習しモデルを更新する。 ``tuple<string, datum>`` は、datumとそのlabelの組である。
 この API は ``tuple<string, datum>`` をリスト形式でまとめて同時に受け付けることができる (バルク更新)。

.. describe:: list<list<estimate_result> > classify(0: string name, 1: list<datum> data)

 - 引数:

  - ``name`` : タスクを識別するクラスタ内でユニークな名前
  - ``data`` : 分類するdatumのリスト

 - 戻り値:

  - estimate_result のリストのリスト (入れられたdatumの順に並ぶ)

 与えられた ``data`` から、ラベルを推定する。
 この API は、 ``datum`` をリスト形式でまとめて同時に受け付けることができる (バルク分類)。
