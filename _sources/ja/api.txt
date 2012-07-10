Client API
==========

jubaclassifier, jubaregression, jubarecommender, jubastat, jubagraph は、クライアント向けにMessagePack-RPCをインターフェイスを持っています。そのため、クライアント側の実装は、言語に依存せず好きな言語を利用することができます。

すべてのMessagePack-IDLフォーマットファイルは、`repository <https://github.com/jubatus/jubatus/tree/master/src/server>`_  に記載されており、クライアントはIDLファイルより、自動生成されます。本節では、それぞれの機械学習・分析機能のインターフェイスを紹介します。
MessagePack-IDL形式は、とてもシンプルなので、それぞれの言語でどのように実装するべきかは容易に類推できるかと思います。

.. toctree::
   :maxdepth: 2

   common_structs
   api_classifier
   api_regression
   api_recommender
   api_stat
   api_graph






