Stat
----

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/src/server/stat.idl>`_ を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである

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

なし


Methods
~~~~~~~

各メソッドの最初のパラメタ ``name`` は、タスクを識別する ZooKeeper クラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. describe:: bool push(0: string name, 1: string key, 2: double val)

   属性情報 ``key`` の値 ``val`` を与える。


.. describe:: double sum(0: string name, 1: string key)

   属性情報 ``key`` を持つ値の合計値を返す。


.. describe:: double stddev(0: string name, 1: string key)

   属性情報 ``key`` を持つ値の標準偏差を返す。


.. describe:: double max(0: string name, 1: string key)

   属性情報 ``key`` を持つ値の最大値を返す。


.. describe:: double min(0: string name, 1: string key)

   属性情報 ``key`` を持つ値の最小値を返す。


.. describe:: double entropy(0: string name, 1: string key)

   属性情報 ``key`` を持つ値のエントロピーを返す。


.. describe:: double moment(0: string name, 1: string key, 2: int degree, 3: double center)

   属性情報 ``key`` を持つ値の ``center`` を中心とした ``degree`` 次のモーメントを返す。
