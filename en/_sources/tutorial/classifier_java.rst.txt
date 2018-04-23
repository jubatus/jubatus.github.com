Java
==========================

Here we explain the Java sample program of Classifier.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'gender.json'; 2) how to learn the training data and make predictions based on them, with the example file ‘GenderMain.java’. Here are the source codes of 'gender.json' and 'GenderMain.java'.

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

**GenderMain.java**

.. code-block:: java
 :linenos:

 package us.jubat.example.gender;

 import java.util.ArrayList;
 import java.util.Arrays;
 import java.util.List;

 import us.jubat.classifier.ClassifierClient;
 import us.jubat.classifier.EstimateResult;
 import us.jubat.classifier.LabeledDatum;
 import us.jubat.common.Datum;

 public class GenderMain {

     private static Datum makeDatum(String hair, String top, String bottom,
             double height) {
         return new Datum().addString("hair", hair)
             .addString("top", top)
             .addString("bottom", bottom)
             .addNumber("height", height);
     }

     private static LabeledDatum makeTrainDatum(String label, String hair,
             String top, String bottom, double height) {
         return new LabeledDatum(label, makeDatum(hair, top, bottom, height));
     }

     public static void main(String[] args) throws Exception {
         String host = "127.0.0.1";
         int port = 9199;
         String name = "test";

         ClassifierClient client = new ClassifierClient(host, port, name, 1);

         LabeledDatum[] trainData = { //
         makeTrainDatum("male", "short", "sweater", "jeans", 1.70),
                 makeTrainDatum("female", "long", "shirt", "skirt", 1.56),
                 makeTrainDatum("male", "short", "jacket", "chino", 1.65),
                 makeTrainDatum("female", "short", "T shirt", "jeans", 1.72),
                 makeTrainDatum("male", "long", "T shirt", "jeans", 1.82),
                 makeTrainDatum("female", "long", "jacket", "skirt", 1.43),
                 // makeTrainDatum("male", "short", "jacket", "jeans", 1.76),
                 // makeTrainDatum("female", "long", "sweater", "skirt", 1.52),
                 };

         client.train(Arrays.asList(trainData));

         Datum[] testData = { //
         makeDatum("short", "T shirt", "jeans", 1.81),
                 makeDatum("long", "shirt", "skirt", 1.50), };

         List<List<EstimateResult>> results = client.classify(
                 Arrays.asList(testData));

         for (List<EstimateResult> result : results) {
             for (EstimateResult r : result) {
                 System.out.printf("%s %f\n", r.label, r.score);
             }
             System.out.println();
         }

         System.exit(0);
     }
 }

--------------------------------
Explanation
--------------------------------

**gender.json**

This JSON file give the configuration information. Here are the meanings of the JSON fields.

* method
    Specify the algorithm used in classification. In this example, the AROW (Adaptive Regularization of Weight vectors) algorithm is used.
    Note that this part is irrelevant to the client methods in the Java code.

* converter
    Specify the configurations in feature converter.

    In this sample, we will classify a person into male or female based on the features of 'length of hair', 'top clothes', 'bottom clothese' and 'height'. The "string_values" and "num_values" are stored in key-value pairs without using "\*_filter_types" configuration.
    Note that we do not have configuration for"binary_values" since there is no binary feature.

* parameter
    Specify the parameter that is passed to the algorithm.

    The parameter set varies depending on the selected method. Since we use 'AROW' in this example, we set [regularization_weight: 1.0]. 

    Note that the parameter 'regularization_weight', which represents sensitivity to model change, plays different roles and affects differently among different algorithms. Pay attention to choose an appopriate value for each algorithm. 
    In general, when the 'regularization_weight' parameter is large. the model fast converges to a better model, while it is also poor at handling noise.

**GenderMain.java**

We explain the learning and prediction processes.

To write the Client program for Classifier, we can use the ClassifierClient class defined in 'us.jubat.classifier' package. There are two important client methods used in this program, 'train' method for learning process, and 'classify' method for prediction with the trained model.

1. How to connect to Jubatus Server
    Connect to Jubatus Server (Line 32).

    Setting the IP addr, RPC port number of Jubatus Server, the unique name for task identification in Zookeeper, and the request timeout.

2. Prepare the training data
    Make a training dataset (Line 34-43).

    The dataset is input into the train() method in ClassifierClient, for the learning process. The figure below shows the structure of the training data.

    +----------------------------------------------------------------------------------------------------+
    |LabeledDatum[]                                                                                      |
    +-------------+--------------------------------------------------------------------------------------+
    |label(String)|Datum                                                                                 |
    +-------------+----------------------------+----------------------------+----------------------------+
    |             |List<StringValue>           |List<NumValue>              |List<BinaryValue>           |
    +-------------+------------+---------------+------------+---------------+------------+---------------+
    |             |key(String) |value(String)  |key(String) |value(double)  |key(String) |value(byte[])  |
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

    trainData is an array of LabeledDatum. LabeledDatum is a pair of Datum and its class label. In this sample, the label demonstrates the class name to which each Datum belongs. Each Datum is represented as key-value pairs, which are the data format that Jubatus can read. The key can be recognized as the name of the feature, and the value is the feature value. Inside the Datum, there can be three kinds of key-value lists, string_values, num_values and binary_values. They use the StringValue class, the NumValue class, and the BinaryValue class, respectively. For example, the "hair", "top", and "bottom" values are StringValue, while the "height" value is NumValue. Therefore, they are stored separately inside the Datum.

    Here is the procedure of making training data.

    To make training data, the private method "makeTrainDatum" is used (Line 22-25).

    In this example, the key-value lists for string_values have the keys of "hair", "top", and "bottom". Their string values are registered in addString method. for instance, "short", "sweater", and "jeans", respectively. In addition, the key-value list for num_values has the key of "height", and its double type value is registered in addNumber method, for instance, 1.70 (Line 16-19).

    Based on this flow, the training dataset is generated.

3. Model training (update learning model)
    We train our model by using the client method train() (Line 45), with the data generated in Step 2.

4. Prepare the test data
    We generate test dataset in the same way with Step 2.

    Different from the training data, test data does not contain class label, so that only Datum unit is generated by using makeDatum() (Line 14-20).

5. Prediction based on trained model
    By inputting the test tata generated in Step 4 into the classify() method of ClassifierClient (Line 51-52), the prediction result will be stored in the list of EstimateResult (Line 55). Each EstimateResult contains a pair of label and score that represents the confidence of belonging to the label, for all of the labels (Line 56).


------------------------------------
Run the sample program
------------------------------------

* For Jubatus Server
    start "jubaclassifier" process.

    ::

     $ jubaclassifier --configpath gender.json

* For Jubatus Client
    Get the required package and Java client ready and run.
