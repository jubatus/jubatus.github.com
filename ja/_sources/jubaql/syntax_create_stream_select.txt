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

解説
~~~~

``CREATE STREAM FROM SELECT`` は　``SELECT`` 文の結果からストリームを作成します。SQLの ``CREATE VIEW`` に似ています。

* ``stream_name`` はストリームを識別するためにユーザが決定する文字列です。
* ``select_stmt`` はSparkSQLが実行できる任意の ``SELECT`` 文です。

``CREATE STREAM FROM SELECT`` 文が正常に実行されると、ユーザは他の文から ``stream_name`` で指定されたストリームを利用することができるようになります。

Notes
~~~~~

* 入力のストリームは各バッチで列や列の型が変化し、スキーマが推論される場合があるため、参照したストリームについては名前や型のチェックは行いません。
* ``JOIN`` や ``count()`` のような高度なSQLを実行することもできますが、出力結果はSpark Streamingのバッチサイズ(ユーザが設定不可能)に依存するため、予期するのが困難です。
* ``select_stmt`` で複数のストリームが使用された場合、それらは同一のデータソースに由来するものでなければなりません。
* 入力ストリームのデータソースは、文が発行される際には処理されていない状態でなければなりません。
* ``SELECT`` で参照された列がバッチデータのスキーマには存在するもののデータの欠損があった場合、 ``null`` が渡されます。
* ``SELECT`` で参照した列がバッチデータのスキーマに存在しない場合、そのバッチの処理が失敗し、結果として全体のプロセスが失敗します。
* スキーマの推論を使用する場合、スキーマは各バッチデータごとに推論されます。空のバッチデータに対しては空のスキーマを返します。
* 蓄積されたデータの処理が終わった後には空のバッチが常にいくつか渡されます。したがって、実行時にスキーマを推論するデータソースに対する ``CREATE STREAM FROM SELECT`` 文は失敗することになります。

