START PROCESSING
----------------

Syntax::

    START PROCESSING source_name

Example::

    jubaql> START PROCESSING ds
    START PROCESSING

Explanation
^^^^^^^^^^^

``START PROCESSING`` starts processing for one of the previously defined data sources and all streams that have been derived from it.

* ``source_name`` is the name of the data source that shall be processed.

After processing has been started, it is not possible to define more streams or manipulate existing streams that derive from the data source in process.

Notes
^^^^^

* The statement will block until the processing actually started successfully (or failed for some reason). That is, if there was a problem while starting the specified Jubatus instance, the user will be notified at the time of issuing the ``START PROCESSING`` statement.
* The user will not be notified of status or any errors that occured during processing.
* For technical reasons, at the moment no two data sources can be processed at the same time.
* A ``START PROCESSING`` can only be issued once per data source, i.e., it is not possible to process a data source twice or to pause and continue processing.
