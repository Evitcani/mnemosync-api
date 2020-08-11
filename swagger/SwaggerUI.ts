import {Application} from "express";
import {SwaggerDefinition} from "./SwaggerDefinition";

const swaggerUi = require('swagger-ui-express');

export class SwaggerUI {
    static setupRoutes(app: Application) {
        app.use(`/api/v1/docs`, swaggerUi.serve, swaggerUi.setup(SwaggerDefinition.JSON));
    }
}