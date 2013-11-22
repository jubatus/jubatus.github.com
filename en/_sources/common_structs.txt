Common Data Structures and Methods
----------------------------------

These data structures and methods are available in each server.

Data Structures
~~~~~~~~~~~~~~~

.. mpidl:message:: datum

   Represents a set of data used for machine learning in Jubatus.
   See :doc:`fv_convert` for details.

   You can change internal values of a datum with these methods.

   .. mpidl:method:: datum add_string(0: string key, 1: string value)

      :param key: The key of the value to add. Cannot contain "$".
      :param value: The value to add.
      :return:     Returns a pointer to itself.

      Add a string value.

   .. mpidl:method:: datum add_number(0: string key, 1: double value)

      :param key: The key of the value to add.
      :param value: The value to add.
      :return:     Returns a pointer to itself.

      Add a numeric value.

   .. mpidl:method:: datum add_binary(0: string key, 1: raw value)

      :param key: The key of the value to add.
      :param value: The value to add.
      :return:     Returns a pointer to itself.

      Add a binary value.

   Internal representation of a datum is below:

   .. mpidl:member:: 0: list<tuple<string, string> > string_values

      Input data represented in string.
      It is represented as key-value pairs of data.
      Name of keys cannot contain "$" sign.

   .. mpidl:member:: 1: list<tuple<string, double> > num_values

      Input data represented in numeric value.
      It is represented as key-value pairs of data.

   .. mpidl:member:: 2: list<tuple<string, raw> > binary_values

      Input data represented in binary value.
      It is represented as key-value pairs of data.

   .. code-block:: c++

      message datum {
        0: list<tuple<string, string> > string_values
        1: list<tuple<string, double> > num_values
        2: list<tuple<string, raw> > binary_values
      }


Constructor
~~~~~~~~~~~

.. describe:: constructor(string host, int port, string name, int timeout_sec)

   Creates a new RPC client instance.
   ``name`` is a string value to uniquely identify a task in the ZooKeeper cluster.
   When using standalone mode, this must be left blank (``""``).
   ``timeout_sec`` is a length of timeout between the RPC method invocation and response.

   Example usage of constructors are as follows:

.. code-block:: cpp

   // C++
   #include <jubatus/client.hpp>
   using jubatus::classifier::client::classifier;
   // ...
   classifier client("localhost", 9199, "cluster", 10);

.. code-block:: python

   # Python
   from jubatus.classifier.client import classifier
   # ...
   client = classifier("localhost", 9199, "cluster", 10);

.. code-block:: ruby

   // Ruby
   require 'jubatus/classifier/client'
   include Jubatus::Classifier::Client
   // ...
   client = Classifier.new("localhost", 9199, "cluster", 10)

.. code-block:: java

   // Java
   import us.jubat.classifier.ClassifierClient;
   // ...
   ClassifierClient client = new ClassifierClient("localhost", 9199, "cluster", 10);


Methods
~~~~~~~

.. mpidl:method:: bool save(0: string id)

   :param id:   file name to save
   :return:     True if this function saves files successfully at all servers

   Store the learing model to the local disk at **ALL** servers.

.. mpidl:method:: bool load(0: string id)

   :param id:   file name to load
   :return:     True if this function loads files successfully at all servers

   Restore the saved model from local disk at **ALL** servers.

.. mpidl:method:: bool clear()

   :return:     True when the model was cleared successfully

   Completely clears the model at **ALL** servers.

.. mpidl:method:: string get_config()

   :return:     server configuration set on initialization

   Returns server configuration from a server.
   For format of configuration, see API reference of each services.

.. mpidl:method:: map<string, map<string, string> >  get_status()

   :return:     Internal state for each servers. The key of most outer map is in form of ``hostname_portnumber``.

   Returns server status from **ALL** servers.
   Each server is represented by a pair of host name and port.

.. mpidl:method:: mprpc_client get_client()

  :return: MessagePack-RPC client instance

  Returns the reference to the raw MessagePack-RPC client instance which is used by Jubatus client libraries.
  This is not an RPC method.

  The common use case of this method is to close the TCP connection explicitly or to change the timeout.

  ``mprpc_client`` is a type of MessagePack-RPC client that is different between languages (`C++ <http://ci.jubat.us/job/msgpack-rpc/doxygen/classmsgpack_1_1rpc_1_1client.html>`_ / `Python <https://github.com/msgpack/msgpack-rpc-python/blob/master/msgpackrpc/client.py>`_ / `Ruby <http://msgpack.org/rpc/rdoc/current/MessagePack/RPC/Client.html>`_ / `Java <http://msgpack.org/rpc/javadoc/current/org/msgpack/rpc/Client.html>`_).
