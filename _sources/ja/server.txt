
Server generation using code generator
--------------------------------------

Jubatusは機械学習などのアルゴリズムをプラグイン化し，容易に追加できることを目的にしているが，公開されている実装に対してrecommenderを追加しようとした場合，それぞれのRPCインターフェースをクライアントのヘッダと実装，Jubakeeperのヘッダと実装，サーバー本体のヘッダと実装の6箇所に定義する必要があった．さらにpficommonのMPRPC_GEN, MPRPC_PROC等，サーバーへの関数登録などで合計7箇所に記述を繰り返す必要があることが明らかになった．
このような設計では，新しい学習アルゴリズムを追加する度に同じRPC定義を7回繰り替えさなければならず，APIの仕様を変更するたびに同じような修正を繰り返さなくてはならないためバグが入り込む温床となっており，機械学習を分散環境で実装するためのフレームワークとして容易に追加できると言いがたい．さらに，C++のマクロおよびテンプレートを多用しているため，コンパイルエラーが複雑なものとなり，Jubatusを用いて機械学習を実装するにはJubatusの深い知識が必要となっていた．

結果として，

#. サーバーが持つべきRPCインターフェースを定義する
#. ジェネレータによりIDL, サーバー，Jubakeeperのコードを生成
#. RPC毎にサーバーが利用するユーザ定義クラスのインターフェースの実体，および必要に応じてmix操作を作成
#. msgpack-idlを用いてクライアントを生成

という手順で一連のシステムを作成することができることを確認した．実際にRPC定義をするのは，7箇所から3箇所に削減された．これを用いて，recommender, classifier, regression, statが構成出来ることを確認した．


generator
~~~~~~~~~

`MsgPack-IDL <https://github.com/msgpack/msgpack-haskell/blob/master/msgpack-idl/Specification.md>`_ によりインターフェースを定義する．
ただし，そのままJubatusのコードを生成するためにはRPCサービスの各メソッドにアノテーションをつける必要がある．
これはコードジェネレータでは解釈されるが，MsgPack-IDLではコメントとして無視されるため，同じファイルで各種クライアントも生成できる．

- アノテーションつきクラスメソッドの宣言

  - 一番目のアノテーションでは，リクエストのルーティングを宣言することができる．必ず "#@" から始まり， "cht", "broadcast", "random" のいずれかを表す．それぞれ，Consistent Hashingによるリクエストの分散，全サーバーへリクエストをブロードキャスト，ランダムに選択されたいずれかのサーバーへリクエストを送信，を表す．これによって，典型的だと思われる機械学習の分散方式をカバーすることができる．

    - chtアノテーションがあるメソッドは，第一引数がchtのキーとなるstring, 第二引数をユーザ利用の引数としなければならない．
    - broadcast, randomアノテーションがあるメソッドは，必ずひとつの引数とひとつの返り値をもたなければならない．void型は利用できない．引数や返り値が必要ない場合は，意味のないintなどを指定しておくこと．

  - 二番目のアノテーションでは，リクエストのread/writeを宣言することができる．analysisにするとサーバー側でreadロックされることになり，複数のスレッドからの同時アクセスが可能となる．updateにするとサーバー側でwriteロックされることになり，安全にデータを更新することができる．

  - 三番目のアノテーションでは，API呼び出しの結果のアグリゲーションを定義することができる．利用可能なアグリゲータはソースのsrc/framework/aggregators.hppに掲載されている．


.. code-block:: java

   message somemsgtype {
     1: string key;
     2: string value;
     3: int version;
   };

  service kvs {

    #@cht #@update #@all_and
    int put(string key, string value);

    #@cht #@analysis #@random
    somemsgtype get(string key, int v);

    #@cht #@update #@all_and
    int del(string key, int v);

    #@broadcast #@update #@all_and
    int clear(int);

    #@broadcase #@analysis #@merge
    map<string, string> get_status(int);
  };

generatorのビルドにはOCamlおよびOMakeが必要である．このファイルをkvs.idlとすると，

::

  jubatus $ cd tools/generator
  jubatus $ omake
  jubatus $ ./jenerator path/to/kvs.idl -o .
  jubatus $ ls kvs*
  kvs_impl.cpp kvs_keeper.cpp

通常は2つのファイルが生成される．-tオプションをつければ，サーバー実装の雛形となるC++のソースファイルが生成される．

このとき，ジェネレータはsave/loadというAPIを自動で追加する．

TODO: how to implement mix

.. これは，jubatus_serv<M, Diff>のM->saveを呼び出す．これによって，ユーザはsave/loadに関するサーバーの実装を書かなくてよくなり，機械学習のデータMのsave/load（シリアライゼーション）を実装するだけでよい．

.. IDLを用いたクライアントの生成は

server
~~~~~~

msgpack-idlが生成するpficommonのmprpc向けヘッダは，CRTPによりクラス名を渡すことにより，RPC定義のファンクタをサーバーに登録する．ジェネレータが生成するkvs_impl.cppは，そのkvs_server.hppを利用してサーバーを構成する．ジェネレータはkvs_impl.cppの中でkvs_servというクラスを指定する．ユーザは同じ名前空間でこれを宣言・実装することによって，サーバー側の実装をフレームワークに組み込むことができる．
このとき，サーバーは自動的にget_diff, put_diffというAPIをサーバーに追加する．これにより，サーバーでは，Mにget_diff, put_diffおよびreduceを実装するだけで分散環境でのmixを利用できる．以下に例を示す．

