jubatus::client::stat
===============================

typedef
--------

jubatus::stat::config_data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: c++

   struct config_data {
     jubatus::converter_config converter;
     <FIXME>
   };




constructor
-----------------

.. cpp:function:: stat(const string& hosts, const string& name, double timeout)

- ``hosts`` : jubakeeperのサーバ、ポートを指定。書式は、 ``ipaddress:port,hostname:port,...`` の形式に従うこと。
- ``name`` :  ZooKeeperクラスタが学習器を一意に識別する値
- ``timeout`` : 通信時のタイムアウトまでの時間を指定


common methods
-----------------

.. cpp:function:: void stat::save(const string& type, const string& id)

typeとidを指定して **すべての** サーバのローカルディスクに、それぞれのサーバが学習したモデルを保存する。


.. cpp:function:: void stat::load(const string& type, const string& id)

typeとidを指定して **すべての** サーバのローカルディスクから、それぞれのサーバが学習したモデルをロードする。


.. cpp:function:: void stat::set_config(const config_data& config)

**すべての** サーバーのコンフィグを更新する。


.. cpp:function:: config_data stat::get_config()

コンフィグを取得する。

.. cpp:function:: std::map<std::pair<std::string, int>, std::map<std::string, std::string> > client::get_status()

**すべての** サーバーの状態を取得する。
各サーバーは、ホスト名とポートのペアで表される。それぞれのサーバーに関して、内部状態を文字列から文字列へのマップで状態を返す。



stat methods
---------------------

<FILLME>
