# SIWES & Entrepreneurship Program Management Portal
## Requirements Specification

**Developer:** University-SIWES-Team  
**Repository:** `siwes-entrepreneurship-portal`  
**Document Status:** Initial Requirements Specification

---

## 1. Project Overview

The SIWES & Entrepreneurship Program Management Portal is a web-based system designed to digitize and manage the university's SIWES and Entrepreneurship program.

The program is compulsory for eligible students after 200 level and before proceeding to 300 level.

The portal will replace major manual processes with a centralized digital system for student registration, application, payment, verification, skill selection, training, project submission, examinations, assessment, and program completion.

---

## 2. Program Workflow

The proposed student journey is:

1. Student creates an account.
2. Student completes their profile.
3. Student applies for the SIWES/Entrepreneurship program.
4. Student makes the required payment online.
5. Payment is verified by the system.
6. Student selects a training skill/category.
7. Application is reviewed by an administrator/coordinator.
8. Student is accepted or rejected.
9. Accepted student receives training information and trainer details.
10. Student attends the assigned training.
11. Student completes and submits a practical project.
12. Student completes the theoretical examination.
13. Results are recorded and published.
14. Student completes the program.

---

## 3. User Roles

### 3.1 Student

Students should be able to:

- Register and create an account.
- Log in securely.
- Complete and update their profile.
- Apply for the program.
- Make required online payments.
- View payment status.
- View payment reference/receipt information.
- Select an available skill.
- View application status.
- View program progress.
- View acceptance information.
- View assigned trainer information.
- View training details.
- Submit a practical project.
- View project submission status.
- Access examination information.
- View examination results.
- View program announcements and resources.

---

### 3.2 Administrator / Coordinator

Administrators should be able to:

- Log in securely.
- View and manage registered students.
- Review student applications.
- Approve or reject applications.
- View payment records and verification status.
- Manage available skills.
- Add and manage trainers.
- Assign trainers to students.
- Manage training information.
- Manage project submissions.
- Manage examinations.
- Record examination results.
- Publish announcements.
- Manage learning resources.
- Monitor student progress.

---

### 3.3 Trainer

The trainer role may initially be limited to assigned training information.

Possible trainer capabilities include:

- View assigned students.
- View assigned skill/training information.
- View training schedules.
- View student project submissions.
- Provide project assessment where required.

A more advanced trainer dashboard may be introduced in a future version.

---

## 4. Public Website

Visitors should be able to access public information without logging in.

The public website should include:

- Home
- About the Program
- SIWES Information
- Entrepreneurship Information
- Available Skills
- How It Works
- Frequently Asked Questions
- Contact Information
- Announcements
- Resources

The public pages should clearly explain the program and guide eligible students toward registration.

---

## 5. Student Registration and Profile

The system shall allow eligible students to create accounts.

The registration system should collect necessary information such as:

- Full name
- Matriculation/student ID
- Email address
- Phone number
- Department
- Faculty
- Level
- Password

Students should be able to update permitted profile information after registration.

The system should validate submitted information before saving it.

---

## 6. Application Management

Students shall be able to submit an application for the program.

The application should contain the information required by the institution.

Administrators shall be able to:

- View submitted applications.
- Review applications.
- Approve applications.
- Reject applications.
- Record relevant decisions.

Application statuses should include:

- Pending
- Approved
- Rejected

---

## 7. Payment Management

The system shall support secure online payment for required program fees.

The expected payment flow is:

**Student → Website → Payment Provider → Bank/Card/Transfer → Payment Provider → Webhook → Backend → Database**

The system should:

- Initiate payments.
- Generate/store payment references.
- Receive payment provider responses.
- Verify transactions through the backend.
- Store payment status.
- Allow students to view payment status.
- Allow administrators to view payment records.

Payment statuses should include:

- Pending
- Paid
- Failed

The system must not rely on a client-side confirmation button as proof of payment.

Payment verification should be performed by the backend/payment provider integration.

---

## 8. Skill Selection

After the required payment and verification steps, students shall be able to select an available training skill.

Skills may be divided into categories such as:

### Vocational Skills

Examples may include practical or trade-based training offered by the institution.

### Digital Skills

Digital training may include:

- Software
- Hardware
- Electronics

The exact list of skills will be determined by the institution.

Administrators should be able to create, edit, activate, deactivate, and manage skills.

---

## 9. Application and Program Status

The student dashboard should display the student's current program progress.

Example progress:

- Account Created
- Registration Completed
- Payment Confirmed
- Skill Selected
- Awaiting Approval
- Application Approved
- Training Assigned
- Training In Progress
- Project Submitted
- Examination Completed
- Results Published
- Program Completed

The system should clearly communicate the current status to students.

---

## 10. Training Management

Administrators should be able to manage training information.

Training information may include:

- Assigned skill
- Trainer name
- Trainer contact information
- Training location
- Training schedule
- Training start date
- Training end date
- Training status

