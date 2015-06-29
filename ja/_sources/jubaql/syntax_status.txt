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

解説
^^^^

``STATUS`` 文は現在のセッションで定義されているデータソースとモデルに関する情報の一覧を出力します。

Notes
^^^^^

* データソースの状態は ``Initialized`` (まだ動いていない) または ``Running`` (現在データが処理されている)、``Finished`` (成功または失敗して処理が終わっている)です。

* ``"models"`` 欄は正常に動いているJubatusのインスタンスに関する情報のみを表示します(起動に失敗したインスタンスは表示されません)。各モデルのステータスは ``get_status()`` というJubatus proxyとインスタンスのRPCコールで得られる情報を含んでいます。特に、この出力には内部情報(IPアドレス、パラメータ、PIDなど)が含まれます。
