Building Jubatus from Source
============================

Jubatus をソースからビルドすることは可能ですが、できる限りバイナリパッケージ (:doc:`quickstart` 参照) を使用することを推奨します。
ソースからビルドする場合は、 `jubatus-installer <https://github.com/jubatus/jubatus-installer>`_ が参考になるでしょう。

.. _requirements:

Requirements
------------

Jubatus をソースからビルドするには、 ``gcc`` (バージョン 4.4 以降), ``pkg-config`` (バージョン 0.26 以降) および ``python`` (バージョン 2.6 以降,  ``waf`` で使用される) が必要です。
加えて、以下のライブラリも必要になります。
サポートされているライブラリのバージョンについては `Jubatus Wiki <https://github.com/jubatus/jubatus/wiki/Supported-Library-Versions>`_ をご覧ください。

=================== ========== ========= ======================================================
ソフトウェア        バージョン 必須      備考
=================== ========== ========= ======================================================
msgpack             >= 0.5.7   ✔
jubatus-mpio        0.4.1      ✔
jubatus-msgpack-rpc 0.4.1      ✔         C++ クライアントライブラリが必要である。
pficommon           master     ✔         msgpack-rpc (mprpc) が有効であること。
google-glog         >= 0.3.2   ✔
mecab               >= 0.99              ``--enable-mecab`` ありでビルドする場合のみ。
re2                 master               ``--disable-re2`` *なし* でビルドする場合のみ。
ux-trie             master               ``--enable-ux`` ありでビルドする場合のみ。
zookeeper           >= 3.3               ``--enable-zookeeper`` ありでビルドする場合のみ。
                                         C クライアントライブラリが必要である。
=================== ========== ========= ======================================================

お使いのディストリビューションによっては、一部のライブラリがバイナリパッケージとして提供されている場合もあります。
バイナリパッケージが利用できない場合は、これらのライブラリもソースからビルドする必要があります。以下の各サイトからダウンロードできます (
`msgpack <http://msgpack.org/>`_,
`jubatus-mpio <https://github.com/jubatus/jubatus-mpio>`_,
`jubatus-msgpack-rpc <https://github.com/jubatus/jubatus-msgpack-rpc>`_,
`pficommon <https://github.com/pfi/pficommon>`_,
`google-glog <http://code.google.com/p/google-glog/>`_,
`mecab <http://code.google.com/p/mecab/>`_,
`re2 <http://code.google.com/p/re2/>`_,
`ux-trie <http://code.google.com/p/ux-trie/>`_,
`zookeeper <http://zookeeper.apache.org/>`_
)。

Ubuntu 12.04
~~~~~~~~~~~~

Ubuntu 12.04 でのビルドを行う例です。

::

  $ sudo apt-get install build-essential git-core pkg-config

  $ sudo apt-get install libmsgpack-dev

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

  $ wget -O pficommon-master.tar.gz https://github.com/pfi/pficommon/archive/master.tar.gz
  $ tar xzf pficommon-master.tar.gz
  $ cd pficommon-master
  $ ./waf configure
    -> msgpack-rpc サポートが有効になっていることを確認してください ("MessagePack RPC module: yes")
  $ ./waf build
  $ sudo ./waf install
  $ cd ..

  $ wget http://google-glog.googlecode.com/files/glog-0.3.2.tar.gz
  $ tar xzf glog-0.3.2.tar.gz
  $ cd glog-0.3.2
  $ ./configure
  $ make
  $ sudo make install
  $ cd ..

Jubatus のビルドを行います。

::

  $ wget -O jubatus-master.tar.gz https://github.com/jubatus/jubatus/archive/master.tar.gz
  $ tar xzf jubatus-master.tar.gz
  $ cd jubatus-master
  $ ./waf configure --disable-re2
  $ ./waf build
  $ sudo ./waf install
  $ sudo ldconfig

この例は最小限の設定でビルドしているため (どのようなオプションが利用可能かは ``./waf configure --help`` をご覧ください)、分散モードや特徴抽出プラグインなど一部の機能は利用できません。

Other Environments
~~~~~~~~~~~~~~~~~~

- Mac OS X では llvm-gcc でビルドすることでスタンドアローンモードで動作しています (c.f., `Homebrew formula <https://github.com/jubatus/jubatus/tree/master/tools/packaging/homebrew>`_)。
- Debian/GNU Linux では動作しています。
- Arch Linux ではスタンドアローンモードで動作しています。
- FreeBSD では動作していません。pficommon を修正する必要があります。
- 他の \*BSD systems や Solarisでの動作報告をお待ちしています。
