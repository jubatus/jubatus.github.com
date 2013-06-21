プラグインの開発
==================

このページでは、プラグイン開発の方法を説明する。

Jubatus はユーザーが C++ でプラグインを開発することで、様々な拡張ができるようになっている。

特に、データ変換エンジンではユーザーが任意の変換ロジックを組み込めるように、各モジュール用のプラグインを作ることができる。

データ変換プラグイン
--------------------------

fv_converter プラグインの開発は以下の手順で行う。

#. ``jubatus/plugin.hpp`` をインクルードする。
#. プラグインのひな形となる基底クラスを継承し、必要な特徴抽出モジュールまたはフィルターモジュールを実装する。
#. 実装したクラスのインスタンスを生成し、そのポインタを返却する関数を作成する。
   この関数は C コードから見えるように ``extern "C"`` で囲う必要がある。
   この関数の名前が、fv_converter でプラグインを利用するときに指定する ``"function"`` 引数の中身である。

例として、文字列からの特徴量抽出 (``string_types``) 用のプラグインの作り方を示す。

この場合、継承すべきひな形は ``jubatus::word_splitter`` クラスである。
``word_splitter`` クラスは文字列を引数に取り、その文字列を分割して各パーツの分割点を返す ``split`` というメンバ関数のみからなる。
分割点は ``size_t`` のペアのベクタである。一つ目の値はそのパーツの開始位置であり、二つ目の値はそのパーツの長さを表す。

以下にコード例を示す。

.. code-block:: c++

 #include <jubatus/plugin.hpp>
 #include <map>
 
 using namespace std;
 
 class my_splitter : public jubatus::word_splitter {
  public:
    void split(const string& string,
               vector<pair<size_t, size_t> >& ret_boundaries) const {
     // do somehting
   }
 };
 
 extern "C" {
   my_splitter* create(const map<string, string>& params) {
     return new my_splitter();
   }
 }

上記のファイルをコンパイルし、 ``libjubaconverter.so`` とリンクすることで、プラグイン (共有ライブラリ (.so)) が作成される。
プラグインとして利用する方法は、 :ref:`conversion_plugin` を参照のこと。

その他の特徴抽出器やフィルターのプラグインも、同様の方法で作成することができる。
より具体的なソースの例に関しては、Jubatus ソース内の ``jubatus/core/fv_converter`` 中の ``test_*.cpp`` を参照すること。

プラグインの開発を行う場合、 `プラグイン開発用スケルトンプロジェクト <https://github.com/jubatus/jubatus-plugin-skeleton>`_ を使用すると便利である。
このスケルトンでは、渡された文字列から ASCII 文字列を特徴量として抽出する機能が既に実装されている。
