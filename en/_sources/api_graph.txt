Graph
-----

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/graph.idl>`_ for detailed specification.

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
        The bigger it is, the more sensitive to graph structure PageRank score is, but the larger  biases it causes.
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

.. mpidl:message:: node

   Represents the node information.

   .. mpidl:member:: 0: map<string, string> property

      Property information for the node.

   .. mpidl:member:: 1: list<ulong> in_edges

      List of ID of incoming edges.

   .. mpidl:member:: 2: list<ulong> out_edges

      List of ID of outgoing edges.

   .. code-block:: c++

      message node {
        0: map<string, string>  property
        1: list<ulong>  in_edges
        2: list<ulong>  out_edges
      }

.. mpidl:message:: query

   Represents a query.

   .. mpidl:member:: 0: string from_id

   .. mpidl:member:: 1: string to_id

   .. code-block:: c++

      message query {
        0: string from_id
        1: string to_id
      }

.. mpidl:message:: preset_query

   Represents a preset query.
   See the description below for details.

   .. mpidl:member:: 0: list<query> edge_query

   .. mpidl:member:: 1: list<query> node_query

   .. code-block:: c++

      message preset_query {
        0: list<query> edge_query
        1: list<query> node_query
      }

.. mpidl:message:: edge

   Represents the edge information.

   .. mpidl:member:: 0: map<string, string> property

      Property information for the edge.

   .. mpidl:member:: 1: string source

      ID of the source node that the edge connects.

  .. mpidl:member:: 2: string target

     ID of the target node that the edge connects.

   .. code-block:: c++

      message edge {
        0: map<string, string> property
        1: string source
        2: string target
      }

.. mpidl:message:: shortest_path_query

   Represents a shortest path query information.
   See the description of ``get_shortest_path`` method for details.

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

.. mpidl:service:: graph

   .. mpidl:method:: string create_node()

      Creates a node on the graph.
      Returns a node ID as string.


   .. mpidl:method:: bool remove_node(0: string node_id)

      Removes a node ``node_id`` from the graph.


   .. mpidl:method:: bool update_node(0: string node_id, 1: map<string, string> property)

      Updates the property of the node ``node_id`` to ``property``.


   .. mpidl:method:: ulong create_edge(0: string node_id, 1: edge e)

      Creates a link from ``e.source`` to ``e.target``.
      Returns a edge ID as an unsigned long integer.

      The link has a direction.
      For any two nodes, multiple links with the same direction can be created.
      In this case, property ``e.property`` can be associated to each link (see ``edge``).

      ``node_id`` must be the same value as ``e.source``.


   .. mpidl:method:: bool update_edge(0: string node_id, 1: ulong edge_id, 2: edge e)

      Updates an existing edge ``edge_id`` with information ``e``.
      Property will be replaced.

      ``node_id`` must be the same value as ``e.source``.


   .. mpidl:method:: bool remove_edge(0: string node_id, 1: ulong edge_id)

      Removes an edge ``edge_id``.
      ``node_id`` must be an ID for the source node of the edge ``edge_id``.


   .. mpidl:method:: double get_centrality(0: string node_id, 1: int centrality_type, 2: preset_query query)

      Calculates (gets the computed value) the centrality over the edges that match the preset query ``query``.
      The query must be registered beforehand by using ``add_centrality_query``.

      ``centrality_type`` is a type of centrality.
      Currently, only ``0`` (PageRank centrality) can be specified.

      Centrality is computed when mix runs, thus there may be a gap between the exact value of centrality and the computed value if there're updates not mixed.
      See also the description of ``update_index``.


   .. mpidl:method:: bool add_centrality_query(0: preset_query query)

      Adds a preset query ``query`` to the graph for centrality calculation.


   .. mpidl:method:: bool add_shortest_path_query(0: preset_query query)

      Adds a preset query ``query`` to the graph for shortest path calculation.


   .. mpidl:method:: bool remove_centrality_query(0: preset_query query)

      Removes a preset query ``query`` from the graph.


   .. mpidl:method:: bool remove_shortest_path_query(0: preset_query query)

      Removes a preset query ``query`` from the graph.


   .. mpidl:method:: list<string> get_shortest_path(0: shortest_path_query query)

      Calculates (from the precomputed data) a shortest path from ``query.source`` to ``query.target`` that matches the preset query.
      The query must be registered beforehand by using ``add_shortest_path_query``.
      Returns a list of node IDs that represents a path from ``query.source`` to ``query.target``.

      If the shortest path from ``query.source`` to ``query.target`` cannot be found within ``query.max_hop`` hops, the result will be truncated.

      Path-index tree may have a gap between the exact path and the computed path when in a distributed setup.
      See also the description of ``update_index``.


   .. mpidl:method:: bool update_index()

      Runs mix locally. **Do not use in distributed mode**.

      Some functions like ``get_centrality`` and ``get_shortest_path`` uses an index that is updated in the mix operation.
      In a standalone mode, mix is not automatically called thus users must call this API by themselves.


   .. mpidl:method:: node get_node(0: string node_id)

      Gets the ``node`` for a node ``node_id``.


   .. mpidl:method:: edge get_edge(0: string node_id, 1: ulong edge_id)

      Gets the ``edge`` of an edge ``edge_id``.
      ``node_id`` is an ID for the source node of the edge ``edge_id``.
