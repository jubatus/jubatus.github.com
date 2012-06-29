.. _conversion:

Data Conversion
==================

Generally speaking, we don't use unstructured data such as text directly when we do some machine-learing tasks.
Such data are converted to "feature vector" by being process called feature extraction in advance to the tasks.
We use key-value type as feature vector in which key is string and value is numeric type.
Through this process, we can handle unstructured raw data such as natural language, picture and voice in a unfied way.
Data-conversion engine in Jubatuse enables us to customize this feature-extraction process flexibly only by creating easy configuration files.

.. 一般的に機械学習処理を行う場合、テキストなどの生の非定形データを直接扱うことはできない。こうしたデータは事前に特徴抽出というステップを経て、俗に特徴ベクトルと呼ばれる形式に変換される。特徴ベクトルの中身は、文字列をキー、数値型を値とするkey-value型としてよい。この変換を行うことで、自然言語のデータ、画像データ、音声データなどの非定型の生データを統一的に扱うことができる。Jubatusのデータ変換エンジンは、この特徴抽出処理を簡単な設定ファイルを書くことで柔軟にカスタマイズすることを可能にする。

Data-conversion is executed in two steps.
First, we sanitize data with filtering.
This filtering includes removing html tag and some symbols which we know are unnecessary.
Next, we extract features from sanitized data by feature-extraction process.

.. データ変換は2段階に行われる。まず、フィルター処理によって、データを整形する。この処理は、例えばHTMLテキストのタグを除去したり、学習にとって不要であることが予めわかっている記号列などを取り除く。その次に、特徴抽出処理によって、非定形データから特徴を抽出する。

We can expect a series of process works well by the easiest configuration in most cases.
The followings are one of the easiest configuration.
In this configuration, we use each word separated by spaces a feature for string data. For numric data, we use the value itself a feature. 
It is probable that doing some tuning this configuration to obtain training model with high precision and desirable result.

.. 一連の処理は、最もシンプルな設定によって多くの場合はうまく動くことが予想される。以下に最もシンプルな設定を記載する。この設定を利用すると、文字列データは全てスペース文字で分割してそれぞれの単語を特徴量とし、数値データはその値をそれぞれ特徴量として利用する。実際にアプリケーションを書くときに、より高い精度の学習結果を求める場合は、設定をチューニングすることで望ましい結果を得られる可能性がある。

.. code-block:: python

 {
   "string_filter_types": {},
   "string_filter_rules": [],
   "num_filter_types": {},
   "num_filter_rules": [],
   "string_types": {},
   "string_rules":
     [ { "key": "*", "type": "space",
       "sample_weight": "bin", "global_weight": "bin" }
     ],
   "num_types": {},
   "num_rules": [
     { "key": "*",  "type": "num" }
   ]
 }

datum
-------

It is very simple key-value called "datum" that we can use as a data type in Jubatus.
datum has two key-value's.
One is "string_values", whose key and value are both string data.
The other is "num_values", whose key is string data as string_values is, but value is numeric data.
We can store in string_values arbitrary text data such as name, text, profession etc.
And we can store in num_values arbitrary numeric data such as age, income, the number of access etc.
It this data-conversion module that extract features which are used in machine learning task.
For reason of efficiency, each key-value is represented not as map type nor dictionary type, but as pair of key and value.
The followings are example of datum.

.. Jubatusで利用できるデータ形式は、datumと呼ばれる非常にシンプルなkey-valueデータ形式である。datumには2つのkey-valueが存在する。一つはキーも値も文字列の文字列データ (string_values) である。もう一方は、キーは同様に文字列だが、値は数値の数値データ (num_values) である。前者には名前、テキスト、職業など、任意のテキストデータを入れることができる。後者には年齢、年収、アクセス回数など、任意の数値データを入れることができる。この2つのデータから、機械学習を行う際に必要となる特徴量を抽出するのが、このデータ変換モジュールである。また、効率を重視して、それぞれのkey-valueは、各言語のmap型や辞書型を利用せず、keyとvalueのペアの配列で表現される。以下に例を示す。

.. code-block:: python

  ( [ ("user/id", "ippy"),
      ("user/name", "Loren Ipsum"),
      ("message", "<H>Hello World</H>") ],
    [ ("user/age", 29) ,
      ("user/income", 100000) ] )


