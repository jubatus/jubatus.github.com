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

     * range of value: 0 < ``max_size`` < 2147483647

   :sticky_pattern:
     Specify pattern of IDs to exclude from unlearning.
     Patterns can be specified in the same format as in ``key`` of rules in :doc:`../fv_convert`.
     This parameter is only available when using ``lru``.
     This parameter is optional.
     If not specified, no IDs are excluded from unlearning.
     (String)

   :seed:
     Specify random seed when you use ``random`` for unlearning strategy.
     If you set the same seed and do the same learn, you will get the same result.
     It may be useful when you examine the result repeatedly.
     If not specified, system clock is used as seed parameter.
     So you will get different result each experiment.

     * range of value: 0 <= ``seed`` <= :math:`2^{32} - 1`

.. describe:: example

   unlearning based on Least-Recently-Used(LRU)

   .. code-block:: javascript

      {
        "unlearner" : "lru",
        "unlearner_parameter" : {
          "max_size": 16777216
        }
      }

   unlearning based on random

   .. code-block:: javascript

      {
        "unlearner" : "random",
        "unlearner_parameter" : {
          "max_size": 16777216,
          "seed": 9193
        }
      }
