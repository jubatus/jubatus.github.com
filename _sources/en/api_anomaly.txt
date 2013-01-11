Anomaly
-------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/anomaly.idl>`_ for detailed specification.


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
      ``"lof"``            Use Local Outlier Factor. [Breunig2000]_
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


.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`fv_convert`.


Example:
  .. code-block:: javascript

     {
       "method" : "lof",
       "parameter" : {
         "nearest_neighbor_num" : 100,
         "reverse_nearest_neighbor_num" : 30,
         "method" : "euclid_lsh",
         "parameter" : {
           "lsh_num" : 8,
           "table_num" : 8,
           "probe_num" : 8,
           "bin_width" : 8.2,
           "seed" : 1234,
           "retain_projection" : true
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

None.

Methods
~~~~~~~

For all methods, the first parameter of each method (``name``) is a string value to uniquely identify a task in the ZooKeeper cluster.
When using standalone mode, this must be left blank (``""``).

.. describe:: bool clear_row(0: string name, 1: string id)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
     - ``id`` : point ID to be removed

   - Returns:

     - True when the point was cleared successfully

   Clears a point data with ID ``id``.


.. describe:: tuple<string, float> add(0: string name, 1: datum row)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
     - ``row`` : datum

   - Returns:

     - Tuple of the point ID and the anomaly measure value

   Adds a point data ``row``.


.. describe:: float update(0: string name, 1: string id, 2: datum row)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
     - ``id`` : point ID to update
     - ``row`` : new value for the point

   - Returns:

     - Anomaly measure value

   Updates the point ``id`` with the given datum ``d``.


.. describe:: bool clear(0: string name)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster

   - Returns:

     - True when the model was cleared successfully

   Completely clears the model.


.. describe:: float calc_score(0: string name, 1: datum row)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
     - ``row`` : datum

   - Returns:

     - Anomaly measure value

   Calculates an anomaly measure value for datum ``row`` without adding a point.


.. describe:: list<string>  get_all_rows(0: string name)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster

   - Returns:

     - list of all point IDs

   Returns the list of all point IDs.
