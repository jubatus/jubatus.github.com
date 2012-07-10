IDL Support Status (2012 June)
-------------------------------------------

2012年6月現在、Jubatusは、 機械学習タスク (Classifier, Regression, Recommender, Stat) をサポートしています。 :ref:`how_to_get_clients` で紹介している通り、クライアントコードは、 msgpack-idlで生成されています。以下はそのサポート状況です。

+------------+------------+-------------+--------------+--------------+ 
|            | Classifier | Regression  | Recommender  | Stat         |
+------------+------------+-------------+--------------+--------------+ 
| C++        | ok         | ok          | needs fix    | ok           |
+------------+------------+-------------+--------------+--------------+ 
| Java       | needs fix  | needs fix   | needs fix    | needs fix    |
+------------+------------+-------------+--------------+--------------+ 
| Python     | ok         | ok          |  ok          | ok           |
+------------+------------+-------------+--------------+--------------+ 
| Ruby       | ok         | ok          |  ok          | ok           |
+------------+------------+-------------+--------------+--------------+ 

- ok：生成したそのままを利用できます。

- needs fix：自動生成したコードから少し変更が必要です。


以下の環境でテストを行なっています。


- Jubatus : Jubatus 0.2.3 (正確には `このコミット <https://github.com/jubatus/jubatus/commit/780f016ec8ba0bcd02afb23fdfeb098de469ba78>`_ )

- Server : 上記レポジトリで生成されたサーバ

- Client : IDLによって生成されたコード

- IDL : 上記レポジトリのIDLファイル


All Clients Are Available
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

`download page <https://github.com/jubatus/jubatus/downloads>`_ からダウンロードされるクライアントは、
C++, Java, Python, Rubyの4つの言語に対して、正しく動作することを確認しています。

C++ recommender クライアントとJavaクライアントは、手動で正しく動くように修正され、それ以外のすべてのクライアントは、自動生成されています。

