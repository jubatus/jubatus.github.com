Frequently Asked Questions (FAQs)
=================================

Installation
::::::::::::

- Failed in ``./waf configre`` with ...

::

  ...
  line 298, in load_tool
       __import__(d)
     File "/Users/oliner/tmp/jubatus/unittest_gtest.py", line 8
       C1 = b'#XXX'
                ^
  SyntaxError: invalid syntax

 This error occurs when old python. Use python 2.7 or later.

- When using python client, "got socket.error: [Errno 99] Cannot assign requested address" (or kind of ``EADDRINUSE``)

 sudo /sbin/sysctl -w net.ipv4.tcp_tw_recycle=1

- mecab_splitter.trivial and mecab_splitter_create.trivial does not pass the unittest?

 check your mecab dictionary and ensure that your mecab command accept UTF-8 charsets.

- How does 'jubatus' read?

 Please do not run 'say' command in MacOS.



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

  It also reduces the computation time for LOF. However, the number should not be smaller than ``nearest_neighbornum`` .
