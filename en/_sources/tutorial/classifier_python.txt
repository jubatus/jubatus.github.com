Python
==========================

Here we explain the Python sample program of Classifier. 

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'gender.json'; 2) how to learn the training data and make predictions based on them, with the example file ‘gender.py’. Here are the source codes of 'gender.json' and 'gender.py'.


**gender.json**

.. code-block:: python


 01: {
 02:   "method": "AROW",
 03:   "converter": {
 04:     "num_filter_types": {},
 05:     "num_filter_rules": [],
 06:     "string_filter_types": {},
 07:     "string_filter_rules": [],
 08:     "num_types": {},
 09:     "num_rules": [
 10:        { "key": "*", "type": "num"}
 11:         ],
 12:    "string_types": {
 13:         },
 14:    "string_rules": [
 15:        { "key": "*", "type": "str", "sample_weight": "bin", "global_weight": "bin" }
 16:         ]
 17:     },
 18:   "parameter": {
 19:     "regularization_weight" : 1.0
 20:     }
 21: }




**gender.py**

.. code-block:: python

 01: #!/usr/bin/env python 
 02: host = '127.0.0.1' 
 03: port = 9199 
 04: name = 'test' 

 05: import jubatus 
 06: from jubatus.classifier.types import datum

 07: client = jubatus.Classifier(host, port)

 08: train_data = [
 09:     ('male',   datum([('hair', 'short'), ('top', 'sweater'), ('bottom', 'jeans')], [('height', 1.70)])),
 10:     ('female', datum([('hair', 'long'),  ('top', 'shirt'),   ('bottom', 'skirt')], [('height', 1.56)])),
 11:     ('male',   datum([('hair', 'short'), ('top', 'jacket'),  ('bottom', 'chino')], [('height', 1.65)])),
 12:     ('female', datum([('hair', 'short'), ('top', 'T shirt'), ('bottom', 'jeans')], [('height', 1.72)])),
 13:     ('male',   datum([('hair', 'long'),  ('top', 'T shirt'), ('bottom', 'jeans')], [('height', 1.82)])),
 14:     ('female', datum([('hair', 'long'),  ('top', 'jacket'),  ('bottom', 'skirt')], [('height', 1.43)])),
 15: #    ('male',   datum([('hair', 'short'), ('top', 'jacket'),  ('bottom', 'jeans')], [('height', 1.76)])),
 16: #    ('female', datum([('hair', 'long'),  ('top', 'sweater'), ('bottom', 'skirt')], [('height', 1.52)])),
 17:     ]

 18: client.train(name, train_data)

 19: test_data = [
 20:    datum([('hair', 'short'), ('top', 'T shirt'), ('bottom', 'jeans')], [('height', 1.81)]),
 21:    datum([('hair', 'long'),  ('top', 'shirt'),   ('bottom', 'skirt')], [('height', 1.50)]),
 22: ]

 23: results = client.classify(name, test_data)

 24: for result in results:
 25:     for r in result:
 26:        print r.label, r.score
 27:     print


 

 
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

  Specify the parameter that passed to the algorithm. The parameter varis when the method is changed. In this example, the method is specified as 'AROW', with [regularization_weight: 1.0]. In addition, the parameter 'regularization_weight' in different algorithms plays different roles and affects differently, so please pay attention to setting the value of it for each algorithm. When 'regularization_weight' parameter becomes bigger, the learning spead will increase, while the noice will decrease.
   
   
   
**gender.py**

We explain the learning and prediction processes in this example codes.

First of all, to write the Client program for Classifier, we can use the ClassifierClient class defined in 'jubatus.classifier'. There are two methods used in this program. The 'train' method for learning process, and the 'classify' method for prediction with the data learnt.

 1. How to connect to Jubatus Server

  Connect to Jubatus Server (Row 7).
  Setting the IP addr., RPC port of Jubatus Server.

 2. Prepare the learning data

  Make a train_data array list for the data to be learnt (Row 8-17).
  
  The dataset is input into the train() method (Row 18), for the learning process. The figure below shows the structure of the data being leant.


  +---------------------------------------------------------------------------------------------------------------------+
  |                                                 TupleStringDatum                                                    |
  +-------------+-------------------------------------------------------------------------------------------------------+
  |label(String)|                                                  Datum                                                |
  +-------------+-------------------------+-------------------------+-------------------------+-------------------------+
  |             |TupleStringString        |TupleStringDoubel        |TupleStringString        |TupleStringDoubel        |
  +-------------+-----------+-------------+-----------+-------------+-----------+-------------+-----------+-------------+
  |             |key(String)|value(String)|key(String)|value(String)|key(String)|value(String)|key(String)|value(double)|
  +=============+===========+=============+===========+=============+===========+=============+===========+=============+
  |"Male"       |"hair"     |"short"      |"top"      | "sweater"   |"bottom"   |"jeans"      | "height"  |    1.70     |
  +-------------+-----------+-------------+-----------+-------------+-----------+-------------+-----------+-------------+
  |"Female"     |"hair"     |"long"       |"top"      | "shirt"     |"bottom"   |"skirt"      | "height"  |    1.56     |
  +-------------+-----------+-------------+-----------+-------------+-----------+-------------+-----------+-------------+
  |"Male"       |"hair"     |"short"      |"top"      | "jacket"    |"bottom"   |"chino"      | "height"  |    1.65     |
  +-------------+-----------+-------------+-----------+-------------+-----------+-------------+-----------+-------------+
  |"Female"     |"hair"     |"short"      |"top"      | "T shirt"   |"bottom"   |"jeans"      | "height"  |    1.72     |
  +-------------+-----------+-------------+-----------+-------------+-----------+-------------+-----------+-------------+
  |"Male"       |"hair"     |"long"       |"top"      | "T shirt"   |"bottom"   |"jeans"      | "height"  |    1.82     |
  +-------------+-----------+-------------+-----------+-------------+-----------+-------------+-----------+-------------+

  TupleStringDatum contains the Datum and its label. In this sample, the label demonstrates the class name each Datum belongs to. Each Datum stores the data in key-value pairs, which is the format readable by Jubatus. The key can be recognized as the feature vector. Inside the Datum, there are two kinds of key-value lists, string_values and num_values. For example, the "hair", "top", "bottom" values are in string format, While the "height"'s value is in interger format. Therefore, they are stored sepeately inside each datum.
  
  Here is the procedure of making study data.

  To make study data, the train_data is generated (Row 8-17).

  In this example, each data has its "label" at the begining, and followed by the datum parts including the key-value lists in String:String format and String:Integer format, respecitively. 

 3. Model training (update learning model)

  We train our learning model by using the method train() at Row 18, with the data generated in step.2 above. The first parameter in train() is the unique name for task identification in Zookeeper.

 4. Prepare the prediction data

  Different from training data, prediction data does not contain its "lable", and it is only stored in the datum unit (Row 19-22). 

 5. Data prediction

  By inputting the testdata arraylist generated in step.4 into the classify() method (Row 23), the prediction result will be stored in the result list (Row 24), and each r.label, r.score stands for the prediction result and the confidence of each input testdata respectively (Row 26).


------------------------------------
Run the sample program
------------------------------------

［At Jubatus Server］
 start "jubaclassifier" process.

::

 $ jubaclassifier --configpath gender.json

［At Jubatus Client］

::

 $ python gender.py

