jubatus::client::classifier
===============================




typedef
--------

jubatus::classifier::config_data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: c++

   struct config_data {
     std::string method;
     jubatus::converter_config converter;
   };



jubatus::classifier::estimate_result
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: c++

   struct estimate_result {
     std::string label_;
     double prob_;
   };

   typedef std::vector<estimate_result> estimate_results;




constructor
-----------------

.. cpp:function:: classifier(const std::string &host, uint64_t port, double timeout_sec)

- ``hosts`` : jubaclassifier or jubakeeperのサーバIPアドレス(ipv4)を指定
- ``port`` :  jubaclassifier or jubakeeperのサーバのポートを指定
- ``timeout_sec`` : 通信時のタイムアウトまでの時間を指定


classifier methods
---------------------

.. cpp:function:: int32_t train(std::string name, std::vector<std::pair<std::string, datum > > data)

- ``name`` : ZooKeeperクラスタが学習器を一意に識別する値
- ``data`` : あるdatumとそれに対するラベルのpairのvector

ランダムにひとつ選んだサーバーで学習を行う。 ``std::pair<std::string, datum>`` は、あるdatumとそれに対するラベルの組み合わせである。これをvectorとして、一度で複数のdatumとラベルの組を学習させる。


.. cpp:function:: std::vector<std::vector<estimate_result > > classify(std::string name, std::vector<datum > data)

- ``name`` : ZooKeeperクラスタが学習器を一意に識別する値
- ``data`` : 分類したいdatumのvector

ランダムにひとつ選んだサーバーで学習を行う。 複数のdatumを一度に渡すことができる。引数のdatumと戻り値のestimate_resultsは、vectorのオフセットで1:1に対応している。 ``estimate_results`` は信頼度つきのラベル候補を列挙したものとなる。






