jubatus::client::regression
===============================

手法説明
~~~~~~~~

回帰問題は，入力 :math:`x` に対応する特徴ベクトル :math:`\phi(x) \in R^m` に対して，実数値の出力 :math:`y \in R` を当てる問題である．
今回実装したのは，線形回帰モデルである．
線形回帰モデルでは，パラメータ :math:`w \in R^m` を利用して，入力 :math:`x` に対して :math:`\hat{y} = w^T \phi(x) \in R` で予測する．

学習時には，分類問題同様，正解データセット :math:`\{(x_i, y_i)\}` を利用して，正解データに対して正しく予測できるように重みベクトルを推定する．
典型的には1800年代に，予測値と実測値との自乗和を最小化させる最小二乗法が提案されている．
この方法はバッチ処理になるため，今回の調査ではオンライン学習させる方法を利用した．

Passive Aggressive
------------------

Passive Aggressive (PA)  [Crammer06]_ は，Support Vector Regression (SVR) のオンライン版であり，同名の分類器を回帰問題に適用したアルゴリズムである．
PA は， (1) 現在の学習データが与えられた許容範囲 :math:`epsilon` 以下で予測する． (2) 分類問題の PA 同様，できる限り現在のパラメータと近い点を選ぶ，という二つの条件を満たすパラメータに更新する．
すなわち， :math:`\epsilon` -intensive hinge loss :math:`\ell(w; (x, y)) = \max(0, |w^T x - y| - \epsilon)` に対して，パラメータを 
:math:`w_{t+1} = w_{t} + \{\mathrm{sign}(y - w^Tx) \ell / |x|^2\} x` で逐次更新する．

さらに，大きく更新しすぎるのを防ぐために， PA-I 同様のコストを追加する．
オリジナルの PA-I では， :math:`\ell / |x|^2` の代わりに :math:`\min(C, \ell / |x|^2)` で更新するが，回帰問題では :math:`\ell` と :math:`x` のスケールに対して :math:`C` の調整が難しい．
そこで，  :math:`\ell` の標準偏差 :math:`\sigma` をオンラインで計測し， :math:`C` の値を調整する．
まず，予測値 :math:`w^T x` と 実測値 :math:`y` との差， :math:`e = y - w^T x` とする．
:math:`e` の平均と二乗の平均の予測値を， :math:`s_{t+1} = \alpha s_{t}  + (1-\alpha)e` と :math:`q_{t+1} = \alpha q_{t} + (1-\alpha)e^2` で更新する．
時刻 :math:`t` での標準偏差を :math:`\sigma_t = \sqrt{q_t - s_t^2}` で予測する．
実際の更新幅は， :math:`\{\mathrm{sign}(y - w^Tx) \min(C \sigma, \ell) / |x|^2\} x` となる．

.. [Crammer06] Koby Crammer, Ofer Dekel, Joseph Keshet, Shai Shalev-Shwartz, Yoram Singer, Online Passive-Aggressive Algorithms. Journal of Machine Learning Research, 2006.


Iterative Parameter Mixture
---------------------------

分類問題同様，重みベクトルは Iterative Parameter Mixture [McDonald10]_ [Mann09]_ で混ぜ合わせる．
これは，各マシンが単独で学習アルゴリズムを動かし，一定時間，あるいは決められた条件ごとに，すべてのマシンの重みを集めて，それらの平均を計算する．
平均ベクトルは再度全てのサーバーに配られて，それを初期値と思って学習を再開する．

もともと分類問題向けのモデル共有方法であるが，線形回帰モデルではモデルパラメータが同じ形をしているので，同様に分散学習させることができる可能性が高い．

typedef
--------

jubatus::regression::config_data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: c++

   struct config_data {
     std::string method;
     jubatus::converter_config converter;
   };



jubatus::regression::estimate_result
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: c++

   typedef float estimate_rusult;
   typedef std::vector<estimate_result> estimate_results;




constructor
-----------------

.. cpp:function:: regression(const std::string &host, uint64_t port, double timeout_sec)

- ``hosts`` : jubaregression or jubakeeperのサーバIPアドレス(ipv4)を指定
- ``port`` :  jubaregression or jubakeeperのサーバのポートを指定
- ``timeout_sec`` : 通信時のタイムアウトまでの時間を指定


regression methods
---------------------

.. cpp:function:: int32_t train(std::string arg0, std::vector<std::pair<float, datum > > arg1)

- ``arg0`` : ZooKeeperクラスタが学習器を一意に識別する値
- ``arg1`` : あるdatumとそれに対する値のpairのvector

ランダムにひとつ選んだサーバーで学習を行う。 ``std::pair<float, datum>`` は、あるdatumとそれに対する値の組み合わせである。これをvectorとして、一度で複数のdatumと値の組を学習させる。


.. cpp:function:: std::vector<float > estimate(std::string arg0, std::vector<datum > arg1)

- ``arg0`` : ZooKeeperクラスタが学習器を一意に識別する値
- ``arg1`` : あるdatumのvector

ランダムにひとつ選んだサーバーで学習を行う。 複数のdatumを一度に渡すことができる。引数のdatumと戻り値のestimate_resultは、vectorのオフセットで1:1に対応している。 ``estimate_result`` は回帰の結果を返す。

