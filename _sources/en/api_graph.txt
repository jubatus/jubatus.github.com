Graph
-----

See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/graph.idl>`_ for detailed specification.

Data Structures
~~~~~~~~~~~~~~~

.. describe:: property

 Represents key-value properties for a node or an edge.

.. code-block:: c++

  type property = map<string, string> 

.. describe:: node_info

 Represents information for a node.
 ``in_edges`` is a list of ID of incoming edges.
 ``out_edges`` is a list of ID of outgoing edges.

.. code-block:: c++

  message node_info {
    0: property p
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

.. describe:: edge_info

 Represents information for an edge.
 ``src`` is an ID of the source node that the edge connects.
 ``tgt`` is an ID of the target node that the edge connects.

.. code-block:: c++

  message edge_info {
    0: property p
    1: string src
    2: string tgt
  }

.. describe:: shortest_path_req

 Represents a shortest path request information.
 See the description of ``shortest_path`` method for details.

.. code-block:: c++

  message shortest_path_req {
    0: string src
    1: string tgt
    2: uint max_hop
    3: preset_query q
  }

Usage of Properties and Queries
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Properties and Queries are both represented as key-value pair like ``{ 'key' : 'value', 'key2' : 'value2', ... }``.
The condition when a query matches to a property is: all keys in a query MUST exist in a property and the corresponding value which belongs to the query and the property MUST match excactly.
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

.. describe:: int remove_node(0: string name, 1: string nid)

 Removes a node ``nid`` from the graph.

.. describe:: int update_node(0: string name, 1: string nid, 2: property p)

 Updates the property of the node ``nid`` to ``p``.

.. describe:: ulong create_edge(0: string name, 1: string nid, 2: edge_info ei)

 Creates a link from ``ei.src`` to ``ei.tgt``.
 Returns a edge ID as a unsigned long integer.

 The link has a direction.
 For any two nodes, multiple links with the same direction can be created.
 In this case, property ``ei.p`` can be associated to each link (see ``edge_info``).

 ``nid`` must be the same value as ``ei.src``.

.. describe:: int update_edge(0: string name, 1: string nid, 2: ulong eid, 3: edge_info ei)

 Updates an existing edge ``eid`` with information ``ei``.
 Property will be replaced.

 ``nid`` must be the same value as ``ei.src``.

.. describe:: int remove_edge(0: string name, 1: string nid, 2: ulong e)

 Removes an edge ``e``.
 ``nid`` must be an ID for the source node of the edge ``e``.

.. describe:: double centrality(0: string name, 1: string nid, 2: int ct, 3: preset_query q)

 Calculates (gets the computed value) the centrality over the edges that match the preset query ``q``.
 The query must be registered beforehand by using ``add_centrality_query``.

 ``ct`` is a type of centrality.
 Currently, only ``0`` (PageRank centrality) can be specified.

 Centrality is computed when mix runs, thus there may be a gap between the exact value of centrality and the computed value if there're updates not mixed.
 See also the description of ``update_index``.

.. describe:: bool add_centrality_query(0: string name, 1: preset_query q)

 Adds a preset query ``q`` to the graph for centrality calculation.

.. describe:: bool add_shortest_path_query(0: string name, 1: preset_query q)

 Adds a preset query ``q`` to the graph for shortest path calculation.

.. describe:: bool remove_centrality_query(0: string name, 1: preset_query q)

 Removes a preset query ``q`` from the graph.

.. describe:: bool remove_shortest_path_query(0: string name, 1: preset_query q)

 Removes a preset query ``q`` from the graph.

.. describe:: list<string> shortest_path(0: string name, 1: shortest_path_req r)

 Calculates (from the precomputed data) a shortest path from ``r.src`` to ``r.tgt`` that matches the preset query.
 The query must be registered beforehand by using ``add_shortest_path_query``.
 Returns a list of node IDs that represents a path from ``r.src`` to ``r.tgt``.

 If the shortest path from ``r.src`` to ``r.dst`` cannot be found within ``r.max_hop`` hops, the result will be truncated.

 Path-index tree may have a gap between the exact path and the computed path when in a distributed setup.
 See also the description of ``update_index``.

.. describe:: int update_index(0: string name)

 Runs mix locally. **Do not use in distributed mode**.

 Some functions like ``centrality`` and ``shortest_path`` uses an index that is updated in the mix operation.
 In a standalone mode, mix is not automatically called thus users must call this API by themselves.

.. describe:: int clear(0: string name)

 Clears the whole data.

.. describe:: node_info get_node(0: string name, 1: string nid)

 Gets the ``node_info`` for a node ``nid``.

.. describe:: edge_info get_edge(0: string name, 1: string nid, 2: ulong e)

 Gets the ``edge_info`` of an edge ``e``.
 ``nid`` is an ID for the source node of the edge ``eid``.
