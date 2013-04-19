Ruby
=================

ここではRuby版のGraphサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするtrain_route.json、グラフ作成を行うcreate_graph.rb、最短経路を計算するsearch_route.rbを利用します。以下にソースコードを記載します。

**train_route.json**

.. code-block:: python

 1 : {
 2 :   "method": "graph_wo_index",
 3 :   "parameter": {
 4 :     "damping_factor" : 0.9,
 5 :     "landmark_num" : 256
 6 :   }
 7 : }
 

**create_graph.rb**

.. code-block:: ruby

 001 : #!/usr/bin/env ruby
 002 : # -*- coding: utf-8 -*-
 003 : 
 004 : $host = "127.0.0.1"
 005 : $port = 9199
 006 : $name = "trainRoute"
 007 : 
 008 : @stations = {}
 009 : 
 010 : require 'json'
 011 : require 'open-uri'
 012 : require 'rexml/document'
 013 : 
 014 : require 'jubatus/graph/client'
 015 : require 'jubatus/graph/types'
 016 : 
 017 : class Station_join
 018 :   def initialize(station1, station2)
 019 :     @station1 = station1
 020 :     @station2 = station2
 021 :   end
 022 :   attr_accessor :station1, :station2
 023 : end
 024 : 
 025 : def get_station_join(line_cd)
 026 :   join_list = []
 027 :   
 028 :   # プロキシ設定
 029 :   pxy = "http://proxyHost:proxyPort"
 030 :   usr = "user"
 031 :   pss = "password"
 032 : 
 033 :   options = { :proxy_http_basic_authentication => [pxy, usr, pss]}
 034 :   url = "http://www.ekidata.jp/api/n/" + line_cd.to_s + ".xml"
 035 :   open(url, options) {|f|
 036 :     doc = REXML::Document.new(f)
 037 :     doc.elements.each("ekidata/station_join") {|station_join|
 038 :       station1 = ""
 039 :       station2 = ""
 040 :       station_join.elements.each{|child|
 041 :         if child.name == "station_name1"
 042 :           station1 = child.text
 043 :         elsif child.name == "station_name2"
 044 :           station2 = child.text
 045 :         end
 046 :       }
 047 :       join_list <<  Station_join.new(station1, station2)
 048 :     }
 049 :   }
 050 :   return join_list
 051 : end
 052 : 
 053 : # 3. グラフの作成
 054 : def create_graph(c, join_list)
 055 :   for join in join_list do
 056 :     s1_node_id = add_station(c, join.station1)
 057 :     s2_node_id = add_station(c, join.station2)
 058 : 
 059 :     edge1 = Jubatus::Graph::Edge.new({}, s1_node_id, s2_node_id)
 060 :     edge2 = Jubatus::Graph::Edge.new({}, s2_node_id, s1_node_id)
 061 :     c.create_edge($name, s1_node_id, edge1)
 062 :     c.create_edge($name, s2_node_id, edge2)
 063 : 
 064 :     c.update_index($name)
 065 :   end
 066 : end
 067 : 
 068 : def add_station(c, name)
 069 :   node_id = ""
 070 :   if @stations.has_key?(name)
 071 :     node_id = @stations[name]
 072 :   else
 073 :     node_id = c.create_node($name)
 074 :     c.update_node($name, node_id, {"name" => name})
 075 :     @stations[name] = node_id
 076 :   end
 077 :   return node_id
 078 : end
 079 : 
 080 : # 4. 駅IDの表示
 081 : def print_stations()
 082 :   @stations.to_a.sort{|a, b|
 083 :     (b[1] <=> a[1]) * 2 + (a[0] <=> b[0])
 084 :   }
 085 :   @stations.each{|key, value|
 086 :     print (key.ljust(10) + value + "\n")
 087 :   }
 088 : end
 089 : 
 090 : 
 091 : # 1.Jubatus Serverへの接続設定
 092 : c = Jubatus::Graph::Client::Graph.new($host, $port)
 093 : 
 094 : # 2. プリセットクエリーを登録
 095 : pq = Jubatus::Graph::Preset_query.new([], [])
 096 : c.add_shortest_path_query($name, pq)
 097 : 
 098 : # 3. グラフの作成
 099 : create_graph(c, get_station_join(11302))
 100 : create_graph(c, get_station_join(11312))
 101 : 
 102 : # 4. 駅IDの表示
 103 : print ("=== Station IDs ===\n")
 104 : print_stations()



 
 
**search_route.rb**

