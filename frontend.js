function getMarkup(params) {
  return `<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Which Side Are You On? - Play Online</title>
        <script src="/static/app.js" type="text/javascript"></script>
        <link href="/static/font.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="/static/app.css" />
        <!-- <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"> -->
        <script type="text/javascript">
            window.appData = ${JSON.stringify(params, null, 2).replace(/</g, '\\u003c')};
        </script>
    </head>
    <body>
        <div id="app">
        </div>
    </body>
</html>
`
}

module.exports = {
  getMarkup,
}
