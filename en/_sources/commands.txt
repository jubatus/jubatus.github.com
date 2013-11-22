Commands
========

* ``[]`` indicates the default value.
* ``<zookeeper_list>`` is a comma-separated list of ``host:port`` of ZooKeeper servers (e.g., ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``).
  No spaces between values are allowed.
  If you have only one ZooKeeper server, just specify ``host:port`` without comma (e.g., ``10.0.0.1:2181``).

Jubatus Servers
---------------

Jubatus server provides the machine learning feature.

.. program:: server

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

   Path of directory to output log files.

   If not specified, logs are dumped to the standard error.

.. option:: -e <level>, --loglevel <level>

   Minimal level of log to output. [0]

   INFO, WARNING, ERROR, FATAL corresponds to 0, 1, 2, 3, respectively.

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

.. option:: -j, --join

   Join to the existing cluster.

   New processes should join to the existing cluster with this option otherwise the machine learning won't work.

   This option is currently not implemented.

.. option:: -s <seconds>, --interval_sec <seconds>

   Invoke "mix" in every ``<seconds>`` second. [16]

.. option:: -i <count>, --interval_count <count>

   Invoke "mix" in every ``<count>`` updates. [512]

   The update is counted when API that updates the training model (such as ``train`` in the classifier) is called.

.. option:: -Z <seconds>, --zookeeper_timeout <seconds>

   Session timeout between ZooKeeper and Jubatus Server in seconds. [10]

.. option:: -I <seconds>, --interconnect_timeout <seconds>

   Timeout of RPC between Jubatus Servers in seconds. [10]

.. option:: -v, --version

   Print the version of Jubatus server.

.. option:: -?, --help

   Print the brief usage of the command.

Distributed Environment
-----------------------

Jubatus Proxies
~~~~~~~~~~~~~~~

In distributed environment, Jubatus Proxy distributes requests from clients to servers.

.. program:: proxy

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

   Number of threads to accept RPC connection. [16]

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

   Path of directory to output log files.

   If not specified, logs are dumped to the standard error.

.. option:: -e <level>, --loglevel <level>

   Minimal level of log to output. [0]

   INFO, WARNING, ERROR, FATAL corresponds to 0, 1, 2, 3, respectively.

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

jubavisor
~~~~~~~~~

``jubavisor`` is a daemon process controlled by ``jubactl``.

.. program:: jubavisor

.. option:: -p <port>, --rpc-port <port>

   Port number to listen for RPC requests. [9198]

.. option:: -t <seconds>, --timeout <seconds>

   Session timeout of RPC in seconds. [10]

.. option:: -l <dirpath>, --logdir <dirpath>

   Path of directory to output log files.

   If not specified, logs are dumped to the standard error.

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   List of ZooKeeper server(s).

.. option:: -d, --daemon

   Daemonize the process.

.. option:: -?, --help

   Print the brief usage of the command.

jubactl
~~~~~~~

``jubactl`` is a command to manage server processes in distributed environment.

.. program:: jubactl

.. option:: -c <command>, --cmd <command>

   Send specified command to jubavisors registered to ZooKeeper.
   ``<command>`` should be one of the following.

   ========= =====================================================================================
   Command   Description
   ========= =====================================================================================
   start     Start Jubatus servers
   stop      Stop Jubatus servers
   save      Save the model to directory specified by :option:`server -d`
   load      Load the model from directory specified by :option:`server -d`
   status    Print the status of servers, proxies and jubavisors
   ========= =====================================================================================

.. option:: -s <program>, --server <program>

   Executable file of the server program (e.g., ``jubaclassifier``, ``jubarecommender``, ...).

.. option:: -n <name>, --name <name>

   The instance name, which is a value to uniquely identify a task in the ZooKeeper cluster.

.. option:: -t <type>, --type <type>

   Type of the server program (e.g., ``classifier``, ``recommender``, ...).

.. option:: -N <num>, --num <num>

   Number of processes in the whole cluster.

   Effective only when used with ``--cmd start``.

   When ``0`` is specified, start 1 process on each jubavisor.

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   List of ZooKeeper server(s).

   If not specified, environment variable ``ZK`` will be used.

.. option:: -i <id>, --id <id>

   ID of file name to save or load.

   Effective only when used with ``--cmd save`` and ``--cmd load``.

   If not specified, the value that specified by ``--name`` will be used.

.. option:: -B <interface>, --listen_if <interface>

   Option given when starting new server process (:option:`server -B`).

   Effective only when used with ``--cmd start``.

.. option:: -C <num>, --thread <num>

   Option given when starting new server process (:option:`server -c`).

   Effective only when used with ``--cmd start``.

.. option:: -T <seconds>, --timeout <seconds>

   Option given when starting new server process (:option:`server -t`).

   Effective only when used with ``--cmd start``.

.. option:: -D <dirpath>, --datadir <dirpath>

   Option given when starting new server process (:option:`server -d`).

   Effective only when used with ``--cmd start``.

.. option:: -L <dirpath>, --logdir <dirpath>

   Option given when starting new server process (:option:`server -l`).

   Effective only when used with ``--cmd start``.

.. option:: -E <level>, --loglevel <level>

   Option given when starting new server process (:option:`server -e`).

   Effective only when used with ``--cmd start``.

