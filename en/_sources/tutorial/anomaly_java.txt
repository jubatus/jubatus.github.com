Java
==================

Here we explain the java sample program of anomaly detection.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms in Jubatus with the config file 'config.json'; 2) how to detect the anomaly data with the example file ‘lof.java’. Here are the source codes of 'config.json' and 'lof.java'.

**config.json**

.. code-block:: java

 01 : {
 02 :  "method" : "lof",
 03 :  "parameter" : {
 04 :   "nearest_neighbor_num" : 10,
 05 :   "reverse_nearest_neighbor_num" : 30,
 06 :   "method" : "euclid_lsh",
 07 :   "parameter" : {
 08 :    "lsh_num" : 8,
 09 :    "table_num" : 16,
 10 :    "probe_num" : 64,
 11 :    "bin_width" : 10,
 12 :    "seed" : 1234,
 13 :    "retain_projection" : true
 14 :   }
 15 :  },
 16 : 
 17 :  "converter" : {
 18 :   "string_filter_types": {},
 19 :   "string_filter_rules": [],
 20 :   "num_filter_types": {},
 21 :   "num_filter_rules": [],
 22 :   "string_types": {},
 23 :   "string_rules": [{"key":"*", "type":"str", "global_weight" : "bin", "sample_weight" : "bin"}],
 24 :   "num_types": {},
 25 :   "num_rules": [{"key" : "*", "type" : "num"}]
 26 :  }
 27 : }

 

**anomaly.java**