.. code-block:: ruby

 01 : #!/usr/bin/env ruby
 02 : # -*- coding: utf-8 -*-
 03 : 
 04 : $host = "127.0.0.1"
 05 : $port = 9199
 06 : $name = "test"
 07 : 
 08 : @stations = {}
 09 : 
 10 : require 'json'
 11 : 
 12 : require 'jubatus/graph/client'
 13 : require 'jubatus/graph/types'
 14 : 
 15 : def search_route(from_id, to_id)
 16 :   # 1. Jubatus Serverへの接続設定
 17 :   c = Jubatus::Graph::Client::Graph.new($host, $port)
 18 :   
 19 :   # 2. クエリーの準備
 20 :   pq = Jubatus::Graph::Preset_query.new([], [])
 21 :   spreq = Jubatus::Graph::Shortest_path_query.new(from_id, to_id, 100, pq)
 22 : 
 23 :   # 3. 最短経路を計算
 24 :   stations = c.get_shortest_path($name, spreq)
 25 : 
 26 :   # 4. 結果の表示
 27 :   print ("Pseudo-Shortest Path (hops) from " + from_id + " to " + to_id + "\n")
 28 :   stations.each {|station|
 29 :     node = c.get_node($name, station)
 30 :     station_name = ""
 31 :     if node.property.has_key?("name")
 32 :       station_name = node.property["name"]
 33 :     end
 34 :     print (station.ljust(10) + station_name + "\n")
 35 :   }
 36 : 
 37 : end
 38 : 
 39 : if (ARGV.size < 2)
 40 :   print ("Usage: from_station_id to station_id")
 41 :   exit()
 42 : end



--------------------------------
解説
--------------------------------

**train_route.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下のとおりです。

 * method
 
  グラフ解析に使用するアルゴリズムを指定します。
  ここでは、インデックスのないグラフを利用するための "graph_wo_index" を指定します。
  
  
 * parameter
 
  アルゴリズムに渡すパラメータを指定します。
  ここでは2つのパラメータ、"damping_factor" と "landmark_num" を指定しています。
  "damping_factor" は、PageRank の計算におけるdamping factorで、次数の異なるノードのスコアを調整します。大きくすると構造をよく反映したスコアを出す代わりに、スコアに極端な偏りが発生します。
  "landmark_num" は最短パスにおいてランドマークの総数を指定します。大きくすると正確な最短パスに近づく代わりに、多くのメモリを消費します。


