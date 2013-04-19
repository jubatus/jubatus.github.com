プロジェクトに貢献する
========================

プロジェクトに貢献するには
----------------------------

以下のようなコントリビューションをお待ちしています!

  - バグリポートを投稿してください。Jubatus では `GitHub issues <https://github.com/jubatus/jubatus/issues>`_ を課題追跡システムとして使用しています。
  - お使いの環境で Jubatus がビルド/実行できたかどうか、 `メーリングリスト <http://groups.google.com/group/jubatus>`_ で教えてください (CPU の種類、OS/コンパイラのバージョンなど)。
  - フィードバック (コメント、発生した問題、機能の要望など) や、あなたが Jubatus をどのように活用しているか/しようと思っているかを `メーリングリスト`_ で教えてください。
  - ドキュメントの改善: `website リポジトリ <https://github.com/jubatus/website>`_ に `pull-request <https://github.com/jubatus/website/pulls>`_ を送ってください。typo や表現の誤りの訂正など、小さな修正も歓迎します。
  - `GitHub issues <https://github.com/jubatus/jubatus/issues>`_ にあるバグを修正したり、新しい機能をフレームワークに実装してください。

メーリングリストへの参加
-------------------------------

ユーザと開発者のためのコミュニティとして、 `Google Groups <http://groups.google.com/group/jubatus>`_ にメーリングリストを用意しています。
他のユーザや開発者と直接やり取りをすることができます。

リポジトリ
------------

- `Jubatus <http://github.com/jubatus/jubatus>`_

 - Jubatus フレームワーク
 - ブランチ - `A successful Git branching model <http://nvie.com/posts/a-successful-git-branching-model/>`_ に基づいて `git-flow <https://github.com/nvie/gitflow>`_ を使用しています。

  - ``master``  : リリース用ブランチ。
  - ``develop`` : 開発用ブランチ。最新機能はここで公開されています。

- `Website <http://github.com/jubatus/website>`_

 - このサイトの `Sphinx <http://sphinx.pocoo.org/>`_ ソースです。

コントリビュータのための Tips
--------------------------------

* Jubatus フレームワークにあなたのコードをコントリビュートする場合:

 * ``develop`` ブランチをフォークしてから作業を始めてください。
 * pull-request を送る前に、既存の機能が破壊されていないことを確認してください - ``./waf --checkall`` を実行するとすべてのユニットテストが実行されます。
 * ユニットテストを実行するには、ソースコードから Jubatus をビルドできる環境が必要です。

  * 必要なツールやライブラリについては :doc:`build` をご覧ください。
  * Jubatus バイナリパッケージを RHEL で使用している場合は、以下のコマンドでビルド環境がセットアップできます: ``sudo yum install msgpack-devel glog-devel jubatus-mpio-devel jubatus-msgpack-rpc-devel pficommon-devel zookeeper-client-devel mecab-devel ux-devel re2-devel`` 。
  * Jubatus バイナリパッケージを Ubuntu で使用している場合は、すでにビルド環境が整っています。

 * pull-request は、 ``master`` ではなく ``develop`` ブランチに送ってください。
