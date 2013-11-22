Regression
----------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/regression.idl>`_ for detailed specification.
* See :doc:`method` for detailed description of algorithms used in this server.


Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each filed below:

.. describe:: method

   Specify regression algorithm.
   You can use these algorithms.

   .. table::

      ================ ===================================
      Value            Method
      ================ ===================================
      ``"PA"``         Use Passive Aggressive. [Crammer06]_
      ================ ===================================


.. describe:: parameter

   Specify parameters for the algorithm.
   Its format differs for each ``method``.

   PA
     :sensitivity:
        Upper bound of acceptable margin.
        The bigger it is, more robust to noise, but the more error remain.
        (Float)
     :regularization_weight:
        Sensitivity to learning rate.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        It corresponds to :math:`C` in the original paper [Crammer06]_.
        (Float)


.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`fv_convert`.


Example:
  .. code-block:: javascript

     {
       "method": "PA",
       "parameter" : {
         "sensitivity" : 0.1,
         "regularization_weight" : 3.402823e+38
       },
       "converter" : {
         "string_filter_types" : {},
         "string_filter_rules" : [],
         "num_filter_types" : {},
         "num_filter_rules" : [],
         "string_types": {},
         "string_rules": [
           { "key" : "*", "type" : "str", "sample_weight" : "bin", "global_weight" : "bin" }
         ],
         "num_types" : {},
         "num_rules" : [
           { "key" : "*", "type" : "num" }
         ]
       }
     }


Data Structures
~~~~~~~~~~~~~~~

.. mpidl:message:: scored_datum

   Represents a datum with its label.

   .. mpidl:member:: 0: float score

      Represents a label of this datum.

   .. mpidl:member:: 1: datum data

      Represents a datum.

   .. code-block:: c++

      message scored_datum {
        0: float score
        1: datum data
      }


Methods
~~~~~~~

.. mpidl:service:: regression

   .. mpidl:method:: int train(0: list<scored_datum> train_data)

      :param train_data: list of tuple of label and :mpidl:type:`datum`
      :return:           Number of trained datum (i.e., the length of the ``train_data``)

      Trains and updates the model.
      This function is designed to allow bulk update with list of ``scored_datum``.

   .. mpidl:method:: list<float>  estimate(0: list<datum>  estimate_data)

      :param estimate_data: list of :mpidl:type:`datum` to estimate
      :reutrn:              List of estimated values, in order of given :mpidl:type:`datum`

      Estimates the value from given ``estimate_data``.
      This API is designed to allow bulk estimation with list of :mpidl:type:`datum`.
