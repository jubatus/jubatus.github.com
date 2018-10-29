Classifier
=================

In this section, we introduce a way to use ``jubaclassifier`` through a Jubatus client.

Classifier is a module to classify given data. For example, you can use Classifier to detect spam e-mails.

-------------------------------------
Overview
-------------------------------------

Let's use `gender <https://github.com/jubatus/jubatus-example/tree/master/gender>`_ as a sample program using Classifier. This program classifies a person into male or female through the features of his/her hair style, height and clothes.

As a first step, the program updates the model of ``jubaclassifier`` using the training data. A training data is a pair of a class (male or female) and features (hair style, height, clothes). After preparing some training data, the program makes ``jubaclassifier`` learn them.

Next, the program analyzes the test data using model of ``jubaclassifier`` . It prepares test data, and then ``jubaclassifier`` classifies each of them into male or female using the learned model.

For example, if you give the feature data as following to ``jubaclassifier``, it will return "female".

::

  "hair" is "long"
  "top" is "shirt"
  "bottom" is "skirt"
  "height" is 1.50


--------------------------------
Scenario
--------------------------------

The following is a typical flow of development using Jubatus Client:

1. Sets a connection configuration to ``jubaclassifier``
    Setting the HOST, RPC port and the instance name of ``jubaclassifier`` .

2. Prepare training data
    Make some pairs of classes and feature sets.

3. Train the model using prepared data (update the model)
    Send the training data to ``jubaclassifier`` using ``train`` method.

4. Prepare the test data
    Make a set of feature data.

5. Classify the test data
    Send the test data to ``jubaclassifier`` using ``classify`` method.

6. Output the result
    Compare the score value of each class, and output the class of the highest score.


--------------------------------
Sample Program
--------------------------------

.. toctree::
   :maxdepth: 2

   classifier_python
   classifier_ruby
   classifier_java
