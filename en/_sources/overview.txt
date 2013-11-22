Overview
========

In the coming era of extremely large databases, computer science will face new challenges in real Big Data applications such as nation-wide M2M sensor network analysis, online advertising optimization for millions of consumers, and real-time security monitoring on the raw Internet traffic.

In such applications, it is impractical or useless to apply ordinary approaches for data analysis on small datasets by storing all data into databases, analyzing the data on the databases as a batch-processing, and only visualizing the summarized output.

In fact, the future of data analytics platform should expand to three directions at the same time, handling even bigger data, applying deep analytics, and processing in real-time. However, there has been no such analytics platform for massive data streams of continuously generated Big Data with distributed scale-out architecture. For example,
Jubatus is the first open source platform for online distributed machine learning on the data streams of Big Data. We use a loose model sharing architecture for efficient training and sharing of machine learning models, by defining three fundamental operations; Update, Mix, and Analyze, in a similar way with the Map and Reduce operations in Hadoop.
The point is how to reduce the size of model and the number of the Mix operations while keeping high accuracy, since Mix-ing large models for many times causes high networking cost and high latency in the distributed environment.

Then our development team includes competent researchers who combine the latest advances in online machine learning, distributed computing, and randomized algorithms to provide efficient machine learning features for Jubatus. Currently, Jubatus supports basic tasks including classification, regression, clustering, nearest neighbor, outlier detection, and recommendation. A demo system for tweet categorization on fast Twitter data streams is available.


Jubatus is the first open source platform for online distributed machine learning on the data streams of Big Data.

Jubatus uses a loose model sharing architecture for efficient training and sharing of machine learning models, by defining three fundamental operations; Update, Mix, and Analyze, in a similar way with the Map and Reduce operations in Hadoop.

Our development team includes competent researchers who combine the latest advances in online machine learning, distributed computing, and randomized algorithms to provide efficient machine learning features for Jubatus.
Currently, Jubatus supports basic tasks including classification, regression, and recommendation.

Scalable
--------

Jubatus supports scalable machine learning processing. It can handle 100000 or more data per second using commodity hardware clusters. It is designed for clusters of commodity, shared-nothing hardware.

Real-Time
---------

Jubatus updates a model instantaneously just after receiving a data, and it analyze the data instantaneously

Deep-Analysis
-------------

Jubatus supports most tasks for deep analysis, including classification, regression, nearest neighbor, recommendation, anomaly detection, clustering, cluster analysis, simple statistics, and graph analysis, 


Difference from Hadoop and Mahout
---------------------------------

There many similar points between Hadoop/Mahout and Jubatus. These are scalable and run on commodity hardware.
However, Hadoop is not equipped with sophisticated machine learning algorithms since most of the algorithms do not fit its MapReduce paradigm. Though Apache Mahout is also a Hadoop-based machine learning platform, online processing of data streams is still out of the scope.

Jubatus processes data in online manner, and achieve high throughput and low latency.
To achieve these features together, Jubatus uses a unique loosely model synchronization for scale out and fast model sharing in distributed environments.

Jubatus processes all data in memory, and focus on operations for data analysis.