.. code-block:: java

 001 : package lof;
 002 : 
 003 : import java.io.BufferedReader;
 004 : import java.io.FileNotFoundException;
 005 : import java.io.FileReader;
 006 : import java.io.IOException;
 007 : import java.util.ArrayList;
 008 : import java.util.Arrays;
 009 : import java.util.List;
 010 : 
 011 : import us.jubat.anomaly.*;
 012 : 
 013 : public class Lof {
 014 : 	public static final String HOST = "127.0.0.1";
 015 : 	public static final int PORT = 9199;
 016 : 	public static final String NAME = "anom_kddcup";
 017 : 	public static final String FILE_PATH = "./src/main/resources/";
 018 : 	public static final String TEXT_NAME = "kddcup.data_10_percent.txt";
 019 : 
 020 : 	// declare all the data items consisted in each piece of training data
 021 : 	public static String[] TEXT_COLUMN = {
 022 : 		"duration",
 023 : 		"protocol_type",
 024 : 		"service",
 025 : 		"flag",
 026 : 		"src_bytes",
 027 : 		"dst_bytes",
 028 : 		"land",
 029 : 		"wrong_fragment",
 030 : 		"urgent",
 031 : 		"hot",
 032 : 		"num_failed_logins",
 033 : 		"logged_in",
 034 : 		"num_compromised",
 035 : 		"root_shell",
 036 : 		"su_attempted",
 037 : 		"num_root",
 038 : 		"num_file_creations",
 039 : 		"num_shells",
 040 : 		"num_access_files",
 041 : 		"num_outbound_cmds",
 042 : 		"is_host_login",
 043 : 		"is_guest_login",
 044 : 		"count",
 045 : 		"srv_count",
 046 : 		"serror_rate",
 047 : 		"srv_serror_rate",
 048 : 		"rerror_rate",
 049 : 		"srv_rerror_rate",
 050 : 		"same_srv_rate",
 051 : 		"diff_srv_rate",
 052 : 		"srv_diff_host_rate",
 053 : 		"dst_host_count",
 054 : 		"dst_host_srv_count",
 055 : 		"dst_host_same_srv_rate",
 056 : 		"dst_host_diff_srv_rate",
 057 : 		"dst_host_same_src_port_rate",
 058 : 		"dst_host_srv_diff_host_rate",
 059 : 		"dst_host_serror_rate",
 060 : 		"dst_host_srv_serror_rate",
 061 : 		"dst_host_rerror_rate",
 062 : 		"dst_host_srv_rerror_rate",
 063 : 		"label"
 064 : 	};
 065 : 
 066 : 	// items in String type
 067 : 	public static String[] STRING_COLUMN = {
 068 : 		"protocol_type",
 069 : 		"service",
 070 : 		"flag",
 071 : 		"land",
 072 : 		"logged_in",
 073 : 		"is_host_login",
 074 : 		"is_guest_login"
 075 : 	};
 076 : 
 077 : 	// items in Double type
 078 : 	public static String[] DOUBLE_COLUMN = {
 079 : 		"duration",
 080 : 		"src_bytes",
 081 : 		"dst_bytes",
 082 : 		"wrong_fragment",
 083 : 		"urgent",
 084 : 		"hot",
 085 : 		"num_failed_logins",
 086 : 		"num_compromised",
 087 : 		"root_shell",
 088 : 		"su_attempted",
 089 : 		"num_root",
 090 : 		"num_file_creations",
 091 : 		"num_shells",
 092 : 		"num_access_files",
 093 : 		"num_outbound_cmds",
 094 : 		"count",
 095 : 		"srv_count",
 096 : 		"serror_rate",
 097 : 		"srv_serror_rate",
 098 : 		"rerror_rate",
 099 : 		"srv_rerror_rate",
 100 : 		"same_srv_rate",
 101 : 		"diff_srv_rate",
 102 : 		"srv_diff_host_rate",
 103 : 		"dst_host_count",
 104 : 		"dst_host_srv_count",
 105 : 		"dst_host_same_srv_rate",
 106 : 		"dst_host_same_src_port_rate",
 107 : 		"dst_host_diff_srv_rate",
 108 : 		"dst_host_srv_diff_host_rate",
 109 : 		"dst_host_serror_rate",
 110 : 		"dst_host_srv_serror_rate",
 111 : 		"dst_host_rerror_rate",
 112 : 		"dst_host_srv_rerror_rate"
 113 : 	};
 114 : 
 115 : 	public void execute() throws Exception {
 116 : 		// 1. Connect to Jubatus Server
 117 : 		AnomalyClient client = new AnomalyClient(HOST, PORT, 5);
 118 : 
 119 : 		// 2. Prepare learning data
 120 : 		Datum datum = null;
 121 : 		TupleStringFloat result = null;
 122 : 
 123 : 		try {
 124 : 			BufferedReader br = new BufferedReader(new FileReader(FILE_PATH + TEXT_NAME));
 125 : 
 126 : 			List<String> strList = new ArrayList<String>();
 127 : 			List<String> doubleList = new ArrayList<String>();
 128 : 
 129 : 			String line = "";
 130 : 
 131 : 			// read the data row by row until the last one
 132 : 			while ((line = br.readLine()) != null) {
 133 : 				strList.clear();
 134 : 				doubleList.clear();
 135 : 
 136 : 				// split the data items in each row
 137 : 				String[] strAry = line.split(",");
 138 : 
 139 : 				// make the String and Double Lists to store the data items 
 140 : 				for (int i = 0; i < strAry.length; i++) {
 141 : 					if (Arrays.toString(STRING_COLUMN).contains(TEXT_COLUMN[i])) {
 142 : 						strList.add(strAry[i]);
 143 : 					} else if (Arrays.toString(DOUBLE_COLUMN).contains(TEXT_COLUMN[i])) {
 144 : 						doubleList.add(strAry[i]);
 145 : 					}
 146 : 				}
 147 : 				// make the datum
 148 : 				datum = makeDatum(strList, doubleList);
 149 : 
 150 : 				// 3. Model training(update learning model)
 151 : 				result = client.add(NAME, datum);
 152 : 
 153 : 				// 4. Display result
 154 : 				if ( !(Float.isInfinite(result.second)) && result.second != 1.0) {
 155 : 					System.out.print( "('" + result.first + "', " + result.second + ") " + strAry[strAry.length -1] + "\n" );
 156 : 				}
 157 : 			}
 158 : 			br.close();
 159 : 
 160 : 		} catch (FileNotFoundException e) {
 161 : 			// capture the exception in File object creation
 162 : 			e.printStackTrace();
 163 : 		} catch (IOException e) {
 164 : 			// capture the exception in closing BufferedReader object
 165 : 			e.printStackTrace();
 166 : 		}
 167 : 		return;
 168 : 	}
 169 : 
 170 : 
 171 : 	// Make the Datum with the assigned lists
 172 : 	private Datum makeDatum(List<String> strList, List<String> doubleList) {
 173 : 
 174 : 		Datum datum = new Datum();
 175 : 		datum.string_values = new ArrayList<TupleStringString>();
 176 : 		datum.num_values = new ArrayList<TupleStringDouble>();
 177 : 
 178 : 		for (int i = 0; i < strList.size(); i++) {
 179 : 			TupleStringString data = new TupleStringString();
 180 : 			data.first = STRING_COLUMN[i];
 181 : 			data.second = strList.get(i);
 182 : 
 183 : 			datum.string_values.add(data);
 184 : 		}
 185 : 
 186 : 		try {
 187 : 			for (int i = 0; i < doubleList.size(); i++) {
 188 : 				TupleStringDouble data = new TupleStringDouble();
 189 : 				data.first = DOUBLE_COLUMN[i];
 190 : 				data.second = Double.parseDouble(doubleList.get(i));
 191 : 
 192 : 				datum.num_values.add(data);
 193 : 			}
 194 : 		} catch (NumberFormatException e) {
 195 : 			e.printStackTrace();
 196 : 			return null;
 197 : 		}
 198 : 
 199 : 		return datum;
 200 : 	}
 201 : 
 202 : 	// main method
 203 : 	public static void main(String[] args) throws Exception {
 204 : 
 205 : 		new Lof().execute();
 206 : 		System.exit(0);
 207 : 	}
 208 : }

