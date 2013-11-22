Backup and Recovery
===================

Because Jubatus servers process their machine learning models in memory, the models are lost when Jubatus servers have been terminated.

Jubatus provides features for backup and recovery against wrong operations or unexpected termination of server processes.

Currently, following features are available:


Save and Load
:::::::::::::

Jubatus servers can export their machine learning models into local files, and they can restore the models with reading it.

Jubatus provides this feature with the MessagePack-RPC interface for clients.

**Currently, it is not supported to load models into an environment which differs from saved one (Jubatus versions, numbers of clustring machines, or contents of config files).**


Save
----

Calling RPC method ``save`` exports machine learning models on server to a local file.

The directory of the exported file can be specified with server's comand line option ``-d`` or ``--datadir`` (``/tmp`` is used by default).

The name of saved file is specified with following format:

.. code-block:: bash

  ${IPADDR}_${PORT}_${TYPE}_${ID}.jubatus

.. table::

  ========= ==============================================================
  ${IPADDR} Ipv4 address which is used for RPC requests by Jubatus server
  ${PORT}   Port number which is used for RPC requests by Jubatus server
  ${TYPE}   Server type (classifier, recommender, ...)
  ${ID}     | Argument of ``save`` method
            | 1-100 charactors composed of a-zA-Z0-9\_-
  ========= ==============================================================

If an existing file has the same name, it will be overwritten without any confirmation; so be careful!

The format of files exported by ``save`` depends on the Jubatus version; ``load`` (described below) will fail in incompatible versions.


Load
----

Calling RPC method ``load`` reads a file exported by ``save`` and restores machine learning models on server.

Loaded file is specified by the ``${ID}`` argument of ``load``, which has been specified by ``save``.

The directory of the loaded file is specified with server's comand line option ``-d`` or ``--datadir`` (``/tmp`` is used by default).

Server process checks the compatibility of the Jubatus versions and the server config of loaded model.

Recovery of saved models will fail when the file is saved with different version of Jubatus or loaded environment's config file is different from saved environment's one.
