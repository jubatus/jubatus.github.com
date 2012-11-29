IDL Support Status (2012 Nov.)
------------------------------

Currently, Jubatus supports five machine learning services (Classifier, Regression, Recommender, Stat, Graph).
As we mentioned in :ref:`how_to_get_clients` , clients of these services are generated from msgpack-idl.
The followings are support status of msgpack-idl.

+------------+------------+-------------+--------------+--------------+--------------+
|            | Classifier | Regression  | Recommender  | Stat         | Graph        |
+------------+------------+-------------+--------------+--------------+--------------+
| C++        | ok         | ok          | ok           | ok           | ok           |
+------------+------------+-------------+--------------+--------------+--------------+
| Java       | needs fix  | needs fix   | needs fix    | needs fix    | needs fix    |
+------------+------------+-------------+--------------+--------------+--------------+
| Python     | ok         | ok          |  ok          | ok           | ok           |
+------------+------------+-------------+--------------+--------------+--------------+
| Ruby       | ok         | ok          |  ok          | ok           | needs fix    |
+------------+------------+-------------+--------------+--------------+--------------+

- ok：We can use automatically generated clients.

- needs fix：We need to make some minor changes manually from automatically generated clients in order to interact with server.

  - We appreciate you if you gave us patchs to MessagePack-IDL.

We tested these clients in the following condition

- Jubatus : Jubatus 0.3.4

- Server : Built-in servers in repository

- Client : Generated client from IDL

- IDL : Built-in IDL in repository

All Clients Are Available
~~~~~~~~~~~~~~~~~~~~~~~~~

We provide clients of all existing service in four languages mentioned above. Clients are available of from `Downloads section of GitHub <https://github.com/jubatus/jubatus/downloads>`_.
