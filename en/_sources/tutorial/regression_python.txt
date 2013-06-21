Python
================================

Here we explain the sample program of Regression in Python.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'rent.json'; 2) how to train and predict by 'main.py' with the training data in 'rent-data.csv' file and the estimation data in 'myhome.yml' file. Here are their source codes.


**rent.json**

.. code-block:: python

 01 : {
 02 :   "method": "PA",
 03 :   "converter": {
 04 :     "num_filter_types": {},
 05 :     "num_filter_rules": [],
 06 :     "string_filter_types": {},
 07 :     "string_filter_rules": [],
 08 :     "num_types": {},
 09 :     "num_rules": [
 10 :       { "key": "*", "type": "num" }
 11 :     ],
 12 :     "string_types": {},
 13 :     "string_rules": [
 14 :       { "key": "aspect", "type": "str", "sample_weight": "bin", "global_weight": "bin" }
 15 :     ]
 16 :   },
 17 :   "parameter": {
 18 :     "sensitivity": 0.1,
 19 :     "regularization_weight": 3.402823e+38
 20 :   }
 21 : }

**main.py**

.. code-block:: python

 01 : import argparse
 02 : import yaml
 03 : 
 04 : from jubatus.regression.client import regression
 05 : from jubatus.regression.types import *
 06 : from jubahomes.version import get_version
 07 : 
 08 : def parse_options():
 09 :   parser = argparse.ArgumentParser()
 10 :   parser.add_argument(
 11 :     '-a',
 12 :     required = True,
 13 :     help     = 'analyze data file (YAML)',
 14 :     metavar  = 'FILE',
 15 :     dest     = 'analyzedata'
 16 :   )
 17 :   parser.add_argument(
 18 :     '-t',
 19 :     help     = 'train data file (CSV)',
 20 :     metavar  = 'FILE',
 21 :     dest     = 'traindata'
 22 :   )
 23 :   parser.add_argument(
 24 :     '-v',
 25 :     '--version',
 26 :     action   = 'version',
 27 :     version  = '%(prog)s ' + get_version()
 28 :   )
 29 :   return parser.parse_args()
 30 : 
 31 : def main():
 32 :   args = parse_options()
 33 :   # 1. Connect to Jubatus Server
 34 :   client = regression('127.0.0.1', 9199)
 35 : 
 36 :   # 2. Prepare the training data
 37 :   num = 0
 38 :   if args.traindata:
 39 :     with open(args.traindata, 'r') as traindata:
 40 :       for data in traindata:
 41 : 
 42 :         # skip comments
 43 :         if not len(data) or data.startswith('#'):
 44 :           continue
 45 :         num += 1
 46 : 
 47 :         rent, distance, space, age, stair, aspect = map(str.strip, data.strip().split(','))
 48 :         string_values = [
 49 :           ['aspect', aspect]
 50 :         ]
 51 :         num_values = [
 52 :           ['distance', float(distance)],
 53 :           ['space', float(space)],
 54 :           ['age', float(age)],
 55 :           ['stair', float(stair)]
 56 :         ]
 57 :         d = datum(string_values, num_values)
 58 :         train_data = [[float(rent), d]]
 59 : 
 60 :         # 3. Model training (update model)
 61 :         client.train('', train_data)
 62 : 
 63 :     # print train number
 64 :     print 'train ...', num
 65 : 
 66 :   # 4. Prepare predict data
 67 :   with open(args.analyzedata, 'r') as analyzedata:
 68 :     myhome = yaml.load(analyzedata)
 69 :     string_values = [
 70 :       ['aspect', str(myhome['aspect'])]
 71 :     ]
 72 :     num_values = [
 73 :       ['distance', float(myhome['distance'])],
 74 :       ['space', float(myhome['space'])],
 75 :       ['age', float(myhome['age'])],
 76 :       ['stair', float(myhome['stair'])]
 77 :     ]
 78 :     d = datum(string_values, num_values)
 79 :     analyze_data = [d]
 80 : 
 81 :     # 5. Predict by the regression model
 82 :     result = client.estimate('', analyze_data)
 83 : 
 84 :     # 6. Output result
 85 :     print 'rent ....', round(result[0], 1)
 86 : 


