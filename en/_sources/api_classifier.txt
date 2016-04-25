Classifier
----------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/classifier.idl>`_ for detailed specification.
* See :doc:`method` for detailed description of algorithms used in this server.

Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each field below:

.. describe:: method

   Specify classificaiton algorithm.
   You can use these algorithms.

   .. table::

      ================ ====================================================================== =====================
      Value            Method                                                                 Classifier type
      ================ ====================================================================== =====================
      ``"perceptron"`` Use perceptron.                                                        linear classifier
      ``"PA"``         Use Passive Aggressive (PA). [Crammer06]_                              linear classifier
      ``"PA1"``        Use PA-I. [Crammer06]_                                                 linear classifier
      ``"PA2"``        Use PA-II. [Crammer06]_                                                linear classifier
      ``"CW"``         Use Confidence Weighted Learning. [Dredze08]_                          linear classifier
      ``"AROW"``       Use Adaptive Regularization of Weight vectors. [Crammer09b]_           linear classifier
      ``"NHERD"``      Use Normal Herd. [Crammer10]_                                          linear classifier
      ``"NN"``         Use an inplementation of ``nearest_neighbor``                          k-Nearest Neighbor
      ``"cosine"``     Use the result of nearest neighbor search by cosine similarity [1]_    k-Nearest Neighbor
      ``"euclidean"``  Use the result of nearest neighbor search by euclidean distance [1]_   k-Nearest Neighbor
      ================ ====================================================================== =====================

   .. [1] These algorithms don't support ``delete_label`` API and ``unlearner`` option

.. describe:: parameter

   Specify parameters for the algorithm.
   Its format differs for each ``method``.
   Note that adequate value for ``refularization_weight`` differ for each algorithm.

   Specify parameters for the algorithm.
   Its format differs for each ``method``.

   common
     :unlearner:
        Specify unlearner strategy.
        If you don't use unlearner function, you can omit this parameter.
        You can specify ``unlearner`` strategy described in :doc:`api_unlearner`.
        Labels will be deleted based on strategy specified here.
        When ``method`` is ``"NN"``, each data ( ``labeled_datum``, not labels) will be deleted.

     :unlearner_parameter:
        Specify unlearner parameter.
        You can specify ``unlearner_parameter`` :doc:`api_unlearner`.
        You cannot omit this parameter if you specify ``unlearner``.
        Labels (or data) in excess of this number will be deleted automatically.

     note: ``unlearner`` and ``unlearner_parameter`` **can be omitted** .

   perceptron
     None

   PA
     None

   PA1
     :regularization_weight:
        Sensitivity to learning rate.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        It corresponds to :math:`C` in the original paper [Crammer06]_.
        (Float)

        * Range: 0.0 < ``regularization_weight``

   PA2
     :regularization_weight:
        Sensitivity to learning rate.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        It corresponds to :math:`C` in the original paper [Crammer06]_.
        (Float)

        * Range: 0.0 < ``regularization_weight``

   CW
     :regularization_weight:
        Sensitivity to learning rate.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        It corresponds to :math:`\phi` in the original paper [Dredze08]_.
        (Float)

        * Range: 0.0 < ``regularization_weight``

   AROW
     :regularization_weight:
        Sensitivity to learning rate.
        The bigger it is, the ealier you can train, but more sensitive to noise.
        It corresponds to :math:`1/r` in the original paper [Crammer09b]_.
        (Float)

        * Range: 0.0 < ``regularization_weight``

   NHERD
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

     :local_sensitivity:
        Sensitivity used for caliculating scores.
        When it is bigger, near data are weighted much more.
        When it is 0, all data will be treated as same weight.
        (Float)

        * Range: 0.0 <= ``local_sensitivity``

   cosine
     :nearest_neighbor_num:
        Number of data which is used for calculating scores.
        (Integer)

        * Range: 1 <= ``nearest_neighbor_num``

     :local_sensitivity:
        Sensitivity used for caliculating scores.
        When it is bigger, near data are weighted much more.
        When it is 0, all data will be treated as same weight.
        (Float)

        * Range: 0.0 <= ``local_sensitivity``

   euclidean
     :nearest_neighbor_num:
        Number of data which is used for calculating scores.
        (Integer)

        * Range: 1 <= ``nearest_neighbor_num``

     :local_sensitivity:
        Sensitivity used for caliculating scores.
        When it is bigger, near data are weighted much more.
        When it is 0, all data will be treated as same weight.
        (Float)

        * Range: 0.0 <= ``local_sensitivity``

.. describe:: converter

   Specify configuration for data conversion.
   Its format is described in :doc:`fv_convert`.


Example:
  .. code-block:: javascript

     {
       "method" : "AROW",
       "parameter" : {
         "regularization_weight" : 1.0
       },
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

.. mpidl:message:: estimate_result

   Represents a result of classification.

   .. mpidl:member:: 0: string label

      Represents an estimated label.

   .. mpidl:member:: 1: double score

      Represents a probability value for the ``label``.
      Higher ``score`` value means that the estimated label is more confident.

   .. code-block:: c++

      message estimate_result {
        0: string label
        1: double score
      }

.. mpidl:message:: labeled_datum

   Represents a datum with its label.

   .. mpidl:member:: 0: string label

      Represents a label of this datum.

   .. mpidl:member:: 1: datum data

      Represents a datum.

   .. code-block:: c++

      message labeled_datum {
        0: string label
        1: datum data
      }


Methods
~~~~~~~

.. mpidl:service:: classifier

   .. mpidl:method:: int train(0: list<labeled_datum> data)

      :param data:  list of tuple of label and :mpidl:type:`datum`
      :return:      Number of trained datum (i.e., the length of the ``data``)

      Trains and updates the model.
      ``labeled_datum`` is a tuple of :mpidl:type:`datum` and its label.
      This API is designed to accept bulk update with list of ``labeled_datum``.

   .. mpidl:method:: list<list<estimate_result> > classify(0: list<datum> data)

      :param data:  list of datum to classify
      :return:      List of list of :mpidl:type:`estimate_result`, in order of given :mpidl:type:`datum`

      Estimates labels from given ``data``.
      This API is designed to accept bulk classification with list of :mpidl:type:`datum`.

   .. mpidl:method:: map<string, ulong> get_labels()

      :return:     Pairs of label and the number of trained data

      Returns the number of trained data for each label.
      If method is ``NN`` , the number of trained data that are deleted by ``unlearner`` is not include in this count.

   .. mpidl:method:: bool set_label(0: string new_label)

      :param new_label: name of new label
      :return:          True if the new label was not exist. False if the label already exists.

      Append new label.
      If the label is already exist, it fails.
      New label is add when label found in ``train`` method argument, too.

   .. mpidl:method:: bool delete_label(0: string target_label)

      :param target_label: deleting label name
      :return:          True if jubatus success to delete label. False if the label is not exists.

      Deleting label.
      True if jubatus success to delete. False if the label is not exists.

