
Common structs and interfaces
-----------------------------

These structs and interfaces are available in classifier, regression and recommender.
save, load and get_status are available in stat.

jubatus::converter_config
~~~~~~~~~~~~~~~~~~~~~~~~~

.. describe:: jubatus::converter_config

.. code-block:: c++

   type  param_t = map<string, string>

   message converter_config {
     0: map<string, param_t> string_filter_types

     1: list<filter_rule> string_filter_rules

     2: map<string, param_t> num_filter_types

     3: list<filter_rule> num_filter_rules

     4: map<string, param_t> string_types

     5: list<string_rule> string_rules

     6: map<string, param_t> num_types

     7: list<num_rule> num_rules
   }

See :ref:`conversion` to know in detail converter_config

common methods
--------------

.. describe:: bool save(0: string name, 1: string id)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``id`` : filename

 - Returns:

  - True if this function saves files successfully at all servers.

 Storing learing models to local disk at **ALL** servers.


.. describe:: bool load(0: string name, 1: string id)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``id`` : filename

 - Returns:

  - True if this function loads files successfully at all servers

 Restoreing learning models from local disk at **ALL** servers.


.. describe:: bool set_config(0: string name, 1: config_data c)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``c`` : config_data

Updates server config at **ALL** servers.


.. describe:: config_data get_config(0: string name)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum

 - Returns:

  - config_data

 Getting server config from a server chosen randomly.

.. describe:: map<string, map<string, string > > get_status(string name)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum

 - Returns:

  - Internal state for each servers.

 Getting server status from **ALL** servers. Each server is represented by a pair of host name and port.

