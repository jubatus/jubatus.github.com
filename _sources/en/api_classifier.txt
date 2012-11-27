Classifier
----------

See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/classifier.idl>`_ for detailed specification.


Data Structures
~~~~~~~~~~~~~~~

.. describe:: jubatus::config_data

.. code-block:: c++

   message config_data {
     0: string method
     1: string converter
   }

``converter`` is a string of JSON format that describes configuration of feature extranction of ``datum`` . See :doc:`fv_convert` for details.

.. code-block:: c++

   message estimate_result {
     0: string label
     1: double prob
   }


Methods
~~~~~~~

.. describe:: int train(0: string name, 1: list<tuple<string, datum> > data)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in cluster
  - ``data`` : list of tuple of label and datum

 - Returns:

  - Zero if the model is updated successfully

 Train and update the model. ``tuple<string, datum>`` is a tuple of datum and its label.
 This function is designed to allow bulk update with list of ``tuple<string, datum>``.


.. describe:: list<list<estimate_result> > classify(0: string name, 1: list<datum> data)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in cluster
  - ``data`` : list of datum for classifiy

 - Returns:

  - List of estimate_results

 Estimating the label from given ``data``.
 ``estimate_results`` is a list of tuple of label and its probability value (``prob``), in order of given datum.
 Probability value is in range of [0,1] and higher value means more confident.
 This function is designed to allow bulk classification with list of ``datum``.
