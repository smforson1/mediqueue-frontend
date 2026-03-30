# MediQueue API Specification

Base URL: `http://localhost:5000/api`

## Authentication

### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "admin",
    "password": "password123"
  }
  ```
- **Response**: User object with `token` and `role`.

## Doctors

### List Doctors
- **URL**: `/doctors`
- **Method**: `GET`
- **Response**: Array of doctor objects including availability.

## Appointments

### List/Create/Update Appointments
- **URL**: `/appointments`
- **Methods**: `GET`, `POST`, `PATCH`, `DELETE`
- **Fields**: `id`, `patientId`, `doctorId`, `date`, `time`, `status`, `reason`, `queuePosition`.

## Notifications

### List Notifications
- **URL**: `/notifications`
- **Method**: `GET`
- **Query Params**: `userId`
- **Response**: Array of notification objects.

## Admin Statistics

### Get Stats
- **URL**: `/stats`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "totalBookings": 1,
    "confirmed": 1,
    "pending": 0,
    "cancelled": 0
  }
  ```
