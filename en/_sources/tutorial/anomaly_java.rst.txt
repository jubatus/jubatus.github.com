Java
==================

Here we explain the java sample program of anomaly detection.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms in Jubatus with the config file 'config.json'; 2) how to detect the anomaly data with the example file ‘lof.java’. Here are the source codes of 'config.json' and 'lof.java'.

**config.json**

.. code-block:: python
 :linenos:

 {
  "method" : "lof",
  "parameter" : {
   "nearest_neighbor_num" : 10,
   "reverse_nearest_neighbor_num" : 30,
   "method" : "euclid_lsh",
   "parameter" : {
    "hash_num" : 8,
    "table_num" : 16,
    "probe_num" : 64,
    "bin_width" : 10,
    "seed" : 1234
   }
  },
 
  "converter" : {
   "string_filter_types": {},
   "string_filter_rules": [],
   "num_filter_types": {},
   "num_filter_rules": [],
   "string_types": {},
   "string_rules": [{"key":"*", "type":"str", "global_weight" : "bin", "sample_weight" : "bin"}],
   "num_types": {},
   "num_rules": [{"key" : "*", "type" : "num"}]
  }
 }


**anomaly.java**


.. code-block:: java
 :linenos:

   package us.jubat.example.kddcup;

   import us.jubat.anomaly.AnomalyClient;
   import us.jubat.anomaly.IdWithScore;
   import us.jubat.common.Datum;

   import java.io.*;
   import java.util.ArrayList;
   import java.util.Arrays;
   import java.util.List;

   public class Lof {
       public static final String HOST = "127.0.0.1";
       public static final int PORT = 9199;
       public static final String NAME = "anom_kddcup";
       public static final String FILE_PATH = "../";
       public static final String TEXT_NAME = "kddcup.data_10_percent.txt";

       // Define TEXT column names
       public static String[] TEXT_COLUMN = {
               "duration",
               "protocol_type",
               "service",
               "flag",
               "src_bytes",
               "dst_bytes",
               "land",
               "wrong_fragment",
               "urgent",
               "hot",
               "num_failed_logins",
               "logged_in",
               "num_compromised",
               "root_shell",
               "su_attempted",
               "num_root",
               "num_file_creations",
               "num_shells",
               "num_access_files",
               "num_outbound_cmds",
               "is_host_login",
               "is_guest_login",
               "count",
               "srv_count",
               "serror_rate",
               "srv_serror_rate",
               "rerror_rate",
               "srv_rerror_rate",
               "same_srv_rate",
               "diff_srv_rate",
               "srv_diff_host_rate",
               "dst_host_count",
               "dst_host_srv_count",
               "dst_host_same_srv_rate",
               "dst_host_diff_srv_rate",
               "dst_host_same_src_port_rate",
               "dst_host_srv_diff_host_rate",
               "dst_host_serror_rate",
               "dst_host_srv_serror_rate",
               "dst_host_rerror_rate",
               "dst_host_srv_rerror_rate",
               "label"
       };

       // Define STRING column names
       public static String[] STRING_COLUMN = {
               "protocol_type",
               "service",
               "flag",
               "land",
               "logged_in",
               "is_host_login",
               "is_guest_login"
       };

       // Define DOUBLE column names
       public static String[] DOUBLE_COLUMN = {
               "duration",
               "src_bytes",
               "dst_bytes",
               "wrong_fragment",
               "urgent",
               "hot",
               "num_failed_logins",
               "num_compromised",
               "root_shell",
               "su_attempted",
               "num_root",
               "num_file_creations",
               "num_shells",
               "num_access_files",
               "num_outbound_cmds",
               "count",
               "srv_count",
               "serror_rate",
               "srv_serror_rate",
               "rerror_rate",
               "srv_rerror_rate",
               "same_srv_rate",
               "diff_srv_rate",
               "srv_diff_host_rate",
               "dst_host_count",
               "dst_host_srv_count",
               "dst_host_same_srv_rate",
               "dst_host_same_src_port_rate",
               "dst_host_diff_srv_rate",
               "dst_host_srv_diff_host_rate",
               "dst_host_serror_rate",
               "dst_host_srv_serror_rate",
               "dst_host_rerror_rate",
               "dst_host_srv_rerror_rate"
       };

       public void execute() throws Exception {
           // 1. Connect to Jubatus Server
           AnomalyClient client = new AnomalyClient(HOST, PORT , NAME, 5);

           // 2. Prepare training dataset
           Datum datum = null;
           IdWithScore result = null;

           try {
               BufferedReader br = new BufferedReader(new FileReader(new File(FILE_PATH , TEXT_NAME)));

               List<String> strList = new ArrayList<String>();
               List<String> doubleList = new ArrayList<String>();

               String line = "";

               while ((line = br.readLine()) != null) {
                   strList.clear();
                   doubleList.clear();

                   String[] strAry = line.split(",");

                   // make STRING list and DOUBLE list
                   for (int i = 0; i < strAry.length; i++) {
                       if (Arrays.toString(STRING_COLUMN).contains(TEXT_COLUMN[i])) {
                           strList.add(strAry[i]);
                       } else if (Arrays.toString(DOUBLE_COLUMN).contains(TEXT_COLUMN[i])) {
                           doubleList.add(strAry[i]);
                       }
                   }
                   // make Datum
                   datum = makeDatum(strList, doubleList);

                   // 3. Update the training model
                   result = client.add(datum);

                   // 4. Output results
                   if (!(Float.isInfinite(result.score)) && result.score != 1.0) {
                       System.out.print("('" + result.id + "', " + result.score + ") " + strAry[strAry.length - 1] + "\n");
                   }
               }
               br.close();

           } catch (FileNotFoundException e) {
               e.printStackTrace();
           } catch (IOException e) {
               e.printStackTrace();
           }
           return;
       }

       private Datum makeDatum(List<String> strList, List<String> doubleList) {

           Datum datum = new Datum();

           for (int i = 0; i < strList.size(); i++) {
               datum.addString(STRING_COLUMN[i],strList.get(i));
           }

           try {
               for (int i = 0; i < doubleList.size(); i++) {
                   datum.addNumber(DOUBLE_COLUMN[i],Double.parseDouble(doubleList.get(i)));
               }
           } catch (NumberFormatException e) {
               e.printStackTrace();
               return null;
           }

           return datum;
       }

       public static void main(String[] args) throws Exception {

           new Lof().execute();
           System.exit(0);
       }
   }

