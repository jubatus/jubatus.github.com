STATUS
======

Syntax::

    STATUS

Example::

    jubaql> STATUS
    STATUS
    {
      "sources":{
        "ds":"Initialized"
      },
      "models":{
        
      }
    }

    jubaql> STATUS
    STATUS
    {
      "sources":{
        "ds":"Finished"
      },
      "models":{
        "test1":"JubatusYarnApplicationStatus({192.168.0.62_20586={SHR=5316,
        clock_time=1426660333, PROGNAME=jubaclassifier_proxy,
        session_pool_expire=60, uptime=42, pid=15011, logdir=,
        interconnect_timeout=30, [...])"
      }
    }

Explanation
^^^^^^^^^^^

``STATUS`` lists information about data sources and models defined in the current session.

Notes
^^^^^

* The state of data sources can be one of ``Initialized`` (has not run yet), ``Running`` (is currently processing data) or ``Finished`` (has ended processing with success or failure).
* The ``"models"`` part only lists information about Jubatus instances that have come up successfully. (Instances that failed to start up are not shown.) The status for each model contains the information returned by the ``get_status()`` RPC call on Jubatus proxy and instances. In particular, there is internal information (IP addresses, parameters, PIDs etc.) contained in this output.

