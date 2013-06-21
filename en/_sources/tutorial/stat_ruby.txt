Ruby
==================

Here we explain the sample program of Stat in Ruby.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'stat.json'; 2) how to train the model by 'stat.rb'. Here are the source codes.


**stat.json**

.. code-block:: python

 1 : {
 2 :   "window_size": 500
 3 : }
 

**stat.rb**

.. code-block:: ruby

 01 : #!/usr/bin/env ruby
 02 : # -*- coding: utf-8 -*-
 03 : 
 04 : $host = "127.0.0.1"
 05 : $port = 9199
 06 : $name = "test"
 07 : 
 08 : require 'json'
 09 : require 'csv'
 10 : 
 11 : require 'jubatus/stat/client'
 12 : require 'jubatus/stat/types'
 13 : 
 14 : 
 15 : # 1. Connect to Jubatus Server
 16 : client = Jubatus::Stat::Client::Stat.new($host, $port)
 17 : 
 18 : # 2. Prepare the training data
 19 : CSV.open("fruit.csv", "r") do |row|
 20 :   row.each do |item|
 21 :     fruit, diameter, weight, price = item
 22 :     
 23 :     # 3. Data training (update model)
 24 :     client.push($name, fruit+"dia", diameter.to_f)
 25 :     client.push($name, fruit+"wei", weight.to_f)
 26 :     client.push($name, fruit+"pri", price.to_f)
 27 :   end
 28 : end
 29 : 
 30 : client.save($name, "stat.dat")
 31 : client.load($name, "stat.dat")
 32 : 
 33 : # 4. Output result
 34 : for fr in ["orange", "apple", "melon"] do
 35 :   for par in ["dia", "wei", "pri"] do
 36 :     print "sum :", fr+par, " ", client.sum($name, fr+par), "\n"
 37 :     print "sdv :", fr+par, " ", client.stddev($name, fr+par), "\n"
 38 :     print "max :", fr+par, " ", client.max($name, fr+par), "\n"
 39 :     print "min :", fr+par, " ", client.min($name, fr+par), "\n"
 40 :     print "ent :", fr+par, " ", client.entropy($name, fr+par), "\n"
 41 :     print "mmt :", fr+par, " ", client.moment($name, fr+par, 1, 0.0), "\n"
 42 :   end
 43 : end
 44 : 


--------------------------------
Explanation
--------------------------------

**stat.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON filed.

 * window_size
 
  Specify the amount of value to be retained. (Integer)
  

**stat.rb**
 
  Stat.rb reads the 'price', 'weight', 'diameter' of fruits from the .csv file, and send the info. to Jubatus server. The methods used are listed below.
 
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

  Connect to Jubatus Server (Row 16).
  Setting the IP addr., RPC port of Jubatus Server.

 2. Prepare the learning data

  StatClient send the <item_name, value> to the server side as training data, by using the push() method.
  In this sample program, the training data are generated from a .CSV file which contains the info. of 'fruit type', 'price', 'weight', 'diameter'.
  The source data is read line by line from the .CSV file (Row 19-28). 
 
 3. Data training (update the model)

  The training data generated in Step 2 is send to the server site by using the push() method (Row 24-26) for training model there. Items of fruit are renamed as the fruit's name extended with the item's prefix, eg. item for a fruit's diameter is: fruit's name + "dia". 
 
 4. Output the result

  StatClient gets the different statistic results by using its methods.
  For each type of fruits(Row 34), the program outputs its statistic results of all the items (Row 35).
  Different methods are called (Row 36-41) in the loop above. Their contents are listed in the methods list above.
     
 

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