For example, datum consists of ``std::vector<std::pair<std::string, std::string> >`` and  ``std::vector<std::pair<std::stirng, double> >`` in C++. ``std::pair<T,U>`` (resp.  ``std::vector<T>``) is to C++ what tuple (resp. vector) is to Python.

.. 例えばC++から利用する場合、datumは ``std::vector<std::pair<std::string, std::string> >`` と、 ``std::vector<std::pair<std::stirng, double> >`` の2つの要素からなっている。ここでは、 ``std::pair<T,U>`` をPython風のタプルで、 ``std::vector<T>`` をPython風のリストで表している。


Filter
---------

Jubatus has filtering system of feature vector. This enables us to create additional key-value elements by converting existing key-value elements in datum and insert additional key-value elements elements by filter
For example, let us suppose we have original data as HTML.
Tags (such as <a>) in the data are in the way of training in many cases. Therefore, we want to filter and get rid of them in advance.
In another example, we may remove citations of e-mail (i.e. rows starts with ">").
We can make use of the filtering system in such cases.
As an example of usage, we remove HTML tags from strings whose key is "message".
We do it in two step. First, we define rule which states "remove HTML tags". Second, we apply this rule to  ``key = "message"``
This procedure is represented by the following configuration.


.. Jubatusはフィルターという機能を用いて、datum中のkey-valueペアを変換して、別の要素として追加することができる。例えば、元のデータがHTMLで書かれていたとしよう。この中のタグ文字列（<a> など）は、学習時には邪魔になることがおおく、そのため予めフィルタリングして使いたいことがある。あるいは、メール本文の引用（>から始まる行）を削除したいこともあるだろう。こうした時に利用するのが、filter機能である。例として、"message"内の文字列からHTMLタグを取り除く。まず、「HTMLタグを取り除く」というルールを定義し、それ を ``key = "message"`` に適用する。これは、以下のようなconfigで表現される。

.. code-block:: js

      "string_filter_types": {
        "detag": { "method": "regexp", "pattern": "<[^>]*>", "replace": "" }
      },
      "string_filter_rules":
      [
        { "key": "message", "type": "detag", "suffix": "-detagged" }
      ]

As a first step, we define a filter in "string_filter_types". We name this filter "detag"
In "detag", we define a filter which apply a method named "regexp", which replaces "<[^>]*>" with "".
Next, we define to which elements in datum and how we apply this filter. We write it in "string_filter_rules".
The example above indicates that we apply "detag" filter (defined earlier) to the value whose key is "message" and that we store the resultant to "message-detagged" key (original key "message" + suffix "-detagged")

.. まず、"string_filter_types"でフィルターを定義する。"detag"という名前のフィルターに対して、"regexp"という手法で、"<[^>]*>"を""に置き換える、というフィルターを定義する。次に、実際にdatumのどの要素にどう適用するのか書いたのが"string_filter_rules"である。ここでは、"message"という名前の"key"の要素に対して、先で定義した"detag"フィルターを適用し、"message"に"-detagged"を付与したkey、すなわち"message-detagged"に結果を格納することを示している。

In the another example, we can add one to "age" by the following configuration. (In Japan, such a counting method is called "Kazoe Doshi", or east asian age reckoning)

.. また、"age"を数え年に変換(+1歳に)するには、

.. code-block:: js

      "num_filter_types": {
        "add_1": { "method": "add", "value": "1" }
      },
      "num_filter_rules": [
        { "key": "user/age", "type": "add_1", "suffix": "_kazoe" }
      ]

The procedure is the same as the previous example. Value in "user/age" added by 1 is stored in "usr/age_kazoe".
By applying these two filter, we obtain the following datum.

.. とする。この挙動も先と同じで、"user/age"に1加えた結果が"user/age_kazoe"に格納される。これらのfilterを通すことにより

.. code-block:: python


  ( [ ("user/id", "ippy"),
      ("user/name", "Loren Ipsum"),
      ("message", "<H>Hello World</H>"),
      ("message-detagged", "Hello World") ],
    [ ("user/age", 29),
      ("user/age_kazoe", 30) ,
      ("user/income", 100000) ] )


.. が得られる。

Next section is devoted to more precise explanations of each filter.

