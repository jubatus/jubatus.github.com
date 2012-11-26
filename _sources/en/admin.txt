
Administrator's Guide
=====================

This section is a guide for system administrators.


Recommended process configuration
---------------------------------

For reliable Jubatus service, you should run Jubatus on distributed environment.
Additionally, to ensure high performance, you should carefully plan the process configuration of Jubatus servers and processes that Jubatus depends on.

This is the process configuration that we recommend.

.. figure:: ../_static/process_configuration.png
   :width: 90 %
   :alt: process configuration

Jubakeeper
~~~~~~~~~~

To keep operation and implementation of the client application simple, we recommend assigning one Jubakeeper for each instance of the application.

For case that the client application can not connect to Jubakeeper (ex. Jubakeeper is downed), it is necessary to consider the reliability depending on the services provided. For example, like the following:

#. Monitor the processes. If the client application can not connect to Jubakeeper, blocks the access to the client application.
#. Switch to another Jubakeeper.

Jubaserver
~~~~~~~~~~

If you set same name using ``--name`` options, processes collaborate with one another. As long as one of processes is running, Jubatus is available.

In the figure above, processes is distributed on ``N + 1`` machines. Even when a failure occurs in ``N`` of machines, all of instances available.

Jubatus processes all data in memory. In order to prevent the lack of resourses (specially memory), you should pay to attention to the placement of the process.

ZooKeeper
~~~~~~~~~

When running Jubatus on distributed environment, It is a fatal condition that ZooKeeper is not available. For reliable ZooKeeper service, you should note the following:

#. Deploy ZooKeeper in a cluster (an ensemble) using an odd number of machines.
#. To avoid degradation of performance and stability, deploy ZooKeeper on a dedicated machine.

For details, See `the documentation of ZooKeeper <http://zookeeper.apache.org/doc/current/>`_ .

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
