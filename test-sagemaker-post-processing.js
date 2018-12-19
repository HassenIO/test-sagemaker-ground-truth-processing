const AWS = require("aws-sdk");
const s3 = new AWS.S3();

exports.handler = async (event) => {
    console.info(event);
    
    try {
        const consolidationRequestFile = await s3.getObject(event.payload.s3Uri);
        const consolidationRequest = consolidationRequestFile.Body;
        let consolidationLabels = [];
        
        consolidationRequest.map(c => {
            c.annotations.map(a => {
                const label = JSON.parse(a.annotationData.content)['image-contains'].label;
                console.info(`label= ${label}`);
                const consolidationLabel = {
                    datasetObjectId: c.datasetObjectId,
                    consolidatedAnnotation: {
                        content: {
                            label: {
                                workerId: a.workerId,
                                imageSource: c.dataObject.s3Uri,
                                text: label,
                            }
                        }
                    }
                }
                console.info(consolidationLabel);
                consolidationLabels.push(consolidationLabel);
            });
        });
        return consolidationLabels;
    } catch (err) {
        console.error(err);
        return err;
    }
};
