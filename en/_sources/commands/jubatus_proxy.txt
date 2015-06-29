Jubatus Proxies
===============

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubaclassifier_proxy -z <zookeeper_list> [options ...]
  jubaanomaly_proxy -z <zookeeper_list> [options ...]
  ...

Description
--------------------------------------------------

In distributed environment, Jubatus Proxy distributes requests from clients to servers.

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` indicates the default value.
* ``<zookeeper_list>`` is a comma-separated list of ``host:port`` of ZooKeeper servers (e.g., ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``).
  No spaces between values are allowed.
  If you have only one ZooKeeper server, just specify ``host:port`` without comma (e.g., ``10.0.0.1:2181``).

.. program:: jubatus_proxy

.. option:: -p <port>, --rpc-port <port>

   Port number to listen for RPC requests. [9199]

.. option:: -b <address>, --listen_addr <address>

   IPv4 address to listen for RPC requests.

   If not specified, listens for requests on all IPv4 addresses.

.. option:: -B <interface>, --listen_if <interface>

   Network interface to listen for RPC requests.

   If not specified, listens for requests on all network interfaces.

   Cannot be specified altogether with ``--listen_addr`` (in that case this option will be ignored).

.. option:: -c <num>, --thread <num>

   Number of threads to accept RPC connection. [4]

.. option:: -t <seconds>, --timeout <seconds>

   Session timeout of RPC in seconds. [10]

   ``0`` means disable timeout.

.. option:: -Z <seconds>, --zookeeper_timeout <seconds>

   Session timeout between ZooKeeper and Jubatus Proxy in seconds. [10]

.. option:: -I <seconds>, --interconnect_timeout <seconds>

   Timeout of RPC between Jubatus Proxy and Jubatus Servers in seconds. [10]

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   List of ZooKeeper server(s).

.. option:: -l <dirpath>, --logdir <dirpath>

   Path of directory to output ZooKeeper log files.

   If not specified, logs are dumped to the standard error.

.. option:: -g <log_config>, --log_config <log_config>

   Path of the logging configuration file in log4cxx (XML) format.

   If not specified, logs are dumped to the standard output.

.. option:: -E <seconds>, --pool_expire <seconds>

   Session pool timeout in seconds. [60]

   ``0`` means that the session is expired if not used for more than one second.

.. option:: -S <num>, --pool_size <num>

   Maximum size of session pool for each thread. [0]

   ``0`` means unlimited.

.. option:: -v, --version

   Print the version of Jubatus Proxy.

.. option:: -?, --help

   Print the brief usage of the command.
