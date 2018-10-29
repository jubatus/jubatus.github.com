CREATE STREAM FROM ANALYZE
--------------------------

Syntax::

    CREATE STREAM stream_name FROM ANALYZE input_stream
    BY MODEL model_name USING method_name [ AS alias ]

Examples::

    jubaql> CREATE STREAM clans FROM ANALYZE ds
            BY MODEL cls USING classify AS clan
    CREATE STREAM

    jubaql> CREATE STREAM output FROM ANALYZE nbpds
            BY MODEL reco USING complete_row_from_id
    CREATE STREAM

Explanation
^^^^^^^^^^^

``CREATE STREAM FROM ANALYZE`` uses the specified method to analyze each item in the input stream and defines a new stream that contains the input data and, in a new column, the analysis results.

* ``stream_name`` is a user-defined string that will identify this stream later on.
* ``input_stream`` is the stream to use as input. The data source that this stream is derived from must not yet be in process (or done with processing) when the statement is issued.
* ``model_name`` is the name of a model previously defined using ``CREATE MODEL``. The items in the input stream will be converted as specified by the rules in the ``CREATE MODEL`` statement. (For the returned value to make any sense, that model should have also been trained using the ``UPDATE MODEL`` statement.)
* ``method_name`` is the method to use for analyzing the model:

  * ``calc_score`` for an ANOMALY model,
  * ``classify`` for a CLASSIFIER model,
  * ``complete_row_from_id`` or ``complete_row_from_datum`` for a RECOMMENDER model.
* ``alias`` is the name of the column that will hold the analysis result. If it is not given, ``method_name`` will be used.

After a ``CREATE STREAM FROM SELECT`` statement has been processed successfully, the user can use the specified ``stream_name`` in other statements.

Notes
^^^^^

* When using ``complete_row_from_id`` with the ``ANALYZE`` statement, the input value is directly taken as ``id`` value: ``ANALYZE '荻野貴司' BY MODEL reco USING complete_row_from_id``. In contrast, when using ``complete_row_from_id`` with ``CREATE STREAM FROM ANALYZE``, the value will be taken from the ``id`` column as specified in the ``CREATE MODEL`` statement of that recommender model.
* The results will be added as a structured type corresponding to each method's return value:

  * ``double`` for ``calc_score``,
  * ``array[struct{label: string, score: double}]`` for ``classify``,
  * ``struct{string_values: map[string, string], num_values: map[string, double]}`` for ``complete_row_from_*``.
