コード生成器の利用
=====================

Jubatus フレームワークを利用した機械学習アルゴリズムの開発では、まず IDL と呼ばれる RPC インタフェース定義ファイルを作成する。
Jubatus に付属するコード生成器 ``jenerator`` を使用することで、IDL から各部品 (サーバ, Proxy, 各言語版のクライアント) を生成することができる。
これらの生成器を利用することで、フレームワークの利用者は機械学習アルゴリズムの実装に集中することができる。

開発の流れ
-------------------

#. サービスが持つべきRPCインターフェースを IDL で定義する。
#. ``jenerator`` を用いて、IDL から サーバー、Proxy のコード、共通のデータ構造、各言語（C++/Python/Ruby/Java）のクライアントを生成する。
#. RPC毎にサーバーが利用するユーザ定義クラスのインターフェースの実体、および必要に応じてmix操作を作成する。

`スケルトンプロジェクト <https://github.com/jubatus/jubatus-service-skeleton>`_ を利用すると、容易に開発を開始できる。

IDL を使用する理由
---------------------

Jubatusは機械学習などのアルゴリズムをモジュール化し、容易に追加できることを目的にしているが、公開されている実装に対してrecommenderを追加しようとした場合、それぞれのRPCインターフェースをクライアントのヘッダと実装、Proxyのヘッダと実装、サーバー本体のヘッダと実装の6箇所に定義する必要があった。さらにpficommonのMPRPC_GEN, MPRPC_PROC等、サーバーへの関数登録などで合計7箇所に記述を繰り返す必要があることが明らかになった。
このような設計では、新しい学習アルゴリズムを追加する度に同じRPC定義を7回繰り替えさなければならず、APIの仕様を変更するたびに同じような修正を繰り返さなくてはならないためバグが入り込む温床となっており、機械学習を分散環境で実装するためのフレームワークとして容易に追加できると言いがたい。さらに、C++のマクロおよびテンプレートを多用しているため、コンパイルエラーが複雑なものとなり、Jubatusを用いて機械学習を実装するにはJubatusの深い知識が必要となっていた。

IDL を利用することで、上記のフローで一連のシステムを作成することができることを確認した。
実際に RPC 定義をするのは、7箇所から3箇所に削減された。これを用いて、recommender, classifier, regression, stat, graph が構成出来ることを確認した。

ファイルの構成
--------------------

Jubatus フレームワークを利用した機械学習システムは、以下のファイルで構成される (*NAME* はサービスの名称である)。

- NAME_serv.cpp: 機能を実装するソースファイル (``jenerator`` で生成されるテンプレートを編集)
- NAME_serv.hpp: ``NAME_serv.cpp`` に対応するヘッダファイル (``jenerator`` で生成されるテンプレートを編集)
- NAME_impl.cpp: サーバの main 関数と RPC インタフェースの定義、RPC メソッドの登録 (``jenerator`` で自動生成)
- NAME_proxy.cpp: Proxy の実装 (``jenerator`` で自動生成)
- NAME_client.hpp: サーバー間通信で利用するクライアントの実装 (``jenerator`` で自動生成)
- NAME_types.hpp: RPC で使用する構造体や型の情報 (``jenerator`` で自動生成)

``jenerator``: コード生成器
---------------------------------

RPC インターフェースは `MessagePack-IDL <https://github.com/msgpack/msgpack-haskell/blob/master/msgpack-idl/Specification.md>`_ により定義する。
ただし、そのままJubatusのコードを生成するためには、MessagePack-IDL の文法とは別に、RPCサービスの各メソッドにアノテーションをつける必要がある。

アノテーションは Jubatus のコードジェネレータである ``jenerator`` では解釈されるが、MessagePack-IDL ではコメントとして無視される。
このため、同じ IDL ファイルで各種クライアントも生成できる。

各メソッドに付与するアノテーションの文法は以下の通りである。

- 各メソッドには ``#@`` で始まる 3 つのアノテーションを付与する必要があり、順番に "ルーティング", "ロック種類", "結合方法" を指定する。

- "ルーティング" には、Proxy がどのようにリクエストをプロキシするかを定義する。
  ``cht``, ``broadcast``, ``random`` の 3 種類が用意されており、これによって、典型的だと思われる機械学習の分散方式をカバーすることができる。

  - ``cht`` は Consistent Hashing によるリクエストの分散を意味する。
    ``cht`` アノテーションがあるメソッドは、2 つ以上の引数を取る必要がある。
    第 1 引数はクラスタ名を表す string 、第 2 引数が cht のキーとなる string である。
    更新データのレプリケーション多重度 (冗長度) はデフォルトでは 2 である。
    ``#@cht(1)`` のように、更新データのレプリケーション多重度を指定することもできる。
  - ``broadcast`` は全サーバーへリクエストをブロードキャストを意味する。
  - ``random`` はランダムに選択されたいずれか 1 台のサーバーへリクエストを送信することを表す。

