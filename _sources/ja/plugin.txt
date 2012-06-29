Plugin Develpment
=================

.. _plugin:

Jubatusはユーザーがプラグインを開発することで、様々な拡張ができるようになっている。
特に、データ変換エンジンではユーザーが任意の変換ロジックを組み込めるように、各モジュール用のプラグインを作ることができる。
プラグインはC++を利用して作成する。
このページでは、プラグイン開発の方法を説明する。

plugin for data conversion
----------------------------------------

大まかなプラグインの開発方法は以下のとおりである。
まず、/usr/local/include/jubatus/plugin.hppをインクルードするところから始まる。
次に、プラグインの雛形となるクラスを継承し、任意の特徴抽出モジュール、フィルターモジュールを作成する。
最後に、これを外から見えるように、extern "C"で囲った領域に、インスタンス生成の関数を作成する。
この関数の中で、先ほど作成した自前クラスをnewで生成し、そのポインタを返すようにする。
最後に作った関数の名前が、プラグインを利用するときに指定する"function"引数の中身である。

例としてstring_types用のプラグインの作り方を示す。
この場合、ひな形はjubatus::word_splitterクラスである。
word_splitterクラスは文字列を受け取って、文字列を分割したあとの分割点を返すsplitというメンバ関数のみからなる。
以下に例を示す。

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

上記のファイルをコンパイルし、libjubaconverter.soとリンクすると.soファイルが完成する。
できた.soファイルは、プラグインとして利用できる。
プラグインとして利用する方法は、 :ref:`conversion` :ref:`conversion_plugin` を参照のこと。


その他の特徴抽出器やフィルターのプラグインも、同様の方法で作成することができる。
より具体的なソースに関しては、src/server/fv_converter中のtest_*.cppを参照して、同様の方法でプラグインを作成できる。
それぞれが各モジュールプラグインのサンプルになっている。