--------------------------------
Explanation
--------------------------------

**config.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON field.

 * method

  Specify the algorithm used in anomaly detection. Currently, Recommender based "lof"(Local Outlier Factor) and Nearest Neighbor based "light_lof" are supported for anomaly detection. Here, we use "lof".

 * parameter

  Specify the parameters for anomaly detection algorithm set as method.
  Here, we use "lof" algorithm and set the parameters according to `Recommender API <http://jubat.us/en/api/api_recommender.html>`_ .

 * converter
 
  Specify the configurations in feature converter. In this sample, we will set "num_rules" and "string_rules". 

  "num_rules" specifies the value extracting rules for values in numerical format.
  "key" is set as "*" here, which means all the "key" will be taken into account. "type" is set as "num", which means each value has its weight as equal as the value itself. For example, if data's value i "2", its weight is set as 2; if data's value is "6", its weight is set as 6.

 
  "string_rules" specifies the value extracting rules for values in string format.
  Here, "key" is set as "*", "type" is "str", "sample_weight" is "bin", and "global_weight" is "bin".
  This means, all the "key" will be taken into account, the features in strings values will be used without convertion, the weight of each key-value will be calculated throughout the whole data have been used, and the global weight is a constant value of "1".
  

**anomaly.java**

 anomaly.java will extract the data from text file, send them to Jubatus server, and get their anomaly detection result from the server.

 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 116).
  Setting the IP addr., RPC port of Jubatus Server, and the connection waiting time.

 2. Prepare the learning data

  AnomalyClient will send the Datum to Jubatus server for data learning or anomaly detection, by using its "add" method.
  In this example, the result-data in KDD Cup(Knowledge Discovery and Data Mining Cup) is used as the trainning data. At first, the program read the training data from the TEXT file, one line at a time, by using FileReader() and BuffererdReader() methods (Row 130-155). The data in TEXT file are seperated by commas, so we split the items by ’,’ (Row 134).
  By using the whole items definition list: TEXT file(TEXT_COLUMN); as well as the "String" and "Double" items definition list (STRING_COLUMN、DOUBLE_COLUMN), we store the items in different list due to their types (Row 137 - 134).
  Put the two lists into one Datum unit and add arguments for each items in the lists, as done by the private method [makeDatum](Row 145).

  In the [makeDatum], we will store the data items into the string-list and double-list.　(Row 165-183). We add String value to Datum unit using addString(...) method. In a similar manner, we add Double value to Datum unit using addNumber(...) method. Note that, because the data in doubleList is in String format, data convertion is required when put it into Datum unit (Row 175).
  
  Now, our learning data is ready in the Datum format.

  
 3. Model training (update learning model)

  Input the training data generated in step.2 into the add() method of AnomalyClient (Row 147).
  The returned result <string, float> is consisted of the data ID and its estimated anomaly value.
  
 4. Display result

  Display the returned value from add() method after a correction checking (Row 151).
  The anomaly value should not be infinity or　1.0　(Row 152).

-------------------------------------
Run the sample program
-------------------------------------

**[Download Dataset]**

 :: 
 
  $ wget http://kdd.ics.uci.edu/databases/kddcup99/kddcup.data_10_percent.gz
  $ gunzip kddcup.data_10_percent.gz
  $ mv kddcup.data_10_percent kddcup.data_10_percent.txt 


**［At Jubatus Server］**
 start "jubaanomaly" process.

::
 
  $ jubaanomaly --configpath config.json


**［At Jubatus Client］**
 Get the required package and Java client ready.
 Run!
 Please see the detail here -> `Jubatus Example <https://github.com/jubatus/jubatus-example/tree/master/network_intrusion_detection>`_ 

 
**［Result］**


  ::

   ('194', 1.0000441074371338) normal.
   ('494', 1.4595649242401123) normal.
   ('1127', 1.0642377138137817) normal.
   ('1148', 1.0404019355773926) normal.
   ('1709', 1.2717968225479126) normal.
   ('2291', 1.388629674911499) normal.
   ('2357', 1.0560613870620728) normal.
   ('2382', 0.9994010925292969) normal.
   ('2499', 0.7581642270088196) normal.
   ...
   ... (omitted)
