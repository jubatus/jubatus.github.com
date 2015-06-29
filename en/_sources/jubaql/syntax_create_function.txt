CREATE FUNCTION
===============

Syntax::

    CREATE FUNCTION func_name(param_name data_type [, ...] )
    RETURNS return_type
    LANGUAGE lang_name AS $$ func_body $$

    CREATE TRIGGER FUNCTION func_name(param_name data_type [, ...] )
    LANGUAGE lang_name AS $$ func_body $$

    CREATE FEATURE FUNCTION func_name(param_name data_type [, ...] )
    LANGUAGE lang_name AS $$ func_body $$

Examples::

    jubaql> CREATE FUNCTION id(arg string) RETURNS string
            LANGUAGE JavaScript AS $$ return arg; $$
    CREATE FUNCTION

    jubaql> CREATE TRIGGER FUNCTION printLines(n numeric, label string)
            LANGUAGE JavaScript AS $$
            var i = 0;
            while (i < n) {
              println(label);
              i = i + 1;
            }
            $$
    CREATE FUNCTION

Explanation
^^^^^^^^^^^

All three statements above define functions with a given function body in JavaScript that can be used in different contexts.

Functions defined using ``CREATE FUNCTION`` can be used in SQL expressions in subsequent statements for arbitrary input transformations.

Functions defined using ``CREATE TRIGGER FUNCTION`` can be installed on a stream using ``CREATE TRIGGER`` to take a certain action on a stream item if some condition is fulfilled.
They do not return anything, i.e., they are called because of their side effects.

Functions defined using ``CREATE FEATURE FUNCTION`` can be referenced in ``CREATE MODEL`` statements to extract features of data in an input stream.
They must return a ``Map[String, Any]`` (object/associative array in JavaScript terms) where the string will become part of the feature vector key.

* ``func_name`` is a user-defined string that will identify this function later on.
* ``param_name`` is an identifier for the parameter and ``data_type`` (one of ``numeric``, ``string``, ``boolean``) the type of this parameter.
* ``return_type`` specifies the return type of the function (one of ``numeric``, ``string``, ``boolean``).
* ``lang_name`` must always be ``JavaScript`` but may allow other languages in the future.
* ``func_body`` is JavaScript code that describes the function body.
  It can not contain ``$$`` since this is used as the code delimiter.

In JavaScript code, there is an object ``jql`` that can be used to make HTTP requests and send emails from trigger functions.
The available methods can be used as follows:

* ``jql.httpGet(url)``
  will make a GET request to the given URL.
* ``jql.httpGet(url, {"key": "value"}})``
  will make a GET request with the given key-value pairs as URL parameters to the given URL.
* ``jql.httpPost(url)``
  will make a POST request with an empty body to the given URL.
* ``jql.httpPost(url, body)``
  will make a POST request with the given string body to the given URL.
* ``jql.httpPost(url, {"key": "value"})``
  will make a POST request with the given key-value pairs as an ``application/x-www-form-urlencoded`` string in the body to the given URL.
* ``jql.sendMail(smtpHost, smtpPort, fromAddr, toAddr, subject, message)`` will send an email using the given server data. Note that authentication is not supported at the moment.

Notes
^^^^^

* There is currently a restriction of maximal five parameters for user-defined functions.