.. option:: -X, --mixer

   Option given when starting new server process (:option:`server -x`).

   Effective only when used with ``--cmd start``.

.. option:: -J, --join

   Option given when starting new server process (:option:`server -j`).

   Effective only when used with ``--cmd start``.

.. option:: -S <seconds>, --interval_sec <seconds>

   Option given when starting new server process (:option:`server -s`).

   Effective only when used with ``--cmd start``.

.. option:: -I <count>, --interval_count <count>

   Option given when starting new server process (:option:`server -i`).

   Effective only when used with ``--cmd start``.

.. option:: -Z <seconds>, --zookeeper_timeout <seconds>

   Option given when starting new server process (:option:`server -Z`).

   Effective only when used with ``--cmd start``.

.. option:: -R <seconds>, --interconnect_timeout <seconds>

   Option given when starting new server process (:option:`server -I`).

   Effective only when used with ``--cmd start``.

.. option:: -d, --debug

   Run in debug mode.

.. option:: -?, --help

   Print the brief usage of the command.

jubaconfig
~~~~~~~~~~

In distributed environment, ``jubaconfig`` manages the configuration files of Jubatus servers that are registered on ZooKeeper.

.. program:: jubaconfig

.. option:: -c <command>, --cmd <command>

   Specify the action to perform on configuration files.
   ``<command>`` should be one of the following.

   ========= =====================================================================================
   Command   Description
   ========= =====================================================================================
   write     Register configuration file on the local file system to ZooKeeper
   read      Display configuration file registered on ZooKeeper
   delete    Remove configuration file registered on ZooKeeper
   list      List configuration file registered on ZooKeeper
   ========= =====================================================================================

.. option:: -f <file>, --file <file>

   Path of the configuration file to register to ZooKeeper.

   Effective only when used with ``--cmd write``.

.. option:: -t <type>, --type <type>

   Type of the server program (e.g., ``classifier``, ``recommender``, ...).

   Effective only when used with one of ``--cmd write``, ``--cmd read`` or ``--cmd delete``.

.. option:: -n <name>, --name <name>

   The instance name, which is a value to uniquely identify a task in the ZooKeeper cluster.

   Effective only when used with one of ``--cmd write``, ``--cmd read`` or ``--cmd delete``.

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   List of ZooKeeper server(s).

   If not specified, environment variable ``ZK`` will be used.

.. option:: -d, --debug

   Run in debug mode.

.. option:: -?, --help

   Print the brief usage of the command.

Utilities
---------

.. _jubaconv:

jubaconv
~~~~~~~~

``jubaconv`` is a tool to test your fv_converter configuration.

``jubaconv`` simulates the internal behavior of fv_converter and displays the result of conversion on the command-line.

Example of usage is as shown below:

.. code-block:: none

   $ cat data.json
   { "message": "hello world", "age": 31 }

   $ jubaconv -i json -o fv -c /opt/jubatus/share/jubatus/example/config/classifier/pa.json < data.json
   /message$hello world@str#bin/bin: 1
   /age@num: 31

   $ cat datum.json
   {
     "string_values": {
       "hello": "world"
     },
     "num_values": {
       "age": 31
     }
   }

   $ jubaconv -i datum -o fv -c /opt/jubatus/share/jubatus/example/config/classifier/pa.json < datum.json
   hello$world@str#bin/bin: 1
   age@num: 31

.. program:: jubaconv

.. option:: -i <format>, --input-format <format>

   Format of the input. [json]

   ``<format>`` must be one of ``json`` or ``datum``.

.. option:: -o <format>, --output-format <format>

   Format of the output. [fv]

   ``<format>`` must be one of ``json``, ``datum`` or ``fv``.

.. option:: -c <config>, --conf <config>

   Jubatus server configuration file in JSON (see :doc:`fv_convert`).

   This option must be given only if ``fv`` is specified for :option:`-o`.

.. _jenerator:

jenerator
~~~~~~~~~

``jenerator`` generates implementation of proxy, server template and C++ client from extended MessagePack-IDL file. See :doc:`server` for details.

``jenerator`` is not installed by default (see ``tools/jenerator`` in the source tree).

.. code-block:: none

  $ jenerator -l <lang> [options ...] idl ...

.. program:: jenerator

.. option:: -l <lang>

   Language of the client code to generate. Currently ``cpp``, ``java``, ``python``, and ``ruby`` are supported.
   Specify ``server`` if you need to generate servers and proxies.

.. option:: -o <dirpath>

   Directory to output the generated source files.

   If not specified, the current directory will be used.

.. option:: -i

   Use relative path for ``#include`` directives.

   Effective only when generating C++ code (servers, proxies and C++ clients).
   This option is intended for use by Jubatus developers.
   You don't need this option except you're going to build generated code inside Jubatus source tree.

.. option:: -n <namespace>

   Declare the specified namespace for generated source.

.. option:: -t

   Generate server template.

   Effective only when generating servers and proxies.

.. option:: -g <guard>

   Prefix used for include guards in header files.

   Effective only when generating C++ code (servers, proxies and C++ clients).

.. option:: -help, --help

   Print the brief usage of the command.
