CREATE MODEL
------------

Syntax::

    CREATE { RECOMMENDER | CLASSIFIER | ANOMALY } MODEL
    model_name [ ({ label | id }: id_col) ] AS
    col_spec [ WITH convert_function ] [, ... ]
    CONFIG 'json_string'

    where: col_spec = wildcard | col_name

Examples::

    jubaql> CREATE CLASSIFIER MODEL cls (label: label) AS
            name WITH unigram
            CONFIG {"method": "AROW",
              "parameter": {"regularization_weight" : 1.0}}
    CREATE MODEL (started)

    jubaql> CREATE RECOMMENDER MODEL reco (id: 名前) AS *
            CONFIG '{"method": "inverted_index",
              "parameter": {}}'
    CREATE MODEL (started)

    jubaql> CREATE CLASSIFIER MODEL test (label: country) AS
            name WITH bigram,
            photo WITH jpeganalyze
            CONFIG '{"method": "AROW",
              "parameter": {"regularization_weight" : 1.0}}'
    CREATE MODEL (started)

Explanation
^^^^^^^^^^^

``CREATE MODEL`` defines a Jubatus model to be used for training. It is assumed that the data that will be used for training is well-typed row-column-shaped data.

* ``model_name`` is a user-defined string that will identify this model later on.
* ``label | id`` must be ``label`` for a CLASSIFIER model and ``id`` for a RECOMMENDER model. The clause must be omitted for an ANOMALY model.
* ``id_col`` is the name of the column whose value will become the ``id`` parameter of the ``update_row(id, row)`` RPC method or the ``label`` of the labeled datum passed to the ``train(data)`` RPC method, depending on the model type.
* ``col_spec`` points to one or multiple columns that will be converted with either a Jubatus built-in function (if one exists) or a previously defined FEATURE FUNCTION named ``convert_function``.
  If a conversion function is not specified, it defaults to ``num`` for numeric values and ``str`` for anything else. A ``col_spec`` can have one of the following forms:

  * It can be a single column name.
    In that case, ``convert_function`` must be a unary function and will be called with the value of that column.
  * It can be a column wildcard of the form ``*``, ``*suffix`` or ``prefix*`` and then means all columns with a name that matches that wildcard description *and* that have not been mentioned in any previous clause.
    In that case, ``convert_function`` must be a unary function and will be called for every matching column with the value of that column.
* ``json_string`` is a JSON configuration string like it would normally be contained in the file passed to Jubatus at startup.
  However, it should *not* contain a ``"converter"`` part.

After a ``CREATE MODEL`` statement has been processed successfully, the user can use the specified ``model_name`` in other statements.

Notes
^^^^^

* It is not specified whether the Jubatus instance will be launched right away or later. Therefore, the successful execution of this command only indicates that the syntax is correct; it does not say anything about whether startup was successful.
* Feature functions return ``Map[String, Any]`` where actually the ``Any`` part should be a numeric type or a string. The map key will become a part of the key for the Jubatus datum. Say that a function with the name ``product`` is fed with values from the column ``height`` and returns a ``Map("val" -> 80)``, then the Jubatus datum will have an entry in ``num_values`` that looks like: ``"product#height#val": 80``.
* When a column that is referenced as ``label``/``id`` or in a conversion specification does not exist in the (inferred or explicitly declared) schema of a batch of the input stream *and* the batch is non-empty, ``UPDATE MODEL`` or ``CREATE STREAM FROM ANALYZE`` processing of that batch and therefore the whole process will fail after retrying ``spark.task.maxFailures`` times.
  An empty batch with a mismatching schema does not cause a failure, though.

