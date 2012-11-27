Client API
==========

Each Jubatus server has a MessagePack-RPC interface for clients.
You can implement your client-side logics with any programing languages that is supported by MessagePack-IDL; currently, C++, Python, Ruby and Java clients are officially provided.

The interface is described in files written in MessagePack-IDL format (with file extension of .idl) in the `repository <https://github.com/jubatus/jubatus/tree/master/src/server>`_  and clients are automatically generated from these IDL files.

In this section, we describe the interface of each server in MessagePack-IDL notation.
Syntax of MessagePack-IDL is so simple that you can guess how to use the interface in each language.

.. toctree::
   :maxdepth: 2

   common_structs
   api_classifier
   api_regression
   api_recommender
   api_stat
   api_graph

