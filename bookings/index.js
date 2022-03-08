require('dotenv').config();
const express = require('express');

const router = require('./app/router');
const {cleaner} = require('./app/middlewares');

const app = express();

const expressSwagger = require('express-swagger-generator')(app);

const port = process.env.PORT || 5000;

//ce middleware va nous protéger des failles XSS en remplaçant les caractères HTML par leurs entités
app.use(cleaner);

app.use('/v1', router);

let options = {
    swaggerDefinition: {
        info: {
            description: 'A booking REST API',
            title: 'Oparc',
            version: '1.0.0',
        },
        host: `localhost:${port}`,
        basePath: '/v1',
        produces: [
            "application/json"
        ],
        schemes: ['http', 'https']
    },
    basedir: __dirname, //app absolute path
    files: ['./app/**/*.js'] //Path to the API handle folder
};
expressSwagger(options);


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});