Nearest Neighbor
================

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/nearest_neighbor.idl>`_ for detailed specification.
* See :doc:`method` for detailed description of algorithms used in this server.


Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each field below:

.. describe:: method

   Specify algorithm for nearest neighbor.
   You can use these algorithms.

   .. table::

      ==================== ===============================================================
      Value                Method
      ==================== ===============================================================
      ``"lsh"``            Use Locality Sensitive Hashing based on cosine similarity.
      ``"minhash"``        Use MinHash. [Ping2010]_
      ``"euclid_lsh"``     Use LSH based on cosine similarity for nearest neighbor search with Euclidean distance.
      ==================== ===============================================================


.. describe:: parameter

   Specify parameters for the algorithm.
   Its format differs for each ``method``.

   lsh
     :hash_num:
        Bit length of hash values.
        The bigger it is, the more accurate results you can get, but the more memory is required.
        (Integer)

   minhash
     :hash_num:
        Bit length of hash values.
        The bigger it is, the more accurate results you can get, but the more memory is required.
        (Integer)

   euclid_lsh
     :hash_num:
        Bit length of hash values.
        The bigger it is, the more accurate results you can get, but the more memory is required.
        (Integer)

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

.. mpidl:service:: nearest_neighbor

   .. mpidl:method:: bool set_row(0: string id, 1: datum d)

      :param id:   row ID
      :param row:  :mpidl:type:`datum` for the row
      :return:     True if this function updates models successfully

      Updates the row whose id is ``id`` with given ``row``.
      If the row with the same ``id`` already exists, the row is overwritten with ``row`` (note that this behavior is different from that of recommender).
      Otherwise, new row entry will be created.
      If the server that manages the row and the server that received this RPC request are same, this operation is reflected instantly.
      If not, update operation is reflected after mix.

   .. mpidl:method:: list<id_with_score> neighbor_row_from_id(0: string id, 1: uint size)

      :param id:  row ID in the nearest neighbor search table
      :param size: number of rows to be returned
      :return:     row IDs that are the nearest to the row ``id`` and their distance values

      Returns ``size`` rows (at maximum) that have most similar :mpidl:type:`datum` to ``id`` and their distance values.

   .. mpidl:method:: list<id_with_score> neighbor_row_from_data(0: datum query, 1: uint size)

      :param query: :mpidl:type:`datum` for nearest neighbor search
      :param size: number of rows to be returned
      :return:     row IDs that are the nearest to ``query`` and their distance values

      Returns ``size`` rows (at maximum) of which :mpidl:type:`datum` are most similar to ``query`` and their distance values.
                   
   .. mpidl:method:: list<id_with_score> similar_row_from_id(0: string id, 1: int ret_num)


      :param id:  row ID in the nearest neighbor search table
      :param ret_num: number of rows to be returned
      :return:     row IDs that are the nearest to the row ``id`` and their similarity values

      Returns ``ret_num`` rows (at maximum) that have most similar :mpidl:type:`datum` to ``id`` and their similarity values.

   .. mpidl:method:: list<id_with_score> similar_row_from_data(0: datum query, 1: int ret_num)

      :param query: :mpidl:type:`datum` for nearest neighbor search
      :param ret_num: number of rows to be returned
      :return:     row IDs that are the nearest to ``query`` and their similarity values

      Returns ``ret_num`` rows (at maximum) of which :mpidl:type:`datum` are most similar to ``query`` and their similarity values.
