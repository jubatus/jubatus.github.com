CREATE FUNCTION
===============

Syntax::

    CREATE FUNCTION func_name(param_name data_type [, ...] )
    RETURNS return_type
    LANGUAGE lang_name AS $$ func_body $$

    CREATE TRIGGER FUNCTION func_name(param_name data_type [, ...] )
    LANGUAGE lang_name AS $$ func_body $$

    CREATE FEATURE FUNCTION func_name(param_name data_type [, ...] )
    LANGUAGE lang_name AS $$ func_body $$

Examples::

    jubaql> CREATE FUNCTION id(arg string) RETURNS string
            LANGUAGE JavaScript AS $$ return arg; $$
    CREATE FUNCTION

    jubaql> CREATE TRIGGER FUNCTION printLines(n numeric, label string)
            LANGUAGE JavaScript AS $$
            var i = 0;
            while (i < n) {
              println(label);
              i = i + 1;
            }
            $$
    CREATE FUNCTION

解説
~~~~
上記 3つの文はJavaScriptで他の文から利用できる関数を定義します。

``CREATE FUNCTION`` で定義された関数はSQL文内の任意の入力値の変換に使用することができます。

``CREATE TRIGGER FUNCTION`` で定義された関数は ``CREATE TRIGGER`` でストリームに挿入することができ、ストリームのアイテムがある条件を満たした時にとるアクションを記述することができます。この関数は返り値を持ちません。

``CREATE FEATURE FUNCTION`` は ``CREATE MODEL`` 文から参照され、入力ストリームからの特徴抽出関数を記述することができます。この関数は ``Map[String, Any]`` 型の返り値を持ち、Stringが特徴ベクトルのキーとなります。

* ``func_name`` はこの関数を識別するためにユーザが決定する文字列です。
* ``param_name`` はパラメータを識別する名前で、 ``data_type`` はこのパラメータの型です。型は ``numeric`` 、 ``string`` 、 ``boolean`` のいずれかです。
* ``return_type`` は関数の返り値の型を指定します(``numeric``, ``string``, ``boolean`` のいずれか )
* ``lang_name`` は現在の実装では常に ``JavaScript`` を指定します。
* ``func_body`` は JavaScriptのコードで関数を記述します。 ``$$`` を含めることはできません。

JavaScriptのコードではTrigger FunctionからHTTPリクエストとemailを送るための ``jql`` オブジェクトが実装されています。使用できるメソッドは以下のとおりです。

* ``jql.httpGet(url)``
  GETリクエストをURLに行います。
* ``jql.httpGet(url, {"key": "value"}})``
  引数で与えられたkey-valueペアをパラメータにURLにGETリクエストを行います。
* ``jql.httpPost(url)``
  bodyが空のPOSTリクエストをURLに行います。
* ``jql.httpPost(url, body)`
  引数で与えられた文字列のbodyでURLにPOSTリクエストを行います。
* ``jql.httpPost(url, {"key": "value"})``
  引数で与えられたkey-valueペアを ``application/x-www-form-urlencoded`` の文字列としたbodyでPOSTリクエストをURLに行います
* ``jql.sendMail(smtpHost, smtpPort, fromAddr, toAddr, subject, message)``
  引数で与えられたサーバデータでemailを送ります。認証は現在実装されていません。

Notes
~~~~~

* 現在、ユーザ定義の関数は引数が最大5つまでしか使えない制限があります。


