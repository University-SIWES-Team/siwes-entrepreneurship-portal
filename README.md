# SIWES & Entrepreneurship Portal

A web-based portal for managing the student SIWES and entrepreneurship programme workflow.

The portal provides students with a central place to submit programme applications, select training skills, submit payment evidence, and track their application progress. Administrators can review applications and payments and manage parts of the training workflow.

## Features

### Student

* Student registration and authentication
* Secure login and logout
* Student dashboard
* Programme application submission
* Skill selection
* Programme payment tracking
* Payment evidence submission
* Payment reference and payment date submission
* Application status tracking
* Mobile-friendly dashboard navigation

### Administration

* Protected admin dashboard
* Application management
* Application approval and rejection
* Payment evidence review
* Payment confirmation and rejection
* Payment receipt access
* Trainer assignment
* Training assignment management

## Programme Payments

The portal currently handles three programme payments:

| Payment             |      Amount |
| ------------------- | ----------: |
| SIWES Registration  |     ₦30,000 |
| Vocational Training |     ₦20,000 |
| Examination         |     ₦17,000 |
| **Total**           | **₦67,000** |

Students submit payment evidence for administrator review before a payment is marked as confirmed.

Supported payment evidence formats:

* PDF
* JPG/JPEG
* PNG

Maximum file size: **5MB**

## Application Workflow

The general student workflow is:

```text
Register
   ↓
Login
   ↓
Submit Programme Application
   ↓
Select Skill
   ↓
Submit Payment Evidence
   ↓
Administrator Reviews Payment
   ↓
Payment Confirmed
   ↓
Application Reviewed
   ↓
Trainer Assignment
   ↓
Training Workflow
```

## Technology Stack

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Prisma ORM**
* **PostgreSQL**
* **Supabase Storage**
* **JWT-based sessions**
* **bcryptjs** for password hashing

## Project Structure

```text
app/
├── actions/          # Server actions
├── components/       # Reusable UI components
├── dashboard/        # Student and admin dashboard pages
├── lib/              # Authentication, Prisma and Supabase utilities
├── login/            # Login page
└── ...

prisma/
├── schema.prisma     # Database schema
└── ...

middleware.ts         # Protected dashboard routes
```

## Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* PostgreSQL/Supabase database

### Installation

Clone the repository:

```bash
git clone https://github.com/University-SIWES-Team/siwes-entrepreneurship-portal.git
cd siwes-entrepreneurship-portal
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root.

Required environment variables include:

```env
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-jwt-secret"
```

Supabase configuration may also be required depending on the storage setup.

**Never commit `.env` or expose database credentials, JWT secrets, or Supabase service-role credentials.**

### Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

To verify the application builds successfully:

```bash
npm run build
```

## Authentication & Authorization

Students and administrators use session-based authentication.

Dashboard routes are protected, and administrator pages perform server-side role checks to ensure that only users with the `ADMIN` role can access administrative functionality.

## Storage

Payment receipts are uploaded to Supabase Storage.

The application validates:

* File type
* File size
* Payment ownership
* Payment status

Payment evidence is associated with the student's payment record and can be reviewed by an administrator.

## Development Notes

This project is currently focused on the SIWES and entrepreneurship programme workflow.

Some areas of the broader programme workflow may be implemented incrementally. Features should only be added when their corresponding workflow and requirements are defined.

When contributing:

1. Create a dedicated branch.
2. Make focused changes.
3. Test the affected workflow.
4. Avoid unnecessary dependency, database, or architecture changes.
5. Use clear conventional commit messages.

## Status

The portal is under active development and testing for deployment/pre-defense use.

Current core workflows include:

* Student registration and authentication
* Programme applications
* Skill selection
* Payment evidence submission
* Administrative payment review
* Application approval/rejection
* Protected administration routes
* Trainer assignment
* Student dashboard progress tracking
* Mobile dashboard navigation
