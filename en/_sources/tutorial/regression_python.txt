Python
================================

Here we explain the sample program of Regression in Python.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'rent.json'; 2) how to train and predict by 'main.py' with the training data in 'rent-data.csv' file and the estimation data in 'myhome.yml' file. Here are their source codes.


**rent.json**

.. code-block:: js
 :linenos:

 {
   "method": "PA",
   "converter": {
     "num_filter_types": {},
     "num_filter_rules": [],
     "string_filter_types": {},
     "string_filter_rules": [],
     "num_types": {},
     "num_rules": [
       { "key": "*", "type": "num" }
     ],
     "string_types": {},
     "string_rules": [
       { "key": "aspect", "type": "str", "sample_weight": "bin", "global_weight": "bin" }
     ]
   },
   "parameter": {
     "sensitivity": 0.1,
     "regularization_weight": 3.402823e+38
   }
 }

**main.py**

.. code-block:: python
 :linenos:

 import argparse
 import yaml
 
 from jubatus.common import Datum
 from jubatus.regression.client import Regression
 from jubatus.regression.types import *
 from jubahomes.version import get_version
 
 def parse_options():
   parser = argparse.ArgumentParser()
   parser.add_argument(
     '-a',
     required = True,
     help     = 'analyze data file (YAML)',
     metavar  = 'FILE',
     dest     = 'analyzedata'
   )
   parser.add_argument(
     '-t',
     help     = 'train data file (CSV)',
     metavar  = 'FILE',
     dest     = 'traindata'
   )
   parser.add_argument(
     '-v',
     '--version',
     action   = 'version',
     version  = '%(prog)s ' + get_version()
   )
   return parser.parse_args()
 
 def main():
   args = parse_options()
 
   client = Regression('127.0.0.1', 9199, '')
 
   # train
   num = 0
   if args.traindata:
     with open(args.traindata, 'r') as traindata:
       for data in traindata:
 
         # skip comments
         if not len(data) or data.startswith('#'):
           continue
         num += 1
 
         rent, distance, space, age, stair, aspect = map(str.strip, data.strip().split(','))
         d = Datum({
             'aspect': aspect,
             'distance': float(distance),
             'space': float(space),
             'age': float(age),
             'stair': float(stair) })
         train_data = [[float(rent), d]]
 
         # train
         client.train(train_data)
 
     # print train number
     print 'train ...', num
 
   # anaylze
   with open(args.analyzedata, 'r') as analyzedata:
     myhome = yaml.load(analyzedata)
     d = Datum({
         'aspect': str(myhome['aspect']),
         'distance': float(myhome['distance']),
         'space': float(myhome['space']),
         'age': float(myhome['age']),
         'stair': float(myhome['stair'])
         })
     analyze_data = [d]
     result = client.estimate(analyze_data)
 
     print 'rent ....', round(result[0], 1)


**myhome.yml**

::

 #
 # distance : distance from station (walking time in minutes)
 # space    : the footprint of the house (m*m)
 # age      : build age (year)
 # stair    : floors
 # aspect   : direction [ N / NE / E / SE / S / SW / W / NW ]
 #
 distance : 8
 space    : 32.00
 age      : 15
 stair    : 5
 aspect   : "S"


--------------------------------
Explanation
--------------------------------

**rent.json**

This JSON file give the configuration information. Here are the meanings of the JSON fields.

* method
    Specify the algorithm used in regression.
    Currently, we have 'PA' (Passive Aggressive) only, so we specify it with 'PA'.

* converter
   Specify the configurations in feature converter.

   In this example, we will set the 'num_rules' and 'string_rules'.

   'num_rules' are used to specify the extraction rules of numercial features.
   ``"key" : "*"``, it means all the key are taken into consideration, ``"type" : "num"``, it means the value specified will be directly used as the input for training the model.
   For example, if the "age = 2", use 2 as the input; if the "stair = 6", use 6 as the input.

   'string_rules' are used to specify the extraction rules of string features.
   Here, ``"key" : "aspect", "type : str", "sample_weight : bin", "global_weight : bin"`` .
   Their meaning are the 'aspect' is treated as a string, and used as the input feature without reform; the weight of each key-value feature is specified to be '1'; and the global weight of each feature is specified to be '1'.

* parameter
   Specify the parameters to be passed to the algorithm.
   The method specified here is 'PA', with its configuration as 'sensitivity' and 'regularization_weight'.

   'sensitivity' specifies the tolerable range of error. When its value increases, it becomes resistant to noise, but makes errors remain easily instead.
   'regularization_weight' specifies the sensitivity parameter in the learning.
   In general, when the 'regularization_weight' parameter is large. the model fast converges to a better model, while it is also poor at handling noise.

   In addition, the 'regularization_weight' above plays various roles in different algorithms, so please be careful in configuring its values in different algorithms.


**main.py**


We explain the learning and prediction processes.

To write the Client program for Regression, we can use the Regression class defined in 'jubatus.regression'.
There are two methods used in this program. The 'train' method for learning process, and the 'estimate' method for prediction with the trained model.

1. Connect to Jubatus Server
    Connect to Jubatus Server (Line 35)

    Setting the IP addr, RPC port number of Jubatus Server and the unique name for task identification in Zookeeper.

