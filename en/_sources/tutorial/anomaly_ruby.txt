Ruby
==================

Here we explain the Ruby sample program of anomaly detection.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms in Jubatus with the config file 'config.json'; 2) how to detect the anomaly data with the example file ‘anomaly.rb’. Here are the source codes of 'config.json' and 'anomaly.rb'.


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

 

**anomaly.rb**

.. code-block:: ruby

 01 : #!/usr/bin/env ruby
 02 : # -*- coding: utf-8 -*-
 03 : 
 04 : $host = "127.0.0.1"
 05 : $port = 9199
 06 : $name = "test"
 07 : 
 08 : require 'json'
 09 : 
 10 : require 'jubatus/anomaly/client'
 11 : require 'jubatus/anomaly/types'
 12 : 
 13 : 
 14 : # 1.Connect to Jubatus Server
 15 : client = Jubatus::Anomaly::Client::Anomaly.new($host, $port)
 16 : 
 17 : # 2.Prepare learning data
 18 : open("kddcup.data_10_percent.txt") {|f|
 19 :   f.each { |line|
 20 :     duration, protocol_type, service, flag, src_bytes, dst_bytes, land, wrong_fragment, urgent, hot, num_failed_logins, logged_in, num_compromised, root_shell, su_attempted, num_root, num_file_creations, num_shells, num_access_files, num_outbound_cmds, is_host_login, is_guest_login, count, srv_count, serror_rate, srv_serror_rate, rerror_rate, srv_rerror_rate, same_srv_rate, diff_srv_rate, srv_diff_host_rate, dst_host_count, dst_host_srv_count, dst_host_same_srv_rate, dst_host_diff_srv_rate, dst_host_same_src_port_rate, dst_host_srv_diff_host_rate, dst_host_serror_rate, dst_host_srv_serror_rate, dst_host_rerror_rate, dst_host_srv_rerror_rate, label = line.split(",")
 21 :     datum = Jubatus::Anomaly::Datum.new(
 22 :        [
 23 :         ["protocol_type", protocol_type],
 24 :         ["service", service],
 25 :         ["flag", flag],
 26 :         ["land", land],
 27 :         ["logged_in", logged_in],
 28 :         ["is_host_login", is_host_login],
 29 :         ["is_guest_login", is_guest_login],
 30 :        ],
 31 :        [
 32 :         ["duration",duration.to_f],
 33 :         ["src_bytes", src_bytes.to_f],
 34 :         ["dst_bytes", dst_bytes.to_f],
 35 :         ["wrong_fragment", wrong_fragment.to_f],
 36 :         ["urgent", urgent.to_f],
 37 :         ["hot", hot.to_f],
 38 :         ["num_failed_logins", num_failed_logins.to_f],
 39 :         ["num_compromised", num_compromised.to_f],
 40 :         ["root_shell", root_shell.to_f],
 41 :         ["su_attempted", su_attempted.to_f],
 42 :         ["num_root", num_root.to_f],
 43 :         ["num_file_creations", num_file_creations.to_f],
 44 :         ["num_shells", num_shells.to_f],
 45 :         ["num_access_files", num_access_files.to_f],
 46 :         ["num_outbound_cmds",num_outbound_cmds.to_f],
 47 :         ["count", count.to_f],
 48 :         ["srv_count", srv_count.to_f],
 49 :         ["serror_rate", serror_rate.to_f],
 50 :         ["srv_serror_rate", srv_serror_rate.to_f],
 51 :         ["rerror_rate", rerror_rate.to_f],
 52 :         ["srv_rerror_rate", srv_rerror_rate.to_f],
 53 :         ["same_srv_rate", same_srv_rate.to_f],
 54 :         ["diff_srv_rate", diff_srv_rate.to_f],
 55 :         ["srv_diff_host_rate", srv_diff_host_rate.to_f],
 56 :         ["dst_host_count", dst_host_count.to_f],
 57 :         ["dst_host_srv_count", dst_host_srv_count.to_f],
 58 :         ["dst_host_same_srv_rate", dst_host_same_srv_rate.to_f],
 59 :         ["dst_host_same_src_port_rate", dst_host_same_src_port_rate.to_f],
 60 :         ["dst_host_diff_srv_rate", dst_host_diff_srv_rate.to_f],
 61 :         ["dst_host_srv_diff_host_rate", dst_host_srv_diff_host_rate.to_f],
 62 :         ["dst_host_serror_rate", dst_host_serror_rate.to_f],
 63 :         ["dst_host_srv_serror_rate", dst_host_srv_serror_rate.to_f],
 64 :         ["dst_host_rerror_rate", dst_host_rerror_rate.to_f],
 65 :         ["dst_host_srv_rerror_rate", dst_host_srv_rerror_rate.to_f],
 66 :         ]
 67 :        )
 68 :     # 3.Model training(update learning model)
 69 :     ret = client.add($name, datum)
 70 :     
 71 :     # 4.Display result
 72 :     if (ret[1] != Float::INFINITY) and (ret[1] != 1.0) then
 73 :       print ret, label
 74 :     end
 75 :   }
 76 : }
 77 : 

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


**anomaly.rb**

 anomaly.rb will extract the data from text file, send them to Jubatus server, and get their anomaly detection result from the server.

 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 15)。
  Setting the IP addr., RPC port of Jubatus Server.

 2. Prepare the learning data

  AnomalyClient will send the Datum to Jubatus server for data learning or anomaly detection, by using its "add" method.
  In this example, the result-data in KDD Cup(Knowledge Discovery and Data Mining Cup) is used as the trainning data. At first, the program read the training data from the TEXT file, one line at a time (Row 18-19). The data in TEXT file are seperated by commas, so we split the items by ’,’ (Row 20).
  Then, we make the data items stored in datum unit for model training later.(Row 21-67).
  
 3. Model training (update learning model)

  Input the training data generated in step.2 into the add() method of AnomalyClient (Row 69).
  The first parameter in add() is the unique name for task identification in Zookeeper.
  (use null charactor "" for the stand-alone mode)
  The second parameter specifies the Datum generated in step.2.
  The returned result <string, float> is consisted of the data ID and its estimated anomaly value.
  
 4. Display result

  Display the returned value from add() method after a correction checking.
  The anomaly value should not be infinity or　1.0　(Row 72-74).

-------------------------------------
Run the sample program
-------------------------------------

**［At Jubatus Server］**
 start "jubaanomaly" process.

::
 
  $ jubaanomaly --configpath config.json


**［At Jubatus Client］**
 
 Get the required package and Ruby client ready.
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
