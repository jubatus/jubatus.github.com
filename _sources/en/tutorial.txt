Tutorial
========



Overview and Scenario
----------------------
This tutorial uses `News20(20news-bydate.tar.gz) <http://people.csail.mit.edu/jrennie/20Newsgroups/>`_ data set which is a popular for experiments in text classiication.　News20 has 20 different newsgroups and users post thier message on a suitable newsgroup. News20 is divided into learning data (20news-bydate-train, 80%) and experimental data (20news-bydata-test, 20%). The goal of this tutorial is to learn model from 20news-bydate-train and to guess the newsgroup to post 20news-bydate-test.


Prequisites
~~~~~~~~~~~

This tutorial requires following softwares installed:

- Linux, gcc, pkg-config, python 2.7, `msgpack <http://msgpack.org>`_, `libevent 2.0.X <http://libevent.org/>`_ , 
- `pficommon <http://github.com/pfi/pficommon>`_ - must be configured with msgpack enabled,
- `re2 <http://code.google.com/p/re2/>`_ , `google-glog <http://code.google.com/p/google-glog/>`_ , 

- `msgpack-python <http://pypi.python.org/pypi/msgpack-python/>`_ ,
- `ux-trie <http://code.google.com/p/ux-trie/>`_ / `MeCab <http://mecab.sourceforge.net/>`_ (optional), and
- `ZooKeeper <http://zookeeper.apache.org/>`_ server and C client (optional, for multiple processes)

See :ref:`requirements` for detailed and proper prequisites. `These scripts <https://github.com/odasatoshi/jubatus-installer>`_ maybe the help your installation.

Setup a single process Jubatus Server
-----------------------------------------

In this section, We show how to install the Jubatus.

building and installing Jubatus
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You need to install the above library dependencies before building and installing jubatus.

::

  $ git clone git://github.com:jubatus/jubatus.git
  $ cd jubatus
  $ ./waf configure
  $ ./waf build
  # ./waf install
  $ jubaclassifier --name tutorial
  jubaclassifier I0514 07:45:30.165102 30546 server_util.cpp:84] starting jubaclassifier0.3.2 RPC server at 10.0.2.15:9199 with timeout: 10


Setup and starting a single process jubatus has been completed.

``--name`` option is a string value to uniquely identifies a task in zookeeper quorum. 

Jubatus listens on port 9199 as MessagePack RPC server by default. If other services uses the same port, Please use another ports using rcp-port option. If you want to listen RPC port at 9181, 

::

  $ jubaclassifier --rpc-port=9181 --name=tutorial


installing Python client for Jubatus
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Python client of Jubatus requires `msgpack-python <http://pypi.python.org/pypi/msgpack-python/>`_.
"pip" command will resolve this dependencies automatically.

::

  $ pip install jubatus
  $ pip install msgpack-rpc-python

.. TODO: check "Expert Python Programming" and do in a pythonic way

Quick Start
----------------------------------

::

  $ git clone git://github.com/jubatus/jubatus-tutorial-python.git
  $ cd jubatus-tutorial-python
  $ wget http://people.csail.mit.edu/jrennie/20Newsgroups/20news-bydate.tar.gz
  $ tar -xvzf 20news-bydate.tar.gz
  $ python tutorial.py

Jubatus communicates with its clients in `MessagePack-RPC <http://msgpack.org>`_ protocol.


Prepairing dataset
~~~~~~~~~~~~~~~~~~


Expanding 20news-bydate.tar.gz, 

::

  -20news-bydate-train
    alt.atheism
      49960
      51060
      ...
    comp.graphics
    comp.os.ms-windows.misc
    comp.sys.ibm.pc.hardware
    comp.sys.mac.hardware
    comp.windows.x
    misc.forsale
    rec.autos
    rec.motorcycles
    rec.sport.baseball
    rec.sport.hockey
    sci.crypt
    sci.electronics
    sci.med
    sci.space
    soc.religion.christian
    talk.politics.guns
    talk.politics.mideast
    talk.politics.misc
    talk.religion.misc

