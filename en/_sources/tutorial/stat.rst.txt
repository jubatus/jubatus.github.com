Stat
=================

In this sample program, we will introduce how to use the statistical analysis function ``jubastat`` through the Jubatus Client.

By setting windows on time-series data for the statistical analysis, you can utilize the abnormal data detection, sensor monitoring and etc.


-----------------------------------
Abstract of sample program
-----------------------------------

In this sample, we will study the 'price', 'weight', 'diameter' of orange, apples and melon. Program `trivial_stat <https://github.com/jubatus/jubatus-example/tree/master/trivial_stat>`_ is used for the statistical analysis, such as standard deviation and total value of the parameter, in each fruit.

At first, please download the artificially created fruit-data from (`fruit.csv <https://raw.github.com/jubatus/jubatus-example/master/trivial_stat/dat/fruit.csv>`_). It is used to training the statistical model in ``jubastat`` .

Next, we will call methods to get the total value and the standard deviation of each fruit.


--------------------------------
Processing flow
--------------------------------

The flow of development using Jubatus Client is following:

1. Connection settings to ``jubastat``
    Setting the HOST and RPC port of ``jubastat`` .

2. Prepare the training data
    Read the fruit-data from the downloaded CSV file line by line.

3. Data training (update the model)
    Use the ``push`` method to send the fruit-data to ``jubastat`` and training the model there.

4. Output the result
    Use the methods to get total-value, standard deviation, etc. And output them.


--------------------------------
Sample Program
--------------------------------

.. toctree::
   :maxdepth: 2

   stat_python

Currently, we have no sample programs except Python. (We welcome your contribution!)
