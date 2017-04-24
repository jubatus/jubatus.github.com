MIX Strategies
=============================

Jubatus supports two MIX strategies.

* **Linear MIX** (`linear_mixer`):
  In this strategy, all servers in a cluster runs MIX synchronously.
  When a server in a cluster satisfies a condition to start MIX, single MIX master server is selected from the cluster.
  The MIX master collects difference of training models of all servers since last MIX, merges the differences, then distributes the merged differences to all servers.
* **Push/Pull MIX** (`skip_mixer`, `random_mixer`, `broadcast_mixer`):
  In this strategy, each server in a cluster runs MIX asynchronously.
  When a server in a cluster satisfies a condition to start MIX, the server selects one or more MIX peer nodes from the cluster, then exchanges the differences of training models since last MIX with them.

The following three variations of Push/Pull MIX strategy are implemented, each uses different MIX peer selection algorithm:

* `skip_mixer`: When a cluster has N servers, `N/2` th, `N/4` th, `N/8` th, ... server from the server initiating MIX are selected as MIX peers.
  The order of servers is determined by IP address and port number of each server.
* `random_mixer`: One server is randomly selected from the cluster as a MIX peer.
* `broadcast_mixer`: All servers in the cluster are selected as a MIX peer.

Supported MIX Strategies
-------------------------------------------------

MIX strategies supported depends on a type of engine and its algorithm.

+------------------+-----------------------------------+--------------+---------------+
| Engine           | Algorithm                         | Linear MIX   | Push/Pull MIX |
+==================+===================================+==============+===============+
| Classifier       |  `NN`                             | ✔            | ✔             |
|                  +-----------------------------------+--------------+---------------+
|                  |  Others                           | ✔            |               |
+------------------+-----------------------------------+--------------+---------------+
| Regression       |  `NN`                             | ✔            | ✔             |
|                  +-----------------------------------+--------------+---------------+
|                  |  Others                           | ✔            |               |
+------------------+-----------------------------------+--------------+---------------+
| Recommender      |  `nearest_neighbor_recommender`   | ✔            | ✔             |
|                  +-----------------------------------+--------------+---------------+
|                  |  Others                           | ✔            |               |
+------------------+-----------------------------------+--------------+---------------+
| Nearest Neighbor |  -                                | ✔            | ✔             |
+------------------+-----------------------------------+--------------+---------------+
| Anomaly          |  `lof`                            | ✔            |               |
|                  +-----------------------------------+--------------+---------------+
|                  |  `light_lof`                      | ✔            | ✔             |
+------------------+-----------------------------------+--------------+---------------+
| Clustering       |  -                                | ✔            |               |
+------------------+-----------------------------------+--------------+---------------+
| Burst            |  -                                | ✔            |               |
+------------------+-----------------------------------+--------------+---------------+
| Stat             |  -                                | ✔            |               |
+------------------+-----------------------------------+--------------+---------------+
| Graph            |  -                                | ✔            |               |
+------------------+-----------------------------------+--------------+---------------+
| Bandit           |  -                                | ✔            |               |
+------------------+-----------------------------------+--------------+---------------+
