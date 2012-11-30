How to Contribute
=================

We Welcome Your Contribution
----------------------------

以下のようなコントリビューションをお待ちしています!

  - バグリポートを `GitHub issues <https://github.com/jubatus/jubatus/issues>`_ に投稿してください。
  - フィードバック (コメント、発生した問題、機能の要望など) や、あなたの環境で Jubatus をどのように使っているかを `メーリングリスト <http://groups.google.com/group/jubatus>`_ で教えてください。
  - ドキュメントの改善: `website リポジトリ <https://github.com/jubatus/website>`_ に `pull-request <https://github.com/jubatus/website/pulls>`_ を送ってください。typo や表現の誤りの訂正など、小さな修正も歓迎します。
  - `GitHub issues <https://github.com/jubatus/jubatus/issues>`_ にあるバグを修正したり、新しい機能をフレームワークに実装してください。

Participate in the Mailing List
-------------------------------

ユーザと開発者のためのコミュニティとして、 `Google Groups <http://groups.google.com/group/jubatus>`_ にメーリングリストを用意しています。
他のユーザや開発者と直接やり取りをすることができます。

Repositories
------------

- `Jubatus <http://github.com/jubatus/jubatus>`_

 - Jubatus フレームワーク
 - ブランチ - `A successful Git branching model <http://nvie.com/posts/a-successful-git-branching-model/>`_ に基づいて `git-flow <https://github.com/nvie/gitflow>`_ を使用しています。

  - ``master``  : リリース用ブランチ。
  - ``develop`` : 開発用ブランチ。最新機能はここで公開されています。

- `Website <http://github.com/jubatus/website>`_

 - このサイトの `Sphinx <http://sphinx.pocoo.org/>`_ ソースです。

Tips for Contributors
---------------------

* Jubatus フレームワークにあなたのコードをコントリビュートする場合:

 * ``develop`` ブランチをフォークしてから作業を始めてください。
 * pull-request を送る前に、既存の機能が破壊されていないことを確認してください - ``./waf --checkall`` を実行するとすべてのユニットテストが実行されます。
 * ユニットテストを実行するには、ソースコードから Jubatus をビルドできる環境が必要です。

  * 必要なツールやライブラリについては :doc:`build` をご覧ください。
  * Jubatus バイナリパッケージを RHEL で使用している場合は、以下のコマンドでビルド環境がセットアップできます: ``sudo yum install msgpack-devel glog-devel libevent-devel pficommon-devel zookeeper-client-devel mecab-devel ux-devel re2-devel`` 。
  * Jubatus バイナリパッケージを Ubuntu で使用している場合は、すでにビルド環境が整っています。

 * すべての pull-request は、 ``master`` ではなく ``develop`` ブランチに送ってください。
