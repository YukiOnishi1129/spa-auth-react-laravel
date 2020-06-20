# spa-auth-react-laravel

Laravel-Sanctum を用いた React の SPA 認証処理

## 参考サイト

https://dev.to/dog_smile_factory/authenticating-a-react-app-with-laravel-sanctum-part-1-44hl

## 公式サイト

https://readouble.com/laravel/7.x/ja/sanctum.html

## 注意点

### フロントサイドのドメインを Laravel 側で定義する

1. config/sanctum.php の以下の記述
   「SANCTUM_STATEFUL_DOMAINS」を「.env」に定義する

```
<?php

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1')),
]
```

- .env

```
SANCTUM_STATEFUL_DOMAINS=[フロントエンドのドメイン]
例：localhost:3000 など

```

2. Laravel の config 配下のファイルを変更した場合、以下のコマンドを実行しないと反映されない。

```
php artisan config:cache
```

## 参考

Laravel のルーティングを一覧表示するコマンド

```
php artisan route:list
```
