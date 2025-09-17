# Spring Boot Implementation Guide

## Overview
This guide provides the structure and API endpoints needed to implement the payment history management system in Spring Boot.

## Required Database Tables

### 1. transactions
\`\`\`sql
CREATE TABLE transactions (
    id VARCHAR(255) PRIMARY KEY,
    merchant VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date TIMESTAMP NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    payment_method VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    merchant_contact VARCHAR(255),
    website VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
\`\`\`

### 2. categories
\`\`\`sql
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## Required API Endpoints

### Transaction Management
- `GET /api/transactions` - Get filtered transactions
  - Query params: `month`, `category`, `search`, `page`, `size`
- `GET /api/transactions/{id}` - Get transaction details
- `PUT /api/transactions/{id}/category` - Update transaction category
- `POST /api/transactions` - Create new transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Category Management
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Analytics
- `GET /api/analytics/monthly-summary` - Get monthly spending summary
- `GET /api/analytics/category-breakdown` - Get category breakdown for pie chart

## Spring Boot Controller Examples

### TransactionController
\`\`\`java
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    
    @GetMapping
    public ResponseEntity<Page<Transaction>> getTransactions(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            Pageable pageable) {
        // Implementation here
    }
    
    @PutMapping("/{id}/category")
    public ResponseEntity<Transaction> updateCategory(
            @PathVariable String id,
            @RequestBody CategoryUpdateRequest request) {
        // Implementation here
    }
}
\`\`\`

### CategoryController
\`\`\`java
@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        // Implementation here
    }
    
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody CategoryRequest request) {
        // Implementation here
    }
}
\`\`\`

## Key Features to Implement

### 1. Month Navigation
- Backend should handle month filtering via query parameters
- Return transactions for specific month: `/api/transactions?month=2024-01`

### 2. Category Management
- CRUD operations for categories
- Inline category creation during transaction editing
- Category validation and uniqueness constraints

### 3. Pie Chart Data
- Calculate category breakdown for selected month
- Return data in format: `[{name: "Food", value: 250.00, count: 5}]`

### 4. Transaction Filtering
- Search by merchant name or description
- Filter by category
- Filter by date range
- Combine multiple filters

### 5. Transaction Details Modal
- Full transaction information display
- Category editing functionality
- Status-based conditional rendering

## Frontend Integration Notes

The React components provided serve as a reference for:
- UI structure and styling
- State management patterns
- User interaction flows
- Data formatting and display logic

You can either:
1. Use these React components with Spring Boot REST APIs
2. Convert the component logic to Thymeleaf templates
3. Build a separate frontend that consumes your Spring Boot APIs

## Security Considerations

- Implement proper authentication and authorization
- Validate all input data
- Use HTTPS for all API communications
- Implement rate limiting for API endpoints
- Add CSRF protection for state-changing operations
