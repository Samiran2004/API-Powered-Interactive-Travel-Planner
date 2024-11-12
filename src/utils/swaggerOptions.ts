// utils/swaggerOptions.ts
export const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'AI-Powered Interactive Travel Planner',
            version: '1.0.0',
            description: 'AI for interactive travel planning',
        },
        servers: [
            {
                url: 'http://localhost:8000',
            },
        ],
    },
    apis: ['src/routes/*.ts', 'src/app.ts', 'dist/app.js', 'dist/routes/*.js'], // Adjust the paths as necessary
};
