RPC エラーのハンドリング
==============================

Jubatus では、様々な理由で RPCエラー が発生します（このうち、とくによく遭遇するのが サーバが接続を自動的に切断したことで発生するタイムアウトエラーでしょう）。
ここでは RPCエラーハンドリングの推奨手順を記載します。

共通
::::::::

+ RPCを行うと、例外が発生する可能性があります。
  一部の言語では、例外が発生した場合でも自動的には接続が破棄されません。
  リソース漏れのないアプリケーションを作成するためには、必ず例外を捕捉し、明示的に接続を破棄するようにしてください。
  これはクライアントオブジェクト利用終了時も同様です。

+ RPCで発生する例外は、メソッド名や型の不一致などアプリケーション層の問題に起因するものと、タイムアウトや通信エラーなどトランスポート層以下の問題に起因するものがあります。
  このうちトランスポート層の問題に起因するものは、例外が発生したRPCを再実行することで復旧する可能性があります。

+ RPCの再実行を行う場合は、以下の点を検討する必要があります:

  - **UPDATE系メソッドの再実行可否** :
    一般に、冪等性のない UPDATE系メソッドを再実行すると、学習結果が異なってしまう可能性があります。
    実際には学習が行われなかったUPDATE系メソッドだけ再実行することが出来れば良いのですが、現在の Jubatus では、クライアント側でこれを判別することはできません。
    したがって、UPDATE系メソッドの再実行は、冪等性が保証されたメソッドに限定すべきです。
    なお、ANALYZE系メソッドの再実行にはとくに制限はありません。

  - **応答性低下** :
    RPCの再実行を行うと、その分応答性が低下します。該当アプリケーションでRPC再実行に伴う応答性低下が許されるかどうかを検討する必要があります。

+ RPC再実行は、間隔をおいて行い、再実行の上限回数を設けることを推奨します。

クライアント言語別 推奨手順
::::::::::::::::::::::::::::::::::::::

Ruby
--------

+ RPC呼び出しを行うコードは、 ``begin - ensure`` ブロックにより、接続の明示的な破棄を保証するようにします。
  接続の明示的な破棄には、クライアントオブジェクトの ``get_client.close`` を使います。

+ RPC呼び出しで発生するすべての例外は、 ``MessagePack::RPC::RPCError`` から派生しています。

+ RPC呼び出しで、トランスポート層のエラーが発生した場合は ``MessagePack::RPC::TransportError`` が発生します。
  また、タイムアウトが発生した場合は ``MessagePack::RPC::TimeoutError`` が発生します。
  サーバにより自動的に接続破棄された場合も ``MessagePack::RPC::TimeoutError`` が発生します。
  ``begin - rescue`` ブロックでこれらの例外を捕捉し、RPCを再実行します。RPC再実行を行うためには、接続を一旦明示的に破棄する必要があります。

+ RPC呼び出しで、メソッド名や型の不一致が発生した場合は ``Jubatus::Common::InterfaceMismatch`` 例外が発生します。
  アルゴリズムのエラーが発生した場合は ``MessagePack::RPC::RemoteError`` または ``MessagePack::RPC::CallError`` 例外が発生します。
  これらの例外を捕捉し、接続を明示的に破棄します。 ``TrasportError`` および ``TimeoutError``以外の ``RPCError`` をまとめて捕捉してもよいでしょう。

.. code-block:: ruby

  require 'jubatus/classifier/client'

  RETRY_MAX = 3      # 再実行の上限回数
  RETRY_INTERVAL = 3 # 再実行の間隔(秒)

  client = Jubatus::Classifier::Client::Classifier.new(host, port, name, timeout)
  begin
    retry_count = RETRY_MAX
    begin

      # RPC実行
      client.classify(query_data)

    # トランスポート層エラーとタイムアウトは再実行する
    rescue MessagePack::RPC::TimeoutError, MessagePack::RPC::TransportError => e
      # 再実行回数の上限に達したら諦める
      raise if (retry_count -= 1) <= 0

      # 再実行準備: 一旦 接続を明示的に破棄
      client.get_client.close

      # 間隔をおいて再実行
      $stderr.puts e
      sleep RETRY_INTERVAL
      retry
    end

  # すべての RPCエラーを捕捉
  rescue MessagePack::RPC::RPCError, Jubatus::Common::InterfaceMismatch => e
    $stderr.puts e
  ensure
    # 接続は必ず破棄
    client.get_client.close
  end

Python
--------

+ RPC呼び出しを行うコードは、 ``try - finally`` ブロックにより、接続の明示的な破棄を保証するようにします。
  接続の明示的な破棄には、クライアントオブジェクトの ``get_client().close()`` を使います。

+ RPC呼び出しで発生する全ての例外は、 ``msgpackrpc.error.RPCError`` から派生しています。

+ RPC呼び出しで、トランスポート層のエラーが発生した場合は ``msgpackrpc.error.TransportError`` が発生します。
  また、タイムアウトが発生した場合は ``msgpackrpc.error.TimeoutError`` が発生します。
  サーバにより自動的に接続破棄された場合も ``msgpackrpc.error.TimeoutError`` が発生します。
  ``try - except`` ブロックでこれらの例外を捕捉し、RPCを再実行します。RPC再実行を行うためには、接続を一旦明示的に破棄し、さらに **クライアントオブジェクトを再生成する必要があります** 。

