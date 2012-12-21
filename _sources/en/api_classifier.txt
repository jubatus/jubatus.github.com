Classifier
----------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/src/server/classifier.idl>`_ for detailed specification.
* See :doc:`method` for detailed description of algorithms used in this server.

Data Structures
~~~~~~~~~~~~~~~

.. describe:: config_data

 Represents a configuration of the server.
 ``method`` is an algorithm used for classification.
 Currently, one of ``perceptron``, ``PA``, ``PA1``, ``PA2``, ``CW``, ``AROW`` or ``NHERD`` can be specified.
 ``config`` is a string in JSON format described in :doc:`fv_convert`.

.. code-block:: c++

   message config_data {
     0: string method
     1: string config
   }

.. describe:: estimate_result

 Represents a result of classification.
 ``label`` is an estimated label and ``prob`` is a probability value for the ``label``.
 Higher ``prob`` value means that the estimated label is more confident.

.. code-block:: c++

   message estimate_result {
     0: string label
     1: double prob
   }

Methods
~~~~~~~

For all methods, the first parameter of each method (``name``) is a string value to uniquely identify a task in the ZooKeeper cluster.
When using standalone mode, this must be left blank (``""``).

.. describe:: int train(0: string name, 1: list<tuple<string, datum> > data)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``data`` : list of tuple of label and datum

 - Returns:

  - Number of trained datum (i.e., the length of the ``data``)

 Trains and updates the model.
 ``tuple<string, datum>`` is a tuple of datum and its label.
 This API is designed to accept bulk update with list of ``tuple<string, datum>``.

.. describe:: list<list<estimate_result> > classify(0: string name, 1: list<datum> data)

 - Parameters:

  - ``name`` : string value to uniquely identifies a task in the ZooKeeper cluster
  - ``data`` : list of datum to classifiy

 - Returns:

  - List of list of ``estimate_result``, in order of given datum

 Estimates labels from given ``data``.
 This API is designed to accept bulk classification with list of ``datum``.
