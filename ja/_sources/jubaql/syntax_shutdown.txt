SHUTDOWN
--------

Syntax::

    SHUTDOWN

Example::

    jubaql> SHUTDOWN
    SHUTDOWN (processing time: 78851 ms/0 ms)

解説
^^^^

``SHUTDOWN`` 文はすべてのデータ処理を停止し、そのセッションで起動したJubatusインスタンスをシャットダウンし、そのセッションを削除します。その後いかなるコマンドも使用できません。``SHUTDOWN`` が実行された時に処理が実行中だった場合、処理時間(``STORAGE`` 処理と ``STREAM`` 処理に分けて表示)も出力に含まれます。
