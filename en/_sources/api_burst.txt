Burst
-----

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/burst.idl>`_ for detailed specification.

Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each field below:

.. describe:: method

   Specify burst detection algorithm.
   You can use these algorithms.

   .. table::

      ==================== ===================================
      Value                Method
      ==================== ===================================
      ``"burst"``          Use Kleinberg burst detection.
      ==================== ===================================

.. describe:: parameter

   Specify parameters for the algorithm.
   Its format differs for each ``method``.

   burst
     :window_batch_size:
        Number of batches in a window.
        (Integer)

        * Range: 0 < ``window_batch_size``

     :batch_interval:
        Width of position for a batch.
        (Double)

        * Range: 0 < ``batch_interval``

     :max_reuse_batch_num:
        Number of batches reused.
        Larger value reduces the calculation cost.
        (Integer)

        * Range: 0 <= ``max_reuse_batch_num`` <= ``window_batch_size``

     :costcut_threshold:
        A threshold value for cost cut.
        Smaller value reduces the calculation cost.
        When ``0`` is specified, no cost cut will be performed (DBL_MAX).
        (Double)

        * Range: 0 < ``costcut_threshold``

     :result_window_rotate_size:
        Total number of windows to be held on the memory, including the current window).
        (Integer)

        * Range: 0 < ``result_window_rotate_size``

Data Structures
~~~~~~~~~~~~~~~

.. mpidl:message:: keyword_with_params

   Represents the keyword and its parameters to be detected as burst.

   .. mpidl:member:: 0: string keyword

      The keyword to be burst-detected.

   .. mpidl:member:: 1: double scaling_param

      A scaling parameter applied for this keyword.

      * Range: 1 < ``scaling_param``

   .. mpidl:member:: 2: double gamma

      A γ value applied for this keyword.
      The higher value reduces the burst detection sensitivity.

      * Range: 0 < ``gamma``

   .. code-block:: c++

      message keyword_with_params {
        0: string keyword
        1: double scaling_param
        2: double gamma
      }

.. mpidl:message:: batch

   Represents the burst detection result for one batch range.

   .. mpidl:member:: 0: int all_data_count

      Number of total documents in this batch.

      * Range: 0 < ``all_data_count``

   .. mpidl:member:: 1: int relevant_data_count

      Number of documents that contains the keyword in this batch.

      * Range: 0 < ``all_data_count`` <= ``relevant_data_count``

   .. mpidl:member:: 2: double burst_weight

      Burst level of this batch.
      Burst level is a relative value that cannot be compared between keywords.

      * Range: 0 <= ``burst_weight``

   .. code-block:: c++

      message batch {
        0: int all_data_count
        1: int relevant_data_count
        2: double burst_weight
      }

.. mpidl:message:: window

   Represents the burst detection result.

   .. mpidl:member:: 0: double start_pos

      Starting position of this window.

   .. mpidl:member:: 1: list<batch> batches

      Batches that composes this window.

   .. code-block:: c++

      message window {
        0: double start_pos
        1: list<batch> batches
      }

.. mpidl:message:: document

   Represents the document used for burst detection.

   .. mpidl:member:: 0: double pos

      Position (time in many cases) of this document.

   .. mpidl:member:: 1: string text

      Contents of this document.
      Keyword matching runs against this data using partial match.

   .. code-block:: c++

      message document {
        0: double pos
        1: string text
      }

Methods
~~~~~~~

.. mpidl:service:: burst

   .. mpidl:method:: int add_documents(0: list<document> data)

      :param data:   list of documents to be added
      :return:       number of documents successfully registered (will be the length of  ``data`` if all documents are registered successfully)

      Register the document for burst detection.
      This This API is designed to accept bulk update with list of ``document``.

      You need to register the keyword via ``add_keyword`` method before adding documents.

      A document whose location (``pos``) is out of range of the current window cannot be registered.

   .. mpidl:method:: window get_result(0: string keyword)

      :param keyword:  keyword to get burst detection result
      :return:         burst detection result

      Returns the burst detection result of the current window for pre-registered keyword ``keyword``.

   .. mpidl:method:: window get_result_at(0: string keyword, 1: double pos)

      :param keyword:  keyword to get burst detection result
      :param pos:      position
      :return:         burst detection result

      Returns the burst detection result at the specified position ``pos`` for pre-registered keyword ``keyword``.

   .. mpidl:method:: map<string, window> get_all_bursted_results()

      :return:         pairs of keyword and its burst detection result

      Returns the burst detection result of the current window for all pre-registered keywords.

   .. mpidl:method:: map<string, window> get_all_bursted_results_at(0: double pos)

      :param pos:      position
      :return:         pairs of keyword and its burst detection result

      Returns the burst detection result at the specified position ``pos`` for all pre-registered keywords.

   .. mpidl:method:: list<keyword_with_params> get_all_keywords()

      :return:         list of keyword and its parameters

      Returns the list of keywords registered for burst detection.

   .. mpidl:method:: bool add_keyword(0: keyword_with_params keyword)

      :param keyword:  keyword and parameters to be added
      :return:         True if Jubatus succeed to add the keyword

      Registers the keyword ``keyword`` for burst detection.

   .. mpidl:method:: bool remove_keyword(0: string keyword)

      :param keyword:  keyword to be removed
      :return:         True if Jubatus succeed to delete the keyword

      Removes the keyword ``keyword`` from burst detection.

   .. mpidl:method:: bool remove_all_keywords()

      :return:         True if Jubatus succeed to delete keywords

      Removes all the keywords from burst detection.
