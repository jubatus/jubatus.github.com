IDL Support Status (2013 Apr.)
------------------------------

Currently, Jubatus supports six machine learning services (Classifier, Regression, Recommender, Stat, Graph, Anomaly).
As we mentioned in :ref:`how_to_get_clients` , clients of these services are generated from ``jenerator`` and msgpack-idl.
The followings are support status of ``jenerator`` and msgpack-idl.

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

- ok：We can use automatically generated clients.

- needs fix：We need to make some minor changes manually (see ``patch`` directory of each client repository) from automatically generated clients in order to interact with server.

We tested these clients in the following condition

- Jubatus : Jubatus 0.4.3

- Server : Built-in servers in repository

- Client : Generated client from IDL

- IDL : Built-in IDL in repository
