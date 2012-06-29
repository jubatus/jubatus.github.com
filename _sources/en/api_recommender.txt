jubatus::client::recommender
----------------------------

See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/recommender.idl>`_ for original and detailed spec.

typedef
~~~~~~~

.. describe:: jubatus::recommender::config_data

.. code-block:: c++

   message config_data {

     0: string method
     
     1: converter_config converter;

   }


recommender methods
~~~~~~~~~~~~~~~~~~~

.. describe:: bool clear_row(string name, string id)

- Parameters:

  - ``ids`` : a list of ids to be cleared. Each id specifies a row in a recommendation table.

Clear rows specified by ``ids`` . 


.. describe:: bool update_row(string name, string id, datum d)

- Parameters:

  - ``name`` : a string value to uniquely identifies a task in Zookeeper quorum
  - ``id`` : a string value to uniquely identifies a row in a recommendation table
  - ``d`` : vector of datum

- Returns:

  - True if this function updates models successfully.

Differential update of row data using row data. If row whose id is  ``id`` exists, row is overwritten. Otherwise, new row entry will be created. If the server that manages ``id`` row and that operation is received is same, update operation is reflected instantly. Otherwise, update operation is reflected after mix.

..  rowデータをdataを利用して差分更新する．同じ特徴番号がある場合は上書き更新する．新しいrow idが指定された場合は，新しいrowエントリを作成する．更新操作は同じサーバーであれば即次反映され，異なるサーバーであれば，mix後に反映される．

.. describe:: bool clear(0: string name)


.. describe:: datum complete_row_from_id(0: string name, 1: string id)

- Parameters:

  - ``id`` : a string value to uniquely identifies a row in a recommendation table

- Returns:

  - datum stored in ``id`` row with missing value completed by predicted value.

Return row specified by ``id`` with missing value completed by predicted value.

.. 指定したidのrowの中で欠けている値を予測して返す。

.. describe:: datum complete_row_from_data(0: string name, 1: datum dat)

- Parameters:

  - ``dat`` : original datum to be completed (possibly some values are missing).

- Returns:

  - row constructed from inputted datum with missing value completed by predicted value.

.. 指定したdatumで構成されるrowの中で欠けている値を予測して返す。

.. describe:: similar_result similar_row_from_id(0: string name, 1: string id, 2: uint size)

- Parameters:

  - ``id`` : a string value to uniquely identifies a row in a recommendation table
  - ``size`` : number of rows to be returned.

- Returns:

  - similar_result of ``id`` .

Returns ``ret_num`` rows which are most similar to row specified by ``id`` .
The meaning of similar_result is described in typedef of similar_result.
    
.. 指定したidに近いrowを返す。

.. describe:: similar_result similar_row_from_data(0: string name, 1: datum dat, 2: uint size)

- Parameters:

  - ``dat`` : original datum to be completed (possibly some values are missing).
  - ``ret_num``` : number of rows to be returned.

- Returns:

  - similar_result of the row constructed from ``dat`` .

Return ``ret_num`` rows which are most similar to row constructed from inputted datum.
The meaning of similar_result is described in typedef of similar_result.

.. 指定したdatumで構成されるrowに近いrowを返す。

.. describe:: datum decode_row(0: string name, 1: string id)


.. describe:: list<string> get_all_rows(0:string name)

- Returns:

  - list of all rows

Return list of all rows.

.. describe:: float similarity(0: string name, 1: datum lhs, 2: datum rhs)

.. describe:: float l2norm(0: string name, 1: datum d)
