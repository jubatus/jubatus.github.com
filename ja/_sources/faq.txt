Frequently Asked Questions (FAQs)
=================================

Installation
::::::::::::

- ``./waf configre`` が以下のエラーで失敗する

 このエラーは古い Python を利用している場合に発生します。Python 2.6 以降を利用してください。

::

  ...
  line 298, in load_tool
       __import__(d)
     File "/Users/oliner/tmp/jubatus/unittest_gtest.py", line 8
       C1 = b'#XXX'
                ^
  SyntaxError: invalid syntax

- ``mecab_splitter.trivial`` と ``mecab_splitter_create.trivial`` の単体テストが通らない

 mecab 辞書と mecab コマンドで UTF-8 が使えるようになっていることを確かめてください。

RPC Errors
::::::::::

- Python クライアントの利用時に、"got socket.error: [Errno 99] Cannot assign requested address" (または ``EADDRINUSE`` など) が発生する

 このコマンドを試してください: ``sudo /sbin/sysctl -w net.ipv4.tcp_tw_recycle=1``

- Jubatus クライアントライブラリが "1" というメッセージの例外を投げる

 インストールした Jubatus クライアントライブラリと接続しようとしている Jubatus サーバのバージョンが非互換である可能性があります。
 `Jubatus Wiki: Client Compatibility and Documentation <https://github.com/jubatus/jubatus/wiki/Client-Compatibility-and-Documentation>`_ で互換性情報を確認してください。

 技術的には、エラー "1" は「RPC サーバ上に指定したメソッドが存在しない」ことを意味しています。

- Jubatus クライアントライブラリが "2" というメッセージの例外を投げる

 このエラーは、クライアントとサーバで型が不一致であることを意味します。

 よくある間違いとして ``num_values`` の値に float ではなく integer を使用してしまうケースがあります。
 ``num_values`` の値は常に ``float`` にキャストしてください。
 ``10`` のような数値リテラルは ``10.0`` に置き換えてください。
 もう一つのよくある間違いは、vector のようなオブジェクトに対して ``NULL`` を代入してしまっているケースがあります。

 このエラーは、インストールした Jubatus クライアントライブラリと接続しようとしている Jubatus サーバのバージョンが非互換である場合にも発生する可能性があります。
 `Jubatus Wiki: Client Compatibility and Documentation <https://github.com/jubatus/jubatus/wiki/Client-Compatibility-and-Documentation>`_ で互換性情報を確認してください。

- クライアントライブラリが時々 RPC タイムアウトエラーを投げる (サーバからクライアントが自動切断される)

 Jubatus サーバは、アイドルタイムアウト (コマンドラインパラメタ :option:`server -t` で設定される) が経過すると自動的に接続を切断します。
 接続を再確立するには RPC 呼出しを再実行する必要があります。

 この自動切断機能を無効にするには、 :option:`server -t` を 0 (タイムアウトなし) に設定します。
 この場合、クライアントは :mpidl:meth:`get_client` を使用して TCP 接続を明示的に切断する必要があります。

Anomaly detection
:::::::::::::::::

- jubaanomaly が常に 1.0 か無限値 (infinity) を返却する

 入力データのスケールによって近傍探索が正しく動作していない可能性があります。

 jubaanomaly (LOF アルゴリズム) はスケールに関連した様々なパラメタを持つ euclid LSH に依存しています。スケールが設定パラメタに比べて非常に大きい場合、LSH ベースの近傍探索は失敗し、LOF モデルが意味のある値を返却しなくなります。

 以下のような技法で、この問題を回避できることがあります。

 - 1: それぞれの特徴値を正規化する

 近傍探索は各特徴のスケールの違いに影響されます。全ての特徴値を正規化 (0.0 から 1.0 に制限) するか、標準化 (標準偏差が約 1.0 となるように) するのが望ましいでしょう。

 - 2: euclid LSH 側のパラメタを変更する

 特に、最も重要なパラメタである ``bin_width`` を変更するとよいでしょう。

- 多数のサンプルを投入すると jubaanomaly の動作速度が低下する

 jubaanomaly (LOF アルゴリズム) は近傍探索を利用しており、デフォルトの設定では高速化のため euclid LSH が使用されます。しかし、LOF モデルの内部状態を更新するために必要な最悪時間計算量は、今までに追加されたサンプル数の二乗です。詳細については原著論文 [Breunig2000]_ を参照してください。

- このような速度低下を回避するにはどうすればよいか

 速度と正確さのトレードオフは、以下のような技法で調整することができます。

 - 1: euclid LSH 側のパラメタを低精度・高速演算するように変更する

  ``lsh_num``, ``table_num``, ``probe_num``, ``bin_width`` のような (euclid) LSH のパラメタを小さくすることで、近傍探索の演算が高速になります。ただし、より近傍にあるはずのサンプルが無視される場合があり、バッチ処理のような方式で計算された異常値スコアと比較して精度に影響が出ることがあります。

 - 2: 異常値だけを得たい場合は ``calc_score`` を使用する

  ``add`` 関数は実際に近傍探索ストレージにサンプルを追加し、LOF モデルを更新し、そして LOF 値を計算します。一方、 ``calc_score`` 関数は現在の LOF モデルを元に LOF 値を計算するため、高速に動作します。データの分散がほぼ安定していると仮定できるのであれば、初期段階にのみ (例えば最初の 1000 サンプルがストレージに格納されるまで) ``add`` を使用することで、正しい LOF モデルを高速に構築することができます。その後、 ``add`` と ``calc_score`` を切り替えながら (``calc_score`` をより頻繁に) 使用します。例えば、 ``add`` と ``calc_score`` の割合を 1:100 程度にしても高速かつ良好に動作するでしょう。

 - 3: ``reverse_nearest_neighbor_num`` を小さくする

  LOF の計算時間を短縮することができます。ただし、 ``nearest_neighbor_num`` より小さい値にすることはできません。

Miscellaneous
:::::::::::::

- How does 'jubatus' read?

 Please do not run 'say' command in Mac OS.
