Java
================================

Here we explain the sample program of Regression in Java. 

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'rent.json'; 2) how to train the model by 'rent.java' with the training data in 'rent-data.csv' file, and how to predict with the estimation data in 'myhome.yml' file. Here are the source codes of 'rent.json', 'rent.java' and 'myhome.yml'.


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

**rent.java**

.. code-block:: java

 001 : package rent;
 002 : 
 003 : import java.io.BufferedReader;
 004 : import java.io.File;
 005 : import java.io.FileNotFoundException;
 006 : import java.io.FileReader;
 007 : import java.io.IOException;
 008 : import java.math.BigDecimal;
 009 : import java.util.ArrayList;
 010 : import java.util.Arrays;
 011 : import java.util.Collections;
 012 : import java.util.List;
 013 : import java.util.Map;
 014 : import java.util.HashMap;
 015 : 
 016 : import org.ho.yaml.Yaml;
 017 : 
 018 : import us.jubat.regression.Datum;
 019 : import us.jubat.regression.RegressionClient;
 020 : import us.jubat.regression.TupleFloatDatum;
 021 : import us.jubat.regression.TupleStringDouble;
 022 : import us.jubat.regression.TupleStringString;
 023 : 
 024 : public class rent {
 025 : 	public static final String HOST = "127.0.0.1";
 026 : 	public static final int PORT = 9199;
 027 : 	public static final String NAME = "rent";
 028 : 	public static final String FILE_PATH = "./src/main/resources/";
 029 : 
 030 : 	// Definie the column name in CSV file
 031 : 	public static String[] CSV_COLUMN = {
 032 : 		"rent",
 033 : 		"distance",
 034 : 		"space",
 035 : 		"age",
 036 : 		"stair",
 037 : 		"aspect"
 038 : 		};
 039 : 
 040 : 	// Item in String type
 041 : 	public static String[] STRING_COLUMN = {
 042 : 		"aspect"
 043 : 		};
 044 : 
 045 : 	// Items in Double type
 046 : 	public static String[] DOUBLE_COLUMN = {
 047 : 		"distance",
 048 : 		"space",
 049 : 		"age",
 050 : 		"stair",
 051 : 		};
 052 : 
 053 : 	public void update(String cvsName) throws Exception {
 054 : 		// 1. Connect to Jubatus Server
 055 : 		RegressionClient client = new RegressionClient(HOST, PORT, 5);
 056 : 
 057 : 		// 2. Prepare the training data
 058 : 		List<TupleFloatDatum> trainData = new ArrayList<TupleFloatDatum> ();
 059 : 		Datum datum = null;
 060 : 
 061 : 		 try {
 062 : 			File csv = new File(FILE_PATH + cvsName ); // CSVデータファイル
 063 : 
 064 : 			BufferedReader br = new BufferedReader(new FileReader(csv));
 065 : 			List<String> strList = new ArrayList<String> ();
 066 : 			List<String> doubleList = new ArrayList<String> ();
 067 : 
 068 : 			String line = "";
 069 : 
 070 : 			// read data line by line, until the last one.
 071 : 			while ((line = br.readLine()) != null) {
 072 : 				strList.clear();
 073 : 				doubleList.clear();
 074 : 				TupleFloatDatum train = new TupleFloatDatum();
 075 : 
 076 : 				// split the data in one line into items
 077 : 				String[] strAry = line.split(",");
 078 : 
 079 : 				// check the number of CSV columns and the comment
 080 : 				if( strAry.length != CSV_COLUMN.length || strAry[0].startsWith("#")){
 081 : 					continue;
 082 : 				}
 083 : 
 084 : 				// make lists for String and Double items
 085 : 				for (int i=0; i<strAry.length; i++) {
 086 : 					if(Arrays.toString(STRING_COLUMN).contains(CSV_COLUMN[i])){
 087 : 						strList.add(strAry[i]);
 088 : 					} else if(Arrays.toString(DOUBLE_COLUMN).contains(CSV_COLUMN[i])){
 089 : 						doubleList.add(strAry[i]);
 090 : 					}
 091 : 				}
 092 : 				// make datum
 093 : 				datum = makeDatum(strList, doubleList);
 094 : 
 095 : 				train.first = Float.parseFloat(strAry[0]);
 096 : 				train.second = datum;
 097 : 
 098 : 				trainData.add(train);
 099 : 			}
 100 : 			br.close();
 101 : 
 102 : 			// shuffle the training data
 103 : 			Collections.shuffle(trainData);
 104 : 
 105 : 			// 3. Data training (update model)
 106 : 			int trainCount = client.train( NAME, trainData);
 107 : 
 108 : 			System.out.print("train ... " + trainCount + "\n");
 109 : 
 110 : 		 } catch (FileNotFoundException e) {
 111 : 			 // catch the exception in File object creation
 112 : 			 e.printStackTrace();
 113 : 		 } catch (IOException e) {
 114 : 			 // catch the exception when closing BufferedReader object
 115 : 			 e.printStackTrace();
 116 : 		 }
 117 : 		return;
 118 : 	}
 119 : 
 120 : 	@SuppressWarnings("unchecked")
 121 : 	public void analyze(String yamlName) throws Exception {
 122 : 		RegressionClient client = new RegressionClient(HOST, PORT, 5);
 123 : 
 124 : 		// 4. Prepare the estimation data
 125 : 		List<Datum> datumList = new ArrayList<Datum> ();
 126 : 		// result list
 127 : 		List<Float> result = new ArrayList<Float> ();
 128 : 
 129 : 		try {
 130 : 			// read the configuration from YAML file
 131 : 			Map<String, Object> hash = (HashMap<String, Object>) Yaml.load(new File(FILE_PATH + yamlName ));
 132 : 
 133 : 			// make the estimation data
 134 : 			datumList.add(makeDatum(hash));
 135 : 
 136 : 			// 5. Predict by the model learned
 137 : 			result.addAll(client.estimate( NAME, datumList));
 138 : 
 139 : 			// change the result into BigDecimal type
 140 : 			BigDecimal bd = new BigDecimal(result.get(0));
 141 : 			// rounding at the 2nd decimal
 142 : 			BigDecimal bd2 = bd.setScale(1, BigDecimal.ROUND_HALF_UP);
 143 : 
 144 : 			// 6. Output result
 145 : 			System.out.print("rent .... " + bd2 );
 146 : 
 147 : 		} catch (FileNotFoundException e) {
 148 : 			 // capture the exception in File object creation.
 149 : 			 e.printStackTrace();
 150 : 		}
 151 : 
 152 : 		return;
 153 : 	}
 154 : 
 155 : 	// Create the lists with the name given in the Datum (for list)
 156 : 	private Datum makeDatum(List<String> strList, List<String> doubleList) {
 157 : 
 158 : 		Datum datum = new Datum();
 159 : 		datum.string_values = new ArrayList<TupleStringString>();
 160 : 		datum.num_values = new ArrayList<TupleStringDouble>();
 161 : 
 162 : 		for( int i = 0 ; i < strList.size() ; i++) {
 163 : 			TupleStringString data = new TupleStringString();
 164 : 			data.first = STRING_COLUMN[i];
 165 : 			data.second = strList.get(i);
 166 : 
 167 : 			datum.string_values.add(data);
 168 : 		}
 169 : 
 170 : 		try {
 171 : 			for( int i = 0 ; i < doubleList.size() ; i++) {
 172 : 				TupleStringDouble data = new TupleStringDouble();
 173 : 				data.first = DOUBLE_COLUMN[i];
 174 : 				data.second = Double.parseDouble(doubleList.get(i));
 175 : 
 176 : 				datum.num_values.add(data);
 177 : 			}
 178 : 		} catch (NumberFormatException e){
 179 : 			e.printStackTrace();
 180 : 			return null;
 181 : 		}
 182 : 
 183 : 		return datum;
 184 : 	}
 185 : 
 186 : 	// Create the lists with the name given in the Datum (for Map)
 187 : 	private Datum makeDatum(Map<String, Object> hash) {
 188 : 
 189 : 		Datum datum = new Datum();
 190 : 		datum.string_values = new ArrayList<TupleStringString>();
 191 : 		datum.num_values = new ArrayList<TupleStringDouble>();
 192 : 
 193 : 		for( int i = 0 ; i < STRING_COLUMN.length ; i++) {
 194 : 			// Insert into Datum only if it is contained by HashMap and not NULL
 195 : 			if( hash.containsKey(STRING_COLUMN[i]) && hash.get(STRING_COLUMN[i]) != null ) {
 196 : 				TupleStringString data = new TupleStringString();
 197 : 
 198 : 				data.first = STRING_COLUMN[i];
 199 : 				data.second = hash.get(STRING_COLUMN[i]).toString();
 200 : 
 201 : 				datum.string_values.add(data);
 202 : 			}
 203 : 		}
 204 : 
 205 : 		try {
 206 : 			for( int i = 0 ; i < DOUBLE_COLUMN.length ; i++) {
 207 : 				// Insert into Datum only if it is contained by HashMap and not NULL
 208 : 				if( hash.containsKey(DOUBLE_COLUMN[i]) && hash.get(DOUBLE_COLUMN[i]) != null ) {
 209 : 					TupleStringDouble data = new TupleStringDouble();
 210 : 
 211 : 					data.first = DOUBLE_COLUMN[i];
 212 : 					data.second = Double.parseDouble(hash.get(DOUBLE_COLUMN[i]).toString());
 213 : 
 214 : 					datum.num_values.add(data);
 215 : 				}
 216 : 			}
 217 : 		} catch (NumberFormatException e){
 218 : 			e.printStackTrace();
 219 : 			return null;
 220 : 		}
 221 : 
 222 : 		return datum;
 223 : 	}
 224 : 
 225 : 	// Main methods
 226 : 	public static void main(String[] args) throws Exception {
 227 : 
 228 : 		if(args.length < 1){
 229 : 			System.out.print("Please set the arguments.\n" +
 230 : 							"1st argument： YML file name (required)\n" +
 231 : 							"2nd argument： CSV file name (when there is training data)\n");
 232 : 			return;
 233 : 		}
 234 : 
 235 : 		// when there is the 2nd argument, start the update method for model training.
 236 : 		if(args.length > 1 && !"".equals(args[1])){
 237 : 			new rent().update(args[1]);
 238 : 		}
 239 : 		if(!"".equals(args[0])){
 240 : 			new rent().analyze(args[0]);
 241 : 		}
 242 : 
 243 : 		System.exit(0);
 244 : 	}
 245 : }
 

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


