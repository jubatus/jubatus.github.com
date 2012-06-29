Client API
==========

jubaclassifier, jubaregression, jubarecommender and jubastat have a MessagePack-RPC Interface for user's clients. You can implement your client-side logics with any programing languages if msgpack-idl supports it.
There exists C++/Python client as of Aplil 2012.

All interfaces are described in MessagePack-IDL format files in the `repository <https://github.com/jubatus/jubatus/tree/master/src/server>`_  and clients are generated from these IDL files. In this section, client interfaces and design of each machine learning libraries are described. We describe the jubatus API using MessagePack-IDL notation. Syntax of MessagePack-IDL is simple so you can guess interface implementation in each language.


.. toctree::
   :maxdepth: 2

   common_structs
   api_classifier
   api_regression
   api_recommender
   api_stat
   api_graph






