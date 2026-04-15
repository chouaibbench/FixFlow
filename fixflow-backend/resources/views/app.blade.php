<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{ config('app.name', 'FixFlow') }}</title>
    @viteReactRefresh
    @vite(['client/src/main.jsx'])
</head>
<body>
    <div id="root"></div>
</body>
</html>
