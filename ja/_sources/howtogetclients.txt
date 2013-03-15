.. _how_to_get_clients:

How to Get Clients
-------------------------------------

各言語版のJubatusクライアントを取得する方法は、二種類あります。

- パッケージ管理システムを使用する (:doc:`quickstart` 参照)。

- msgpack-idl と .idl ファイルから生成する。

以降の章で、それぞれの方法を解説します。

Use pre-generated client
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

後述の通り、クライアントコードは msgpack-idl で生成されています。
ただし、クライアント用コードを簡単に使いたいならば、パッケージ管理システムを使用してクライアントライブラリをインストールすることを推奨します。

Generate clients from msgpack-idl
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

新機能追加など、これまでのクライアントが利用できないなどの場合は、クライアントコードを `msgpack-idl <http://github.com/msgpack/msgpack-haskell/tree/master/msgpack-idl>`_ のidlファイルを用いて生成することができます。
msgpack-idl は、Haskellで書かれたIDLコンパイラで、idlファイルで定義されたインターフェイスを各言語に変換します。
このプログラムは、ghc7とcabalを必要とします。classifierを生成するには、以下のように実行します。

::

  $ cabal install msgpack-idl
  $ mpidl cpp classifier.idl -o . -p
  ...
  $ ls
  classifier_types.hpp classifier_client.hpp classifier_server.hpp

このコード生成システムにより、jubatusは様々なプログラミング言語から利用することができます。
