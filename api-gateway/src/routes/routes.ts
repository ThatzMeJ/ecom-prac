export default [
  {
    "name": "user-service",
    "context": ["/api/v1/users", "/api/v1/auth"],
    "target": "http://user-service:3001",
    "pathRewrite": {}
  },
  {
    "name": "catalog-service",
    "context": ["/api/v1/catalog"],
    "target": "http://catalog-service:3002",
    "pathRewrite": {}
  }
]