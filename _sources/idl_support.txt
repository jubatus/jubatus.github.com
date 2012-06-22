IDL Support Status (2012 June)
-------------------------------------------

Currently, Jubatus supports four machine learning services (Classifier, Regression, Recommender, Stat). As we mentioned in :ref:`how_to_get_clients` , clients of these services are generated from msgpack-idl. The followings are support status of msgpack-idl.

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

- ok：We can use automatically generated clients.

- needs fix：We need to make some minor changes manually from automatically generated clients in order to interact with server.

  - We appreciate you if you gave us patchs to msgpack-idl.


Conditions
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We tested these clients in the following condition


- Jubatus : Jubatus 0.2.3 (More specifically, we use `this commit <https://github.com/jubatus/jubatus/commit/780f016ec8ba0bcd02afb23fdfeb098de469ba78>`_ )

- Server : Built-in servers in repository

- Client : Generated client from IDL

- IDL : Built-in IDL in repository


All Clients Are Available
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We provide clients of all existing service in four languages mentioned above.
Clients are available of from `this download page <https://github.com/jubatus/jubatus/downloads>`_ .
All clients except C++ recommender client and all Java clients are automatically generated clients from IDL. The remaining clients are generated from IDL and manually editted.

