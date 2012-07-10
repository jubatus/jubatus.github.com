jubatus::client::regression
---------------------------

..See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/regression.idl>`_ for original and detailed spec.
詳細は `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/regression.idl>`_ を参照してください。

typedef
~~~~~~~

.. describe:: jubatus::regression::config_data


.. code-block:: c++

   message config_data {

     0: string method

     1: converter_config converter

   }



regression methods
~~~~~~~~~~~~~~~~~~

.. describe:: int train(0: string name, list<tuple<float, datum> > train_data)

 - Parameters:

  - ``name`` : タスクを識別するユニークな名前
  - ``train_data`` : floatとdatumで構成される組のリスト

 - Returns:

  - 成功すると0が返る

 ランダムに一台選んだサーバで学習し、モデルを更新する。 ``tuple<float, datum>`` は、datumとその値の組である。
 この関数は ``tuple<float, datum>`` をリスト形式で、まとめて同時に受け付けることが出来る。

.. describe:: list<float> estimate(0: string name, 1: list<datum> data)

 - Parameters:

  - ``name`` : タスクを識別するユニークな名前
  - ``data`` : datumのリスト

 - Returns:

  - Vector of estimate_results

 ランダムに選んだサーバで結果を推定する。``estimate_results`` は、予想値のリストが、入れられたdatumの順番に入っている。
.. Estimating a result at a server choosen randomly. ``estimate`` is a vector of estimated value.

