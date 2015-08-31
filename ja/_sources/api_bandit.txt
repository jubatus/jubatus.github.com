Bandit
------

* 詳細な仕様は `IDL 定義 <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/bandit.idl>`_ を参照してください。

Configuration
~~~~~~~~~~~~~

設定は単体の JSON で与えられる。
JSON の各フィールドは以下のとおりである。

.. describe:: method

   バンディットに使用するアルゴリズムを指定する。
   以下のアルゴリズムを指定できる。

   .. table::

      ==================== ===================================
      設定値               手法
      ==================== ===================================
      ``"epsilon_greedy"`` epsilon-greedy法を利用する。
      ``"ucb1"``           UCB1法を利用する。
      ``"softmax"``        softmax法を利用する。
      ``"exp3"``           exp3法を利用する。
      ==================== ===================================

.. describe:: parameter

   アルゴリズムに渡すパラメータを指定する。
   ``method`` に応じて渡すパラメータは異なる。

   共通
     :assume_unrewarded:
        報酬がゼロの場合に ``register_reward`` の呼び出しを省略できるか否かを指定する。
        True の場合、 ``select_arm`` によって選択された腕から得られた報酬がゼロの場合には ``register_reward`` の呼び出しを省略できる。ただし、 ``register_reward`` の呼び出しは ``select_arm`` の結果に対応していなければならない。
        False の場合、報酬がゼロであっても必ず ``register_reward`` を呼び出す必要があるが、 ``register_reward`` の呼び出しを ``select_arm`` の呼び出しとは無関係に行う事ができる。
        (Boolean)

   epsilon_greedy
     :epsilon:
        腕の選択をランダムに行う確率を指定する。
        確率 ``epsilon`` で一様分布からランダムに腕を選択し、確率 1 - ``epsilon`` で現在最も期待値の高い腕を選択する。
        (Float)

        * 値域: 0.0 <= ``epsilon`` <= 1.0

   ucb1
      なし

   softmax
     :tau:
        温度パラメータを指定する。
        大きくするほどランダムに腕の選択を行い、小さくするほど期待値の高い腕が選ばれやすくなる。
        (Float)

        * 値域: 0.0 < ``tau``

   exp3
     :gamma:
        腕の重みの混合比率を指定する。
        gammaを大きくするほど全腕共通の重みの比率が高くなり、小さくするほど各腕固有の重みの比率が高くなる。
        (Float)

        * 値域: 0.0 < ``gamma`` <= 1.0


例:
  .. code-block:: javascript

     {
       "method" : "epsilon_greedy",
       "parameter" : {
         "assume_unrewarded" : false,
         "epsilon" : 0.1
       }
     }


Data Structures
~~~~~~~~~~~~~~~

.. mpidl:message:: arm_info

   腕の状態を表す。

   .. mpidl:member:: 0: int trial_count

      腕が選択された回数を表す。

   .. mpidl:member:: 1: double weight

     腕の重みを表す。

   .. code-block:: c++

      message arm_info {
        0: int trial_count
        1: double weight
      }

Methods
~~~~~~~

.. mpidl:service:: bandit

   .. mpidl:method:: bool register_arm(0: string arm_id)

      :param arm_id:  新たに登録する腕のID
      :return:        腕の登録に成功した場合True, 失敗した場合にFalse

      ``arm_id`` で指定された腕を新たに登録する。

   .. mpidl:method:: bool delete_arm(0: string arm_id)

      :param arm_id: 削除する腕のID
      :return:       腕の削除に成功した場合True, 失敗した場合にFalse

      ``arm_id`` で指定された腕を削除する。

   .. mpidl:method:: string select_arm(0: string player_id)

      :param player_id: 腕を選択されるプレイヤーのID
      :return:          選択された腕のID

      ``player_id`` で指定されたプレイヤーの腕を選択する。

   .. mpidl:method:: bool register_reward(0: string player_id, 1: string arm_id, 2: double reward)

      :param player_id: 報酬を登録するプレイヤー
      :param arm_id:    報酬を登録する腕
      :param reward:    報酬の値
      :return:          報酬の登録に成功した場合 True 失敗した場合 False

      ``player_id`` で指定されたプレイヤーの ``arm_id`` で指定された腕に報酬を登録する。

   .. mpidl:method:: map<string, arm_info> get_arm_info(0: string player_id)

      :param player_id: 腕の情報を取得するプレイヤー
      :return:          指定されたプレイヤーの腕の情報

      ``player_id`` で指定されたプレイヤーの腕の情報を返却する。

   .. mpidl:method:: bool reset(0: string player_id)

      :param player_id: 腕の情報をリセットするプレイヤー
      :return:          情報のリセットに成功した場合 True 失敗した場合 False

      ``player_id`` で指定されたプレイヤーの腕の情報を全てリセットする。
