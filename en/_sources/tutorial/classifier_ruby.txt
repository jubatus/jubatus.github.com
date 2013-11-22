Ruby
==========================

Here we explain the Ruby sample program of Classifier.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'gender.json'; 2) how to learn from the training data and make predictions based on them, with the example file ‘gender.rb’. Here are the source codes of 'gender.json' and 'gender.rb'.


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


**gender.rb**

.. code-block:: ruby
 :linenos:

 #!/usr/bin/env ruby

 host = "127.0.0.1"
 port = 9199
 name = "test"

 require 'jubatus/classifier/client'

 client = Jubatus::Classifier::Client::Classifier.new(host, port, name)

 train_data =
   [
    ["male",   Jubatus::Common::Datum.new("hair" => "short", "top" => "sweater", "bottom" => "jeans", "height" => 1.70)],
    ["female", Jubatus::Common::Datum.new("hair" => "long",  "top" => "shirt",   "bottom" => "skirt", "height" => 1.56)],
    ["male",   Jubatus::Common::Datum.new("hair" => "short", "top" => "jacket",  "bottom" => "chino", "height" => 1.65)],
    ["female", Jubatus::Common::Datum.new("hair" => "short", "top" => "T shirt", "bottom" => "jeans", "height" => 1.72)],
    ["male",   Jubatus::Common::Datum.new("hair" => "long",  "top" => "T shirt", "bottom" => "jeans", "height" => 1.82)],
    ["female", Jubatus::Common::Datum.new("hair" => "long",  "top" => "jacket",  "bottom" => "skirt", "height" => 1.43)],
 #   ["male",   Jubatus::Common::Datum.new("hair" => "short", "top" => "jacket",  "bottom" => "jeans", "height" => 1.76)],
 #   ["female", Jubatus::Common::Datum.new("hair" => "long",  "top" => "sweater", "bottom" => "skirt", "height" => 1.52)],
   ]

 client.train(train_data)

 test_data =
   [
    Jubatus::Common::Datum.new("hair" => "short", "top" => "T shirt", "bottom" => "jeans", "height" => 1.81),
    Jubatus::Common::Datum.new("hair" => "long",  "top" => "shirt",   "bottom" => "skirt", "height" => 1.50),
   ]

 results = client.classify(test_data)

 results.each { |result|
   result.each { |r|
     puts(r.label + " " + r.score.to_s)
   }
   puts
 }


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

**gender.rb**

We explain the learning and prediction processes in these example codes.

First of all, to write the Client program for Classifier, we can use the Classifier class defined in 'Jubatus::Classifier::Client'. There are two methods used in this program. The 'train' method for learning process, and the 'classify' method for prediction with the data .

1. How to connect to Jubatus Server
    Connect to Jubatus Server (Line 9).

    Setting the IP addr, RPC port of Jubatus Server and the unique name for task identification in Zookeeper.

2. Prepare the training data
    Make a train_data Array for the data to be  (Line 11-21).

    The train_data generated in Array<Array<String, Datum>> format is input into the train() method (Line 23) for learning process. The following table shows the structure of the training data.

    +-------------------------------------------------------------------------------------------------------+
    |Array<Array<String, Datum>>                                                                            |
    +-------------+-----------------------------------------------------------------------------------------+
    |label(String)|Datum                                                                                    |
    +-------------+-----------------------------+-----------------------------+-----------------------------+
    |             |Array<Array<String, String>> |Array<Array<String, Float>>  |Array<Array<String, String>> |
    +-------------+------------+----------------+------------+----------------+------------+----------------+
    |             |key(String) |value(String)   |key(String) |value(Float)    |key(String) |value(String)   |
    +=============+============+================+============+================+============+================+
    |"male"       | | "hair"   | | "short"      | "height"   | 1.70           |            |                |
    |             | | "top"    | | "sweater"    |            |                |            |                |
    |             | | "bottom" | | "jeans"      |            |                |            |                |
    +-------------+------------+----------------+------------+----------------+------------+----------------+
    |"female"     | | "hair"   | | "long"       | "height"   | 1.56           |            |                |
    |             | | "top"    | | "shirt"      |            |                |            |                |
    |             | | "bottom" | | "skirt"      |            |                |            |                |
    +-------------+------------+----------------+------------+----------------+------------+----------------+
    |"male"       | | "hair"   | | "short"      | "height"   | 1.65           |            |                |
    |             | | "top"    | | "jacket"     |            |                |            |                |
    |             | | "bottom" | | "chino"      |            |                |            |                |
    +-------------+------------+----------------+------------+----------------+------------+----------------+
    |"female"     | | "hair"   | | "short"      | "height"   | 1.72           |            |                |
    |             | | "top"    | | "T shirt"    |            |                |            |                |
    |             | | "bottom" | | "jeans"      |            |                |            |                |
    +-------------+------------+----------------+------------+----------------+------------+----------------+
    |"male"       | | "hair"   | | "long"       | "height"   | 1.82           |            |                |
    |             | | "top"    | | "T shirt"    |            |                |            |                |
    |             | | "bottom" | | "jeans"      |            |                |            |                |
    +-------------+------------+----------------+------------+----------------+------------+----------------+
    |"female"     | | "hair"   | | "long"       | "height"   | 1.43           |            |                |
    |             | | "top"    | | "jacket"     |            |                |            |                |
    |             | | "bottom" | | "skirt"      |            |                |            |                |
    +-------------+------------+----------------+------------+----------------+------------+----------------+

    Array<String, Datum> contains the Datum and its label. In this sample, the label means the name of class which each Datum belongs to. Each Datum stores the data in key-value pairs, which is readable format for Jubatus. The key can be recognized as the feature vector. Inside the Datum, there are three kinds of key-value lists, string_values, num_values and binary_values. For example, the "hair", "top" and "bottom" values are in string format, While the "height" value is in numeric format. Therefore, they are stored sepeately inside each Datum.

3. Model training (update learning model)
    We update our learning model by using the method train() at Line 23, with the data generated in step.2 above.

4. Prepare the prediction data
    Different from training data, prediction data does not contain its "lable", and it is only stored in the Datum unit (Line 25-29).

5. Data prediction
    By inputting test_data Array generated in step.4 into the classify() method (Line 31), the prediction result will be stored in the result Array (Line 31. The result contains "label" and "score". "score" means the confidence of each "label" (Line 35).

------------------------------------
Run the sample program
------------------------------------

* At Jubatus Server
    start "jubaclassifier" process.

    ::

     $ jubaclassifier --configpath gender.json

* At Jubatus Client
    ::

     $ ruby gender.rb
