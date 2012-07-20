jubatus::client::stat
---------------------

See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/stat.idl>`_ for original and detailed spec.

typedef
~~~~~~~

.. describe:: jubatus::stat::config_data

.. code-block:: c++

   message config_data {

     0: int window_size

   }


stat methods
~~~~~~~~~~~~

.. describe:: bool push(0: string name, 1: string key, 2: double val)

.. describe:: double sum(0: string name, 1: string key)

.. describe:: double stddev(0: string name, 1: string key)

.. describe:: double max(0: string name, 1: string key)

.. describe:: double min(0: string name, 1: string key)

.. describe:: double entropy(0: string name, 1: string key)

.. describe:: double moment(0: string name, 1: string key, 2: int n, 3: double c)