**myhome.yml**

::

 01 :  #
 02 :  # distance : distance from station (walking time in minutes)
 03 :  # space    : the footprint of the house (m*m)
 04 :  # age      : build age (year)
 05 :  # stair    : floors
 06 :  # aspect   : direction [ N / NE / E / SE / S / SW / W / NW ]
 07 :  #
 08 :  distance : 8
 09 :  space    : 32.00
 10 :  age      : 15
 11 :  stair    : 5
 12 :  aspect   : "S"


--------------------------------
Explanation
--------------------------------

**rent.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON filed.

* method

  Specify the algorithm used in regression. 
  Currently, we have "PA" (Passive Aggressive) only, so we specify it with "PA".

* converter

 Specify the configurations in feature converter.
 In this example, we will set the "num_rules" and "string_rules".
 
 "num_rules" are used to specify the extraction rules of numercial features.
 "key" is "*", it means all the "key" are taken into consideration, "type" is "num", it means the number(value) specified will be directly used as the input for training the model. 
 For example, if the "age = 2", use 2 as the input; if the "stair = 6", use 6 as the input.

 "string_rules" are used to specify the extraction rules of string features.
 Here, "key = aspect", "type = str", "sample_weight = bin", and "global_weight = bin".
 Their meaning are: the "aspect" is treated as a string, and used as the input feature without reform; the weight of each key-value feature is specified to be "1"; and the global weight of each feature is specified to be "1".

* parameter

 Specify the parameters to be passed to the algorithm.
 The method specified here is "PA", with its configuration as ""sensitivity" and "regularization_weight".
 
 "sensitivity" specifies the tolerable range of error. When its value increases, it becomes resistant to noise, but makes errors remain easily instead.
 "regularization_weight" specifies the sensitivity parameter in the learning. When its value increases, the learning becomes faster, but the method become susceptible to the noise.
 
 In addition, the "regularization_weight" above plays various roles in different algorithms, so please be careful in configuring its values in different algorithms.


**main.py**


