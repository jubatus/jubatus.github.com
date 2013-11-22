Recommender
-----------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/recommender.idl>`_ for detailed specification.
* See :doc:`method` for detailed description of algorithms used in this server.


Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each filed below:

.. describe:: method

   Specify algorithm for recommender.
   You can use these algorithms.

   .. table::

      ======================= ===================================
      Value                   Method
      ======================= ===================================
      ``"inverted_index"``    Use Inverted Index.
      ``"minhash"``           Use MinHash. [Ping2010]_
      ``"lsh"``               Use Locality Sensitive Hashing.
      ``"euclid_lsh"``        Use Euclid-distance LSH. [Andoni2005]_

      ``"nearest_neighbor:*`` Use an implementation of ``nearest_neighbor`` of which algorithm name is specified in ``*`` .
      ======================= ===================================


.. describe:: parameter

   Specify parameters for the algorithm.
   Its format differs for each ``method``.


   inverted_index
     None

   minhash
     :hash_num:
        Number of hash values.
        The bigger it is, the more accurate results you can get, but the more memory is required.
        (Integer)

   lsh
     :hash_num:
        Bit length of hash values.
        The bigger it is, the more accurate results you can get, but the more memory is required.
        (Integer)

   euclid_lsh
     :hash_num:
        Number of hash values.
        The bigger it is, the more accurate results you can get, but the fewer results you can find and the more memory is required.
        (Integer)
     :table_num:
        Number of tables.
        The bigger it is, the mroe results you can find, but the more memory is required and the longer response time is required.
        (Integer)
     :bin_width:
        Quantization step size.
        The bigger it is, the more results you can find, but the longer response time is required.
        (Float)
     :probe_num:
        Number of bins to find.
        The bigger it is, the more results you can find, but the longer response time is required.
        (Integer)
     :seed:
        Seed of random number generator.
        (Integer)
     :retain_projection:
        When it is ``true``, projection vectors for hashing are cached in memory.
        Response time is lower though more memory is required.
        (Boolean)

   nearest_neighbor:*
      Describe the parameter set for the nearest neighbor that is specified in ``*`` .
      Please refer to :doc:`api_nearest_neighbor` for more details.


.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`fv_convert`.


Example:
  .. code-block:: javascript

     {
       "method": "lsh",
       "parameter" : {
         "hash_num" : 64
       },
       "converter" : {
         "string_filter_types": {},
         "string_filter_rules":[],
         "num_filter_types": {},
         "num_filter_rules": [],
         "string_types": {},
         "string_rules":[
           {"key" : "*", "type" : "str", "sample_weight":"bin", "global_weight" : "bin"}
         ],
         "num_types": {},
         "num_rules": [
           {"key" : "*", "type" : "num"}
         ]
       }
     }

Data Structures
~~~~~~~~~~~~~~~

.. mpidl:message:: id_with_score

   Represents ID with its score.

   .. mpidl:member:: 0: string id

      Data ID.

   .. mpidl:member:: 1: float score

      Score.

   .. code-block:: c++

      message id_with_score {
        0: string id
        1: float score
      }


Methods
~~~~~~~

.. mpidl:service:: recommender

   .. mpidl:method:: bool clear_row(0: string id)

      :param id:   row ID to be removed
      :return:     True when the row was cleared successfully

      Removes the given row ``id`` from the recommendation table.

   .. mpidl:method:: bool update_row(0: string id, 1: datum row)

      :param id:   row ID
      :param row:  :mpidl:type:`datum` for the row
      :return:     True if this function updates models successfully

      Updates the row whose id is ``id`` with given ``row``.
      If the row with the same ``id`` already exists, the row is differential updated with ``row``.
      Otherwise, new row entry will be created.
      If the server that manages the row and the server that received this RPC request are same, this operation is reflected instantly.
      If not, update operation is reflected after mix.

   .. mpidl:method:: datum complete_row_from_id(0: string id)

      :param id:   row ID
      :return:     :mpidl:type:`datum` stored in ``id`` row with missing value completed by predicted value

      Returns the :mpidl:type:`datum` for the row ``id``, with missing value completed by predicted value.

   .. mpidl:method:: datum complete_row_from_datum(0: datum row)

      :param row:  original :mpidl:type:`datum` to be completed (possibly some values are missing)
      :return:     :mpidl:type:`datum` constructed from the given :mpidl:type:`datum` with missing value completed by predicted value

      Returns the :mpidl:type:`datum` constructed from ``row``, with missing value completed by predicted value.

   .. mpidl:method:: list<id_with_score> similar_row_from_id(0: string id, 1: uint size)

      :param id:   row ID
      :param size: number of rows to be returned
      :return:     row IDs that are most similar to the row ``id``

      Returns ``size`` rows (at maximum) which are most similar to the row ``id``.

   .. mpidl:method:: list<id_with_score> similar_row_from_datum(0: datum row, 1: uint size)

      :param row:  original :mpidl:type:`datum` to be completed (possibly some values are missing)
      :param size: number of rows to be returned
      :return:     rows that most have a similar datum to ``row``

      Returns ``size`` rows (at maximum) that most have similar :mpidl:type:`datum` to ``row``.

   .. mpidl:method:: datum decode_row(0: string id)

      :param id:   row ID
      :return:     :mpidl:type:`datum` for the given row ``id``

      Returns the :mpidl:type:`datum` in the row ``id``.
      Note that irreversibly converted :mpidl:type:`datum` (processed by ``fv_converter``) will not be decoded.

   .. mpidl:method:: list<string> get_all_rows()

      :return:     list of all row IDs

      Returns the list of all row IDs.

   .. mpidl:method:: float calc_similarity(0: datum lhs, 1:datum rhs)

      :param lhs:  :mpidl:type:`datum`
      :param rhs:  another :mpidl:type:`datum`
      :return:     similarity between ``lhs`` and ``rhs``

      Returns the similarity between two :mpidl:type:`datum`.

   .. mpidl:method:: float calc_l2norm(0: datum row)

      :param row:  :mpidl:type:`datum`
      :return:     L2 norm for the given ``row``

      Returns the value of L2 norm for the ``row``.
