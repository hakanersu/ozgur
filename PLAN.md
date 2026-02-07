# Ozgur Compliance Platform - Implementation Plan

Rebuild the Probo compliance platform (Go/GraphQL/React) as a Laravel 12 + Inertia/React + shadcn app with multi-tenancy.

## Current State
- Laravel 12 starter kit with Fortify auth (login, register, 2FA, email verify)
- React 19 + Inertia.js 2 + shadcn/ui + Tailwind 4 frontend
- SQLite database, Wayfinder route generation
- Only model: `User`

---

## Phase 1: Multi-Tenancy Foundation

### 1.1 Organizations & Memberships
- **Migration**: `organizations` table (id, name, slug, logo_path, timestamps)
- **Migration**: `memberships` table (id, user_id FK, organization_id FK, role enum [owner, admin, member], timestamps)
- **Models**: `Organization`, `Membership` with relationships
- **Factories & seeders** for both
- **Middleware**: `EnsureOrganization` - resolve current org from route param `{organization}`
- **Trait**: `BelongsToOrganization` - reusable scope for org-scoped models
- **Policy**: `OrganizationPolicy` (view, update, delete, manage members)

### 1.2 Organization CRUD & Switching
- **Controller**: `OrganizationController` (index, create, store, show)
- **Controller**: `MembershipController` (index, store, update, destroy) - invite/remove members
- **Pages**: Organization create, organization switcher in sidebar
- **Update sidebar**: Add org switcher dropdown, scope navigation under `/organizations/{organization}/...`

### 1.3 Route Structure
All compliance features scoped: `GET /organizations/{organization}/frameworks`, etc.
Settings remain user-scoped at `/settings/*`.

---

## Phase 2: Core Compliance Models & Migrations

### 2.1 Frameworks
- **Migration**: `frameworks` (id, organization_id FK, name, description, version, status enum [Draft, Active, Archived], timestamps)
- **Model**: `Framework` with org scope, controls relationship
- **Factory & seeder** with sample framework data (SOC-2, ISO 27001)

### 2.2 Controls
- **Migration**: `controls` (id, organization_id FK, framework_id FK, name, description, code, category, status enum [NotStarted, InProgress, Implemented, NotApplicable], timestamps)
- **Model**: `Control` with relationships to framework, measures, documents, audits
- **Factory & seeder**

### 2.3 Measures & Evidence
- **Migration**: `measures` (id, organization_id FK, name, description, state enum [NotStarted, InProgress, Implemented, NotApplicable], timestamps)
- **Migration**: `evidence` (id, measure_id FK, organization_id FK, name, type enum [File, Link], url, file_path, state enum [Fulfilled, Requested], timestamps)
- **Pivot migration**: `control_measure` (control_id, measure_id)
- **Models**: `Measure`, `Evidence`
- **Factory & seeder**

### 2.4 Risks
- **Migration**: `risks` (id, organization_id FK, name, description, category, probability int, impact int, treatment enum [Mitigated, Accepted, Avoided, Transferred], timestamps)
- **Pivot migration**: `measure_risk` (measure_id, risk_id)
- **Model**: `Risk` with measure relationships
- **Factory & seeder**

### 2.5 Audits
- **Migration**: `audits` (id, organization_id FK, name, description, state enum [NotStarted, InProgress, Completed, Rejected, Outdated], scheduled_at, completed_at, timestamps)
- **Pivot migration**: `audit_control` (audit_id, control_id)
- **Model**: `Audit`
- **Factory & seeder**

---

## Phase 3: Core Compliance CRUD (Backend + Frontend)

### 3.1 Frameworks Module
- **Controller**: `FrameworkController` (index, create, store, show, edit, update, destroy)
- **FormRequests**: `StoreFrameworkRequest`, `UpdateFrameworkRequest`
- **Policy**: `FrameworkPolicy`
- **Pages**: List (with search/filter), Create form, Show detail with linked controls, Edit form
- **Tests**: Feature tests for all CRUD operations

