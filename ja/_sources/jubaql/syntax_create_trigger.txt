CREATE TRIGGER
--------------

Syntax::

    CREATE TRIGGER ON input_stream FOR EACH ROW
    [ WHEN filter ] EXECUTE func_name(params)

Example::

    jubaql> CREATE TRIGGER ON ds FOR EACH ROW
            EXECUTE printLines(3, label)

解説
~~~~

``CREATE TRIGGER`` は予め定義されたトリガ関数をストリームに導入します。
ストリーム内のすべてのアイテムにトリガ関数を適用させることや、条件式に合致したアイテムにのみトリガ関数を適用させることが可能です。

* ``input_stream`` は入力に用いるストリームを指定します。入力ストリームのデータソースは、 ``CREATE TRIGGER`` 文の発行時に処理が実行されていない状態でなければなりません。
*  ``filter`` はSparkSQLの ``SELECT`` 文中で用いられる ``WHERE`` 句のようなフィルタリングをする式を記述します。特定の条件に合致したアイテムについてのみ関数を呼び出すように設定することができます。
* ``func_name`` は ``CREATE TRIGGER FUNCTION`` (:doc:`syntax_create_function` 参照)を用いて予め定義された関数の名前を指定します。 ``param`` はその関数のパラメータに用いられる式のリストを記述します。

