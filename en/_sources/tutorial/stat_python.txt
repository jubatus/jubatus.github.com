Python
==================

Here we explain the sample program of Stat in Python.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'stat.json'; 2) how to train the model by 'stat.py'. Here are the source codes.

**stat.json**

.. code-block:: js
 :linenos:

 {
   "window_size": 500
 }

**stat.py**

.. code-block:: python
 :linenos:

 #!/usr/bin/env python
 # -*- coding: utf-8 -*-

 import sys
 from jubatus.stat.client import Stat

 NAME = "stat_tri";

 if __name__ == '__main__':

   # 1. Jubatus Serverへの接続設定
   # 1. Connect to Jubatus Server
   stat = Stat("127.0.0.1", 9199, NAME)

   # 2. Prepare the training data
   for line in open('../dat/fruit.csv'):
     fruit, diameter, weight , price = line[:-1].split(',')

     # 3. Data training (update model)
     stat.push(fruit + "dia", float(diameter))
     stat.push(fruit + "wei", float(weight))
     stat.push(fruit + "pri", float(price))

   # 4. Output result
   for fr in ["orange", "apple","melon"]:
     for par in ["dia","wei", "pri"]:
       print "sum :", fr + par,stat.sum(fr + par)
       print "sdv :", fr + par,stat.stddev(fr + par)
       print "max :", fr + par,stat.max(fr + par)
       print "min :", fr + par,stat.min(fr + par)
       print "ent :", fr + par,stat.entropy(fr + par)
       print "mmt :", fr + par,stat.moment(fr + par, 1, 0.0)


--------------------------------
Explanation
--------------------------------

**stat.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON filed.

* window_size
    Specify the amount of value to be retained. (Integer)


**stat.py**

Stat.py reads the 'price', 'weight', 'diameter' of fruits from the .csv file, and send the info. to Jubatus server. The methods used are listed below.

* bool push(0: string key, 1: double val)
    Set the attribute info. "key"'s value with "val".

* double sum(0: string key)
    Return the summary value in the attribute "key".

* double stddev(0: string key)
    Return the standard deviation of values in the attribute "key".

* double max(0: string key)
    Return the maximum value of values in the attribute "key".

* double min(0: string key)
    Return the minimum value of values in the attribute "key".

* double entropy(0: string key)
    Return the entropy of values in the attribute "key".

* double moment(0: string key, 1: int degree, 2: double center)
    Return the degree-th moment about 'center' of values in the attribute "key".

1. Connect to Jubatus Server.
    Connect to Jubatus Server (Line 12).

    Setting the IP addr, RPC port of Jubatus Server and the unique name for task identification in Zookeeper.

2. Prepare the learning data
    Stat client send the <item_name, value> to the server side as training data, by using the push() method.
    In this sample program, the training data are generated from a .CSV file which contains the info. of 'fruit type', 'price', 'weight', 'diameter'.
    The source data is read line by line from the .CSV file (Line 14-21). 

3. Data training (update the model)
    The training data generated in Step 2 is send to the server site by using the push() method (Line 19-21) for training model there. Items of fruit are renamed as the fruit's name extended with the item's prefix, eg. item for a fruit's diameter is: fruit's name + "dia". 

4. Output the result
    Stat client gets the different statistic results by using its methods.
    For each type of fruits(Line 24), the program outputs its statistic results of all the items (Line 25).
    Different methods are called (Line 26-31) in the loop above. Their contents are listed in the methods list above.


-------------------------------------
Run the sample program
-------------------------------------

* At Jubatus Server
    start "jubagraph" process.

    ::

     $ jubastat --configpath stat.json

* At Jubatus Client
    Get the required package and Python client ready.

    Output:

    ::

     sum : orangedia 1503.399996995926
     sdv : orangedia 10.868084068651045
     max : orangedia 54.29999923706055
     min : orangedia -2.0999999046325684
     ent : orangedia 0.0
     mmt : orangedia 28.911538403767807
     sum : orangewei 10394.399948120117
     sdv : orangewei 54.92258724344468
     max : orangewei 321.6000061035156
     min : orangewei 39.5
     ent : orangewei 0.0
     mmt : orangewei 196.1207537381154
     sum : orangepri 1636.0
     sdv : orangepri 7.936154992801973
     max : orangepri 50.0
     min : orangepri 6.0
     ent : orangepri 0.0
     mmt : orangepri 30.867924528301888
     sum : appledia 2902.0000019073486
     sdv : appledia 15.412238321876663
     ...
     ... (omitted)