### 3.2 Controls Module
- **Controller**: `ControlController` (index, create, store, show, edit, update, destroy)
- **Controller**: `ControlMeasureController` (store, destroy) - manage pivot
- **Controller**: `ControlDocumentController` (store, destroy) - manage pivot
- **FormRequests**: `StoreControlRequest`, `UpdateControlRequest`
- **Policy**: `ControlPolicy`
- **Pages**: List with status badges, Show detail with tabs (measures, documents, audits), Create/Edit forms
- **Tests**: Feature tests

### 3.3 Measures & Evidence Module
- **Controller**: `MeasureController` (index, create, store, show, edit, update, destroy)
- **Controller**: `EvidenceController` (store, destroy) - file upload + link
- **FormRequests**: `StoreMeasureRequest`, `UpdateMeasureRequest`, `StoreEvidenceRequest`
- **Policy**: `MeasurePolicy`
- **Pages**: List, Show with evidence uploads, Create/Edit
- **File storage**: Configure `evidence` disk for file uploads
- **Tests**: Feature tests including file upload

### 3.4 Risks Module
- **Controller**: `RiskController` (index, create, store, show, edit, update, destroy)
- **Controller**: `RiskMeasureController` (store, destroy) - pivot
- **FormRequests**: `StoreRiskRequest`, `UpdateRiskRequest`
- **Policy**: `RiskPolicy`
- **Pages**: Risk register list with probability/impact matrix, Show detail, Create/Edit
- **Tests**: Feature tests

### 3.5 Audits Module
- **Controller**: `AuditController` (index, create, store, show, edit, update, destroy)
- **Controller**: `AuditControlController` (store, destroy) - pivot
- **FormRequests**: `StoreAuditRequest`, `UpdateAuditRequest`
- **Policy**: `AuditPolicy`
- **Pages**: List with state filters, Show with linked controls, Create/Edit
- **Tests**: Feature tests

---

## Phase 4: Document & Vendor Management

### 4.1 Documents
- **Migration**: `documents` (id, organization_id FK, title, description, classification enum [Public, Internal, Confidential, Restricted], document_type, published_at, timestamps)
- **Migration**: `document_versions` (id, document_id FK, version_number, file_path, changelog, created_by FK to users, timestamps)
- **Pivot migration**: `control_document` (control_id, document_id)
- **Models**: `Document`, `DocumentVersion`
- **Controller**: `DocumentController`, `DocumentVersionController`
- **Pages**: Document list, Show with version history, Upload new version, Create/Edit
- **File storage**: `documents` disk
- **Tests**

### 4.2 Vendors
- **Migration**: `vendors` (id, organization_id FK, name, description, website, status, timestamps)
- **Migration**: `vendor_contacts` (id, vendor_id FK, name, email, phone, role, timestamps)
- **Migration**: `vendor_services` (id, vendor_id FK, name, description, timestamps)
- **Migration**: `vendor_compliance_reports` (id, vendor_id FK, name, file_path, type, expires_at, timestamps)
- **Models**: `Vendor`, `VendorContact`, `VendorService`, `VendorComplianceReport`
- **Controllers**: `VendorController`, `VendorContactController`, `VendorServiceController`, `VendorComplianceReportController`
- **Pages**: Vendor list, Vendor detail with tabs (contacts, services, compliance reports), Create/Edit
- **Tests**

---

## Phase 5: People, Tasks, Meetings & Governance

### 5.1 People
- **Migration**: `people` (id, organization_id FK, user_id FK nullable, full_name, email, kind enum [Employee, Contractor, ServiceAccount], department, title, timestamps)
- **Model**: `Person`
- **Controller**: `PersonController`
- **Pages**: People list with kind filters, Show detail, Create/Edit
- **Tests**

### 5.2 Tasks
- **Migration**: `tasks` (id, organization_id FK, title, description, state enum [Todo, Done], assigned_to FK nullable to people, due_date, timestamps)
- **Model**: `Task`
- **Controller**: `TaskController`
- **Pages**: Task list with filters, Create/Edit
- **Tests**

