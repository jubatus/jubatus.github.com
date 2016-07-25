Python
==================

Here we explain the Python sample program of anomaly detection.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms in Jubatus with the config file 'config.json'; 2) how to detect the anomaly data with the example file ‘anomaly.py’. Here are the source codes of 'config.json' and 'anomaly.py'.

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


**anomaly.py**

.. code-block:: python
 :linenos:

 #!/usr/bin/env python
 # -*- coding: utf-8 -*-

 import signal
 import sys, json
 from jubatus.anomaly import client
 from jubatus.common import Datum

 NAME = "anom_kddcup";

 # handle keyboard interruption"
 def do_exit(sig, stack):
     print('You pressed Ctrl+C.')
     print('Stop running the job.')
     sys.exit(0)

 if __name__ == '__main__':
     # 0. set KeyboardInterrupt handler
     signal.signal(signal.SIGINT, do_exit)

     # 1. set jubatus server
     anom = client.Anomaly("127.0.0.1", 9199, NAME)

     # 2. prepare training data
     with open('kddcup.data_10_percent.txt', mode='r') as file:
         for line in file:
             duration, protocol_type, service, flag, src_bytes, dst_bytes, land, wrong_fragment, urgent, hot, num_failed_logins, logged_in, num_compromised, root_shell, su_attempted, num_root, num_file_creations, num_shells, num_access_files, num_outbound_cmds, is_host_login, is_guest_login, count, srv_count, serror_rate, srv_serror_rate, rerror_rate, srv_rerror_rate, same_srv_rate, diff_srv_rate, srv_diff_host_rate, dst_host_count, dst_host_srv_count, dst_host_same_srv_rate, dst_host_diff_srv_rate, dst_host_same_src_port_rate, dst_host_srv_diff_host_rate, dst_host_serror_rate, dst_host_srv_serror_rate, dst_host_rerror_rate, dst_host_srv_rerror_rate, label = line[:-1].split(",")

             datum = Datum()
             for (k, v) in [
                     ["protocol_type", protocol_type],
                     ["service", service],
                     ["flag", flag],
                     ["land", land],
                     ["logged_in", logged_in],
                     ["is_host_login", is_host_login],
                     ["is_guest_login", is_guest_login],
                     ]:
                 datum.add_string(k, v)

             for (k, v) in [
                     ["duration",float(duration)],
                     ["src_bytes", float(src_bytes)],
                     ["dst_bytes", float(dst_bytes)],
                     ["wrong_fragment", float(wrong_fragment)],
                     ["urgent", float(urgent)],
                     ["hot", float(hot)],
                     ["num_failed_logins", float(num_failed_logins)],
                     ["num_compromised", float(num_compromised)],
                     ["root_shell", float(root_shell)],
                     ["su_attempted", float(su_attempted)],
                     ["num_root", float(num_root)],
                     ["num_file_creations", float(num_file_creations)],
                     ["num_shells", float(num_shells)],
                     ["num_access_files", float(num_access_files)],
                     ["num_outbound_cmds",float(num_outbound_cmds)],
                     ["count", float(count)],
                     ["srv_count",float(srv_count)],
                     ["serror_rate", float(serror_rate)],
                     ["srv_serror_rate", float(srv_serror_rate)],
                     ["rerror_rate", float(rerror_rate)],
                     ["srv_rerror_rate",float( srv_rerror_rate)],
                     ["same_srv_rate", float(same_srv_rate)],
                     ["diff_srv_rate", float(diff_srv_rate)],
                     ["srv_diff_host_rate", float(srv_diff_host_rate)],
                     ["dst_host_count",float( dst_host_count)],
                     ["dst_host_srv_count", float(dst_host_srv_count)],
                     ["dst_host_same_srv_rate",float( dst_host_same_srv_rate)],
                     ["dst_host_same_src_port_rate",float( dst_host_same_src_port_rate)],
                     ["dst_host_diff_srv_rate", float(dst_host_diff_srv_rate)],
                     ["dst_host_srv_diff_host_rate",float(dst_host_srv_diff_host_rate)],
                     ["dst_host_serror_rate",float(dst_host_serror_rate)],
                     ["dst_host_srv_serror_rate",float(dst_host_srv_serror_rate)],
                     ["dst_host_rerror_rate",float(dst_host_rerror_rate)],
                     ["dst_host_srv_rerror_rate",float(dst_host_srv_rerror_rate)],
                     ]:
                 datum.add_number(k, v)

             # 3. train data and update jubatus model
             ret = anom.add(datum)

             # 4. output results
             if (ret.score != float('Inf')) and (ret.score!= 1.0):
                 print (ret, label)



