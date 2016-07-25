Ruby
==================

Here we explain the Ruby sample program of anomaly detection.

--------------------------------
Source_code
--------------------------------

In this sample program, we will explain 1) how to configure the learning-algorithms in Jubatus with the config file 'config.json'; 2) how to detect the anomaly data with the example file ‘anomaly.rb’. Here are the source codes of 'config.json' and 'anomaly.rb'.

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

**anomaly.rb**

.. code-block:: ruby
 :linenos:

  #!/usr/bin/env ruby
  # -*- coding: utf-8 -*-

  $host = "127.0.0.1"
  $port = 9199
  $name = "test"

  require 'json'

  require 'jubatus/anomaly/client'

  # 0. set keyboard interruption handler"
  Signal.trap(:INT) {
      print "You pressed Ctrl+C."
      print "Stop running the job."
      exit(0)
  }

  # 1. Configuration to connect Jubatus Server
  client = Jubatus::Anomaly::Client::Anomaly.new($host, $port, $name)

  # 2. prepare training dataset
  open("../kddcup.data_10_percent.txt") { |f|
    f.each { |line|
      duration, protocol_type, service, flag, src_bytes, dst_bytes, land, wrong_fragment, urgent, hot, num_failed_logins, logged_in, num_compromised, root_shell, su_attempted, num_root, num_file_creations, num_shells, num_access_files, num_outbound_cmds, is_host_login, is_guest_login, count, srv_count, serror_rate, srv_serror_rate, rerror_rate, srv_rerror_rate, same_srv_rate, diff_srv_rate, srv_diff_host_rate, dst_host_count, dst_host_srv_count, dst_host_same_srv_rate, dst_host_diff_srv_rate, dst_host_same_src_port_rate, dst_host_srv_diff_host_rate, dst_host_serror_rate, dst_host_srv_serror_rate, dst_host_rerror_rate, dst_host_srv_rerror_rate, label = line.split(",")
            data = Jubatus::Common::Datum.new(
        "protocol_type" => protocol_type,
        "service" => service,
        "flag" => flag,
        "land" => land,
        "logged_in" => logged_in,
        "is_host_login" => is_host_login,
        "is_guest_login" => is_guest_login,
            "duration" => duration.to_f,
        "src_bytes" => src_bytes.to_f,
        "dst_bytes" => dst_bytes.to_f,
        "wrong_fragment" => wrong_fragment.to_f,
        "urgent" => urgent.to_f,
        "hot" => hot.to_f,
        "num_failed_logins" => num_failed_logins.to_f,
        "num_compromised" => num_compromised.to_f,
        "root_shell" => root_shell.to_f,
        "su_attempted" => su_attempted.to_f,
        "num_root" => num_root.to_f,
        "num_file_creations" => num_file_creations.to_f,
        "num_shells" => num_shells.to_f,
        "num_access_files" => num_access_files.to_f,
        "num_outbound_cmds" => num_outbound_cmds.to_f,
        "count" => count.to_f,
        "srv_count" => srv_count.to_f,
        "serror_rate" => serror_rate.to_f,
        "srv_serror_rate" => srv_serror_rate.to_f,
        "rerror_rate" => rerror_rate.to_f,
        "srv_rerror_rate" => srv_rerror_rate.to_f,
        "same_srv_rate" => same_srv_rate.to_f,
        "diff_srv_rate" => diff_srv_rate.to_f,
        "srv_diff_host_rate" => srv_diff_host_rate.to_f,
        "dst_host_count" => dst_host_count.to_f,
        "dst_host_srv_count" => dst_host_srv_count.to_f,
        "dst_host_same_srv_rate" => dst_host_same_srv_rate.to_f,
        "dst_host_same_src_port_rate" => dst_host_same_src_port_rate.to_f,
        "dst_host_diff_srv_rate" => dst_host_diff_srv_rate.to_f,
        "dst_host_srv_diff_host_rate" => dst_host_srv_diff_host_rate.to_f,
        "dst_host_serror_rate" => dst_host_serror_rate.to_f,
        "dst_host_srv_serror_rate" => dst_host_srv_serror_rate.to_f,
        "dst_host_rerror_rate" => dst_host_rerror_rate.to_f,
        "dst_host_srv_rerror_rate" => dst_host_srv_rerror_rate.to_f)
      # 3. training
            ret = client.add(data)


      # 4. output results
            if (ret.score != Float::INFINITY) and (ret.score != 1.0) then
                print ret, ' ', label
            end
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
  Here, we use "lof" algorithm and set the parameters according to `Recommender API <http://jubat.us/ja/api_recommender.html>`_ .

 * converter

  Specify the configurations in feature converter. In this sample, we will set "num_rules" and "string_rules". 

  "num_rules" specifies the value extracting rules for values in numerical format.
  "key" is set as "*" here, which means all the "key" will be taken into account. "type" is set as "num", which means each value has its weight as equal as the value itself. For example, if data's value i "2", its weight is set as 2; if data's value is "6", its weight is set as 6.

 
  "string_rules" specifies the value extracting rules for values in string format.
  Here, "key" is set as "*", "type" is "str", "sample_weight" is "bin", and "global_weight" is "bin".
  This means, all the "key" will be taken into account, the features in strings values will be used without convertion, the weight of each key-value will be calculated throughout the whole data have been used, and the global weight is a constant value of "1".




**anomaly.rb**

 anomaly.rb will extract the data from text file, send them to Jubatus server, and get their anomaly detection result from the server.

 1. Connect to Jubatus Server

  Connect to Jubatus Server (Row 20).
  Setting the IP addr., RPC port of Jubatus Server.

 2. Prepare the learning data

  AnomalyClient will send the Datum to Jubatus server for data learning or anomaly detection, by using its "add" method.
  In this example, the result-data in KDD Cup(Knowledge Discovery and Data Mining Cup) is used as the trainning data. At first, the program read the training data from the TEXT file, one line at a time (Row 23-24). The data in TEXT file are seperated by commas, so we split the items by ’,’ (Row 25).
  Then, we make the data items stored in datum unit for model training later (Row 26-67).
  
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
 
 Get the required package and Ruby client ready.
 Run!

 ::
  
   $ ruby anomaly.rb
 
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
   id_with_score{id: 2549, score: 1.011017084121704} normal.
   id_with_score{id: 2553, score: 1.263816475868225} normal.
   
   ...
   ...(omitted)
