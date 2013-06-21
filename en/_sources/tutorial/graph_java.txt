Java
==================

Here we explain the sample program of Graph in Java. 

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'train_route.json'; 2) how to learn the training data and calculate the shortest path with the example file ‘SearchRoute.java’. Here are the source codes of 'train_route.json' and 'SearchRoute.java'. 

**train_route.json**

.. code-block:: python

 1 : {
 2 :   "method": "graph_wo_index",
 3 :   "parameter": {
 4 :     "damping_factor" : 0.9,
 5 :     "landmark_num" : 256
 6 :   }
 7 : }
 

**CreateGraph.java**

.. code-block:: java

 001 : import java.io.InputStream;
 002 : import java.net.Authenticator;
 003 : import java.net.HttpURLConnection;
 004 : import java.net.PasswordAuthentication;
 005 : import java.net.URL;
 006 : import java.util.ArrayList;
 007 : import java.util.Collections;
 008 : import java.util.Comparator;
 009 : import java.util.HashMap;
 010 : import java.util.List;
 011 : import java.util.Map;
 012 : 
 013 : import javax.xml.parsers.DocumentBuilder;
 014 : import javax.xml.parsers.DocumentBuilderFactory;
 015 : 
 016 : import org.w3c.dom.Document;
 017 : import org.w3c.dom.Node;
 018 : 
 019 : import us.jubat.graph.Edge;
 020 : import us.jubat.graph.GraphClient;
 021 : import us.jubat.graph.PresetQuery;
 022 : 
 023 : public class CreateGraph {
 024 : 
 025 : 	public static final String HOST = "127.0.0.1";
 026 : 	public static final int PORT = 9199;
 027 : 	public static final String NAME = "trainRoute";
 028 : 
 029 : 	public Map<String, String> stations = new HashMap<String, String>();
 030 : 
 031 : 	private class StationJoin {
 032 : 		public String station1;
 033 : 		public String station2;
 034 : 
 035 : 		public StationJoin(String station1, String station2) {
 036 : 			this.station1 = station1;
 037 : 			this.station2 = station2;
 038 : 		}
 039 : 	}
 040 : 
 041 : 	private final void start() throws Exception {
 042 : 		// 1. Connect to Jubatus Server
 043 : 		GraphClient client = new GraphClient(HOST, PORT, 5);
 044 : 
 045 : 		// 2. Regist the preset query
 046 : 		PresetQuery pq = new PresetQuery();
 047 : 		pq.edge_query = new ArrayList<>();
 048 : 		pq.node_query = new ArrayList<>();
 049 : 		client.add_shortest_path_query(NAME, pq);
 050 : 
 051 : 		// 3. Generate the graph
 052 : 		this.createGraph(client, this.getStationJoin(11302)); // 山手線
 053 : 		this.createGraph(client, this.getStationJoin(11312)); // 中央線
 054 : 
 055 : 		// 4. Show the Station IDs
 056 : 		System.out.println("=== Station IDs ===");
 057 : 		List<Map.Entry> entries = new ArrayList<Map.Entry>(stations.entrySet());
 058 : 		Collections.sort(entries, new Comparator() {
 059 : 			@Override
 060 : 			public int compare(Object o1, Object o2) {
 061 : 				Map.Entry e1 = (Map.Entry) o1;
 062 : 				Map.Entry e2 = (Map.Entry) o2;
 063 : 				return (Integer.valueOf((String) e1.getValue())).compareTo(Integer.valueOf((String) e2.getValue()));
 064 : 			}
 065 : 		});
 066 : 		for (Map.Entry e : entries) {
 067 : 			System.out.println(e.getValue() + "\t: " + e.getKey());
 068 : 		}
 069 : 	}
 070 : 
 071 : 	// Generate the combination list of 2 stations
 072 : 	private List<StationJoin> getStationJoin(int lineCd) throws Exception {
 073 : 		// Return list
 074 : 		List<StationJoin> joinList = new ArrayList<StationJoin>();
 075 : 
 076 : 		// Read the XML file
 077 : 		Document document = this.getXml(lineCd);
 078 : 
 079 : 		// Repeat for the number of <station_join> tags in XML file
 080 : 		for (int i = 0; i < document.getElementsByTagName("station_join").getLength(); i++) {
 081 : 			String station1 = "";
 082 : 			String station2 = "";
 083 : 			// Repeat for the number of childnodes surrounded by the <station_join> tags
 084 : 			for (int j = 0; j < document.getElementsByTagName("station_join").item(i).getChildNodes().getLength(); j++) {
 085 : 				Node node = document.getElementsByTagName("station_join").item(i).getChildNodes().item(j);
 086 : 				String nodeName = node.getNodeName();
 087 : 				String nodeValue = null;
 088 : 				// Get the values of station_name1 and station_name2
 089 : 				if (node.getFirstChild() != null) {
 090 : 					nodeValue = node.getFirstChild().getNodeValue();
 091 : 				}
 092 : 				if (nodeName == "station_name1") {
 093 : 					station1 = nodeValue;
 094 : 				} else if (nodeName == "station_name2") {
 095 : 					station2 = nodeValue;
 096 : 				}
 097 : 			}
 098 : 			joinList.add(new StationJoin(station1, station2));
 099 : 		}
 100 : 		return joinList;
 101 : 	}
 102 : 
 103 : 	// Read the XML file
 104 : 	private Document getXml(int lineCd) throws Exception {
 105 : 		// Set the proxy 
 106 : 		System.setProperty("proxySet", "true");
 107 : 		System.setProperty("proxyHost", "192.168.00.0");
 108 : 		System.setProperty("proxyPort", "8080");
 109 : 
 110 : 		// Set the BASIC certification
 111 : 		final String username = "user";
 112 : 		final String password = "password";
 113 : 		Authenticator.setDefault(new Authenticator() {
 114 : 			@Override
 115 : 			protected PasswordAuthentication getPasswordAuthentication() {
 116 : 				return new PasswordAuthentication(username, password.toCharArray());
 117 : 			}
 118 : 		});
 119 : 
 120 : 		// Read the XML file from WEB
 121 : 		String urlStr = "http://www.ekidata.jp/api/n/" + String.valueOf(lineCd) + ".xml";
 122 : 		URL url = new URL(urlStr);
 123 : 		HttpURLConnection connection = (HttpURLConnection) url.openConnection();
 124 : 		connection.setDoOutput(true);
 125 : 		connection.setUseCaches(false);
 126 : 		connection.setRequestMethod("GET");
 127 : 		InputStream inputStream = connection.getInputStream();
 128 : 		DocumentBuilder docBuilder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
 129 : 		Document document = docBuilder.parse(inputStream);
 130 : 
 131 : 		return document;
 132 : 	}
 133 : 
 134 : 	// 3. Generate the Graph
 135 : 	private void createGraph(GraphClient client, List<StationJoin> stationJoin) {
 136 : 		// Repeat for the number of two-stations' combination lists that got from XML list
 137 : 		for (StationJoin join : stationJoin) {
 138 : 			// 3-1. Get the station information and ID
 139 : 			String s1_node_id = this.addStation(client, join.station1);
 140 : 			String s2_node_id = this.addStation(client, join.station2);
 141 : 
 142 : 			// 3-2. Make bi-links between new added two stations
 143 : 			Edge edge1 = new Edge();
 144 : 			edge1.property = new HashMap<>();
 145 : 			edge1.source = s1_node_id;
 146 : 			edge1.target = s2_node_id;
 147 : 			Edge edge2 = new Edge();
 148 : 			edge2.property = new HashMap<>();
 149 : 			edge2.source = s2_node_id;
 150 : 			edge2.target = s1_node_id;
 151 : 			client.create_edge(NAME, s1_node_id, edge1);
 152 : 			client.create_edge(NAME, s2_node_id, edge2);
 153 : 
 154 : 			client.update_index(NAME);
 155 : 		}
 156 : 	}
 157 : 
 158 : 	private String addStation(GraphClient client, String station) {
 159 : 		String nodeId;
 160 : 		Map<String, String> property = new HashMap<String, String>();
 161 : 		// Check whether the 'station', as the argument, has be stored in the Map or not.
 162 : 		if (this.stations.containsKey(station)) {
 163 : 			// If yes, return the ID
 164 : 			nodeId = this.stations.get(station);
 165 : 		} else {
 166 : 			// If no, create a new node for the station, and return its ID.
 167 : 			nodeId = client.create_node(NAME);
 168 : 			property.put("name", station);
 169 : 			client.update_node(NAME, nodeId, property);
 170 : 			// Store the created node into the Map of stations
 171 : 			this.stations.put(station, nodeId);
 172 : 		}
 173 : 		return nodeId;
 174 : 	}
 175 : 	
 176 : 	public static void main(String[] args) throws Exception {
 177 : 		new CreateGraph().start();
 178 : 		System.exit(0);
 179 : 	}
 180 : 
 181 : }
 
 
