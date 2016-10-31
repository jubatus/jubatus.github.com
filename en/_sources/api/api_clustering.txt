Clustering
----------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/clustering.idl>`_ for detailed specification.
* See :doc:`../method` for detailed description of algorithms used in this server.

Configuration
~~~~~~~~~~~~~

configuration is given as a JSON file.
We show each field below:

.. describe:: method

   Specify algorithm for clustering.
   You can use these algorithms.

   .. table::

      ==================== ===================================
      Vaule                Method
      ==================== ===================================
      ``"kmeans"``         Use k-means
      ``"gmm"``            Use Gaussian Mixture Model
      ``"dbscan"``         Use dbscan
      ==================== ===================================

.. describe:: parameter

   Specify parameters for the algorithm.
   Its format differs for each ``method``.

   kmeans, gmm
      :k:
         Number of clusters.
         (Integer)

         * Range: 1 <= ``k``

     :seed:
        Specify seed used to generate random number.
        (Integer)

        * Range: 0 <= ``seed`` <= :math:`2^{32} - 1`

   dbscan
      :eps:
         Specify the distance to define neighbor points.
         The bigger it is, the more points can be regarded as neighbor points.
         (Float)

         * Range: 0 < ``eps``

      :min_core_point:
         Specify the minimum density (number of neighbor points) required to  make a cluster.
         The bigger it is, the less areas can be regarded as clusters.
         (Integer)

         * Range: 1 <= ``min_core_point``

.. describe:: compressor_method

   Specify algorithm for compressing points.
   You can use these algorithms.

   .. table::

      ==================== ==========================================
      Vaule                Method
      ==================== ==========================================
      ``"simple"``         no compression
      ``"compressive"``    use coresets compression(only kmeans, gmm)
      ==================== ==========================================

.. describe:: compressor_parameter

   Specify parameters for the compressor.
   Its format differs for each ``compressor_method``.

   simple
     :bucket_size:
        Number of data points to trigger mini batch.
        Clustering will run for each time ``bucket_size`` data is pushed.
        Note that the initial clustering will not run until ``k`` data is pushed when ``method`` is ``kmeans`` or ``gmm``.
        (Integer)

        * Range: 2 <= ``bucket_size``

   compresive
     :bucket_size:
        Number of data points to trigger mini batch and compression.
        Clustering will run for each time ``bucket_size`` data is pushed.
        Note that the initial clustering will not run until ``k`` data is pushed when ``method`` is ``kmeans`` or ``gmm``.
        (Integer)

        * Range: 2 <= ``bucket_size``

     :bucket_length:
        Size of mini batch clustering.
        (Integer)

        * Range: 2 <= ``bucket_length``

     :compressed_bucket_size:
        Number of compressed ``bucket_size`` .
        Compression ratio = ( ``compressed_bucket_size`` / ``bucket_size`` )
        (Integer)

        * Range: ``bicriteria_base_size`` <= ``compressed_bucket_size`` <= ``bucket_size``

     :bicriteria_base_size:
        Specify roughness of compression.
        (Integer)

        * Range: 1 <= ``bicriteria_base_size`` < ``compressed_bucket_size``

     :forgetting_factor:
        Forgetting factor
        (Float)

        * Range: 0.0 <= ``forgetting_factor``

     :forgetting_threshold:
        When the summation of forgetting factors exceeds this value, it will not compress any more.
        (Float)

        * Range: 0.0 <= ``forgetting_threshold`` <= 1.0

     :seed:
        Specify seed used to generate random number.
        (Integer)

        * Range: 0 <= ``seed`` <= :math:`2^{32} - 1`

.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`../fv_convert`.


Example:
  .. code-block:: javascript

     {
       "method" : "kmeans",
       "parameter" : {
         "k" : 3,
         "seed" : 0
       },
       "compressor_method" : "compressive_kmeans",
       "compressor_parameter" : {
         "bucket_size" : 1000,
         "compressed_bucket_size" : 100,
         "bicriteria_base_size" : 10,
         "bucket_length" : 2,
         "forgetting_factor" : 0.0,
         "forgetting_threshold" : 0.5,
         "seed" : 0
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

.. mpidl:message:: weighted_datum

   .. mpidl:member:: 0: double weight

   .. mpidl:member:: 1: datum point

.. mpidl:message:: indexed_point

   .. mpidl:member:: 0: string id

   .. mpidl:member:: 1: datum point

.. mpidl:message:: weighted_index

   .. mpidl:member:: 0: double weight

   .. mpidl:member:: 1: string id

Methods
~~~~~~~

.. mpidl:service:: clustering

   .. mpidl:method:: bool push(0: list<indexed_point> points)

      :param points: list of :mpidl:type:`indexed_point` for the points.
                     ``indexed_point`` is a tuple of string id and datum
      :return:     True when the point was added successfully

      Adds points. 

   .. mpidl:method:: uint get_revision()

      :return:     revision of cluster

      Return revesion of cluster.

   .. mpidl:method:: list<list<weighted_datum > > get_core_members()

      :return:     coreset of cluster

      Returns coreset of cluster in datum.
      This method is not supported in ``dbscan``.

   .. mpidl:method:: list<list<weighted_index > > get_core_members_light()

      :return:     coreset of cluster

      Returns coreset of cluster in index.
      This method is not supported in ``dbscan``.

   .. mpidl:method:: list<datum> get_k_center()

      :return:     cluster centers

      Returns ``k`` cluster centers.

   .. mpidl:method:: datum get_nearest_center(0: datum point)

      :param point:  :mpidl:type:`datum`
      :return:     nearest cluster center

      Returns nearest cluster center without adding ``point`` to cluster.
      This method is not supported in ``dbscan``.

   .. mpidl:method:: list<weighted_datum > get_nearest_members(0: datum point)

      :param point: :mpidl:type:`datum`
      :return:     coreset

      Returns nearest summary of cluster(coreset) from ``point``.
      Its format is a list of tuples of weight and datum.
      This method is not supported in ``dbscan``.

   .. mpidl:method:: list<weighted_index > get_nearest_members_light(0: datum point)

      :param point: :mpidl:type:`datum`
      :return:     coreset

      Returns nearest summary of cluster(coreset) from ``point``.
      Its format is a list of tuples of weight and id.
      This method is not supported in ``dbscan``.
