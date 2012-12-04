Stat
----

See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/stat.idl>`_ for detailed specification.

Data Structures
~~~~~~~~~~~~~~~

.. describe:: config_data

 Represents a configuration of the server.
 ``window_size`` is a number of values to hold.

.. code-block:: c++

   message config_data {
     0: int window_size
   }

Methods
~~~~~~~

For all methods, the first parameter of each method (``name``) is a string value to uniquely identify a task in the ZooKeeper cluster.
When using standalone mode, this must be left blank (``""``).

.. describe:: bool push(0: string name, 1: string key, 2: double val)

 Adds value ``val`` to the attribute ``key``.

.. describe:: double sum(0: string name, 1: string key)

 Returns the sum of values in the attribute ``key``.

.. describe:: double stddev(0: string name, 1: string key)

 Returns the standard deviation of values in the attribute ``key``.

.. describe:: double max(0: string name, 1: string key)

 Returns the maximum value of values in the attribute ``key``.

.. describe:: double min(0: string name, 1: string key)

 Returns the minimum value of values in the attribute ``key``.

.. describe:: double entropy(0: string name, 1: string key)

 Returns the entropy of values in the attribute ``key``.

.. describe:: double moment(0: string name, 1: string key, 2: int n, 3: double c)

 Returns the ``n``-th moment about ``c`` of values in the attribute ``key``.
