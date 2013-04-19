Frequently Asked Questions (FAQs)
=================================

Installation
::::::::::::

- ``mecab_splitter.trivial`` and ``mecab_splitter_create.trivial`` does not pass the unittest?

 Check your mecab dictionary and ensure that your mecab command accept UTF-8 charsets.

- Will Jubatus Ruby client work with Ruby 2.0?

 Currently we are not testing clients against Ruby 2.0.

 There is a known issue of msgpack 0.4.x (which Jubatus Ruby client indirectly depends on) that does not work with Ruby 2.0 when used from Rails application.

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

 To disable this auto-disconnect feature, set :option:`server -t` to 0, which means "no timeout".
 In this case, clients must explicitly close the TCP connection using :mpidl:meth:`get_client`.

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
