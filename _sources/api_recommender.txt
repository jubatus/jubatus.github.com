jubatus::client::recommender
===============================



typedef
--------

jubatus::recommender::config_data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: c++

   struct config_data {
     jubatus::converter_config converter;
     std::string similarity_name;
     std::string anchor_finder_name;
     std::string anchor_builder_name;
     size_t all_anchor_num;
     size_t anchor_num_per_data;
   };



jubatus::recommend::estimate_result
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: c++

    typedef std::vector<std::pair<std::string, float> > similar_result;
    typedef std::vector<std::pair<std::string, datum> > rows;



constructor
-----------------

.. cpp:function:: recommender(const std::string &host, uint64_t port, double timeout_sec)

 - Parameters:

  - ``hosts`` : IP address (ipv4) of jubaclassifier or jubakeeper
  - ``port`` :  Port number of jubaclassifier or jubakeeper
  - ``timeout_sec`` : Connection timeout for RPC

 - Returns:

  - new recommender object

 Constructor of recommender



recommender methods
---------------------

.. cpp:function:: update_row(std::string name, std::string id, datum arg2)

- Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``id`` : a string value to uniquely identifies a row in a recommendation table
  - ``arg2`` : vector of datum

 - Returns:

  - True if this function updates models successfully.

 rowデータをdataを利用して差分更新する．同じ特徴番号がある場合は上書き更新する．新しいrow idが指定された場合は，新しいrowエントリを作成する．更新操作は同じサーバーであれば即次反映され，異なるサーバーであれば，mix後に反映される．


.. cpp:function:: void clear_row(const std::vector<std::string>& ids);



.. cpp:function:: void build(); 

recommenderをbuildする。build() is only for standalone mode

.. cpp:function:: datum complete_row_from_id(const std::string& id);

指定したidのrowの中で欠けている値を予測して返す。

.. cpp:function:: datum complete_row_from_data(const datum& dat);

指定したdatumで構成されるrowの中で欠けている値を予測して返す。

.. cpp:function:: jubatus::recommender::similar_result similar_row_from_id(const std::string& id, size_t ret_num);

指定したidに近いrowを返す。

.. cpp:function:: jubatus::recommender::similar_result similar_row_from_data(const datum& dat, size_t ret_num);

指定したdatumで構成されるrowに近いrowを返す。

.. cpp:function:: datum decode_row(const std::string& id);

<FIXME>

.. cpp:function:: jubatus::recommender::rows get_all_rows();

すべてのrowを返す。


