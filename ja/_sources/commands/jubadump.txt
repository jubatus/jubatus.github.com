jubadump
========

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubadump -i <file> [options ...]

Description
--------------------------------------------------

``jubadump`` は ``save`` RPC によって保存された Jubatus のモデルファイルの内容を JSON 形式に変換するツールである。

現在、以下のモデルがサポートされている:

* ``classifier``
* ``regression``
* ``recommender`` (``inverted_index`` のみ)
* ``anomaly`` (``lof`` の ``inverted_index`` バックエンドのみ)

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` はデフォルト値を意味する。

.. program:: jubadump

.. option:: -i <file>, --input <file>

   変換するモデルファイルへのパスを指定する。
