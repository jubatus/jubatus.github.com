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

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` はデフォルト値を意味する。

.. program:: jubaconv

.. option:: -i <format>, --input-format <format>

   入力のフォーマット。 [json]

   ``<format>`` には ``json`` または ``datum`` のいずれかを指定する。

.. option:: -o <format>, --output-format <format>

   出力のフォーマット。 [fv]

   ``<format>`` には ``json``, ``datum`` または ``fv`` のいずれかを指定する。

.. option:: -c <config>, --conf <config>

   JSON で記述された Jubatus サーバの設定ファイル。

   :option:`-o` に ``fv`` が指定されている場合のみ、このオプションを指定する必要がある。

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
     }
   }

   $ jubaconv -i datum -o fv -c /opt/jubatus/share/jubatus/example/config/classifier/pa.json < datum.json
   hello$world@str#bin/bin: 1
   age@num: 31
