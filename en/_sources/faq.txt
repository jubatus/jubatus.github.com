Frequently Asked Questions (FAQs)
=================================

Installation
::::::::::::

- ``mecab_splitter.trivial`` and ``mecab_splitter_create.trivial`` does not pass the unittest?

 Check your mecab dictionary and ensure that your mecab command accept UTF-8 charsets.

- Will Jubatus Ruby client work with Ruby 2.0?

 Currently we are not testing clients against Ruby 2.0.

 There is a known issue of msgpack 0.4.x (which Jubatus Ruby client indirectly depends on) that does not work with Ruby 2.0 when used from Rails application.

- How to install through Proxy?

 Binary Package (Apt) in Ubuntu Environment

 Error turns out when Proxy in apt is not added. Insert the line below into ``/etc/apt/apt.conf``.

 ::

  $ sudo vi /etc/apt/apt.conf

 ::

  Acquire::http::Proxy "http://username:password@proxy.example.com:port/";

 Python Client (pip)

 Errors like below may come out when Proxy is required. In this case, please specify the Proxy option when execute your command. 

 ::

  Cannot fetch index base URL http://pypi.python.org/simple/
  Could not find any downloads that satisfy the requirement jubatus
  No distributions at all found for jubatus
  Storing complete log in /home/jubatus/.pip/pip.log

 ::

  $ sudo pip --proxy=http://username:password@proxy.example.com:port/ install jubatus

 The installation completes when logs like below come out.

 ::

  Successfully installed jubatus msgpack-rpc-python msgpack-python tornado
  Cleaning up...

 Ruby Client (RubyGems) 

 Please set your environment variables like below before your installation.

 ::

  export http_proxy=http://username:password@proxy.example.com:port/

- How to develop by Java with client library

 It is much convenient to use the skeleton project, which published at `GitHub <https://github.com/jubatus/jubatus-java-skelton>` (template for Eclipse project), when developing Jubatus client with Java.
 Please follow the instructions below to use the Java skeleton for your development.

 #. Start Eclipse, select [File]>[Import].
 #. Select [Git] > [Projects from Git], click the [Next] button.
 #. Select [URI], click the [Next] button.
 #. Input "https://github.com/jubatus/jubatus-java-skelton.git" into [URI], click the [Next] button.
 #. Forward through the dialogs operations, and click the [Finish] button.

 Once the import is finished, Maven will download the Jubatus client library automatically.
 Under \ ``src/main/java``\ Directory(default package), there will be a simple program `Client.java` which using Jubatus recommender function.



RPC Errors
::::::::::

- When using python client, "got socket.error: [Errno 99] Cannot assign requested address" (or kind of ``EADDRINUSE``)

 Try this: ``sudo /sbin/sysctl -w net.ipv4.tcp_tw_recycle=1``

- I've got an exception with message "1" from Jubatus client library, why?

 The version of the client library you installed is not compatible with the version of the Jubatus server you are connecting to.
 See the `Jubatus Wiki: Client Compatibility and Documentation <https://github.com/jubatus/jubatus/wiki/Client-Compatibility-and-Documentation>`_ for the compatibility information.

 Technically, the error "1" means "no such method on RPC server".

- I've got an exception with message "2" from Jubatus client library, why?

 This is a type mismatch error between clients and servers.

 A common mistake is using integer instead of float in values of ``num_values``.
 Always cast values in ``num_values`` as float.
 If you are using literals like ``10``, replace it with ``10.0`` instead.
 Another common mistake is assigning ``NULL`` for objects like vector.

 This error may also occur if the version of the client library you installed is not compatible with the version of the Jubatus server you are connecting to.
 Check out the `Jubatus Wiki: Client Compatibility and Documentation`_ for the compatibility information.

- Client library occasionally throws RPC timeout errors; it seems that servers automatically disconnect clients. Why?

 Jubatus servers automatically close connections when the idle timeout (given by the command line parameter :option:`server -t`) expires.
 You need to retry the RPC call to re-establish the connection.
 Please refer :doc:`faq_rpc_err_workaround` to handle RPC errors including timeout error
 caused by server's auto session-closing.

 To disable this auto-disconnect feature, set :option:`server -t` to 0, which means "no timeout".
 In this case, clients must explicitly close the TCP connection using :mpidl:meth:`get_client`.
 Or, please set timeout enough longer than a client's connection lifetime.

