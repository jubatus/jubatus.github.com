Recommender
===================

ここではJubatusの推薦（Recommender）である ``jubarecommender`` を使用した、Jubatus Clientの使い方を説明します。

推薦（Recommender）とは、類似するデータの推薦やデータ中の同属性の推薦を行う機能であり、検索サイト連動広告やECサイト商品お勧めなどに利用することができます。


-----------------------------------
サンプルプログラムの概要
-----------------------------------

サンプルとして、2012年日本プロ野球の野手成績を学習し、似たタイプ（成績）の野手を推薦するプログラム「 `npb_similar_player <https://github.com/jubatus/jubatus-example/tree/master/npb_similar_player>`_ 」を用いて説明していきます。

最初に、 `プロ野球データfreak <http://baseball-data.com/>`_ から取得した「規定打席の1/3以上の全野手のデータ」を打席数順にソートした CSV データ (`baseball.csv <https://raw.github.com/jubatus/jubatus-example/master/npb_similar_player/dat/baseball.csv>`_) をクライアント側で用意し、推薦するためのモデルを ``jubarecommender`` に学習させます。

次に、推薦用の入力データとして学習時と同様にCSVファイルから名前だけを抽出し ``jubarecommender`` に与えます。
``jubarecommender`` は先ほど学習したモデルを用い、タイプ（成績）が似ている野手を推薦し返却するので、クライアント側では受け取った結果を出力します。

例えば、推薦用の入力データとして「中田翔」を渡すと、「player 中田翔 is similar to : 井口資仁 新井貴浩 中村紀洋」と似たタイプ（成績）の野手トップ3が返却されます。


--------------------------------
処理の流れ
--------------------------------

Jubatus Clientを使ったコーディングは、主に以下の流れになります。

1. ``jubarecommender`` への接続設定
    ``jubarecommender`` のホストやポート番号を指定し、接続設定をします。

2. 学習用データの準備
    baseball.csvの全野手の成績から学習用データを作成します。

3. データの学習（学習モデルの更新）
    作成した学習用データ1行ずつを ``update_row`` メソッドで ``jubarecommender`` に与え、学習を行います。

4. 推薦用データの準備
    推薦用に ``jubarecommender`` に投げる、野手情報のデータを作成します。

5. 学習モデルに基づく推薦
    4\. で作成した推薦用データを入力値とし、 ``similar_row_from_id`` メソッドで 3. の学習に基づいた推薦をします。

6. 結果の出力
    ``similar_row_from_id`` メソッドの戻り値である推薦結果を出力します。


--------------------------------
サンプルプログラム
--------------------------------

.. toctree::
   :maxdepth: 2

   recommender_python
   recommender_ruby

現在、Python と Ruby 以外の言語のサンプルプログラムはありません。(みなさまのコントリビューションをお待ちしています!)
