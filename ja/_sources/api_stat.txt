Stat
----

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/stat.idl>`_ を参照してください。

Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: window_size

   保持する値の数を指定する。
   (Integer)


例:
  .. code-block:: javascript

     {
       "window_size": 128
     }


Data Structures
~~~~~~~~~~~~~~~

なし。


Methods
~~~~~~~

.. mpidl:service:: stat

   .. mpidl:method:: bool push(0: string key, 1: double value)

      属性情報 ``key`` の値 ``val`` を与える。

   .. mpidl:method:: double sum(0: string key)

      属性情報 ``key`` を持つ値の合計値を返す。

   .. mpidl:method:: double stddev(0: string key)

      属性情報 ``key`` を持つ値の標準偏差を返す。

   .. mpidl:method:: double max(0: string key)

      属性情報 ``key`` を持つ値の最大値を返す。

   .. mpidl:method:: double min(0: string key)

      属性情報 ``key`` を持つ値の最小値を返す。

   .. mpidl:method:: double entropy(0: string key)

      属性情報 ``key`` を持つ値のエントロピーを返す。

   .. mpidl:method:: double moment(0: string key, 1: int degree, 2: double center)

      属性情報 ``key`` を持つ値の ``center`` を中心とした ``degree`` 次のモーメントを返す。
