Programming API
===============

jubaclassifier, jubaregression, jubarecommender and jubastat have a MessagePack-RPC Interface for user's clients. You can implement your client-side logics with any programing languages if messagepack-idl supports it.
There exists C++/Python client as of Aplil 2012.

.. We describe the jubatus API using C++ notetion in this document.
.. It is implemented in other languages ​​as well, you should read properly.

basic structs
-------------

jubatus::converter_config
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: cpp

   typedef std::map<std::string, std::string> param_t;

   struct converter_config {
     std::map<std::string, param_t> string_filter_types;
     std::vector<filter_rule> string_filter_rules;

     std::map<std::string, param_t> num_filter_types;
     std::vector<filter_rule> num_filter_rules;

     std::map<std::string, param_t> string_types;
     std::vector<string_rule> string_rules;

     std::map<std::string, param_t> num_types;
     std::vector<num_rule> num_rules;
   };

See :ref:`conversion` to know in detail converter_config

common methods
-----------------

.. cpp:function:: bool save(std::string name, std::string arg1)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``arg1`` : filename

 - Returns:

  - True if this function saves files successfully at all servers.

 Storing learing models to local disk at **ALL** servers.


.. cpp:function:: bool load(std::string name, std::string arg1)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``arg1`` : filename

 - Returns:

  - True if this function loads files successfully at all servers

 Restoreing learning models from local disk at **ALL** servers.


.. cpp:function:: bool set_config(std::string name, config_data c)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``c`` : config_data

 - Returns:

  - True if this function sets config_data successfully at all servers.

  Updating server config at **ALL** servers.


.. cpp:function:: config_data get_config(std::string name)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum

 - Returns:

  - config_data

 Getting server config from a server chosen randomly.

.. cpp:function:: std::map<std::string, std::map<std::string, std::string > > get_status(std::string name)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum

 - Returns:

  - Internal state for each servers.

 Getting server status from **ALL** servers. Each server is represented by a pair of host name and port.


Machine learning functions
---------------------------


.. toctree::
   :maxdepth: 2

   api_classifier
   api_regression
   api_recommender
   api_stat


