Weight
------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/weight.idl>`_ を参照してください。

Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

なお、設定に ``method``, ``parameter`` が指定されていても動作する (指定された値は無視される) ため、他のエンジンの設定ファイルをそのまま使用することができる。

.. describe:: converter

   特徴変換の設定を指定する。
   フォーマットは :doc:`fv_convert` で説明する。


例:
  .. code-block:: javascript

     {
       "converter" : {
         "string_filter_types" : {},
         "string_filter_rules" : [],
         "num_filter_types" : {},
         "num_filter_rules" : [],
         "string_types" : {},
         "string_rules" : [
           { "key" : "*", "type" : "str", "sample_weight" : "bin", "global_weight" : "bin" }
         ],
         "num_types" : {},
         "num_rules" : [
           { "key" : "*", "type" : "num" }
         ]
       }
     }


Data Structures
~~~~~~~~~~~~~~~

.. mpidl:message:: feature

   特徴ベクトルの次元を表す。

   .. mpidl:member:: 0: string key

      特徴ベクトルの次元名を表す。

   .. mpidl:member:: 1: float value

      特徴ベクトルの次元の重みを表す。

   .. code-block:: c++

      message feature {
        0: string key
        1: float value
      }


Methods
~~~~~~~

.. mpidl:service:: weight

   .. mpidl:method:: list<feature> update(0: datum d)

      :param data:  特徴抽出を行う :mpidl:type:`datum`
      :return:      抽出された特徴ベクトル

      重み情報を更新してから、更新された重みを元に ``d`` の特徴ベクトル変換処理を行い、その結果を返却する。

   .. mpidl:method:: list<feature> calc_weight(0: datum d)

      :param data:  特徴抽出を行う :mpidl:type:`datum`
      :return:      抽出された特徴ベクトル

      重み情報を更新せずに ``d`` の特徴ベクトル変換処理を行い、その結果を返却する。
