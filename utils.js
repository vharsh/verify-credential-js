var fs = require('file-system');
const readFile = () => {
    const filesRead = fs.readFileSync("vc.json");
    return JSON.parse(filesRead.toString());
}

module.exports = {readFile}
