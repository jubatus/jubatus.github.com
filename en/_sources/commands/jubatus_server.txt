Jubatus Servers
===============

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubaclassifier [options ...]
  jubaanomaly [options ...]
  ...

Description
--------------------------------------------------

Jubatus server provides the machine learning feature.

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` indicates the default value.
* ``<zookeeper_list>`` is a comma-separated list of ``host:port`` of ZooKeeper servers (e.g., ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``).
  No spaces between values are allowed.
  If you have only one ZooKeeper server, just specify ``host:port`` without comma (e.g., ``10.0.0.1:2181``).

.. program:: jubatus_server

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

   Number of threads to accept RPC connection. [2]

.. option:: -t <seconds>, --timeout <seconds>

   Session timeout of RPC in seconds. [10]

   ``0`` means disable timeout.

.. option:: -d <dirpath>, --datadir <dirpath>

   Path of directory to save and load training models using ``save`` and ``load`` RPC requests. [/tmp]

.. option:: -l <dirpath>, --logdir <dirpath>

   Path of directory to output ZooKeeper log files.

   If not specified, logs are dumped to the standard error.

.. option:: -g <log_config>, --log_config <log_config>

   Path of the logging configuration file in log4cxx (XML) format.

   If not specified, logs are dumped to the standard output.

.. option:: -f <config>, --configpath <config>

   Path of the server configuration file.

   This option must be given when ``--zookeeper`` is not specified (i.e., running in standalone mode).

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   List of ZooKeeper server(s).

   If not specified, Jubatus servers run in standalone mode.

.. option:: -m <model>, --model_file <model>

   Path of the model file to load at startup.

.. option:: -n <name>, --name <name>

   The instance name, which is a value to uniquely identify a task in the ZooKeeper cluster.

   This option must be given only if ``--zookeeper`` is specified.

   ``<name>`` should not contain characters that cannot be used as ZooKeeper node name (such as ``/``).

.. option:: -x <mixer>, --mixer <mixer>

   MIX strategy used when choosing MIX node. [linear_mixer]

   One of ``linear_mixer``, ``random_mixer``, ``broadcast_mixer``, or ``skip_mixer`` can be specified.
   MIX strategies available may differ depending on the engine.

.. option:: -s <seconds>, --interval_sec <seconds>

   Invoke "mix" in every ``<seconds>`` second. [16]

   Specifying ``0`` disables time-based mix invocation.

.. option:: -i <count>, --interval_count <count>

   Invoke "mix" in every ``<count>`` updates. [512]

   The update is counted when API that updates the training model (such as ``train`` in the classifier) is called.

   Specifying ``0`` disables update-based mix invocation.

.. option:: -Z <seconds>, --zookeeper_timeout <seconds>

   Session timeout between ZooKeeper and Jubatus Server in seconds. [10]

.. option:: -I <seconds>, --interconnect_timeout <seconds>

   Timeout of RPC between Jubatus Servers in seconds. [10]

.. option:: -v, --version

   Print the version of Jubatus server.

.. option:: -?, --help

   Print the brief usage of the command.