### 5.3 Meetings
- **Migration**: `meetings` (id, organization_id FK, title, description, scheduled_at, location, timestamps)
- **Migration**: `meeting_attendees` (meeting_id, person_id)
- **Model**: `Meeting`
- **Controller**: `MeetingController`
- **Pages**: Meeting list, Show with attendees, Create/Edit
- **Tests**

### 5.4 Non-Conformities
- **Migration**: `non_conformities` (id, organization_id FK, title, description, status enum [Open, InProgress, Closed], severity, reported_at, resolved_at, timestamps)
- **Model**: `NonConformity`
- **Controller**: `NonConformityController`
- **Pages**: List with status filters, Show, Create/Edit
- **Tests**

### 5.5 Obligations
- **Migration**: `obligations` (id, organization_id FK, name, description, type enum [Legal, Contractual], status enum [NonCompliant, PartiallyCompliant, Compliant], due_date, timestamps)
- **Pivot migration**: `obligation_risk` (obligation_id, risk_id)
- **Model**: `Obligation`
- **Controller**: `ObligationController`
- **Pages**: List, Show, Create/Edit
- **Tests**

### 5.6 Continual Improvements
- **Migration**: `continual_improvements` (id, organization_id FK, title, description, priority enum [Low, Medium, High, Critical], status enum [Proposed, InProgress, Completed, Cancelled], timestamps)
- **Model**: `ContinualImprovement`
- **Controller**: `ContinualImprovementController`
- **Pages**: List, Show, Create/Edit
- **Tests**

---

## Phase 6: Data Protection (GDPR/Privacy)

### 6.1 Processing Activities
- **Migration**: `processing_activities` (id, organization_id FK, name, description, legal_basis, data_categories, data_subjects, retention_period, is_international_transfer bool, timestamps)
- **Model**: `ProcessingActivity`
- **Controller**: `ProcessingActivityController`
- **Pages**: List, Show, Create/Edit
- **Tests**

### 6.2 Data Protection Impact Assessments (DPIAs)
- **Migration**: `dpias` (id, organization_id FK, processing_activity_id FK nullable, name, description, risk_assessment, mitigation_measures, status enum [Draft, InProgress, Completed], timestamps)
- **Model**: `Dpia`
- **Controller**: `DpiaController`
- **Pages**: List, Show, Create/Edit
- **Tests**

### 6.3 Rights Requests
- **Migration**: `rights_requests` (id, organization_id FK, requester_name, requester_email, request_type enum [Access, Deletion, Portability, Rectification, Restriction, Objection], status enum [Received, InProgress, Completed, Denied], description, responded_at, timestamps)
- **Model**: `RightsRequest`
- **Controller**: `RightsRequestController`
- **Pages**: List with status tracking, Show, Create/Edit
- **Tests**

### 6.4 Data Inventory
- **Migration**: `data_items` (id, organization_id FK, name, description, classification enum [Public, Internal, Confidential, Restricted], storage_location, owner, timestamps)
- **Model**: `DataItem`
- **Controller**: `DataItemController`
- **Pages**: List, Show, Create/Edit
- **Tests**

---

## Phase 7: Assets & Snapshots

### 7.1 Assets
- **Migration**: `assets` (id, organization_id FK, name, description, asset_type, vendor_id FK nullable, status, timestamps)
- **Pivot migration**: `asset_control` (asset_id, control_id)
- **Model**: `Asset`
- **Controller**: `AssetController`
- **Pages**: Asset inventory list, Show, Create/Edit
- **Tests**

### 7.2 Applicability Statements
- **Migration**: `applicability_statements` (id, organization_id FK, control_id FK, is_applicable bool, justification, timestamps)
- **Model**: `ApplicabilityStatement`
- **Controller**: `ApplicabilityStatementController`
- **Pages**: Integrated into framework/control views
- **Tests**

### 7.3 Snapshots
- **Migration**: `snapshots` (id, organization_id FK, name, description, captured_at, timestamps)
- **Pivot migration**: `control_snapshot` (control_id, snapshot_id, status_at_capture)
- **Model**: `Snapshot`
- **Controller**: `SnapshotController`
- **Pages**: Snapshot list, Show with point-in-time control status, Create
- **Tests**

