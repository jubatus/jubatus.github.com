Graph
-----

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/graph.idl>`_ for detailed specification.

Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each filed below:

.. describe:: method

   Specify algorithm for graph analysis.
   You can use these algorithms.

   .. table::

      ==================== ===================================
      Value                Method
      ==================== ===================================
      ``"graph_wo_index"`` Use graph without index.
      ==================== ===================================


.. describe:: parameter

   Specify parameters for the algorithm.
   Its format differs for each ``method``.

   graph_wo_index
     :damping_factor:
        Damping factor for PageRank.
        It adjusts scores for nodes with differenct degrees.
        The bigger it is, the more sensitive to ghraph structure PageRank score is, but the larger  biases it causes.
        In the original paper, 0.85 is good.
        (Float)
     :landmark_num:
        The number of landmarks for shortest path calculation.
        The bigger it is, more accurate value you can get, but the more memory is required.
        (Integer)


Example:
  .. code-block:: javascript

     {
       "method" : "graph_wo_index",
       "parameter" : {
         "damping_factor" : 0.9,
         "landmark_num" : 5
       }
     }


Data Structures
~~~~~~~~~~~~~~~

.. describe:: node

   Represents information for a node.
   ``in_edges`` is a list of ID of incoming edges.
   ``out_edges`` is a list of ID of outgoing edges.

   .. code-block:: c++

      message node {
        0: map<string, string>  property
        1: list<ulong>  in_edges
        2: list<ulong>  out_edges
      }


.. describe:: preset_query

   Represents a preset query.
   See the description below for details.

   .. code-block:: c++

      message preset_query {
        0: list<tuple<string, string> > edge_query
        1: list<tuple<string, string> > node_query
      }


.. describe:: edge

   Represents information for an edge.
   ``source`` is an ID of the source node that the edge connects.
   ``target`` is an ID of the target node that the edge connects.

   .. code-block:: c++

      message edge {
        0: map<string, string> property
        1: string source
        2: string target
      }


.. describe:: shortest_path_query

   Represents a shortest path query information.
   See the description of ``shortest_path`` method for details.

   .. code-block:: c++

      message shortest_path_query {
        0: string source
        1: string target
        2: uint max_hop
        3: preset_query query
      }


Usage of Properties and Queries
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Properties and Queries are both represented as key-value pair like ``{ 'key' : 'value', 'key2' : 'value2', ... }``.
The condition when a query matches to a property is: all keys in a query MUST exist in a property and the corresponding value which belongs to the query and the property MUST match exactly.
The ordering of each key-value in property/query does not matter.

For example, this case matches:

::

   query:    { 'key' : 'value' }
   property: { 'key' : 'value', 'foo' : 'bar' }

This case does not match -- same ``key`` but different value:

::

   query:    { 'key' : 'wrong' }
   property: { 'key' : 'value', 'foo' : 'bar' }

This case does not match -- key ``spam`` does not exist in ``property``:

::

   query:    { 'key' : 'value', 'spam': 'ham' }
   property: { 'key' : 'value', 'foo' : 'bar' }


Methods
~~~~~~~

For all methods, the first parameter of each method (``name``) is a string value to uniquely identify a task in the ZooKeeper cluster.
When using standalone mode, this must be left blank (``""``).

.. describe:: string create_node(0: string name)

   Creates a node on the graph.
   Returns a node ID as string.


.. describe:: bool remove_node(0: string name, 1: string node_id)

   Removes a node ``node_id`` from the graph.


.. describe:: bool update_node(0: string name, 1: string node_id, 2: map<string, string> property)

   Updates the property of the node ``node_id`` to ``property``.


.. describe:: ulong create_edge(0: string name, 1: string node_id, 2: edge e)

   Creates a link from ``e.source`` to ``e.target``.
   Returns a edge ID as an unsigned long integer.

   The link has a direction.
   For any two nodes, multiple links with the same direction can be created.
   In this case, property ``e.property`` can be associated to each link (see ``edge``).

   ``node_id`` must be the same value as ``e.source``.


.. describe:: bool update_edge(0: string name, 1: string node_id, 2: ulong edge_id, 3: edge e)

   Updates an existing edge ``edge_id`` with information ``e``.
   Property will be replaced.

   ``node_id`` must be the same value as ``e.source``.


.. describe:: bool remove_edge(0: string name, 1: string node_id, 2: ulong edge_id)

   Removes an edge ``edge_id``.
   ``node_id`` must be an ID for the source node of the edge ``edge_id``.


.. describe:: double get_centrality(0: string name, 1: string node_id, 2: int centrality_type, 3: preset_query query)

   Calculates (gets the computed value) the centrality over the edges that match the preset query ``query``.
   The query must be registered beforehand by using ``add_centrality_query``.

   ``centrality_type`` is a type of centrality.
   Currently, only ``0`` (PageRank centrality) can be specified.

   Centrality is computed when mix runs, thus there may be a gap between the exact value of centrality and the computed value if there're updates not mixed.
   See also the description of ``update_index``.


.. describe:: bool add_centrality_query(0: string name, 1: preset_query query)

   Adds a preset query ``query`` to the graph for centrality calculation.


.. describe:: bool add_shortest_path_query(0: string name, 1: preset_query query)

   Adds a preset query ``query`` to the graph for shortest path calculation.


.. describe:: bool remove_centrality_query(0: string name, 1: preset_query query)

   Removes a preset query ``query`` from the graph.


.. describe:: bool remove_shortest_path_query(0: string name, 1: preset_query query)

   Removes a preset query ``query`` from the graph.


.. describe:: list<string> get_shortest_path(0: string name, 1: shortest_path_query query)

   Calculates (from the precomputed data) a shortest path from ``query.source`` to ``query.target`` that matches the preset query.
   The query must be registered beforehand by using ``add_shortest_path_query``.
   Returns a list of node IDs that represents a path from ``query.source`` to ``query.target``.

   If the shortest path from ``query.source`` to ``query.target`` cannot be found within ``query.max_hop`` hops, the result will be truncated.

   Path-index tree may have a gap between the exact path and the computed path when in a distributed setup.
   See also the description of ``update_index``.


.. describe:: bool update_index(0: string name)

   Runs mix locally. **Do not use in distributed mode**.

   Some functions like ``get_centrality`` and ``get_shortest_path`` uses an index that is updated in the mix operation.
   In a standalone mode, mix is not automatically called thus users must call this API by themselves.


.. describe:: bool clear(0: string name)

   Clears the whole data.


.. describe:: node get_node(0: string name, 1: string node_id)

   Gets the ``node`` for a node ``node_id``.


.. describe:: edge get_edge(0: string name, 1: string node_id, 2: ulong edge_id)

   Gets the ``edge`` of an edge ``edge_id``.
   ``node_id`` is an ID for the source node of the edge ``edge_id``.
