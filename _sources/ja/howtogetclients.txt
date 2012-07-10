.. _how_to_get_clientsja:

How to Get Clients
-------------------------------------

各言語ごとのjubatusクライアントを取得する方法は、二種類あります。

- `github <https://github.com/jubatus/jubatus/downloads>`_ から生成済みコードを取得する。

- msgpack-idl と .idl ファイルから生成する。

以降の章で、それぞれの方法を解説します。

Use pre-generated client
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

クライアント用コードを簡単に使いたいならば、Jubatus開発者らによって生成されたクライアントライブラリを利用するべきです。
それらのコードは、 `こちら <https://github.com/jubatus/jubatus/downloads>`_ からダウンロードすることができます。


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
