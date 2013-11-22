Graph
===================

In this sample program, we will introduce how to do graph mining by using ``jubagraph`` function from Jubatus Client.

By using graph mining function, we can find the center node or the shortest path in a graph structure. This is useful for the analysis of social community, network structure and etc.


----------------------------------
Abstract of sample program
----------------------------------

In this sample, we will describe the ``jubagraph`` usage through a program of the shortest path detection for train routes (`train_route <https://github.com/jubatus/jubatus-example/tree/master/train_route>`_).

At first, we will create the train route. In this example, we build the graph with the train route of Yamanote-line and Chuo-line, in Tokyo, Japan.

After the graph is built, we can find the shortest path between any two stations by inputting station_id.

For example, to find the route between "Shinagawa-Station" on Yamanote-line and "Ochanomizu-Station" on Chuo-line, basically we can get 2 patterns. One is transfer at "Shinjuku-Station" for Chuo-line (clockwise), another one is transfer at "Tokyo-Station" for Chuo-line (counterclockwise). By using this program, the route of the least stations to pass is returned. In other words, only the route via "Tokyo-Station" will be returned.


--------------------------------
Processing flow 
--------------------------------

The flow of development using Jubatus Client is following:

1. Connection settings to ``jubagraph``
    Setting the HOST and RPC port of ``jubagraph`` .

2. Register the pre-set query
    Register the queries which to be used for the shortest path calculation.

3. Create graph
    Get the stations information in Yamanote-line and Chuo-line，and create the route-graph.

4. Set station ID
    Display the stations in route-graph by their station_id.

5. Prepare the query
    Prepare the query for the shortest path calculation.

6. Get the shortest path
    Calculate the shortest path between the two stations assigned in the query at step.5.

7. Display the result
    Display the result in step.6.


--------------------------------
Sample Program
--------------------------------

.. toctree::
   :maxdepth: 2

   graph_python

Currently, we have no sample programs except Python. (We welcome your contribution!)
