export const swaggerDocument = {
    "swagger": "2.0",
    "info": {
      "description": "My Bank API description",
      "version": "1.0.0",
      "title": "My Bank API"
    },
    "host": "localhost:3000",
    "schemes": [
      "http"
    ],
    "paths": {
      "/account": {
        "get": {
          "tags": [
            "Account"
          ],
          "summary": "Get existents accounts",
          "description": "Get existents accounts Description",
          "operationId": "addPet",
          "produces": [
            "application/json"
          ],
          "responses": {
            "200": {
              "description": "Successfull Called"
            }
          }
        }
      }
    }
  }