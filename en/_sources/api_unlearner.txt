Unlearner
----------

* This algorithm is used only via configurations of :doc:`api_classifier` or :doc:`api_recommender` or :doc:`api_anomaly`.

Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each field below:

.. describe:: unlearner

   Specify unlearning strategy from below two.

   .. table::

      ================ ===================================
      Value            Method
      ================ ===================================
      ``"random"``     Delete data randomly
      ``"lru"``        Delete data upon Least-Recently-Updated strategy
      ================ ===================================

.. describe:: unlearner_parameter

   Specify parameters for the algorithm.

   :max_size:
     Specify the upper-limit of data quantity.
     The smaller it is, the less memory usage, the more fast, the less accurately.

   :sticky_pattern:
     Specify pattern of IDs to exclude from unlearning.
     Patterns can be specified in the same format as in ``key`` of rules in :doc:`fv_convert`.
     This parameter is only available when using ``lru``.
     This parameter is optional.
     If not specified, no IDs are excluded from unlearning.
     (String)

.. describe:: example

   .. code-block:: javascript

      {
        "unlearner" : "lru",
        "unlearner_parameter" : {
          "max_size": 16777216
        }
      }
