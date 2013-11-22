Python
==========================

Here we explain the Python sample program of Classifier.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'gender.json'; 2) how to learn the training data and make predictions based on them, with the example file ‘gender.py’. Here are the source codes of 'gender.json' and 'gender.py'.


**gender.json**

.. code-block:: js
 :linenos:

 {
   "method": "AROW",
   "converter": {
     "num_filter_types": {},
     "num_filter_rules": [],
     "string_filter_types": {},
     "string_filter_rules": [],
     "num_types": {},
     "num_rules": [],
     "string_types": {
       "unigram": { "method": "ngram", "char_num": "1" }
     },
     "string_rules": [
       { "key": "*", "type": "unigram", "sample_weight": "bin", "global_weight": "bin" }
     ]
   },
   "parameter": {
     "regularization_weight" : 1.0
   }
 }

**gender.py**

.. code-block:: python
 :linenos:

 #!/usr/bin/env python

 host = '127.0.0.1'
 port = 9199
 name = 'test'

 import jubatus
 from jubatus.common import Datum

 client = jubatus.Classifier(host, port, name)

 train_data = [
     (   ('male',   Datum({'hair': 'short', 'top': 'sweater', 'bottom': 'jeans', 'height': 1.70})),
     ('female', Datum({'hair': 'long',  'top': 'shirt',   'bottom': 'skirt', 'height': 1.56})),
     ('male',   Datum({'hair': 'short', 'top': 'jacket',  'bottom': 'chino', 'height': 1.65})),
     ('female', Datum({'hair': 'short', 'top': 'T shirt', 'bottom': 'jeans', 'height': 1.72})),
     ('male',   Datum({'hair': 'long',  'top': 'T shirt', 'bottom': 'jeans', 'height': 1.82})),
     ('female', Datum({'hair': 'long',  'top': 'jacket',  'bottom': 'skirt', 'height': 1.43})),
 #    ('male',   Datum({'hair': 'short', 'top': 'jacket',  'bottom': 'jeans', 'height': 1.76})),
 #    ('female', Datum({'hair': 'long',  'top': 'sweater', 'bottom': 'skirt', 'height': 1.52})),
     ]

 client.train(train_data)

 test_data = [
      Datum({'hair': 'short', 'top': 'T shirt', 'bottom': 'jeans', 'height': 1.81}),
      Datum({'hair': 'long',  'top': 'shirt',   'bottom': 'skirt', 'height': 1.50}),
 ]

 results = client.classify(test_data)

 for result in results:
     for r in result:
         print(r.label, r.score)
     print


--------------------------------
Explanation
--------------------------------

**gender.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON filed.

* method
    Specify the algorithm used in Classification. In this example, the AROW (Adaptive Regularization of Weight vectors) is used.

* converter
    Specify the configurations in feature converter. In this sample, we will classify a person into male or female through the features of 'length of hair', 'top clothes', 'bottom clothese' and 'height'. The "string_values" and "num_values" are stored in key-value pairs without using "\*_filter_types" configuration.

* parameter
    Specify the parameter that passed to the algorithm. The parameter varies when the method is changed. In this example, the method is specified as 'AROW', with [regularization_weight: 1.0]. In addition, the parameter 'regularization_weight' in different algorithms plays different roles and affects differently, so please pay attention to setting the value of it for each algorithm. When 'regularization_weight' parameter becomes bigger, the learning spead will increase, while the noice will decrease.

**gender.py**

We explain the learning and prediction processes in this example codes.

First of all, to write the Client program for Classifier, we can use the ClassifierClient class defined in 'jubatus.Classifier'. There are two methods used in this program. The 'train' method for learning process, and the 'classify' method for prediction with the data learnt.

1. How to connect to Jubatus Server
    Connect to Jubatus Server (Line 10).

    Setting the IP addr, RPC port of Jubatus Server and the unique name for task identification in Zookeeper.

2. Prepare the learning data
    Make a train_data array list for the data to be learnt (Line 12-21).

    The dataset is input into the train() method (Line 23), for the learning process. The figure below shows the structure of the data being leant.

    +----------------------------------------------------------------------------------------------------+
    |list<tuple<string, Datum>>                                                                          |
    +-------------+--------------------------------------------------------------------------------------+
    |label(string)|Datum                                                                                 |
    +-------------+----------------------------+----------------------------+----------------------------+
    |             |list<tuple<string, string>> |list<tuple<string, double>> |list<tuple<string, string>> |
    +-------------+------------+---------------+------------+---------------+------------+---------------+
    |             |key(string) |value(string)  |key(string) |value(double)  |key(string) |value(string)  |
    +=============+============+===============+============+===============+============+===============+
    |"male"       | | "hair"   | | "short"     | "height"   | 1.70          |            |               |
    |             | | "top"    | | "sweater"   |            |               |            |               |
    |             | | "bottom" | | "jeans"     |            |               |            |               |
    +-------------+------------+---------------+------------+---------------+------------+---------------+
    |"female"     | | "hair"   | | "long"      | "height"   | 1.56          |            |               |
    |             | | "top"    | | "shirt"     |            |               |            |               |
    |             | | "bottom" | | "skirt"     |            |               |            |               |
    +-------------+------------+---------------+------------+---------------+------------+---------------+
    |"male"       | | "hair"   | | "short"     | "height"   | 1.65          |            |               |
    |             | | "top"    | | "jacket"    |            |               |            |               |
    |             | | "bottom" | | "chino"     |            |               |            |               |
    +-------------+------------+---------------+------------+---------------+------------+---------------+
    |"female"     | | "hair"   | | "short"     | "height"   | 1.72          |            |               |
    |             | | "top"    | | "T shirt"   |            |               |            |               |
    |             | | "bottom" | | "jeans"     |            |               |            |               |
    +-------------+------------+---------------+------------+---------------+------------+---------------+
    |"male"       | | "hair"   | | "long"      | "height"   | 1.82          |            |               |
    |             | | "top"    | | "T shirt"   |            |               |            |               |
    |             | | "bottom" | | "jeans"     |            |               |            |               |
    +-------------+------------+---------------+------------+---------------+------------+---------------+
    |"female"     | | "hair"   | | "long"      | "height"   | 1.43          |            |               |
    |             | | "top"    | | "jacket"    |            |               |            |               |
    |             | | "bottom" | | "skirt"     |            |               |            |               |
    +-------------+------------+---------------+------------+---------------+------------+---------------+

    train_data is the list of Datum and its label. In this sample, the label demonstrates the class name each Datum belongs to. Each Datum stores the data in key-value pairs, which is the format readable by Jubatus. The key can be recognized as the feature vector. Inside the Datum, there are 3 kinds of key-value lists, string_values, num_values and binary_values. For example, the "hair", "top", "bottom" values are in string format, While the "height" value is in numeric format. Therefore, they are stored separately inside each Datum.

3. Model training (update learning model)
    We train our learning model by using the method train() at Line 23, with the data generated in step.2 above.

4. Prepare the prediction data
    Different from training data, prediction data does not contain its "lable", and it is only stored in the Datum unit (Line 25-28).

5. Data prediction
    By inputting the test_data list generated in step.4 into the classify() method (Line 30), the prediction result will be stored in the result list (Line 32). The prediction result contains label and score means the confidence of each label (Line 34).


------------------------------------
Run the sample program
------------------------------------

* At Jubatus Server
    start "jubaclassifier" process.

    ::

     $ jubaclassifier --configpath gender.json

* At Jubatus Client
    ::

     $ python gender.py
