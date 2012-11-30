Graph
-----

詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/graph.idl>`_ を参照してください。

Data Structures
~~~~~~~~~~~~~~~

.. describe:: property

 ノードまたはエッジの key-value の属性値を表す。

.. code-block:: c++

  type property = map<string, string> 

.. describe:: node_info

 ノードの情報を表す。
 ``in_edges`` はノードに向かうエッジの ID のリストである。
 ``out_edges`` はノードから出るエッジの ID のリストである。

.. code-block:: c++

  message node_info {
    0: property p
    1: list<ulong>  in_edges
    2: list<ulong>  out_edges
  }

.. describe:: preset_query

 プリセットクエリーを表す。
 詳細は以下の説明を参照すること。

.. code-block:: c++

  message preset_query {
    0: list<tuple<string, string> > edge_query
    1: list<tuple<string, string> > node_query
  }

.. describe:: edge_info

 エッジの情報を表す。
 ``src`` はこのエッジの接続元のノードの ID である。
 ``tgt`` はこのエッジの接続先のノードの ID である。

.. code-block:: c++

  message edge_info {
    0: property p
    1: string src
    2: string tgt
  }

.. describe:: shortest_path_req

 最短パスリクエストの情報を表す。
 詳細は ``shortest_path`` メソッドの説明を参照すること。

.. code-block:: c++

  message shortest_path_req {
    0: string src
    1: string tgt
    2: uint max_hop
    3: preset_query q
  }

Usage of Properties and Queries
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

属性とクエリーは共に、 ``{ 'key' : 'value', 'key2' : 'value2', ... }`` のような key-value ペアで表される。
あるクエリーが属性にマッチする条件は、「クエリーに含まれるすべてのキーが属性に存在し、かつ、対応する値が完全に一致すること」である。
属性とクエリーに含まれる key-value の順序は無関係である。

例えば、以下の場合はマッチする:

::

   query:    { 'key' : 'value' }
   property: { 'key' : 'value', 'foo' : 'bar' }

以下の場合は、マッチしない (``key`` に対応する値が異なるため):

::

   query:    { 'key' : 'wrong' }
   property: { 'key' : 'value', 'foo' : 'bar' }

以下の場合もマッチしない (キー ``spam`` は property に存在しないため):

::

   query:    { 'key' : 'value', 'spam': 'ham' }
   property: { 'key' : 'value', 'foo' : 'bar' }

Methods
~~~~~~~

各メソッドの最初のパラメタ ``name`` は、タスクを識別するクラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. describe:: string create_node(0: string name)

 グラフ内にノードを一つ追加する。
 ノードの ID をstring形式で返す。

.. describe:: int remove_node(0: string name, 1: string nid)

 ノード ``nid`` をグラフ内から削除する。

.. describe:: int update_node(0: string name, 1: string nid, 2: property p)

 ノード ``nid`` の属性を ``p`` に更新する。

.. describe:: ulong create_edge(0: string name, 1: string nid, 2: edge_info ei)

 ``ei.src`` から ``ei.tgt`` に向けたエッジを張る。
 エッジの ID を long unsigned integer 形式で返す。

 このエッジには方向を持つ。
 ある二つのノードに対して、複数のエッジを張ることもできる。
 この場合、リンクごとに異なる属性 ``ei.p`` を適用することができる (``edge_info`` を参照)。

 ``nid`` には ``ei.src`` と同じ値を指定する必要がある。

.. describe:: int update_edge(0: string name, 1: string nid, 2: ulong eid, 3: edge_info ei)

 エッジ ``eid`` の属性 ``ei`` で更新する。
 属性は上書きされる。

 ``nid`` には ``ei.src`` と同じ値を指定する必要がある。

.. describe:: int remove_edge(0: string name, 1: string nid, 2: ulong e)

 指定したエッジを取り除く。
 ``nid`` にはエッジ ``e`` の接続元のノードの ID を指定する必要がある。

.. describe:: double centrality(0: string name, 1: string nid, 2: int ct, 3: preset_query q)

 プリセットクエリ― ``q`` にマッチする、ノード ID ``nid`` の中心性を計算 (予め算出された値を取得) する。
 クエリーはあらかじめ ``add_centrality_query`` で登録しておく必要がある。

 ``ct`` には中心性の種類を指定する。
 現在は ``0`` (PageRank) のみがサポートされている。

 中心性は、mixの度に徐々に計算されるため、その時点では正確な値ではないかもしれない。
 ``update_index`` の説明も参照すること。

.. describe:: bool add_centrality_query(0: string name, 1: preset_query q)

 中心性の算出を行いたいクエリー ``q`` を新たに登録する。

.. describe:: bool add_shortest_path_query(0: string name, 1: preset_query q)

 最短パスの算出を行いたいクエリー ``q`` を新たに登録する。

.. describe:: bool remove_centrality_query(0: string name, 1: preset_query q)

 中心性の算出を行いたいクエリー ``q`` を削除する。

.. describe:: bool remove_shortest_path_query(0: string name, 1: preset_query q)

 最短パスの算出を行いたいクエリー ``q`` を削除する。

.. describe:: list<node_id>  shortest_path(0: string name, 1: shortest_path_req r)

 プリセットクエリ― ``r.q`` にマッチする、 ``r.src`` から ``r.tgt`` への最短パスを (予め算出された値から) 計算する。
 クエリーはあらかじめ ``add_shortest_path_query`` で登録しておく必要がある。
 ``r.src`` から ``r.tgt`` までの経路のノード ID のリストを返す。

 ``r.src`` から ``r.dst`` までの最短パスが ``r.max_hop`` ホップ以内に発見できなかった場合は、結果は切り詰められる。

 Path-index Treeはmixの度に更新されるためこの最短パスは、必ずしも最短であるとは限らない。
 ``update_index`` の説明も参照すること。

.. describe:: int update_index(0: string name)

 mix をローカルで実行する。 **この関数は分散環境で利用してはならない。**

 ``centrality`` や ``shortest_path`` などの関数は mix のタイミングでアップデートされるインデックスを参照する。
 スタンドアローン環境では、mix は自動的に呼ばれないため、ユーザ自身でこの API を呼び出す必要がある。

.. describe:: int clear(0: string name)

 すべてのデータを削除する。

.. describe:: node_info get_node(0: string name, 1: string nid)

 ノード ``nid`` の ``node_info`` を取得する。

.. describe:: edge_info get_edge(0: string name, 1: string nid, 2: ulong e)

 エッジ ``e`` の ``edge_info`` を取得する。
 ``nid`` にはエッジ ``eid`` の接続元のノードの ID を指定する必要がある。
