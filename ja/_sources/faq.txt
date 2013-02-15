Frequently Asked Questions (FAQs)
=================================

- Failed in ``./waf configre`` with ...

::

  ...
  line 298, in load_tool
       __import__(d)
     File "/Users/oliner/tmp/jubatus/unittest_gtest.py", line 8
       C1 = b'#XXX'
                ^
  SyntaxError: invalid syntax

This error occurs when old python. Use python 2.7 or later.

- When using python client, "got socket.error: [Errno 99] Cannot assign requested address" (or kind of ``EADDRINUSE``)

 - sudo /sbin/sysctl -w net.ipv4.tcp_tw_recycle=1

- mecab_splitter.trivial and mecab_splitter_create.trivial does not pass the unittest?

 - check your mecab dictionary and ensure that your mecab command accept UTF-8 charsets.

- How does 'jubatus' read?

 - Please do not run 'say' command in MacOS.
