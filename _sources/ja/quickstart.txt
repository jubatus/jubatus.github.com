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
