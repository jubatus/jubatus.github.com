Anomaly
-------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/anomaly.idl>`_ for detailed specification.


Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each filed below:

.. describe:: method

   Specify algorithm for anomaly detection.
   You can use these algorithms.

   .. table::

      ==================== ===================================
      Value                Method
      ==================== ===================================
      ``"lof"``            Use Local Outlier Factor based on recommender. [Breunig2000]_
      ``"light_lof"``      Use a variant of LOF based on nearest neighbor.
      ==================== ===================================

.. describe:: parameter

   Specify parameters for the algorithm.
   Its format differs for each ``method``.

   lof
     :nearest_neighbor_num:
        Number of neighbors
        The bigger it is, the less false-positives are found, but the more false-negatives are found.
        (Integer)
     :reverse_nearest_neighbor_num:
        Number of reverse neighbors to update, when annomaly measure values are update.
        The bigger it is,  the more accurately measures are updated, but the longer update-time is required.
        (Integer)
     :method:
        Algorithm name of recommender for nearest neighbor search.
        Refer ``method`` in :doc:`api_recommender`.
     :parameter:
        Parameters of the recommender for nearest neighbor search.
        Refer ``parameter`` in :doc:`api_recommender`.

   light_lof
     :nearest_neighbor_num:
        Number of neighbors
        The bigger it is, the less false-positives are found, but the more false-negatives are found.
        (Integer)
     :reverse_nearest_neighbor_num:
        Number of reverse neighbors to update, when annomaly measure values are update.
        The bigger it is,  the more accurately measures are updated, but the longer update-time is required.
        (Integer)
     :method:
        Algorithm name of nearest neighbor for nearest neighbor search.
        Refer ``method`` in :doc:`api_nearest_neighbor`.
     :parameter:
        Parameters of the nearest neighbor for nearest neighbor search.
        Refer ``parameter`` in :doc:`api_nearest_neighbor`.


.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`fv_convert`.


Example:
  .. code-block:: javascript

     {
       "method" : "lof",
       "parameter" : {
         "nearest_neighbor_num" : 10,
         "reverse_nearest_neighbor_num" : 30,
         "method" : "euclid_lsh",
         "parameter" : {
           "hash_num" : 64,
           "table_num" : 4,
           "seed" : 1091,
           "probe_num" : 64,
           "bin_width" : 100,
           "retain_projection" : false
         }
       },
       "converter" : {
         "string_filter_types" : {},
         "string_filter_rules" : [],
         "num_filter_types" : {},
         "num_filter_rules" : [],
         "string_types" : {},
         "string_rules" : [
           { "key" : "*", "type" : "str", "sample_weight" : "bin", "global_weight" : "bin" }
         ],
         "num_types" : {},
         "num_rules" : [
           { "key" : "*", "type" : "num" }
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

.. mpidl:service:: anomaly

   .. mpidl:method:: bool clear_row(0: string id)

      :param id:   point ID to be removed
      :return:     True when the point was cleared successfully

      Clears a point data with ID ``id``.

   .. mpidl:method:: id_with_score add(0: datum row)

     :param row:  :mpidl:type:`datum` for the point
     :return:     Tuple of the point ID and the anomaly measure value

     Adds a point data ``row``.

   .. mpidl:method:: float update(0: string id, 1: datum row)

      :param id:   point ID to update
      :param row:  new :mpidl:type:`datum` for the point
      :return:     Anomaly measure value

      Updates the point ``id`` with the data ``row``.

   .. mpidl:method:: float overwrite(0: string id, 1: datum row)

      :param id:  point ID to overwrite
      :param row: new :mpidl:type:`datum` for the point
      :return:    Anomaly measure value

      Overwrites the point ``id`` with the data ``row``.

   .. mpidl:method:: float calc_score(0: datum row)

      :param row:  :mpidl:type:`datum`
      :return:     Anomaly measure value for given ``row``

      Calculates an anomaly measure value for the point data ``row`` without adding a point.

   .. mpidl:method:: list<string> get_all_rows()

      :return:     List of all point IDs

      Returns the list of all point IDs.
