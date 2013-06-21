Anomaly
=================

In this sample program, we will introduce how to detect anomaly values by using the jubaanomaly function from Jubatus Client.

Jubatus uses LOF（Local Outlier Factor) algorithm to support its anomaly detection.
The key idea of LOF is comparing the local density of a point's neighborhood with the local density of its neighbors. Points that have a substantially lower density than their neighbors are considered to be outliers.
LOF can be used for fraud detectin, fault detection, etc. 

-------------------------------------------
Abstract of sample program
-------------------------------------------

In this sample, we use the KDD Cup（Knowledge Discovery and Data Mining Cup） data for learning and detection.
At first, the data input from client side will be extracted and sent to server side for learning. Then, client will have a return value for each data as the judgement of anomaly detection, and demonstrate the results to the users.
KDD Cup data ``kddcup.data_10_percent.gz`` is available from `KDD Cup 1999 Data <http://kdd.ics.uci.edu/databases/kddcup99/kddcup99.html>`_. Please decompress it after download.



--------------------------------
Processing flow 
--------------------------------

Main flow of using Jubatus Client

 1. Connection settings to Jubatus Server

  Setting the HOST, RPC port of Jubatus Server

 2. Prepare the learning data

  Read the data from kddcup.data_10_percent.txt line by line.

 3. Model training（Update learning model）

  Using the add() method to send the learning data to server side, and training the learning model there.

 4. Output the result

  The return result in add() method is the judgement from the detection model at server side.

--------------------------------
Sample Program
--------------------------------

.. toctree::
   :maxdepth: 2

   anomaly_python
   anomaly_ruby
   anomaly_java
