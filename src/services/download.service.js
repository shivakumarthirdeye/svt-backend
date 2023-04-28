const { Parser } = require('json2csv');
const pdfMakePrinter = require('pdfmake/src/printer');
const path = require('path');

const downloadResourceInCSV = (fields, data) => {
  const json2csv = new Parser({ fields });
  const csv = json2csv.parse(data);
  return csv;
};

const downloadResourceInPDF = (docDefinition, callback) => {
  var fonts = {
    Roboto: {
      normal: path.join(__dirname, '../utils/fonts/Roboto-Regular.ttf'),
      bold: '../utils/fonts/fonts/Roboto-Medium.ttf',
      italics: '../utils/fonts/fonts/Roboto-Italic.ttf',
      bolditalics: '../utils/fonts/fonts/Roboto-MediumItalic.ttf',
    },
  };
  try {
    const printer = new pdfMakePrinter(fonts);
    const doc = printer.createPdfKitDocument(docDefinition);

    let chunks = [];
    let result;

    doc.on('data', chunk => {
      chunks.push(chunk);
    });

    doc.on('end', () => {
      result = Buffer.concat(chunks);
      callback(result);
    });

    doc.end();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  downloadResourceInCSV,
  downloadResourceInPDF,
};