+ RPC呼び出しで、メソッド名や型の不一致が発生した場合は、 ``jubatus.common.client.InterfaceMismatch`` が発生します。
  アルゴリズムのエラーやその他のエラーが発生した場合は ``msgpackrpc.error.RPCError`` が発生します。
  これらの例外を捕捉し、接続を明示的に破棄します。 ``TransportError`` および ``TimeoutError`` 以外の ``RPCError`` をまとめて捕捉してもよいでしょう。

.. code-block:: python

  import jubatus
  from jubatus.common import Datum
  import msgpackrpc
  import time

  retry_max = 3      # 再実行の上限回数
  retry_interval = 3 # 再実行の間隔(秒)

  client = jubatus.Classifier(host, port, name, timeout)
  try:
      retry_count = retry_max
      while True:
          try:

              # RPC実行
              client.classify(query_data)
              break

          # トランスポート層エラーとタイムアウトは再実行する
          except (msgpackrpc.error.TransportError, msgpackrpc.error.TimeoutError) as e:
              # 再実行回数の上限に達したら諦める
              retry_count -= 1
              if retry_count <= 0:
                  raise

              # 再実行の準備: 接続を明示的に破棄し、クライアントオブジェクト再生成
              client.get_client().close()
              client = jubatus.Classifier(host, port, name, timeout)

              # 間隔をおいて再実行
              print e
              time.sleep(retry_interval)
              continue

  # 全ての RPCエラーを捕捉
  except (msgpackrpc.error.RPCError, jubatus.common.client.InterfaceMismatch) as e:
      print e

  finally:
      # 接続は必ず破棄
      client.get_client().close()

C++
-----

+ クライアントオブジェクトを破棄することで、接続は自動的に破棄されます。
  明示的に接続破棄を行う必要はありません。明示的に接続破棄を行う場合は、クライアントオブジェクトの ``get_client().close()`` を使います。

+ RPC呼び出しで発生するすべての例外は、 ``msgpack::rpc::rpc_error`` から派生しています。

+ RPC呼び出しで発生するトランスポート層のエラーのうち、サーバ接続に失敗した場合は、 ``msgpack::rpc::connect_error`` が発生します。
  その他のトランスポート層のエラーの場合は ``msgpack::rpc::system_error`` が発生します。
  また、タイムアウトが発生した場合は ``msgpack::rpc::timeout_error`` が発生します。
  サーバにより自動的に接続破棄された場合は、 ``msgpack::rpc::connection_closed_error`` が発生します。
  ``try - catch`` ブロックでこれらの例外を補足し、RPCを再実行します。再実行するためには、接続を一旦明示的に破棄する必要があります。
  なお、 ``connect_error`` は ``timeout_error`` から派生しています。 ``connect_error`` を ``timeout_error`` として捕捉することができます。

+ RPC呼び出しで、メソッド名がや型の不一致の場合、それぞれ ``msgpack::rpc::no_method_error``, ``msgpack::rpc::argument_error`` が発生します。
  アルゴリズムのエラーが発生した場合は、 ``msgpack::rpc::remote_error`` 例外が発生します。
  これらの例外を ``rpc_error`` としてまとめて捕捉してもよいでしょう。

.. code-block:: c++

  #include <jubatus/client.hpp>

  #define RETRY_MAX 3       // 再実行の上限回数
  #define RETRY_INTERVAL 3  // 再実行の間隔(秒)

  // 例外ハンドラ マクロ
  #define RPC_RETRY_EXCEPTION_COMMON_HANDLER()    \
      // 再実行回数の上限に達したら諦める         \
      if (--retry_count <= 0) throw;              \
                                                  \
      // 再実行の準備: 一旦 接続を明示的に破棄    \
      client.get_client().close();                \
                                                  \
      // 間隔をおいて再実行                       \
      std::cerr << e.what() << std::endl;         \
      ::sleep(RETRY_INTERVAL);                    \
      continue;

  {
    jubatus::classifier::client::classifier client(host, port, name, timeout);
    try {
      int retry_count = RETRY_MAX;
      while(true) {
        try {

          // RPC実行
          results = client.classify(query_data);
          break;
        // トランスポート層のエラーとタイムアウトは再実行する
        } catch(msgpack::rpc::connection_closed_error &e) {
          RPC_RETRY_EXCEPTION_COMMON_HANDLER();
        } catch(msgpack::rpc::system_error &e) {
          RPC_RETRY_EXCEPTION_COMMON_HANDLER();
        } catch(msgpack::rpc::timeout_error &e) {
          RPC_RETRY_EXCEPTION_COMMON_HANDLER();
        }
      }

    // 全ての RPCエラーを捕捉
    } catch(msgpack::rpc::rpc_error &e) {
      std::cerr << e.what() << std::endl;
    }
    // クライアントオブジェクト破棄で 接続は自動的に破棄される
  }

Java
------

+ RPC呼び出しを行うコードは、try - finally構文により、接続の明示的な破棄を保証するようにします。
  接続の明示的な破棄には、クライアントオブジェクトの ``get_client().close()`` を使います。

+ 現在、RPC呼び出しで発生する全ての例外は、 ``org.msgpack.rpc.error.RPCError`` によって報告されます。
  例外クラスによってエラーを分類することはできません。 ``RPCError`` を捕捉し、接続を明示的に破棄します。

+ 接続を明示的に破棄した後、同じクライアントオブジェクトを使ってRPCを再実行することができます。
  しかし、再実行により復旧の可能性があるトランスポート層のエラーのみを切り分けて再実行することができないので推奨いたしません。
