Recommender
-----------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/recommender.idl>`_ を参照してください。
* 使用されているアルゴリズムの詳細については :doc:`method` を参照してください。


Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: method

   レコメンドに使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ===================================== ===================================
      設定値                                手法
      ===================================== ===================================
      ``"inverted_index"``                  コサイン類似度版の転置インデックスを利用する。
      ``"inverted_index_euclid"``           Euclid 距離版の転置インデックスを利用する。
      ``"minhash"``                         MinHash を利用する。 [Ping2010]_
      ``"lsh"``                             Locality Sensitive Hashing を利用する。
      ``"euclid_lsh"``                      Euclid 距離版の LSH を利用する。 [Andoni2005]_
      ``"nearest_neighbor_recommender"``    ``nearest_neighbor`` 実装を利用する。
      ===================================== ===================================


.. describe:: parameter

   アルゴリズムに渡すパラメータを指定する。
   ``method`` に応じて渡すパラメータは異なる。

   共通
     :unlearner(optional):
        忘却機能に利用するUnlearnerのアルゴリズムを指定する。
        忘却機能を利用しない場合、 このパラメータを省略する。
        :doc:`api_unlearner` で説明される ``unlearner`` を指定する。
        ここで指定された方法に基づいてデータを忘却する。

     :unlearner_parameter(optional):
        忘却機能に利用するUnlearnerに渡すパラメータを指定する。
        :doc:`api_unlearner` で説明される ``unlearner_parameter`` を指定する。
        ``unlearner`` を設定する場合、 ``unlearner_parameter`` の指定は必須である。
        ここで指定された件数以上のデータを忘却する。

   inverted_index
     なし

   inverted_index_euclid
     :ignore_orthogonal(optional):
        クエリ点と同一のキーを１つも持たない点を近傍探索時に無視する。
        これにより、転置インデックスによる類似度を有する点のみが探索結果に含まれるようになる。
        また、特定のユースケース(同一のキーを持つ点が少ない場合)では高速化に寄与する。
        このパラメータは省略可能であり、デフォルト値は ``false`` (無効)である。
        (Boolean)

   minhash
     :hash_num:
        ハッシュの個数を指定する。
        大きくすると正確な値に近づく代わりに、多くのメモリを消費する。
        (Integer)

        * 値域: 1 <= ``hash_num``

   lsh
     :hash_num:
        ハッシュ値のビット数を指定する。
        大きくすると正確な値に近づく代わりに、多くのメモリを消費する。
        (Integer)

        * 値域: 1 <= ``hash_num``

     :threads(optional):
        乱数生成や探索を行うスレッド数を指定する。
        省略した場合は従来と同様に1スレッドで動作する
        この値を大きくすると、ハッシュ生成や探索において、データを分割しマルチスレッドで並列処理するためレイテンシが小さくなる。
	負の値を指定した場合は実行する環境の論理CPUコア数が利用される。
	実行環境の論理CPUコア数よりも大きい値を指定した場合、スレッドは論理CPUコア数分しか起動しないが、データは ``threads`` 数に分割され先に処理が終わったスレッドが処理する。

	本パラメータはバージョン0.9.1から利用できる。

        本パラメータに値を設定したときの挙動は以下の通りである (Integer)

        * ``threads`` < 0 

          * ``threads`` に論理CPUコア数が設定され場合と同様の挙動になる

        * ``threads`` = 0

          *  ``threads`` に1を設定した場合と同様の挙動になる

        * 1 <= ``threads`` <= 論理CPUコア数

          * 指定した値のスレッド数の生成、データ分割が行われる

        * 論理CPUコア数 < ``threads`` 

          * 論理CPUコア数分のスレッドが起動する。ただし、データは ``threads`` 数に分割される

     :cache_size(optional):
        ハッシュに利用する射影ベクトルをキャッシュする個数を指定する。
        省略された場合射影ベクトルはキャッシュせず、ハッシュ計算の度に乱数を生成する。
        この数値を大きくするとレイテンシが小さくなる代わりに、消費メモリが増大する。
        (Integer)

        * 値域 0 <= cache_size          

   euclid_lsh
     :hash_num:
        ハッシュの数を指定する。
        大きくすると正確な値に近づく代わりに、再現率が低下し、また多くのメモリを消費する。
        (Integer)

        * 値域: 1 <= ``hash_num``

     :table_num:
        テーブルの数を指定する。
        大きくすると再現率が向上する代わりに、多くのメモリを消費し、レスポンスに時間がかかる。
        (Integer)

        * 値域: 1 <= ``table_num``

     :bin_width:
        量子化幅を指定する。
        大きくすると再現率が向上する代わりに、レスポンスに時間がかかる。
        (Float)

        * 値域: 0.0 < ``bin_width``

     :probe_num:
        探索するビンの数を指定する。
        大きくすると再現率が向上する代わりに、レスポンスに時間がかかる。
        (Integer)

        * 値域: 0 <= ``probe_num``

     :seed:
        内部で利用している乱数のシードを指定する。
        (Integer)

        * 値域: 0 <= ``seed`` <= :math:`2^{32} - 1`

     :threads(optional):
        乱数生成や探索を行うスレッド数を指定する。
        省略した場合は従来と同様に1スレッドで動作する
        この値を大きくすると、ハッシュ生成や探索において、データを分割しマルチスレッドで並列処理するためレイテンシが小さくなる。
	負の値を指定した場合は実行する環境の論理CPUコア数が利用される。
	実行環境の論理CPUコア数よりも大きい値を指定した場合、スレッドは論理CPUコア数分しか起動しないが、データは ``threads`` 数に分割され先に処理が終わったスレッドが処理する。

	本パラメータはバージョン0.9.1から利用できる。

        本パラメータに値を設定したときの挙動は以下の通りである (Integer)

        * ``threads`` < 0 

          * ``threads`` に論理CPUコア数が設定され場合と同様の挙動になる

        * ``threads`` = 0

          *  ``threads`` に1を設定した場合と同様の挙動になる

        * 1 <= ``threads`` <= 論理CPUコア数

          * 指定した値のスレッド数の生成、データ分割が行われる

        * 論理CPUコア数 < ``threads`` 

          * 論理CPUコア数分のスレッドが起動する。ただし、データは ``threads`` 数に分割される

     :cache_size(optional):
        ハッシュに利用する射影ベクトルをキャッシュする個数を指定する。
        省略された場合、射影ベクトルのキャッシュをせず、ハッシュ計算の度にベクトルを生成する。
        この数値を大きくするとレイテンシが小さくなる代わりに、消費メモリが増大する。
        (Integer)

        * 値域 0 <= cache_size

   nearest_neighbor_recommender
     :method:
        近傍探索に使用するアルゴリズムを指定する。
        使用可能なアルゴリズムの一覧は :doc:`api_nearest_neighbor` を参照のこと。

     :parameter:
        アルゴリズムに渡すパラメータを指定する。
        パラメータの一覧は :doc:`api_nearest_neighbor` を参照のこと。

.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "method": "lsh",
       "parameter" : {
         "hash_num" : 64
       },
       "converter" : {
         "string_filter_types": {},
         "string_filter_rules":[],
         "num_filter_types": {},
         "num_filter_rules": [],
         "string_types": {},
         "string_rules":[
           {"key" : "*", "type" : "str", "sample_weight":"bin", "global_weight" : "bin"}
         ],
         "num_types": {},
         "num_rules": [
           {"key" : "*", "type" : "num"}
         ]
       }
     }


Data Structures
~~~~~~~~~~~~~~~

.. mpidl:message:: id_with_score

   スコア付きのデータIDを表す。 

   .. mpidl:member:: 0: string id

      データのIDを表す。

   .. mpidl:member:: 1: float score

      IDに対して紐付かれた近傍性のスコアを表す。
      近傍性の値が大きいほど、よりお互いの近傍性が高いことを意味する。
      値域は ``0 <= score <= 1`` (``euclid_lsh`` の場合は ``-0`` 以下) となる。

   .. code-block:: c++

      message id_with_score {
        0: string id
        1: float score
      }


Methods
~~~~~~~

各メソッドの最初のパラメタ ``name`` は、タスクを識別する ZooKeeper クラスタ内でユニークな名前である。
スタンドアロン構成では、空文字列 (``""``) を指定する。

.. mpidl:service:: recommender

   .. mpidl:method:: bool clear_row(0: string id)

      :param id:   削除する行 ID
      :return:     行の削除に成功した場合 True

      ``id`` で指定される行を推薦テーブルから削除する。


   .. mpidl:method:: bool update_row(0: string id, 1: datum row)

      :param id:   行 ID
      :param row:  行に対応する :mpidl:type:`datum`
      :return:     モデルの更新に成功した場合 True

      行 ID ``id`` のデータを ``row`` を利用して更新する。
      同じ ``id`` を持つ行が既に存在する場合は、その行が ``row`` で差分更新される。
      存在しない場合は、新しい行のエントリが作成される。
      更新操作を受け付けたサーバが当該行を持つサーバーと同一であれば、操作は即次反映される。
      異なるサーバーであれば、mix 後に反映される。

   .. mpidl:method:: datum complete_row_from_id(0: string id)

      :param id:   行 ID
      :return:     ``id`` の近傍から未定義の値を補完した :mpidl:type:`datum`

      行 ``id`` の中で欠けている値を近傍から予測し、補完された :mpidl:type:`datum` を返す。

   .. mpidl:method:: datum complete_row_from_datum(0: datum row)

      :param row:  補完したい値が欠けた :mpidl:type:`datum`
      :return:     指定した :mpidl:type:`datum` で構成される row の中で欠けている値を補完した :mpidl:type:`datum`

      指定した ``row`` で欠けている値を近傍から予測し、補完された :mpidl:type:`datum` を返す。

   .. mpidl:method:: list<id_with_score> similar_row_from_id(0: string id, 1: uint size)

      :param id:   推薦テーブル内の行を表すID
      :param size: 返す近傍の数
      :return:     ``id`` で指定した近傍のidとその近傍性の値のリスト

      指定した行 ``id`` に近い行とその近傍性のリストを (最大で) ``size`` 個返す。

   .. mpidl:method:: list<id_with_score> similar_row_from_datum(0: datum row, 1: uint size)

      :param row:  補完したい :mpidl:type:`datum`
      :param size: 返す近傍の数
      :return:     ``row`` から構成された ``similar_result``

      指定した ``row`` に近い :mpidl:type:`datum` を持つ行とその近傍性のリストを (最大で) ``size`` 個返す。

   .. mpidl:method:: datum decode_row(0: string id)

      :param id:   推薦テーブル内の行を表すID
      :return:     行 ID ``id`` に対応する :mpidl:type:`datum`

      行 ``id`` の :mpidl:type:`datum` を返す。
      ただし、fv_converterで不可逆な処理を行なっている :mpidl:type:`datum` は復元されない。

   .. mpidl:method:: list<string> get_all_rows()

      :return:     すべての行の ID リスト

      すべての行の ID リストを返す。

   .. mpidl:method:: float calc_similarity(0: datum lhs, 1:datum rhs)

      :param lhs:  :mpidl:type:`datum`
      :param rhs:  別の :mpidl:type:`datum`
      :return:     ``lhs`` と ``rhs`` の類似度

      指定した 2 つの :mpidl:type:`datum` の類似度スコア (``id_with_score`` の ``score`` メンバを参照) を返す。

   .. mpidl:method:: float calc_l2norm(0: datum row)

      :param row:  :mpidl:type:`datum`
      :return:     ``row`` の L2 ノルム

      指定した ``row`` の L2 ノルムを返す。
