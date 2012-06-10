QuickStart
==========

For prerequisites, Jubatus requires `MessagePack <http://msgpack.org>`_ , `pficommon <http://pfi.github.com/pficommon>`_ , libevent-dev  and google-glog for minimal installation. For example in Ubuntu Server 12.04 LTS,

::

  $ sudo aptitude install libmsgpack-dev libevent-dev
  $ wget http://google-glog.googlecode.com/files/glog-0.3.2.tar.gz
  $ cd glog-0.3.2
  $ ./configure; make; make install
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


To start default classifier server in standalone mode,

::

  $ jubaclassifier

Thus classifier server started listening port 9919.
To start default regression server,

::

  $ jubaregression

To start recommender server, just run

::

  $ jubarecommender

C++ client
----------

Now C++ users can write their own client.
By including header,


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


Non-C++ users have to generate client library by using msgpack-idl.
See client generation (TODO: link).
