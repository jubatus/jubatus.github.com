Client API
=================

jubaclassifierは、MessagePack形式で指定されたデータを送出できるクライアントであれば、
実装言語を問わず利用することが出来る。2011年10月現在、C++/Pythonによるリファレンス実装が用意されている。

.. contents::


.. 本項では、C++の表記法を使ってAPIを解説する。
.. 他の言語も同様に実装されているので適当に読み替えて欲しい。

basic structs
-------------

jubatus::converter_config
~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: cpp

   typedef std::map<std::string, std::string> param_t;

   struct converter_config {
     std::map<std::string, param_t> string_filter_types;
     std::vector<filter_rule> string_filter_rules;

     std::map<std::string, param_t> num_filter_types;
     std::vector<filter_rule> num_filter_rules;

     std::map<std::string, param_t> string_types;
     std::vector<string_rule> string_rules;

     std::map<std::string, param_t> num_types;
     std::vector<num_rule> num_rules;
   };

``converter_config`` を構成する ``filter_rule`` などのメンバについては :ref:`conversion` を参照のこと。


jubatus::classifier::config_data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: c++

   struct config_data {
     std::string method;
     jubatus::converter_config converter;
   };



jubatus::classifier::estimate_result
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: c++

   struct estimate_result {
     std::string label_;
     double prob_;
   };

   typedef std::vector<estimate_result> estimate_results;




jubatus::client::classifier
-----------------------------------

constructor
~~~~~~~~~~~~~~~

.. cpp:function:: classifier(const string& hosts, const string& name, double timeout)

- ``hosts`` : jubakeeperのサーバ、ポートを指定。書式は、 ``ipaddress:port,hostname:port,...`` の形式に従うこと。
- ``name`` :  ZooKeeperクラスタがclassifierを一意に識別する値
- ``timeout`` : 通信時のタイムアウトまでの時間を指定


methods
~~~~~~~

.. cpp:function:: void classifier::save(const string& type, const string& id)

typeとidを指定して **すべての** サーバのローカルディスクに、それぞれのサーバが学習したモデルを保存する。


.. cpp:function:: void classifier::load(const string& type, const string& id)

typeとidを指定して **すべての** サーバのローカルディスクから、それぞれのサーバが学習したモデルをロードする。


.. cpp:function:: void classifier::set_config(const config_data& config)

**すべての** サーバーのコンフィグを更新する。


.. cpp:function:: config_data classifier::get_config()

コンフィグを取得する。



.. cpp:function:: void classifier::train(const std::vector<std::pair<std::string, datum> >& data)

ランダムにひとつ選んだサーバーで学習を行う。 ``std::pair<std::string, datum>`` は、あるdatumとそれに対するラベルの組み合わせである。これをvectorとして、一度で複数のdatumとラベルの組を学習させる。


.. cpp:function:: std::vector<estimate_results> classifier::classify(const std::vector<datum>& data)

ランダムにひとつ選んだサーバーで学習を行う。 複数のdatumを一度に渡すことができる。引数のdatumと戻り値のestimate_resultsは、vectorのオフセットで1:1に対応している。 ``estimate_results`` は信頼度つきのラベル候補を列挙したものとなる。


.. cpp:function:: std::map<std::pair<std::string, int>, std::map<std::string, std::string> > classifier::get_status()

**すべての** サーバーの状態を取得する。
各サーバーは、ホスト名とポートのペアで表される。それぞれのサーバーに関して、内部状態を文字列から文字列へのマップで状態を返す。


