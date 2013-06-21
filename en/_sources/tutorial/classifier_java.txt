Java
==========================

Here we explain the sample program of Classifier. 

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'gender.json'; 2) how to learn the training data and make predictions based on them, with the example file ‘GenderMain.java’. Here are the source codes of 'gender.json' and 'GenderMain.java'.

**gender.json**

.. code-block:: java

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

**GenderMain.java**

.. code-block:: java

 001: package us.jubat.example.gender;
 
 002: import java.util.ArrayList;
 003: import java.util.Arrays;
 004: import java.util.List; 

 005: import us.jubat.classifier.ClassifierClient;
 006: import us.jubat.classifier.Datum;
 007: import us.jubat.classifier.EstimateResult;
 008: import us.jubat.classifier.TupleStringDatum;
 009: import us.jubat.classifier.TupleStringDouble;
 010: import us.jubat.classifier.TupleStringString;
 
 011: public class GenderMain {
 
 012: 	private static TupleStringString makeStringTuple(String first, String second) {
 013:		TupleStringString t = new TupleStringString();
 014:		t.first = first;
 015:		t.second = second;
 016:		return t;
 017:	} 
 
 018:	private static TupleStringDouble makeDoubleTuple(String first, double second) {
 019:		TupleStringDouble t = new TupleStringDouble();
 020:		t.first = first;
 021:		t.second = second;
 022:		return t;
 023:	}   

 024:	private static Datum makeDatum(String hair, String top, String bottom,
 025:			double height) {
 026:		Datum d = new Datum();
 027:		d.string_values = new ArrayList<TupleStringString>();
 028:		d.string_values.add(makeStringTuple("hair", hair));
 029:		d.string_values.add(makeStringTuple("top", top));
 030:		d.string_values.add(makeStringTuple("bottom", bottom));

 031:		d.num_values = new ArrayList<TupleStringDouble>();
 032:		d.num_values.add(makeDoubleTuple("height", height));
 033:		return d;
 034:	}

 035:	private static TupleStringDatum makeTrainDatum(String label, String hair,
 036:			String top, String bottom, double height) {
 037:		TupleStringDatum t = new TupleStringDatum();
 038:		t.first = label;
 039:		t.second = makeDatum(hair, top, bottom, height);
 040:		return t;
 041:	}

 042:	public static void main(String[] args) throws Exception {
 043:		String host = "127.0.0.1";
 044:		int port = 9199;
 045:		String name = "test";

 046:		ClassifierClient client = new ClassifierClient(host, port, 1.0);

 047:		TupleStringDatum[] trainData = { //
 048:				makeTrainDatum("male", "short", "sweater", "jeans", 1.70),
 049:				makeTrainDatum("female", "long", "shirt", "skirt", 1.56),
 050:				makeTrainDatum("male", "short", "jacket", "chino", 1.65),
 051:				makeTrainDatum("female", "short", "T shirt", "jeans", 1.72),
 052:				makeTrainDatum("male", "long", "T shirt", "jeans", 1.82),
 053:				makeTrainDatum("female", "long", "jacket", "skirt", 1.43),
 054:				// makeTrainDatum("male", "short", "jacket", "jeans", 1.76),
 055:				// makeTrainDatum("female", "long", "sweater", "skirt", 1.52),
 056:				};

 057:		client.train(name, Arrays.asList(trainData));

 058:		Datum[] testData = { //
 059:		makeDatum("short", "T shirt", "jeans", 1.81),
 060:				makeDatum("long", "shirt", "skirt", 1.50), };

 061:		List<List<EstimateResult>> results = client.classify(name,
 062:				Arrays.asList(testData));

 063:		for (List<EstimateResult> result : results) {
 064:			for (EstimateResult r : result) {
 065:				System.out.printf("%s %f\n", r.label, r.score);
 066:			}
 067:			System.out.println();
 068:		}
		
 069:		System.exit(0);
 070:	}
 071:}

 
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
   
   
**GenderMain.java**

We explain the learning and prediction processes in this example codes.

First of all, to write the Client program for Classifier, we can use the ClassifierClient class defined in 'us.jubat.classifier'. There are two methods used in this program. The 'train' method for learning process, and the 'classify' method for prediction with the data learnt.

 1. How to connect to Jubatus Server

  Connect to Jubatus Server (Row 46).
  Setting the IP addr., RPC port of Jubatus Server, and the connection waiting time.

 2. Prepare the learning data

  Make a dataset for the data to be learnt <TupleStringDatum>(Row 47).
  
  The dataset is input into the train() method in ClassifierClient, for the learning process. The figure below shows the structure of the data being leant.

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



  TupleStringDatum contains the Datum and its label. In this sample, the label demonstrates the class name each Datum belongs to. Each Datum stores the data in key-value pairs, which is the format readable by Jubatus. The key can be recognized as the feature vector. Inside the Datum, there are two kinds of key-value lists, string_values and num_values, which are defined by the TupleStringString class and TupleStringDouble class. For example, the "hair", "top", "bottom" values are in string format, thus these data are stored within the string_values list. While the "height"'s value is stored in num_values list.
  
  Here is the procedure of making study data.

  To make study data, the private method "makeTrainDatum" is used (Row 47-56). An arrayList of TupleStringDatum is declared (Row 37). Then the data in the format as defined in TupleStringDatum class is generated.

  TupleStringString and TupleStringDouble lists are declared in line Row 27 and 31, respectively, and stored in "Datum". Then, by using the method "makeDatum", data to be studied is stored in the two key-value lists, due to their different data types (Row 24-34).

  In this example, the key-value lists in TupleStringString format have the kyes of "hair", "top", and "bottom"; and their values, for example, are "short", "sweater", and "jeans". The key-value list in TupleStringDatum format have the key of "height", and its value, for example, "1.70" (Row 48). 

  According to the flow above, the training data is generated (Row 47-56). 

  
 3. Model training (update learning model)

  We train our learning model by using the method train() at Row 57, with the data generated in step.2 above. The first parameter in train() is the unique name for task identification in Zookeeper.

 4. Prepare the prediction data

  Different from training data, prediction data does not contain "lable", and it is only stored in the Datum unit by using makeDatum() (Row 58-60). 

 5. Data prediction

  By inputting the testdata arraylist generated in step.4 into the classify() method of ClassifierClient (Row 61-62), the prediction result will be stored in the EstimateResult list (Row 63), and each r.label, r.score stands for the prediction result and the confidence of each input testdata respectively (Row 65).



------------------------------------
Run the sample program
------------------------------------

［At Jubatus Server］
 start "jubaclassifier" process.

::

 $ jubaclassifier --configpath gender.json

［At Jubatus Client］
 Get the required package and Java client ready.
 Run!

