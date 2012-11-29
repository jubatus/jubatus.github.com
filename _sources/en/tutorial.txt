
Tutorial
========

Before trying the tutorial, you need to install Jubatus and Jubatus Python client. See :doc:`quickstart` for instructions.


Scenario
--------

This tutorial uses `News20 <http://people.csail.mit.edu/jrennie/20Newsgroups/>`_ dataset (``20news-bydate.tar.gz``) which is a popular for experiments in text classiication.
News20 has 20 different newsgroups and users post thier message on a suitable newsgroup.
News20 is divided into learning data (20news-bydate-train, 80%) and experimental data (20news-bydata-test, 20%).

The goal of this tutorial is to learn model from 20news-bydate-train and to guess the newsgroup to post from 20news-bydate-test.


Standalone Mode
---------------

Simply run ``jubaclassifier`` program that provides classification feature.

::

  $ jubaclassifier
  I1128 16:52:51.031333  4200 server_util.cpp:136] starting jubaclassifier 0.3.4 RPC server at 192.168.1.2:9199
    pid            : 4200
    user           : jubatus
    mode           : standalone mode
    timeout        : 10
    thread         : 2
    tmpdir         : /tmp
    logdir         :
    zookeeper      :
    name           :
    join           : false
    interval sec   : 16
    interval count : 512

Jubatus classification service is now started.
Jubatus servers listen on TCP port 9199 by default.
If you would like to use another port, specify it using ``--rcp-port`` option.
For example, to use port 19199:

::

  $ jubaclassifier --rpc-port 19199

Jubatus and Jubatus clients communicate with each other in `MessagePack-RPC <http://msgpack.org>`_ protocol over the TCP/IP network.

.. figure:: ../_static/single_single.png
   :width: 70 %
   :alt: single client, single server

Run Tutorial
~~~~~~~~~~~~

Download the `tutorial program <https://github.com/jubatus/jubatus-tutorial-python>`_ and the dataset.

::

  $ git clone https://github.com/jubatus/jubatus-tutorial-python.git
  $ cd jubatus-tutorial-python
  $ wget http://people.csail.mit.edu/jrennie/20Newsgroups/20news-bydate.tar.gz
  $ tar xvzf 20news-bydate.tar.gz

Then, run the program.

::

  $ python tutorial.py

Now you'll see the result of classification!
Read below for more detailed description.


Tutorial in Detail
------------------

Dataset
~~~~~~~

After expanding ``20news-bydate.tar.gz``, you see files like this:

::

  20news-bydate-train
  |-- alt.atheism
  |   |-- 49960
  |   |-- 51060
  |   |-- 51119
  |   |-- 51120
  :   :     :
  |-- comp.graphics
  |-- comp.os.ms-windows.misc
  |-- comp.sys.ibm.pc.hardware
  |-- comp.sys.mac.hardware
  |-- comp.windows.x
  |-- misc.forsale
  |-- rec.autos
  |-- rec.motorcycles
  |-- rec.sport.baseball
  |-- rec.sport.hockey
  |-- sci.crypt
  |-- sci.electronics
  |-- sci.med
  |-- sci.space
  |-- soc.religion.christian
  |-- talk.politics.guns
  |-- talk.politics.mideast
  |-- talk.politics.misc
  `-- talk.religion.misc

``49960`` is one of messages and ``alt.atheism`` is one of newsgroups the message is posted.
For example, ``20news-bydate-train/rec.motorcycles/104435`` contains:

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

In this tutorial, we use these text as the training data.

Server Configuration
~~~~~~~~~~~~~~~~~~~~

You can setup a behavior of ``jubaclassifier`` using ``set_config`` API.
There are two configurable parameter: ``method`` and ``converter``.
Examle of these parameters are as follows.

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

You can choose one of the following algorithm as ``method``:

- ``perceptron``
- ``PA``, ``PA1``, ``PA2``
- ``CW``
- ``AROW``
- ``NHERD``

We use ``PA`` in this tutorial.

``converter`` decides how to extract feature vector from input data (see :doc:`fv_convert` for details).

In this tutorial, input data is the text of natural language.
Many languages such as English, <space> and <return> can be split into words.
Jubatus supports this feature by default.
HTML tags are noisy to classify the contents so we will remove the part that is enclosed in "<>".

Using this feature, you can apply multiple rules such as natural language process and weighting of values.
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

``get_config`` will return the configuration currently set in the server.

Use of Classifier API: Train & Classify
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Call ``train`` API (RPC method) to update models in the classifier.

.. code-block:: python

  train_dat = [
                (
                  "comp.sys.mac.hardware",
                  [["message" , "I want to buy a new mac book air..."], []]
                )
              ]

Call ``classify`` API to analyze (in this case, let Jubatus classify the given data) with models.

.. code-block:: python

  classify_dat = [
                   [["message" , "I bought a new mac book air..."], []]
                 ]

The return format of ``classify`` method is as follows.

.. code-block:: python

   [[
        ["comp.sys.mac.hardware", 1.10477745533],
        ...
        ["rec.sport.hockey", 2.0973217487300002],
        ["comp.os.ms-windows.misc", -0.065333858132400002],
        ["sci.electronics", -0.184129983187],
        ["talk.religion.misc", -0.092822007834899994]
   ]]


Cluster Mode
------------

You can run Jubatus in a distributed environment using ZooKeeper and Jubatus keepers.

.. figure:: ../_static/single_multi.png
   :width: 70 %
   :alt: single client, multi servers

Setup ZooKeeper
~~~~~~~~~~~~~~~

`ZooKeeper <http://zookeeper.apache.org/>`_ is a centralized service for maintaining configuration information, naming, providing distributed synchronization, and providing group services.
Jubatus in cluster mode uses ZooKeeper to manage Jubatus servers and keepers in cluster environment.

