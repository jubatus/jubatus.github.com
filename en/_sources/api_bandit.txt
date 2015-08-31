Bandit
------

* See `IDL definition <https://github.com/jubatus/jubatus/blob/master/jubatus/server/server/bandit.idl>`_ for detailed specification.

Configuration
~~~~~~~~~~~~~

Configuration is given as a JSON file.
We show each field below:

.. describe:: method

   Specify bandit algorithm.
   You can use the algorithms below.

   .. table::

      ==================== ===================================
      Value                Method
      ==================== ===================================
      ``"epsilon_greedy"`` Use epsilon-greedy.
      ``"ucb1"``           Use UCB1.
      ``"softmax"``        Use softmax.
      ``"exp3"``           Use exp3.
      ==================== ===================================

.. describe:: parameter

   Specify parameters for the algorithm.
   Its format differs for each ``method``.

   common
     :assume_unrewarded:
        Specify whether it can be omitted to call ``register_reward`` when the reward is zero.
        When it is True, calling ``register_reward`` can be omitted, but calling ``register_reward`` must be associated with the result of ``select_arm``.
        When it is False, although ``register_reward`` must be called when the reward is zero, it can be called independently of calling ``select_arm``.
        (Boolean)

   epsilon_greedy
     :epsilon:
        The probability of choosing arms randomly.
        With probability ``epsilon``, choose an arm according to uniform distribution.
        With probability 1 - ``epsilon``, choose the arm whose expectation value is the highest.
        (Float)

        * Range: 0.0 <= ``epsilon`` <= 1.0

   ucb1
     None

   softmax
     :tau:
        Temperature parameter.
        For high temperature, all arms are selected equally.
        For low temperature, arms with higher expected value are frequently selected.
        (Float)

        * Range: 0.0 < ``tau``

   exp3
     :gamma:
        Mixture rate of constant weight and each arm's weight.
        The higher ``gamma`` is, the higher the rate of constant weight is.
        The lower ``gamma`` is, the higher the rate of each arm's weight is.
        (Float)

        * Range: 0.0 < ``gamma`` <= 1.0


Example:
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

   The state of an arm.

   .. mpidl:member:: 0: int trial_count

      Number of times of an arm being selected.

   .. mpidl:member:: 1: double weight

       The weight of an arm.
..       Higher ``weight`` means that the arm will get more rewards.

   .. code-block:: c++

      message arm_info {
        0: int trial_count
        1: double weight
      }

Methods
~~~~~~~

.. mpidl:service:: bandit

   .. mpidl:method:: bool register_arm(0: string arm_id)

      :param arm_id: ID of the new arm to be registered
      :return:       True if succeeded in registering the arm. False if failed to register the arm.

      Register a new arm with the name of ``arm_id``.

   .. mpidl:method:: bool delete_arm(0: string arm_id)

      :param arm_id: ID of the arm to be deleted
      :return:       True if succeeded in deleting the arm. False if failed to delete the arm.

      Delete an arm with the name of ``arm_id``.

   .. mpidl:method:: string select_arm(0: string player_id)

      :param player_id: ID of the player whose arm is to be selected
      :return:          ``arm_id`` selected by bandit algorithm.

      Select player's arm according to current state.

   .. mpidl:method:: bool register_reward(0: string player_id, 1: string arm_id, 2: double reward)

      :param player_id: ID of the player whose arm gets rewards
      :param arm_id:    ID of the arm which rewards are registered with
      :param reward:    amount of rewards
      :return:          True if succeeded in registering reward. False if failed to register rewards.

      Register rewards with specified player's specified arm.

   .. mpidl:method:: map<string, arm_info> get_arm_info(0: string player_id)

      :param player_id: ID of the player
      :return:          arm information of specified player

      Get all arms information of specified player.

   .. mpidl:method:: bool reset(0: string player_id)

      :param player_id: ID of the user whose arms are to be reset.
      :return:          True if succeeded in resetting the arm. False if failed to reset.

      Reset all arms information of specified player.
