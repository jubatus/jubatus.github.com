jubaconfig
==========

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubaconfig --cmd <command> [options ...]

Description
--------------------------------------------------

In distributed environment, ``jubaconfig`` manages the configuration files of Jubatus servers that are registered on ZooKeeper.

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` indicates the default value.
* ``<zookeeper_list>`` is a comma-separated list of ``host:port`` of ZooKeeper servers (e.g., ``10.0.0.1:2181,10.0.0.2:2181,10.0.0.3:2181``).
  No spaces between values are allowed.
  If you have only one ZooKeeper server, just specify ``host:port`` without comma (e.g., ``10.0.0.1:2181``).

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

   This option is deprecated and is no longer be used.

.. option:: -?, --help

   Print the brief usage of the command.
