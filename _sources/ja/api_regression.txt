Regression
----------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/regression.idl>`_ を参照してください。
* 使用されているアルゴリズムの詳細については :doc:`method` を参照してください。

Data Structures
~~~~~~~~~~~~~~~

.. describe:: config_data

 サーバの設定を表す。
 ``method`` は回帰に使用するアルゴリズムである。
 現在は ``PA`` のみが指定可能である。
 ``config`` は :doc:`fv_convert` で説明されている JSON 形式の文字列である。

.. code-block:: c++

   message config_data {
     0: string method
     1: string config
   }

Methods
~~~~~~~

各メソッドの最初のパラメタ ``name`` は、タスクを識別する ZooKeeper クラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. describe:: int train(0: string name, list<tuple<float, datum> > train_data)

 - 引数:

  - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
  - ``train_data`` : floatとdatumで構成される組のリスト

 - 戻り値:

  - モデルの更新に成功した場合 0

 学習し、モデルを更新する。
 ``tuple<float, datum>`` は、datumとその値の組である。
 この関数は ``tuple<float, datum>`` をリスト形式でまとめて同時に受け付けることができる (バルク更新)。

.. describe:: list<float> estimate(0: string name, 1: list<datum> estimate_data)

 - 引数:

  - ``name`` : タスクを識別する ZooKeeper クラスタ内でユニークな名前
  - ``estimate_data`` : 推定するdatumのリスト

 - 戻り値:

  - 推定値のリスト (入れられたdatumの順に並ぶ)

 与えられた ``estimate_data`` から結果を推定する。
 この関数は datum をリスト形式でまとめて同時に受け付けることができる (バルク推定)。
