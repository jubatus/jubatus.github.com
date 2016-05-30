jubaconv
========

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubaconv [options ...]

Description
--------------------------------------------------

``jubaconv`` は fv_converter の設定をテストするためのツールである。

``jubaconv`` は fv_converter 内部の動作をシミュレーションし、変換結果をコマンドラインで表示することができる。

``jubaconv`` は 1 件のデータだけを対象に処理を行うため、文字列特徴抽出ルール (``string_rules``) の ``global_weight`` は計算されない。
``global_weight`` も含めたシミュレーションが必要な場合は :doc:`../api_weight` を使用すること。

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` はデフォルト値を意味する。

.. program:: jubaconv

.. option:: -i <format>, --input-format <format>

   入力のフォーマット。 [json]

   ``<format>`` には ``datum`` または ``json`` のいずれかを指定する。

.. option:: -o <format>, --output-format <format>

   出力のフォーマット。 [fv]

   ``<format>`` には ``fv``, ``datum`` または ``json`` のいずれかを指定する。

.. option:: -c <config>, --conf <config>

   JSON で記述された Jubatus サーバの設定ファイル。

   :option:`-o` に ``fv`` が指定されている場合のみ、このオプションを指定する必要がある。

File Formats
--------------------------------------------------

Input
~~~~~

``datum`` または ``json`` がサポートされています。
詳細は Examples セクションを参照してください。

* ``datum`` は Datum 形式の JSON データ構造です。
  ルートには 3 つのキー (``string_values``, ``num_values`` および ``binary_values``) を指定する必要があります。また、それぞれの値はフラットなオブジェクトで、そのキーは String 型、値は String 型 (``string_values`` と ``binary_values`` の場合) または整数/浮動小数点型 (``num_values`` の場合) である必要があります。

* ``json`` は任意の JSON データ構造です。
  JSON データ構造はキーを ``/`` で結合することによってフラットな key-value データ構造に変換されます。

Output
~~~~~~

``fv``, ``datum`` または ``json`` がサポートされています。

* ``fv`` は fv_converter によって入力データから抽出された特徴ベクトルを出力します。

* ``datum`` は入力データを Datum 形式の JSON データ構造に変換したものを出力します。

* ``json`` は入力データをそのまま、フォーマットした形で出力します。
  このオプションは入力データのフォーマットが ``json`` の場合のみ利用できます。

Examples
--------------------------------------------------

.. code-block:: none

   $ cat data.json
   { "message": "hello world", "age": 31 }

   $ jubaconv -i json -o fv -c /opt/jubatus/share/jubatus/example/config/classifier/pa.json < data.json
   /message$hello world@str#bin/bin: 1
   /age@num: 31

   $ cat datum.json
   {
     "string_values": {
       "hello": "world"
     },
     "num_values": {
       "age": 31
     },
     "binary_values": {
     }
   }

   $ jubaconv -i datum -o fv -c /opt/jubatus/share/jubatus/example/config/classifier/pa.json < datum.json
   hello$world@str#bin/bin: 1
   age@num: 31
