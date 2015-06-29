UPDATE MODEL
============

Syntax::

    UPDATE MODEL model_name USING method_name FROM input_stream

Example::

    jubaql> UPDATE MODEL cls USING train FROM ds
    UPDATE MODEL

Explanation
^^^^^^^^^^^

``UPDATE MODEL`` connects a stream with a model:
When stream processing is started, the model will be updated with all items in the stream using the given method and the feature extractor attached to the model.

* ``model_name`` is the name of a model previously defined using ``CREATE MODEL``.
* ``method_name`` is the method to use for updating the model:

  * ``add`` for an ANOMALY model,
  * ``train`` for a CLASSIFIER model,
  * ``update_row`` for a RECOMMENDER model.

* ``input_stream`` is the stream to use as input. The data source that this stream is derived from must not yet be in process (or done with processing) when the statement is issued.

