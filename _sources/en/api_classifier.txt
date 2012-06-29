jubatus::client::classifier
---------------------------

See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/classifier.idl>`_ for original and detailed spec.

types
~~~~~

.. code-block:: c++

   message config_data {
     string method;
     jubatus::converter_config converter;
   };


.. code-block:: c++

   message estimate_result {
     std::string label_;
     double prob_;
   };



classifier methods
~~~~~~~~~~~~~~~~~~

.. describe:: train(0: string name, 1: list<tuple<string, datum> > data)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``data`` : list of tuple of label and datum

 - Returns:

  - Zero if this function updates models successfully.

 Training model at a server chosen randomly. ``tuple<string, datum>`` is a tuple of datum and it's label. 
 This function is designed to allow bulk update with list of tuple of label and datum.


.. describe:: list<list<estimate_result> > classify(0: string name, 1: list<datum> data)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``data`` : list of datum for classifiy

 - Returns:

  - List of estimate_results

 Estimating a result at a server choosen randomly. ``estimate_results`` is a list of tuple of label and it's reliablity value.
