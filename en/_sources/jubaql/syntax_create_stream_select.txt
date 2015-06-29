CREATE STREAM FROM SELECT
-------------------------

Syntax::

    CREATE STREAM stream_name FROM select_stmt

Examples::

    jubaql> CREATE STREAM tokugawa FROM
            SELECT name FROM input WHERE label = '徳川'
    CREATE STREAM

    jubaql> CREATE STREAM somename FROM
            SELECT addABC(label) AS label, name FROM ds
    CREATE STREAM

Explanation
^^^^^^^^^^^

``CREATE STREAM FROM SELECT`` defines a stream as the result of a ``SELECT`` statement on another stream, similar in spirit to SQL's ``CREATE VIEW``.

* ``stream_name`` is a user-defined string that will identify this stream later on.
* ``select_stmt`` is an arbitrary ``SELECT`` statement that is understood by Spark SQL.

After a ``CREATE STREAM FROM SELECT`` statement has been processed successfully, the user can use the specified ``stream_name`` in other statements.

Notes
^^^^^

* As the input stream may have an inferred schema where existing columns and column types might change in every batch, there is no name or type checking done with respect to the referenced streams.
* It is *possible* to use advanced SQL such as ``JOIN`` or aggregate functions such as ``count()`` but the outcome would depend on the Spark Streaming batch size (which the user cannot control) and would be highly unpredictable.
* *If* multiple streams are used in the ``select_stmt`` (which is advised against), then they must be derived from the same data source.
* The data source that serves as the input to the referenced stream(s) must not yet be in process (or done with processing) when the statement is issued.
* When a column that is referenced in the ``SELECT`` clause exists in the (inferred or explicitly declared) schema of a batch of the input stream but is missing in a single data item, the ``null`` value will be selected instead for that item.
* When a column that is referenced in the ``SELECT`` clause does not exist in the (inferred or explicitly declared) schema of a batch of the input stream, processing of that batch and therefore the whole process will fail.
  Note: When using schema inference, the schema will be inferred again for every batch, with empty batches yielding an empty schema.
  Since there will always be a number of empty batches after complete processing of static data this means that every ``CREATE STREAM FROM SELECT`` statement will fail on data sources with an inferred schema at runtime.
