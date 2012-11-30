Building Jubatus from Source
============================

We recommend using binary packages (see :doc:`quickstart`) whenever possible, but you can of course build Jubatus from source.
`jubatus-installer <https://github.com/odasatoshi/jubatus-installer>`_ may help your installation from source.

.. _requirements:

Requirements
------------

You need ``gcc`` (version 4.4 or later), ``pkg-config`` (version 0.26 or later) and ``python`` (version 2.6 or later, used in ``waf``) to build Jubatus from source.
In addition, following libraries are required.

============ ========== =========  ======================================================
Software     Version    Mandatory  Note
============ ========== =========  ======================================================
msgpack      >= 0.5.7   ✔
pficommon    master     ✔          Must be msgpack enabled.
libevent     >= 1.4     ✔
google-glog  >= 3.2     ✔
mecab        >= 0.99               Required when configured with ``--enable-mecab``.
re2          -                     Required when configured *without* ``--disable-re2``
ux-trie      -                     Required when configured with ``--enable-ux``.
zookeeper    >= 3.3                Required when configured with ``--enable-zookeeper``.
                                   C client libraries must be installed.
============ ========== =========  ======================================================

Depending on your distribution, some libraries may be available as a binary package.
When binary packages are not available, you also need to build these libraries from source; download them from each website (
`msgpack <http://msgpack.org/>`_,
`pficommon <https://github.com/pfi/pficommon>`_,
`libevent <http://libevent.org/>`_,
`google-glog <http://code.google.com/p/google-glog/>`_,
`mecab <http://code.google.com/p/mecab/>`_,
`re2 <http://code.google.com/p/re2/>`_,
`ux-trie <http://code.google.com/p/ux-trie/>`_,
`zookeeper <http://zookeeper.apache.org/>`_
).

Ubuntu 12.04
~~~~~~~~~~~~

Here's an example on Ubuntu 12.04 systems.

::

  $ sudo aptitude install build-essential git-core
  $ sudo aptitude install libmsgpack-dev libevent-dev
  $ wget http://google-glog.googlecode.com/files/glog-0.3.2.tar.gz
  $ cd glog-0.3.2
  $ ./configure; make
  $ sudo make install
  $ cd ..
  $ git clone https://github.com/pfi/pficommon.git
  $ cd pficommon
  $ ./waf configure
  (ensure that pficommon is configured with msgpack enbabled)
  $ ./waf build
  $ sudo ./waf install

Now build Jubatus.

::

  $ git clone https://github.com/jubatus/jubatus.git
  $ cd jubatus
  $ ./waf configure --disable-re2
  $ ./waf build
  $ sudo ./waf install

As this is a minimal configuration (see ``./waf configure --help`` for other configuration options available), some features like clustering and feature extraction plugins are not available.

Other Environments
~~~~~~~~~~~~~~~~~~

- Mac OS X runs standalone mode by using llvm-gcc (c.f., `Homebrew formula <https://github.com/jubatus/jubatus/tree/master/tools/packaging/homebrew>`_).
- Debian/GNU Linux runs all mode.
- Arch Linux runs standalone mode.
- FreeBSD does not run, needs some fixed on pficommon.
- We are waiting for report in other \*BSD systems and in Solaris.