--------------------------------
Explanation
--------------------------------

**config.json**

The configuration information is given by the JSON unit. Here is the meaning of each JSON field.


 * method

  Specify the algorithm used in anomaly detection. Currently, Recommender based "lof"(Local Outlier Factor) and Nearest Neighbor based "light_lof" are supported for anomaly detection. Here, we use "lof".


 * parameter

  Specify the parameters for anomaly detection algorithm set as method.
  Here, we use "lof" algorithm and set the parameters according to `Recommender API <http://jubat.us/ja/api_recommender.html>`_ .

 * converter

  Specify the configurations in feature converter. In this sample, we will set "num_rules" and "string_rules". 

  "num_rules" specifies the value extracting rules for values in numerical format.
  "key" is set as "*" here, which means all the "key" will be taken into account. "type" is set as "num", which means each value has its weight as equal as the value itself. For example, if data's value i "2", its weight is set as 2; if data's value is "6", its weight is set as 6.

 
  "string_rules" specifies the value extracting rules for values in string format.
  Here, "key" is set as "*", "type" is "str", "sample_weight" is "bin", and "global_weight" is "bin".
  This means, all the "key" will be taken into account, the features in strings values will be used without convertion, the weight of each key-value will be calculated throughout the whole data have been used, and the global weight is a constant value of "1".
  

  
**anomaly.py**

 anomaly.py will extract the data from text file, send them to Jubatus server, and get their anomaly detection result from the server.
 
 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 22).
  Setting the IP addr., RPC port of Jubatus Server.

 2. Prepare the learning data

  AnomalyClient will send the Datum to Jubatus server for data learning or anomaly detection, by using its "add" method.
  In this example, the result-data in KDD Cup(Knowledge Discovery and Data Mining Cup) is used as the trainning data. At first, the program read the training data from the TEXT file, one line at a time (Row 25). The data in TEXT file are seperated by commas, so we split the items by ’,’ (Row 27).
  Then, we make the data items stored in datum unit for model training later (Row 29-77).
  
 3. Model training (update learning model)

  Input the training data generated in step.2 into the add() method of AnomalyClient (Row 80).
  The first parameter in add() is the unique name for task identification in Zookeeper.
  (use null charactor "" for the stand-alone mode)
  The second parameter specifies the Datum generated in step.2.
  The returned result <string, float> is consisted of the data ID and its estimated anomaly value.
  
 4. Display result

  Display the returned value from add() method after a correction checking.
  The anomaly value should not be infinity or　1.0　(Row 83,84).


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

  ::

   $ python anomaly.py
 
**［Result］**

  ::

   id_with_score{id: 194, score: 1.0000441074371338} normal.
   id_with_score{id: 494, score: 1.4595649242401123} normal.
   id_with_score{id: 1127, score: 1.0642377138137817} normal.
   id_with_score{id: 1148, score: 1.0404019355773926} normal.
   id_with_score{id: 1709, score: 1.2717968225479126} normal.
   id_with_score{id: 2291, score: 1.388629674911499} normal.
   id_with_score{id: 2357, score: 1.0560613870620728} normal.
   id_with_score{id: 2382, score: 0.9994010925292969} normal.
   id_with_score{id: 2499, score: 0.7581642270088196} normal.


   …（omitted）
