Graph
-----

詳細は `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/graph.idl>`_ を参照してください。
.. See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/graph.idl>`_ for original and detailed spec.

Data Structures
~~~~~~~~~~~~~~~

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

Usage of Properties and Preset Queries
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To be filled

Methods
~~~~~~~

.. describe:: string create_node(0: string name)

グラフ内にノードを一つ追加し、nodeのidをstring形式で返す。

.. Creates a node on the graph named ``name``. This API broadcasts the request to the whole cluster.
.. Returns a node id as string.

.. describe:: int remove_node(0: string name, 1: string nid)

nodeのidをグラフ内から削除する。
..Removes a node from the cluster.

.. describe:: int update_node(0: string name, 1: string nid, 2: property p)

nodeのidで指定されたノードの属性を更新する。
..Updates the property of the node.

.. describe:: int create_edge(0: string name, 1: string nid, 2: edge_info ei)

``ei.src`` から ``ei.tgt`` に向けた枝を張り、interger形式のedge_idを返す。この枝には方向があり、複数張ることも出来る。
``ei.p`` で指定される属性はそれぞれの枝に適用される。

..Creates a link from ``ei.src`` to ``ei.tgt``. The link has direction.
..Multiple links with same direction can be created on each pair of nodes.
..Also, a property ``ei.p`` can be associated to each link: see ``edge_info``.

..Returns ``edge_id`` as integer.

.. describe:: int update_edge(0: string name, 1: string nid, 2: edge_id_t eid, 3: edge_info ei)

``edge_id`` で指定した枝の属性を更新する。属性は上書きされる。
..Updates an existing edge with a new property. Property is overwritten.


.. describe:: int remove_edge(0: string name, 1: string nid, 2: edge_id_t e)

指定した枝を取り除く。
.. Removes an edge.

.. describe:: double centrality(0: string name, 1: string nid, 2: centrality_type ct, 3: preset_query q)

あらかじめadd_centrality_queryで指定しているクエリー ``q`` に関するnode id ``nid`` の中心性を求める。
..Calculates (gets the computed value) the centrality over the edges that match the preset query ``q`` .
..Currently there's only PageRank centrality.
中心性は、mixの度に徐々に計算されるため、その時点では正確な値ではないかもしれない。
..Centrality is computed when mix runs, thus there may be a gap between the exact value of centrality
..and the computed value if there're updates not mixed.

.. describe:: bool add_centrality_query(0: string name, 1: preset_query q)

中心性の算出を行いたいクエリー ``q`` を新たに登録する。
.. Sets a preset query to the graph for centrality calculation.

.. describe:: bool add_shortest_path_query(0: string name, 1: preset_query q)

最短パスの算出を行いたいクエリー ``q`` を新たに登録する。
..Sets a preset query to the graph for shortest path calculation.

.. describe:: bool remove_centrality_query(0: string name, 1: preset_query q)

中心性の算出を行いたいクエリー ``q`` を削除する。

..Removes a preset query from the graph for centrality calculation.
..The query is compared with exact key-value whole match with another one.

.. describe:: bool remove_shortest_path_query(0: string name, 1: preset_query q)

最短パスの算出を行いたいクエリー ``q`` を削除する。
..Removes a preset query from the graph for shortest path calculation.

.. describe:: list<node_id>  shortest_path(0: string name, 1: shortest_path_req r)

``r.src`` から ``r.tgt`` への最短パスを ``node_id`` のリストで返す。
Path-index Treeはmixの度に更新されるためこの最短パスは、必ずしも最短であるとは限らない。
..Path-index tree is computed when mix runs, thus there may be a gap between the exact path
..and the computed path if there're updates not mixed.


.. describe:: int update_index(0: string name)

mixをローカルで実行する。 **この関数は分散環境で利用してはならない。**
..Run mix locally. **Do not use in distributed mode**.
スタンドアローン環境では、mixは自動的に呼ばれないため、適切なタイミングで呼び続ける必要がある。   
..In a standalone mode, mix is not automatically called thus users must call this API by thierselves.

.. describe:: int clear(0: string name)

すべてのデータを削除する。
..Clears the whole data in a cluster.

.. describe:: node_info get_node(0: string name, 1: string nid)

指定したノードの ``node_info`` を取得する。
..Gets the ``node_info`` of a node, which includes property, ids of incoming edge and outgoing edge.

.. describe:: edge_info get_edge(0: string name, 1: string nid, 2: edge_id_t e)

指定したエッジの ``edge_info`` を取得する。
..Gets the ``edge_info`` of an edge, which includes property, source node and target node.
