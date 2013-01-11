.. _how_to_get_clients:

How to Get Clients
-------------------------------------

There are two ways in getting a client code of each service in each language.

- Use package management system (see :doc:`quickstart`)

- Generate client code with msgpack-idl and .idl file

In the following section, we explain these methods in detail.

Use pre-generated client
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

As explained later, client codes are generated from msgpack-idl.
But if you want to use client code casually, it is recommended that you install them by using package management system.

Generate clients from msgpack-idl
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We can generate client codes by `msgpack-idl <http://github.com/msgpack/msgpack-haskell/tree/master/msgpack-idl>`_ .idl file.
msgpack-idl is an idl compiler written in Haskell and .idl file is a specification file of msgpack-idl.  This program requires ghc7 and cabal.
The followings are example of generating clients (and servers). In this example, we generate clients of classifier.

::

  $ cabal install msgpack-idl
  $ mpidl cpp classifier.idl -o . -p
  ...
  $ ls
  classifier_types.hpp classifier_client.hpp classifier_server.hpp

Owing to this code-generating system, application developers can easily support clients written in multiple programming languages.
