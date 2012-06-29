
Server Generation Using Code Generator
--------------------------------------

In Jubatus, distributed machine learning can implemented easily by using Jubatus framework.
This section describes how to realize your own machine learning algorithm with mix using Jubatus framework.

First, there must exist same definitions in six C++ source files everytime we add new learning algorithm,
that is, header and implementation of client, header and implementation of Jubakeeper and header and implementation of server.
This would lead to a "hotbed" of bugs every time we had changed the API.

.. Jubatusは機械学習などのアルゴリズムをプラグイン化し，容易に追加できることを目的にしているが，公開されている実装に対してrecommenderを追加しようとした場合，それぞれのRPCインターフェースをクライアントのヘッダと実装，Jubakeeperのヘッダと実装，サーバー本体のヘッダと実装の6箇所に定義する必要があった．さらにpficommonのMPRPC_GEN, MPRPC_PROC等，サーバーへの関数登録などで合計7箇所に記述を繰り返す必要があることが明らかになった．このような設計では，新しい学習アルゴリズムを追加する度に同じRPC定義を7回繰り替えさなければならず，APIの仕様を変更するたびに同じような修正を繰り返さなくてはならないためバグが入り込む温床となっており，機械学習を分散環境で実装するためのフレームワークとして容易に追加できると言いがたい．さらに，C++のマクロおよびテンプレートを多用しているため，コンパイルエラーが複雑なものとなり，Jubatusを用いて機械学習を実装するにはJubatusの深い知識が必要となっていた．

Now users can create system through very few steps,

#. Define RPC interfaces that server should have.
#. Generate codes of IDL, server, Jubakeeper with ``jenerator``.
#. Implement codes of interface of user-defined class and (if necessary, ) mix operation.
#. Generate clients with msgpack-idl

Currenly all algorithms (recommener, classifier, regression, and stat) defines its interface with ``jenerator``.


``jenerator``: The Code Generator
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We define interface with `MsgPack-IDL <https://github.com/msgpack/msgpack-haskell/blob/master/msgpack-idl/Specification.md>`_ .
So please read the instruction of MsgPack-IDL first.
Aside from MsgPack-IDL's original syntax, we must add annotations for each method of RPC service in order to generate codes used in Jubatus.
Annotations are interpreted by the code generator, but they are ignored as comments by MsgPack-IDL.
Therefore, we can generate each client with same interface by MsgPack-IDL.


- Declaration of Annotated Class Method.

  - First annotation defines routing of request. This annotation should begin with "#@" and be followed with one of "cht", "broadcast" and "random". Each keyword represents distribution of request with Consistent Hashing, broadcast of request to all servers, and sending of request to a randomly chosen server, respectively. We can cover distribute methods used in typical machine learning tasks.

    - Annotation "cht" may have one argument by itself, like ``#@cht(1)``, which defines replication number of the update data.
    - Method annotated with "cht" must have more than two arguments. First is a string that specifies the name of a synced cluster. Second arguemnt is for a key of .
    - Method annotated with "broadcast" or "random" must have one argument and one return value. void type is not available. If argument or return value is not needed, we must add meaningless value such as value of int type.

  - Second annotation defines read/write of request. If we choose "analysis", data is locked in server side with read lock and is accesible by multiple thread simultaneously. On the other hand, if we choose "update", data is locked with write lock. Therefore, we can safely update data.

  - Third annotation defines how to aggrate the result of API call. Available aggregator is written in `aggregators.hpp <https://github.com/jubatus/jubatus/blob/master/src/framework/aggregators.hpp>`_ .


.. code-block:: c++

  message somemsgtype {
    0: string key
    1: string value
    2: int version
  }

  service kvs {

    #@cht #@update #@all_and
    int put(0: string name, 1: string key, 2: string value)

    #@cht #@analysis #@random
    somemsgtype get(0: string name, 1: string key)

    #@cht #@update #@all_and
    int del(0: string name, 1: string key, 2: int v)

    #@broadcast #@update #@all_and
    int clear()

    #@broadcase #@analysis #@merge
    map<string, map<string, string> > get_status()
  }

Ocaml and Omake are required to build the generator .
Suppose the name of this file is kvs.idl. We can generate codes in the following manner.


::

  jubatus $ cd tools/generator
  jubatus $ omake
  jubatus $ sudo omake install
  jubatus $ cd -
  jubatus $ jenerator path/to/kvs.idl
  jubatus $ ls kvs*
  kvs_impl.cpp kvs_keeper.cpp