.. それぞれの要素について、詳細に説明する。

string_filter_types
~~~~~~~~~~~~~~~~~~~

Specifies a dictionary that consists of <filter name>:<argument>
<filter name> is string and <argument> is a dictionary whose key and value are both string
<argument> must contain key named "method".
The others keys in <argument> are dependent on the value of "method".
The followings are available values of "method" and keys that must be specified.

.. <フィルター名>: <引数>　からなる辞書を指定する。フィルター名は文字列、引数は文字列から文字列への辞書である。引数には必ず"method"を指定する。残りの引数に関しては、"method"の内容に応じて必要な引数が異なる。定できる"method"の値と、それぞれに対応した引数は以下のとおりである。

.. describe:: regexp

 This filter converts substrings that specified regular expression matches to specified string. It is not available if compiled with --disable-re2.


  :pattern:  Specifies regular expression to match. This filter uses re2. For available expressions, please refer to documents of re2.
  :replace:  Specifies string with which we replace

..  正規表現にマッチした部分を、指定した文字列に変換する。このフィルターは--disable-re2付きでコンパイルすると利用できない。
..   :pattern:  マッチさせる正規表現を指定する。re2を利用するため、利用できる表現はre2のマニュアルを参照する。
..   :replace:  置き換え後の文字列を指定する。                                                                

 For example, in order to remove all HTML tags, we should define such a string_filter_type.

..  HTMLのすべてのタグを消すには、例えば以下のようなtypeを宣言すればよいだろう。

 .. code-block:: js

      "string_filter_types": {
        "detag": { "method": "regexp", "pattern": "<[^>]*>", "replace": "" }
      },


.. describe:: dynamic

 Use plugin. See below for further detail.


  :path:      Specifies full path of plugin.
  :function:  Specifies function to be called in plugin

..  プラグインを利用する。詳細は後述する。
..   :path:      プラグインの場所をフルパスで指定する。
..  :function:  プラグインの呼び出し関数を指定する。

string_filter_rules
~~~~~~~~~~~~~~~~~~~

Specifies rules how to apply filters.
Rules are checked in order. If a datum is matched to some rule, the corresponding filters is applied.
Each rule is a dictionary whose keys are "key", "type" and "suffix".

.. フィルターの適用規則を指定する。規則は複数からなり、順番に条件を満たすかどうかチェックされて、実行される。各規則は"key", "type", "suffix"の要素からなる辞書を指定する。

 :key:       Specifies to which keys in datum we apply the rule. We describe in datail later.
 :type:      Specidies the name of filter used. This filter must de defined in "string_filter_types". No filter is available if we don't define filter in "string_filter_types".
 :suffix:    Specifies suffix of key where the result of filtering is stored. For example, if "suffix" is "-detagged" and filter is applied to "name" key in datum, the result is stored in "name-detagged" key.

..  :key:       datumの各要素のどのkeyとマッチさせるかを指定する。詳細は後述。
..  :type:      利用するフィルター名を指定する。これはstring_filter_typesの項で作ったフィルター名を指定する。デフォルトで利用できるフィルターはない。
..  :suffix:    変換後の結果を格納するkeyのサフィックスを指定する。例えばsuffixに"-detagged"が指定され、"name"という名前のkeyに規則が適用された場合、結果は"name-detagged"という名前のkeyに格納される。

"key" is specified in one of the following formats.
For each key in datum, "all" rules checked to be applicable.
It means that if a single key matches n rules, every corresponding filter is applied to the original key. Then, n keys are added to datum.
Every "key" in the document is in the same format. Similarly, it happens that multiple rules are applied to a single key.

.. "key"の要素は以下の内のいずれかのフォーマットで指定する。但し、datumの全要素に対して、すべての規則が適用されるかチェックされる。したがって、複数の規則がマッチした場合は両方の規則が適用されて、複数のフィルター済みの値が追加されることに注意する。なお、"key"に関しては移行でも登場するが、全て同じフォーマットであり、複数適用される可能性がある点も同様である。

 :"\*" or "":   Matches all keys in datum. That is, this rules is applied to every keys in datum.
 :"XXX\*":      Matches keys whose prefixes are "XXX".
 :"\*XXX":      Matches keys whose suffixes are "XXX".
 :"/XXX/":      "XXX" is interpreted as a regular expression. Matches keys that the expression matches. It is not available compiled with --disable-re2.
 :otherwise:    If the key is none of the above, it matches to keys that are identical to given string.


