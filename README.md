# E-Commerce Microservices Platform

## 📚 Project Overview

This is a **practice project** designed to build a comprehensive understanding of **microservices architecture** using modern technologies. The goal is to create a scalable e-commerce platform that demonstrates key microservices concepts, patterns, and best practices.

## 🎯 Learning Objectives

- **Microservices Architecture**: Understanding service decomposition and boundaries
- **Container Orchestration**: Docker and Docker Compose for development
- **API Design**: RESTful APIs and inter-service communication
- **Database per Service**: Independent data storage patterns
- **Service Discovery**: Dynamic service registration and discovery
- **Monitoring & Logging**: Centralized logging and health monitoring
- **CI/CD Pipelines**: Automated testing and deployment

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │    │  Load Balancer  │    │   Monitoring    │
│    (Kong/Nginx) │    │     (Nginx)     │    │ (Prometheus)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
    ┌────────────────────────────┼────────────────────────────┐
    │                            │                            │
┌───▼───┐  ┌─────────┐  ┌────────▼───┐  ┌─────────┐  ┌──────────┐
│ User  │  │ Catalog │  │    Cart    │  │  Order  │  │ Payment  │
│Service│  │ Service │  │  Service   │  │ Service │  │ Service  │
└───────┘  └─────────┘  └────────────┘  └─────────┘  └──────────┘
    │          │             │              │            │
┌───▼───┐  ┌───▼───┐     ┌───▼───┐      ┌───▼───┐    ┌───▼───┐
│MongoDB│  │MongoDB│     │ Redis │      │MongoDB│    │ Stripe│
│  DB   │  │  DB   │     │ Cache │      │  DB   │    │  API  │
└───────┘  └───────┘     └───────┘      └───────┘    └───────┘
```

## 🚀 Microservices

### Core Services
- **User Service** (`/services/user-service/`) - Authentication, user management, profiles
- **Catalog Service** (`/services/catalog-service/`) - Product listings, categories, inventory
- **Cart Service** (`/services/cart-service/`) - Shopping cart management
- **Order Service** (`/services/order-service/`) - Order processing and tracking
- **Payment Service** (`/services/payment-service/`) - Payment processing integration
- **Notification Service** (`/services/notification-service/`) - Email/SMS notifications

### Infrastructure Services
- **API Gateway** (`/infra/api-gateway/`) - Request routing and rate limiting
- **Service Discovery** (`/infra/service-discovery/`) - Service registration
- **Monitoring** (`/infra/monitoring/`) - Health checks and metrics
- **Logging** (`/infra/logging/`) - Centralized log aggregation

### Shared Libraries
- **Common Utils** (`/libs/common/`) - Shared utilities and types
- **API Contracts** (`/libs/contracts/`) - Service interface definitions

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Databases**: MongoDB, PostgreSQL, Redis
- **Authentication**: JWT tokens
- **Validation**: Joi/Zod schemas

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **API Gateway**: Kong/Nginx
- **Message Queue**: Redis/RabbitMQ
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)

### Development Tools
- **Package Manager**: npm
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest + Supertest
- **Documentation**: OpenAPI/Swagger

## 📁 Project Structure

```
Ecom/
├── services/                 # Microservices
│   ├── user-service/        # User authentication & profiles
│   ├── catalog-service/     # Product catalog management
│   ├── cart-service/        # Shopping cart functionality
│   ├── order-service/       # Order processing
│   ├── payment-service/     # Payment processing
│   └── notification-service/ # Notifications
├── infra/                   # Infrastructure services
│   ├── api-gateway/         # API Gateway configuration
│   ├── monitoring/          # Prometheus & Grafana
│   └── logging/             # ELK Stack setup
├── libs/                    # Shared libraries
│   ├── common/              # Common utilities
│   └── contracts/           # API contracts
├── docker-compose.yml       # Development orchestration
├── docker-compose.prod.yml  # Production orchestration
└── README.md               # This file
```

## 🚦 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Docker** & **Docker Compose**
- **Git** (with Git Bash on Windows)

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Ecom
```

2. **Start the development environment**
```bash
# Build and start all services
docker-compose up --build

# Or start individual services
docker-compose up user-service catalog-service
```

3. **Access the services**
- API Gateway: http://localhost:8080
- User Service: http://localhost:3001
- Catalog Service: http://localhost:3002
- Monitoring Dashboard: http://localhost:3000 (Grafana)

### Individual Service Development

```bash
# Navigate to a service
cd services/user-service

# Install dependencies
npm install

# Start in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🔧 Available Commands

### Docker Commands
```bash
# Start all services
docker-compose up

# Build and start
docker-compose up --build

# Start specific services
docker-compose up user-service mongo redis

# View logs
docker-compose logs -f user-service

# Stop all services
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v
```

### Development Commands
```bash
# Install dependencies for all services
./scripts/install-all.sh

# Run tests for all services
./scripts/test-all.sh

# Build all services
./scripts/build-all.sh
```

## 📊 Monitoring & Health Checks

- **Health Endpoints**: Each service exposes `/health` endpoint
- **Metrics**: Prometheus metrics at `/metrics`
- **Logs**: Centralized logging via ELK stack
- **Dashboards**: Grafana dashboards for monitoring

## 🧪 Testing Strategy

- **Unit Tests**: Individual service logic testing
- **Integration Tests**: Service-to-service communication
- **Contract Tests**: API contract validation
- **End-to-End Tests**: Full user journey testing

## 📈 Learning Milestones

- [ ] **Phase 1**: Basic service setup with Docker
- [ ] **Phase 2**: Inter-service communication
- [ ] **Phase 3**: Database integration per service
- [ ] **Phase 4**: API Gateway implementation
- [ ] **Phase 5**: Service discovery setup
- [ ] **Phase 6**: Monitoring and logging
- [ ] **Phase 7**: CI/CD pipeline integration
- [ ] **Phase 8**: Production deployment

## 🤝 Contributing

This is a learning project, but contributions and suggestions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📚 Resources & References

- [Microservices Patterns](https://microservices.io/patterns/)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [API Design Guidelines](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)

## 📝 License

This project is for educational purposes only.

---

**Happy Learning! 🚀**

*This project is a hands-on exploration of microservices architecture, designed to provide practical experience with modern distributed systems development.* 