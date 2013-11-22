Python
=================

Here we explain the sample program of Graph in Python.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'train_route.json'; 2) how to create the graph with 'create_graph.py', and how to learn the training data and calculate the shortest path with the example file ‘search_route.py’. Here are the source codes.


**train_route.json**

.. code-block:: js
 :linenos:

 {
   "method": "graph_wo_index",
   "parameter": {
     "damping_factor" : 0.9,
     "landmark_num" : 256
   }
 }
 

**create_graph.py**

.. code-block:: python
 :linenos:

 #!/usr/bin/env python
 # -*- coding: utf-8 -*-
 
 import urllib
 from xml.dom import minidom, Node
 
 from jubatus.graph import client, types
 
 host = '127.0.0.1'
 port = 9199
 instance_name = ''
 
 stations = {}
 
 class station_join():
     def __init__(self, station1, station2):
         self.station1 = station1
         self.station2 = station2
 
 def get_station_join(line_cd):
     '''
     Create array of `station_join` that represents which stations are connected.
 
     In this example, we are connecting stations BY NAME, i.e., two stations
     with the same name are regarded as connected and can be transferred to
     each other.
     '''
     join_list = []
     url = 'http://www.ekidata.jp/api/n/' + str(line_cd) + '.xml'
     dom = minidom.parse(urllib.urlopen(url))
     for join_node in dom.getElementsByTagName('station_join'):
         for join_node_child in join_node.childNodes:
             if join_node_child.nodeType == Node.TEXT_NODE:
                 continue
             name = join_node_child.nodeName
             value = join_node_child.childNodes.item(0).nodeValue
             if name == 'station_name1':
                 station_name1 = value
             elif name == 'station_name2':
                 station_name2 = value
         join_list += [ station_join(station_name1, station_name2) ]
     return join_list
 
 def create_graph(c, join_list):
     for join in join_list:
         # Create nodes for stations.
         s1_node_id = add_station(c, join.station1)
         s2_node_id = add_station(c, join.station2)
 
         # Create bi-directional edge between two nodes.
         edge_1 = types.Edge({}, s1_node_id, s2_node_id)
         edge_2 = types.Edge({}, s2_node_id, s1_node_id)
         c.create_edge(s1_node_id, edge_1)
         c.create_edge(s2_node_id, edge_2)
 
         # Comment-out this line if you're running in distributed mode.
         c.update_index()
 
 def add_station(c, name):
     if name in stations:
         node_id = stations[name]
     else:
         node_id = c.create_node()
         c.update_node(node_id, {'name': name})
         stations[name] = node_id
     return node_id
 
 def print_stations():
     for station in sorted(stations.keys(), key=lambda k: int(stations[k])):
         print "%s\t%s" % (stations[station], station)
 
 if __name__ == '__main__':
     # Create jubagraph client.
     c = client.Graph(host, port, instance_name)
 
     # Prepare query.
     pq = types.PresetQuery([], [])
     c.add_shortest_path_query(pq)
 
     # Register stations in each line.
     # Do not add too much lines to prevent causing heavy load to the API server.
     create_graph(c, get_station_join(11302)) # 山手線
     create_graph(c, get_station_join(11312)) # 中央線
 
     # Print station IDs; you need the ID to search route.
     print "=== Station IDs ==="
     print_stations()


 
 
**search_route.py**

.. code-block:: python
 :linenos:

 #!/usr/bin/env python
 # -*- coding: utf-8 -*-
 
 import sys
 from jubatus.graph import client, types
 
 host = '127.0.0.1'
 port = 9199
 instance_name = ''
 
 def search_route(from_id, to_id):
     c = client.Graph(host, port, instance_name)
 
     pq = types.PresetQuery([], [])
     spreq = types.ShortestPathQuery(from_id, to_id, 100, pq)
     stations = c.get_shortest_path(spreq)
 
     print "Pseudo-Shortest Path (hops) from %s to %s:" % (from_id, to_id)
     for station in stations:
         node = c.get_node(station)
         station_name = ''
         if 'name' in node.property:
             station_name = node.property['name']
         print "  %s\t%s" % (station, station_name)
 
 if __name__ == '__main__':
     if len(sys.argv) < 2:
         print "Usage: %s from_station_id to_station_id" % sys.argv[0]
         sys.exit(1)
     search_route(str(sys.argv[1]), str(sys.argv[2]))



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

