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

.. cpp:function:: classifier(const string& hosts, const string& name, double timeout)

- ``hosts`` : jubakeeperのサーバ、ポートを指定。書式は、 ``ipaddress:port,hostname:port,...`` の形式に従うこと。
- ``name`` :  ZooKeeperクラスタが学習器を一意に識別する値
- ``timeout`` : 通信時のタイムアウトまでの時間を指定


common methods
-----------------

.. cpp:function:: void classifier::save(const string& type, const string& id)

typeとidを指定して **すべての** サーバのローカルディスクに、それぞれのサーバが学習したモデルを保存する。


.. cpp:function:: void classifier::load(const string& type, const string& id)

typeとidを指定して **すべての** サーバのローカルディスクから、それぞれのサーバが学習したモデルをロードする。


.. cpp:function:: void classifier::set_config(const config_data& config)

**すべての** サーバーのコンフィグを更新する。


.. cpp:function:: config_data classifier::get_config()

コンフィグを取得する。

.. cpp:function:: std::map<std::pair<std::string, int>, std::map<std::string, std::string> > client::get_status()

**すべての** サーバーの状態を取得する。
各サーバーは、ホスト名とポートのペアで表される。それぞれのサーバーに関して、内部状態を文字列から文字列へのマップで状態を返す。




classifier methods
---------------------

.. cpp:function:: void classifier::train(const std::vector<std::pair<std::string, datum> >& data)

ランダムにひとつ選んだサーバーで学習を行う。 ``std::pair<std::string, datum>`` は、あるdatumとそれに対するラベルの組み合わせである。これをvectorとして、一度で複数のdatumとラベルの組を学習させる。


.. cpp:function:: std::vector<estimate_results> classifier::classify(const std::vector<datum>& data)

ランダムにひとつ選んだサーバーで学習を行う。 複数のdatumを一度に渡すことができる。引数のdatumと戻り値のestimate_resultsは、vectorのオフセットで1:1に対応している。 ``estimate_results`` は信頼度つきのラベル候補を列挙したものとなる。






