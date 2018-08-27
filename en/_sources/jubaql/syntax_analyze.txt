ANALYZE
-------

Syntax::

    ANALYZE 'data' BY MODEL model_name USING method_name

Examples::

    jubaql> ANALYZE '{"name": "慶喜"}' BY MODEL cls USING classify
    {
      "predictions":[{
        "label":"徳川",
        "score":0.05624999850988388
      },{
        "label":"北条",
        "score":0.0
      },{
        "label":"足利",
        "score":0.0
      }]
    }

    jubaql> ANALYZE '荻野貴司' BY MODEL reco USING complete_row_from_id
    {
      "string_values":{
      },
      "num_values":{
        "長打率":0.34623855352401733,
        "試合数":102.7064208984375,
        "打数":325.32110595703125,
        "安打":84.64220428466797,
        "RC27":3.8101837635040283,
        "出塁率":0.3158532977104187,
        "OPS":0.6621102094650269,
        "盗塁":6.31192684173584,
        "打率":0.25398167967796326,
        "四球":27.706422805786133,
        "打席":367.9449462890625,
        "打点":31.302751541137695,
        "併殺打":6.2110090255737305,
        "犠打":9.2660551071167,
        "死球":3.4770641326904297,
        "三振":54.40367126464844,
        "本塁打":4.917431354522705,
        "XR27":3.7999088764190674
      }
    }

Explanation
^^^^^^^^^^^

``ANALYZE`` queries a previously defined and trained Jubatus model for results of the learning process.

* ``data`` is a string that will become the parameter of the given Jubatus method. When this parameter is a datum, ``data`` is expected to be a JSON string and will be converted to a datum using the columns specified in the ``WITH`` clause of the ``CREATE MODEL`` statement.
* ``model_name`` is the name of a model previously defined using ``CREATE MODEL``. (For the returned value to make any sense, that model should have also been trained using the ``UPDATE MODEL`` statement.)
* ``method_name`` is the method to use for analyzing the model:

  * ``calc_score`` for an ANOMALY model,
  * ``classify`` for a CLASSIFIER model,
  * ``complete_row_from_id`` or ``complete_row_from_datum`` for a RECOMMENDER model.

Notes
^^^^^

* The results will be returned as JSON corresponding to each method's return type.
