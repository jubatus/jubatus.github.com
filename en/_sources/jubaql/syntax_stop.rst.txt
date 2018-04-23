STOP PROCESSING
===============

Syntax::

    STOP PROCESSING

Example::

    jubaql> STOP PROCESSING
    STOP PROCESSING (processing time: 30828 ms/0 ms)

Explanation
^^^^^^^^^^^

``STOP PROCESSING`` stops a running process started by ``START PROCESSING``. Any model that was previously defined is still available and can be queried using ``ANALYZE``. The processing time (displayed separately for ``STORAGE`` and ``STREAM`` processing) is included in the output.

Notes
^^^^^

* The statement will fail if there is no training process running.
* After ``STOP PROCESSING``, the same data source cannot be processed again. However, it is possible to process other data sources.

