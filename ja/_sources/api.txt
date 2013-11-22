Client API
==========

各 Jubatus サーバは、クライアント向けに MessagePack-RPC インターフェイスを持つ。
クライアント側の実装は、MessagePack-RPC ライブラリが提供されている任意の言語を利用することができる。
現在、C++ / Python / Ruby / Java のクライアントが公式に提供されている (:doc:`quickstart` を参照)。

インタフェースは MessagePack-IDL フォーマットで記述されたファイル (.idl のファイル拡張子を持つ) によって表記されており、 `リポジトリ <https://github.com/jubatus/jubatus/tree/master/jubatus/server/server>`_  で参照可能である。
クライアントはこれらの IDL ファイルから自動生成されている。

本 API リファレンスでは、各サーバのインタフェースを MessagePack-IDL 表記で記述する。
MessagePack-IDL 形式はとてもシンプルなため、各言語でどのようにインタフェースを使用するべきかは容易に推測することができる。

Jubatus と Jubatus クライアントのバージョンは異なることがある。これは、Jubatus の API が変更されない場合はクライアント側のアップデートが不要なためである。
互換性に関する情報については、 `Jubatus Wiki <https://github.com/jubatus/jubatus/wiki/Client-Compatibility-and-Documentation>`_ を参照のこと。

.. toctree::
   :maxdepth: 2

   common_structs
   api_classifier
   api_regression
   api_recommender
   api_nearest_neighbor
   api_anomaly
   api_stat
   api_clustering
   api_graph

.. toctree::
   :hidden:

   method
