よくある質問と回答 (FAQs)
=================================

インストール
::::::::::::

- ``mecab_splitter.trivial`` と ``mecab_splitter_create.trivial`` の単体テストが通らない

 mecab 辞書と mecab コマンドで UTF-8 が使えるようになっていることを確かめてください。

- Jubatus Ruby クライアントは Ruby 2.0 で動作しますか?

 現在、Ruby 2.0 での動作確認は行っていません。

 msgpack 0.4.x (Jubatus Ruby クライアントが間接的に依存しているライブラリ) には、Ruby 2.0 で動作する Rails アプリケーションからの呼び出しに失敗するという既知の問題があります。

- プロキシを経由している場合のインストール方法は?

 Ubuntu環境のバイナリパッケージ(Apt)

 aptのプロキシ設定をしていないとエラーが出力されますので、 ``/etc/apt/apt.conf`` に以下の行を追加してください。

 ::

  $ sudo vi /etc/apt/apt.conf

 ::

  Acquire::http::Proxy "http://username:password@proxy.example.com:port/";

 Python クライアント (pip)

 プロキシを経由している場合、以下のようなエラーが出力されることがあります。その場合はオプションでプロキシを指定して実行してください。

 ::

  Cannot fetch index base URL http://pypi.python.org/simple/
  Could not find any downloads that satisfy the requirement jubatus
  No distributions at all found for jubatus
  Storing complete log in /home/jubatus/.pip/pip.log

 ::

  $ sudo pip --proxy=http://username:password@proxy.example.com:port/ install jubatus

 以下のようなログが出力されればインストール完了です。

 ::

  Successfully installed jubatus msgpack-rpc-python msgpack-python tornado
  Cleaning up...

 Ruby クライアント (RubyGems) の場合

 以下の環境変数を設定してからインストールを実行してください。

 ::

  export http_proxy=http://username:password@proxy.example.com:port/

- Javaのクライアントライブラリを利用した開発について

 JavaでJubatusクライアントの開発をする場合は、  `GitHub <https://github.com/jubatus/jubatus-java-skeleton>`_ で公開されているスケルトンプロジェクト（Eclipseプロジェクトのテンプレート）を利用すると便利です。
 以下の手順に従って、Java開発用スケルトンを利用してください。

 #. Eclipseを起動し、［File］－［Import…］を選択します。
 #. ［Git］>［Projects from Git］を選択し、［Next］ボタンをクリックします。
 #. ［URI］を選択し、［Next］ボタンをクリックします。
 #. ［URI］に「https://github.com/jubatus/jubatus-java-skeleton.git」と入力し、［Next］ボタンをクリックします。
 #. ダイアログに従って操作を進め、[完了]ボタンをクリックします。

 一度、インポートが完了すれば、Mavenが自動的にJubatusクライアントライブラリをダウンロードします。
 \ ``src/main/java``\ディレクトリの(default package)配下には、Jubatus recommenderを利用した簡単なプログラム「Client.java」が配置してあります。


RPC エラー
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
 RPC呼び出しを再度実行することで接続が再確立されます。サーバによる接続自動切断に起因するタイムアウトを含むRPCエラーのハンドリングについては :doc:`faq_rpc_err_workaround` 参照してください。

 この自動切断機能を無効にするには、 :option:`server -t` を 0 (タイムアウトなし) に設定します。
 この場合、クライアントは :mpidl:meth:`get_client` を使用して TCP 接続を明示的に切断する必要があります。
 もしくは、想定するクライアントの一接続毎の処理時間より十分長い時間を設定してください。

分散環境
::::::::::::::::::::::

- Jubatusサーバを複数台で分散させた場合、Mixが正常動作したか確認する方法はありますか?

 Mixの動作については、Jubatusサーバにおいて出力されるログにより確認することができます。以下のようなログが出力されます。

  ::

    I0218 06:01:49.587540  3845 linear_mixer.cpp:173] starting mix:
    I0218 06:01:49.703693  3845 linear_mixer.cpp:231] mixed with 3 servers in 0.112371 secs, 8 bytes (serialized data) has been put.
    I0218 06:01:49.705159  3845 linear_mixer.cpp:185] .... 22th mix done.
    I0218 06:03:15.502995  3845 linear_mixer.cpp:173] starting mix:
    I0218 06:03:15.642297  3845 linear_mixer.cpp:231] mixed with 3 servers in 0.137258 secs, 8 bytes (serialized data) has been put.
    I0218 06:03:15.644685  3845 linear_mixer.cpp:185] .... 23th mix done.

- 分散構成のJubatusを準備する場合、jubaclassifier、jubaclassifier_proxy/Client、ZooKeeperを1台のサーバにインストールし、その構成のサーバを複数用意しても問題ありませんか?

 問題ありません。
 但し、各プロセスを単独のサーバで動作させた場合と比べ、処理性能が低下する可能性があります。またZooKeeperは奇数台でアンサンブルを構成することを推奨します。

- Jubatus Keeper と Proxy の違いは？

 バージョン 0.5.0 より、Keeper は Proxy に名称が変更されました。
 Proxy の役割は、0.4.x 以前の Keeper と同様です。

学習モデル
:::::::::::

- Classifier/Regression に学習させる場合、以下の違いによってモデルに差異は発生しますか?

  - 学習データを一括してJubatusに渡し学習させる（バルク学習、trainメソッドを1度だけ呼び出す）
  - 学習データの数だけtrainメソッドを呼び出し、学習させる

 モデルに差異は発生しません。

異常値検知
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

その他
:::::::::::::

- How does 'jubatus' read?

 Please do not run 'say' command in Mac OS.
