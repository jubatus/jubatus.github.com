Python
==================

Here we explain the Python sample program of anomaly detection.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms in Jubatus with the config file 'config.json'; 2) how to detect the anomaly data with the example file ‘anomaly.py’. Here are the source codes of 'config.json' and 'anomaly.py'.

**config.json**

.. code-block:: python

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

 

**anomaly.py**

.. code-block:: python

 01 : # -*- coding: utf-8 -*-
 02 : 
 03 : import sys, json
 04 : from jubatus.anomaly import client
 05 : from jubatus.anomaly import types
 06 : 
 07 : NAME = "anom_kddcup";
 08 : 
 09 : if __name__ == '__main__':
 10 :     
 11 :     # 1.Connect to Jubatus Server
 12 :     anom = client.anomaly("127.0.0.1",9199)
 13 : 
 14 :     # 2.Prepare learning data
 15 :     for line in open('./kddcup.data_10_percent.txt'):
 16 :         duration, protocol_type, service, flag, src_bytes, dst_bytes, land, wrong_fragment, urgent, hot, num_failed_logins, logged_in, num_compromised, root_shell, su_attempted, num_root, num_file_creations, num_shells, num_access_files, num_outbound_cmds, is_host_login, is_guest_login, count, srv_count, serror_rate, srv_serror_rate, rerror_rate, srv_rerror_rate, same_srv_rate, diff_srv_rate, srv_diff_host_rate, dst_host_count, dst_host_srv_count, dst_host_same_srv_rate, dst_host_diff_srv_rate, dst_host_same_src_port_rate, dst_host_srv_diff_host_rate, dst_host_serror_rate, dst_host_srv_serror_rate, dst_host_rerror_rate, dst_host_srv_rerror_rate, label = line[:-1].split(",")
 17 : 
 18 :         datum = types.datum(
 19 :        [
 20 :         ["protocol_type", protocol_type],
 21 :         ["service", service],
 22 :         ["flag", flag],
 23 :         ["land", land],
 24 :         ["logged_in", logged_in],
 25 :         ["is_host_login", is_host_login],
 26 :         ["is_guest_login", is_guest_login],
 27 :        ]
 28 :        ,
 29 :        [
 30 :         ["duration",float(duration)],
 31 :         ["src_bytes", float(src_bytes)],
 32 :         ["dst_bytes", float(dst_bytes)],
 33 :         ["wrong_fragment", float(wrong_fragment)],
 34 :         ["urgent", float(urgent)],
 35 :         ["hot", float(hot)],
 36 :         ["num_failed_logins", float(num_failed_logins)],
 37 :         ["num_compromised", float(num_compromised)],
 38 :         ["root_shell", float(root_shell)],
 39 :         ["su_attempted", float(su_attempted)],
 40 :         ["num_root", float(num_root)],
 41 :         ["num_file_creations", float(num_file_creations)],
 42 :         ["num_shells", float(num_shells)],
 43 :         ["num_access_files", float(num_access_files)],
 44 :         ["num_outbound_cmds",float(num_outbound_cmds)],
 45 :         ["count", float(count)], 
 46 :         ["srv_count",float(srv_count)],
 47 :         ["serror_rate", float(serror_rate)],
 48 :         ["srv_serror_rate", float(srv_serror_rate)],
 49 :         ["rerror_rate", float(rerror_rate)],
 50 :         ["srv_rerror_rate",float( srv_rerror_rate)],
 51 :         ["same_srv_rate", float(same_srv_rate)],
 52 :         ["diff_srv_rate", float(diff_srv_rate)],
 53 :         ["srv_diff_host_rate", float(srv_diff_host_rate)],
 54 :         ["dst_host_count",float( dst_host_count)],
 55 :         ["dst_host_srv_count", float(dst_host_srv_count)],
 56 :         ["dst_host_same_srv_rate",float( dst_host_same_srv_rate)],
 57 :         ["dst_host_same_src_port_rate",float( dst_host_same_src_port_rate)],
 58 :         ["dst_host_diff_srv_rate", float(dst_host_diff_srv_rate)],
 59 :         ["dst_host_srv_diff_host_rate",float(dst_host_srv_diff_host_rate)],
 60 :         ["dst_host_serror_rate",float(dst_host_serror_rate)],
 61 :         ["dst_host_srv_serror_rate",float(dst_host_srv_serror_rate)],
 62 :         ["dst_host_rerror_rate",float(dst_host_rerror_rate)],
 63 :         ["dst_host_srv_rerror_rate",float(dst_host_srv_rerror_rate)],
 64 :         ]
 65 :        )
 66 : 
 67 :         # 3.Model training(update learning model)
 68 :         ret = anom.add(NAME, datum)
 69 :         
 70 :         # 4.Display result
 71 :         if (ret[1] != float('Inf')) and (ret[1] != 1.0):
 72 :             print ret, label
 73 : 


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
  

  
**anomaly.py**

 anomaly.py will extract the data from text file, send them to Jubatus server, and get their anomaly detection result from the server.
 
 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 12)。
  Setting the IP addr., RPC port of Jubatus Server.

 2. Prepare the learning data

  AnomalyClient will send the Datum to Jubatus server for data learning or anomaly detection, by using its "add" method.
  In this example, the result-data in KDD Cup(Knowledge Discovery and Data Mining Cup) is used as the trainning data. At first, the program read the training data from the TEXT file, one line at a time (Row 15). The data in TEXT file are seperated by commas, so we split the items by ’,’ (Row 16).
  Then, we make the data items stored in datum unit for model training later.(Row 18-65).
  
 3. Model training (update learning model)

  Input the training data generated in step.2 into the add() method of AnomalyClient (Row 68).
  The first parameter in add() is the unique name for task identification in Zookeeper.
  (use null charactor "" for the stand-alone mode)
  The second parameter specifies the Datum generated in step.2.
  The returned result <string, float> is consisted of the data ID and its estimated anomaly value.
  
 4. Display result

  Display the returned value from add() method after a correction checking.
  The anomaly value should not be infinity or　1.0　(Row 71-72).


-------------------------------------
Run the sample program
-------------------------------------

**［At Jubatus Server］**
 start "jubaanomaly" process.

::
 
  $ jubaanomaly --configpath config.json


**［At Jubatus Client］**

::

  $ python anomaly.py
 
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
