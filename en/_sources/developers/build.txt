Building Jubatus from Source
============================

We recommend using binary packages (see :doc:`../quickstart`) whenever possible, but you can of course build Jubatus from source.
`jubatus-installer <https://github.com/jubatus/jubatus-installer>`_ may help your installation from source.

.. _requirements:

Requirements
------------

You need ``gcc`` (version 4.4 or later), ``pkg-config`` (version 0.26 or later) and ``python`` (version 2.4 or later, used in ``waf``) to build Jubatus from source.
In addition, following libraries are required.
For supported version of libraries, refer to the `Jubatus Wiki <https://github.com/jubatus/jubatus/wiki/Supported-Library-Versions>`_.

=================== ============== ========= ======================================================
Software            Version        Mandatory Note
=================== ============== ========= ======================================================
jubatus_core        master         ✔
oniguruma           >= 5.9         [1]_      Required by jubatus_core.
re2                 master         [1]_      Required by jubatus_core when configuring with ``--regexp-library=re2``.
msgpack             >= 0.5.7 [2]_  ✔         Required by jubatus_core and jubatus.
jubatus-mpio        0.4.5          ✔
jubatus-msgpack-rpc 0.4.4          ✔         C++ client library must be installed.
log4cxx             >= 0.10.0      ✔
mecab               >= 0.99                  Required when configured with ``--enable-mecab``.
ux-trie             master                   Required when configured with ``--enable-ux``.
opencv              >= 2.0.0       [3]_      Required when configured with  ``--enable-opencv``.
python              >= 2.6                   Required when configured with ``--enable-python-bridge`` or ``--enable-python3-bridge``.
zookeeper           >= 3.3                   Required when configured with ``--enable-zookeeper``.
                                             C client library must be installed.
=================== ============== ========= ======================================================

.. [1] By default, oniguruma is used by jubatus_core as a regexp library (``--regexp-library=oniguruma``).
       You can completely disable regexp feature by configuring jubatus_core with ``--regexp-library=none``.
.. [2] MessagePack 1.x series are not supported yet.
.. [3] ``ORB`` algorithm is not available if opencv <= 2.2.0.

Depending on your distribution, some libraries may be available as a binary package.
When binary packages are not available, you also need to build these libraries from source; download them from each website (
`oniguruma <https://github.com/kkos/oniguruma>`_,
`re2 <https://github.com/google/re2>`_,
`msgpack <http://msgpack.org/>`_,
`jubatus-mpio <https://github.com/jubatus/jubatus-mpio>`_,
`jubatus-msgpack-rpc <https://github.com/jubatus/jubatus-msgpack-rpc>`_,
`log4cxx <http://logging.apache.org/log4cxx/>`_,
`mecab <https://github.com/taku910/mecab>`_,
`ux-trie <https://github.com/hillbig/ux-trie>`_,
`opencv <http://opencv.org/>`_,
`python <https://www.python.org/>`_,
`zookeeper <http://zookeeper.apache.org/>`_
).

Ubuntu 12.04
~~~~~~~~~~~~

Here's an example on Ubuntu 12.04 systems.

::

  $ sudo apt-get install build-essential git-core pkg-config

  $ sudo apt-get install libmsgpack-dev libonig-dev liblog4cxx10-dev

  $ wget http://download.jubat.us/files/source/jubatus_mpio/jubatus_mpio-0.4.1.tar.gz
  $ tar xzf jubatus_mpio-0.4.1.tar.gz
  $ cd jubatus_mpio-0.4.1
  $ ./configure
  $ make
  $ sudo make install
  $ cd ..

  $ wget http://download.jubat.us/files/source/jubatus_msgpack-rpc/jubatus_msgpack-rpc-0.4.1.tar.gz
  $ tar xzf jubatus_msgpack-rpc-0.4.1.tar.gz
  $ cd jubatus_msgpack-rpc-0.4.1
  $ ./configure
  $ make
  $ sudo make install
  $ cd ..

Now build Jubatus.

::

  $ wget -O jubatus_core.tar.gz https://github.com/jubatus/jubatus_core/archive/master.tar.gz
  $ tar xzf jubatus_core.tar.gz
  $ cd jubatus_core-master
  $ ./waf configure
  $ ./waf build
  $ sudo ./waf install
  $ sudo ldconfig

  $ wget -O jubatus-master.tar.gz https://github.com/jubatus/jubatus/archive/master.tar.gz
  $ tar xzf jubatus-master.tar.gz
  $ cd jubatus-master
  $ ./waf configure
  $ ./waf build
  $ sudo ./waf install
  $ sudo ldconfig

As this is a minimal configuration (see ``./waf configure --help`` for other configuration options available), some features like distributed mode and feature extraction plugins are not available.

``waf`` command requires ``python`` command.
If you are building Jubatus on platform that does not provide ``python`` command (like Ubuntu 16.04), run ``sudo apt-get install python2.7`` to install ``python``, or try running ``waf`` via ``python3`` (e.g., ``python3 ./waf configure``).

Mac OS X
~~~~~~~~

We experimentally support building and running standalone mode on Mac OS X.

You can use `Homebrew tap repository <https://github.com/jubatus/homebrew-jubatus>`_ for quick installation.

Other Environments
~~~~~~~~~~~~~~~~~~

- Debian GNU/Linux runs all mode.
- Arch Linux runs standalone mode.
- We are waiting for report in other \*BSD systems and in Solaris.
