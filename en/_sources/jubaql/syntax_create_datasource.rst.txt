CREATE DATASOURCE
=================

Syntax::

    CREATE DATASOURCE source_name [ (column_name data_type [, ...] ) ]
    FROM (STORAGE: 'storage_location' [, STREAM: 'storage_location' ])

Examples::

    jubaql> CREATE DATASOURCE nbpds (label string, name string)
            FROM (STORAGE: 'hdfs:///jubatus-on-yarn/sample/npb_data.json')
    CREATE DATASOURCE

    jubaql> CREATE DATASOURCE nico FROM (STORAGE: 'hdfs:///user/fluentd',
            STREAM: 'kafka://hdp8:2181,hdp9:2181,hdp10:2181/fluentd/1')
    CREATE DATASOURCE

Explanation
^^^^^^^^^^^

``CREATE DATASOURCE`` defines an abstract data source with a unified view of a static data set and (optionally) a data stream. Data is assumed to contain one JSON document per line.

* ``source_name`` is a user-defined string that will identify this data source later on.
* A schema of ``column_name`` and ``data_type`` (one of ``numeric``, ``string``, ``boolean``) may be specified, providing a row-column shape for the JSON data.
  If a schema is not given, it will be inferred from the data in each batch.
* ``storage_location`` is a string indicating the location of the data. Valid formats are:

  * ``file://<path>``, ``hdfs://<path>`` and ``empty`` (for STORAGE)
  * ``kafka://<zookeeper>/<topic>/<consumer-group>`` (for STREAM)

After a ``CREATE DATASOURCE`` statement has been processed successfully, the user can use the specified ``source_name`` in other statements whenever a ``STREAM`` is referenced. The second of the above examples is in spirit similar to PostgreSQL's ``CREATE VIEW ds AS SELECT json->'label' AS label, json->'name' AS name FROM hdfs_table``.

Notes
^^^^^

* To retrieve data from fluentd, fluentd must be configured to push its data to Kafka using `fluent-plugin-kafka <https://github.com/htgc/fluent-plugin-kafka/>`_. This is required because fluentd expects to *push* data somewhere while Spark expects to *pull* data from somewhere, so there is a message queue needed in between. Kafka seems to fulfill this requirement quite well.
* When seamless switching from static to stream processing is desired, there must be a field with the key ``"jubaql_timestamp"`` in every data item with strictly increasing (as per string ordering) string values.
  Otherwise items in the Kafka queue that are also in the previously processed static data set will be processed again.
* Schema inference increases processing time and carries the risk of a wrongly inferred data type (since only a sampled subset is considered for inference), leading to type cast errors at runtime.
  Also, an empty schema will be inferred for empty batches, leading to problems with many other statements.
  Unless data is directly fed from a data source to a a model update process, schema inference should therefore be avoided at the moment.

