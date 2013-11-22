Client API
==========

Each Jubatus server has a MessagePack-RPC interface for clients.
You can implement your client-side logic with any programming languages in which MessagePack-RPC library is provided.
Currently, C++, Python, Ruby and Java clients are officially provided (see :doc:`quickstart`).

The interface is described in files written in MessagePack-IDL format (with file extension of .idl) in the `repository <https://github.com/jubatus/jubatus/tree/master/jubatus/server/server>`_.
Clients are automatically generated from these IDL files.

In this API reference, we describe the interface of each server in MessagePack-IDL notation.
Syntax of MessagePack-IDL is so simple that you can guess how to use the interface in each language.

Version of Jubatus and Jubatus clients may be different, as clients are not updated when there are no API changes to Jubatus.
See the `Jubatus Wiki <https://github.com/jubatus/jubatus/wiki/Client-Compatibility-and-Documentation>`_ for the compatibility information.

.. toctree::
   :maxdepth: 2

   common_structs
   api_classifier
   api_regression
   api_recommender
   api_nearest_neighbor
   api_anomaly
   api_clustering
   api_stat
   api_graph

.. toctree::
   :hidden:

   method
