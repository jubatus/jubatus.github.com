Overview
========

In the coming era of extremely large databases, computer science will face new challenges in real Big Data applications such as nation-wide M2M sensor network analysis, online advertising optimization for millions of consumers, and real-time security monitoring on the raw Internet traffic.

In such applications, it is impractical or useless to apply ordinary approaches for data analysis on small datasets by storing all data into databases, analyzing the data on the databases as a batch-processing, and only visualizing the summarized output. 

In fact, the future of data analytics platform should expand to three directions at the same time, handling even bigger data, applying deep analytics, and processing in real-time. However, there has been no such analytics platform for massive data streams of continuously generated Big Data with a distributed scale-out architecture. For example, 
Jubatus is the first open source platform for online distributed machine learning on the data streams of Big Data. We use a loose model sharing architecture for efficient training and sharing of machine learning models, by defining three fundamental operations; Update, Mix, and Analyze, in a similar way with the Map and Reduce operations in Hadoop. 
The point is how to reduce the size of model and the number of the Mix operations while keeping high accuracy, since Mix-ing large models for many times causes high networking cost and high latency in the distributed environment. 

Then our development team includes competent researchers who combine the latest advances in online machine learning, distributed computing, and randomized algorithms to provide efficient machine learning features for Jubatus. Currently, Jubatus supports basic tasks including classification, regression, and recommendation. A demo system for tweet categorization on fast Twitter data streams is available.


Jubatusは、ストリームのビッグデータを分散環境で機械学習する世界で初めてのオープンソースです。

Jubatusは、効率良く機械学習のモデルを共有したり分散処理したりするために、「ゆるい共有」というアーキテクチャを採用しています。ゆるい共有とはリアルタイム処理における機械学習タスクが、精度と性能のトレードオフ関係にあることに注目し、多少の精度を落としても性能を優先させるような共有方式です。
Jubatusは、このゆるい共有アーキテクチャのもとで、分散環境における機械学習という問題を、Update、Mix、Analyzeの3つのベースとなる処理にモデル化しています。これはちょうどHadoopのMapとReduceの処理にモデル化しているのと同じです。

Jubatusの開発チームには、オンライン機械学習、乱択アルゴリズム、分散処理などの研究者がおり、日々Jubatusの素晴らしい新機能を開発しています。
現在、Jubatusは、分類、回帰、推薦、グラフマイニングを含む多くのタスクをサポートしています。


Scalable
--------

Jubatusは、コモディティサーバで10万qpsを超えるスケーラブルな機械学習を実現しています。

Real-Time
---------

Jubatusは、データを受信するとすぐにモデルを更新します。そして要求がくるとすぐにそのモデルを使って分析します。


Deep-Analysis
-------------

Jubatus 分類、回帰、統計、推薦、グラフマイニングなど多くの深い分析を実現しています。


Difference from Hadoop and Mahout
---------------------------------
Hadoop/MahoutとJubatusの間には多くの共通点があります。これらはスケーラブルで、コモディティサーバ上で動作します。
しかし Hadoopは、機械学習がMapReduceパラダイムにあまり適合していないこともあり、洗練された機械学習機能を備えていません。
Apache Mahout も Hadoop-based な機械学習プラットフォームですが、オンライン処理はスコープ外です。

Jubatusは、データ分析に特化しています。
Jubatusは、すべてのデータをメモリ上で処理し、オンラインで処理し、高いスループットと低いレイテンシを実現します。
この機能を実現するために、Jubatusは分散環境におけるゆるいモデルの共有と同期というアーキテクチャを採用しているのです。