..  :"\*" or "":   全ての要素にマッチする。"key"にこれが指定されると必ず適用されることになる。
..  :"XXX\*":      末尾に\*をつけると、その前のみをプレフィックスとして使用する。つまり、"XXX"で始まるkeyのみにマッチする。 
..  :"\*XXX":      先頭に\*をつけると、その後のみをサフィックスとして使用する。つまり、"XXX"で終わるkeyのみにマッチする。
..  :"/XXX/":      2つのスラッシュ(/)で囲うと、その間の表現を正規表現とみなして、正規表現でマッチする。--disable-re2付きでコンパイルすると利用できない。
..  :その他:       以上のいずれでもない場合は、与えられた文字列と一致するkeyのみにマッチする。

num_filter_types
~~~~~~~~~~~~~~~~

Specifies dictionary consists of <filter name>:<argument>, same as "string_filter_types".
We can use it almost in the same way as "string_filter_types".
<filter name> is string and <argument> is a dictionary whose key and value are both string
<argument> must contain key named "method".
The others keys in <argument> are dependent on the value of "method".
The followings are available values of "method" and keys that must be specified.

.. string_filter_typesと同様、<フィルター名>: <引数>　からなる辞書を指定する。利用の仕方はstring_filter_typesとほぼ同じである。フィルター名は文字列、引数は文字列から文字列への辞書である。引数には必ず"method"を指定する。引数には必ず"method"を指定し、残りの引数は"method"の値に応じて必要なものが異なる。指定できる"method"の値と、それぞれに対応した引数は以下のとおりである。

.. describe:: add

 Add specified value to the original value.


  :value:  Specifies value added. For example, if we add 3 to the original value, we use "3". Note that it is not numeric but a string.

..  元の値に指定した値を足す。
..   :value:  足す値の文字列表現を指定する。例えば3足すのであれば、"3"と指定する。数値型として指定してはならない。


.. describe:: dynamic

 Use plugin. See below for further detail.

  :path:      Specifies full path of plugin.
  :function:  Specifies function to be called in plugin

..  プラグインを利用する。詳細は後述する。
..   :path:      プラグインの場所をフルパスで指定する。
..   :function:  プラグインの呼び出し関数を指定する。


num_filter_rules
~~~~~~~~~~~~~~~~

Like "string_filter_rules", it specifies rules how to apply filters.
Each rule is a dictionary whose keys are "key", "type" and "suffix".


 :key:       Specifies to which keys in datum we apply the rule. For further explanation, please read counterpart in "string_filter_rules" section.
 :type:      Specidies the name of filter used. This filter must de defined in "string_filter_types". No filter is available if we don't define filter in "string_filter_types".
 :suffix:    Specifies suffix of key where the result of filtering is stored. For example, if "suffix" is "-detagged" and filter is applied to "name" key in datum, the result is stored in "name-detagged" key.

.. こちらも、string_filter_rules同様、フィルターの適用規則を指定する。規則は複数からなり、各規則は"key", "type", "suffix"の要素からなる辞書を指定する。
..  :key:       datumの各要素のどのkeyとマッチさせるかを指定する。詳細はstring_filter_rulesを参照のこと。
..  :type:      利用するフィルター名を指定する。これはstring_filter_typesの項で作ったフィルター名を指定する。デフォルトで利用できるフィルターはない。
..  :suffix:    変換後の結果を格納するkeyのサフィックスを指定する。

Format of "key" is written in "string_filter_rules" section.

.. "key"の指定の仕方は、string_filter_rulesを参照のこと。

.. _construct:

Feature Exctraction (From String)
---------------------------------

In this section, we explain mechanism of feature extractio from string. We also explain how to apply these extraction rules.
The followings are an example of the configuration.
In this configuration, we use as features "user/name" itself, every 2-gram of "message" and every word in "message-detagged" separated by spaces.


.. 文字列型に対する特徴抽出器と、その抽出規則の適用方法について解説する。以下に、設定の例を示す。この例では、"user/name"の値はそのまま特徴量として使用し、"message"は文字2グラムを特徴量とし、"message-detagged"はスペース文字で分割した単語を特徴量とする。

