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

解説
~~~~

* ``CREATE STREAM FROM ANALYZW`` は入力ストリームの各アイテムを分析する方法を指定し、入力データに分析結果を新たに加えたストリームを定義します。

* ``stream_name`` はこのストリームを識別するためにユーザが決定する文字列です。
* ``input_stream`` は入力に用いるストリームです。このストリームが使用するデータソースは文の発行時にまだ処理されていないものでなければなりません。
* ``model_name`` は ``CREATE MODEL`` で事前に定義されたモデルの名前を使います。入力ストリームのアイテムは ``CREATE MODEL`` で定義されたルールに従い変換されます。
* ``method_name`` は分析に用いるメソッドを指定します
  * ``calc_score`` は ANOMALYモデルで使います。
  * ``classify`` はCLASSIFIERモデルで使います。
  * ``complete_row_from_id`` と ``complete_row_from_datum`` はRECOMMENDERモデルで使います。
* ``alias`` は分析結果を保持する列の名前です。していされなかった場合、 ``method_name`` が使われます。

``CREATE STREAM FROM SELECT`` 文が正常に実行されると、ユーザは他の文から ``stream_name`` で指定された名前を使用できるようになります。

Notes
~~~~~

* ``complete_row_from_id`` を ``ANALYZE`` 文で使う場合、入力値は ``id`` として直接渡されます： ``ANALYZE '荻野貴司' BY MODEL reco USING compete_row_from_id`` 。大して、 ``complete_row_from_id`` を ``CREATE STREAM FROM ANALYZE``で使用する場合、入力値は ``CREATE MODEL`` 文で指定された ``id`` 列のデータから取得されます。
* 結果は各メソッドの返り値に対応する型で追加されます。
  * ``calc__score`` の場合は ``double``
  * ``classify`` の場合は ``array[struct{label: string, score: double}]``
  *  ``complete_row_from_*`` の場合は ``struct{string_values: map[string, string], num_values: map[string, double]}`` 。
