Anomaly チュートリアル (Ruby)
====================================

ここではRuby版のAnomalyサンプルプログラムの解説をします。

--------------------------------
ソースコード
--------------------------------

このサンプルプログラムでは、学習の設定をするconfig.jsonと外れ値検知を行うanomaly.rbを利用します。以下にソースコードを記載します。

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

このクライアントは Jubatus 0.5.x 以降で動作します。

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
解説
--------------------------------

**config.json**

設定は単体のJSONで与えられます。JSONの各フィールドは以下のとおりです。

* method

 異常検知に使用するアルコリズムを指定します。
 Anomalyで指定できるのは、Recommenderベースの"lof"およびNearest Neighborベースの"light_lof"です。
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



**anomaly.rb**

 anomaly.rbでは、csvから読み込んだデータをJubatusサーバ与え、外れ値を検出し出力します。

 1. Jubatus Serverへの接続設定

  Jubatus Serverへの接続を行います（20行目）。
  Jubatus ServerのIPアドレス、Jubatus ServerのRPCポート番号を設定します。
  
 2. 学習用データの準備

  AnomalyClientでは、Datumをaddメソッドに与えることで、学習および外れ値検知が行われます。
  今回はKDDカップ（Knowledge Discovery and Data Mining Cup）の結果（TEXTファイル）を元に学習用データを作成していきます。
  まず、学習用データの元となるTEXTファイルを読み込みます（23-24行目）。
  このTEXTファイルはカンマ区切りで項目が並んでいるので、取得した1行を’,’で分割し要素ごとに分けます（25行目）。
  取得した要素を用いて学習用データdatumを作成します（26-67行目）。
  
 3. データの学習（学習モデルの更新）

  AnomalyClientのaddメソッドに2. で作成したデータを渡します（69行目）。
  addメソッドの第1引数は、タスクを識別するZookeeperクラスタ内でユニークな名前を指定します。（スタンドアロン構成の場合、空文字（""）を指定）
  第2引数として、先ほど2. で作成したDatumを指定します。
  戻り値として、tuple<string, float>型で点IDと異常値を返却します。
  
 4. 結果の出力

  addメソッドの戻り値である異常値から外れ値かどうかを判定します。
  異常値が無限ではなく、1.0以外の場合は外れ値と判断し出力します（72-74行目）。

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

 必要なパッケージとRubyクライアントを用意し、実行します。

 ::
  
   $ ruby anomaly.rb
 
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
   id_with_score{id: 2549, score: 1.011017084121704} normal.
   id_with_score{id: 2553, score: 1.263816475868225} normal.
   id_with_score{id: 2985, score: 1.408186435699463} normal.

   ...
   ...（以下略）
