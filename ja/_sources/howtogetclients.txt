.. _how_to_get_clients:

クライアントの入手方法
-------------------------------------

各言語版のJubatusクライアントを取得する方法は、二種類あります。

- パッケージ管理システムを使用する (:doc:`quickstart` 参照)。

- jenerator と .idl ファイルから生成する。

以降の章で、それぞれの方法を解説します。

生成済みクライアントの利用
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

後述の通り、クライアントコードは jenerator で生成されています。
ただし、クライアント用コードを簡単に使いたいならば、パッケージ管理システムを使用してクライアントライブラリをインストールすることを推奨します。

jenerator でクライアントを生成する
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

新機能追加など、これまでのクライアントが利用できないなどの場合は、クライアントコードを `msgpack-idl <http://github.com/msgpack/msgpack-haskell/tree/master/msgpack-idl>`_ のidlファイルをjeneratorで変換することで生成されます。
jenerator は、OCamlで書かれたIDLコンパイラで、idlファイルで定義されたインターフェイスを各言語に変換します。
サーバーコードの生成にも利用されています。
詳しくは :doc:`server` を参照。

::

  $ jenerator -l cpp -o . classifier.idl
  ...
  $ ls
  classifier_types.hpp classifier_client.hpp classifier_server.hpp

このコード生成システムにより、jubatusは様々なプログラミング言語から利用することができます。
