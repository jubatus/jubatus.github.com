jubatus::client::classifier
---------------------------


.. See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/classifier.idl>`_ for original and detailed spec.
 詳細は `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/classifier.idl>`_を参照してください。

types
~~~~~

.. code-block:: c++

   message config_data {
     string method;
     jubatus::converter_config converter;
   };


.. code-block:: c++

   message estimate_result {
     std::string label_;
     double prob_;
   };



classifier methods
~~~~~~~~~~~~~~~~~~

.. describe:: train(0: string name, 1: list<tuple<string, datum> > data)

 - Parameters:

  - ``name`` : タスクを識別するユニークな名前
  - ``data`` : labelとdatumで構成される組のリスト

 - Returns:

  - 成功すると0が返る

 ランダムに一台選んだサーバで学習し、モデルを更新する。 ``tuple<string, datum>`` は、datumとそのlabelの組である。
 この関数は ``tuple<string, datum>`` をリスト形式で、まとめて同時に受け付けることが出来る。

.. Training model at a server chosen randomly. ``tuple<string, datum>`` is a tuple of datum and it's label. 
.. This function is designed to allow bulk update with list of tuple of label and datum.


.. describe:: list<list<estimate_result> > classify(0: string name, 1: list<datum> data)

 - Parameters:

  - ``name`` : タスクを識別するユニークな名前
  - ``data`` : datumのリスト

 - Returns:

  - ``estimate_results`` のリスト

 ランダムに選んだサーバで結果を推定する。``estimate_results`` は、labelとその信頼性の値の組のリストが、入れられたdatumの順番にリストで入っている。
.. Estimating a result at a server choosen randomly. ``estimate_results`` is a list of tuple of label and it's reliablity value.
