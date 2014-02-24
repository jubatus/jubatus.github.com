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
   Its format differs for each ``method``.

   Common parameters kmeans and gmm
     :k:
        Number of clusters.
        (Integer)

        * Range: 1 <= ``k``

     :compressor_method:
        Specify alghorithm for compressing points.
        You can choose from ``simple``, ``compressive_kmeans`` and ``compressive_gmm``.

     :bucket_size:
        Number of bulk compression size.
        It can be smaller than dataset size.
        (Integer)

        * Range: 2 <= ``bucket_size``

     :bucket_length:
        Size of mini batch clustering.
        (Integer)

        * Range: 2 <= ``bucket_length``

     :compresed_bucket_size:
        Number of compressed ``bucket_size`` .
        Compression ratio = ( ``compressed_bucket_size`` / ``bucket_size`` )
        (Integer)

        * Range: ``bicriteria_base_size`` < ``compresed_backet_size`` < ``bucket_size``

     :bicriteria_base_size:
        Specify roughness of compression.
        (Integer)

        * Range: 1 <= ``bicriteria_base_size`` < ``compresed_backet_size``

     :forgetting_factor:
        Forgetting factor
        (Float)

        * Range: 0.0 <= ``forgetting_factor``

     :forgetting_threshold:
        When the summation of forgetting factors exceeds this value, it will not compress any more.
        (Float)

        * Range: 0.0 <= ``forgetting_threshold`` <= 1.0

   kmeans
     :compressor_method:
        Specify alghorithm for compressing points.
        You can choose from ``simple``, ``compressive_kmeans`` .
        (String)

   gmm
     :compressor_method:
        Specify alghorithm for compressing points.
        You can choose from ``simple``, ``compressive_gmm`` .
        (String)

.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`fv_convert`.


Example:
  .. code-block:: javascript

     {
       "method" : "kmeans",
       "parameter" : {
         "k" : 3,
         "compressor_method" : "compressive_kmeans",
         "bucket_size" : 1000,
         "compressed_bucket_size" : 100,
         "bicriteria_base_size" : 10,
         "bucket_length" : 2,
         "forgetting_factor" : 0.0,
         "forgetting_threshold" : 0.5
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
