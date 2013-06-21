Ruby
=================

Here we explain the sample program of Graph in Ruby.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'train_route.json'; 2) how to create the graph with 'create_graph.rb', and how to learn the training data and calculate the shortest path with the example file ‘search_route.rb’. Here are the source codes.


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
 028 :   # Set the proxy
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
 053 : # 3. generate graph
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
 080 : # 4. Show the Station ID
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
 091 : # 1. Connect to Jubatus Server
 092 : c = Jubatus::Graph::Client::Graph.new($host, $port)
 093 : 
 094 : # 2. Regist preset query
 095 : pq = Jubatus::Graph::Preset_query.new([], [])
 096 : c.add_shortest_path_query($name, pq)
 097 : 
 098 : # 3. Create graph
 099 : create_graph(c, get_station_join(11302))
 100 : create_graph(c, get_station_join(11312))
 101 : 
 102 : # 4. Show the station ID
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
 16 :   # 1. Connect to Jubatus Server
 17 :   c = Jubatus::Graph::Client::Graph.new($host, $port)
 18 :   
 19 :   # 2. Prepare query
 20 :   pq = Jubatus::Graph::Preset_query.new([], [])
 21 :   spreq = Jubatus::Graph::Shortest_path_query.new(from_id, to_id, 100, pq)
 22 : 
 23 :   # 3. Calculate the shortest path
 24 :   stations = c.get_shortest_path($name, spreq)
 25 : 
 26 :   # 4. Show the result
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
Explanation
--------------------------------

The configuration information is given by the JSON unit. Here is the meaning of each JSON filed.

 * method
 
  Specify the algorithm used in graph mining. Currently, In this example, we use the graph without indexing, so we specify it "graph_wo_index".  
  
 * parameter
 
  Specify the parameters to be passed to the algorithm.
  We specify two parameter here, "damping_factor" and "landmark_num".
  "damping_factor" is the damping factor used in PageRank calculation. It adjusts scores for nodes with differenct degrees.The bigger it is, the more sensitive to graph structure PageRank score is, but the larger biases it causes. In the original paper, 0.85 is good.
  "landmark_num" is used for shortest path calculation. The bigger it is, more accurate value you can get, but the more memory is required. 