We explain the learning and prediction processes in this example codes.

 To write the Client program for Regression, we can use the RegressionClient class defined in 'jubatus.regression'. There are two methods used in this program. The 'train' method for learning process, and the 'estimate' method for prediction with the data learnt.
 
 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 34)
  Setting the IP addr. and RPC port of Jubatus Server.

 2. Prepare the training data

  In this sample program, only if the training data source (CSV file) is specified by the option "-t", processes of step 2-3 is taken. Here we explain these processes.

  RegressionClient puts the training data into the List of list<tuple<float, datum>>, and sends the data to train() methods for the model training.
  In this example, the training data is generated from the CSV file that privided by a housing rental website. 
  Factors in the rental information includes rent, aspect, distance, space, age and stairs.
  Figure below shows the training data. (The following are four examples from over one hundred housing info. listed in the rent-data.csv)

  
  +------------------------------------------------------------------------+
  |                         list<tuple<float, datum>>                      |
  +-------------+----------------------------------------------------------+
  |label(Float) |Datum                                                     |
  |             +----------------------------+-----------------------------+
  |             |list<tuple<string, string>> |list<tuple<string, double>>  |
  |             +------------+---------------+---------------+-------------+
  |             |key(String) |value(String)  |key(String)    |value(double)|
  +=============+============+===============+===============+=============+
  |5.0          |"aspect"    |"SW"           | | "distance"  | | 10        |
  |             |            |               | | "space"     | | 20.04     |
  |             |            |               | | "age"       | | 12        |
  |             |            |               | | "stair"     | | 1         |
  +-------------+------------+---------------+---------------+-------------+
  |6.3          |"aspect"    |"N"            | | "distance"  | | 8         |
  |             |            |               | | "space"     | | 21.56     |
  |             |            |               | | "age"       | | 23        |
  |             |            |               | | "stair"     | | 2         |
  +-------------+------------+---------------+---------------+-------------+
  |7.5          |"aspect"    |"SE"           | | "distance"  | | 25        |
  |             |            |               | | "space"     | | 22.82     |
  |             |            |               | | "age"       | | 23        |
  |             |            |               | | "stair"     | | 4         |
  +-------------+------------+---------------+---------------+-------------+
  |9.23         |"aspect"    |"S"            | | "distance"  | | 10        |
  |             |            |               | | "space"     | | 30.03     |
  |             |            |               | | "age"       | | 0         |
  |             |            |               | | "stair"     | | 2         |
  +-------------+------------+---------------+---------------+-------------+

  Tuple<float, datum> contains 2 fields, "Datum" and the "label".
  "Datum" is composed of key-value data which could be processed by Jubatus, and there are 2 types of key-value data format.
  In the first type, both the "key" and "value" are in string format (string_values); in the second one, the "key" is in string format, but the "value" is in numerical format (num_values).
  These two types are represented in list<tuple<string, string>> and list<tuple<string, double>>, respectively.

  | Please have a view of the first data in this table as an example. Because the "aspect" is in string format, it is stored in the first list of the list<tuple<string, string>>.
  | in which, the key is set as "aspect", value is set as "SW".
  | Because other items are numerical, they are stored in the list of the list<tuple<string, double>>, in which
  | the first list's key is set as "distance" and value is set as "10",
  | the second list's key is set as "space" and value is set as "20.04",
  | the third list's key is set as "age" and value is set as "15",
  | the fourth list's key is set as "stair" and value is set as "1".

  The Datum of these 5 Lists is appended with a label of "5.0", as its rent, and forms an instance of tuple<float, datum> which retains the rent (of 5.0 * 10,000) and its corresponding housing condition info.
  Thus, the housing rental data are generated in the format of (tuple<float, datum>) List, as the training data to be used.

  Here is the detailed process for making the training data in this sample.
  
  First, declare the variable of training data "trainDat", as a TupleFloatDatum List (Row 39).
  Next, read the source file (CSV file) of the training data line by line (Row 40-61).
  Split the data read from each line in CSV file, by the ',' mark (Row 47).

  The string items and double items are stored into the Datum components of string_values and num_values (Row 48-56), respectively. Then, a Datum class is generated by datum() method (Row 57). Finally, the Datum is appended with the rent label, so as to be used as one piece of training data (argument 'train' in Row 58).
  
 3. Model Training (update learning model

  Input the training data generated in step.2 into the train() method (Row 61).
  The first parameter in train() is the unique name for task identification in Zookeeper.
  (use null charactor "" for the stand-alone mode)
  The second parameter specifies the trainData generated in step.2.
 
 4. Prepare the prediction data 

  Prepare the prediction data in the similar way of training Datum creation.
  Here, we generate the data for prediction by using the YAML file (please download the library `JYaml <http://jyaml.sourceforge.net/download.html>`_ )
  YAML is one kind of data format, in which objects and structure data are serialized.
  
  Read the YAML file (myhome.yml) by yaml.load() and get the return value in dict type (Row 68).
  Generate the prediction Datum by using the simliar process as in step 2 (Row 69-78).
  
  Add the Datum into the prediction data list, and send it into the estimate() method in "RegressionClient" for prediction.
  
 5. Prediction by the regression model

  The prediction results are returned as a list by the estimate() method (Row 82).

 6. Output the result

  The prediction results are returned in the same order of the prediction data. (In this sample, only one prediction data is used, thus only one result is returned.)
  The result is rounded at 2nd decimal for output, because it is in Float type (Row 85).


------------------------------------
Run the sample program
------------------------------------

**［At Jubatus Server］**
 
 start "jubaregression" process.


 ::

  $ jubaregression --configpath rent.json


**［At Jubatus Client］**

 Install the command line aplication for using this sample program.

 ::

  $ sudo python setup.py install

 Specify the option by using the command below.	
 
 ::

  $ jubahomes -t dat/rent-data.csv -a dat/myhome.yml


 **-t** ：CSV file name (if there is training data)

 **-a** ：YML file name (required)

**［Result］**


 ::

  train ... 145
  rent .... 9.9

 You can change the dat/myhome.yaml file to predict housing rent under various conditions.

 ::

  $ edit dat/myhome.yml
  $ jubahomes -a dat/myhome.yml
  $ edit dat/myhome.yml
  $ jubahomes -a dat/myhome.yml
    :