"49960" is a file name and "alt.atheism" is a newsgroup name.
For example, "20news-bydate-train/rec.motorcycles/104435" contains

 
::

 From: karr@cs.cornell.edu (David Karr)
 Subject: Re: BMW MOA members read this!
 Organization: Cornell Univ. CS Dept, Ithaca NY 14853
 Lines: 19
 
 In article <C5Joz9.HLn@cup.hp.com> Chris Steinbroner <hesh@cup.hp.com> writes:
 >Wm. L. Ranck (ranck@joesbar.cc.vt.edu) wrote:
 >: As a new BMW owner I was thinking about signing up for the MOA, but
 >: right now it is beginning to look suspiciously like throwing money
 >: down a rathole.
 >
 >[...] i'm going to
 >let my current membership lapse when it's
 >up for renewal.
 >
 >-- hesh
 
 In my case that's not for another 3+ years, so I'd appreciate any
 hints on what will keep the organization in business that long.  (And
 preferably longer, of course, and worth being part of.)
 
 -- David Karr (karr@cs.cornell.edu)

Jubatus uses this text as the training data


Set configure
~~~~~~~~~~~~~
You can change a behavior of jubaclassifier using method and converter options. Prototype of these options are as follows.

.. code-block:: python

  converter = {
            'string_filter_types': {},
            'string_filter_rules':[],
            'num_filter_types': {},
            'num_filter_rules': [],
            'string_types': {},
            'string_rules': [],
            'num_types': {},
            'num_rules': []
           }
  config = types.config_data(options.algo, json.dumps(converter))

You can choose one of the following algorithm as ``'method'`` 

- ``perceptron``
- ``PA``, ``PA1``, ``PA2``
- ``CW``
- ``AROW``
- ``NHERD``

Now, we choose ``PA`` .

``'converter'`` decides how to convert feature vector from input data.

In this tutorial, input data is the text of natural language.
Many languages such as English, <space>　and <Return> can be split into words. Jubatus supports this feature such as standard.
HTML tags are noisy to classify the contents so we will remove the part that is enclosed in "<>".

These rules expressed as follows in JSON.

.. code-block:: python

    converter = {
            'string_filter_types': {
            "detag": { "method": "regexp", "pattern": "<[^>]*>", "replace": "" }
             },
            'string_filter_rules':
               [
              { "key": "message", "type": "detag", "suffix": "-detagged" }
               ],
              'num_filter_types': {},
              'num_filter_rules': [],
              'string_types': {},
              'string_rules': [
                  {'key': 'message-detagged', 'type': "space", "sample_weight": "bin", "global_weight": "bin"}
                  ],
              'num_types': {},
              'num_rules': []
              }


Train/Classify
~~~~~~~~~~~~~~
Call ``train`` API to update models.

.. code-block:: python

  train_dat = [
             (
               "comp.windows.x",
               [
                ["message" , "some messages about windows..."],
                ["from" , "hoge@n.tt"]
               ]
             ),
             (
               "comp.sys.mac.hardware",
               ["message" , "I want to buy a new mac book air...",]
             )
           ]

Call ``classify`` API to analyze with models.

.. code-block:: python

  classify_dat = [[
         ["some messages about windows..."],
         ["I bought a new mac book air..."],
       ]]  


The return values are as follows.

.. code-block:: python

   [[
        ["alt.atheism", 1.10477745533],
        ...
  ["rec.sport.hockey", 2.0973217487300002],
  ["comp.os.ms-windows.misc", -0.065333858132400002],
  ["sci.electronics", -0.184129983187],
        ["talk.religion.misc", -0.092822007834899994]
   ]]
   

You have executed the classifier feature of jubatus under this configuration.

.. figure:: ../_static/single_single.png
   :width: 70 %
   :alt: single client, single server

.. _multiprocess:

Setup Jubatus Server with multiple processes
--------------------------------------------
You can execute jubatus over distributed environment using Zookeeper.

Setup ZooKeeper
~~~~~~~~~~~~~~~

::

    $ cd /path/to/zookeeper
    $ bin/zkServer.sh start
    JMX enabled by default
    Using config: /zookeeper-3.3.3/bin/../conf/zoo.cfg
    Starting zookeeper ...
    STARTED
    ...

We assume that Zookeeper process will be running on localhost:2181 by specifying in the zoo.cfg.


jubaclassifier_keeper
~~~~~~~~~~~~~~~~~~~~~~~~
jubaclassifier_keeper is a RPC requests proxy process for jubaclassifier. it use zookeeper processes.


::

    $ jubaclassifier_keeper --zookeeper=localhost:2181 --rpc-port=9198

jubaclassifier_keeper started at 9198 port.
Client does not need to aware of Servers. They will be scale out automatically. 


Running two processes as one classifier instance
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

If you set same name using ``--name`` options, processes collaborate with one another. If you want to start multiple processes in the same machine, please note that you must change the port on a each process.

