const https = require('https');
const fs = require('fs');

const TOKEN = 'figd_agTubgnbelYtMmpm3qIamUSuNkL9_IZKhDVZMgTm';
const FILE_ID = 'NLpS5Rr9RYsdKN3QUB8RsO';

function fetchResource(path, filename) {
  const options = {
    hostname: 'api.figma.com',
    path: path,
    method: 'GET',
    headers: {
      'X-Figma-Token': TOKEN
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        fs.writeFileSync(filename, data);
        console.log(`Saved ${path} to ${filename}`);
      } catch (e) {
        console.error("Error parsing:", e);
      }
    });
  });
  req.on('error', console.error);
  req.end();
}

fetchResource(`/v1/files/${FILE_ID}/styles`, 'figma_meta_styles.json');
fetchResource(`/v1/files/${FILE_ID}/variables/local`, 'figma_meta_vars.json');