---

## Phase 8: Trust Center (Public Compliance Portal)

### 8.1 Trust Center Configuration
- **Migration**: `trust_centers` (id, organization_id FK unique, is_enabled bool, visibility enum [None, Private, Public], title, description, brand_color, logo_path, nda_file_path, timestamps)
- **Migration**: `trust_center_references` (id, trust_center_id FK, title, description, url, is_visible bool, timestamps)
- **Migration**: `trust_center_files` (id, trust_center_id FK, name, file_path, is_visible bool, timestamps)
- **Migration**: `trust_center_accesses` (id, trust_center_id FK, email, name, company, state enum [Requested, Granted, Rejected, Revoked], timestamps)
- **Models**: `TrustCenter`, `TrustCenterReference`, `TrustCenterFile`, `TrustCenterAccess`

### 8.2 Admin Pages
- **Controller**: `TrustCenterController` (settings, update, manage accesses)
- **Pages**: Trust center settings, reference management, file management, access request management

### 8.3 Public Pages
- **Controller**: `PublicTrustCenterController` (show, documents, subprocessors, request access)
- **Route**: `GET /trust/{organization:slug}` - public trust center
- **Pages**: Public overview, documents, subprocessor list, access request form
- **Middleware**: Handle trust center visibility (public vs private vs NDA-required)
- **Tests**

---

## Phase 9: Dashboard & Navigation

### 9.1 Dashboard
- **Controller**: Update `DashboardController` to show org-scoped compliance overview
- **Page**: Dashboard with stats cards: framework progress, control status breakdown, open risks count, pending tasks, upcoming audits
- **Queries**: Aggregate stats from all compliance modules

### 9.2 Navigation
- **Update sidebar**: Full navigation tree matching Probo's structure:
  - Dashboard
  - Frameworks (with controls nested)
  - Measures
  - Risks
  - Audits
  - Documents
  - Assets
  - Vendors
  - People
  - Tasks
  - Meetings
  - Data Protection (submenu: Processing Activities, DPIAs, Rights Requests, Data Inventory)
  - Compliance (submenu: Obligations, Non-Conformities, Continual Improvements)
  - Snapshots
  - Trust Center
  - Settings

---

## Phase 10: Polish & Advanced Features

### 10.1 Import/Export
- Framework import from JSON/CSV
- Bulk document export
- Framework export

### 10.2 Search & Filtering
- Global search across all compliance entities
- Advanced filters on list pages (status, date range, category)

### 10.3 Activity Log
- Track changes to compliance entities (who changed what, when)
- Audit trail for compliance evidence

---

## Implementation Order Summary

We'll implement phases sequentially. Each phase builds on the previous:

1. **Phase 1** - Multi-tenancy foundation (organizations, memberships, middleware, route structure)
2. **Phase 2** - Core models & migrations (frameworks, controls, measures, risks, audits)
3. **Phase 3** - Core CRUD controllers + Inertia pages for Phase 2 models
4. **Phase 4** - Documents & vendors
5. **Phase 5** - People, tasks, meetings, governance
6. **Phase 6** - Data protection (GDPR)
7. **Phase 7** - Assets & snapshots
8. **Phase 8** - Trust center
9. **Phase 9** - Dashboard & navigation updates
10. **Phase 10** - Polish & advanced features

Each phase includes: migrations, models, factories, seeders, controllers, form requests, policies, Inertia pages, and Pest tests.

---

## Shared UI Patterns

All list pages follow the same pattern:
- Page heading with "Create" button
- Searchable/filterable data table
- Status badges with color coding
- Pagination

All show pages follow:
- Breadcrumb navigation
- Heading with edit/delete actions
- Tabbed content for related entities
- Relationship management (attach/detach)

All form pages follow:
- Card-based form layout
- Inertia form handling with validation errors
- Select/multiselect for relationships
- Cancel/Save buttons
