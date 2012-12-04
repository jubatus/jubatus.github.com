Commands
========

* ``[]`` indicates the default value.
* ``<zookeeper_list>`` is a comma-separated list of ``host:port`` of ZooKeeper servers (e.g., ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``).
  No spaces between values are allowed.
  If you have only one ZooKeeper server, just specify ``host:port`` without comma (e.g., ``10.0.0.1:2181``).

Jubatus Servers
---------------

.. program:: server

.. option:: -p <port>, --rpc-port <port>

   Port number to listen for RPC requests. [9199]

.. option:: -c <num>, --thread <num>

   Number of threads to accept RPC connection. [2]

.. option:: -t <seconds>, --timeout <seconds>

   Session timeout of RPC in seconds. [10]

.. option:: -d <dirpath>, --tmpdir <dirpath>

   Path of directory to save and load training models using ``save`` and ``load`` RPC requests. [/tmp]

.. option:: -l <dirpath>, --logdir <dirpath>

   Path of directory to output log files.

   If not specified, logs are dumped to the standard error.

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   List of ZooKeeper server(s).

   If not specified, Jubatus servers run in standalone mode.

.. option:: -n <name>, --name <name>

   The instance name, which is a value to uniquely identify a task in the ZooKeeper cluster.

   This option must be given only if ``--zookeeper`` is specified.

   ``<name>`` should not contain characters that cannot be used as ZooKeeper node name (such as ``/``).

.. option:: -j, --join

   Join to the existing cluster.

   New processes should join to the existing cluster with this option otherwise the machine learning won't work.

   This option is currently not implemented.

.. option:: -s <seconds>, --interval_sec <seconds>

   Invoke "mix" in every ``<seconds>`` second. [16]

.. option:: -i <count>, --interval_count <count>

   Invoke "mix" in every ``<count>`` updates. [512]

   The update is counted when API that updates the training model (such as ``train`` in the classifier) is called.

.. option:: -v, --version

   Print the version of Jubatus server.

.. option:: -?, --help

   Print the brief usage of the command.

Distributed Environment
-----------------------

Jubatus Keepers
~~~~~~~~~~~~~~~

.. program:: keeper

.. option:: -p <port>, --rpc-port <port>

   Port number to listen for RPC requests. [9199]

.. option:: -c <num>, --thread <num>

   Number of threads to accept RPC connection. [16]

.. option:: -t <seconds>, --timeout <seconds>

   Session timeout of RPC in seconds. [10]

.. option:: -l <dirpath>, --logdir <dirpath>

   Path of directory to output log files.

   If not specified, logs are dumped to the standard error.

.. option:: -z <zookeeper_list>, --zookeeper <zookeeper_list>

   List of ZooKeeper server(s).

.. option:: -v, --version

   Print the version of Jubatus keeper.

.. option:: -?, --help

   Print the brief usage of the command.

jubavisor
~~~~~~~~~

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

.. program:: jubactl

.. option:: -c <command>, --cmd <command>

   Send specified command to jubavisors registered to ZooKeeper.
   ``<command>`` should be one of the following.

   ========= =====================================================================================
   Command   Description
   ========= =====================================================================================
   start     Start Jubatus servers
   stop      Stop Jubatus servers
   save      Save the model to directory specified by :option:`server -t`
   load      Load the model from directory specified by :option:`server -t`
   status    Print the status of servers, keepers and jubavisors
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

.. option:: -C <num>, --thread <num>

   Option given when starting new server process (:option:`server -c`).

   Effective only when used with ``--cmd start``.

.. option:: -T <seconds>, --timeout <seconds>

   Option given when starting new server process (:option:`server -t`).

   Effective only when used with ``--cmd start``.

.. option:: -D <dirpath>, --tmpdir <dirpath>

   Option given when starting new server process (:option:`server -d`).

   Effective only when used with ``--cmd start``.

.. option:: -L <dirpath>, --logdir <dirpath>

   Option given when starting new server process (:option:`server -l`).

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

.. program:: jubaconv

.. option:: -i <format>, --input-format <format>

   Format of the input. [json]

   ``<format>`` must be one of ``json`` or ``datum``.

.. option:: -o <format>, --output-format <format>

   Format of the output. [fv]

   ``<format>`` must be one of ``json``, ``datum`` or ``fv``.

.. option:: -c <config>, --conf <config>

   fv_converter configuration file in JSON (see :doc:`fv_convert`).

   This option must be given only if ``fv`` is specified for :option:`-o`.

.. _jenerator:

jenerator
~~~~~~~~~

``jenerator`` generates C++ source of keeper and server template from extended MessagePack-IDL file.

``jenerator`` is not installed by default (see ``src/tools/generator`` in the source tree).

.. code-block:: none

  $ jenerator <idl-file> [options...]

.. program:: jenerator

.. option:: -o <dirpath>

   Directory to output the generated source files.

.. option:: -i

   Use relative path for ``#include`` directives.

   This option is intended for use by Jubatus developers; you don't need this option in most cases.

.. option:: -n <namespace>

   Declare the specified namespace for generated source.

.. option:: -t

   Generate server template.

.. option:: -d

   Run in debug mode.

.. option:: -help, --help

   Print the brief usage of the command.
