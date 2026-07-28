const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "DNA Analysis API",
            version: "1.0.0",
            description: "REST API DNA Analysis"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./routes/*.js"]
};

module.exports = swaggerJsdoc(options);