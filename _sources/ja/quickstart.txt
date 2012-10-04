Download Jubatus
================

latest jubatus release
-----------------------
jubatus の最新バージョンは 0.3.2です.　Jubatusは LGPL v2.1の元に配布されています。


`Download <https://github.com/jubatus/jubatus/zipball/master>`_

or

::

  $ git clone git://github.com/jubatus/jubatus.git

Jubatus のクライアントは すべて MIT License のもとに配布されています.

`Download clients <https://github.com/downloads/jubatus/jubatus/jubatus_client.0.3.1.2012-07-20.tar.gz>`_
 
QuickStart
==========

Jubatusは、最小限のインストールを行うために、 `MessagePack <http://msgpack.org>`_ , `pficommon <http://pfi.github.com/pficommon>`_ , libevent-dev  and google-glog が必要です。例えば Ubuntu Server 12.04 LTS では、

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

Yum Repository for RHEL 6
-------------------------

Red Hat Enterprise Linux 6 (x86_64) およびクローンでは、Yum リポジトリからインストールを行うことができます。

::

  $ sudo rpm -Uvh http://download.jubat.us/yum/rhel/6/stable/x86_64/jubatus-release-6-1.el6.x86_64.rpm
  $ sudo yum install jubatus


Running servers
---------------

classifierを標準の設定でスタンドアローンモードで起動するには、

::

  $ jubaclassifier

これによりclassifierサーバは9199ポートで起動しました。

regressionを標準の設定でスタンドアローンモードで起動するには、

::

  $ jubaregression

recommenderを標準の設定でスタンドアローンモードで起動するには、

::

  $ jubarecommender

graphを標準の設定でスタンドアローンモードで起動するには、

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


それ以外の言語では、msgpack-idlを利用して生成されたクライアントを使います。

Other clients
-------------

これらのクライアントは、MIT Licenseの下に配布されています。

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

Maven を利用している場合、pom.xmlに以下を追加します。

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

Jubatusは、公式には64bitカーネルで動作するUbuntu LTS 12.04とRedhat Enterprise Linux 6.2をサポートしています。
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

mecab        >= 0.98    optional

re2          -          optional

ux-trie      -          optional

zookeeper    >= 3.4     optional
============ ========== ========================

その他の環境
~~~~~~~~~~~~~~~~~~

- MacOSX ではllvm-gcc を使ってスタンドアローンモードで動作しています。しかし一部のコンパイラでは動作していません。
- Debian/GNU Linux は動作しています。
- Arch Linux スタンドアローンモードで動作しています。
- FreeBSD は動作していません。pficommon を修正する必要があります。
- CentOS 5.x はやめておいたほうがいいです。
- CentOS 6.x のことはよく分かりません。
- 他の *BSD systems や Solarisでの動作報告をお待ちしています。

