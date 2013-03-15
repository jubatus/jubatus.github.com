IDL Support Status (2013 Mar.)
------------------------------

現在、Jubatus は 6 種類の機械学習タスク (Classifier, Regression, Recommender, Stat, Graph, Anomaly) をサポートしています。
:ref:`how_to_get_clients` で紹介している通り、クライアントコードは、 ``jenerator`` と msgpack-idl で生成されています。
以下はそのサポート状況です。

+--------+------------+------------+-------------+-----------+-----------+-----------+
|        | Classifier | Regression | Recommender | Stat      | Graph     | Anomaly   |
+========+============+============+=============+===========+===========+===========+
| C++    | ok         | ok         | ok          | ok        | ok        | ok        |
+--------+------------+------------+-------------+-----------+-----------+-----------+
| Java   | needs fix  | needs fix  | needs fix   | needs fix | needs fix | needs fix |
+--------+------------+------------+-------------+-----------+-----------+-----------+
| Python | needs fix  | needs fix  | needs fix   | needs fix | needs fix | needs fix |
+--------+------------+------------+-------------+-----------+-----------+-----------+
| Ruby   | needs fix  | needs fix  | needs fix   | needs fix | needs fix | needs fix |
+--------+------------+------------+-------------+-----------+-----------+-----------+

- ok：生成したそのままを利用できます。

- needs fix：自動生成したコードから少し変更が必要です。変更内容は各クライアントのリポジトリ内の ``patch`` ディレクトリを参照して下さい。

以下の環境でテストを行なっています。

- Jubatus : Jubatus 0.4.2

- Server : 上記レポジトリで生成されたサーバ

- Client : IDLによって生成されたコード

- IDL : 上記レポジトリのIDLファイル
