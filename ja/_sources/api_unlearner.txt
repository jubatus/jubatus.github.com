Unlearner
----------

* このアルゴリズムは単品では使用されず、 :doc:`api_classifier`, :doc:`api_recommender`, :doc:`api_anomaly` のconfig経由で指定され利用される。

Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: unlearner

   忘却に使用するアルゴリズムを下記の2つから選択する。

   .. table::

      ================ ===================================
      設定値           手法
      ================ ===================================
      ``"random"``     ランダムに要素を削除する。
      ``"lru"``        Least Recently Updated に従い要素を削除する。
      ================ ===================================

.. describe:: unlearner_parameter

   アルゴリズムに渡すパラメータを指定する。

   :max_size:
     保持するデータの件数を指定する。
     小さくするほどメモリ消費量が低下し、処理時間が高速になり、精度が劣化する。
     (Integer)

     * 値域: 0 < ``max_size`` < 2147483647

   :sticky_pattern:
     忘却の対象外とする ID のパターンを指定する。
     パターンの指定方法は :doc:`fv_convert` の適用規則で使用される ``key`` と同様である。
     ``lru`` 利用時のみ指定できる。
     このパラメータは省略可能である。
     省略した場合は、すべての ID が忘却の対象となる。
     (String)

.. describe:: 例

   .. code-block:: javascript

      {
        "unlearner" : "lru",
        "unlearner_parameter" : {
          "max_size": 16777216
        }
      }
