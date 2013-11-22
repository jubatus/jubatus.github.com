クイックスタート
=================


Jubatus のインストール
----------------------

Red Hat Enterprise Linux 6.2 以降 (64-bit) と Ubuntu Server 12.04 LTS (64-bit) を公式にサポートしています。
これらのシステムでは、Jubatus のすべてのコンポーネントをバイナリパッケージでインストールすることができます。

また、その他の Linux 環境 (32-bit を含む) と Mac OS X が試験的にサポートされています。

Red Hat Enterprise Linux 6.2 以降 (64-bit)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

以下のコマンドを実行して、Jubatus の Yum リポジトリをシステムに登録します。

::

  $ sudo rpm -Uvh http://download.jubat.us/yum/rhel/6/stable/x86_64/jubatus-release-6-1.el6.x86_64.rpm

``jubatus`` と ``jubatus-client`` のパッケージをインストールします。

::

  // RHEL の場合
  $ sudo yum --enablerepo=rhel-6-server-optional-rpms install jubatus jubatus-client

  // RHEL クローン (CentOS, Scientific Linux など) の場合
  $ sudo yum install jubatus jubatus-client

RHEL では、依存パッケージ (``oniguruma``) のインストールに ``rhel-6-server-optional-rpms`` リポジトリを使用している点に注意してください。

Ubuntu Server 12.04 LTS (64-bit)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

以下の行を ``/etc/apt/sources.list.d/jubatus.list`` に記述して、Jubatus の Apt リポジトリをシステムに登録します。

::

  deb http://download.jubat.us/apt binary/

``jubatus`` のパッケージをインストールします。

::

  $ sudo apt-get update
  $ sudo apt-get install jubatus

現在、パッケージには GPG 署名が行われていません。
以下の警告メッセージが表示された場合は、 ``y`` を入力してください。

::

  Install these packages without verification [y/N]? y

これで、Jubatus が ``/opt/jubatus`` にインストールされました。

Jubatus を使う前に、毎回 ``profile`` スクリプトから環境変数を読み込む必要があります。

::

  $ source /opt/jubatus/profile

csh または tcsh をお使いの場合は、こちらを使用してください。

::

  $ source /opt/jubatus/profile.csh

その他の Linux 環境 (32-bit を含む)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

`jubatus-installer <https://github.com/jubatus/jubatus-installer>`_ を使用するか、 :doc:`build` を参照してソースからビルドしてください。

Mac OS X
~~~~~~~~~

Homebrew をお使いの場合は、 `tap リポジトリ <https://github.com/jubatus/homebrew-jubatus>`_ を使用すると簡単にインストールが行えます。

それ以外の場合は、 `jubatus-installer`_ を使用するか、 :doc:`build` を参照してソースからビルドしてください。

Jubatus クライアントのインストール
-----------------------------------

Jubatus を使ったクライアントアプリケーションは C++, Python, Ruby または Java で記述することができます。
クライアントアプリケーションから Jubatus を使うには、各言語のクライアントライブラリをインストールする必要があります。
クライアントライブラリは MIT License の下で配布されています。

:doc:`tutorial` を試す場合は、Python クライアントだけをインストールすれば十分です。

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

クライアント (Python 2.7 以降が必要) は `PyPI <http://pypi.python.org/pypi/jubatus>`_ で配布されています。

::

  $ sudo pip install jubatus

``pip`` コマンドがインストールされていない場合は、以下の手順でインストールしてください。

::

  $ wget http://peak.telecommunity.com/dist/ez_setup.py
  $ sudo python ez_setup.py
  $ sudo easy_install pip

Ubuntu では ``pip`` のインストールに ``python-pip`` パッケージを利用することもできます。

Ruby
~~~~

クライアント (Ruby 1.9 が必要) は `RubyGems <http://rubygems.org/gems/jubatus>`_ で配布されています。

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
       <version>0.5.0</version>
     </dependency>
   </dependencies>


チュートリアル
---------------

:doc:`tutorial` を試してみましょう (Python クライアントが必要です)。


作ってみよう！
----------------------

おめでとうございます!
これで、Jubatus を使ってあなた独自のアプリケーションを書く準備ができました。
Jubatus がどのような機能を持っているか知るには、 :doc:`api` をチェックしてください。

C++ または Java でクライアントを開発する場合は、以下のスケルトンプロジェクトを使用すると便利です。

- `C++ クライアント開発用スケルトン <https://github.com/jubatus/jubatus-cpp-skeleton>`_
- `Python クライアント開発用スケルトン <https://github.com/jubatus/jubatus-python-skeleton>`_
- `Ruby クライアント開発用スケルトン <https://github.com/jubatus/jubatus-ruby-skeleton>`_
- `Java クライアント開発用スケルトン <https://github.com/jubatus/jubatus-java-skeleton>`_ (Eclipse プロジェクトのテンプレート)

`jubatus-example <https://github.com/jubatus/jubatus-example>`_ リポジトリでは、Jubatus を利用したアプリケーションの実例を見ることができます。