.. code-block:: js

      "string_types": {
          "bigram":  { "method": "ngram", "char_num": "2" }
      },
      "string_rules":
      [
        { "key": "user/name", "type": "str",
          "sample_weight": "bin", "global_weight": "bin" },
        { "key": "message", "type": "bigram",
          "sample_weight": "tf",  "global_weight": "bin" },
        { "key": "message-detagged", "type": "space",
          "sample_weight": "bin",  "global_weight": "bin" }
      ]


string_types
~~~~~~~~~~~~

Feature extractors of string are defined in "string_types".
Some feature extractors must be defined in "string_types". An exapmle of such extractors is one which requires arguments such as path.
As "string_filter_types", it specifies a dictionary which consists of <extractor name>:<argument>
<argument> is a dictionary whose key and value are both string and must contain key named "method".
The others keys in <argument> are dependent on the value of "method".
The followings are available values of "method" and keys that must be specified.

.. string_typesで文字列特徴抽出器を定義します。主に、パスなどの引数を指定しなければならない特徴抽出器は、一度string_typesで指定してから利用しなければならない。string_filter_typesなどと同様、<抽出器名>: <引数>　からなる辞書を指定する。引数は文字列から文字列への辞書で、必ず"method"を指定する必要がある。それ以外に必要な引数は"method"に応じて異なる。指定できる"method"の値と、それぞれに対応した引数は以下のとおりである。

.. describe:: ngram
 
 Use contiguous N characters as a feature. Such a feature is called a N-gram feature.

  :char_num:  Specifies N or length of substring. N must be positive integer. "char_num" must be specified with string type (e.g. "2"), not numeric type (e.g. 2).

..  隣接するN文字を特徴量として利用する。こうした特徴量は文字N-gram特徴と呼ばれる。
..   :char_num:  利用する文字数の文字列表現を指定する。文字数は0より大きい必要がある。

 The following configuration specifies bigram (2-gram) and trigram (3-gram).

..  例として、連続する2文字およぼ3文字を特徴として利用する、bigramとtrigramを定義する方法を記す。

 .. code-block:: js

      "string_types": {
          "bigram":  { "method": "ngram", "char_num": "2" },
          "trigram":  { "method": "ngram", "char_num": "3" }
      },

.. describe:: dynamic

 Use plugin. See below for further detail.

  :path:      Specifies full path of plugin.
  :function:  Specifies function to be called in plugin

..  プラグインを利用する。詳細は後述する。
..   :path:      プラグインの場所をフルパスで指定する。
..   :function:  プラグインの呼び出し関数を指定する。


string_rules
~~~~~~~~~~~~

Specifies how to extract string features.
As "string_filter_rules", it consists of multiple rules.
Each rule is a dictionary whose keys are "key", "type", "sample_weight" and "global_weight".
These rules specifies how we extract rules from given strings and its weight used in calculating score.
Weight is calculated with two parameters, "sample_weight" and "global_weight".
In concrete, weight is the product of these two weights.

 :key:       Specifies to which keys in datum we apply the rule. For further explanation, please read counterpart in "string_filter_rules" section.
 :type:      Specifies the name of extractor in use. Extractor is either one defined in "string_types" or one of pre-defined extractors. The followings are pre-defined extractors.

    :str:     Use given string itself as a feature without separating it.
    :space:   Separate given string by space and use a set of substrings as features.

 :sample_weight:    Specifies weight of each feature. Note that as term frequency is, "sample_weight" is uniquely defined if feature and datum are specified.

    :bin:     sample_weight is 1 for all features and all datum.
    :tf:      sample_weight is frequency of the feature in given string (Term Frequency). For example, if "hello" is appeared five times, its sample_weight for this string is 5.
    :log_tf:  sample_weight is the logarithm of tf added by 1. For example, if "hello" is appeared five times, its sample_weight is log(5+1).

 :global_weight:   Specifies global weight calculated from data inputted so far.

    :bin:     global_weight is 1 for all features.
    :idf:     global_weight is the inverse of logarithm of normalized document frequency (Inverse Document Frequency). For example, if a feature is included in 50 documents of all 1000 documents, its global_weight is log(1000/50). Roughly speaking, the less a feature is frequently appear, the greater its idf is.


