
Quick Start
===========


Install Jubatus
---------------

Ubuntu Server 12.04 LTS (x86_64) と Red Hat Enterprise Linux 6.2 (x86_64) が公式にサポートされています。

これらのシステムでは、Jubatus のすべてのコンポーネントをバイナリパッケージでインストールすることができます。
その他のシステムでのインストールについては :ref:`build_from_source-ja` を参照してください。

Yum Repository (RHEL)
~~~~~~~~~~~~~~~~~~~~~

以下のコマンドを実行して、Jubatus の Yum リポジトリをシステムに登録します。

::

  $ sudo rpm -Uvh http://download.jubat.us/yum/rhel/6/stable/x86_64/jubatus-release-6-1.el6.x86_64.rpm

``jubatus`` と ``jubatus-client`` のパッケージをインストールします。

::

  $ sudo yum install jubatus jubatus-client

Apt Repository (Ubuntu)
~~~~~~~~~~~~~~~~~~~~~~~

以下の行を ``/etc/apt/sources.list.d/jubatus.list`` に記述して、Jubatus の Apt リポジトリをシステムに登録します。

::

  deb http://download.jubat.us/apt binary/

``jubatus`` のパッケージをインストールします。

::

  $ sudo apt-get update
  $ sudo apt-get install jubatus

現在、パッケージには GPG 署名が行われていません。
以下の警告メッセージが表示された場合は、 ``y`` を入力してください。

::

  Install these packages without verification [y/N]? y

これで、Jubatus が ``/opt/jubatus`` にインストールされました。

Jubatus を使う前に、毎回 ``profile`` スクリプトから環境変数を読み込む必要があります。

::

  $ source /opt/jubatus/profile

csh または tcsh をお使いの場合は、こちらを使用してください。

::

  $ source /opt/jubatus/profile.csh


Install Jubatus Client Libraries
--------------------------------

Jubatus を使ったクライアントアプリケーションは C++, Python, Ruby または Java で記述することができます。
クライアントアプリケーションから Jubatus を使うには、各言語のクライアントライブラリをインストールする必要があります。
クライアントライブラリは MIT License の下で配布されています。

:doc:`tutorial` を試す場合は、Python クライアントだけをインストールすれば十分です。

Jubatus と Jubatus クライアントのバージョンは異なることがあります。これは、Jubatus の API が変更されない場合はクライアント側のアップデートが不要なためです。

パッケージ管理システムを使わずに Jubatus クライアントを使用したい場合は、 `GitHub の Downloads セクション <https://github.com/jubatus/jubatus/downloads>`_ から tarball をダウンロードすることができます。

C++
~~~

クライアントは Jubatus フレームワークに含まれている (``$PREFIX/include/jubatus/client/*_client.hpp``) ため、インストールは不要です。

コンパイラや開発用のヘッダがインストールされていない場合は、以下の手順でセットアップを行ってください。
RHEL では、以下のコマンドを実行します。

::

  $ sudo yum groupinstall "Development tools" "Additional Development"

Ubuntu では、以下のコマンドを実行します。

::

  $ sudo apt-get install build-essential

Python
~~~~~~

クライアント (Python 2.7 以降が必要) は `PyPI <http://pypi.python.org/pypi/jubatus>`_ で配布されています。

::

  $ sudo pip install jubatus
  $ sudo pip install msgpack-rpc-python

``pip`` コマンドがインストールされていない場合は、以下の手順でインストールしてください。

::

  $ wget http://peak.telecommunity.com/dist/ez_setup.py
  $ sudo python ez_setup.py
  $ sudo easy_install pip

Ruby
~~~~

クライアントは `RubyGems <http://rubygems.org/gems/jubatus>`_ で配布されています。

::

  $ sudo gem install jubatus

Java
~~~~

クライアントは Jubatus の Maven リポジトリで配布されています。
以下の記述をあなたのプロジェクトの ``pom.xml`` に追加してください。

.. code-block:: xml

   <repositories>
     <repository>
       <id>jubat.us</id>
       <name>Jubatus Repository for Maven</name>
       <url>http://download.jubat.us/maven</url>
     </repository>
   </repositories>

   <dependencies>
     <dependency>
       <groupId>us.jubat</groupId>
       <artifactId>jubatus</artifactId>
       <version>0.3.2</version>
     </dependency>
   </dependencies>


Try Tutorial
------------

:doc:`tutorial` を試してみましょう (Python クライアントが必要です)。


Write Your Application
----------------------

おめでとうございます!
これで、Jubatus を使ってあなた独自のアプリケーションを書く準備ができました。
Jubatus がどのような機能を持っているか知るには、 :doc:`api` をチェックしてください。

C++ または Java でクライアントを開発する場合は、以下のスケルトンプロジェクトを使用すると便利です。

  - `C++ クライアント開発用スケルトン <https://github.com/jubatus/jubatus-cpp-skelton>`_
  - `Java クライアント開発用スケルトン <https://github.com/jubatus/jubatus-java-skelton>`_ (Eclipse プロジェクトのテンプレート)

Python をお使いの方は、 `チュートリアルのリポジトリ <https://github.com/jubatus/jubatus-tutorial-python>`_ をご覧ください。


.. _build_from_source-ja:

Building Jubatus from Source
============================

Jubatus をソースからビルドすることは可能ですが、できる限りバイナリパッケージを使用することを推奨します。
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
mecab        >= 0.99              ``--enable-mecab`` ありでビルドされた場合のみ。
re2          -                    ``--disable-re2`` *なし* でビルドされた場合のみ。
ux-trie      -                    ``--enable-ux`` ありでビルドされた場合のみ。
zookeeper    >= 3.3               ``--enable-zookeeper`` ありでビルドされた場合のみ。
                                  C クライアントライブラリが必要です。
============ ========== ======== ======================================================

お使いのディストリビューションによっては、一部のライブラリがバイナリパッケージとして提供されている場合もあります。
バイナリパッケージが利用できない場合は、これらのライブラリもソースからビルドする必要があります。以下の各サイトからダウンロードできます:
`msgpack <http://msgpack.org/>`_,
`pficommon <https://github.com/pfi/pficommon>`_,
`libevent <http://libevent.org/>`_,
`google-glog <http://code.google.com/p/google-glog/>`_,
`mecab <http://code.google.com/p/mecab/>`_,
`re2 <http://code.google.com/p/re2/>`_,
`ux-trie <http://code.google.com/p/ux-trie/>`_,
`zookeeper <http://zookeeper.apache.org/>`_.

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
  $ git clone git://github.com/pfi/pficommon.git
  $ cd pficommon
  $ ./waf configure
  (ensure that pficommon is configured with msgpack enbabled)
  $ ./waf build
  $ sudo ./waf install

Jubatus のビルドを行います。

::

  $ git clone git://github.com/jubatus/jubatus.git
  $ cd jubatus
  $ ./waf configure --disable-re2
  $ ./waf build
  $ sudo ./waf install

この例は最小限の設定でビルドしているため (どのようなオプションが利用可能かは ``./waf configure --help`` をご覧ください)、クラスタリングや特徴抽出プラグインなど一部の機能は利用できません。

Other Environments
~~~~~~~~~~~~~~~~~~

- Mac OS X では llvm-gcc でビルドすることでスタンドアローンモードで動作しています。
- Debian/GNU Linux では動作しています。
- Arch Linux ではスタンドアローンモードで動作しています。
- FreeBSD では動作していません。pficommon を修正する必要があります。
- 他の \*BSD systems や Solarisでの動作報告をお待ちしています。
