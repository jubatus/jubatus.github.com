Clustering
----------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/clustering.idl>`_ for detailed specification.
* See :doc:`method` for detailed description of algorithms used in this server.

Configuration
~~~~~~~~~~~~~

configuration is given as a JSON file.
We show each filed below:

.. describe:: method

   Specify algorithm for clustering.
   You can use these algorithms.

   .. table::

      ==================== ===================================
      Vaule                Method
      ==================== ===================================
      ``"kmeans"``         Use k-means
      ``"gmm"``            Use Gaussian Mixture Model
      ==================== ===================================

.. describe:: parameter

   Specify parameters for the algorithm.
 
   :k:
     Number of clusters.
     (Integer)

   :compressor_method:
     Specify alghorithm for compressing points.
     You can choose from ``simple``, ``compressive_kmeans`` and ``compressive_gmm``. 

   :bucket_size:
     Number of bulk compression size.
     It can be smaller than dataset size.
     (Integer)

   :bucket_length:
     Size of mini batch clustering.
     (Integer)

   :compresed_bucket_size:
     Number of compressed bucket_size.
     Compression ratio = (compressed_bucket_size/bucket_size)
     (Integer)

   :bicriteria_base_size:
     Specify roughness of compression.
     (Integer)

   :forgetting_factor:
     forgetting factor
     (double)

   :forgetting_threshold:
     When the summation of forgetting factors exceeds this value, it will not compress any more.     
     (double)

.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`fv_convert`.


Example:
  .. code-block:: javascript

     {
       "method" : "simple",
       "parameter" : {
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


.. mpidl:service:: clustering

   .. mpidl:method:: bool push(0: list<datum> points)

      :points:     list of :mpidl:type:`datum` for the point 
      :return:     True when the point was added successfully

      Adds points. 

   .. mpidl:method:: uint get_revision()

      :return:     revision of cluster

      Return revesion of cluster

   .. mpidl:method:: list<list<weighted_datum > > get_core_members()

      :return:     coreset of cluster

      Returns coreset of cluster

   .. mpidl:method:: list<datum> get_k_center()

      :return:     cluster centers

      Returns ``k`` cluster centers

   .. mpidl:method:: datum get_nearest_center(0: datum point)

      :param point:  :mpidl:type:`datum`
      :return:     nearest cluster center

      Returns nearest cluster center without adding ``point`` to cluster.

   .. mpidl:method:: list<weighted_datum > get_nearest_members(0: datum point)

      :param point: :mpidl:type:`datum`
      :return:     coreset

      Returns nearest summary of cluster(coreset) from ``point``