Students should only see training information relevant to their assigned training.

---

## 11. Project Submission

Students shall be able to submit practical projects required as part of the program.

The whole system should support:

- Project title
- Project description
- File/document submission
- Submission date
- Submission status

Administrators or authorized trainers should be able to review submissions.

Possible submission statuses include:

- Not Submitted
- Submitted
- Under Review
- Accepted
- Rejected

The exact file types and file size limits will be determined during system design.

---

## 12. Examination Management

The system shall support the management and recording of theoretical examination results.

The institution may conduct theoretical examinations either physically or digitally.

### Physical Examination

Where examinations are conducted physically:

- Administrators may create the examination record.
- Authorized staff may record student scores.
- Results should be stored securely.
- Students should be able to view published results.

### Digital Examination

Where the institution chooses to conduct examinations online:

- Students may access examinations through the portal.
- Questions may be presented digitally.
- Student answers may be recorded.
- Scores may be calculated or entered.
- Examination attempts should be tracked.

Digital examination delivery is subject to institutional approval and technical requirements.

---

## 13. Results

The system shall allow authorized administrators to record examination results.

Students should be able to view their published results.

The system may store:

- Examination score
- Project score
- Assessment score
- Overall result
- Result status

The exact grading structure will be determined by the institution.

---

## 14. Announcements and Resources

Administrators should be able to publish:

- Program announcements
- Important notices
- Training information
- Examination information
- Deadlines
- Learning resources
- Documents

Students should be able to view relevant announcements and resources from their dashboard.

---

## 15. Administrator Dashboard

The administrator dashboard should provide an overview of program activity.

Possible dashboard information includes:

- Total registered students
- Pending applications
- Approved applications
- Rejected applications
- Payment statistics
- Students by selected skill
- Active training assignments
- Project submissions
- Examination results
- Recent announcements

The dashboard should provide links to the relevant management sections.

---

## 16. Authentication and Authorization

The system shall implement secure authentication.

Users should be required to log in before accessing protected features.

The system shall support role-based authorization.

Example roles:

- Student
- Administrator
- Trainer

Users should only have access to features appropriate to their role.

Administrative functions must not be accessible to ordinary students.

---

## 17. Security Requirements

The system should include appropriate security practices, including:

- Password hashing.
- Secure authentication.
- Role-based access control.
- Server-side validation.
- Protected API routes.
- Secure payment verification.
- Environment variables for secrets.
- Protection of sensitive student information.
- Protection against unauthorized administrative access.
- Secure handling of uploaded files.
- Appropriate error handling without exposing sensitive system information.

---

## 18. Future Enhancements

The following features may be introduced in later versions:

### Digital Attendance

A future attendance module may allow:

- Trainers/lecturers to record attendance digitally.
- Students to view attendance records.
- Attendance statistics to be monitored.
- Attendance to become part of program assessment where required.

The initial system should be designed in a way that allows attendance functionality to be added later without rebuilding the entire platform.

Other possible future enhancements include:

- Mobile application.
- Automated notifications.
- Email/SMS notifications.
- Advanced analytics and reporting.
- Digital certificates.
- Expanded trainer dashboard.
- Advanced examination monitoring.

---

## 19. Minimum Viable Product (MVP)

The first version should prioritize the following features.

### Public

- Home
- About
- Available Skills
- How It Works
- FAQs
- Contact

### Student

- Registration
- Login
- Profile
- Application
- Online payment
- Payment verification
- Skill selection
- Application status
- Training information
- Project submission
- Examination result viewing

### Administrator

- Admin login
- Dashboard
- Student management
- Payment records
- Skill management
- Application review
- Trainer management
- Trainer assignment
- Training management
- Project management
- Examination/result management
- Announcements/resources

---

## 20. Requirements Requiring Institutional Confirmation

The following details must be confirmed by the university before final implementation:

- Exact eligibility rules.
- Exact program fees.
- Approved payment provider.
- Payment amount and payment structure.
- Required student information.
- Available skills.
- Skill categories.
- Trainer assignment process.
- Training schedule.
- Training locations.
- Project requirements.
- Project file types and size limits.
- Examination format.
- Examination grading system.
- Result calculation.
- Program completion requirements.
- Attendance requirements.
- Whether digital examinations will be permitted.
- Whether students will receive certificates.
- Required notification channels.

---

## 21. Development Principle

The project should be developed in stages.

Requirements should be confirmed before implementing major features.

The system architecture should support future expansion without unnecessarily complicating the first release.

All contributors should use the team's GitHub workflow:

**Issue → Branch → Development → Testing → Pull Request → Review → Merge**

The `main` branch should contain stable code.

---

## 22. Document Status

**Status:** Initial Draft

This document represents the current understanding of the proposed SIWES & Entrepreneurship Program Management Portal.

It should be updated when official institutional requirements become available.