- "ロック種類" には、リクエストのread/writeを ``analysis``, ``update``, ``nolock`` のいずれかで定義する。

  - ``analysis`` では、サーバ側で read ロックされることになり、複数のスレッドからの同時アクセスが可能となる。
  - ``update`` では、サーバー側で write ロックされることになり、安全にデータを更新することができる。
  - ``nolock`` ではロックは行われない。

- "結合方法" には、API 呼び出しに対する複数のサーバからの結果を結合する方法を定義する。
  利用可能なアグリゲータは `aggregators.hpp <https://github.com/jubatus/jubatus/blob/master/jubatus/server/framework/aggregators.hpp>`_ に掲載されている。

なお、メソッドの戻り値型に ``void`` は利用できない。
返り値が必要ない場合は、意味のない ``int`` や ``bool`` 型などを指定する必要がある。

以下は、アノテーション付きの IDL の例である。

.. code-block:: c++

  message entry {
    0: string key
    1: string value
    2: int version
  }

  service kvs {
    #@cht(2) #@update #@pass
    int put(0: string name, 1: string key, 2: string value)

    #@cht(2) #@analysis #@pass
    entry get(0: string name, 1: string key)

    #@cht(2) #@update #@pass
    int del(0: string name, 1: string key, 2: int version)

    #@broadcast #@update #@pass
    int clear(0: string name)
  }

``jenerator`` のビルド
~~~~~~~~~~~~~~~~~~~~~~

``jenerator`` のビルドには OCaml (findlib あり) 、extlib および OMake が必要である。

::

  $ cd jubatus/tools/jenerator
  $ omake
  $ sudo omake install

``omake install`` を行うと ``jenerator`` が ``/usr/local/bin/jenerator`` としてインストールされる (環境によりパスは異なる場合がある)。インストールを行わずに、ビルドされた ``jenerator`` のバイナリを直接使用してもよい。

ヒント: Ubuntu を使用している場合、OCaml (``ocaml-native-compilers``), findlib (``ocaml-findlib``), iextlib (``libextlib-ocaml``), OMake (``omake``) のバイナリパッケージが利用できる。

サーバ/Proxy を IDL から生成する
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

上に示した例が ``kvs.idl`` というファイルに書かれていると仮定して、以下の手順でコードを生成する。

::

  $ jenerator -l server -o . -n jubatus -t kvs.idl

``jenerator`` の詳細な使い方については :ref:`jenerator` を参照すること。

サーバの実装
-------------------

``kvs_impl.cpp`` は、 ``kvs_serv`` クラスを利用してサーバーを構成する。
このクラスを ``kvs_serv.{cpp,hpp}`` に定義する必要がある。
生成されたテンプレート (``kvs_serv.tmpl.{cpp,hpp}``) をリネームして利用することができる。

``kvs_impl.cpp`` の中では ``main`` 関数も実装されており、ユーザは ``main`` を実装する必要はない。
コマンドライン引数の仕様は Jubatus フレームワークを使用しているサーバの間ですべて共通である。
オプションは ``--help`` で参照することができる。

Mixable クラス
~~~~~~~~~~~~~~

TBD.

Proxy の実装
-------------------

Proxy に関しては、実装をする必要はない。 ``jenerator`` が生成した ``kvs_proxy.cpp`` をコンパイルすると Proxy が得られる。

``kvs_proxy.cpp`` には ``main`` 関数の実装だけがあり、各 RPC メソッドごとにリクエストをプロキシし、レスポンスを集約するためのファンクタを登録する。

今後の課題
------------

インターフェースと処理記述
~~~~~~~~~~~~~~~~~~~~~~~~~~

複数の機械学習を結合したり、特徴量変換と学習器本体を分離するためには、C++を単純に記述していくインターフェースではどこをどうしてよいかが開発者にとって自明でない。現状のジェネレータでは学習器のインターフェースしか記述することができない。アルゴリズム自体も抽象化された言語上で試行錯誤し、機械学習を実装するユーザが一台のマシン上でも、複数台のマシン上でも透過的に実行や試行錯誤ができるような機能を、検討する必要がある。
