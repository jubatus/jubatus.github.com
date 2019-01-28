クイックスタート
=====================


Jubatus のインストール
----------------------

Red Hat Enterprise Linux (RHEL) 6.2 以降 (64-bit) と Ubuntu Server 14.04 LTS / 16.04 LTS / 18.04 LTS (64-bit) を公式にサポートしています。
これらのシステムでは、Jubatus のすべてのコンポーネントをバイナリパッケージでインストールすることができます。

また、その他の Linux 環境 (32-bit を含む) と Mac OS X が試験的にサポートされています。

Red Hat Enterprise Linux 6.2 以降 (64-bit)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

以下のコマンドを実行して、Jubatus の Yum リポジトリをシステムに登録します。

::

  // RHEL 6 の場合
  $ sudo rpm -Uvh http://download.jubat.us/yum/rhel/6/stable/x86_64/jubatus-release-6-2.el6.x86_64.rpm

  // RHEL 7 の場合
  $ sudo rpm -Uvh http://download.jubat.us/yum/rhel/7/stable/x86_64/jubatus-release-7-2.el7.x86_64.rpm

最新のバージョンの ``jubatus`` と ``jubatus-client`` のパッケージをインストールします。

::

  $ sudo yum install jubatus jubatus-client

特定のバージョンの ``jubatus`` と ``jubatus-client`` のパッケージをインストールするには、リポジトリで利用可能なバージョン一覧の中から選択してインストールします。

::

  $ yum list jubatus jubatus-client --showduplicates | sort -r
  jubatus.x86_64                           1.1.0-1.el7                     jubatus
  jubatus.x86_64                           1.0.9-1.el7                     jubatus
  jubatus.x86_64                           1.0.8-1.el7                     jubatus
  jubatus.x86_64                           1.0.7-1.el7                     jubatus
  jubatus.x86_64                           1.0.6-1.el7                     jubatus
  jubatus.x86_64                           1.0.5-1.el7                     jubatus
  jubatus.x86_64                           1.0.4-1.el7                     jubatus
  jubatus.x86_64                           1.0.3-1.el7                     jubatus
  jubatus-client.x86_64                    1.1.0-1.el7                     jubatus
  jubatus-client.x86_64                    1.0.9-1.el7                     jubatus
  jubatus-client.x86_64                    1.0.8-1.el7                     jubatus
  jubatus-client.x86_64                    1.0.7-1.el7                     jubatus
  jubatus-client.x86_64                    1.0.6-1.el7                     jubatus
  jubatus-client.x86_64                    1.0.5-1.el7                     jubatus
  jubatus-client.x86_64                    1.0.4-1.el7                     jubatus
  jubatus-client.x86_64                    1.0.3-1.el7                     jubatus

利用可能なバージョンをインストールします。以下の場合、 ``1.0.9`` をインストールします。

::

  $ sudo yum install jubatus-1.0.9-1.el7 jubatus-client-1.0.9-1.el7  

RHEL 6 では、依存パッケージ (``oniguruma``) のインストールに ``rhel-6-server-optional-rpms`` または ``jubatus-optional`` リポジトリを使用します。
上記の手順を実行した際、 ``oniguruma`` パッケージが存在しないエラーが表示された場合は、以下のコマンドのいずれかを実行してください。

::

  // RHEL 6 で、oniguruma パッケージが存在しない場合
  $ sudo yum --enablerepo=rhel-6-server-optional-rpms install jubatus jubatus-client

  // RHEL 6 で、oniguruma パッケージが存在しない場合 (rhel-6-server-optional-rpms が利用できない場合)
  $ sudo yum --enablerepo=jubatus-optional install jubatus jubatus-client

また、必要に応じてプラグインをインストールします。 [1]_ [2]_
プラグインを導入することにより、自然言語(日本語)や画像からの特徴抽出が行えるようになります。

::

  $ sudo yum install jubatus-plugin-mecab jubatus-plugin-ux jubatus-plugin-image jubatus-plugin-python



