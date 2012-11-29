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

For all methods, the first parameter of each method (``name``) is a string value to uniquely identify a task in a cluster.
When using standalone mode, this must be left blank (``""``).

.. describe:: bool push(0: string name, 1: string key, 2: double val)

 Add value ``val`` to the key called ``key``.

.. describe:: double sum(0: string name, 1: string key)

 Return value of sum from the key called ``key``.

.. describe:: double stddev(0: string name, 1: string key)

 Return value of standard deviation from the key called ``key``.

.. describe:: double max(0: string name, 1: string key)

 Return the maximum value from the key called ``key``.

.. describe:: double min(0: string name, 1: string key)

 Return the minimum value from the key called ``key``.

.. describe:: double entropy(0: string name, 1: string key)

 Return the value of entropy from the key called ``key``.

.. describe:: double moment(0: string name, 1: string key, 2: int n, 3: double c)

 Return the value of ``n``-th moment of the ``key`` about ``c``.
