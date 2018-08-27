JubaQL Overview
===============

Data Modeling using Machine Learning and JubaQL
-----------------------------------------------

In general, there are five steps when use machine learning for business.

1. Data collection
2. Hypothesis Generation
3. Hypothesis Validation
4. Data Modeling based on the hypothesis
5. Building online system using the model


Jubatus supports various machine learning algorithms, and is a powerful tool on the latter two steps above, i.e., data modeling based on the hypothesis and building online system using the model.
However, Jubatus users need an effort that is inconvenient for the former three phases.

Therefore, we developed JubaQL as a DSL based on SQL/CQL, so as to reduce the entry barriers to use Jubatus for machine learning tasks in a stream processing environment.


Goal of JubaQL
--------------

**JubaQL** is a SQL/CQL based DSL(Domain Specific Language) and its implementation.
The overall goal of JubaQL are as follows:

1. Making it easy to use for domain experts to use Jubatus for machine learning tasks with real-world data.
2. Integration of batch-processing and stream-processing


Functions
---------

The major functions of JubaQL are as follows:

 ・ SQL-Like syntax

    JubaQL should be a language that is easy to learn, easy to use, and should look familiar to the typical data scientist.
    Therefore an SQL-like syntax was chosen and enriched by terms from machine learning where it seemed appropriate.

 ・ Stream Re-Processing

    JubaQL allow to do easy stream re-processing, i.e., start processing with previously archived stream data (e.g., stored in HDFS) and then seamlessly switch to live stream data (e.g., coming from `Apache Kafka <http://kafka.apache.org/>`_.) This allows to obtain reproducible results and can be used for parameter tuning.

 ・ Cascaded Processing

    It is possible to modify and enhance streams entirely on the server side, without data being exchanged with the client.
    The most important use case is to use analysis results from one model as input for another model without user intervention or client-server traffic.

 ・ Trigger-based Actions

    JubaQL enables you to define functions (UDF = *user-defined function*) and install them as triggers on a stream that are executed when some condition is fulfilled.
    One important use case would be to store data in a database or send a notification when a certain event is discovered, without the need to poll the server repeatedly.

 ・ Time-Series Analysis

    You can define time windows on a stream, compute features for these time windows and train/query Jubatus using these features.
    This can be used whenever analysis of multiple subsequent events (as opposed to a single event in time) shall be done, e.g., for location traces.