.. [1] Jubatus 1.0 以前はすべてのプラグインが ``jubatus`` パッケージに同梱されていましたが、Jubatus 1.0 以降は必要なものだけを個別にインストールできるようになりました。
.. [2] RHEL 6 では、 ``jubatus-plugin-image`` パッケージの機能の一部(``ORB`` アルゴリズム) および ``jubatus-plugin-python`` パッケージは利用できません。

Ubuntu Server (64-bit)
~~~~~~~~~~~~~~~~~~~~~~

以下の行を ``/etc/apt/sources.list.d/jubatus.list`` に記述して、Jubatus の Apt リポジトリをシステムに登録します。

::

  // Ubuntu 12.04 (Precise) の場合 - サポート対象外
  deb http://download.jubat.us/apt/ubuntu/precise binary/

  // Ubuntu 14.04 (Trusty) の場合
  deb http://download.jubat.us/apt/ubuntu/trusty binary/

  // Ubuntu 16.04 (Xenial) の場合
  deb http://download.jubat.us/apt/ubuntu/xenial binary/

  // Ubuntu 18.04 (Bionic) の場合
  deb [trusted=yes] http://download.jubat.us/apt/ubuntu/bionic/binary /

最新のバージョンの ``jubatus`` のパッケージをインストールします。

::

  $ sudo apt-get update
  $ sudo apt-get install jubatus

特定のバージョンの ``jubatus`` のパッケージをインストールするには、リポジトリで利用可能なバージョン一覧の中から選択してインストールします。

::

  $ apt-cache madison jubatus
    jubatus |    1.1.0-1 | http://download.jubat.us/apt/ubuntu/xenial binary/ Packages
    jubatus |    1.0.9-1 | http://download.jubat.us/apt/ubuntu/xenial binary/ Packages
    jubatus |    1.0.8-1 | http://download.jubat.us/apt/ubuntu/xenial binary/ Packages
    jubatus |    1.0.7-1 | http://download.jubat.us/apt/ubuntu/xenial binary/ Packages
    jubatus |    1.0.6-1 | http://download.jubat.us/apt/ubuntu/xenial binary/ Packages
    jubatus |    1.0.5-1 | http://download.jubat.us/apt/ubuntu/xenial binary/ Packages
    jubatus |    1.0.4-1 | http://download.jubat.us/apt/ubuntu/xenial binary/ Packages
    jubatus |    1.0.3-1 | http://download.jubat.us/apt/ubuntu/xenial binary/ Packages

利用可能なバージョンをインストールします。以下の場合、 ``1.0.9`` をインストールします。

::

  $ sudo apt-get install jubatus=1.0.9-1

現在、パッケージには GPG 署名が行われていません。
以下の警告メッセージが表示された場合は、 ``y`` を入力してください。

::

  Install these packages without verification [y/N]? y

これで、Jubatus が ``/opt/jubatus`` にインストールされました。

Jubatus を使う前に、毎回 ``profile`` スクリプトから環境変数を読み込む必要があります (``~/.profile`` に追記しておくと便利です)。

::

  $ source /opt/jubatus/profile

csh または tcsh をお使いの場合は、こちらを使用してください。

::

  $ source /opt/jubatus/profile.csh

Docker
~~~~~~

Docker が利用可能な環境では、Dockerhub で配布されている Docker イメージを利用することができます。

::

  $ docker pull jubatus/jubatus
  $ docker run --expose 9199 jubatus/jubatus jubaclassifier -f /opt/jubatus/share/jubatus/example/config/classifier/pa.json

その他の Linux 環境 (32-bit を含む)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

`jubatus-installer <https://github.com/jubatus/jubatus-installer>`_ を使用するか、 :doc:`../developers/build` を参照してソースからビルドしてください。

Mac OS X
~~~~~~~~~

