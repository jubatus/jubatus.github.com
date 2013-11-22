RPC Error Handling
==============================

Jubatus causes RPC-errors with various reasons (Among these, you'll often encounter timeout errors caused by server-side auto session close).
In this page, we describe how to handle RPC-errors.

Common Issues
::::::::::::::::

+ If you perform RPC, exceptions may be raised. When exceptions occur, in some client language, connections aren't closed automatically.
  To avoid resource leaks, you must catch exceptions and close connections explicitly.
  It is also the same when you dispose an client object.

+ RPC errors caused by application layer problems like RPC method or type mismatching, and also caused by transport layer problems like communication errors or timeout.
  Trasport layer problems may recover by retrying RPC.

+ You must consider the following points before retrying RPC:

  - **validity of retrying UPDATE methods** :
    In general, re-performing one non-idempotent UPDATE method may make an EM model different.
    Ideally, we want to retry RPC only which isn't performed by server actually.
    But Jubatus client can't detect that. Thus, you need to restrict retrying UPDATE methods to idempotent ones.
    On the other hand, retrying ANALYZE methods aren't restricted.

  - **latency** :
    Retrying RPC will increase latency. You must consider your application can allow that.

+ It is recommended that retrying RPC are performed after some interval and limit the number of retrying.

Recommendation for each client languages
::::::::::::::::::::::::::::::::::::::::::

Ruby
--------

+ RPC performing code should guarantee explicit session closing by ``begin - ensure`` block.
  To close sessions explicitly, you execute client object's ``get_client.close`` .

+ Any RPC exceptions are derived from ``MessagePack::RPC::RPCError`` .

+ When transport layer error occurs by RPC,  ``MessagePack::RPC::TransportError`` exception will be raised.
  Timeout raises ``MessagePack::RPC::TimeoutError`` exception.
  Server-side connection close also raises ``MessagePack::RPC::TimeoutError`` .
  You should catch these exceptions by ``begin - rescue`` block and will retry RPC.
  Before you retry, you must close sessions explicitly.

+ When RPC methods mismatching, type mismatching errors occur by RPC, ``Jubatus::Common::InterfaceMismatch`` exception will be raised.
  When algorithm errors occur by RPC, ``MessagePack::RPC::RemoteError`` or ``MessagePack::RPC::CallError`` exception will be raised.
  You should catch these exceptions and close sessions explicitly.
  You can catch any RPC exceptions by ``RPCError``  excluding ``TrasportError`` and ``TimeoutError`` .

.. code-block:: ruby

  require 'jubatus/classifier/client'

  RETRY_MAX = 3      # maximum number of retries
  RETRY_INTERVAL = 3 # retry interval (sec)

  client = Jubatus::Classifier::Client::Classifier.new(host, port, name, timeout)
  begin
    retry_count = RETRY_MAX
    begin

      # performing RPC
      client.classify(query_data)

    # retry against transport error and timeout
    rescue MessagePack::RPC::TimeoutError, MessagePack::RPC::TransportError => e
      # stop retrying if the number of retry reaches limit
      raise if (retry_count -= 1) <= 0

      # preparing retry: close session explicitly
      client.get_client.close

      # retry after some inteval
      $stderr.puts e
      sleep RETRY_INTERVAL
      retry
    end

  # catch any RPC exceptions
  rescue MessagePack::RPC::RPCError, Jubatus::Common::InterfaceMismatch => e
    $stderr.puts e
  ensure
    # close session always
    client.get_client.close
  end

Python
--------

+ RPC performing code should guarantee explicit session closing by ``try - finally`` block.
  To close sessions explicitly, you execute client object's ``get_client().close()`` .

+ Any RPC exceptions are derived from ``msgpackrpc.error.RPCError`` .

+ When transport layer error occurs by RPC, ``msgpackrpc.error.TransportError`` exception will be raised.
  Timeout raises ``msgpackrpc.error.TimeoutError`` exception.
  Server-side connection close also raises ``msgpackrpc.error.TimeoutError`` .
  You should catch these exceptions by ``try - except`` block and will retry RPC.
  Before you retry, you must close sessions explicitly and **re-create a client object** .

+ When RPC method or type mismatching occur, ``jubatus.common.client.InterfaceMismatch`` exception will be raised.
  Algorithm error and other RPC errors raise ``msgpackrpc.error.RPCError`` exception.
  You should catch these exceptions and close sessions explicitly.
  You can catch any RPC exceptions by ``RPCError`` excluding ``TransportError`` and ``TimeoutError`` .

.. code-block:: python

  import jubatus
  from jubatus.common import Datum
  import msgpackrpc
  import time

  retry_max = 3      # maximum number of retries
  retry_interval = 3 # retry interval (sec)

  client = jubatus.Classifier(host, port, name, timeout)
  try:
      retry_count = retry_max
      while True:
          try:

              # performing RPC
              client.classify(query_data)
              break

          # retry against transport error and timeout
          except (msgpackrpc.error.TransportError, msgpackrpc.error.TimeoutError) as e:
              # stop retrying if the number of retry reaches limit
              retry_count -= 1
              if retry_count <= 0:
                  raise

              # preparing retry: close session explicitly and re-create client object
              client.get_client().close()
              client = jubatus.Classifier(host, port, name, timeout)

              # retry after some interval
              print e
              time.sleep(retry_interval)
              continue

  # catch any RPC exceptions
  except (msgpackrpc.error.RPCError, jubatus.common.client.InterfaceMismatch) as e:
      print e

  finally:
      # close session always
      client.get_client().close()

C++
-----

+ When you dispose client objects, connections are closed automatically.
  You don't need to close sessions explicitly. But if you want to do so, you execute client object's ``get_client().close()`` .

+ Any RPC exceptions are derived from ``msgpack::rpc::rpc_error`` .

+ When client object fails to connect server ( one of the transport layer errors ) , ``msgpack::rpc::connect_error`` will be raised.
  Other transport layer errors will raise ``msgpack::rpc::system_error`` exceptions.
  Timeout will raise ``msgpack::rpc::timeout_error`` exception.
  And server-side connection close will raise ``msgpack::rpc::connection_closed_error`` exception.
  You should catch these exceptions by ``try - catch`` block and will retry RPC.
  Before you retry, you must close sessions explicitly.
  In addition, ``connect_error`` exception is derived from ``timeout_error``.
  You can catch ``connect_error`` exceptions as ``timeout_error`` .

+ When RPC method mismatch and type mismatch occur by RPC, ``msgpack::rpc::no_method_error`` and ``msgpack::rpc::argument_error`` exception will be raised respectively.
  Algorithm error will raise ``msgpack::rpc::remote_error`` exception.
  You can catch these exceptions as ``rpc_error`` .

.. code-block:: c++

  #include <jubatus/client.hpp>

  #define RETRY_MAX 3       // maximum number of retries
  #define RETRY_INTERVAL 3  // retry interval (sec)

  // RPC exception handler macro
  #define RPC_RETRY_EXCEPTION_COMMON_HANDLER()              \
      // stop retrying if the number of retry reaches limit \
      if (--retry_count <= 0) throw;                        \
                                                            \
      // preparing retry: close session explicitly          \
      client.get_client().close();                          \
                                                            \
      // retry after some interval                          \
      std::cerr << e.what() << std::endl;                   \
      ::sleep(RETRY_INTERVAL);                              \
      continue;

  {
    jubatus::classifier::client::classifier client(host, port, name, timeout);
    try {
      int retry_count = RETRY_MAX;
      while(true) {
        try {

          // performing RPC
          results = client.classify(query_data);
          break;
        // retry against transport errors and timeout
        } catch(msgpack::rpc::connection_closed_error &e) {
          RPC_RETRY_EXCEPTION_COMMON_HANDLER();
        } catch(msgpack::rpc::system_error &e) {
          RPC_RETRY_EXCEPTION_COMMON_HANDLER();
        } catch(msgpack::rpc::timeout_error &e) {
          RPC_RETRY_EXCEPTION_COMMON_HANDLER();
        }
      }

    // catch any RPC exceptions
    } catch(msgpack::rpc::rpc_error &e) {
      std::cerr << e.what() << std::endl;
    }
    // close connections automatically by disposing client object
  }

Java
------

+ RPC performing code should guarantee explicit session closing by ``try - finally`` block.
  To close sessions explicitly, you execute client objects' ``get_client().close()`` .

+ Any RPC errors are reported by ``org.msgpack.rpc.error.RPCError`` exceptions.
  You **can not** distinguish errors by exception classes.
  You should catch ``RPCError`` exceptions and close sessions explicitly.

+ After closing session explicitly, you can retry RPC by same client object.
  But retrying RPC is not recommended because you can not detect transport layer error which may recover by retrying.
