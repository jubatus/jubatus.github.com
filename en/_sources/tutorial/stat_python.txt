Python
==================

Here we explain the sample program of Stat in Python.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'stat.json'; 2) how to train the model by 'stat.py'. Here are the source codes.

**stat.json**

.. code-block:: python

 1 : {
 2 :   "window_size": 500
 3 : }
 

**stat.py**

.. code-block:: python

 01 : #!/usr/bin/env python
 02 : # -*- coding: utf-8 -*-
 03 : 
 04 : import sys
 05 : from jubatus.stat import client
 06 : from jubatus.stat import types
 07 : 
 08 : NAME = "stat_tri";
 09 : 
 10 : if __name__ == '__main__':
 11 : 
 12 :   # 1. Connect to Jubatus Server
 13 :   stat = client.stat("127.0.0.1",9199)
 14 : 
 15 :   # 2. Prepare the training data
 16 :   for line in open('./fruit.csv'):
 17 :     fruit, diameter, weight , price = line[:-1].split(',')
 18 :     
 19 :     # 3. Data training (update model)
 20 :     stat.push(NAME, fruit+"dia", float(diameter))
 21 :     stat.push(NAME, fruit+"wei", float(weight))
 22 :     stat.push(NAME, fruit+"pri", float(price))
 23 : 
 24 :   stat.save(NAME, "stat.dat")
 25 :   stat.load(NAME, "stat.dat")
 26 : 
 27 :   # 4. Output result
 28 :   for fr in ["orange", "apple","melon"]:
 29 :     for par in ["dia","wei", "pri"]:
 30 :       print "sum :",fr+par,stat.sum(NAME, fr+par)
 31 :       print "sdv :",fr+par,stat.stddev(NAME, fr+par)
 32 :       print "max :",fr+par,stat.max(NAME, fr+par)
 33 :       print "min :",fr+par,stat.min(NAME, fr+par)
 34 :       print "ent :",fr+par,stat.entropy(NAME, fr+par)
 35 :       print "mmt :",fr+par,stat.moment(NAME,  fr+par, 1, 0.0)
 36 : 


--------------------------------
Explanation
--------------------------------

**stat.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON filed.

 * window_size
 
  Specify the amount of value to be retained. (Integer)
  

**stat.py**

  Stat.py reads the 'price', 'weight', 'diameter' of fruits from the .csv file, and send the info. to Jubatus server. The methods used are listed below.
 
 * bool push(0: string name, 1: string key, 2: double val)

  Set the attribute info. "key"'s value with "val".

 * double sum(0: string name, 1: string key)

  Return the summary value in the attribute "key". 

 * double stddev(0: string name, 1: string key)

  Return the standard deviation of values in the attribute "key".

 * double max(0: string name, 1: string key)

  Return the maximum value of values in the attribute "key".

 * double min(0: string name, 1: string key)

  Return the minimum value of values in the attribute "key".

 * double entropy(0: string name, 1: string key)

  Return the entropy of values in the attribute "key".

 * double moment(0: string name, 1: string key, 2: int degree, 3: double center)

  Return the degree-th moment about 'center' of values in the attribute "key".


 For all methods, the first parameter of each method (name) is a string value to uniquely identify a task in the ZooKeeper cluster. When using standalone mode, this must be left blank ("").

 1. Connect to Jubatus Server.

  Connect to Jubatus Server (Row 13).
  Setting the IP addr., RPC port of Jubatus Server.

 2. Prepare the learning data

  StatClient send the <item_name, value> to the server side as training data, by using the push() method.
  In this sample program, the training data are generated from a .CSV file which contains the info. of 'fruit type', 'price', 'weight', 'diameter'.
  The source data is read line by line from the .CSV file (Row 15-22). 

 3. Data training (update the model)

  The training data generated in Step 2 is send to the server site by using the push() method (Row 20-22) for training model there. Items of fruit are renamed as the fruit's name extended with the item's prefix, eg. item for a fruit's diameter is: fruit's name + "dia". 
 
 4. Output the result

  StatClient gets the different statistic results by using its methods.
  For each type of fruits(Row 28), the program outputs its statistic results of all the items (Row 29).
  Different methods are called (Row 30-35) in the loop above. Their contents are listed in the methods list above.
      

-------------------------------------
Run the sample program
-------------------------------------

**[At Jubatus Server]**

 start "jubagraph" process.
 
 ::
 
  $ jubastat --configpath stat.json
 

**[At Jubatus Client]**

 Get the required package and Java client ready.
 
**[Output]**

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
 …
 …(omitted)
