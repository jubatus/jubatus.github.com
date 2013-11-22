Stat
----

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/stat.idl>`_ for detailed specification.

Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each filed below:

.. describe:: window_size

   Number of values to store.
   (Integer)


Example:
  .. code-block:: javascript

     {
       "window_size": 128
     }


Data Structures
~~~~~~~~~~~~~~~

None.


Methods
~~~~~~~

.. mpidl:service:: stat

   .. mpidl:method:: bool push(0: string key, 1: double value)

      Adds value ``val`` to the attribute ``key``.

   .. mpidl:method:: double sum(0: string key)

      Returns the sum of values in the attribute ``key``.

   .. mpidl:method:: double stddev(0: string key)

      Returns the standard deviation of values in the attribute ``key``.

   .. mpidl:method:: double max(0: string key)

      Returns the maximum value of values in the attribute ``key``.

   .. mpidl:method:: double min(0: string key)

      Returns the minimum value of values in the attribute ``key``.

   .. mpidl:method:: double entropy(0: string key)

      Returns the entropy of values in the attribute ``key``.

   .. mpidl:method:: double moment(0: string key, 1: int degree, 2: double center)

      Returns the ``degree``-th moment about ``center`` of values in the attribute ``key``.
