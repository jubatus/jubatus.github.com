How to Contribute
=================

We Welcome Your Contribution
-------------------------------

We welcome contributions from our community! Possible contributions may be:

  - Submit a bug report or a feature request. We are using `GitHub Issues <https://github.com/jubatus/jubatus/issues>`_ as an issue tracker (see below).
  - Fix bugs in GitHub issues or implement new feature to the framework.
  - Improve documentation by sending `pull-request <https://github.com/jubatus/website/pulls>`_ to the `website repository <https://github.com/jubatus/website>`_. Minor fixes like correction of typos or grammatical errors are also welcomed.
  - Tell us your needs in the `mailing list <http://groups.google.com/group/jubatus>`_.
  - Report us whether you could build and run Jubatus in your environment or not, along with the model/version of CPU, OS and compiler if possible.
  - Give us a general feedback (comments, problems you faced, feature requests, etc.), or tell us how you apply (or planning to apply) Jubatus in your environment in the `mailing list`_.

Join the Community
--------------------

You can communicate with other users and even developers via:

* `GitHub Issues`_
* Mailing list on `Google Groups <http://groups.google.com/group/jubatus>`_
* IRC channel (English: `#jubatus <http://webchat.freenode.net/?channels=jubatus>`_, Japanese: `#jubatusjp <http://webchat.freenode.net/?channels=jubatusjp>`_) on freenode

  * Host: chat.freenode.net / Port: 6667 / UTF-8

Issue Openning Policy
-------------------------

A standard issue-opening format is preferred for our better work efficiency. Therefore, we annouce our issue openning policy here for our contributors below.

* As for the bugs reporting, your information should be adequate for our developers to reproduce and understand the bugs.

* As for other reporting, please tell us "why this part should be improved or required refactoring", "who will be benefied", etc.

  * It is no problem to write "Because I just want it!", "It makes Jubatus Cool!", your comment here will help us to decide the importance of the issue anyway.

Pull-Request Policy
---------------------

We always welcome your code and/or documentation contributions! Here are some rules:

* Every pull-requests will be reviewed by one (or more) of Jubatus committers. `Reviewers <https://github.com/jubatus/jubatus/wiki/Policy:Reviewers>`_ will be chosen according to the area of the code you contributed.

* After the review process, the status of your pull-request will either be:

  * **ACCEPTED**: your code will be merged! Note that committers will make some minor fixes (like coding styles) to your code after merging your code.

  * **NEED FIX**: your idea is OK, but the code has bugs or other functionality problems, or lacks unit tests. The reviewer will tell you what you need to be fixed.

  * **REJECTED**: unfortunately we reject your pull-request in case, for example, your idea does not meet with our roadmap or your code seems violating rights of others. To avoid such cases, we recommend you to discuss what you are going to work on with Jubatus committers before actually starting your work, especially in case you are trying to make big changes.

* Please note that in accordance with our roadmap, sometimes it may take time to merge your pull-request.


Tips for Contributors
---------------------

When contributing your code, check the following points before sending a pull-request:

* Pass the unit tests. (run ``./waf --checkall``) 

  * You will need Jubatus build environment to run unit tests. Refer to :doc:`build` for required tools and libraries.

* Pass the coding style test. (run ``./waf cpplint``)

* Add unit tests for your code, if applicable. We use `Google Test <http://code.google.com/p/googletest/>`_ as a unit test framework.

* If you fixed an existing issue, please include the issue number (in format of "#XXX") in the commit log.

* If you have implemented new algorithm, add a reference to the paper you referenced in the pull-request description.

* Please make sure that you started your work on top of the develop branch. We only accept pull-requets sent to the ``develop`` branch (NOT ``master``).
