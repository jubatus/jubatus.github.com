Regression
==================

In this sample program, we will introduce how to use the linear regression function ``jubaregression`` through the Jubatus Client.

By using linear regression, we can estimate the output from the input data. This is useful for the power consumption forecast, stock price prediction, and etc.


-----------------------------------
Abstract of sample program
-----------------------------------

In this sample, we will use a `rent <https://github.com/jubatus/jubatus-example/tree/master/rent>`_ program to estimate the rent of a house, from the condition of the distance from the station, space, age, etc.

At first, please download the rent-data, from (`rent-data.csv <https://raw.github.com/jubatus/jubatus-example/master/rent/dat/rent-data.csv>`_). It is used to training the regression model in ``jubaregression`` .

Next, housing data for the estimation are read from an external file (of YAML format). ``jubaregression`` will predict the rent by using the model trained, and return the predicted value for client.

For example, once client input a housing data of [(distance from station: 15min); (space: 32 m^2); (age: 15 years)], the estimated rent 80,000 JPY will be returned.


--------------------------------
Processing flow
--------------------------------

The flow of development using Jubatus Client is following:

1. Connection settings to ``jubaregression``
    Setting the HOST and RPC port of ``jubaregression`` .

2. Prepare the training data
    Get the rent-data from the downloaded CSV file.

3. Data training (update the model)
    Use the ``train`` method to send the rent-data to ``jubaregression`` and training the model there.

4. Prepare the data for estimation
    Pre-process and send the estimation data to ``jubaregression`` .

5. Predict the data
    Use the ``estimate`` method to predict the input data (step.4) by using the model trained at step.3.

6. Return the result
    Output the return value of ``estimate`` as the results.


--------------------------------
Sample Program
--------------------------------

.. toctree::
   :maxdepth: 2

   regression_python

Currently, we have no sample programs except Python. (We welcome your contribution!)
