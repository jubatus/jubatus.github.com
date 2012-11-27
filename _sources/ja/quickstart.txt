Download Jubatus
================

latest jubatus release
-----------------------
jubatus の最新バージョンは |release| です。Jubatus は LGPL v2.1 の下に配布されています。


`Download <https://github.com/jubatus/jubatus/zipball/master>`_

or

::

  $ git clone git://github.com/jubatus/jubatus.git

Jubatus のクライアントは全て MIT License の下に配布されています。

`Download clients <https://github.com/downloads/jubatus/jubatus/jubatus_client.0.3.2.2012-10-05.tar.gz>`_

QuickStart
==========

Jubatus は、最小限のインストールを行うために、 `MessagePack <http://msgpack.org>`_ , `pficommon <http://pfi.github.com/pficommon>`_ , libevent-dev, google-glog が必要です。例えば Ubuntu Server 12.04 LTS では、

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
  (ensure that pficommon is installed with msgpack enbabled)
  $ ./waf build
  $ sudo ./waf install

Minimal install
---------------

::

  $ git clone git://github.com/jubatus/jubatus.git
  $ cd jubatus
  $ ./waf configure --disable-re2
  $ ./waf build
  # ./waf install

Apt Repository
--------------

Ubuntu / Debian システム (x86_64) では、Apt リポジトリからインストールを行うことができます。

以下の内容で `/etc/apt/sources.list.d/jubatus.list` というファイルを作成すると、Jubatus Apt リポジトリがシステムに登録されます。

::

  deb http://download.jubat.us/apt binary/

Jubatus をインストールします。

::

  $ sudo apt-get update
  $ sudo apt-get install jubatus

現在配布しているパッケージは GPG 署名が行われていないません。
警告が表示された場合は、 `y` を入力してください:

::

  Install these packages without verification [y/N]? y

これで Jubatus が `/opt/jubatus` にインストールされました。
Jubatus を使い始める前に、環境変数を `profile` スクリプトから読み込んでください。

::

  $ source /opt/jubatus/profile

csh または tcsh をお使いの場合はこちらをご利用ください:

::

  $ source /opt/jubatus/profile.csh

Yum Repository for RHEL 6
-------------------------

Red Hat Enterprise Linux 6 (x86_64) およびクローンでは、Yum リポジトリからインストールを行うことができます。

::

  $ sudo rpm -Uvh http://download.jubat.us/yum/rhel/6/stable/x86_64/jubatus-release-6-1.el6.x86_64.rpm
  $ sudo yum install jubatus


Running servers
---------------

classifier を標準の設定でスタンドアローンモードで起動するには、

::

  $ jubaclassifier

これによりclassifierサーバは9199ポートで起動しました。

regression を標準の設定でスタンドアローンモードで起動するには、

::

  $ jubaregression

recommender を標準の設定でスタンドアローンモードで起動するには、

::

  $ jubarecommender

graph を標準の設定でスタンドアローンモードで起動するには、

::

  $ jubagraph

クライアントを利用して、実際の処理を行うには :doc:`tutorial` を参照して下さい。

C++ client
----------

C++を利用してクライアントを使うためには、ヘッダーをインクルードして以下のように書きます。

.. code-block:: cpp

  #include <jubatus/client/classifier_client.hpp>
  using namespace jubatus;
  using namespace jubatus::client;

  void foo(){
    classifier cli("localhost", 9199, 3.0);
    config_data c;
    c.method = "PA";
    cli.set_config("", c);

    // ...
  }


それ以外の言語では、msgpack-idl を利用して生成されたクライアントを使います。
クライアント生成方法は :doc:`howtogetclients` を参照して下さい。

Other clients
-------------

これらのクライアントは、MIT License の下に配布されています。

Python
~~~~~~

::

  $ pip install jubatus

Ruby
~~~~

::

  $ gem install jubatus

Java
~~~~

Maven を利用している場合、pom.xml に以下を追加します。

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
       <version>x.x.x</version>
     </dependency>
   </dependencies>

.. _requirements:

Detailed System Requirements
----------------------------

Jubatus は、公式には 64bitカーネル で動作する Ubuntu LTS 12.04 と Red Hat Enterprise Linux 6.2 をサポートしています。
開発チームは、x64アーキテクチャのマシンを利用しています。この他の依存ライブラリは以下のとおりです。

============ ========== ========================
software     version    misc
============ ========== ========================
gcc          >= 4.4

libevent     >= 1.4

google-glog  >= 3.2

python       >= 2.6     WAFで利用

msgpack      >= 0.5.7

pficommon    >= 1.3.1.0 msgpackが有効

pkg-config   >= 0.26

mecab        >= 0.99    optional

re2          -          optional

ux-trie      -          optional

zookeeper    >= 3.4     optional
============ ========== ========================

その他の環境
~~~~~~~~~~~~~~~~~~

- MacOSX では llvm-gcc を使ってスタンドアローンモードで動作しています。しかし一部のコンパイラでは動作していません。
- Debian/GNU Linux は動作しています。
- Arch Linux スタンドアローンモードで動作しています。
- FreeBSD は動作していません。pficommon を修正する必要があります。
- CentOS 5.x はやめておいたほうがいいです。
- CentOS 6.x のことはよく分かりません。
- 他の *BSD systems や Solarisでの動作報告をお待ちしています。

