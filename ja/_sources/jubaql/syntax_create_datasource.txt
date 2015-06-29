CREATE DATASOURCE
-----------------

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

解説
~~~~

``CREATE DATASOURCE`` はアブストラクトデータソースを作成します。蓄積されたデータセットとストリームデータを統一的な方法で記述することが可能です。データは1行が1つのJSONデータである必要があります。

* ``source_name`` はこのデータソースを識別するためにユーザが決める文字列です。
* JSONデータに対して行列形式を与え、 ``column_name`` と ``data_type`` (``numeric``, ``string``, ``boolean`` のいずれか) のスキーマが作成されます。スキーマが与えられなかった場合、各バッチ内のデータから推論されます。

* ``storage_location`` はデータの場所を示す文字列です。使用可能な書式は以下のいずれかです。

  * ``file://<path>``, ``hdfs://<path>``, ``empty`` (STORAGE)
  * ``kafka://<zookeeper>/<topic>/<consumer-group>`` (STREAM)

``CREATE DATASOURCE`` 文が正常に実行されると、 ``souce_name`` で指定された名前のデータソースを他の文から利用することができるようになります。上記の2番目の例ではPostgreSQLの ``CREATE VIEW ds AS SELECT json-> 'label' AS label, json->'name' AS name FROM hdfs_table`` と概念的に似ているものです。

Notes
~~~~~

* fluentdからデータを取得するには `fluent-plugin-kafka <https://github.com/htgc/fluent-plugin-kafka/>`_ を用いてfluentdがKafkaにデータをプッシュするように設定しなければなりません。これはfluentdはデータをプッシュする動作をし、Sparkはデータをプルするため、その間にはメッセージキューが必要となるからです。Kafkaはこの要件を非常によく満たしています。
* 蓄積データの処理からストリームデータの処理へのシームレスな切り替えが必要な場合には、 単調に増加する文字列である ``"jubaql_timestamp"`` フィールドが全てのデータに存在しなければなりません。そうでない場合、以前に処理されたKafkaキューのデータが再度処理されることになります。
* スキーマ推論は処理時間の増加と誤った推論をして実行時エラーを招くリスクがあります。また、空のバッチには空のスキーマが推論されるため、他の文の実行時に問題を生じさせる可能性があります。そのため、データソースからモデルのアップデート処理に直接データを送る場合を除いて、スキーマ推論の使用は避けるよう推奨します。

