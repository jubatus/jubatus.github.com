Python
==================

ここではPython版のAnomalyサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習の設定をするconfig.jsonと外れ値検知を行うanomaly.pyを利用します。以下にソースコードを記載します。

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
 11 :     # 1.Jubatus Serverへの接続設定
 12 :     anom = client.anomaly("127.0.0.1",9199)
 13 : 
 14 :     # 2.学習用データの準備
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
 67 :         # 3.データの学習（学習モデルの更新）
 68 :         ret = anom.add(NAME, datum)
 69 :         
 70 :         # 4.結果の出力
 71 :         if (ret[1] != float('Inf')) and (ret[1] != 1.0):
 72 :             print ret, label
 73 : 


--------------------------------
解説
--------------------------------

**config.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下のとおりです。


* method

 分類に使用するアルコリズムを指定します。
 Regressionで指定できるのは、現在"LOF"のみなので"LOF"（Local Outlier Factor）を指定します。


* converter

 特徴変換の設定を指定します。
 ここでは、"num_rules"と"string_rules"を設定しています。
 
 "num_rules"は数値特徴の抽出規則を指定します。
 "key"は"*"つまり、すべての"key"に対して、"type"は"num"なので、指定された数値をそのまま重みに利用する設定です。
 具体的には、valueが"2"であれば"2"を、"6"であれば"6"を重みとします。
 
 "string_rules"は文字列特徴の抽出規則を指定します。
 "key"は"*"、"type"は"str"、"sample_weight"は"bin"、"global_weight"は"bin"としています。
 これは、すべての文字列に対して、指定された文字列をそのまま特徴として利用し、各key-value毎の重みと今までの通算データから算出される、大域的な重みを常に"1"とする設定です。

* parameter（要修正）

 ･･･

  
**anomaly.py**

 anomaly.pyでは、csvから読み込んだデータをJubatusにサーバ与え、外れ値を検出し出力します。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（12行目）。
  Jubatus ServerのIPアドレス、Jubatus ServerのRPCポート番号を設定します。
  
 2. 学習用データの準備

  AnomalyClientでは、Datumをaddメソッドに与えることで、学習および外れ値検知が行われます。
  今回はKDDカップ（Knowledge Discovery and Data Mining Cup）の結果（TEXTファイル）を元に学習用データを作成していきます。
  まず、学習用データの元となるTEXTファイルを読み込みます（15行目）。
  このTEXTファイルはカンマ区切りで項目が並んでいるので、取得した1行を’,’で分割し要素ごとに分けます（16行目）。
  取得した要素を用いて学習用データdatumを作成します（18-65行目）。
  
 3. データの学習（学習モデルの更新）

  AnomalyClientのaddメソッドに2. で作成したデータを渡します（68行目）。
  addメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。（スタンドアロン構成の場合、空文字（""）を指定）
  第2引数として、先ほど2. で作成したDatumを指定します。
  戻り値として、tuple<string, float>型で点IDと異常値を返却します。
  
 4. 結果の出力

  addメソッドの戻り値である異常値から外れ値かどうかを判定します。
  異常値が無限ではなく、1.0以外の場合は外れ値と判断し出力します（71,72行目）。

-------------------------------------
サンプルプログラムの実行
-------------------------------------

**［Jubatus Serverでの作業］**

 jubaanomalyを起動します。
 
 ::
 
  $ jubaanomaly --configpath config.json
 

**［Jubatus Clientでの作業］**

 $ python anomaly.py
 
**［実行結果］**

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
 …（以下略）
