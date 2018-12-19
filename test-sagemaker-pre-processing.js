const ocrResults = require("./ocr-results.json");
const dataLocation = "<Data location in S3 bucket>";

exports.handler = async (event) => {
    console.info(event);
    const fileName = event.dataObject['source-ref'].substr(dataLocation.length);
    const extracts = ocrResults[fileName] || {rekognition: "__error.rekognition__", gcVision: "__error.gcVision__"};
    console.info(extracts);
    const categories = [extracts["rekognition"], extracts["gcVision"], "Neither"];
    const response = {
        taskInput: {
            taskObject: fileName,
            categories
        }
    };
    console.info(response);
    return response;
};