::

    $ jubaclassifier --rpc-port=9180 --name=tutorial2 --zookeeper=localhost:2181 &
    $ jubaclassifier --rpc-port=9181 --name=tutorial2 --zookeeper=localhost:2181 &
    $ jubaclassifier --rpc-port=9182 --name=tutorial2 --zookeeper=localhost:2181 &

You can also verify that three server processes are started using a zookeeper client.

::

    $ cd /path/to/zookeeper
    $ bin/zkCli.sh -server localhost:2181
    [zk: localhost:2181(CONNECTED) 0] ls /jubatus/actors/classifier/tutorial2/nodes 
    [XXX.XXX.XXX.XXX_9180, XXX.XXX.XXX.XXX__9181, XXX.XXX.XXX.XXX__9182]



You have executed the classifier feature of jubatus under this configuration.

.. figure:: ../_static/single_multi.png
   :width: 70 %
   :alt: single client, multi servers




Setup Jubatus in cluster
------------------------


Jubatus has a mechanism to centrally manage various processes.
In this tutorial, you will execute some process on each servers like the following table.

=============  ==================
IP address     processes
=============  ==================
192.168.0.1    Terminal
192.168.0.10   jubaclassifier - 1
192.168.0.20   jubaclassifier - 2
192.168.0.30   jubaclassifier - 3
192.168.0.100  jubaclassifier_keeper/zookeeper - 1
192.168.0.200  jubaclassifier_keeper/zookeeper - 2
=============  ==================


Start zookeeper,

::

    [192.168.0.100]$ bin/zkServer.sh start
    [192.168.0.200]$ bin/zkServer.sh start

And start jubaclassifier_keeper process. jubaclassifier_keeper uses 9198 port by default.

::

    [192.168.0.100]$ jubaclassifier_keeper --zookeeper=192.168.0.100:2181,192.168.0.200:2181 -d
    [192.168.0.200]$ jubaclassifier_keeper --zookeeper=192.168.0.100:2181,192.168.0.200:2181 -d



Jubavisor(Process Management with zookeeper)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Jubavisor is an agent process. 
Jubavisor will manage juba* processes in the same server from receiving the commander of Jubactl. jubavisor uses 9199 port by default.


::

    [192.168.0.10 ]$ jubavisor -z 192.168.0.100:2181,192.168.0.200:2181 -d
    [192.168.0.20 ]$ jubavisor -z 192.168.0.100:2181,192.168.0.200:2181 -d
    [192.168.0.30 ]$ jubavisor -z 192.168.0.100:2181,192.168.0.200:2181 -d


Let's provisioning!!


::

    [192.168.0.1  ]$ jubactl -c start --server=classifier --name=tutorial2 -z 192.168.0.100:2181,192.168.0.200:2181
    [192.168.0.1  ]$ jubactl --name=tutorial2 --zookeeper=192.168.0.100:2181,192.168.0.200:2181 --type=classifier -c status
    active jubaclassifier_keeper members:
     192.168.0.100_9198
     192.168.0.200_9198
    active jubavisor members:
     192.168.0.10_9199
     192.168.0.20_9199
     192.168.0.30_9199
    active tutorial2 members:
     192.168.0.10_9180
     192.168.0.20_9180
     192.168.0.30_9180

::

    [192.168.0.1  ]$ jubactl -c stop --server=classifier --name=tutorial2 -z 192.168.0.100:2181,192.168.0.200:2181
    



Client for multi process Jubatus Server
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

In last section, you will execute tutorial over multi client and multi servers environment.

=============  ==================
IP address     processes
=============  ==================
192.168.0.1    terminal
192.168.0.2    client - 1
192.168.0.3    client - 2
192.168.0.3    client - 3
192.168.0.10   classifier - 1
192.168.0.20   classifier - 2
192.168.0.30   classifier - 3
192.168.0.100  jubaclassifier_keeper/zookeeper - 1
192.168.0.200  jubaclassifier_keeper/zookeeper - 2
=============  ==================


::

    [192.168.0.1  ]$ jubactl -c start --server=classifier --name=tutorial3 -z 192.168.0.100:2181,192.168.0.200:2181
    [192.168.0.2  ]$ python tutorial.py --name=tutorial3 -s 192.168.0.100:9198,192.168.0.200:9198
    [192.168.0.3  ]$ python tutorial.py --name=tutorial3 -s 192.168.0.100:9198,192.168.0.200:9198


Jubatus is available in the following configuration by the above command.

.. figure:: ../_static/multi_multi.png
   :width: 70 %
   :alt: multi clients, multi servers


Jubatus tutorial is now complete.