2. Prepare the training data
    In this sample program, only if the training data source (CSV file) is specified by the option "-t", processes of step 2-3 is taken. Here we explain these processes.

    Regression puts the training data into the List of list<tuple<float, Datum>>, and sends the data to train() methods for the model training.
    In this example, the training data is generated from the CSV file that privided by a housing rental website.
    Factors in the rental information includes rent, aspect, distance, space, age and stairs.
    Figure below shows the training data. (The following are four examples from over one hundred housing info. listed in the rent-data.csv)

    +-----------------------------------------------------------------------------------------------------+
    |                         list<tuple<float, Datum>>                                                   |
    +-------------+---------------------------------------------------------------------------------------+
    |label(float) |Datum                                                                                  |
    |             +----------------------------+-----------------------------+----------------------------+
    |             |list<tuple<string, string>> |list<tuple<string, double>>  |list<tuple<string, string>> |
    |             +------------+---------------+---------------+-------------+------------+---------------+
    |             |key(string) |value(string)  |key(string)    |value(double)|key(string) |value(string)  |
    +=============+============+===============+===============+=============+============+===============+
    |5.0          |"aspect"    |"SW"           | | "distance"  | | 10        |            |               |
    |             |            |               | | "space"     | | 20.04     |            |               |
    |             |            |               | | "age"       | | 12        |            |               |
    |             |            |               | | "stair"     | | 1         |            |               |
    +-------------+------------+---------------+---------------+-------------+------------+---------------+
    |6.3          |"aspect"    |"N"            | | "distance"  | | 8         |            |               |
    |             |            |               | | "space"     | | 21.56     |            |               |
    |             |            |               | | "age"       | | 23        |            |               |
    |             |            |               | | "stair"     | | 2         |            |               |
    +-------------+------------+---------------+---------------+-------------+------------+---------------+
    |7.5          |"aspect"    |"SE"           | | "distance"  | | 25        |            |               |
    |             |            |               | | "space"     | | 22.82     |            |               |
    |             |            |               | | "age"       | | 23        |            |               |
    |             |            |               | | "stair"     | | 4         |            |               |
    +-------------+------------+---------------+---------------+-------------+------------+---------------+
    |9.23         |"aspect"    |"S"            | | "distance"  | | 10        |            |               |
    |             |            |               | | "space"     | | 30.03     |            |               |
    |             |            |               | | "age"       | | 0         |            |               |
    |             |            |               | | "stair"     | | 2         |            |               |
    +-------------+------------+---------------+---------------+-------------+------------+---------------+

    tuple<float, Datum> contains 2 fields, "Datum" and the "label".
    "Datum" is composed of key-value data which could be processed by Jubatus, and there are 3 types of key-value data format.
    In the first type, both the "key" and "value" are in string format (string_values); in the second one, the "key" is in string format, but the "value" is in numerical format (num_values); the last one, the "key" and "value" are in string format(biunary_values), but the "value" is stored binary data.
    These three types are represented in list<tuple<string, string>>, list<tuple<string, double>> and list<tuple<string, string>>, respectively.

    | Please have a view of the first data in this table as an example. Because the "aspect" is in string format, it is stored in the first list of the list<tuple<string, string>>.
    | in which, the key is set as "aspect", value is set as "SW".
    | Because other items are numerical, they are stored in the list of the list<tuple<string, double>>, in which
    | the first list's key is set as "distance" and value is set as "10",
    | the second list's key is set as "space" and value is set as "20.04",
    | the third list's key is set as "age" and value is set as "15",
    | the fourth list's key is set as "stair" and value is set as "1".

    The Datum of these 5 lists is appended with a label of "5.0", as its rent, and forms an instance of tuple<float, Datum> which retains the rent (of 5.0 * 10,000) and its corresponding housing condition info.
    Thus, the housing rental data are generated in the format of (tuple<float, Datum>) list, as the training data to be used.

    Here is the detailed process for making the training data in this sample.

    Next, read the source file (CSV file) of the training data line by line (Line 40-58).
    Split the data read from each line in CSV file, by the ',' mark (Line 48).

    The string items and double items are stored into the Datum consturctor of as a dictionary object (Line 49-55), respectively.
    Finally, the Datum is appended with the rent label, so as to be used as one piece of training data (argument 'train' in Line 55).

3. Model Training (update learning model)
    Input the training data generated in step.2 into the train() method (Line 58).
    The parameter specifies the train_data generated in step.2.

4. Prepare the prediction data
    Prepare the prediction data in the similar way of training Datum creation.
    Here, we generate the data for prediction by using the YAML file (please download the library `JYaml <http://jyaml.sourceforge.net/download.html>`_ )
    YAML is one kind of data format, in which objects and structure data are serialized.

    Read the YAML file (myhome.yml) by yaml.load() and get the return value in dict type (Line 65).
    Generate the prediction Datum by using the simliar process as in step 2 (Line 66-72).

    Add the Datum into the prediction data list, and send it into the estimate() method in "Regression" for prediction.

5. Prediction based on trained model
    The prediction results are returned as a list by the estimate() method (Line 74).

6. Output the result
    The prediction results are returned in the same order of the prediction data. (In this sample, only one prediction data is used, thus only one result is returned.)
    The result is rounded at 2nd decimal for output, because it is in Float type (Line 76).


------------------------------------
Run the sample program
------------------------------------

* For Jubatus Server
    start "jubaregression" process.

    ::

     $ jubaregression --configpath rent.json


* For Jubatus Client
    Install the command line aplication for using this sample program.

    ::

     $ sudo python setup.py install

    Specify the option by using the command below.

    ::

     $ jubahomes -t dat/rent-data.csv -a dat/myhome.yml

       -t ：CSV file name (if there is training data)
       -a ：YML file name (required)

    Result:

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