**create_graph.rb**


 create_graph.rb generates a graph composed of Yamanote-line and Chuou-line. The client program in Graph will use the 'GraphClient' class defined in 'jubatus.graph'. Here are the 5 methods used in the sample.

 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 92).
  Setting the IP addr., RPC port of Jubatus Server.

 2. Regist the preset query
  
  The 'add_shortest_path_query' method must be registered beforehand. Therefore, the 'PresetQuery' is made (Row 95) and registed by 'add_shortest_path_query' (Row 96).
  
 3. Generate the graph

  Make the graph composed of Yamanote-line and Chuou-line.
  Firstly, the private method [create_graph] is called at (Row 99-100).
  The first argument in [create_graph] is the GraphClient made in Step. 1. 
  The second argument is the return value from method [get_station_join].

  Method [get_station_join] makes the combination list of two neighbor stations.
  The station XML file is downloaded from Web (Row 28-49).
  Contents of the XML file likes below.
  In this sample program, we ignore the factor of 'distance', and only consider the connections between stations. So, the values in <station_name1>, <station_name2> are not used in the program.  
   
  ::
  
   <ekidata version="ekidata.jp station_join api 1.0">
   <station_join>
    <station_cd1>1131231</station_cd1>
    <station_cd2>1131232</station_cd2>
    <station_name1>Nichi-Hachioji</station_name1>
    <station_name2>Takao</station_name2>
    <lat1>35.656621</lat1>
    <lon1>139.31264</lon1>
    <lat2>35.642026</lat2>
    <lon2>139.282288</lon2>
   </station_join>
   <station_join>
    <station_cd1>1131230</station_cd1>
    <station_cd2>1131231</station_cd2>
    <station_name1>Hachioji</station_name1>
    <station_name2>Nichi-Hachioji</station_name2>
    <lat1>35.655555</lat1>
    <lon1>139.338998</lon1>
    <lat2>35.656621</lat2>
    <lon2>139.31264</lon2>
   </station_join>
   <station_join>
    <station_cd1>1131229</station_cd1>
    <station_cd2>1131230</station_cd2>
    <station_name1>Toyota</station_name1>
    <station_name2>Hachioji</station_name2>
    <lat1>35.659502</lat1>
    <lon1>139.381495</lon1>
    <lat2>35.655555</lat2>
    <lon2>139.338998</lon2>
   </station_join>
   -Snip-

  Now, we input the value of <station_cd1> in the XML file into the instance variable 'station1' in [StationJoin] class, and the value of <station_cd2> in to 'station2'.
  The number of instance created in [StationJoin] is the same as the number of <station_join> tags, and they are sotred in the ArrayList that created at Row 26 （Row 37-48).
  
  Next, we make the graph by using the list created above (Row 54-66).
  The method [create_graph] performs the following task.

   3-1. Add station information and ID.
    Insert node into graph. Here, a node means a station. (eg. Shinagawa, Ochanomizu, Tokyo, etc.)
    
   3-2. Create links between the added two neighbor stations
    Make the bi-link between the registed station to its neighbor stations. Here, a link means a route. (eg. Harajuku <-> Shibuya, etc.)    

  3-1. Add station information and ID.
   Method [add_station] is called (Row 56-57), to add every pair of neighboring nodes <station1, station2> in to the graph. 
   Method [add_station] will check the map of 'stations'. If the map contains the specified station, the station_id will be returned; Otherwise, a new node is created, and its ID is returned after storing the nodeID and station name into the 'stations' map (Row 68-78).
   Mehods [create_node] and [update_node] in GraphClient regist the new node.
   At first, [create_node] method is called with its argument set by an unique task name in the ZooKeeper cluster, and the returned value is the nodeId.
   After that, a node is added into the graph. Then, we regist the key-value <name, "station name"> into the 'property' (Row 73).
   Finally, [update_node] method updates the 'property' with the node created at Row 73 (Row 74).
   
  3-2. Create links between the added two neighbor stations
   After adding the two neighbor stations by method [addStation], we create the bi-links between station1 and station2 (Row 59-62).
   Method [create_edge] is used to create the bi-links.
   The second argument means the start node's ID. The third argument is an edge instance, which has the nodeID of both start and end nodes of the edge.
   
  The [update_index] method in Row 64 is used for locally Mix operation, do not use it in distributed environment.


 4. Show the stations

  In step 3-1, station name and station ID(nodeID) are stored into the "stations". Here, we output the stations names by the ascending order of their IDs (Row 81-88).
  
 **search_route.rb**
 
 'search_route.rb' finds the shortest path between every 2 stations from the graph that made by create_graph.rb.
 The method it used is the "get_shortest_path".

  1. Connect to Jubatus Server

   Connect to Jubatus Server (Row 17).
   Setting the IP addr., RPC port of Jubatus Server.

   
  2. Prepare the query

   Prepare the query for the shortest path calculation (Row 20-21).
   Create the shortest_path_query required by the [get_shortest_path] method (Row 20).
   Store the start node's & end node's nodeIDs into the first & second arguments in the 'types.shortest_path_query'. The third argument is the number of 'maxhop', the search process will be truncated if it fails to find the route within the specified number of 'maxhop'.
   Also note, the query should be registed by "add_shortest_path_query" beforehand.

  3. Calculate the shortes path

   By specifying the "shortest_path_query" that created in Step.2, [get_shortest_path] method will find the shortest path (Row 24). 

  4. Show the results

   Show the ID of stations that on the shortes path calculated in Step 3 (Row 27-35).


------------------------------------
Run the sample program
------------------------------------

［At Jubatus Server］

**Start server**

start "jubagraph" process.

::

 $ jubagraph --configpath train_route.json 


［At Jubatus Client］

Install the Jubatus 0.4.0 + Python client.


**Create graph**

Make the railway route graph.

::

 $ ruby create_graph.rb
 === Station IDs ===
 0       Shinagawa
 1       Osaki
 4       Tamachi
 ...
 139     Nagano
 144     Yotsuya
 147     Ochanomizu
 ```

Output of the station name, and their station ID (node ID on graph).


**Search the shortest path**


Search the shortest path between 2 stations.
 
::

 $ ruby search_route.rb 0 144
 Pseudo-Shortest Path (hops) from 0 to 144:
   0     Shinagawa
   4     Tamachi
   7     Hamamatsucho
   10    Shinbashi
   13    Yurakucho
   16    Tokyo
   19    Kanda
   147   Ochanomizu
   144   Yotsuya


