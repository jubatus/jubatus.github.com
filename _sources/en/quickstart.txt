Download Jubatus
================

latest jubatus release
-----------------------
The current version of jubatus is 0.3.4. Jubatus is distributed under LGPL v2.1.


`Download <https://github.com/jubatus/jubatus/zipball/master>`_

or

::

  $ git clone git://github.com/jubatus/jubatus.git

Jubatus clients are distributed under MIT License.

`Download clients <https://github.com/downloads/jubatus/jubatus/jubatus_client.0.3.2.2012-10-05.tar.gz>`_
 
QuickStart
==========

For prerequisites, Jubatus requires `MessagePack <http://msgpack.org>`_ , `pficommon <http://pfi.github.com/pficommon>`_ , libevent-dev and google-glog for minimal installation. For example in Ubuntu Server 12.04 LTS with 64bit kernel,

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

For Ubuntu and Debian systems (x86_64), Apt repository is available.

Write the following line to `/etc/apt/sources.list.d/jubatus.list` to register Jubatus Apt repository.

::

  deb http://download.jubat.us/apt binary/

Now install the Jubatus.

::

  $ sudo apt-get update
  $ sudo apt-get install jubatus

Currently our package is not GPG-signed.
Bypass the warning by answering `y` to the prompt:

::

  Install these packages without verification [y/N]? y

Now Jubatus is installed in `/opt/jubatus`.
Before using Jubatus, load the environment variable from `profile` script.

::

  $ source /opt/jubatus/profile

If you're using csh or tcsh, use this instead:

::

  $ source /opt/jubatus/profile.csh

Yum Repository for RHEL 6
-------------------------

For Red Hat Enterprise Linux 6 (x86_64) and its clones, Yum repository is available.

::

  $ sudo rpm -Uvh http://download.jubat.us/yum/rhel/6/stable/x86_64/jubatus-release-6-1.el6.x86_64.rpm
  $ sudo yum install jubatus


Running servers
---------------

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

To start grap server, just run

::

  $ jubagraph

If you use the client, See :doc:`tutorial`.

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
See :doc:`howtogetclients`.

Other clients
-------------

Other clients are all distributed under MIT License.

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

If your project uses Maven, please add these lines to your pom.xml.

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

Jubatus is publicly supported with Ubuntu LTS 12.04 and Red Hat Enterprise Linux 6.2 running on 64bit kernel. And development team are using Intel CPU. Other requirements as follows:


============ ========== ========================
software     version    misc
============ ========== ========================
gcc          >= 4.4

libevent     >= 1.4

google-glog  >= 3.2

python       >= 2.6     used in WAF

msgpack      >= 0.5.7

pficommon    >= 1.3.1.0 must be msgpack enabled

pkg-config   >= 0.26

mecab        >= 0.99    optional

re2          -          optional

ux-trie      -          optional

zookeeper    >= 3.4     optional
============ ========== ========================

Other Environments
~~~~~~~~~~~~~~~~~~

- MacOSX runs standalone mode even by using llvm-gcc, but not working in some compilers.
- Debian/GNU Linux runs all mode (I use).
- Arch Linux runs standalone mode.
- FreeBSD does not run, needs some fixed on pficommon.
- CentOS 5.x is strongly discouraged.
- We do not know anything about CentOS 6.x.
- We are waiting for report in other *BSD systems and in Solaris.
