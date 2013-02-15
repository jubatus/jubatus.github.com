Common Data Structures and Methods
----------------------------------

These data structures and methods are available in each server.

Data Structures
~~~~~~~~~~~~~~~

.. mpidl:message:: datum

   Represents a set of data used for machine learning in Jubatus.
   See :doc:`fv_convert` for details.

   .. mpidl:member:: 0: list<tuple<string, string> > string_values

      Input data represented in string.
      It is represented as key-value pairs of data.

   .. mpidl:member:: 1: list<tuple<string, double> > num_values

      Input data represented in numeric value.
      It is represented as key-value pairs of data.

   .. code-block:: c++

      message datum {
        0: list<tuple<string, string> > string_values
        1: list<tuple<string, double> > num_values
      }


Methods
~~~~~~~

For all methods, the first parameter of each method (``name``) is a string value to uniquely identify a task in the ZooKeeper cluster.
When using standalone mode, this must be left blank (``""``).

.. mpidl:method:: bool save(0: string name, 1: string id)

   :param name: string value to uniquely identifies a task in the ZooKeeper cluster
   :param id:   file name to save
   :return:     True if this function saves files successfully at all servers

   Store the learing model to the local disk at **ALL** servers.


.. mpidl:method:: bool load(0: string name, 1: string id)

   :param name: string value to uniquely identifies a task in the ZooKeeper cluster
   :param id:   file name to load
   :return:     True if this function loads files successfully at all servers

   Restore the saved model from local disk at **ALL** servers.


.. mpidl:method:: string get_config(0: string name)

   :param name: string value to uniquely identifies a task in the ZooKeeper cluster
   :return:     server configuration set on initialization

   Returns server configuration from a server.
   For format of configuration, see API reference of each services.


.. mpidl:method:: map<string, map<string, string> >  get_status(0: string name)

   :param name: string value to uniquely identifies a task in the ZooKeeper cluster
   :return:     Internal state for each servers. The key of most outer map is in form of ``hostname_portnumber``.

   Returns server status from **ALL** servers.
   Each server is represented by a pair of host name and port.
