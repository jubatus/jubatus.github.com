jubavisor
=========

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubavisor [options ...]

Description
--------------------------------------------------

``jubavisor`` is a daemon process controlled by ``jubactl``.

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` indicates the default value.
* ``<zookeeper_list>`` is a comma-separated list of ``host:port`` of ZooKeeper servers (e.g., ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``).
  No spaces between values are allowed.
  If you have only one ZooKeeper server, just specify ``host:port`` without comma (e.g., ``10.0.0.1:2181``).

.. program:: jubavisor

.. option:: -p <port>, --rpc-port <port>

   Port number to listen for RPC requests. [9198]

.. option:: -t <seconds>, --timeout <seconds>

   Session timeout of RPC in seconds. [10]

.. option:: -l <dirpath>, --logdir <dirpath>

   Path of directory to output ZooKeeper log files.

   If not specified, logs are dumped to the standard error.

.. option:: -g <log_config>, --log_config <log_config>

   Path of the logging configuration file in log4cxx (XML) format.

   If not specified, logs are dumped to the standard output.

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   List of ZooKeeper server(s).

.. option:: -d, --daemon

   Daemonize the process.

.. option:: -?, --help

   Print the brief usage of the command.
