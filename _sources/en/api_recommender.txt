Recommender
-----------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/recommender.idl>`_ for detailed specification.
* See :doc:`method` for detailed description of algorithms used in this server.


Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each filed below:

.. describe:: method

   Specify algorithm for recommender.
   You can use these algorithms.

   .. table::

      ==================== ===================================
      Value                Method
      ==================== ===================================
      ``"inverted_index"`` Use Inverted Index.
      ``"minhash"``        Use MinHash. [Li10]_
      ``"lsh"``            Use Locality Sensitive Hashing.
      ``"euclid_lsh"``     Use Euclid-distance LSH. [Andoni06]_
      ==================== ===================================


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
     :bit_num:
        Bit length of hash values.
        The bigger it is, the more accurate results you can get, but the more memory is required.
        (Integer)

   euclid_lsh
     :lsh_num:
        Number of hash values.
        The bigger it is, the more accurate results you can get, but the fewer results you can find and the more memory is required.
        (Integer)
     :table_num:
        Number of tables
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


.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`fv_convert`.


Example:
  .. code-block:: javascript

     {
       "method": "inverted_index"
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
       },
     }


Data Structures
~~~~~~~~~~~~~~~

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

.. describe:: bool clear_row(0: string name, 1: string id)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
     - ``id`` : row ID to be removed

   - Returns:

     - True when the row was cleared successfully

   Removes the given row ``id`` from the recommendation table.


.. describe:: bool update_row(0: string name, 1: string id, 2: datum row)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
     - ``id`` : row ID
     - ``row`` : datum for the row

   - Returns:

     - True if this function updates models successfully

   Updates the row whose id is ``id`` with given ``row``.
   If the row with the same ``id`` already exists, the row is differential updated with ``row``.
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


.. describe:: datum complete_row_from_datum(0: string name, 1: datum row)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
     - ``row`` : original datum to be completed (possibly some values are missing).

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


.. describe:: similar_result similar_row_from_datum(0: string name, 1: datum row, 2: uint size)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
     - ``row`` : original datum to be completed (possibly some values are missing)
     - ``size`` : number of rows to be returned

   - Returns:

     - rows that most have a similar datum to ``row``

   Returns ``size`` rows (at maximum) that most have similar datum to datum ``row``.


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


.. describe:: float calc_similarity(0: string name, 1: datum lhs, 2:datum rhs)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
     - ``lhs`` : datum
     - ``rhs`` : another datum

   - Returns:

     - similarity between ``lhs`` and ``rhs``

   Returns the similarity between two datum.


.. describe:: float calc_l2norm(0: string name, 1: datum row)

   - Parameters:

     - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
     - ``row`` : datum

   - Returns:

     - L2 norm for the given ``row``

   Returns the value of L2 norm for the datum ``row``.
