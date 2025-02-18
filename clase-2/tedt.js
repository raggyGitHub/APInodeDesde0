const fs = require('fs');
const path = './pokemon/ditto.json';

fs.access(path, fs.constants.F_OK, (err) => {
  if (err) {
    console.error(`${path} does not exist`);
  } else {
    console.log(`${path} exists`);
  }
});
