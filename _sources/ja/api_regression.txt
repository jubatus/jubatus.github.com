Regression
----------

詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/regression.idl>`_ を参照してください。

Data Structures
~~~~~~~~~~~~~~~

.. describe:: config_data

 サーバの設定を表す。
 ``method`` は回帰に使用するアルゴリズムである。
 現在は ``PA`` のみが指定可能である。
 ``converter`` は :doc:`fv_convert` で説明されている JSON 形式の文字列である。

.. code-block:: c++

   message config_data {
     0: string method
     1: string config
   }

Methods
~~~~~~~

.. describe:: int train(0: string name, list<tuple<float, datum> > train_data)

 - Parameters:

  - ``name`` : タスクを識別するクラスタ内でユニークな名前
  - ``train_data`` : floatとdatumで構成される組のリスト

 - Returns:

  - モデルの更新に成功した場合 0

 学習し、モデルを更新する。 ``tuple<float, datum>`` は、datumとその値の組である。
 この関数は ``tuple<float, datum>`` をリスト形式でまとめて同時に受け付けることができる (バルク更新)。

.. describe:: list<float> estimate(0: string name, 1: list<datum> data)

 - Parameters:

  - ``name`` : タスクを識別するクラスタ内でユニークな名前
  - ``data`` : 推定するdatumのリスト

 - Returns:

  - 推定値のリスト (入れられたdatumの順に並ぶ)

 与えられた ``data`` から結果を推定する。
 この関数は ``datum`` をリスト形式でまとめて同時に受け付けることができる (バルク推定)。
 ``estimate_results`` は、予想値のリストが、入れられたdatumの順番に入っている。
