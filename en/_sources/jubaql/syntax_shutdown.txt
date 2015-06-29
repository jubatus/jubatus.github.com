SHUTDOWN
--------

Syntax::

    SHUTDOWN

Example::

    jubaql> SHUTDOWN
    SHUTDOWN (processing time: 78851 ms/0 ms)

Explanation
^^^^^^^^^^^

``SHUTDOWN`` stops all data processing, shuts down Jubatus instances started in this session and then deletes the session. Afterwards no further commands can be issued. If processing was still running when the ``SHUTDOWN`` command was issued, processing time (displayed separately for ``STORAGE`` and ``STREAM`` processing) are included in the output.
