Client generation using IDL generator
-------------------------------------

(translate to english)
開発中の `msgpack-idl <http://github.com/msgpack/msgpack-haskell/tree/master/msgpack-idl>`_ を利用する．公式にはリリースされていないため，自分でビルドする必要がある．また，ghc7とcabalが必要である．

::

  $ git clone git://github.com/tanakh/Peggy.git 
  $ cd Peggy
  $ cabal install
  $ cd ..
  $ git clone git://github.com/msgpack/msgpack-haskell
  $ cd msgpack-haskell/msgpack-idl
  $ cabal install
  $ mpidl cpp kvs.idl -o . -p
  ...
  $ ls
  kvs_types.hpp kvs_client.hpp kvs_server.hpp

IDLのコードジェネレータを用いて，他の言語でクライアントコードを生成することによって，複数言語のサポートを容易に行うことができるようになる．