**SearchRoute.java**

.. code-block:: java

 01 : import java.util.ArrayList;
 02 : import java.util.List;
 03 : 
 04 : import us.jubat.graph.GraphClient;
 05 : import us.jubat.graph.Node;
 06 : import us.jubat.graph.PresetQuery;
 07 : import us.jubat.graph.ShortestPathQuery;
 08 : 
 09 : public class SearchRoute {
 10 : 
 11 : 	public static final String HOST = "127.0.0.1";
 12 : 	public static final int PORT = 9199;
 13 : 	public static final String NAME = "trainRoute";
 14 : 
 15 : 	private final void start(String source, String target) throws Exception {
 16 : 		// 1. Connect to Jubatus Server
 17 : 		GraphClient client = new GraphClient(HOST, PORT, 5);
 18 : 
 19 : 		// 2. Prepare the query
 20 : 		PresetQuery pq = new PresetQuery();
 21 : 		pq.edge_query = new ArrayList<>();
 22 : 		pq.node_query = new ArrayList<>();
 23 : 
 24 : 		ShortestPathQuery query = new ShortestPathQuery();
 25 : 		query.source = source;
 26 : 		query.target = target;
 27 : 		query.max_hop = 100;
 28 : 		query.query = pq;
 29 : 
 30 : 		// 3. Calculate the shortest path
 31 : 		List<String> stations = client.get_shortest_path(NAME, query);
 32 : 
 33 : 		// 4. Return the results
 34 : 		System.out.println("Pseudo-Shortest Path (hops) from " + query.source + "to " + query.target);
 35 : 		for (String station : stations) {
 36 : 			Node node = client.get_node(NAME, station);
 37 : 			String stationName = "";
 38 : 			if (node.property.containsKey("name")) {
 39 : 				stationName = node.property.get("name");
 40 : 			}
 41 : 			System.out.println(station + "\t: " + stationName);
 42 : 		}
 43 : 	}
 44 : 
 45 : 	public static void main(String[] args) throws Exception {
 46 : 		new SearchRoute().start(args[0], args[1]);
 47 : 		System.exit(0);
 48 : 	}
 49 : 
 50 : }


