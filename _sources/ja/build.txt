Building Jubatus from Source
============================

Jubatus をソースからビルドすることは可能ですが、できる限りバイナリパッケージ (:doc:`quickstart` 参照) を使用することを推奨します。
ソースからビルドする場合は、 `jubatus-installer <https://github.com/odasatoshi/jubatus-installer>`_ が参考になるでしょう。

.. _requirements-ja:

Requirements
------------

Jubatus をソースからビルドするには、 ``gcc`` (バージョン 4.4 以降), ``pkg-config`` (バージョン 0.26 以降) および ``python`` (バージョン 2.6 以降,  ``waf`` で使用される) が必要です。
加えて、以下のライブラリも必要になります。

============ ========== ======== ======================================================
ソフトウェア バージョン 必須     備考
============ ========== ======== ======================================================
msgpack      >= 0.5.7   ✔
pficommon    master     ✔         msgpack が有効であること。
libevent     >= 1.4     ✔
google-glog  >= 3.2     ✔
mecab        >= 0.99              ``--enable-mecab`` ありでビルドする場合のみ。
re2          -                    ``--disable-re2`` *なし* でビルドする場合のみ。
ux-trie      -                    ``--enable-ux`` ありでビルドする場合のみ。
zookeeper    >= 3.3               ``--enable-zookeeper`` ありでビルドする場合のみ。
                                  C クライアントライブラリが必要です。
============ ========== ======== ======================================================

お使いのディストリビューションによっては、一部のライブラリがバイナリパッケージとして提供されている場合もあります。
バイナリパッケージが利用できない場合は、これらのライブラリもソースからビルドする必要があります。以下の各サイトからダウンロードできます (
`msgpack <http://msgpack.org/>`_,
`pficommon <https://github.com/pfi/pficommon>`_,
`libevent <http://libevent.org/>`_,
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

Jubatus のビルドを行います。

::

  $ git clone https://github.com/jubatus/jubatus.git
  $ cd jubatus
  $ ./waf configure --disable-re2
  $ ./waf build
  $ sudo ./waf install

この例は最小限の設定でビルドしているため (どのようなオプションが利用可能かは ``./waf configure --help`` をご覧ください)、クラスタリングや特徴抽出プラグインなど一部の機能は利用できません。

Other Environments
~~~~~~~~~~~~~~~~~~

- Mac OS X では llvm-gcc でビルドすることでスタンドアローンモードで動作しています (c.f., `Homebrew formula <https://github.com/jubatus/jubatus/tree/master/tools/packaging/homebrew>`_)。
- Debian/GNU Linux では動作しています。
- Arch Linux ではスタンドアローンモードで動作しています。
- FreeBSD では動作していません。pficommon を修正する必要があります。
- 他の \*BSD systems や Solarisでの動作報告をお待ちしています。