**rent.java**

We explain the learning and prediction processes in this example.

 To write the Client program for Regression, we can use the RegressionClient class defined in 'us.jubat.regression'. There are two methods used in this program. The 'train' method for learning process, and the 'estimate' method for prediction with the data learnt.
 
 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 55)
  Setting the IP addr., RPC port of Jubatus Server, and the connection waiting time.

 2. Prepare the training data

  RegressionClient puts the training data into a TupleFloatDatum List, and sends the data to train() methods for the model training.
  In this example, the training data is generated from the CSV file that privided by a housing rental website. 
  Factors in the rental information includes rent, aspect, distance, space, age and stairs.
  Figure below shows the training data. (The following are four examples from over one hundred housing info. listed in the rent-data.csv)
  
  +----------------------------------------------------------------------+
  |                         TupleFloatDatum                              |
  +-------------+--------------------------------------------------------+
  |label(Float) |Datum                                                   |
  |             +--------------------------+-----------------------------+
  |             |TupleStringString(List)   |TupleStringDoubel(List)      |
  |             +------------+-------------+---------------+-------------+
  |             |key(String) |value(String)|key(String)    |value(double)|
  +=============+============+=============+===============+=============+
  |5.0          |"aspect"    |"SW"         | | "distance"  | | 10        |
  |             |            |             | | "space"     | | 20.04     |
  |             |            |             | | "age"       | | 12        |
  |             |            |             | | "stair"     | | 1         |
  +-------------+------------+-------------+---------------+-------------+
  |6.3          |"aspect"    |"N"          | | "distance"  | | 8         |
  |             |            |             | | "space"     | | 21.56     |
  |             |            |             | | "age"       | | 23        |
  |             |            |             | | "stair"     | | 2         |
  +-------------+------------+-------------+---------------+-------------+
  |7.5          |"aspect"    |"SE"         | | "distance"  | | 25        |
  |             |            |             | | "space"     | | 22.82     |
  |             |            |             | | "age"       | | 23        |
  |             |            |             | | "stair"     | | 4         |
  +-------------+------------+-------------+---------------+-------------+
  |9.23         |"aspect"    |"S"          | | "distance"  | | 10        |
  |             |            |             | | "space"     | | 30.03     |
  |             |            |             | | "age"       | | 0         |
  |             |            |             | | "stair"     | | 2         |
  +-------------+------------+-------------+---------------+-------------+

  TupleFloatDatum contains 2 fields, "Datum" and the "label".
  "Datum" is composed of key-value data which could be processed by Jubatus, and there are 2 types of key-value data format.
  In the first type, both the "key" and "value" are in string format (string_values); in the second one, the "key" is in string format, but the "value" is in numerical format (num_values).
  These two types are represented in TupleStringString class and TupleStringDouble class, respectively.
  
  | Please have a view of the first example data in this table. Because the "aspect" is in string format, it is stored in the first list of the TupleStringString class
  | in which, the key is set as "aspect", value is set as "SW".
  | Because other items are numerical, they are stored in the list of the TupleStringDouble class, in which
  | the first list's key is set as "distance" and value is set as "10",
  | the second list's key is set as "space" and value is set as "20.04",
  | the third list's key is set as "age" and value is set as "15",
  | the fourth list's key is set as "stair" and value is set as "1".
   
  The Datum of these 5 Lists is appended with a label of "5.0", as its rent, and forms an instance of TupleFloatDatum class which retains the rent (of 5.0 * 10,000) and its corresponding housing condition info.
  Thus, the housing rental data are generated in the format of (TupleFloatDatum) List, as the training data to be used.
    
  Here is the detailed process for making the training data in this sample.
  
  First, declare the variable of training data "trainDat", as a TupleFloatDatum List (Row 58).
  Next, read the source file (CSV file) of the training data.
  Here, FileReader() and BuffererdReader() is used to read the items in CVS file line by line (Row 71-100).
  Split the data read from each line in CSV file, by the ',' mark (Row 77).
  Using the defined CSV item list (CSV_COLUMN),String item list (STRING_COLUMN) and Double item list (Double_COLUMN) to transfer the CSV data into strList or doubleList, if the item is in String or Double type (Row 85-91).
  Then, create the "Datum" by using the 2 lists, as the arguments in the private method of [makeDatum] (Row 93).
   
  The string item list and double item list in the arguments of [makeDatum] method are used to generate the TupleStringString list and TupleStringDouble list, respecitively (Row 156-184).
  At first, create the instance of Datum class component: "string_values" list and "num_values" list (Row 158-160).
  Next, generate the TupleStringString by reading the items from strList. The first element is the column name (as the key), and the second element is the value. The data is added into the string_values list (Row 162-168).
  The Double type items are processed in the similar way as String type items, to generate TupleStringDouble. Please note that the elements of num_values are added with type conversion, because the argument is of String type List while the num_values in Datum is of Double type (Row 174).
  Now, the Datum is created.
  
  The Datum created in [makeDatum] above is appended with the rent label, so as to be used as one piece of training data (argument 'train' in Row 95-96).
  By looping the above processes, source data in the CSV file will be transferred into the training data line by line and stored in the trainData List (Row 103).

 3. Model Training (update learning model

  Input the training data generated in step.2 into the train() method (Row 106).
  The first parameter in train() is the unique name for task identification in Zookeeper.
  (use null charactor "" for the stand-alone mode)
  The second parameter specifies the Datum generated in step.2.
  The returned result is the number of training data have been processed.
  
 
 4. Prepare the prediction data 

  Prepare the prediction data in the similar way of training Datum creation.
  Here, we generate the data for prediction by using the YAML file (please download the library `JYaml <http://jyaml.sourceforge.net/download.html>`_ )
  YAML is one kind of data format, in which objects and structure data are serialized.
  
  Read the YAML file (myhome.yml) as a HashMap (Row 131).
  Generate the prediction Datum by using the [makeDatum] method, as simliar as Step 2, with the HashMap.
  
  However, since the argument used here is HashMap, although the output is the same, the generation process is different (Row 187-223).
  In addition, there is no need to fill all the items in one Datum. The only required conditions are created in the Datum. 
  
  Add the Datum into the prediction data list, and send it into the estimate() method in "RegressionClient" for prediction.
  
 5. Prediction by the regression model

  The prediction results are returned as a list by the estimate() method (Row 137).

 6. Output the result

  The prediction results are returned in the same order of the prediction data. (In this sample, only one prediction data is used, thus only one result is returned.)
  The result is rounded at 2nd decimal for output, because it is in Float type.

-----------------------------------
Run the sample program
-----------------------------------

**[At Jubatus Server]**
 
 start "jubaregression" process.

 ::

  $ jubaregression --configpath rent.json

**[At Jubatus Client]**

 Get the required package and Java client ready.
 | Specify the arguments and Run! (The 2nd arguments is optional.)
 |  The first argument: YML file name (required)
 |  The second argument: CSV file name (if there is training data)
 

**[Result]**


 ::

  train ... 145
  rent .... 9.9
