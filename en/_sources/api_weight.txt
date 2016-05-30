Weight
------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/weight.idl>`_ for detailed specification.

Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each field below:

The server will work even if ``method``, ``parameter`` is specified in the configuration (the values are ignored) so that you can use configuration file for other engines.

.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`fv_convert`.


Example:
  .. code-block:: javascript

     {
       "converter" : {
         "string_filter_types" : {},
         "string_filter_rules" : [],
         "num_filter_types" : {},
         "num_filter_rules" : [],
         "string_types" : {},
         "string_rules" : [
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

.. mpidl:message:: feature

   Represents a dimension of feature vector.

   .. mpidl:member:: 0: string key

      Represents a name for the dimension of the feature vector.

   .. mpidl:member:: 1: float value

      Represents a weight for the dimension of the feature vector.

   .. code-block:: c++

      message feature {
        0: string key
        1: float value
      }


Methods
~~~~~~~

.. mpidl:service:: weight

   .. mpidl:method:: list<feature> update(0: datum d)

      :param data:  :mpidl:type:`datum` to extract feature
      :return:      Extarcted feature vector

      Updates the weight using ``d``, then returns the result of feature conversion of ``d`` using updated weight.

   .. mpidl:method:: list<feature> calc_weight(0: datum d)

      :param data:  :mpidl:type:`datum` to extract feature
      :return:      Extarcted feature vector

      Returns the result of feature conversion of ``d`` without updating the weight.
