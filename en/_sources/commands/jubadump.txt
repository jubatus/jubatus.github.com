jubadump
========

Synopsis
--------------------------------------------------

.. code-block:: shell

  jubadump -i <file> [options ...]

Description
--------------------------------------------------

``jubadump`` is a tools to convert Jubatus model files saved using ``save`` RPC to JSON.

Currently, following models are supported:

* ``classifier`` (linear classifiers only)
* ``regression``
* ``recommender`` (``inverted_index`` only)
* ``anomaly`` (``lof`` with ``inverted_index`` backend only)

Options
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

* ``[]`` indicates the default value.

.. program:: jubadump

.. option:: -i <file>, --input <file>

   Path of the model file to convert.
