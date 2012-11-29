Architecture
============

Jubatus has a client-server architecture.
The simplest process configuration is single client process and single server process like following figure.

.. figure:: ../_static/single_single.png
   :width: 70 %
   :alt: single client, single server

Jubatus can make use of multiple server processes in order to scale out the system.
By throwing queries to Keepers, we can execute machine learning requests (update/analyze) with multiple server processes.

Keepers proxy queries from clients to appropriate server(s).
Clients work as if it is communicating with just one server.
In other words, clients don't need to know whether it is connecting to a server or a keeper.

Keepers use ZooKeeper to keep-aliving and load-balancing each Jubatus servers.

.. figure:: ../_static/single_multi.png
   :width: 70 %
   :alt: single client, multi servers

Sometimes we want to distribute clients because data size is huge, or source of data is far from server.
Jubatus can achieve this by creating multiple keepers and assigning different keeper to each client.

.. figure:: ../_static/multi_multi.png
   :width: 70 %
   :alt: multi clients, multi servers
