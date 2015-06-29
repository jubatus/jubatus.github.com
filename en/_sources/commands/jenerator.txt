jenerator
=========

Synopsis
--------------------------------------------------

.. code-block:: shell

  jenerator -l <lang> [options ...] idl ...

Description
--------------------------------------------------

``jenerator`` generates implementation of proxy, server template and C++ client from extended MessagePack-IDL file.

``jenerator`` is not installed by default (see ``tools/jenerator`` in the source tree).

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` indicates the default value.

.. program:: jenerator

.. option:: -l <lang>

   Language of the client code to generate. Currently ``cpp``, ``java``, ``python``, and ``ruby`` are supported.
   Specify ``server`` if you need to generate servers and proxies.

.. option:: -o <dirpath>

   Directory to output the generated source files.

   If not specified, the current directory will be used.

.. option:: -i

   Use relative path for ``#include`` directives.

   Effective only when generating C++ code (servers, proxies and C++ clients).
   This option is intended for use by Jubatus developers.
   You don't need this option except you're going to build generated code inside Jubatus source tree.

.. option:: -n <namespace>

   Declare the specified namespace for generated source.

.. option:: -t

   Generate server template.

   Effective only when generating servers and proxies.

.. option:: -g <guard>

   Prefix used for include guards in header files.

   Effective only when generating C++ code (servers, proxies and C++ clients).

.. option:: -help, --help

   Print the brief usage of the command.
