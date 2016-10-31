Jubatus をソースからビルドする
================================

Jubatus をソースからビルドすることは可能ですが、できる限りバイナリパッケージ (:doc:`../quickstart` 参照) を使用することを推奨します。
ソースからビルドする場合は、 `jubatus-installer <https://github.com/jubatus/jubatus-installer>`_ が参考になるでしょう。

.. _requirements:

要件
------------

Jubatus をソースからビルドするには、 ``gcc`` (バージョン 4.4 以降), ``pkg-config`` (バージョン 0.26 以降) および ``python`` (バージョン 2.4 以降,  ``waf`` で使用される) が必要です。
加えて、以下のライブラリも必要になります。
サポートされているライブラリのバージョンについては `Jubatus Wiki <https://github.com/jubatus/jubatus/wiki/Supported-Library-Versions>`_ をご覧ください。

=================== ============== ========= ======================================================
ソフトウェア        バージョン     必須      備考
=================== ============== ========= ======================================================
jubatus_core        master         ✔
oniguruma           >= 5.9         [1]_      jubatus_core に必要。
re2                 master         [1]_      jubatus_core に必要 (``--regexp-library=re2`` ありでビルドする場合のみ)
msgpack             >= 0.5.7 [2]_  ✔         jubatus_core および jubatus に必要。
jubatus-mpio        0.4.5          ✔
jubatus-msgpack-rpc 0.4.4          ✔         C++ クライアントライブラリが必要である。
log4cxx             >= 0.10.0      ✔
mecab               >= 0.99                  ``--enable-mecab`` ありでビルドする場合のみ。
ux-trie             master                   ``--enable-ux`` ありでビルドする場合のみ。
opencv              >= 2.3.0                 ``--enable-opencv`` ありでビルドする場合のみ。
zookeeper           >= 3.3                   ``--enable-zookeeper`` ありでビルドする場合のみ。
                                             C クライアントライブラリが必要である。
=================== ============== ========= ======================================================

.. [1] デフォルトでは oniguruma が jubatus_core の正規表現ライブラリとして使用されます (``--regexp-library=oniguruma``)。
       jubatus_core のビルド時に ``--regexp-library=none`` を指定することで正規表現機能を完全に無効にすることができます。
.. [2] MessagePack 1.x 系はサポートされていません。

お使いのディストリビューションによっては、一部のライブラリがバイナリパッケージとして提供されている場合もあります。
バイナリパッケージが利用できない場合は、これらのライブラリもソースからビルドする必要があります。以下の各サイトからダウンロードできます (
`oniguruma <https://github.com/kkos/oniguruma>`_,
`re2 <https://github.com/google/re2>`_,
`msgpack <http://msgpack.org/>`_,
`jubatus-mpio <https://github.com/jubatus/jubatus-mpio>`_,
`jubatus-msgpack-rpc <https://github.com/jubatus/jubatus-msgpack-rpc>`_,
`log4cxx <http://logging.apache.org/log4cxx/>`_,
`mecab <https://github.com/taku910/mecab>`_,
`ux-trie <https://github.com/hillbig/ux-trie>`_,
`opencv <http://opencv.org/>`_,
`zookeeper <http://zookeeper.apache.org/>`_
)。

Ubuntu 12.04
~~~~~~~~~~~~

Ubuntu 12.04 でのビルドを行う例です。

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

Jubatus のビルドを行います。

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
