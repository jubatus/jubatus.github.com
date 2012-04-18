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


common methods
-----------------

.. cpp:function:: bool save(std::string name, std::string arg1)

- ``name`` : ZooKeeperクラスタが学習器を一意に識別する値
- ``arg1`` : 保存するファイル名を指定

**すべての** サーバのローカルディスクに、それぞれのサーバが学習したモデルを保存する。


.. cpp:function:: bool load(std::string name, std::string arg1)

- ``name`` : ZooKeeperクラスタが学習器を一意に識別する値
- ``arg1`` : 保存するファイル名を指定

**すべての** サーバのローカルディスクから、それぞれのサーバが学習したモデルをロードする。

.. cpp:function:: bool set_config(std::string name, config_data c)

- ``name`` : ZooKeeperクラスタが学習器を一意に識別する値
- ``c`` : config_data

**すべての** サーバーのコンフィグを更新する。


.. cpp:function:: config_data get_config(std::string name)

- ``name`` : ZooKeeperクラスタが学習器を一意に識別する値

コンフィグを取得する。


.. cpp:function:: std::map<std::string, std::map<std::string, std::string > > get_status(std::string name)

- ``name`` : ZooKeeperクラスタが学習器を一意に識別する値

**すべての** サーバーの状態を取得する。各サーバーは、ホスト名とポートのペアで表される。それぞれのサーバーに関して、内部状態を文字列から文字列へのマップで状態を返す。




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






