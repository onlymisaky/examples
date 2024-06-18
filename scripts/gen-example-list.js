const fs = require('fs');
const path = require('path');

const examplesPath = path.resolve(process.cwd(), './');

const paths = fs.readdirSync(examplesPath);
const examples = paths.filter((dir) => {
  if (fs.existsSync(path.resolve(examplesPath, dir, 'index.html'))) {
    return true;
  }
  return false;
});

const link = 'https://onlymisaky.github.io/examples/';
const indexHtml = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Examples</title>
</head>

<body>
  <ul>
    ${examples.map((example) => `<li><a href="${link}${example}" target="_blank">${example}</a></li>`).join(`
    `)}
  </ul>
</body>

</html>
`;
fs.writeFileSync(path.resolve(examplesPath, 'index.html'), indexHtml, {
  encoding: 'utf-8',
});
