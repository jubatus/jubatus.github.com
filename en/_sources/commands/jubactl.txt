jubactl
=======

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubactl [options ...]

Description
--------------------------------------------------

``jubactl`` is a command to manage server processes in distributed environment.

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` indicates the default value.
* ``<zookeeper_list>`` is a comma-separated list of ``host:port`` of ZooKeeper servers (e.g., ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``).
  No spaces between values are allowed.
  If you have only one ZooKeeper server, just specify ``host:port`` without comma (e.g., ``10.0.0.1:2181``).

.. program:: jubactl

.. option:: -c <command>, --cmd <command>

   Send specified command to jubavisors registered to ZooKeeper.
   ``<command>`` should be one of the following.

   ========= =====================================================================================
   Command   Description
   ========= =====================================================================================
   start     Start Jubatus servers
   stop      Stop Jubatus servers
   save      Save the model to directory specified by :option:`jubatus_server -d`
   load      Load the model from directory specified by :option:`jubatus_server -d`
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

   Option given when starting new server process (:option:`jubatus_server -B`).

   Effective only when used with ``--cmd start``.

.. option:: -C <num>, --thread <num>

   Option given when starting new server process (:option:`jubatus_server -c`).

   Effective only when used with ``--cmd start``.

.. option:: -T <seconds>, --timeout <seconds>

   Option given when starting new server process (:option:`jubatus_server -t`).

   Effective only when used with ``--cmd start``.

.. option:: -D <dirpath>, --datadir <dirpath>

   Option given when starting new server process (:option:`jubatus_server -d`).

   Effective only when used with ``--cmd start``.

.. option:: -L <dirpath>, --logdir <dirpath>

   Option given when starting new server process (:option:`jubatus_server -l`).

   Effective only when used with ``--cmd start``.

.. option:: -G <log_config>, --log_config <log_config>

   Option given when starting new server process (:option:`jubatus_server -g`).

   Effective only when used with ``--cmd start``.

.. option:: -X <mixer>, --mixer <mixer>

   Option given when starting new server process (:option:`jubatus_server -x`).

   Effective only when used with ``--cmd start``.

.. option:: -S <seconds>, --interval_sec <seconds>

   Option given when starting new server process (:option:`jubatus_server -s`).

   Effective only when used with ``--cmd start``.

.. option:: -I <count>, --interval_count <count>

   Option given when starting new server process (:option:`jubatus_server -i`).

   Effective only when used with ``--cmd start``.

.. option:: -Z <seconds>, --zookeeper_timeout <seconds>

   Option given when starting new server process (:option:`jubatus_server -Z`).

   Effective only when used with ``--cmd start``.

.. option:: -R <seconds>, --interconnect_timeout <seconds>

   Option given when starting new server process (:option:`jubatus_server -I`).

   Effective only when used with ``--cmd start``.

.. option:: -d, --debug

   This option is deprecated and is no longer be used.

.. option:: -?, --help

   Print the brief usage of the command.
