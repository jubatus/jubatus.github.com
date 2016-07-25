Anomaly チュートリアル (Python)
=======================================

ここではPython版のAnomalyサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習の設定をするconfig.jsonと外れ値検知を行うanomaly.pyを利用します。以下にソースコードを記載します。

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
解説
--------------------------------

**config.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下のとおりです。


* method

 異常検知に使用するアルコリズムを指定します。
 Anomalyで指定できるのは、Recommenderベースの"lof"およびNearest Neighborベースの"light lof"です。
 今回は"lof"（Local Outlier Factor）を指定します。

* parameter

　methodで設定した異常検知アルゴリズムのパラメータを設定します。 
 今回は"lof"を利用するため、`Recommender API <http://jubat.us/ja/api_recommender.html>`_ に従ってパラメータを設定します。
 

* converter

 特徴変換の設定を指定します。
 ここでは、"num_rules"と"string_rules"を設定しています。
 
 "num_rules"は数値特徴の抽出規則を指定します。
 "key"は"*"つまり、すべての"key"に対して、"type"は"num"なので、指定された数値をそのまま重みに利用する設定です。
 具体的には、valueが"2"であれば"2"を、"6"であれば"6"を重みとします。
 
 "string_rules"は文字列特徴の抽出規則を指定します。
 "key"は"*"、"type"は"str"、"sample_weight"は"bin"、"global_weight"は"bin"としています。
 これは、すべての文字列に対して、指定された文字列をそのまま特徴として利用し、各key-value毎の重みと今までの通算データから算出される、大域的な重みを常に"1"とする設定です。


 ･･･

  
**anomaly.py**

 anomaly.pyでは、csvから読み込んだデータをJubatusにサーバ与え、外れ値を検出し出力します。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（22行目）。
  Jubatus ServerのIPアドレス、Jubatus ServerのRPCポート番号を設定します。
  
 2. 学習用データの準備

  AnomalyClientでは、Datumをaddメソッドに与えることで、学習および外れ値検知が行われます。
  今回はKDDカップ（Knowledge Discovery and Data Mining Cup）の結果（TEXTファイル）を元に学習用データを作成していきます。
  まず、学習用データの元となるTEXTファイルを読み込みます（25行目）。
  このTEXTファイルはカンマ区切りで項目が並んでいるので、取得した1行を’,’で分割し要素ごとに分けます（27行目）。
  取得した要素を用いて学習用データdatumを作成します（29-77行目）。
  
 3. データの学習（学習モデルの更新）

  AnomalyClientのaddメソッドに2. で作成したデータを渡します（80行目）。
  addメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。（スタンドアロン構成の場合、空文字（""）を指定）
  第2引数として、先ほど2. で作成したDatumを指定します。
  戻り値として、tuple<string, float>型で点IDと異常値を返却します。
  
 4. 結果の出力

  addメソッドの戻り値である異常値から外れ値かどうかを判定します。
  異常値が無限ではなく、1.0以外の場合は外れ値と判断し出力します（83,84行目）。

-------------------------------------
サンプルプログラムの実行
-------------------------------------

**[データのダウンロード]**

 :: 
 
  $ wget http://kdd.ics.uci.edu/databases/kddcup99/kddcup.data_10_percent.gz
  $ gunzip kddcup.data_10_percent.gz
  $ mv kddcup.data_10_percent kddcup.data_10_percent.txt

**［Jubatus Serverでの作業］**

 jubaanomalyを起動します。
 
 ::
 
  $ jubaanomaly --configpath config.json
 

**［Jubatus Clientでの作業］**
　
 ::

  $ python anomaly.py
 
**［実行結果］**

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


   …（以下略）