Distributed Environment 
::::::::::::::::::::::::

- The confirm/check methods for MIX operations, when Jubatus works in distributed model

 Information about the Mix operations is recorded in the log files at Jubatus servers, which seems like below. 

  ::

    I0218 06:01:49.587540  3845 linear_mixer.cpp:173] starting mix:
    I0218 06:01:49.703693  3845 linear_mixer.cpp:231] mixed with 3 servers in 0.112371 secs, 8 bytes (serialized data) has been put.
    I0218 06:01:49.705159  3845 linear_mixer.cpp:185] .... 22th mix done.
    I0218 06:03:15.502995  3845 linear_mixer.cpp:173] starting mix:
    I0218 06:03:15.642297  3845 linear_mixer.cpp:231] mixed with 3 servers in 0.137258 secs, 8 bytes (serialized data) has been put.
    I0218 06:03:15.644685  3845 linear_mixer.cpp:185] .... 23th mix done.

- Is it appropriate to use only a single server for all these processes, including jubaclassifier, jubaclassifier_proxy/Client and ZooKeeper, even in distributed model.

 No Problem. 
 However, comparing with the environment where each process has its privately owned server, the overall performance may decrease. In addition, we recommend an odd number of the ZooKeeper servers for the better ensemble.

- What's the difference between Jubatus Keeper and Proxy?

 Keeper is renamed to Proxy in version 0.5.0
 The role of proxies is same as the role of keepers in 0.4.x or before.

Learning Model 
::::::::::::::

- In Classifier/Regression learning process, will the model learnt turns to be different due to the two different training methods below, 

  - Input the training data into Jubatus in a patch way. (Bulk learning, the train method is called only by one time)
  - The train method is called every time when learning each piece of training data.

 No difference in the final result of trained model.

Anomaly detection
:::::::::::::::::

- jubaanomaly only outputs 1.0 or infinity. Why?

 It might relate to the scaling problem of the input data, in which nearest neighbor search cannot work properly.

 jubaanomaly (as LOF algorithm) depends on euclid LSH which has many parameters related to the scale. If the scale is too large compared to the setting, LSH-based nearest neighbor fails and LOF model does not provide reasonable scores.

 You may avoid such situation by using the following techniques.

 - 1: Normalize each feature value

 Nearest neighbor search is affected by the difference in scales of the features. It is better to normalize all of the feature values (limited from 0.0 to 1.0) or starndardize them (to have about 1.0 standard deviation).

 - 2: Change parameters for underlying euclid LSH

 Especially, we recommend you to change the most important parameter ``bin_width`` for some values.

- Why jubaanomaly gets slow after adding many samples?

 jubaanomaly (as LOF algorithm) depends on iterations of nearest neighbor search and its default configuration uses euclid LSH for speed-up. However, updating the internal state of the LOF model still takes quadratic time at worst with respect to the number of ever-added samples. For more details, please refer to the original paper [Breunig2000]_ .

- How to avoid such speed down?

 You can control the trade-off between speed and accuracy by using the following techniques. 

 - 1: Modify baseline euclid LSH with lower accuracy and faster computation

  By reducing the parameters values of (euclid) LSH such as ``lsh_num``, ``table_num``, ``probe_num``, or ``bin_width``, you can make neighbor nearest computation faster with lower accuracy, in which some more nearest samples might be ignored. This may affect the final anomaly score in comparison with the ground truth in which everything is computed in batch-processing manner.  

 - 2: Use ``calc_score`` for just obtaining anomaly score

  ``add`` function really appends the sample to the nearest neighbor storage, update the LOF model, and calculate its LOF value. On the other hand, ``calc_score`` function just computes an LOF value for the input sample based on the current LOF model, which works much faster. If you can assume that the data distribution is almost stable, we recommend you to use only ``add`` at the early stage to make a valid LOF model as early as possible, say, until 1000 samples are stored in the storage. Then you can swith two functions, with more freuquent ``calc_score``. For example, it would work fine and much faster with the ratio ``add`` : ``calc_score`` = 1:100.

 - 3: Decrease ``reverse_nearest_neighbor_num``

  It also reduces the computation time for LOF. However, the number should not be smaller than ``nearest_neighbor_num`` .

Miscellaneous
:::::::::::::

- How does 'jubatus' read?

 Please do not run 'say' command in Mac OS.
