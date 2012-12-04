How to Contribute
=================

We Welcome Your Contribution
----------------------------

We welcome contributions from our community! Possible contributions may be:

  - Submit a bug report to `GitHub issues <https://github.com/jubatus/jubatus/issues>`_ .
  - Give us a feedback (comments, problems you faced, feature requests, etc.), or tell us how you use Jubatus in your environment in the `mailing list <http://groups.google.com/group/jubatus>`_.
  - Improve documentation by sending `pull-request <https://github.com/jubatus/website/pulls>`_ to the `website repository <https://github.com/jubatus/website>`_. Minor fixes like correction of typos or grammatical errors are also welcomed.
  - Fix bugs in `GitHub issues <https://github.com/jubatus/jubatus/issues>`_ or implement new feature to the framework.

Participate in the Mailing List
-------------------------------

Join the community! We have a mailing list in `Google Groups <http://groups.google.com/group/jubatus>`_.
You can directly communicate with other users and even developers in the list.

Repositories
------------

- `Jubatus <http://github.com/jubatus/jubatus>`_

 - Jubatus framework.
 - branches - we use `git-flow <https://github.com/nvie/gitflow>`_ under `A successful Git branching model <http://nvie.com/posts/a-successful-git-branching-model/>`_ .

  - ``master``  : Release branch.
  - ``develop`` : Development branch. Latest features are pushed here.

- `Website <http://github.com/jubatus/website>`_

 - `Sphinx <http://sphinx.pocoo.org/>`_ source of this website.

Tips for Contributors
---------------------

* When contributing your code to Jubatus framework:

 * Always start working with your fork of ``develop`` branch.
 * Before sending pull-requests, make sure your code does not break existing features - type ``./waf --checkall`` to run through the unittests.
 * You need to setup the environment that can build Jubatus from source to run unittests.

  * See :doc:`build` for required tools and libraries.
  * If you're using Jubatus binary packages on RHEL, you can setup a build environment by ``sudo yum install msgpack-devel glog-devel libevent-devel pficommon-devel zookeeper-client-devel mecab-devel ux-devel re2-devel``.
  * If you're using Jubatus binary packages on Ubuntu, you already have a build environment.

 * All pull-requests must be sent to ``develop`` branch, not ``master``.