--------------------------------
Explanation
--------------------------------

**config.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON filed.

 * method

  Specify the algorithm used in anomaly detection. Currently, "LOF"(Local Outlier Factor) is the only one algorithm for anomaly detection, so, we write "LOF" here.

 * converter
 
  Specify the configurations in feature converter. In this sample, we will set "num_rules" and "string_rules". 

  "num_rules" specifies the value extracting rules for values in numerical format.
  "key" is set as "*" here, which means all the "key" will be taken into account. "type" is set as "num", which means each value has its weight as equal as the value itself. For example, if data's value i "2", its weight is set as 2; if data's value is "6", its weight is set as 6.

 
  "string_rules" specifies the value extracting rules for values in string format.
  Here, "key" is set as "*", "type" is "str", "sample_weight" is "bin", and "global_weight" is "bin".
  This means, all the "key" will be taken into account, the features in strings values will be used without convertion, the weight of each key-value will be calculated throughout the whole data have been used, and the global weight is a constant value of "1".

 * parameter(could be modified)

 ･･･
  

**anomaly.java**

 anomaly.java will extract the data from text file, send them to Jubatus server, and get their anomaly detection result from the server.

 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 117).
  Setting the IP addr., RPC port of Jubatus Server, and the connection waiting time.

 2. Prepare the learning data

  AnomalyClient will send the Datum to Jubatus server for data learning or anomaly detection, by using its "add" method.
  In this example, the result-data in KDD Cup(Knowledge Discovery and Data Mining Cup) is used as the trainning data. At first, the program read the training data from the TEXT file, one line at a time, by using FileReader() and BuffererdReader() methods (Row 132-157). The data in TEXT file are seperated by commas, so we split the items by ’,’ (Row 137).
  By using the whole items definition list: TEXT file(TEXT_COLUMN); as well as the "String" and "Double" items definition list (STRING_COLUMN、DOUBLE_COLUMN), we store the items in different list due to their types (Row 140-145).
  Put the two lists into one Datum unit and add arguments for each items in the lists, as done by the private method [makeDatum](Row 171).

  In the [makeDatum], we will store the data items into the string-list and double-list, which are in the format of TupleStringString and TupleStringDouble (Row 172-200).
  At first, we generate the string_values and num_values lists, as the factors required in a Datum class (Row 174-176).
  Then, we combine the corresponding items in "STRING_COLUMN" and "strList" as key-value pairs to generate the TupleStringString list (Row 178-184). And combine the corresponding items in "Double_COLUMN" and "doubleList" as key-value pairs to generate the TupleStringDouble list. Note that, because the data in doublelist is in String format, data convertion is required when put it into Datum unit (Row 190).
  
  Now, our learning data is ready in the Datum format.

  
 3. Model training (update learning model)

  Input the training data generated in step.2 into the add() method of AnomalyClient (Row 151).
  The first parameter in add() is the unique name for task identification in Zookeeper.
  (use null charactor "" for the stand-alone mode)
  The second parameter specifies the Datum generated in step.2.
  The returned result <string, float> is consisted of the data ID and its estimated anomaly value.
  
 4. Display result

  Display the returned value from add() method after a correction checking (Row 154).
  The anomaly value should not be infinity or　1.0　(Row 155).

-------------------------------------
Run the sample program
-------------------------------------

**［At Jubatus Server］**
 start "jubaanomaly" process.

::
 
  $ jubaanomaly --configpath config.json


**［At Jubatus Client］**
 Get the required package and Java client ready.
 Run!

 
**［Result］**

::

 ('574', 0.99721104) normal.
 ('697', 1.4958459) normal.
 ('1127', 0.79527026) normal.
 ('1148', 1.1487594) normal.
 ('1149', 1.2) normal.
 ('2382', 0.9994011) normal.
 ('2553', 1.2638165) normal.
 ('2985', 1.4081864) normal.
 ('3547', 1.275244) normal.
 ('3557', 0.90432936) normal.
 ('3572', 0.75777346) normal.
 ('3806', 0.9943142) normal.
 ('3816', 1.0017062) normal.
 ('3906', 0.5671135) normal.
 …
 …(omitted)
