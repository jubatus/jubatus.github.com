Recommender
-----------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/recommender.idl>`_ for detailed specification.
* See :doc:`method` for detailed description of algorithms used in this server.

Data Structures
~~~~~~~~~~~~~~~

.. describe:: config_data

 Represents a configuration of the server.
 ``method`` is an algorithm used for recommendation.
 Currently, one of ``inverted_index``, ``minhash`` or ``lsh`` can be specified.
 ``converter`` is a string in JSON format described in :doc:`fv_convert`.

.. code-block:: c++

   message config_data {
     0: string method
     1: string converter
   }

.. describe:: similar_result

 Represents a result of similarity methods.
 It is a list of tuple of string and float.
 The string value is a row ID and the float value is a similarity for the ID.
 Higher similarity value means that they are more similar to each other.

.. code-block:: c++

   type similar_result = list<tuple<string, float> >

Methods
~~~~~~~

For all methods, the first parameter of each method (``name``) is a string value to uniquely identify a task in the ZooKeeper cluster.
When using standalone mode, this must be left blank (``""``).

.. describe:: bool clear_row(string name, string id)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``id`` : row ID to be removed

 - Returns:

  - True when the row was cleared successfully

 Removes the given row ``id`` from the recommendation table.

.. describe:: bool update_row(string name, string id, datum d)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``id`` : row ID
  - ``d`` : datum for the row

 - Returns:

  - True if this function updates models successfully

 Updates the row whose id is ``id`` with given ``d``.
 If the row with the same ``id`` already exists, the row is differential updated with ``d``.
 Otherwise, new row entry will be created.
 If the server that manages the row and the server that received this RPC request are same, this operation is reflected instantly.
 If not, update operation is reflected after mix.

.. describe:: bool clear(0: string name)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster

 - Returns:

  - True when the model was cleared successfully

 Completely clears the model.

.. describe:: datum complete_row_from_id(0: string name, 1: string id)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``id`` : row ID

 - Returns:

  - datum stored in ``id`` row with missing value completed by predicted value

 Returns the datum for the row ``id``, with missing value completed by predicted value.

.. describe:: datum complete_row_from_data(0: string name, 1: datum d)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``d`` : original datum to be completed (possibly some values are missing).

 - Returns:

  - datum constructed from the given datum with missing value completed by predicted value

 Returns the datum constructed from datum ``d``, with missing value completed by predicted value.

.. describe:: similar_result similar_row_from_id(0: string name, 1: string id, 2: uint size)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``id`` : row ID
  - ``size`` : number of rows to be returned

 - Returns:

  - rows that are most similar to the row ``id``

 Returns ``size`` rows (at maximum) which are most similar to the row ``id``.

.. describe:: similar_result similar_row_from_data(0: string name, 1: datum data, 2: uint size)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``data`` : original datum to be completed (possibly some values are missing)
  - ``size`` : number of rows to be returned

 - Returns:

  - rows that most have a similar datum to ``data``

 Returns ``size`` rows (at maximum) that most have similar datum to datum ``data``.

.. describe:: datum decode_row(0: string name, 1: string id)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``id`` : row ID

 - Returns:

  - datum for the given row ``id``

 Returns the datum in the row ``id``.
 Note that irreversibly converted datum (processed by ``fv_converter``) will not be decoded.

.. describe:: list<string> get_all_rows(0:string name)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster

 - Returns:

  - list of all row IDs

 Returns the list of all row IDs.

.. describe:: float similarity(0: string name, 1: datum lhs, 2: datum rhs)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``lhs`` : datum
  - ``rhs`` : another datum

 - Returns:

  - similarity between ``lhs`` and ``rhs``

 Returns the similarity between two datum.

.. describe:: float l2norm(0: string name, 1: datum d)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``d`` : datum

 - Returns:

  - L2 norm for the given ``d``

 Returns the value of L2 norm for the datum ``d``.
