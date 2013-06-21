Python
=================

Here we explain the sample program of Graph in Python.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'train_route.json'; 2) how to create the graph with 'create_graph.py', and how to learn the training data and calculate the shortest path with the example file ‘search_route.py’. Here are the source codes.


**train_route.json**

.. code-block:: python

 1 : {
 2 :   "method": "graph_wo_index",
 3 :   "parameter": {
 4 :     "damping_factor" : 0.9,
 5 :     "landmark_num" : 256
 6 :   }
 7 : }
 

**create_graph.py**

.. code-block:: python

 01 : #!/usr/bin/env python
 02 : # -*- coding: utf-8 -*-
 03 : 
 04 : import urllib
 05 : from xml.dom import minidom, Node
 06 : 
 07 : from jubatus.graph import client, types
 08 : 
 09 : host = '127.0.0.1'
 10 : port = 9199
 11 : instance_name = ''
 12 : 
 13 : stations = {}
 14 : 
 15 : class station_join():
 16 :     def __init__(self, station1, station2):
 17 :         self.station1 = station1
 18 :         self.station2 = station2
 19 : 
 20 : def get_station_join(line_cd):
 21 :     '''
 22 :     Create array of `station_join` that represents which stations are connected.
 23 : 
 24 :     In this example, we are connecting stations BY NAME, i.e., two stations
 25 :     with the same name are regarded as connected and can be transferred to
 26 :     each other.
 27 :     '''
 28 :     join_list = []
 29 :     url = 'http://www.ekidata.jp/api/n/' + str(line_cd) + '.xml'
 30 :     dom = minidom.parse(urllib.urlopen(url))
 31 :     for join_node in dom.getElementsByTagName('station_join'):
 32 :         for join_node_child in join_node.childNodes:
 33 :             if join_node_child.nodeType == Node.TEXT_NODE:
 34 :                 continue
 35 :             name = join_node_child.nodeName
 36 :             value = join_node_child.childNodes.item(0).nodeValue
 37 :             if name == 'station_name1':
 38 :                 station_name1 = value
 39 :             elif name == 'station_name2':
 40 :                 station_name2 = value
 41 :         join_list += [ station_join(station_name1, station_name2) ]
 42 :     return join_list
 43 : 
 44 : def create_graph(c, join_list):
 45 :     for join in join_list:
 46 :         # Create nodes for stations.
 47 :         s1_node_id = add_station(c, join.station1)
 48 :         s2_node_id = add_station(c, join.station2)
 49 : 
 50 :         # Create bi-directional edge between two nodes.
 51 :         edge_1 = types.edge({}, s1_node_id, s2_node_id)
 52 :         edge_2 = types.edge({}, s2_node_id, s1_node_id)
 53 :         c.create_edge(instance_name, s1_node_id, edge_1)
 54 :         c.create_edge(instance_name, s2_node_id, edge_2)
 55 : 
 56 :         # Comment-out this line if you're running in distributed mode.
 57 :         c.update_index(instance_name)
 58 : 
 59 : def add_station(c, name):
 60 :     if name in stations:
 61 :         node_id = stations[name]
 62 :     else:
 63 :         node_id = c.create_node(instance_name)
 64 :         c.update_node(instance_name, node_id, {'name': name})
 65 :         stations[name] = node_id
 66 :     return node_id
 67 : 
 68 : def print_stations():
 69 :     for station in sorted(stations.keys(), key=lambda k: int(stations[k])):
 70 :         print "%s\t%s" % (stations[station], station)
 71 : 
 72 : if __name__ == '__main__':
 73 :     # 1. Connect to Jubatus Server
 74 :     c = client.graph(host, port)
 75 : 
 76 :     # 2. Regist the preset query
 77 :     pq = types.preset_query([], [])
 78 :     c.add_shortest_path_query(instance_name, pq)
 79 : 
 80 :     # 3. Generate the graph
 81 :     create_graph(c, get_station_join(11302)) # 山手線
 82 :     create_graph(c, get_station_join(11312)) # 中央線
 83 : 
 84 :     # 4. Show the Station IDs
 85 :     print "=== Station IDs ==="
 86 :     print_stations()


 
 
**search_route.py**

.. code-block:: python

 01 : #!/usr/bin/env python
 02 : # -*- coding: utf-8 -*-
 03 : 
 04 : import sys
 05 : from jubatus.graph import client, types
 06 : 
 07 : host = '127.0.0.1'
 08 : port = 9199
 09 : instance_name = ''
 10 : 
 11 : def search_route(from_id, to_id):
 12 :     # 1. Connect to Jubatus Server
 13 :     c = client.graph(host, port)
 14 : 
 15 :     # 2. Prepare the query
 16 :     pq = types.preset_query([], [])
 17 :     spreq = types.shortest_path_query(from_id, to_id, 100, pq)
 18 :     
 19 :     # 3. Calculate the shortest path
 20 :     stations = c.get_shortest_path(instance_name, spreq)
 21 : 
 22 :     # 4. Return the results
 23 :     print "Pseudo-Shortest Path (hops) from %s to %s:" % (from_id, to_id)
 24 :     for station in stations:
 25 :         node = c.get_node(instance_name, station)
 26 :         station_name = ''
 27 :         if 'name' in node.property:
 28 :             station_name = node.property['name']
 29 :         print "  %s\t%s" % (station, station_name)
 30 : 
 31 : if __name__ == '__main__':
 32 :     if len(sys.argv) < 2:
 33 :         print "Usage: %s from_station_id to_station_id" % sys.argv[0]
 34 :         sys.exit(1)
 35 :     search_route(str(sys.argv[1]), str(sys.argv[2]))



