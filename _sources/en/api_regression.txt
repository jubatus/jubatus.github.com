Regression
----------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/regression.idl>`_ for detailed specification.
* See :doc:`method` for detailed description of algorithms used in this server.

Data Structures
~~~~~~~~~~~~~~~

.. describe:: config_data

 Represents a configuration of the server.
 ``method`` is an algorithm used for regression.
 Currently, only ``PA`` can be specified.
 ``config`` is a string in JSON format described in :doc:`fv_convert`.

.. code-block:: c++

   message config_data {
     0: string method
     1: string config
   }

Methods
~~~~~~~

For all methods, the first parameter of each method (``name``) is a string value to uniquely identify a task in the ZooKeeper cluster.
When using standalone mode, this must be left blank (``""``).

.. describe:: int train(0: string name, list<tuple<float, datum> > train_data)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``train_data`` : list of tuple of label and datum

 - Returns:

  - Number of trained datum (i.e., the length of the ``train_data``)

 Trains and updates the model.
 ``tuple<float, datum>`` is a tuple of datum and its value.
 This function is designed to allow bulk update with list of ``tuple<float, datum>``.

.. describe:: list<float> estimate(0: string name, 1: list<datum> estimate_data)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``estimate_data`` : list of datum to estimate

 - Returns:

  - List of estimated values, in order of given datum

 Estimates the value from given ``estimate_data``.
 This API is designed to allow bulk estimation with list of ``datum``.
