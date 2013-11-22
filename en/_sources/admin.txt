
Cluster Administration Guide
============================

This page describes how to administer a Jubatus cluster.


Recommended Process Configuration
---------------------------------

For reliable Jubatus service, you should run Jubatus in a distributed environment.
Additionally, to ensure high performance, you should carefully plan the process configuration of Jubatus servers and processes that Jubatus depends on.

This is the process configuration that we recommend.

.. figure:: ../_static/process_configuration.png
   :width: 90 %
   :alt: process configuration

Jubatus Proxies
~~~~~~~~~~~~~~~

To keep operation and implementation of the client application simple, we recommend assigning one Jubatus Proxy for each instance of the application.

In case that the client application cannot connect to the Jubatus Proxy (e.g., the Jubatus Proxy is down), it is necessary to consider the way to recover, depending on your requirement of service. For example:

#. Monitor the Jubatus Proxy processes. When the Jubatus Proxy goes down, block the access to the application from users.
#. Switch over to another Jubatus Proxy.

Jubatus Servers
~~~~~~~~~~~~~~~

If you set the same name using ``--name`` option, processes collaborate with one another. As long as one of processes is running, Jubatus service is available.

In the figure above, processes is distributed on ``N + 1`` machines. Even when a failure occurs in ``N`` of machines, all of instances are available.

Jubatus processes all data in memory. In order to prevent the lack of resources (especially memory), you should pay to attention to the placement of the process.

ZooKeeper
~~~~~~~~~

When running Jubatus in a distributed environment, it is a fatal condition that ZooKeeper is not available. For reliable ZooKeeper service, you should note the following:

#. Deploy ZooKeeper in a cluster (an ensemble) using an odd number of machines.
#. To avoid degradation of performance and stability, deploy ZooKeeper on a dedicated machine.

For details, See `the documentation of ZooKeeper <http://zookeeper.apache.org/doc/current/>`_.

Managing Clusters
-----------------

[tbd]

Monitoring
----------

[tbd]

Logging
-------

[tbd]

Save and Load
-------------

[tbd]
