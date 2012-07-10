jubatus::client::graph
----------------------

See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/graph.idl>`_ for original and detailed spec.

typedef
~~~~~~~

.. code-block:: c++

  type centrality_type = int
  type node_id = string
  type edge_id_t = ulong

  type property = map<string, string> 

  message node_info {
    0: property p
    1: list<edge_id_t>  in_edges
    2: list<edge_id_t>  out_edges
  }

  message preset_query {
    0: list<tuple<string, string> > edge_query
    1: list<tuple<string, string> > node_query
  }

  message edge_info {
    0: property p
    1: node_id src
    2: node_id tgt
  }

  message shortest_path_req {
    0: node_id src
    1: node_id tgt
    2: uint max_hop
    3: preset_query q
  }


How preset query matches to a property
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Properties and Queries are both represented as key-value pair like
``{ 'key' : 'value', 'key2' : 'value2', ... }``.
The condition when a query matches to a property is: all keys in a query MUST exist in a property and the corresponding value which belongs to the query and the property MUST match excactly. The ordering of each key-value in property/query does not matter.

This case matches:

::

   query:    { 'key' : 'value' }
   property: { 'key' : 'value', 'foo' : 'bar' }


This case does not match -- same key but different value:

::

   query:    { 'key' : 'wrong' }
   property: { 'key' : 'value', 'foo' : 'bar' }


This case does not match -- property ``spam`` does not exist:

::

   query:    { 'key' : 'value', 'spam': 'ham' }
   property: { 'key' : 'value', 'foo' : 'bar' }



graph methods
~~~~~~~~~~~~~

.. describe:: string create_node(0: string name)

Creates a node on the graph named ``name``. This API broadcasts the request to the whole cluster.
Returns a node id as string.

.. describe:: int remove_node(0: string name, 1: string nid)

Removes a node from the cluster.

.. describe:: int update_node(0: string name, 1: string nid, 2: property p)

Updates the property of the node.

.. describe:: int create_edge(0: string name, 1: string nid, 2: edge_info ei)

Creates a link from ``ei.src`` to ``ei.tgt``. The link has direction.
Multiple links with same direction can be created on each pair of nodes.
Also, a property ``ei.p`` can be associated to each link: see ``edge_info``.

Returns ``edge_id`` as integer.

.. describe:: int update_edge(0: string name, 1: string nid, 2: edge_id_t eid, 3: edge_info ei)

Updates an existing edge with a new property. Property is replaced.

.. describe:: int remove_edge(0: string name, 1: string nid, 2: edge_id_t e)

Removes an edge.

.. describe:: double centrality(0: string name, 1: string nid, 2: centrality_type ct, 3: preset_query q)

Calculates (gets the computed value) the centrality over the edges that match the preset query ``q`` .
Currently there's only PageRank centrality.

Centrality is computed when mix runs, thus there may be a gap between the exact value of centrality
and the computed value if there're updates not mixed.

.. describe:: bool add_centrality_query(0: string name, 1: preset_query q)

Sets a preset query to the graph for centrality calculation.

.. describe:: bool add_shortest_path_query(0: string name, 1: preset_query q)

Sets a preset query to the graph for shortest path calculation.

.. describe:: bool remove_centrality_query(0: string name, 1: preset_query q)

Removes a preset query from the graph for centrality calculation.
The query is compared with exact key-value whole match with another one.

.. describe:: bool remove_shortest_path_query(0: string name, 1: preset_query q)

Removes a preset query from the graph for shortest path calculation.

.. describe:: list<node_id>  shortest_path(0: string name, 1: shortest_path_req r)

Calculates (from the precomputed data) a shortest path from ``r.src`` to ``r.tgt``
that matches the preset query.

Path-index tree may have a gap between the exact path
and the computed path when in a distributed setup.


.. describe:: int update_index(0: string name)

Run mix locally. **Do not use in distributed mode**.

In a standalone mode, mix is not automatically called thus users must call this API by thierselves.

.. describe:: int clear(0: string name)

Clears the whole data in a cluster.

.. describe:: node_info get_node(0: string name, 1: string nid)

Gets the ``node_info`` of a node, which includes property, ids of incoming edge and outgoing edge.

.. describe:: edge_info get_edge(0: string name, 1: string nid, 2: edge_id_t e)

Gets the ``edge_info`` of an edge, which includes property, source node and target node.
