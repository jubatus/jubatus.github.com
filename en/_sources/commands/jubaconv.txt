jubaconv
========

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubaconv [options ...]

Description
--------------------------------------------------

``jubaconv`` is a tool to test your fv_converter configuration.

``jubaconv`` simulates the internal behavior of fv_converter and displays the result of conversion on the command-line.

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` indicates the default value.

.. program:: jubaconv

.. option:: -i <format>, --input-format <format>

   Format of the input. [json]

   ``<format>`` must be one of ``json`` or ``datum``.

.. option:: -o <format>, --output-format <format>

   Format of the output. [fv]

   ``<format>`` must be one of ``json``, ``datum`` or ``fv``.

.. option:: -c <config>, --conf <config>

   Jubatus server configuration file in JSON.

   This option must be given only if ``fv`` is specified for :option:`-o`.

Examples
--------------------------------------------------

.. code-block:: none

   $ cat data.json
   { "message": "hello world", "age": 31 }

   $ jubaconv -i json -o fv -c /opt/jubatus/share/jubatus/example/config/classifier/pa.json < data.json
   /message$hello world@str#bin/bin: 1
   /age@num: 31

   $ cat datum.json
   {
     "string_values": {
       "hello": "world"
     },
     "num_values": {
       "age": 31
     }
   }

   $ jubaconv -i datum -o fv -c /opt/jubatus/share/jubatus/example/config/classifier/pa.json < datum.json
   hello$world@str#bin/bin: 1
   age@num: 31
