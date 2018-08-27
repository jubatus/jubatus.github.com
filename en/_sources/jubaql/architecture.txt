JubaQL Architecture
===================

In general, the JubaQL system has an architecture as depicted in figure below.

.. _fig-architecture1:
.. figure:: ../../_static/jubaql/arch1.png
   :width: 95%

   JubaQL system architecture

The **JubaQL Client** is a simple command-line program running on the end user's computer.
It connects to the **JubaQL Gateway**, a daemon running on a server of the infrastructure provider, and exchanges commands with that server via HTTP.
On the first client connect, the JubaQL Gateway creates a *session* and starts the **JubaQL Processor**, a Spark application, by means of YARN via the ``spark-submit`` script.
Afterwards, all commands received from a client are forwarded to the correct processor instance and responses are forwarded back.
The JubaQLProcessor is the program that actually executes the user's JubaQL statements.
In particular, it is responsible for starting and stopping Jubatus instances via YARN.


Process Management with YARN
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Process management of JubaQL Processor and Jubatus is run by YARN.
JubaQL Gateway and JubaQL Processor manages processes of JubaQL Processor and Jubatus, respectively.

The figure blow shows the processing flow when JubaQL Processor runs Jubatus.

.. _fig-architecture2:
.. figure:: ../../_static/jubaql/arch2.png
   :width: 95%

   Process scheduling via YARN
