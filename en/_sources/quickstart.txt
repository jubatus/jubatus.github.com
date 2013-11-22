Quick Start
===========


Install Jubatus
---------------

We officially support Red Hat Enterprise Linux 6.2 or later (64-bit) and Ubuntu Server 12.04 LTS (64-bit).
On supported systems, you can install all components of Jubatus using binary packages.

Other Linux distributions (including 32-bit) and Mac OS X are experimentally supported.

Red Hat Enterprise Linux 6.2 or later (64-bit)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Run the following command to register Jubatus Yum repository to the system.

::

  $ sudo rpm -Uvh http://download.jubat.us/yum/rhel/6/stable/x86_64/jubatus-release-6-1.el6.x86_64.rpm

Now install ``jubatus`` and ``jubatus-client`` package.

::

  // For RHEL
  $ sudo yum --enablerepo=rhel-6-server-optional-rpms install jubatus jubatus-client

  // For RHEL clones (CentOS, Scientific Linux, etc.)
  $ sudo yum install jubatus jubatus-client

Note that we use ``rhel-6-server-optional-rpms`` repository to install dependency package (``oniguruma``) on RHEL.

Ubuntu Server 12.04 LTS (64-bit)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Write the following line to ``/etc/apt/sources.list.d/jubatus.list`` to register Jubatus Apt repository to the system.

::

  deb http://download.jubat.us/apt binary/

Now install ``jubatus`` package.

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

Other Linux Distributions (including 32-bit)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Use `jubatus-installer <https://github.com/jubatus/jubatus-installer>`_ or see :doc:`build` to build from source.

Mac OS X
~~~~~~~~

If you're using Homebrew, you can use `tap repository <https://github.com/jubatus/homebrew-jubatus>`_ for installation.

In other case, use `jubatus-installer <https://github.com/jubatus/jubatus-installer>`_ or see :doc:`build` to build from source.

Install Jubatus Client Libraries
--------------------------------

Jubatus client applications can be written in C++, Python, Ruby or Java.
You need to setup the client library for each language to use Jubatus from client applications.
Client libraries are distributed under MIT License.

If you're going to try :doc:`tutorial`, just install Python client and go ahead.

Version of Jubatus and Jubatus clients may be different, as clients are not updated when there are no API changes to Jubatus.

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

If you don't have ``pip`` command, run the following command:

::

  $ wget http://peak.telecommunity.com/dist/ez_setup.py
  $ sudo python ez_setup.py
  $ sudo easy_install pip

On Ubuntu, you can also use ``python-pip`` package to install ``pip``.

Ruby
~~~~

The client (requires Ruby 1.9) is available in `RubyGems <http://rubygems.org/gems/jubatus>`_.

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
       <version>0.5.0</version>
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

Skeleton projects are also available:

- `C++ Client Development Skeleton <https://github.com/jubatus/jubatus-cpp-skeleton>`_
- `Python Client Develoment Skeleton <https://github.com/jubatus/jubatus-python-skeleton>`_
- `Ruby Client Develoment Skeleton <https://github.com/jubatus/jubatus-ruby-skeleton>`_
- `Java Client Development Skeleton <https://github.com/jubatus/jubatus-java-skeleton>`_ (Eclipse project template)

In the `jubatus-example <https://github.com/jubatus/jubatus-example>`_ repository, you can see applications using Jubatus.