--------------------------------
Explanation
--------------------------------

**train_route.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON filed.

 * method
 
  Specify the algorithm used in graph mining. In this example, we use the graph without indexing, so we specify it with "graph_wo_index".
  
 * parameter
 
  Specify the parameters to be passed to the algorithm.
  We specify two parameter here, "damping_factor" and "landmark_num".
  "damping_factor" is the damping factor used in PageRank calculation. It adjusts scores for nodes with differenct degrees.The bigger it is, the more sensitive to graph structure PageRank score is, but the larger biases it causes. In the original paper, 0.85 is good.
  "landmark_num" is used for shortest path calculation. The bigger it is, more accurate value you can get, but the more memory is required. 


**CreateGraph.java**

 CreateGraph.java generates a graph composed of Yamanote-line and Chuou-line. The client program in Graph will use the 'GraphClient' class defined in 'us.jubat.graph'. Here are the 5 methods used in the sample.
 
 * add_shortest_path_query(String name, PresetQuery query)
 
  Regist the shortest-path calculation query that to be used.

 * create_node(String name)
 
  Add one node into graph.

 * update_node(String name, String node_id, Map<String, String> property)
 
  Update a node's 'node_id' attribute in property map.

 * create_edge(String name, String node_id, Edge e)
 
  Make the link from e.source to e.target.

 * get_shortest_path(String name, ShortestPathQuery query)
 
  Calculates (from the precomputed data) a shortest path from query.source to query.target that matches the preset query.

 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 33).
  Setting the IP addr., RPC port of Jubatus Server, and the connection waiting time.

 2. Regist the preset query
  
  The 'add_shortest_path_query' method must be registered beforehand. Therefore, the 'PresetQuery' is made (Row 46), and its pq.edge_query and pq.node_query are filled with the newly declared ArrayList (Row 47, 48). Finally, the query made by 'add_shortest_path_query' is registed (Row 49).

 3. Generate the graph

  Make the graph composed of Yamanote-line and Chuou-line.
  Firstly, private method [createGraph] is called at (Row 52, 53).
  The first parameter in [createGraph] is the GraphClient made in Step. 1. 
  The second prarmeter is the return value from private method [getStationJoin].
  
  Private method [getStationJoin] makes the combination list of two neighbor stations.
  At first, the ArrayList of inner class [StationJoin] is made (Row 74).
  Then, set the instance variable, station1 and station2, in [StationJoin] Class (Row 31-39).
  After setting the two stations' name, method [getStationJoin] will make the combination list.
  
  Next, we get the station information from the Web. Private method [getXml] is called to download the XML file (Row 77).
  The same parameter is passed from [getStationJoin] to [getXml] method.
  This parameter is used to make the URL, from which to download XML file.
  Proxy for the private method [getXml] is set in (Row 106-118). Please comment out them if not needed.
  Codes in (Row 121-129) are the processes for reading the XML file.
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
  The number of instance created in [StationJoin] is the same as the number of <station_join> tags, and they are sotred in the ArrayList that created at Row 74 （Row 80-99).
  
  Next, we make the graph by using the ArrayList<StationJoin> created above (Row 135-156).
  The private method [createGraph] performs the following task.
  
   3-1. Add station information and ID.
    Insert node into graph. Here, a node means a station. (eg. Shinagawa, Ochanomizu, Tokyo, etc.)
    
   3-2. Create links between the added two neighbor stations
    Make the bi-link between the registed station to its neighbor stations. Here, a link means a route. (eg. Harajuku <-> Shibuya, etc.)
    
  3-1. Add station information and ID.
   Private method [addStation] is called (Row 139-140), to add every pair of neighboring nodes <station1, station2> in to the graph. 
   Method [addStation] will check the instance variable 'stations' (of HashMap<String, String> type). If the HashMap contains the specified station, the station_id will be returned; Otherwise, a new node is created, and its ID is returned after storing the nodeID and station name into the 'stations' Hashmap (Row 158-174).
   Mehods [create_node] and [update_node] in GraphClient regist the new node (Row 167-169).
   At first, [create_node] method is called with its argument set by an unique task name in the ZooKeeper cluster, and the returned value is the nodeId (Row 167).
   After that, a node is added into the graph. Then, we regist the key-value <name, "station name"> into the 'property' (Row 168), which is the instance of HashMap<String, String> created at Row 160.
   Finally, [update_node] method updates the 'property' with the node created at Row 167 (Row 169).
   
  3-2. Create links between the added two neighbor stations
   After adding the two neighbor stations by method [addStation], we create the bi-links between station1 and station2 (Row 143-152).
   Method [create_edge] is used to create the bi-links.
   The second argument means the start node's ID. The third argument is an instance of Edge class, which stores the nodeID of both start and end nodes in the edge.
   
  The [update_index] method in Row 154 is used for locally Mix operation, do not use it in distributed environment.
  
 4. Show the stations

  In step 3-1, station name and station ID(nodeID) are stored into the "stations". Here, we output the stations names by the ascending order of their IDs (Row 56-68).
  
 **SearchRoute.java**
 
 SearchRoute.java finds the shortest path between every 2 stations from the graph that made by CreateGraph.java.
 The method it used is the "get_shortest_path".
  
  1. Connect to Jubatus Server

   Connect to Jubatus Server (Row 17).
   Setting the IP addr., RPC port of Jubatus Server, and the connection waiting time.

   
  2. Prepare the query

   Prepare the query for the shortest path calculation (Row 20-28).
   Create the ShortestPathQuery required by the [get_shortest_path] method (Row 24).
   Store the start node's & end node's nodeIDs into the source & target variables in the 'ShortestPathQuery'. 
   The process will be truncated if it fails to find the route within the specified number of 'maxhop'.
   Also note, the query should be registed by "add_shortest_path_query" beforehand.
   
  3. Calculate the shortes path

   By specifying the "ShortestPathQuery" that created in Step.2, get_shortest_path(String name, ShortestPathQuery query)method will find the shortest path (Row 31). It calculates (from the precomputed data) the shortest path from query.source to query.target that matches the preset query. 
   
  4. Show the results

   Show the ID of stations that on the shortes path calculated in Step 3 (Row 34-42).


-------------------------------------
Run the sample program
-------------------------------------

［At Jubatus Server］
 start "jubagraph" process.
 
 ::
 
  $ jubagraph --configpath train_route.json
 

［At Jubatus Client］
 Get the required package and Java client ready.
 Run create_graph.java!
 
 ::
 
  $ java CreateGraph
  
  === Station IDs ===
  0       Shinagawa
  1       Osaki
  4       Tamachi
  ...
  139     Nagano
  144     Yotsuya
  147     Ochanomizu
  
 Output of the station name, and their station ID (node ID on graph).

 Search the shortest path between 2 stations.
 
 ::
 
  $ java SearchRoute 0 144
  
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