.. 文字列特徴の抽出規則を指定する。string_filter_rulesなどと同様、複数の規則を羅列する。各規則は、"key", "type", "sample_weight", "global_weight"からなる辞書で指定する。文字列データの場合、与えられた文字列から特徴量を抽出し、そこに対して重みを設定する必要がある。重みの設定の仕方を決めるのが、"sample_weight"と"global_weight"の2つのパラメータである。実際に利用する重みは、2つの重みの積を重み付けとして利用する。
..  :key:       datumの各要素のどのkeyとマッチさせるかを指定する。string_filter_rulesを参照。
..  :type:
..    利用する抽出器名を指定する。これはstring_typesの項で作った抽出器名を指定する。また、以下の抽出器はデフォルトで利用できる。
..     :str:     文字列分割を行わず、指定された文字列そのものを特徴として利用する。
..     :space:   スペース文字で分割を行い、分割された部分文字列を特徴として利用する。
..  :sample_weight:
..    各key-value毎の重み設定の仕方を指定する。これはkey-value一つに対して決定される重みである。
..     :bin:     重みを常に1とする。
..     :tf:      与えられた文字列中で出現する回数で重み付けをする。例えば5回"hello"が出現したら、重みを5にする、などである。
..     :log_tf:  tfの値に1を足してlogを取った値を重み付けに利用する。例えば5回"hello"が出現したら、重みはlog(5 + 1)にする、などである。

..  :global_weight:
..    今までの通算データをから算出される、大域的な重み付けを指定する。
..     :bin:     重みを常に1とする。
..     :idf:     文書正規化頻度の逆数の対数を利用する。例えば文書1000件中で50件にその特徴が含まれた場合、重みはlog(1000/50)にする、などである。大まかには出現頻度の少ない特徴ほど大きな重みが設定される。


In most of machine learning tasks, it works well even if we use "bin" in both sample_weight and global_weight.
In some kind of tasks, in which weight itself is trained, weight are adjusted automatically even if we set "bin" in sample_weight and global_weight. Classification is an example of a such task.

.. sample_weightとglobal_weightは、ともにbinにしておいても通常のケースでは正しく動作する。また、例えば分類問題など重み自体を学習するケースでは、ともにbinにしておいても自動的に調整される。

Feature Extraction (From Number)
--------------------------------

As with strings, feature extraction rules are also described for numeric type.
We can make user-defined extractor for numric type, too.

.. 数値型に対しても、文字列型同様変換ルールを記述する。また、数値型に関しても、ユーザー定義の変換器を定義することができる。

.. code-block:: js

      "num_types":
      {},
      "num_rules":
      [
        { "key": "user/age", "type": "num" },
        { "key": "user/income", "type": "log" },
        { "key": "user/age_kazoe", "type": "num" }
      ]}


num_types
~~~~~~~~~

Feature extractors for numeric data are defined in "num_types".
As with "string_types", it specifies a dictionary which consists of <extractor name>:<argument>.
<argument> is a dictionary whose key and value are both string and must contain key named "method".
The others keys in <argument> are dependent on the value of "method".
The followings are available values of "method" and keys that must be specified.


.. num_typesで数値データに対しる特徴抽出器を定義する。string_typesなどと同様、<抽出器名>: <引数>　からなる辞書を指定する。引数は文字列から文字列への辞書で、必ず"method"を指定する必要がある。それ以外に必要な引数は"method"に応じて異なる。指定できる"method"の値と、それぞれに対応した引数は以下のとおりである。

.. describe:: dynamic

 Use plugin. See below for further detail.

  :path:      Specifies full path of plugin.
  :function:  Specifies function to be called in plugin


..  プラグインを利用する。詳細は後述する。
..   :path:      プラグインの場所をフルパスで指定する。
..  :function:  プラグインの呼び出し関数を指定する。

num_rules
~~~~~~~~~

Specifies how to extract numeric features.
As "string_rules", it consists of multiple rules.
Each rule is a dictionary whose keys are "key" and "type".
It depends on "type" how to specify weight and name features.


 :key:     Specifies to which keys in datum we apply the rule. For further explanation, please read counterpart in "string_filter_rules" section.
 :type:   Specifies the name of extractor in use. Extractor is either one defined in "num_types" or one of pre-defined extractors. The followings are pre-defined extractors.

    :num: Use given number itself as weight.
    :log: Use logarithm of given number as weight. If the number is not positive, weight is 0.
    :str: Use given number as a string. This extractor is used when the value of the number is not important (e.g. ID). Weight is set to be 1.

 :suffix:    Specifies suffix of key which stores the result of extraction.

