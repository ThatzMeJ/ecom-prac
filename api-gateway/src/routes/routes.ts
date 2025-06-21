export default [
  {
    "name": "user-service",
    "context": ["/api/v1/users", "/api/v1/auth"],
    "target": "http://localhost:3001",
    "pathRewrite": {}
  },
  {
    "name": "catalog-service",
    "context": ["/api/v1/catalog"],
    "target": "http://localhost:3002",
    "pathRewrite": {}
  }
]