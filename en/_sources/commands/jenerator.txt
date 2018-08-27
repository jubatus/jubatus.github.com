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

   Specify a language of the client code to generate.
   Currently ``cpp``, ``java``, ``python``, ``ruby`` and ``go`` are supported.
   Specify ``server`` if you need to generate servers and proxies.

.. option:: -o <dirpath>

   Specify a directory to output the generated source files.

   If not specified, the current directory will be used.

.. option:: -i

   Use relative path for ``#include`` directives.

   Effective only when generating C++ code (servers, proxies and C++ clients).
   This option is intended for use by Jubatus developers.
   You don't need this option except you're going to build generated code inside Jubatus source tree.

.. option:: -n <namespace>

   Specify a namespace for generated source.

   If not specified, the global namespace will be used.

.. option:: -t

   Generate server template.

   Effective only when generating servers and proxies.

.. option:: -g <guard>

   Specify a prefix used for include guards in header files.

   Effective only when generating C++ code (servers, proxies and C++ clients).
   If not specified, include guards will not be prefixed.

.. option:: --idl-version <version>

   Specify a version number of the IDL file.
   If specified, the version number will be embedded into the generated source code.

   If not specified, version number will not be embedded.

.. option:: -help, --help

   Print the brief usage of the command.
