const getAllDocuments = (model) => {
    return async (req, res) => {
        try {
            documents = await model.find();
            if (documents) {
                res.send(documents);
            } else {
                res.send('no records found');
            }
        } catch (err) {
            res.status(400).send('A database error occurred');
            console.log(err);
        }
    };
};

const getById = (model, idParam) => {
    return async (req, res) => {
        try {
            let document = await model.findById(
                req.params[idParam]
            );
            if (document) {
                res.send(document);
            } else {
                res.send('id not found');
            }
        } catch (err) {
            res.status(400).send('A database error occurred');
            console.log(err);
        }
    };
};

module.exports = {
    getById,
    getAllDocuments,
};
