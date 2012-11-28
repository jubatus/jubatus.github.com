
Quick Start
===========


Install Jubatus
---------------

We officially support Ubuntu Server 12.04 LTS (x86_64) and Red Hat Enterprise Linux 6.2 (x86_64).

On supported systems, you can install all components of Jubatus using binary packages.
For other systems, see :ref:`build_from_source`.

Yum Repository (RHEL)
~~~~~~~~~~~~~~~~~~~~~

Run the following command to register Jubatus Yum repository to the system.

::

  $ sudo rpm -Uvh http://download.jubat.us/yum/rhel/6/stable/x86_64/jubatus-release-6-1.el6.x86_64.rpm

Now install the ``jubatus`` and ``jubatus-client`` package.

::

  $ sudo yum install jubatus jubatus-client

Apt Repository (Ubuntu)
~~~~~~~~~~~~~~~~~~~~~~~

Write the following line to ``/etc/apt/sources.list.d/jubatus.list`` to register Jubatus Apt repository to the system.

::

  deb http://download.jubat.us/apt binary/

Now install the ``jubatus`` package.

::

  $ sudo apt-get update
  $ sudo apt-get install jubatus

Currently our package is not GPG-signed.
Bypass the warning by answering ``y`` to the prompt when asked:

::

  Install these packages without verification [y/N]? y

Now Jubatus is installed in ``/opt/jubatus``.

Each time before using Jubatus, you need to load the environment variable from ``profile`` script.

::

  $ source /opt/jubatus/profile

If you're using csh or tcsh, use this instead:

::

  $ source /opt/jubatus/profile.csh


Install Jubatus Client Libraries
--------------------------------

Jubatus client applications can be written in C++, Python, Ruby or Java.
You need to setup the client library for each language to use Jubatus from client applications.
Client libraries are distributed under MIT License.

If you're going to try :doc:`tutorial`, just install Python client and go ahead.

Version of Jubatus and Jubatus clients may be different, as clients are not updated when there are no API changes to Jubatus.

If you want to download client libraries without using package management system, you can find them in `Downloads section of GitHub <https://github.com/jubatus/jubatus/downloads>`_.

C++
~~~

The client is included in the Jubatus framework (``$PREFIX/include/jubatus/client/*_client.hpp``) and no additional setup is required.

If you don't have compilers and/or development headers installed, you will need to setup them.
For RHEL systems, type:

::

  $ sudo yum groupinstall "Development tools" "Additional Development"

For Ubuntu systems, type:

::

  $ sudo apt-get install build-essential

Python
~~~~~~

The client (requires Python 2.7 or later) is available in `PyPI <http://pypi.python.org/pypi/jubatus>`_.

::

  $ sudo pip install jubatus
  $ sudo pip install msgpack-rpc-python

If you don't have ``pip`` command, run the following command:

::

  $ wget http://peak.telecommunity.com/dist/ez_setup.py
  $ sudo python ez_setup.py
  $ sudo easy_install pip

Ruby
~~~~

The client is available in `RubyGems <http://rubygems.org/gems/jubatus>`_.

::

  $ sudo gem install jubatus

Java
~~~~

The client is available in our Maven repository.
Please add these lines to ``pom.xml`` of your project.

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

Try the :doc:`tutorial` (requires Python client).


Write Your Application
----------------------

Congratulations!
Now you can write your own application using Jubatus.
See the :doc:`api` for what Jubatus can do.

For C++ and Java users, skelton projects are available:

  - `Jubatus C++ Skelton <https://github.com/jubatus/jubatus-cpp-skelton>`_
  - `Jubatus Java Skelton <https://github.com/jubatus/jubatus-java-skelton>`_: Template of Eclipse project

For Python users, see the `tutorial repository <https://github.com/jubatus/jubatus-tutorial-python>`_.


.. _build_from_source:

Building Jubatus from Source
============================

We recommend using binary packages whenever possible, but you can of course build Jubatus from source.
`jubatus-installer <https://github.com/odasatoshi/jubatus-installer>`_ may help your installation.

.. _requirements:

Requirements
------------

We need ``gcc`` (version 4.4 or later), ``pkg-config`` (version 0.26 or later) and ``python`` (version 2.6 or later, used in ``waf``) to build Jubatus from source.
In addition, following libraries are required.

============ ========== ======== ======================================================
Software     Version    Required Note
============ ========== ======== ======================================================
msgpack      >= 0.5.7   ✔
pficommon    master     ✔         Must be msgpack enabled.
libevent     >= 1.4     ✔
google-glog  >= 3.2     ✔
mecab        >= 0.99              Required when configured with `--enable-mecab`.
re2          -                    Required when configured *without* `--disable-re2`
ux-trie      -                    Required when configured with `--enable-ux`.
zookeeper    >= 3.3               Required when configured with `--enable-zookeeper`.
                                  C client libraries must be installed.
============ ========== ======== ======================================================

Depending on your distribution, some libraries may be available as a binary package.
When binary packages are not available, you also need these libraries from source; download them from each website:
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

Here's an example on Ubuntu 12.04 systems.

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

Now build Jubatus.

::

  $ git clone git://github.com/jubatus/jubatus.git
  $ cd jubatus
  $ ./waf configure --disable-re2
  $ ./waf build
  $ sudo ./waf install

As this is a minimal build (see ``./waf configure --help`` for other options available), some features like clustering and feature extraction plugins are not available.

Other Environments
~~~~~~~~~~~~~~~~~~

- Mac OS X runs standalone mode by using llvm-gcc.
- Debian/GNU Linux runs all mode.
- Arch Linux runs standalone mode.
- FreeBSD does not run, needs some fixed on pficommon.
- We are waiting for report in other \*BSD systems and in Solaris.