.. 数値特徴の抽出規則を指定する。string_rulesなどと同様、複数の規則を羅列する。各規則は、"key", "type"からなる辞書で指定する。重みの付け方や特徴名の指定の仕方もそれぞれの"type"ごとに異なる。

.. :key:   datumの各要素のどのkeyとマッチさせるかを指定する。詳細はstring_filter_rulesを参照のこと。
..  :type:   利用する抽出器名を指定する。これはnum_typesの項で作った抽出器名を指定する。ただし、以下の抽出器はデフォルトで利用できる。
..     :num: 与えられた数値をそのまま重みに利用する。
..     :log: 与えられた数値の対数を重みに利用する。但し、数値が1以下の場合は0とする。
..     :str: 与えられた数値を文字列として扱う。これは、例えばIDなど、数値自体の大きさに意味のないデータに対して利用する。重みは1とする。
..  :suffix:    変換後の結果を格納するkeyのサフィックスを指定する。

.. _conversion_plugin:

Plugins
----------------

We can make plugins of filters and extractors and use them in fv_converter.
A plugin is a single dynamic library file (.so file).
We will explain how to make plugins later. In this section, we will describe how to use plugins.
How to specify plugin is same in both filters and extractors.
In XXX_types (XXX is either string or num), we should specify "dynamic" in "method", full path to .so file in "path" and the name of funcion defined in plugin in "function".
Argument of the function is specified by other parameters.

.. 以上のフィルターと抽出器は、それぞれプラグインを作ったり、利用することができる。プラグインは単体の動的ライブラリファイル（.soファイル）からなる。プラグインの作り方は、別の章を参照するとして、ここではプラグインの使い方について解説する。各フィルターと抽出器のいずれの場合も、プラグインの指定の仕方は同じである。XXX_typesで、フィルターや抽出器を指定する際のパラメータで、"method"に"dynamic"を、"path"に.soファイルへのフルパスを、"function"に各プラグイン固有の呼び出し関数名を指定する。また、その他のパラメータに関しては、各プラグイン固有のパラメータを渡す。


In Jubatus we can make use of two pre-defined plugin which aims to extraction of features from string from the outset.
Note that plugins are not available unless specified in compile options of Jubatus.

.. Jubatusでは最初から以下の2つの文字列特徴量のプラグインが存在する。ただし、それぞれコンパイルオプションで指定しないとコンパイルされないので注意すること。

.. describe:: libmecab_splitter.so

We can specify this plugin in "string_types".
Separate given document into words by Mecab and use each word as a feature. This plugin is created in /usr/local/lib if Jubatus is compiled with --enable-mecab option.

  :function:   Specifies "create".
  :arg:        Specifies argument given to MeCab engine. "arg" is not specified, Mecab works with default configuration. Please refer to document of MeCab about how to specify arguments.

..   :function:   "create"を指定する。
..   :arg:        MeCabエンジンに渡す引数を指定する。この指定がないと、何もMeCabのデフォルト設定で動作する。引数の指定の仕方は、MeCabのマニュアルを参照する。

..  string_typesで指定できる。MeCabを利用して、与えられば文書を単語分割し、各単語を特徴量として利用する。--enable-mecabオプション付きでコンパイルすると、/usr/local/lib以下に作成される。

 .. code-block:: js

      "string_types":
      { "mecab": { "method": "dynamic",
                   "path": "/usr/local/lib/libmecab_splitter.so",
                   "function": "create",
                   "arg": "-d /path/to/mecab/dic" } },


.. describe:: libux_splitter.so

We can specify this plugin in "string_types".
Extract keywords from given document by way of dictionary matching with ux-trie and use each keyword as a feature. Mathing is a simple longest matching. Note that it is fast but precision may be low. 
 This plugin is created in /usr/local/lib if Jubatus is compiled with --enable-ux option.

