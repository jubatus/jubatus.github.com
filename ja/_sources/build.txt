Jubatus をソースからビルドする
================================

Jubatus をソースからビルドすることは可能ですが、できる限りバイナリパッケージ (:doc:`quickstart` 参照) を使用することを推奨します。
ソースからビルドする場合は、 `jubatus-installer <https://github.com/jubatus/jubatus-installer>`_ が参考になるでしょう。

.. _requirements:

要件
------------

Jubatus をソースからビルドするには、 ``gcc`` (バージョン 4.4 以降), ``pkg-config`` (バージョン 0.26 以降) および ``python`` (バージョン 2.4 以降,  ``waf`` で使用される) が必要です。
加えて、以下のライブラリも必要になります。
サポートされているライブラリのバージョンについては `Jubatus Wiki <https://github.com/jubatus/jubatus/wiki/Supported-Library-Versions>`_ をご覧ください。

=================== ========== ========= ======================================================
ソフトウェア        バージョン 必須      備考
=================== ========== ========= ======================================================
msgpack             >= 0.5.7   ✔
jubatus-mpio        0.4.1      ✔
jubatus-msgpack-rpc 0.4.1      ✔         C++ クライアントライブラリが必要である。
google-glog         >= 0.3.3   ✔
oniguruma           >= 5.9     [1]_
re2                 master     [1]_      ``--enable-re2`` ありでビルドする場合のみ。
mecab               >= 0.99              ``--enable-mecab`` ありでビルドする場合のみ。
ux-trie             master               ``--enable-ux`` ありでビルドする場合のみ。
zookeeper           >= 3.3               ``--enable-zookeeper`` ありでビルドする場合のみ。
                                         C クライアントライブラリが必要である。
=================== ========== ========= ======================================================

.. [1] 正規表現ライブラリとして、oniguruma または re2 のいずれかが必須です。
       ビルド時に ``--enable-re2`` が指定されない限り、oniguruma が使用されます。

お使いのディストリビューションによっては、一部のライブラリがバイナリパッケージとして提供されている場合もあります。
バイナリパッケージが利用できない場合は、これらのライブラリもソースからビルドする必要があります。以下の各サイトからダウンロードできます (
`msgpack <http://msgpack.org/>`_,
`jubatus-mpio <https://github.com/jubatus/jubatus-mpio>`_,
`jubatus-msgpack-rpc <https://github.com/jubatus/jubatus-msgpack-rpc>`_,
`google-glog <http://code.google.com/p/google-glog/>`_,
`oniguruma <http://www.geocities.jp/kosako3/oniguruma/index_ja.html>`_,
`re2 <http://code.google.com/p/re2/>`_,
`mecab <http://code.google.com/p/mecab/>`_,
`ux-trie <http://code.google.com/p/ux-trie/>`_,
`zookeeper <http://zookeeper.apache.org/>`_
)。

Ubuntu 12.04
~~~~~~~~~~~~

Ubuntu 12.04 でのビルドを行う例です。

::

  $ sudo apt-get install build-essential git-core pkg-config

  $ sudo apt-get install libmsgpack-dev libonig-dev

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

  $ wget http://google-glog.googlecode.com/files/glog-0.3.3.tar.gz
  $ tar xzf glog-0.3.3.tar.gz
  $ cd glog-0.3.3
  $ ./configure
  $ make
  $ sudo make install
  $ cd ..

Jubatus のビルドを行います。

::

  $ wget -O jubatus-master.tar.gz https://github.com/jubatus/jubatus/archive/master.tar.gz
  $ tar xzf jubatus-master.tar.gz
  $ cd jubatus-master
  $ ./waf configure
  $ ./waf build
  $ sudo ./waf install
  $ sudo ldconfig

この例は最小限の設定でビルドしているため (どのようなオプションが利用可能かは ``./waf configure --help`` をご覧ください)、分散モードや特徴抽出プラグインなど一部の機能は利用できません。

Mac OS X
~~~~~~~~

Mac OS X では、スタンドアロンモードのビルドと実行が試験的にサポートされています。

`Homebrew tap リポジトリ <https://github.com/jubatus/homebrew-jubatus>`_ を使用すると簡単にインストールすることができます。

その他の環境
~~~~~~~~~~~~~~~~~~

- Debian GNU/Linux では動作しています。
- Arch Linux ではスタンドアローンモードで動作しています。
- 他の \*BSD systems や Solarisでの動作報告をお待ちしています。
