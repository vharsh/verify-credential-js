var fs = require('file-system');
const readFile = () => {
    const filesRead = fs.readFileSync("vc.json");
    return JSON.parse(filesRead.toString());
}

const documentLoader = async url => {
    if (url.startsWith('https://')) {
        const response = await fetch(url, "GET");
        const json = await response.json();
        return {
            contextUrl: null,
            documentUrl: url,
            document: json,
        };
    }
    return jsonld.documentLoaders.xhr(url);
};


module.exports = {readFile, documentLoader}