.. code-block:: cpp

  namespace jubatus { namespace server {
  class kvs_serv : jubatus_serv<my_kvs, diff_t> {
  public:
    kvs_serv(const server_argv&);
    virtual ~kvs_serv();
    
    static diffv get_diff(const my_kvs*);
    static int put_diff(my_kvs*, diff_t);
    static int reduce(const my_kvs*, const diff_t&, diff_t&);

    pfi::lang::shared_ptr<my_kvs> make_model();
    void after_laod();

    int put(string key, string value);
    somemsgtype get(string key, int v);
    int del(string key, int v);
    int clear(int);
    map<string, string> get_status(int);
  };
  }}

ユーザーは，make_model()を実装し，M(my_kvs)の初期化処理を定義しなければならない．
また，after_load()を実装し，初期化後のサーバーの状態を変更することができる．例えば，classifierであれば，ここで
set_mixerを実行することにより，mixのアルゴリズムを変更することができる．
get_diff, put_diff, reduceはjubatus_serv<M,Diff>::set_mixer()を用いてファンクタを設定することにより利用できる．

この例ではMをmy_kvsとしている．my_kvsが実装していなければならないAPIは以下のとおりである．

.. cpp:function:: bool my_kvs::save(ostream&)


.. cpp:function:: bool my_kvs::load(istream&)



kvs_impl.cppの中ではmain関数も実装されており，ユーザはmainを実装する必要はない．コマンドライン引数の仕様は統一されており，-?で参照することができる．

keeper
~~~~~~

ユーザーはkeeperに関して何らかの実装をする必要はなく，ただコンパイルすればよい．ジェネレータがkvs_keeper.cppを生成するので，それをコンパイルすればkeeperとなる．実体はmain関数の実装があるだけで，broadcast, random, chtのルーティング，および更新処理と読込処理を指定して各RPCのプロキシとなるファンクタを登録する．

- broadcast

  - 全サーバーにリクエストを送信する．MPRPCが同期呼び出しであるため，全てのRPC呼び出しがシリアルに実行されるため，処理時間はサーバーの台数分だけかかる．

- random

  - 全サーバーの中から，ランダムにサーバーを選択しリクエストを送信する．

- cht

  - キーを指定することによって，Consistent Hashingを用いて同じキーは同じサーバーに必ず送信されることを保証する．現在は冗長化のために，2台にリクエストを送信している．MPRPCが同期呼び出しであるため，2回のRPC呼び出しがシリアルに実行される．

Future works
~~~~~~~~~~~~

同時接続数の限界
..................

現状のpficommonのI/Oアーキテクチャでは，スレッド数と同数の同時接続しか維持できない．従ってコネクションの接続と切断の繰り返しが必要になり，特にJubakeeperでボトルネックとなる．仮にJubakeeperでコネクションのキャッシュ機構を用意した場合，サーバー側での同時接続数に限界がくると同時にTCPコネクションのライフサイクルが複雑になる．代替案として

#. acceptベースのMsgpack-RPCサーバーではなく，epollなどの非同期I/Oを用いたサーバーを利用または作成する．公式のMsgpackサーバーは非同期I/Oの機能を持っているがメンテナンスがされてないこともあり利用しにくい．pficommonのMPRPCサーバーを改造するという選択肢がある．

.. #. Jubatusのメッセージングアーキテクチャを根本から見直す．ブロードキャスト，ランダム，RR，CHTなどの複数のプロトコルとZooKeeperの死活監視を統合したメッセージング機構を実装しなおす．


ブロードキャストAPIの問題
............................

全サーバーに対してRPCを実行するタイプのAPIでの実際のブロードキャストは，現在Jubakeeperが行なっている．しかし，ブロードキャスト型のRPCでは，各サーバーから得られた結果のまとめ方（アグリゲート）がAPIによって要件が異なるため，単純に全員に送信するだけでは要求を満たせない場合がある．たとえば，classifierなどのset_configは全サーバーでの実行結果が `全て成功` になるまで繰り返す必要がある（成功するか，サーバーが停止するかのどちらかでなければならない）一方で，get_statusのような状態取得APIを考えた場合には， `成功した返り値どうしをひとつのmapに結合する` といった動作が必要になる．これらの記述は，いまのジェネレータでは上手く読み出すことができない．


インターフェースと処理記述
............................

複数の機械学習を結合したり，特徴量変換と学習器本体を分離するためには，C++を単純に記述していくインターフェースではどこをどうしてよいかが開発者にとって自明でない．現状のジェネレータでは学習器のインターフェースしか記述することができない．アルゴリズム自体も抽象化された言語上で試行錯誤し，機械学習を実装するユーザが一台のマシン上でも，複数台のマシン上でも透過的に実行や試行錯誤ができるような機能を，検討する必要がある．
