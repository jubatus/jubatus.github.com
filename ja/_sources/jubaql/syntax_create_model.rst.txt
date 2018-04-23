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

解説
~~~~

``CREATE MODEL`` は学習に用いられるJubatusのモデルを作成します。学習データは型付きの行列形式であることを想定しています。

* ``model_name`` はこのモデルを識別するための名前（ユーザ定義の文字列）です。
* ``label | id`` は、CLASSIFIERのモデルには ``label`` を、RECOMMENDERのモデルには ``id`` を用います。
*  ``id_col`` は RPCメソッド ``update_row(id, row)`` の ``id`` パラメータもしくは RPCメソッド ``train(data)`` に渡されるlabeled datumの ``label`` となる列の名前を指定します。使われるRPCメソッドは学習モデルの種類によって定まります。
* ``col_spec`` はJubatusのビルトイン関数や FEATURE FUNCTIONで事前に定義された特徴抽出関数 ``convert_function`` を適用する列を指定します。 適用する関数を指定しなかった場合、数値データには ``num`` を その他のデータには ``str`` がデフォルトで設定されます。 ``col_spec`` は以下のような形式をとれます。

  * 列名を１つ指定した場合。この場合は、 ``convert_function`` は１引数関数でなければならず、列の値に対して関数が適用されます。
  * ``*`` や ``*suffix``, ``prefix*`` のようなワイルドカードを使う場合。この場合、これまでに ``col_spec`` で定義されていない かつ ワイルドカードのパターンにマッチする列について関数が適用されます。関数は１引数関数でなければならず、パターンにマッチした列の値それぞれに適用されます。

* ``json_string`` はJubatus起動時に使われるconfigファイルと同様の形式でモデルの設定を記述するjson文字列です。ただし、 ``converter`` の部分はこの設定に含みません。

``CREATE MODEL`` 文が正常に実行されると、他のクエリの実行時に ``model_name`` で指定した名前を使用することができるようになります。

注意
~~~~

* ``CREATE MODEL`` 実行時にはJubatusインスタンスの起動については指定されません。したがって、このクエリが正常に実行されても、文法的に正しいことを示すのみであり、Jubatusインスタンスの起動についての情報は含みません。
* 特徴関数は ``Map[String, Any]`` の返り値を持ちます。 ただし、``Any`` は数値か文字列になります。。mapのkeyはJubatusのdatumのkeyの一部になります。例えば ``product`` という関数に ``height`` という列の値を与え、返り値が ``Map("val" -> 80)`` であった場合、datumの ``num_values`` に ``product#height"val": 80`` のようなデータを持つことになります。
* ``label`` や ``id`` 、  特徴抽出の指定で参照された列が入力ストリームのバッチデータのスキーマに存在せず、なおかつバッチが空でない場合、 ``UPDATE MODEL`` 、 ``CREATE STREAM FROM ANALYZE`` によるそのバッチデータの処理は ``spark.task.maxFailures`` で指定された回数再試行したのち失敗となります。ただし、スキーマと一致しない空のバッチデータの場合は失敗が生じません。