Run ZooKeeper server like this:

::

    $ /path/to/zookeeper/bin/zkServer.sh start
    JMX enabled by default
    Using config: /path/to/zookeeper/bin/../conf/zoo.cfg
    Starting zookeeper ...
    STARTED

Here we assume that ZooKeeper is running on localhost:2181. You can change it in the ``zoo.cfg`` file.

Jubatus Keeper
~~~~~~~~~~~~~~

Jubatus keepers proxy RPC requests from clients to servers.
In distributed environment, make RPC requests from clients to keepers, not directly to servers.

Jubatus keepers are provided for each Jubatus servers.
For the classifier, ``jubaclassifier_keeper`` is the corresponding keeper.

::

    $ jubaclassifier_keeper --zookeeper=localhost:2181 --rpc-port=9198

Now ``jubaclassifier_keeper`` started listening on TCP 9198 port.

Join Jubatus Servers to Cluster
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To start Jubatus servers in cluster mode, give ``--name`` and ``--zookeeper`` option when executing servers.
Server processes started with same name belongs to the same cluster and they collaborate with one another.

If you want to start multiple server processes on the same machine, please note that you must change the port for each processes.

::

    $ jubaclassifier --rpc-port=9180 --name=tutorial --zookeeper=localhost:2181 &
    $ jubaclassifier --rpc-port=9181 --name=tutorial --zookeeper=localhost:2181 &
    $ jubaclassifier --rpc-port=9182 --name=tutorial --zookeeper=localhost:2181 &

When Jubatus servers are started in cluster mode, they create a node in ZooKeeper system.
You can verify that three server processes are registered to ZooKeeper system by using ZooKeeper client.

::

    $ /path/to/zookeeper/bin/zkCli.sh -server localhost:2181
    [zk: localhost:2181(CONNECTED) 0] ls /jubatus/actors/classifier/tutorial/nodes 
    [XXX.XXX.XXX.XXX_9180, XXX.XXX.XXX.XXX__9181, XXX.XXX.XXX.XXX__9182]

Run Tutorial
~~~~~~~~~~~~

Run the tutorial program again, but this time we use options to specify port to connect to keepers instead of servers.
In cluster mode, you also need to specify the cluster name when making RPC request to keepers.

::

    $ python tutorial.py --server_port=9198 --name=tutorial

Note that you can use the same client code for both standalone mode and distributed mode.


Cluster Management in Jubatus
-----------------------------

Jubatus has a mechanism to centrally manage various processes.
In this tutorial, you will execute some process on each servers like the following table.

=============  =======================================
IP Address     Processes
=============  =======================================
192.168.0.1    Terminal
192.168.0.11   jubaclassifier - 1
192.168.0.12   jubaclassifier - 2
192.168.0.13   jubaclassifier - 3
192.168.0.101  jubaclassifier_keeper/client - 1
192.168.0.102  jubaclassifier_keeper/client - 2
192.168.0.103  jubaclassifier_keeper/client - 3
192.168.0.211  ZooKeeper - 1
192.168.0.212  ZooKeeper - 2
192.168.0.213  ZooKeeper - 3
=============  =======================================

For the best practices, see :doc:`admin`.

.. figure:: ../_static/multi_multi.png
   :width: 70 %
   :alt: multi clients, multi servers

ZooKeepers & Jubatus Keepers
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Start ZooKeeper servers (make sure you configure an ensemble between them).

::

    [192.168.0.211]$ bin/zkServer.sh start
    [192.168.0.212]$ bin/zkServer.sh start
    [192.168.0.213]$ bin/zkServer.sh start

Start ``jubaclassifier_keeper`` processes. ``jubaclassifier_keeper`` uses TCP 9199 port by default.

::

    [192.168.0.101]$ jubaclassifier_keeper --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
    [192.168.0.102]$ jubaclassifier_keeper --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
    [192.168.0.103]$ jubaclassifier_keeper --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181

Jubavisor: Process Management Agent
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

``jubavisor`` is an agent process that manages server processes.

``jubavisor`` can manage each Jubatus server processes by receiving RPC requests from ``jubactl``, a controller command.
``jubavisor`` uses TCP 9198 port by default.

::

    [192.168.0.11]$ jubavisor --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181 --daemon
    [192.168.0.22]$ jubavisor --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181 --daemon
    [192.168.0.33]$ jubavisor --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181 --daemon

Now send commands from ``jubactl`` to ``jubavisor``.

::

    [192.168.0.1]$ jubactl -c start  --server=classifier --type=classifier --name=tutorial --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
    [192.168.0.1]$ jubactl -c status --server=classifier --type=classifier --name=tutorial --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181
    active jubaclassifier_keeper members:
     192.168.0.101_9199
     192.168.0.102_9199
     192.168.0.103_9199
    active jubavisor members:
     192.168.0.11_9198
     192.168.0.12_9198
     192.168.0.13_9198
    active tutorial members:
     192.168.0.11_9199
     192.168.0.12_9199
     192.168.0.13_9199

From members list, you can see the server is running.
Now run clients simultaneously, from multiple hosts.

::

    [192.168.0.101]$ python tutorial.py --name=tutorial --server_ip 127.0.0.1:9199
    [192.168.0.102]$ python tutorial.py --name=tutorial --server_ip 127.0.0.1:9199
    [192.168.0.103]$ python tutorial.py --name=tutorial --server_ip 127.0.0.1:9199

You can also stop instance of Jubatus server from ``jubactl``.

::

    [192.168.0.1]$ jubactl -c stop --server=classifier --type=classifier --name=tutorial --zookeeper 192.168.0.211:2181,192.168.0.212:2181,192.168.0.213:2181

