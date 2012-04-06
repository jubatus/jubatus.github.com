Client generation using IDL generator
-------------------------------------

開発中の `msgpack-idl <http://github.com/msgpack/msgpack-haskell/tree/master/msgpack-idl>`_ を利用する．公式にはリリースされていないため，自分でビルドする必要がある．また，ghc7とcabalが必要である．

::

  $ cabal install msgpack-idl
  $ mpidl cpp kvs.idl -o . -p
  ...
  $ ls
  kvs_types.hpp kvs_client.hpp kvs_server.hpp

IDLのコードジェネレータを用いて，他の言語でクライアントコードを生成することによって，複数言語のサポートを容易に行うことができるようになる．
