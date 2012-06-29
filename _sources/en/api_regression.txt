jubatus::client::regression
---------------------------

See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/regression.idl>`_ for original and detailed spec.

typedef
~~~~~~~

.. describe:: jubatus::regression::config_data


.. code-block:: c++

   message config_data {

     0: string method

     1: converter_config converter

   }



regression methods
~~~~~~~~~~~~~~~~~~

.. describe:: int train(0: string name, list<tuple<float, datum> > train_data)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``train_data`` : list of pair of label and datum

 - Returns:

  - Zero if this function updates models successfully.

 Training model at a server chosen randomly. ``tuple<float, datum>`` is a tuple of datum and it's value. 
 This function is designed to allow bulk update with list of tuple of value and datum.


.. describe:: list<float> estimate(0: string name, 1: list<datum> data)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``data`` : vector of datum for classifiy

 - Returns:

  - Vector of estimate_results

 Estimating a result at a server choosen randomly. ``estimate`` is a vector of estimated value.

