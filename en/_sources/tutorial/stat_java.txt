Java
==================

Here we explain the sample program of Stat in Java. 

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms that used by Jubatus, with the example file 'stat.json'; 2) how to train the model by 'stat.java'. Here are the source codes.

**stat.json**

.. code-block:: python

 1 : {
 2 :   "window_size": 500
 3 : }
 

**Stat.java**

.. code-block:: java

 01 : package stat;
 02 : 
 03 : import java.io.BufferedReader;
 04 : import java.io.File;
 05 : import java.io.FileNotFoundException;
 06 : import java.io.FileReader;
 07 : import java.io.IOException;
 08 : import java.util.ArrayList;
 09 : import java.util.HashMap;
 10 : 
 11 : import us.jubat.stat.*;
 12 : 
 13 : public class Stat {
 14 : 	public static final String HOST = "127.0.0.1";
 15 : 	public static final int PORT = 9199;
 16 : 	public static final String NAME = "stat_tri";
 17 : 	public static final String FILE_PATH = "./src/main/resources/";
 18 : 	public static final String CSV_NAME = "fruit.csv";
 19 : 
 20 : 	// Definie the column name in CSV file
 21 : 	public static String[] CSV_COLUMN = { "fruit", "diameter", "weight", "price" };
 22 : 
 23 : 	@SuppressWarnings("serial")
 24 : 	public void execute() throws Exception {
 25 : 		// 1. Connect to Jubatus Server
 26 : 		StatClient stat = new StatClient(HOST, PORT, 5);
 27 : 
 28 : 		HashMap<String, String> fruit = new HashMap<String, String>();
 29 : 
 30 : 		// 2. Prepare the training data
 31 : 		try {
 32 : 			File csv = new File(FILE_PATH + CSV_NAME ); // CSV Data file
 33 : 
 34 : 			BufferedReader br = new BufferedReader(new FileReader(csv));
 35 : 			String line = "";
 36 : 
 37 : 			// read data line by line, until the last one.
 38 : 			while ((line = br.readLine()) != null) {
 39 : 				// split the data in one line into items
 40 : 				String[] strAry = line.split(",");
 41 : 
 42 : 				for (int i=0; i<strAry.length; i++) {
 43 : 					fruit.put(CSV_COLUMN[i], strAry[i]);
 44 : 				}
 45 : 				// 3. Data training (update model)
 46 : 				stat.push(NAME, fruit.get("fruit") + "dia" , Float.valueOf(fruit.get("diameter")));
 47 : 				stat.push(NAME, fruit.get("fruit") + "wei" , Float.valueOf(fruit.get("weight")));
 48 : 				stat.push(NAME, fruit.get("fruit") + "pri" , Float.valueOf(fruit.get("price")));
 49 : 			}
 50 : 			br.close();
 51 : 
 52 : 			stat.save(NAME, "stat.dat");
 53 : 			stat.load(NAME, "stat.dat");
 54 : 
 55 : 			// 4. Output result
 56 : 			for (String fr : new ArrayList<String>(3) {{add("orange");add("apple");add("melon");}}) {
 57 : 				for ( String par : new ArrayList<String>(3) {{add("dia");add("wei");add("pri");}}) {
 58 : 					System.out.print("sum : " + fr +  par + " " + stat.sum(NAME, fr + par) + "\n");
 59 : 					System.out.print("sdv : " + fr +  par + " " + stat.stddev(NAME, fr + par) + "\n");
 60 : 					System.out.print("max : " + fr +  par + " " + stat.max(NAME, fr + par) + "\n");
 61 : 					System.out.print("min : " + fr +  par + " " + stat.min(NAME, fr + par) + "\n");
 62 : 					System.out.print("ent : " + fr +  par + " " + stat.entropy(NAME, fr + par) + "\n");
 63 : 					System.out.print("mmt : " + fr +  par + " " + stat.moment(NAME, fr + par, 1, 0.0) + "\n");
 64 : 				}
 65 : 			}
 66 : 		} catch (FileNotFoundException e) {
 67 : 			 // capture the exception in File object creation.
 68 : 			 e.printStackTrace();
 69 : 		} catch (IOException e) {
 70 : 			 // capture the exception when close BufferedReader object.
 71 : 			 e.printStackTrace();
 72 : 		}
 73 : 
 74 : 		return;
 75 : 	}
 76 : 
 77 : 	// Main method
 78 : 	public static void main(String[] args) throws Exception {
 79 : 
 80 : 		new Stat().execute();
 81 : 		System.exit(0);
 82 : 	}
 83 : }


--------------------------------
Explanation
--------------------------------

**stat.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON filed.

 * window_size
 
  Specify the amount of value to be retained. (Integer)
  

**Stat.java**

 Program [trivial_stat] performs the statistical analysis, such as standard deviation and summary value of the parameter, in each fruit.

 Stat.java reads the 'price', 'weight', 'diameter' of fruits from the .csv file, and send the info. to Jubatus server. The methods used are listed below.
 
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

  Connect to Jubatus Server (Row 26).
  Setting the IP addr., RPC port of Jubatus Server, and the connection waiting time.

 2. Prepare the learning data

  StatClient send the <item_name, value> to the server side as training data, by using the push() method.
  In this sample program, the training data are generated from a .CSV file which contains the info. of 'fruit type', 'price', 'weight', 'diameter'.
  At first, the source data is read line by line from the .CSV file, by FileReader() and BufferedReader() (Row 32-49). Every line data is split into items by the ',' (Row 40). And then, every item, with its item_name that stored in CSV_COLUMN, are stored in to a <HashMap> fruit list (Row 42-44). 
 
 3. Data training (update the model)

  The training data in <HashMap> fruit is send to the server site by using the push() method (Row 46-48) for training model there. 
 
 4. Output the result

  StatClient gets the different statistic results by using its methods.
  For each type of fruits(Row 56), the program outputs its statistic results of all the items (Row 57).
  Different methods are called (Row 58-63) in the loop above. Their contents are listed in the methods list above.
  
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