--------------------------------
Explanation
--------------------------------

**train_route.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON filed.

 * method
 
  Specify the algorithm used in graph mining. Currently, In this example, we use the graph without indexing, so we specify it "graph_wo_index".  
  
 * parameter
 
  Specify the parameters to be passed to the algorithm.
  We specify two parameter here, "damping_factor" and "landmark_num".
  "damping_factor" is the damping factor used in PageRank calculation. It adjusts scores for nodes with differenct degrees.The bigger it is, the more sensitive to graph structure PageRank score is, but the larger biases it causes. In the original paper, 0.85 is good.
  "landmark_num" is used for shortest path calculation. The bigger it is, more accurate value you can get, but the more memory is required. 


**create_graph.py**


 create_graph.py generates a graph composed of Yamanote-line and Chuou-line. The client program in Graph will use the 'GraphClient' class defined in 'jubatus.graph'. Here are the 5 methods used in the sample.

 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 74).
  Setting the IP addr., RPC port of Jubatus Server.

 2. Regist the preset query
  
  The 'add_shortest_path_query' method must be registered beforehand. Therefore, the 'PresetQuery' is made (Row 77) and registed by 'add_shortest_path_query' (Row 78).

 3. Generate the graph

  Make the graph composed of Yamanote-line and Chuou-line.
  Firstly, the method [create_graph] is called at (Row 81-82).
  The first argument in [create_graph] is the GraphClient made in Step. 1. 
  The second argument is the return value from method [get_station_join].

  Method [get_station_join] makes the combination list of two neighbor stations.
  The station XML file is downloaded from Web (Row 29-30).
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
  The number of instance created in [StationJoin] is the same as the number of <station_join> tags, and they are sotred in the ArrayList that created at Row 28 （Row 31-41).
  
  Next, we make the graph by using the list created above (Row 44-57).
  The method [create_graph] performs the following task.

   3-1. Add station information and ID.
    Insert node into graph. Here, a node means a station. (eg. Shinagawa, Ochanomizu, Tokyo, etc.)
    
   3-2. Create links between the added two neighbor stations
    Make the bi-link between the registed station to its neighbor stations. Here, a link means a route. (eg. Harajuku <-> Shibuya, etc.)
  
  3-1. Add station information and ID.
   Method [add_station] is called (Row 47-48), to add every pair of neighboring nodes <station1, station2> in to the graph. 
   Method [add_station] will check the map of 'stations'. If the map contains the specified station, the station_id will be returned; Otherwise, a new node is created, and its ID is returned after storing the nodeID and station name into the 'stations' map (Row 59-66).
   Mehods [create_node] and [update_node] in GraphClient regist the new node.
   At first, [create_node] method is called with its argument set by an unique task name in the ZooKeeper cluster, and the returned value is the nodeId.
   After that, a node is added into the graph. Then, we regist the key-value <name, "station name"> into the 'property' (Row 63).
   Finally, [update_node] method updates the 'property' with the node created at Row 63 (Row 64).
   
  3-2. Create links between the added two neighbor stations
   After adding the two neighbor stations by method [addStation], we create the bi-links between station1 and station2 (Row 51-54).
   Method [create_edge] is used to create the bi-links.
   The second argument means the start node's ID. The third argument is an edge instance, which has the nodeID of both start and end nodes of the edge.
   
  The [update_index] method in Row 57 is used for locally Mix operation, do not use it in distributed environment.

 4. Show the stations

  In step 3-1, station name and station ID(nodeID) are stored into the "stations". Here, we output the stations names by the ascending order of their IDs (Row 68-70).
  
 **search_route.py**
 
 'search_route.py' finds the shortest path between every 2 stations from the graph that made by create_graph.py.
 The method it used is the "get_shortest_path".
  
  1. Connect to Jubatus Server

   Connect to Jubatus Server (Row 13).
   Setting the IP addr., RPC port of Jubatus Server.

   
  2. Prepare the query

   Prepare the query for the shortest path calculation (Row 16-17).
   Create the shortest_path_query required by the [get_shortest_path] method (Row 17).
   Store the start node's & end node's nodeIDs into the first & second arguments in the 'types.shortest_path_query'. The third argument is the number of 'maxhop', the search process will be truncated if it fails to find the route within the specified number of 'maxhop'.
   Also note, the query should be registed by "add_shortest_path_query" beforehand.
   
  3. Calculate the shortes path

   By specifying the "shortest_path_query" that created in Step.2, [get_shortest_path] method will find the shortest path (Row 20). 

  4. Show the results

   Show the ID of stations that on the shortes path calculated in Step 3 (Row 23-29).

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

 $ ./create_graph.py
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

 $ ./search_route.py 0 144
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

