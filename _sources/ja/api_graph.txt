Graph
-----

詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/graph.idl>`_ を参照してください。

Data Structures
~~~~~~~~~~~~~~~

.. describe:: centrality_type

 中心性の種類を表す。
 現在、 ``0`` (PageRank) のみが指定可能である。

.. code-block:: c++

  type centrality_type = int

.. describe:: edge_id_t

 枝の ID を表す。

.. code-block:: c++

  type edge_id_t = ulong

.. describe:: property

 ノードまたは枝の key-value の属性値を表す。

.. code-block:: c++

  type property = map<string, string> 

.. describe:: node_info

 ノードの情報を表す。
 ``in_edges`` はノードに向かう枝の ID のリストである。
 ``out_edges`` はノードから出る枝の ID のリストである。

.. code-block:: c++

  message node_info {
    0: property p
    1: list<ulong>  in_edges
    2: list<ulong>  out_edges
  }

.. describe:: preset_query

 Preset query を表す。
 詳細は以下の説明を参照すること。

.. code-block:: c++

  message preset_query {
    0: list<tuple<string, string> > edge_query
    1: list<tuple<string, string> > node_query
  }

.. describe:: edge_info

 枝の情報を表す。
 ``src`` はこの枝の接続元のノードの ID である。
 ``tgt`` はこの枝の接続先のノードの ID である。

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

Usage of Properties and Preset Queries
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Property と Query は共に、 ``{ 'key' : 'value', 'key2' : 'value2', ... }`` のような Key-Value ペアで表される。
Query が Property にマッチする条件は、「Query に含まれるすべてのキーが Property に存在し、かつ、対応する値が完全に一致すること」である。Property と Query に含まれる Key-Value の順序は無関係である。

以下の場合は、マッチする:

::

   query:    { 'key' : 'value' }
   property: { 'key' : 'value', 'foo' : 'bar' }

以下の場合は、マッチしない (``key`` に対応する値が異なっている):

::

   query:    { 'key' : 'wrong' }
   property: { 'key' : 'value', 'foo' : 'bar' }

以下の場合もマッチしない (キー ``spam`` は property に存在しない):

::

   query:    { 'key' : 'value', 'spam': 'ham' }
   property: { 'key' : 'value', 'foo' : 'bar' }

Methods
~~~~~~~

各メソッドの最初のパラメタ ``name`` は、タスクを識別するクラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. describe:: string create_node(0: string name)

 グラフ内にノードを一つ追加する。
 nodeのidをstring形式で返す。

.. describe:: int remove_node(0: string name, 1: string nid)

 nodeのidをグラフ内から削除する。

.. describe:: int update_node(0: string name, 1: string nid, 2: property p)

 nodeのidで指定されたノードの属性を更新する。

.. describe:: ulong create_edge(0: string name, 1: string nid, 2: edge_info ei)

 ``ei.src`` から ``ei.tgt`` に向けた枝を張る。interger形式のedge_idを返す。
 この枝には方向を持つ。
 枝は複数張ることも出来る。
 ``ei.p`` で指定される属性はそれぞれの枝に適用される (``edge_info`` を参照)。

 作成された枝の ID が long unsigned integer で返却される。
 ``nid`` は ``ei.src`` と同じ値を指定する必要がある。

.. describe:: int update_edge(0: string name, 1: string nid, 2: edge_id_t eid, 3: edge_info ei)

 ``edge_id`` で指定した枝の属性を更新する。
 属性は上書きされる。
 ``nid`` と ``ei.src`` は同じ値を指定する必要がある。

.. describe:: int remove_edge(0: string name, 1: string nid, 2: edge_id_t e)

 指定した枝を取り除く。
 ``nid`` には枝 ``eid`` の接続元のノードの ID を指定する必要がある。

.. describe:: double centrality(0: string name, 1: string nid, 2: centrality_type ct, 3: preset_query q)

 あらかじめ ``add_centrality_query`` で指定しているクエリー ``q`` に関するノード ID ``nid`` の中心性を求める。
 現在は PageRank のみがサポートされている。

 中心性は、mixの度に徐々に計算されるため、その時点では正確な値ではないかもしれない。

.. describe:: bool add_centrality_query(0: string name, 1: preset_query q)

 中心性の算出を行いたいクエリー ``q`` を新たに登録する。

.. describe:: bool add_shortest_path_query(0: string name, 1: preset_query q)

 最短パスの算出を行いたいクエリー ``q`` を新たに登録する。

.. describe:: bool remove_centrality_query(0: string name, 1: preset_query q)

 中心性の算出を行いたいクエリー ``q`` を削除する。

.. describe:: bool remove_shortest_path_query(0: string name, 1: preset_query q)

 最短パスの算出を行いたいクエリー ``q`` を削除する。

.. describe:: list<node_id>  shortest_path(0: string name, 1: shortest_path_req r)

 あらかじめ ``add_shortest_path_query`` で指定しているクエリー ``r.q`` に関して、``r.src`` から ``r.tgt`` への最短パスを計算する。
 戻り値はノード ID のリストである。
 ``r.src`` から ``r.dst`` までの最短パスが ``r.max_hop`` ホップ以内に発見できなかった場合は、結果は切り捨てられる。

 Path-index Treeはmixの度に更新されるためこの最短パスは、必ずしも最短であるとは限らない。

.. describe:: int update_index(0: string name)

 mixをローカルで実行する。 **この関数は分散環境で利用してはならない。**

 ``centrality`` や ``shortest_path`` などの関数は MIX のタイミングでアップデートされるインデックスを参照する。
 スタンドアローン環境では、mixは自動的に呼ばれないため、ユーザ自身でこの関数を呼び出す必要がある。

.. describe:: int clear(0: string name)

 すべてのデータを削除する。

.. describe:: node_info get_node(0: string name, 1: string nid)

 指定したノードの ``node_info`` を取得する。

.. describe:: edge_info get_edge(0: string name, 1: string nid, 2: edge_id_t e)

 指定した枝の ``edge_info`` を取得する。
 ``nid`` には枝 ``eid`` の接続元のノードの ID を指定する必要がある。
