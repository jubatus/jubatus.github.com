Java
==================

ここではJava版のGraphサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習アルゴリズム等の設定をするtrain_route.json、グラフ作成を行うCreateGraph.java、最短経路を計算するSearchRoute.javaを利用します。以下にソースコードを記載します。

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
 042 : 		// 1. Jubatus Serverへの接続設定
 043 : 		GraphClient client = new GraphClient(HOST, PORT, 5);
 044 : 
 045 : 		// 2. プリセットクエリーを登録
 046 : 		PresetQuery pq = new PresetQuery();
 047 : 		pq.edge_query = new ArrayList<>();
 048 : 		pq.node_query = new ArrayList<>();
 049 : 		client.add_shortest_path_query(NAME, pq);
 050 : 
 051 : 		// 3. グラフの作成
 052 : 		this.createGraph(client, this.getStationJoin(11302)); // 山手線
 053 : 		this.createGraph(client, this.getStationJoin(11312)); // 中央線
 054 : 
 055 : 		// 4. 駅IDの表示
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
 071 : 	// 接続する2駅の組み合わせリストを作成
 072 : 	private List<StationJoin> getStationJoin(int lineCd) throws Exception {
 073 : 		// 返却用リスト
 074 : 		List<StationJoin> joinList = new ArrayList<StationJoin>();
 075 : 
 076 : 		// XML文章の読み込み
 077 : 		Document document = this.getXml(lineCd);
 078 : 
 079 : 		// XML文章中のタグ<station_join>の数だけ繰り返す
 080 : 		for (int i = 0; i < document.getElementsByTagName("station_join").getLength(); i++) {
 081 : 			String station1 = "";
 082 : 			String station2 = "";
 083 : 			// <station_join>タグで囲まれた子ノードの数だけ繰り返す
 084 : 			for (int j = 0; j < document.getElementsByTagName("station_join").item(i).getChildNodes().getLength(); j++) {
 085 : 				Node node = document.getElementsByTagName("station_join").item(i).getChildNodes().item(j);
 086 : 				String nodeName = node.getNodeName();
 087 : 				String nodeValue = null;
 088 : 				// station_name1, station_name2のvalueを取得
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
 103 : 	// XML文章の読み込み
 104 : 	private Document getXml(int lineCd) throws Exception {
 105 : 		// プロキシ設定
 106 : 		System.setProperty("proxySet", "true");
 107 : 		System.setProperty("proxyHost", "192.168.00.0");
 108 : 		System.setProperty("proxyPort", "8080");
 109 : 
 110 : 		// BASIC認証の設定
 111 : 		final String username = "user";
 112 : 		final String password = "password";
 113 : 		Authenticator.setDefault(new Authenticator() {
 114 : 			@Override
 115 : 			protected PasswordAuthentication getPasswordAuthentication() {
 116 : 				return new PasswordAuthentication(username, password.toCharArray());
 117 : 			}
 118 : 		});
 119 : 
 120 : 		// WEB上のXMLファイルを読み込む
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
 134 : 	// 3. グラフの作成
 135 : 	private void createGraph(GraphClient client, List<StationJoin> stationJoin) {
 136 : 		// XMLファイルから取得し接続する2駅の組み合わせリスト分だけ繰り返す
 137 : 		for (StationJoin join : stationJoin) {
 138 : 			// 3-1. 駅情報の追加と駅IDの取得
 139 : 			String s1_node_id = this.addStation(client, join.station1);
 140 : 			String s2_node_id = this.addStation(client, join.station2);
 141 : 
 142 : 			// 3-2. 追加した2駅の相互にエッジを張る
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
 161 : 		// 引数に指定された駅がMap stationsに格納されているか確認
 162 : 		if (this.stations.containsKey(station)) {
 163 : 			// 格納されている場合は、そのidを返却
 164 : 			nodeId = this.stations.get(station);
 165 : 		} else {
 166 : 			// 格納されていない場合は、新たにnodeを作成し、作成時に取得したidを返却
 167 : 			nodeId = client.create_node(NAME);
 168 : 			property.put("name", station);
 169 : 			client.update_node(NAME, nodeId, property);
 170 : 			// Map stationsにnodeを作成した駅を格納
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
 16 : 		// 1. Jubatus Serverへの接続設定
 17 : 		GraphClient client = new GraphClient(HOST, PORT, 5);
 18 : 
 19 : 		// 2. クエリーの準備
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
 30 : 		// 3. 最短経路を計算
 31 : 		List<String> stations = client.get_shortest_path(NAME, query);
 32 : 
 33 : 		// 4. 結果の表示
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
解説
--------------------------------

**train_route.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下のとおりです。

 * method
 
  グラフ解析に使用するアルゴリズムを指定します。
  ここでは、インデックスのないグラフを利用するための"graph_wo_index"を指定します。
  
  
 * parameter
 
  アルゴリズムに渡すパラメータを指定します。
  ここでは2つのパラメータ、"damping_factor"と"landmark_num"を指定しています。
  "damping_factor"は、PageRankの計算におけるdamping factorで、次数の異なるノードのスコアを調整します。大きくすると構造をよく反映したスコアを出す代わりに、スコアに極端な偏りが発生します。
  "landmark_num" は最短パスにおいてランドマークの総数を指定します。大きくすると正確な最短パスに近づく代わりに、多くのメモリを消費します。


**CreateGraph.java**

 CreateGraph.javaでは、山手線と中央線の接続を表すグラフを作成します。Graphのクライアントプログラムは、us.jubat.graphクラス内で定義されているGraphClientクラスを利用して作成します。サンプルで使用するメソッドは、以下の5つです。
 
 * add_shortest_path_query(String name, PresetQuery query)
 
  最短パスの算出に使用したいクエリーを新たに登録します。

 * create_node(String name)
 
  グラフ内にノードを一つ追加します。

 * update_node(String name, String node_id, Map<String, String> property)
 
  ノードnode_idの属性をpropertyに更新します。

 * create_edge(String name, String node_id, Edge e)
 
  e.sourceからe.targetに向けたエッジを張ります。

 * get_shortest_path(String name, ShortestPathQuery query)
 
  プリセットクエリーquery.queryにマッチする、query.sourceからquery.targetへの最短パスを(予め算出された値から)計算します。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（33行目）。
  Jubatus ServerのIPアドレス、Jubatus ServerのRPCポート番号、接続待機時間を設定します。
  
 2. プリセットクエリーを登録

  最短経路を計算するために、クエリーをあらかじめadd_shortest_path_queryメソッドで登録しておく必要があります。
  そのためのクエリーPresetQueryを作成します(46行目)。pq.edge_queryとpq.node_queryにArrayListを宣言して格納します(47, 48行目）。
  add_shortest_path_queryメソッドで作成したクエリーを登録します(49行目)。
  
 3. グラフの作成

  山手線と中央線の接続を表すグラフを作成します。
  ここでは、privateメソッド「createGraph」を呼び出します(52, 53行目)。
  private メソッド「createGraph」の第1引数は 1. で作成したGraphClientです。
  第二引数にはprivateメソッド「getStationJoin」の戻り値を指定します。
  
  privateメソッド「getStationJoin」では接続する2駅を組み合わせたリストを作成します。
  まず内部クラス「StationJoin」のArrayListを作成します(74行目)。
  StationJoin クラスにはインスタンス変数station1とstation2が設定されています(31-39行目)。
  ここに接続する2駅の駅名を設定して、そのリストを作成することがgetStaitonJoinメソッドの処理内容です。
  
  続いて、駅情報をWEB上にあるXMLファイルから取得するため、privateメソッド「getXml」を呼び出します(77行目)。
  getXmlメソッドの引数には、getStationJoinメソッドを呼び出したときの引数をそのまま渡します。
  引数に指定した値はXMLファイルを取得するURLを作成するために使います。
  privateメソッド「getXml」の106行目から118行目の処理はプロキシ認証のための設定なので、不要な場合はコメントアウトしてください。
  121行目から129行目はWEB上からXMLファイルを取得するための処理です。
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
   

  次に取得した駅情報のXMLファイルの<station_cd1>の値をStationJoinクラスのインスタンス変数station1に、<station_cd2>の値をstation2に格納します。
  タグ<station_join>の数だけStationJoinクラスのインスタンスを作成し、74行目で作成したArrayListに格納していきます（80-99行目）。
  
  上記で作成したArrayList<StationJoin>を用いて、グラフを作成します(135-156行目)。
  privateメソッド「createGraph」では、以下の作業を行います。
  
   3-1. 駅情報の追加と駅IDの取得
    グラフ内にノードを追加します。ここでのノードは駅に相当します。（例. 品川駅、御茶ノ水駅、東京駅など）
    
   3-2.追加した2駅の相互にエッジを張る
    登録した駅から隣接する駅へエッジを張ります。ここでのエッジは線路に相当します。（例.原宿⇒渋谷など）
    
  3-1. 駅情報の追加と駅IDの取得
   取得したリストの1要素から隣接する2駅station1とstation2をそれぞれノードとしてグラフ内に追加するため、privateメソッド「addStation」を呼び出します（139,140行目）。
   addStationメソッドではHashMap<String, String>型のインスタンス変数stationsに、引数に指定した駅が含まれているかを確認し、含まれている場合はその駅のID nodeIdを返却し、含まれない場合は新たにノードを登録して駅名とnodeIdをstationsに格納した後にnodeIdを返却します（158-174行目）。
   ノードの登録はGraphClientのcreate_nodeメソッドとupdate_nodeメソッドで行います(167-169行目)。
   まず、create_nodeメソッドを、引数にタスクを識別するZooKeeperクラスタ内でユニークな名前nameを指定して呼び出し、その戻り値をnodeIdとします(167行目)。
   これでグラフ内にノードがひとつ追加されます。続いて、160行目で作成したHashMap<String, String> クラスのインスタンスpropertyにキーを"name"、バリューを登録する駅名として格納します(168行目)。
   そしてupdate_nodeメソッドで、167行目で作成したノードの属性をpropertyに更新します(169行目)。
   
  3-2. 追加した2駅の相互にエッジを張る
   addStationメソッドで隣接する2駅station1とstation2を追加した後に、station1からstation2へ向けたエッジとstation2からstation1へ向けたエッジを張ります（143-152行目）。
   エッジを張るためにはcreate_edgeメソッドを利用します。
   第2引数に接続元のnodeIDを指定し、第3引数には、接続元と接続先のnodeIDを格納したEdgeクラスのインスタンスを指定します。
   
  154行目のupdate_indexメソッドはmixをローカルで実行するものです。分散環境では利用しないでください。
  
 4. 駅IDの表示

  3-1.で駅名と駅ID(nodeID)をstationsに格納しました。ここでは駅名を駅IDの昇順に並び替えて表示しています(56-68行目)。
  
 **SearchRoute.java**
 
 SearchRoute.javaでは、CreateGraph.javaで作成したグラフから2駅間の最短経路を計算します。
 使用するメソッドは、最短経路を計算するためのget_shortest_pathメソッドです。
  
  1. Jubatus Serverへの接続設定

   Jubatus Serverへの接続を行います（33行目）。
   Jubatus ServerのIPアドレス、Jubatus ServerのRPCポート番号、接続待機時間を設定します。
   
  2. クエリーの準備

   最短経路を計算するためのクエリーを準備します(20-28行目)。
   最短経路を計算するためのget_shortest_pathメソッドに必要なShortestPathQueryを作成します(24行目)。
   ShortestPathQueryのメンバ変数sourceに接続元の駅ID(nodeId)、targetに接続先の駅ID(nodeId)を格納します。
   メンバ変数maxhopで指定したホップ以内に発見できなかった場合、結果は切り詰められます。
   またクエリーはあらかじめadd_shortest_path_queryで登録しておく必要があります。
   
  3. 最短経路の計算

   2.で作成したShortestPathQueryを指定して、get_shortest_path(String name, ShortestPathQuery query)を呼び出し、最短経路の計算をします(31行目)。このメソッドでは、プリセットクエリーquery.queryにマッチする、query.sourceからquery.targetへの最短パスを(予め算出された値から) 計算することができます。
   
  4. 結果の表示

   3.で取得した最短経路で通過する駅を駅IDと関連付けて表示しています(34-42行目)。


-------------------------------------
サンプルプログラムの実行
-------------------------------------

［Jubatus Serverでの作業］
 jubagraphを起動します。
 
 ::
 
  $ jubagraph --configpath train_route.json
 

［Jubatus Clientでの作業］
 必要なパッケージとJavaクライアントを用意し、create_graph.javaを実行します。
 
 ::
 
  $ java CreateGraph
  
  === Station IDs ===
  0       品川
  1       大崎
  4       田町
  ...
  139     中野
  144     四ツ谷
  147     御茶ノ水
  
 駅名に対応する駅 ID (グラフ上の node ID) が出力されます。

 2 つの駅 ID から最短経路を検索します。
 
 ::
 
  $ java SearchRoute 0 144
  
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

