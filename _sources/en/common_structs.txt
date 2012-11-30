Common Data Structures and Methods
----------------------------------

These data structures and methods are available in each server.
Note that ``get_config`` and ``set_config`` are not available in Graph.

Data Structures
~~~~~~~~~~~~~~~

.. describe:: datum

 Represents a set of data used for machine learning in Jubatus.
 See :doc:`fv_convert` for details.

.. code-block:: c++

   message datum {
     0: list<tuple<string, string> > string_values
     1: list<tuple<string, double> > num_values
   }

Methods
~~~~~~~

For all methods, the first parameter of each method (``name``) is a string value to uniquely identify a task in the ZooKeeper cluster.
When using standalone mode, this must be left blank (``""``).

.. describe:: bool save(0: string name, 1: string id)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``id`` : file name to save

 - Returns:

  - True if this function saves files successfully at all servers

 Store the learing model to the local disk at **ALL** servers.

.. describe:: bool load(0: string name, 1: string id)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``id`` : file name to load

 - Returns:

  - True if this function loads files successfully at all servers

 Restore the saved model from local disk at **ALL** servers.

.. describe:: bool set_config(0: string name, 1: config_data c)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``c`` : configuration data

 - Returns:

  - True if this function successfully updated configuration at all servers

 Updates server configuration at **ALL** servers.
 For definition of ``config_data``, see API reference of each services.

.. describe:: config_data get_config(0: string name)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster

 - Returns:

  - server configuration set by ``set_config``

 Returns server configuration from a server.
 For definition of ``config_data``, see API reference of each services.

.. describe:: map<string, map<string, string > > get_status(string name)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster

 - Returns:

  - Internal state for each servers. The key of most outer map is in form of ``hostname_portnumber``.

 Returns server status from **ALL** servers.
 Each server is represented by a pair of host name and port.
