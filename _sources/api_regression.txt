jubatus::client::regression
===============================


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

 - Parameters:

  - ``hosts`` : IP address (ipv4) of jubaclassifier or jubakeeper
  - ``port`` :  Port number of jubaclassifier or jubakeeper
  - ``timeout_sec`` : Connection timeout for RPC

 - Returns:

  - new regression object

 Constructor of regression

regression methods
---------------------

.. cpp:function:: int32_t train(std::string arg0, std::vector<std::pair<float, datum > > arg1)

 - Parameters:

  - ``arg0`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``arg1`` : vector of pair of label and datum

 - Returns:

  - Zero if this function updates models successfully.

 Training model at a server chosen randomly. ``std::pair<float, datum>`` is a pair of datum and it's value. 
 This function is designed to allow bulk update with vector of pair of value and datum.


.. cpp:function:: std::vector<float > estimate(std::string arg0, std::vector<datum > arg1)

 - Parameters:

  - ``arg0`` : a string value to uniquely identifies a task in zookeeper quorum
  - ``arg1`` : vector of datum for classifiy

 - Returns:

  - Vector of estimate_results

 Estimating a result at a server choosen randomly. ``estimate`` is a vector of estimated value.

