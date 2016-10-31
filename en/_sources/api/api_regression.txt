Regression
----------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/regression.idl>`_ for detailed specification.
* See :doc:`../method` for detailed description of algorithms used in this server.


Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each field below:

.. describe:: method

   Specify regression algorithm.
   You can use these algorithms.

   .. table::

      ================ ====================================================================== =====================
      Value            Method                                                                 regression type
      ================ ====================================================================== =====================
      ``"perceptron"`` Use perceptron.                                                        linear regression
      ``"PA"``         Use Passive Aggressive (PA). [Crammer06]_                              linear regression
      ``"PA1"``        Use PA-I. [Crammer06]_                                                 linear regression
      ``"PA2"``        Use PA-II. [Crammer06]_                                                linear regression
      ``"CW"``         Use Confidence Weighted Learning. [Dredze08]_                          linear regression
      ``"AROW"``       Use Adaptive Regularization of Weight vectors. [Crammer09b]_           linear regression
      ``"NHERD"``      Use Normal Herd. [Crammer10]_                                          linear regression
      ``"NN"``         Use an inplementation of ``nearest_neighbor``                          k-Nearest Neighbor
      ``"cosine"``     Use the result of nearest neighbor search by cosine similarity         k-Nearest Neighbor
      ``"euclidean"``  Use the result of nearest neighbor search by euclidean distance        k-Nearest Neighbor
      ================ ====================================================================== =====================

.. describe:: parameter

   Specify parameters for the algorithm.
   Its format differs for each ``method``.

   perceptron
     :learning_rate:     
        The ratio of error value and step width for weight update.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        (Float)

        * Range: 0.0 < ``learning_rate``


   PA
     :sensitivity:
        Upper bound of acceptable margin.
        The bigger it is, more robust to noise, but the more error remain.
        (Float)

        * Range: 0.0 <= ``sensitivity``

   PA1
     :sensitivity:
        Upper bound of acceptable margin.
        The bigger it is, more robust to noise, but the more error remain.
        (Float)

        * Range: 0.0 <= ``sensitivity``

     :regularization_weight:
        Sensitivity to learning rate.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        It corresponds to :math:`C` in the original paper [Crammer06]_.
        (Float)

        * Range: 0.0 < ``regularization_weight``

   PA2
     :sensitivity:
        Upper bound of acceptable margin.
        The bigger it is, more robust to noise, but the more error remain.
        (Float)

        * Range: 0.0 <= ``sensitivity``

     :regularization_weight:
        Sensitivity to learning rate.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        It corresponds to :math:`C` in the original paper [Crammer06]_.
        (Float)

        * Range: 0.0 < ``regularization_weight``

   CW
     :sensitivity:
        Upper bound of acceptable margin.
        The bigger it is, more robust to noise, but the more error remain.
        (Float)

        * Range: 0.0 <= ``sensitivity``

     :regularization_weight:
        Sensitivity to learning rate.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        It corresponds to :math:`\phi` in the original paper [Dredze08]_.
        (Float)

        * Range: 0.0 < ``regularization_weight``

   AROW
     :sensitivity:
        Upper bound of acceptable margin.
        The bigger it is, more robust to noise, but the more error remain.
        (Float)

        * Range: 0.0 <= ``sensitivity``

     :regularization_weight:
        Sensitivity to learning rate.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        It corresponds to :math:`1/r` in the original paper [Crammer09b]_.
        (Float)

        * Range: 0.0 < ``regularization_weight``

   NHERD
     :sensitivity:
        Upper bound of acceptable margin.
        The bigger it is, more robust to noise, but the more error remain.
        (Float)

        * Range: 0.0 <= ``sensitivity``

     :regularization_weight:
        Sensitivity to learning rate.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        It corresponds to :math:`C` in the original paper [Crammer10]_.
        (Float)

        * Range: 0.0 < ``regularization_weight``

   NN
     :method:
        Specify algorithm for nearest neighbor.
        Refer to :doc:`api_nearest_neighbor` for the list of algorithms available.

     :parameter:
        Specify parameters for the algorithm.
        Refer to :doc:`api_nearest_neighbor` for the list of parameters.

     :nearest_neighbor_num:
        Number of data which is used for calculating scores.
        (Integer)

        * Range: 1 <= ``nearest_neighbor_num``

   cosine
     :nearest_neighbor_num:
        Number of data which is used for calculating scores.
        (Integer)

        * Range: 1 <= ``nearest_neighbor_num``

   euclidean
     :nearest_neighbor_num:
        Number of data which is used for calculating scores.
        (Integer)

        * Range: 1 <= ``nearest_neighbor_num``

.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`../fv_convert`.


Example:
  .. code-block:: javascript

     {
       "method": "PA1",
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
