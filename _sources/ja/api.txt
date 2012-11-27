Client API
==========

各 Jubatus サーバは、クライアント向けに MessagePack-RPC をインターフェイスを持っています。
クライアント側の実装は、MessagePack-IDL でサポートされているお好きな言語を利用することができます。
現在、C++ / Python / Ruby / Java のクライアントが公式に提供されています。

インタフェースは MessagePack-IDL フォーマットで記述されたファイル (.idl のファイル拡張子を持つ) によって表記されており、 `リポジトリ <https://github.com/jubatus/jubatus/tree/master/src/server>`_  で参照可能です。クライアントはこれらの IDL ファイルから自動生成されています。

本節では、各サーバのインタフェースを MessagePack-IDL 表記で記述します。
MessagePack-IDL 形式はとてもシンプルなため、各言語でどのようにインタフェースを使用するべきかは容易に推測することができます。

.. toctree::
   :maxdepth: 2

   common_structs
   api_classifier
   api_regression
   api_recommender
   api_stat
   api_graph

