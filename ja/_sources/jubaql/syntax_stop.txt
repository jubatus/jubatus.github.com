STOP PROCESSING
===============

Syntax::

    STOP PROCESSING

Example::

    jubaql> STOP PROCESSING
    STOP PROCESSING (processing time: 30828 ms/0 ms)

解説
^^^^

``STOP PROCESSING`` 文は ``START PROCESSING`` によって開始されたプロセスを停止します。
既に定義されたいかなるモデルもまだ利用でき、``ANALYZE`` を使ってクエリすることが出来ます。
処理時間(``STORAGE`` 処理と ``STREAM`` 処理に分けて表示)も出力に含まれます。


Notes
^^^^^

* この文は学習プロセスが全く実行されていない場合には失敗します。
* ``STOP PROCESSING`` が使用された後、同じデータソースを再び処理することはできません。しかし、他のデータソースを処理することは可能です。
