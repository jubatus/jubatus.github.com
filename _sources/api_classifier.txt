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

 - Parameters:

  - ``hosts`` : IP address (ipv4) of jubaclassifier or jubakeeper
  - ``port`` :  Port number of jubaclassifier or jubakeeper
  - ``timeout_sec`` : Connection timeout for RPC

 - Returns:

  - new classifier object

 Constructor of classifier



classifier methods
---------------------

.. cpp:function:: int32_t train(std::string name, std::vector<std::pair<std::string, datum > > data)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``data`` : vector of pair of label and datum

 - Returns:

  - Zero if this function updates models successfully.

 Training model at a server chosen randomly. ``std::pair<std::string, datum>`` is a pair of datum and it's label. 
 This function is designed to allow bulk update with vector of pair of label and datum.


.. cpp:function:: std::vector<std::vector<estimate_result > > classify(std::string name, std::vector<datum > data)

 - Parameters:

  - ``name`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``data`` : vector of datum for classifiy

 - Returns:

  - Vector of estimate_results

 Estimating a result at a server choosen randomly. ``estimate_results`` is a vector of pair of label and it's reliablity value.