..  string_typesで指定できる。 ux-trieを利用して、与えられた文書から最長一致で辞書マッチするキーワードを抜き出して、それぞれを特徴量として利用する。 単純な最長一致なので、高速だが精度が悪い可能性がある点には注意すること。--enable-uxオプション付きでコンパイルすると、/usr/local/lib以下に作成される。

  :function:   Specifies "create"
  :dict_path:  Specifies full path of dictionary file. The dictonary file is consisys of keywords, one keyword for one line.

..   :function:   "create"を指定する。
..   :dict_path:  1行1キーワードで書かれた辞書ファイルの場所を、フルパスで指定する。

 .. code-block:: js

      "string_types":
      { "ux": { "method": "dynamic",
                "path": "/usr/local/lib/libmecab_splitter.so",
                "function": "create",
                "dict_path": "/path/to/keyword/dic" } },



.. describe:: libre2_splitter.so

 We can specify this plugin in "string_types".
 Extract keywords from given document by way of regular expression matching with re2 and use each keyword as a feature. Matching is executed continuously, that is, every match is used as a feature.
 This plugin is created in /usr/local/lib if Jubatus is **NOT** compiled with --disable-re2 option.

  
  :function:  Specifies "create".
  :pattern:   Specifies mathing pattrn.
  :group:     Specifies group to be extracted as a keyword. If this value is 0, whole match is used as a keyword. If value is positive integer, only specified group extracted with () is used. Default value is 0. "group" must be specified with string type (e.g. "2"), not numeric type (e.g. 2).

..   :function:  "create"を指定する。
..   :pattern:   マッチさせる正規表現を指定する。
..   :group:     キーワードとして取り出すグループを指定する。0ならマッチした全体で、1以上の値を指定すると () で取り出したグループだけをキーワードとする。省略すると0として扱う。

..  string_typesで指定できる。re2を利用して、与えられた文書から正規表現を利用してキーワードを抜き出して、それぞれを特徴量として利用する。正規表現マッチは連続的に行われ、マッチした  箇所全てを特徴として使う。 --disable-re2を指定 **しない** と、/usr/local/lib以下に作成される。

 The following is simplest example in which we extract every representation of date.

..  最も簡単な例として、以下では日付表現を全て取り出す。

 .. code-block:: js

      "string_types":
      { "date": { "method": "dynamic",
                  "path": "/usr/local/lib/libre2_splitter.so",
                  "function": "create",
                  "pattern": "[0-9]{4}/[0-9]{2}/[0-9]{2}" } },

 If we use only a part of the matchs, we make use of "group" argument. For example, representation of age may be extracted with such a configuration.

..  パターンの一部だけを利用するときは、 "group" 引数を利用する。たとえば、以下の様な設定で年齢が取れるだろう。

 .. code-block:: js

      "string_types":
      { "age": { "method": "dynamic",
                 "path": "/usr/local/lib/libre2_splitter.so",
                 "function": "create",
                 "pattern": "(age|Age)([ :=])([0-9]+)",
                 "group": "3" } },


Overview of Data Conversion
---------------------------

The following is the overview of data conversion.
As datum is consists of string data and numeric data, there are flows of processing for each type of data.
For string data, first "string_filter_rules" is applied and filtered data are added to datum.
Then, features are extracted from string data with "string_rules".
For numeric data, first "num_filter_rules" is applied and filtered data are added to datum.
Then, features are extracted from string data with "num_rules".
As some filters and feature extractors requires arguments, these are available in "string_rules" ans "num_rules" if we prepare them in "string_types" and "num_types", respectively.


.. 大まかな処理の流れは以下のようになっている。datumは文字列データと数値データの2つがあるため、それぞれが別々の処理フローを流れる。文字列データには、まずstring_filter_rulesが適用されて、フィルター済みデータが追加される。その状態で、string_rulesによって文字列データからの特徴量が抽出される。数値データには、まずnum_filter_rulesが適用されて、フィルター済みデータが追加される。その状態で、num_rulesによって数値データからの特徴量が抽出される。フィルターと特徴抽出器には引数を必要とするものもあるため、それらはtypesで事前に準備することによって各規則で利用することができるようになる。

.. figure:: ../_static/convert_flow.png
   :width: 90 %
   :alt: feature vector converter

   Figure : System of Conversion Engine

..    図: 変換エンジンの構成


