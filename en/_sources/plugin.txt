Plugin Development
==================

In this section, we will explain how to develop plugins.

You can extend the functionality of Jubatus by developing plugins in C++.

Especially in the data conversion engine, we can develop plugins for each module so that we can embed arbitrary conversion logics.

Plugin for Data Conversion
--------------------------

To develop a fv_converter plugin, follow the instructions below.

#. Include ``jubatus/plugin.hpp``.
#. Inherit a base class (or a framework of plugin) and implement an arbitrary module for feature extraction or filter.
#. Write a function that creates an instance of the class and returns a pointer to it.
   The function must be enclosed in ``extern "C"`` to make it visible from C code.
   This is the name of the function as specified in ``"function"`` key in fv_converter when using the plugin.

As an example, we describe how to develop a plugin for feature extraction from strings (``string_types``).

In this case, a base class you need to inherit is ``jubatus::word_splitter``.
``word_splitter`` class consists of the only member function named ``split`` which takes a string as an argument, splits the string and returns boundaries for each split parts.
Boundaries is a vector of pair of two ``size_t`` s, where the first value of the pair is the byte of the string where the part starts, and the second value is the length of the part.

The following is an example code.

.. code-block:: c++

 #include <jubatus/plugin.hpp>
 #include <map>
 
 using namespace std;
 
 class my_splitter : public jubatus::word_splitter {
  public:
    void split(const string& string,
               vector<pair<size_t, size_t> >& ret_boundaries) {
     // do somehting
   }
 };
 
 extern "C" {
   my_splitter* create(const map<string, string>& params) {
     return new my_splitter();
   }
 }

Compile this file, link it with ``libjubaconverter.so`` and you will get a plugin (shared library (.so)).
See :ref:`conversion_plugin` for instruction on using .so files as a plugin.

You can develop plugins of other feature extractors and filter in the same way.
For other examples, see ``test_*.cpp`` in the ``jubatus/core/fv_converter`` directory of Jubatus source code.

When developing plugins, you can use `Plugin Development Skeleton Project <https://github.com/jubatus/jubatus-plugin-skeleton>`_.
This skeleton implements a plugin that converts given string as a feature vector.
