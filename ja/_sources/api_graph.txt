Graph
-----

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/graph.idl>`_ を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: method

   グラフ解析に使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ==================== ===================================
      設定値               手法
      ==================== ===================================
      ``"graph_wo_index"`` インデックスのないグラフを利用する。
      ==================== ===================================


.. describe:: parameter

   アルゴリズムに渡すパラーメータを指定する。
   ``method`` に応じて渡すパラメータは異なる。

   graph_wo_index
     :damping_factor:
        PageRank の計算における damping factor で、次数の異なるノードのスコアを調整する。
        大きくすると構造をよく反映したスコアを出す代わりに、スコアに極端な偏りが発生する。
        元論文では 0.85 程度が良いとされている。
        (Float)
     :landmark_num:
        最短パスの計算においてランドマークの総数を指定する。
        大きくすると正確な最短パスに近づく代わりに、多くのメモリを消費する。
        (Integer)


例:
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

   ノードの情報を表す。

   .. mpidl:member:: 0: map<string, string> property

      ノードの持つ付加情報である。

   .. mpidl:member:: 1: list<ulong> in_edges

      ノードに向かうエッジの ID のリストである。

   .. mpidl:member:: 2: list<ulong> out_edges

      ノードから出るエッジの ID のリストである。

   .. code-block:: c++

      message node {
        0: map<string, string>  property
        1: list<ulong>  in_edges
        2: list<ulong>  out_edges
      }

.. mpidl:message:: query

   1つのクエリーを表す。

   .. mpidl:member:: 0: string from_id

   .. mpidl:member:: 1: string to_id

   .. code-block:: c++

      message query {
        0: string from_id
        1: string to_id
      }

.. mpidl:message:: preset_query

   プリセットクエリーを表す。
   詳細は以下の説明を参照すること。

   .. mpidl:member:: 0: list<query> edge_query

   .. mpidl:member:: 1: list<query> node_query

   .. code-block:: c++

      message preset_query {
        0: list<query> edge_query
        1: list<query> node_query
      }

.. mpidl:message:: edge

   エッジの情報を表す。

   .. mpidl:member:: 0: map<string, string> property

      エッジに付与された付加情報である。

   .. mpidl:member:: 1: string source

      このエッジの接続元のノードの ID である。

   .. mpidl:member:: 2: string target

      このエッジの接続先のノードの ID である。

   .. code-block:: c++

      message edge {
        0: map<string, string> property
        1: string source
        2: string target
      }

.. mpidl:message:: shortest_path_query

   最短パスリクエストの情報を表す。
   詳細は ``get_shortest_path`` メソッドの説明を参照すること。

   .. code-block:: c++

      message shortest_path_query {
        0: string source
        1: string target
        2: uint max_hop
        3: preset_query query
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

各メソッドの最初のパラメタ ``name`` は、タスクを識別する ZooKeeper クラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. mpidl:service:: graph

   .. mpidl:method:: string create_node()

      グラフ内にノードを一つ追加する。
      ノードの ID をstring形式で返す。


   .. mpidl:method:: bool remove_node(0: string node_id)

      ノード ``node_id`` をグラフ内から削除する。


   .. mpidl:method:: bool update_node(0: string node_id, 1: map<string, string> property)

      ノード ``node_id`` の属性を ``property`` に更新する。


   .. mpidl:method:: ulong create_edge(0: string node_id, 1: edge e)

      ``e.source`` から ``e.target`` に向けたエッジを張る。
      エッジの ID を unsigned long integer 形式で返す。

      このエッジは方向を持つ。
      ある二つのノードに対して、複数のエッジを張ることもできる。
      この場合、リンクごとに異なる属性 ``e.property`` を適用することができる (``edge`` を参照)。

      ``node_id`` には ``e.source`` と同じ値を指定する必要がある。


   .. mpidl:method:: bool update_edge(0: string node_id, 1: ulong edge_id, 2: edge e)

      エッジ ``edge_id`` の属性 ``e`` で更新する。
      属性は上書きされる。

      ``node_id`` には ``e.source`` と同じ値を指定する必要がある。


   .. mpidl:method:: bool remove_edge(0: string node_id, 1: ulong edge_id)

      指定したエッジ ``edge_id`` を取り除く。
      ``node_id`` にはエッジ ``edge_id`` の接続元のノードの ID を指定する必要がある。


   .. mpidl:method:: double get_centrality(0: string node_id, 1: int centrality_type, 2: preset_query query)

      プリセットクエリー ``query`` にマッチする、ノード ID ``node_id`` の中心性を計算 (予め算出された値を取得) する。
      クエリーはあらかじめ ``add_centrality_query`` で登録しておく必要がある。

      ``centrality_type`` には中心性の種類を指定する。
      現在は ``0`` (PageRank) のみがサポートされている。

      中心性は、mixの度に徐々に計算されるため、その時点では正確な値ではないかもしれない。
      ``update_index`` の説明も参照すること。


   .. mpidl:method:: bool add_centrality_query(0: preset_query query)

      中心性の算出に使用したいクエリー ``query`` を新たに登録する。


   .. mpidl:method:: bool add_shortest_path_query(0: preset_query query)

      最短パスの算出に使用したいクエリー ``query`` を新たに登録する。


   .. mpidl:method:: bool remove_centrality_query(0: preset_query query)

      登録済みのクエリー ``query`` を削除する。


   .. mpidl:method:: bool remove_shortest_path_query(0: preset_query query)

      登録済みのクエリー ``query`` を削除する。


   .. mpidl:method:: list<string> get_shortest_path(0: shortest_path_query query)

      プリセットクエリー ``query.query`` にマッチする、 ``query.source`` から ``query.target`` への最短パスを (予め算出された値から) 計算する。
      クエリーはあらかじめ ``add_shortest_path_query`` で登録しておく必要がある。
      ``query.source`` から ``query.target`` までの経路のノード ID のリストを返す。

      ``query.source`` から ``query.target`` までの最短パスが ``query.max_hop`` ホップ以内に発見できなかった場合は、結果は切り詰められる。

      Path-index Treeはmixの度に更新されるためこの最短パスは、必ずしも最短であるとは限らない。
      ``update_index`` の説明も参照すること。


   .. mpidl:method:: bool update_index()

      mix をローカルで実行する。 **この関数は分散環境で利用してはならない。**

      ``get_centrality`` や ``get_shortest_path`` などの関数は mix のタイミングでアップデートされるインデックスを参照する。
      スタンドアローン環境では、mix は自動的に呼ばれないため、ユーザ自身でこの API を呼び出す必要がある。


   .. mpidl:method:: node get_node(0: string node_id)

      ノード ``node_id`` の ``node`` を取得する。


   .. mpidl:method:: edge get_edge(0: string node_id, 1: ulong edge_id)

      エッジ ``edge_id`` の ``edge`` を取得する。
      ``node_id`` にはエッジ ``edge_id`` の接続元のノードの ID を指定する必要がある。