Two files will be generated.
If we add -t option, we can generate additionally C++ source file which is template of implementation of server.
At that time generator will automatically add APIs named save/load.

TODO: how to implement mix


Server
~~~~~~

MsgPack-IDL generates headers for mprpc of pficommon. In the example above, the name of the header should be kvs_server.hpp.
These headers register functors of RPC definition to servers.
This registration is executed by passing the class name to class server with CRTP (Compressed Real Time Protocol).
Generated kvx_impl.cpp construct server with kvs_server.hpp.
Generators defines kvs_serv class in kvs_impl.cpp.
Users should declare and implement this class under the same namespace.
By this process, users can insert server-side implementation to the framework.
At this time, API named get_diff and putdiff are added to server automatically.
It is only implementing get_diff, put_diff and reduce in server that users must do in order to use mix operation in a distributed environment.

Here is the explanation of kvs_serv class:

.. msgpack-idlが生成するpficommonのmprpc向けヘッダは，CRTPによりクラス名を渡すことにより，RPC定義のファンクタをサーバーに登録する．ジェネレータが生成するkvs_impl.cppは，そのkvs_server.hppを利用してサーバーを構成する．ジェネレータはkvs_impl.cppの中でkvs_servというクラスを指定する．ユーザは同じ名前空間でこれを宣言・実装することによって，サーバー側の実装をフレームワークに組み込むことができる．このとき，サーバーは自動的にget_diff, put_diffというAPIをサーバーに追加する．これにより，サーバーでは，Mにget_diff, put_diffおよびreduceを実装するだけで分散環境でのmixを利用できる．以下に例を示す．

.. code-block:: c++

  namespace jubatus { namespace server {

  class kvs_serv : jubatus_serv<my_kvs, diff_t> {
  public:
    kvs_serv(const server_argv&);
    virtual ~kvs_serv();
    
    pfi::lang::shared_ptr<my_kvs> make_model();
    void after_laod();

    int put(string key, string value);
    somemsgtype get(string key, int v);
    int del(string key, int v);
    int clear(int);
    map<string, string> get_status(int);
  };
  }}

Users must implement make_model() and define initialization of constructor M(my_kvs).
Also, users can implement after_load(). It modifies the state of server after initialization.
For example of classifier, users can execute set_mixer and modify the algorithm of mix.

main() is implemented in kvs_impl.cpp. Therefore, users don't have to implement main function.
Command line options are same among servers.
The options can be referenced with -? option.

.. kvs_impl.cppの中ではmain関数も実装されており，ユーザはmainを実装する必要はない．コマンドライン引数の仕様は統一されており，-?で参照することができる．

Mixable class
~~~~~~~~~~~~~

Keeper
~~~~~~

Users don't have to implement nothing regarding keeper.
Users have only to compile source codes of keeper.
As the generator generate kvs_keeper.cpp, compile it and users can get keeper program.
kvs_keeper.cpp has only main function.
In this main function, keeper mainly does two things.
First, keeper specifies routing of cht, broadcast and random, update process, and read process.
These are defined in the annotated idl file.
Second, keeper register proxy functor for each RPC.

.. ユーザーはkeeperに関して何らかの実装をする必要はなく，ただコンパイルすればよい．ジェネレータがkvs_keeper.cppを生成するので，それをコンパイルすればkeeperとなる．実体はmain関数の実装があるだけで，broadcast, random, chtのルーティング，および更新処理と読込処理を指定して各RPCのプロキシとなるファンクタを登録する．

- cht

  - Specifies servers with Consistent Hashing and key used in hashing. This process guarantees that requests with same key is send to same servers. Currently request is send to two servers because of redundancy. As this is senchronous call of MPRPC, all RPC call are serialized. Therefore, process time is proportional to the number of servers.

- broadcast

  - Send request to all servers. As this is senchronous call of MPRPC, all RPC call are serialized. Therefore, process time is proportional to the number of servers.

- random

  - Send request to randomly chosen server among all servers.

.. - broadcast
..  - 全サーバーにリクエストを送信する．MPRPCが同期呼び出しであるため，全てのRPC呼び出しがシリアルに実行されるため，処理時間はサーバーの台数分だけかかる．
.. - random
..   - 全サーバーの中から，ランダムにサーバーを選択しリクエストを送信する．
.. - cht
..   - キーを指定することによって，Consistent Hashingを用いて同じキーは同じサーバーに必ず送信されることを保証する．現在は冗長化のために，2台にリクエストを送信している．MPRPCが同期呼び出しであるため，2回のRPC呼び出しがシリアルに実行される．
