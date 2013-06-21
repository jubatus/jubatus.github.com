Graph
===================

In this sample program, we will introduce how to do graph mining by using jubagraph function from Jubatus Client.

By using graph mining function, we can find the center node or the shortest path in a graph structure. This is useful for the analysis of social community, network structure, and etc.

----------------------------------
Abstract of sample program
----------------------------------

In this sample, we will describe the Jubagraph usage through a program of the shortest path detection for train routes. 

At first, we will create the train_route graph by using the CreateGraph() function. And in this example, we build the graph with the train_route of Yamanote-line and Chuou-line, in Tokyo, Japan.

When the graph is built, we can find the shortest path between any 2 stations, when we input the station_id into the SearchRoute() function.

For example, to find the route between "Shinagawa-Station" on Yamanote-line and "Ochanomizu-Station" on Chuou-line, basically we can get 2 patterns. One is transfer at "Shinjuku-Station" for Chuou-line (clockwise), another one is transfer at "Tokyo-Station" for Chuou-line (counterclockwise). By using this program, the route of the least stations to pass is returned. In other words, only the route by "Tokyo-Station" will be returned.

--------------------------------
Processing flow 
--------------------------------

Main flow of using Jubatus Client

* CreateGraph

 1. Connection settings to Jubatus Server

  Setting the HOST, RPC port of Jubatus Server

 2. Register the pre-set query

  Register the queries which to be used for the shortest path calculation.

 3. Create graph

  Get the stations information in Yamanote-line and Chuou-line， and create the route-graph.

 4. Set station ID

  Display the stations in route-graph by their station_id.


* SearchRoute

 1. Connection settings to Jubatus Server

  Setting the HOST, RPC port of Jubatus Server

 2. Prepare the query

  Prepare the query for the shortest path calculation.

 3. Get the shortest path

  Calculate the shortest path between the two stations assigned in the query at step. 2.

 4. Display the result

  Display the result in step. 3.

--------------------------------
Sample Program
--------------------------------

.. toctree::
   :maxdepth: 2

   graph_python
   graph_ruby
   graph_java
