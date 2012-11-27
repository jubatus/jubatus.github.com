
Common Data Structures and Methods
----------------------------------

These data structures and methods are available in each server.
Note that ``get_config`` and ``set_config`` are not supported on ``graph``.

Datum
~~~~~

.. describe:: jubatus::datum

 Class that represents the data used for machine learning in Jubatus. See :doc:`fv_convert` for details.

.. code-block:: c++

   message datum {
     0: list<tuple<string, string> > string_values
     1: list<tuple<string, double> > num_values
   }

Methods
~~~~~~~

.. describe:: bool save(0: string name, 1: string id)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``id`` : file name to save

 - Returns:

  - True if this function saves files successfully at all servers

 Store the learing model to the local disk at **ALL** servers.


.. describe:: bool load(0: string name, 1: string id)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``id`` : file name to load

 - Returns:

  - True if this function loads files successfully at all servers

 Restore the saved model from local disk at **ALL** servers.


.. describe:: bool set_config(0: string name, 1: config_data c)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``c`` : config_data

 - Returns:

  - True if this function successfully updated configuration at all servers

 Updates server configuration at **ALL** servers.


.. describe:: config_data get_config(0: string name)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum

 - Returns:

  - server configuration set by ``set_config``

 Returns server configuration from a server chosen randomly.

.. describe:: map<string, map<string, string > > get_status(string name)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum

 - Returns:

  - Internal state for each servers. The key of most outer map is in format of ``hostname_portnumber``.

 Returns server status from **ALL** servers. Each server is represented by a pair of host name and port.

