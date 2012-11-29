Regression
----------

See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/regression.idl>`_ for detailed specification.

Data Structures
~~~~~~~~~~~~~~~

.. describe:: config_data

 Represents a configuration of the server.
 ``method`` is an algorithm used for regression.
 Currently, only ``PA`` can be specified.
 ``converter`` is a string in JSON format described in :doc:`fv_convert`.

.. code-block:: c++

   message config_data {
     0: string method
     1: string config
   }

Methods
~~~~~~~

.. describe:: int train(0: string name, list<tuple<float, datum> > train_data)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in cluster
  - ``train_data`` : list of tuple of label and datum

 - Returns:

  - Zero if this function updates models successfully

 Train and update the model. ``tuple<float, datum>`` is a tuple of datum and its value. 
 This function is designed to allow bulk update with list of ``tuple<float, datum>``.

.. describe:: list<float> estimate(0: string name, 1: list<datum> data)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in cluster
  - ``data`` : list of datum to estimate

 - Returns:

  - List of estimated values, in order of given datum

 Estimate the value from given ``data``.
 This API is designed to allow bulk estimation with list of ``datum``.