create_graph.py generates a graph composed of Yamanote-line and Chuou-line. The client program in Graph will use the 'Graph' class defined in 'jubatus.graph'. Here are the 5 methods used in the sample.

1. Connect to Jubatus Server
    Connect to Jubatus Server (Line 74).

    Setting the IP addr, RPC port of Jubatus Server and the unique name for task identification in Zookeeper.

2. Regist the preset query
    The 'add_shortest_path_query' method must be registered beforehand. Therefore, the 'PresetQuery' is made (Line 77) and registed by 'add_shortest_path_query' (Line 78).

3. Generate the graph
    Make the graph composed of Yamanote-line and Chuou-line.
    Firstly, the method [create_graph] is called at (Line 82-83).
    The first argument in [create_graph] is the Graph made in Step. 1.
    The second argument is the return value from method [get_station_join].

    Method [get_station_join] makes the combination list of two neighbor stations.
    The station XML file is downloaded from Web (Line 29-30).
    Contents of the XML file likes below.
    In this sample program, we ignore the factor of 'distance', and only consider the connections between stations. So, the values in <station_name1>, <station_name2> are not used in the program.

    .. code-block:: xml

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
    The number of instance created in [StationJoin] is the same as the number of <station_join> tags, and they are sotred in the ArrayList that created at Line 28 （Line 31-41).

    Next, we make the graph by using the list created above (Line 44-57).
    The method [create_graph] performs the following task.

    * Add station information and ID.
        Insert node into graph. Here, a node means a station. (eg. Shinagawa, Ochanomizu, Tokyo, etc.)

    * Create links between the added two neighbor stations
        Make the bi-link between the registed station to its neighbor stations. Here, a link means a route. (eg. Harajuku <-> Shibuya, etc.)

    3-1. Add station information and ID.
        Method [add_station] is called (Line 47-48), to add every pair of neighboring nodes <station1, station2> in to the graph. 
        Method [add_station] will check the map of 'stations'. If the map contains the specified station, the station_id will be returned; Otherwise, a new node is created, and its ID is returned after storing the nodeID and station name into the 'stations' map (Line 59-66).
        Mehods [create_node] and [update_node] in Graph regist the new node.
        first, [create_node] method is called and the returned value is the nodeId.
        After that, a node is added into the graph. Then, we regist the key-value <name, "station name"> into the 'property' (Line 63).
        Finally, [update_node] method updates the 'property' with the node created at Line 63 (Line 64).

    3-2. Create links between the added two neighbor stations
       After adding the two neighbor stations by method [addStation], we create the bi-links between station1 and station2 (Line 51-54).
       Method [create_edge] is used to create the bi-links.
       The second argument means the start node's ID. The third argument is an edge instance, which has the nodeID of both start and end nodes of the edge.

    The [update_index] method in Line 57 is used for locally Mix operation, do not use it in distributed environment.

4. Show the stations
    In step 3-1, station name and station ID(nodeID) are stored into the "stations". Here, we output the stations names by the ascending order of their IDs (Line 68-70).

**search_route.py**

'search_route.py' finds the shortest path between every 2 stations from the graph that made by create_graph.py.
The method it used is the "get_shortest_path".

1. Connect to Jubatus Server
    Connect to Jubatus Server (Line 12).

    Setting the IP addr, RPC port of Jubatus Server and the unique name for task identification in Zookeeper.

2. Prepare the query
    Prepare the query for the shortest path calculation (Line 14-15).
    Create the ShortestPathQuery required by the [get_shortest_path] method (Line 15).
    Store the start node's & end node's nodeIDs into the first & second arguments in the 'types.ShortestPathQuery'. The third argument is the number of 'maxhop', the search process will be truncated if it fails to find the route within the specified number of 'maxhop'.
    Also note, the query should be registed by "add_shortest_path_query" beforehand.

3. Calculate the shortes path
    By specifying the "ShortestPathQuery" that created in Step.2, [get_shortest_path] method will find the shortest path (Line 16). 

4. Show the results
    Show the ID of stations that on the shortes path calculated in Step 3 (Line 18-24).


------------------------------------
Run the sample program
------------------------------------

* At Jubatus Server
    start "jubagraph" process.

    ::

     $ jubagraph --configpath train_route.json

* At Jubatus Client
    * Create graph
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

        Output of the station name, and their station ID (node ID on graph).

    * Search the shortest path
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
