CREATE TRIGGER
--------------

Syntax::

    CREATE TRIGGER ON input_stream FOR EACH ROW
    [ WHERE filter ] EXECUTE func_name(params)

Example::

    jubaql> CREATE TRIGGER ON ds FOR EACH ROW
            EXECUTE printLines(3, label)

Explanation
^^^^^^^^^^^

``CREATE TRIGGER`` installs a previously defined trigger function on the given stream, i.e., the function will be called for every item in the stream (or only for items matching a certain condition).


* ``input_stream`` is the stream to use as input. The data source that this stream is derived from must not yet be in process (or done with processing) when the statement is issued.
*  ``filter`` is a filter expression just like the ones that can be used in a ``WHERE`` clause of a Spark SQL ``SELECT`` statement. If given, the function will be called only for the items in the input stream matching that condition.
* ``func_name`` is the name of a function previously defined using ``CREATE TRIGGER FUNCTION`` (see :doc:`syntax_create_function`). ``params`` is a list of expressions to be used as a parameter for that function.
