Client API
==========

各 Jubatus サーバは、クライアント向けに MessagePack-RPC をインターフェイスを持つ。
クライアント側の実装は、MessagePack-IDL でサポートされている任意の言語を利用することができます。
現在、C++ / Python / Ruby / Java のクライアントが公式に提供されている (:doc:`quickstart` を参照)。

インタフェースは MessagePack-IDL フォーマットで記述されたファイル (.idl のファイル拡張子を持つ) によって表記されており、 `リポジトリ <https://github.com/jubatus/jubatus/tree/master/src/server>`_  で参照可能である。クライアントはこれらの IDL ファイルから自動生成されている。

本 API リファレンスでは、各サーバのインタフェースを MessagePack-IDL 表記で記述する。
MessagePack-IDL 形式はとてもシンプルなため、各言語でどのようにインタフェースを使用するべきかは容易に推測することができる。

.. toctree::
   :maxdepth: 2

   common_structs
   api_classifier
   api_regression
   api_recommender
   api_stat
   api_graph
