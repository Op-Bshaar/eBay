<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
</head>
<body>
    <form id="redirectForm" action="{{ $redirect_url }}" method="POST">
        @foreach ($redirect_params as $key => $value)
            <input type="hidden" name="{{ $key }}" value="{{ $value }}">
        @endforeach
    </form>

    <script type="text/javascript">
        document.getElementById('redirectForm').submit();
    </script>
</body>
</html>
