Architecture
============

Jubatus has a client-server architecture.
The simplest process configuration is single client process and single server process like following figure.

.. blockdiag::

    blockdiag single_single {
      group classifier{
      color = "#77FF77"
      jubaclassifier;
      }

      group client{
      color = "#FF7777"
      client;
      }

      client -> jubaclassifier;
      }

Jubatus can make use of multiple server processes in order to scale out the system.
By throwing queries to Jubatus Proxy, we can execute machine learning requests (update/analyze) with multiple server processes.

Jubatus Proxy proxy queries from clients to appropriate server(s).
Clients work as if it is communicating with just one server.
In other words, clients don't need to know whether it is connecting to a server or a Jubatus Proxy.

Jubatus Proxy use ZooKeeper to keep-aliving and load-balancing each Jubatus servers.

.. blockdiag::

    blockdiag single_multi {
      group classifier{
      color = "#77FF77"
      jubaclassifier1;
      jubaclassifier2;
      jubaclassifier3;
      }

      group client{
      color = "#FF7777"
      client;
      }

      group proxy{
      color = "#7777FF"
      jubaclassifier_proxy;
      }
      client -> jubaclassifier_proxy -> jubaclassifier1, jubaclassifier2, jubaclassifier3;
    }

Sometimes we want to distribute clients because data size is huge, or source of data is far from server.
Jubatus can achieve this by creating multiple Jubatus Proxy and assigning different Jubatu Proxy to each client.

.. blockdiag::

    blockdiag multi_multi {
      group classifier{
      color = "#77FF77"
      jubaclassifier1; jubaclassifier2; jubaclassifier3
      }

      group client{
      color = "#FF7777"
      client1;
      client2;
      client3;
      }

      group proxy{
      color = "#7777FF"
      jubaclassifier_proxy1;
      jubaclassifier_proxy2;
      jubaclassifier_proxy3;
      }
      
      client1 -> jubaclassifier_proxy1 -> jubaclassifier1;
                 jubaclassifier_proxy1 -> jubaclassifier2;
                 jubaclassifier_proxy1 -> jubaclassifier3;
      client2 -> jubaclassifier_proxy2 -> jubaclassifier1;
                 jubaclassifier_proxy2 -> jubaclassifier2;
                 jubaclassifier_proxy2 -> jubaclassifier3;
      client3 -> jubaclassifier_proxy3 -> jubaclassifier1;
                 jubaclassifier_proxy3 -> jubaclassifier2;
                 jubaclassifier_proxy3 -> jubaclassifier3;
      }

The following picture describes how to run programs used by management process.
Please note that "semimaster", "jubatusctrl" and "jubatus_classifier_server" is now called as "jubaclassifier_proxy", "jubactl" and "jubaclassifier", respectively.

.. figure:: ../_static/processes.png
   :width: 90 %
   :alt: relationship of processes
