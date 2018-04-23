UPDATE MODEL
============

Syntax::

    UPDATE MODEL model_name USING method_name FROM input_stream

Example::

    jubaql> UPDATE MODEL cls USING train FROM ds
    UPDATE MODEL

解説
^^^^

``UPDATE MODEL`` はストリームとモデルを結びつけます。
ストリームの処理が始まると指定されたメソッドとモデルの特徴抽出関数を用いて、ストリームの全データでモデルのアップデートを行います。

* ``model_name`` は ``CREATE MODEL`` で作成されたモデルの名前を指定します。
* ``method_name`` はモデルのアップデートに使用するメソッドを指定します:

  * ``add`` は ANOMALY モデルに使います。
  * ``train`` は CLASSIFIER モデルに使います。
  * ``update_row`` は RECOMMENDER モデルに使います。

  * ``input_stream`` は入力に用いるストリームを指定します。このストリームのデータソースは文の発行時に処理されていない状態でなければなりません。