**create_graph.rb**

 create_graph.rbでは、山手線と中央線の接続を表すグラフを作成します。Graphのクライアントプログラムは、jubatus.graphクラス内で定義されているGraphClientクラスを利用して作成します。サンプルで使用するメソッドは、以下の5つです。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（92行目）。
  Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号を設定します。
  
 2. プリセットクエリーを登録

  最短経路を計算するために、クエリーをあらかじめadd_shortest_path_queryメソッドで登録しておく必要があります。
  そのためのクエリーを作成します(95行目)。
  add_shortest_path_queryメソッドで作成したクエリーを登録します(96行目)。
  
 3. グラフの作成

  山手線と中央線の接続を表すグラフを作成します。
  ここでは、create_graphメソッドを呼び出します(99, 100行目)。
  create_graphメソッドの第1引数は 1. で作成したクライアントです。
  第2引数には get_station_joinメソッドの戻り値を指定します。
  
  get_station_joinメソッドでは接続する2駅を組み合わせたリストを作成します。
  駅情報をWEB上にあるXMLファイルから取得します(28-49行目)
  取得したXMLファイルの構造は下記のようになっています。
  今回のプログラムでは駅間の距離などは考慮せず、駅の接続情報のみ用いるため、下記XMLファイルの<station_name1>、<station_name2>の値しかプログラム中では扱いません。
  
  ::
  
   <ekidata version="ekidata.jp station_join api 1.0">
   <station_join>
    <station_cd1>1131231</station_cd1>
    <station_cd2>1131232</station_cd2>
    <station_name1>西八王子</station_name1>
    <station_name2>高尾</station_name2>
    <lat1>35.656621</lat1>
    <lon1>139.31264</lon1>
    <lat2>35.642026</lat2>
    <lon2>139.282288</lon2>
   </station_join>
   <station_join>
    <station_cd1>1131230</station_cd1>
    <station_cd2>1131231</station_cd2>
    <station_name1>八王子</station_name1>
    <station_name2>西八王子</station_name2>
    <lat1>35.655555</lat1>
    <lon1>139.338998</lon1>
    <lat2>35.656621</lat2>
    <lon2>139.31264</lon2>
   </station_join>
   <station_join>
    <station_cd1>1131229</station_cd1>
    <station_cd2>1131230</station_cd2>
    <station_name1>豊田</station_name1>
    <station_name2>八王子</station_name2>
    <lat1>35.659502</lat1>
    <lon1>139.381495</lon1>
    <lat2>35.655555</lat2>
    <lon2>139.338998</lon2>
   </station_join>
   -以下略-
   

  次に取得した駅情報のXMLファイルの<station_cd1>の値をstation_joinクラスのインスタンス変数station1に、<station_cd2>の値をstation2に格納します。
  タグ<station_join>の数だけstation_joinクラスのインスタンスを作成し、26行目で作成したリストに格納していきます（37-48行目）。
  
  上記で作成したリストを用いて、グラフを作成します(54-66行目)。
  create_graphメソッドでは、以下の作業を行います。
  
   3-1. 駅情報の追加と駅IDの取得
    グラフ内にノードを追加します。ここでのノードは駅に相当します。（例. 品川駅、御茶ノ水駅、東京駅など）
    
   3-2. 追加した2駅の相互にエッジを張る
    登録した駅から隣接する駅へエッジを張ります。ここでのエッジは線路に相当します。（例.原宿⇒渋谷など）
    
  3-1. 駅情報の追加と駅IDの取得
   取得したリストの1要素から隣接する2駅station1とstation2をそれぞれノードとしてグラフ内に追加するため、add_stationメソッドを呼び出します（56, 57行目）。
   add_stationメソッドではハッシュstationsに、引数に指定した駅が含まれているかを確認し、含まれている場合はその駅のID nodeIdを返却し、含まれない場合は新たにノードを登録して駅名とnodeIdをstationsに格納した後にnodeIdを返却します（68-78行目）。
   ノードの登録はcreate_nodeメソッドとupdate_nodeメソッドで行います。
   まず、create_nodeメソッドを、引数にタスクを識別するZooKeeperクラスタ内でユニークな名前nameを指定して呼び出し、その戻り値をnodeIdとします(73行目)。
   そしてupdate_nodeメソッドで、73行目で作成したノードの属性を更新します(74行目)。
   
  3-2. 追加した2駅の相互にエッジを張る
   add_stationメソッドで隣接する2駅station1とstation2を追加した後に、station1からstation2へ向けたエッジとstation2からstation1へ向けたエッジを張ります（59-62行目）。
   エッジを張るためにはcreate_edgeメソッドを利用します。
   第2引数に接続元のnodeIDを指定し、第3引数には接続元と接続先のnodeIDを格納したエッジを指定します。
   
  64行目のupdate_indexメソッドはmixをローカルで実行するものです。分散環境では利用しないでください。
  
 4. 駅IDの表示

  3-1.で駅名と駅ID(nodeID)をstationsに格納しました。ここでは駅名を駅IDの昇順に並び替えて表示しています(81-88行目)。
  
 **search_route.rb**
 
 search_route.rbでは、create_graph.rbで作成したグラフから2駅間の最短経路を計算します。
 使用するメソッドは、最短経路を計算するためのget_shortest_pathメソッドです。
  
  1. Jubatus Serverへの接続設定

   Jubatus Serverへの接続を行います（17行目）。
   Jubatus ServerのIPアドレス，Jubatus ServerのRPCポート番号を設定します。
   
  2. クエリーの準備

   最短経路を計算するためのクエリーを準備します(20, 21行目)。
   最短経路を計算するためのget_shortest_pathメソッドに必要なshortest_path_queryを作成します(20行目)。
   types.shortest_path_queryの第1引数に接続元の駅ID、第2引数に接続先の駅IDを設定します。第3引数で指定したホップ以内に発見できなかった場合、結果は切り詰められます。
   またクエリーはあらかじめadd_shortest_path_queryで登録しておく必要があります。
   
  3. 最短経路の計算

   2.で作成したshortest_path_queryを指定して、get_shortest_pathを呼び出し、最短経路の計算をします(24行目)。
   
  4. 結果の表示

   3.で取得した最短経路で通過する駅を駅IDと関連付けて表示しています(27-35行目)。


------------------------------------
サンプルプログラムの実行
------------------------------------

［Jubatus Serverでの作業］

**サーバの起動**

jubagraphを起動します。

::

 $ jubagraph --configpath train_route.json 


［Jubatus Clientでの作業］

Jubatus 0.4.0 + Rubyクライアントをインストールしてください。

**グラフの作成**

鉄道の接続を表すグラフを作成します。

::

 $ ruby create_graph.rb
 === Station IDs ===
 0       品川
 1       大崎
 4       田町
 ...
 139     中野
 144     四ツ谷
 147     御茶ノ水
 ```

 駅名に対応する駅ID(グラフ上のnode ID) が出力されます。

**経路の探索**


2つの駅IDから最短経路を検索します。

::

 $ ruby search_route.rb 0 144
 Pseudo-Shortest Path (hops) from 0 to 144:
   0     品川
   4     田町
   7     浜松町
   10    新橋
   13    有楽町
   16    東京
   19    神田
   147   御茶ノ水
   144   四ツ谷