Homebrew をお使いの場合は、 `tap リポジトリ <https://github.com/jubatus/homebrew-jubatus>`_ を使用すると簡単にインストールが行えます。

それ以外の場合は、 `jubatus-installer`_ を使用するか、 :doc:`../developers/build` を参照してソースからビルドしてください。

Jubatus クライアントのインストール
-----------------------------------

Jubatus を使ったクライアントアプリケーションは C++, Python, Ruby または Java で記述することができます。
クライアントアプリケーションから Jubatus を使うには、各言語のクライアントライブラリをインストールする必要があります。
クライアントライブラリは MIT License の下で配布されています。

:doc:`../tutorial/tutorial` を試す場合は、Python クライアントだけをインストールすれば十分です。

Jubatus と Jubatus クライアントのバージョンは異なることがあります。これは、Jubatus の API が変更されない場合はクライアント側のアップデートが不要なためです。

C++
~~~

クライアントは Jubatus フレームワークに含まれている (``$PREFIX/include/jubatus/client/*_client.hpp``) ため、インストールは不要です。

コンパイラや開発用のヘッダがインストールされていない場合は、以下の手順でセットアップを行ってください。
RHEL では、以下のコマンドを実行します。

::

  $ sudo yum groupinstall "Development tools" "Additional Development"

Ubuntu では、以下のコマンドを実行します。

::

  $ sudo apt-get install build-essential

Python
~~~~~~

クライアント (Python 2.6, 2.7 または 3.x が必要) は `PyPI <http://pypi.python.org/pypi/jubatus>`_ で配布されています。

::

  $ sudo pip install jubatus

Python 3.x のみがインストールされた環境では、 ``pip`` の代わりに ``pip3`` を使用する必要があるかもしれません。

``pip`` コマンドがインストールされていない場合は、以下の手順でインストールしてください。

::

  $ wget http://peak.telecommunity.com/dist/ez_setup.py
  $ sudo python ez_setup.py
  $ sudo easy_install pip

Ubuntu では ``pip`` のインストールに ``python-pip`` パッケージを利用することもできます。

Ruby
~~~~

クライアント (Ruby 1.9 以降が必要) は `RubyGems <http://rubygems.org/gems/jubatus>`_ で配布されています。

::

  $ sudo gem install jubatus

Java
~~~~

クライアントは Jubatus の Maven リポジトリで配布されています。
以下の記述をあなたのプロジェクトの ``pom.xml`` に追加してください。

.. code-block:: xml

   <repositories>
     <repository>
       <id>jubat.us</id>
       <name>Jubatus Repository for Maven</name>
       <url>http://download.jubat.us/maven</url>
     </repository>
   </repositories>

   <dependencies>
     <dependency>
       <groupId>us.jubat</groupId>
       <artifactId>jubatus</artifactId>
       <version>[1.1,)</version>
     </dependency>
   </dependencies>


チュートリアル
---------------

:doc:`../tutorial/tutorial` を試してみましょう (Python クライアントが必要です)。


作ってみよう！
----------------------

おめでとうございます!
これで、Jubatus を使ってあなた独自のアプリケーションを書く準備ができました。
Jubatus がどのような機能を持っているか知るには、 :doc:`../api/index` をチェックしてください。

各言語のスケルトンプロジェクトを使用すると、容易にアプリケーションの開発を始めることができます。

- `C++ クライアント開発用スケルトン <https://github.com/jubatus/jubatus-cpp-skeleton>`_
- `Python クライアント開発用スケルトン <https://github.com/jubatus/jubatus-python-skeleton>`_
- `Ruby クライアント開発用スケルトン <https://github.com/jubatus/jubatus-ruby-skeleton>`_
- `Java クライアント開発用スケルトン <https://github.com/jubatus/jubatus-java-skeleton>`_ (Eclipse プロジェクトのテンプレート)

`jubatus-example <https://github.com/jubatus/jubatus-example>`_ リポジトリでは、Jubatus を利用したアプリケーションの実例を見ることができます。
