Stat
=================

In this sample program, we will introduce how to use the statistical analysis function 'stat' through the Jubatus Client.

By setting windows on time-series data for the statistical analysis, you can utilize the abnormal data detection and sensor monitoring, and etc.


-----------------------------------
Abstract of sample program
-----------------------------------

In this sample, we will study the 'price', 'weight', 'diameter' of orange, apples and melon. Program [trivial_stat] is used for the statistical analysis, such as standard deviation and tatal value of the parameter, in each fruit.

At first, please download the artificially created fruit-data from (`fruit.csv <https://raw.github.com/jubatus/jubatus-example/master/trivial_stat/dat/fruit.csv>`_). It is used to training the statistical model at the server site. 

Next, StatClient methods will be called to return the total value and the standard deviation of each fruit.


--------------------------------
Processing flow 
--------------------------------

Main flow of using Jubatus Client

 1. Connection settings to Jubatus Server

  Setting the HOST, RPC port of Jubatus Server

 2. Prepare the training data

  Read the fruit-data from the downloaded .CSV file line by line.

 3. Data training (update the model)

  Use the push() method to send the fruit-data to the server site and training the model there.

 4. Output the result

  Use the methods in statClient to get total-value, standard deviation, etc.; and output the result

--------------------------------
Sample Program
--------------------------------

.. toctree::
   :maxdepth: 2

   stat_python
   stat_ruby
   stat_java
