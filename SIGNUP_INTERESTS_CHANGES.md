# Signup & Interests System Changes

## Summary
Updated the signup and interests management system to be role-based, where users select their role at signup and manage interests later in their dashboard.

## Changes Made

### 1. SignupPage.tsx
- **Before**: Users selected multiple interests via checkboxes, and the system inferred their role.
- **After**: Users select one role (Client, Service Provider, Admin) via radio buttons.
- **Interests Storage**:
  - **Admin**: Auto-enrolled with all interests
  - **Service Provider & Client**: Empty string (they add interests later)
- **Status Assignment**:
  - **Service Provider**: "Pending Verification"
  - **Admin**: "Verified"
  - **Client**: "Active"

### 2. SettingsPanel.tsx
- Added role-based interest options:
  - **Admin**: All interests available
  - **Service Provider**: "Become a Tutor", "Become a Service Provider", "Explore Igbo Culture"
  - **Client**: "Request a Language Service", "Find a Tutor", "Explore Igbo Culture"
- Interests are stored as comma-separated strings in the database
- Added visual feedback for Service Providers who select "Become a Tutor"

### 3. TutorsPage.tsx
- **Before**: Queried for `role IN ['Tutor', 'Service Provider']`
- **After**: Queries for `role = 'Service Provider'` with `status = 'Verified'`
- Filters results to show only providers whose `interests` string includes "Become a Tutor"

### 4. User Interface (mockData.tsx)
- Changed `interests` type from `string[]` to `string`
- Interests are now stored as comma-separated values (e.g., "Become a Tutor, Explore Igbo Culture")

## How It Works

### Signup Flow
1. User enters name, email, password
2. User selects role: Client, Service Provider, or Admin
3. Account is created with:
   - Selected role
   - Appropriate status
   - Empty interests (except Admin gets all interests)
4. User is logged in and redirected to dashboard

### Interest Management
1. User navigates to Settings in dashboard
2. Sees interest options based on their role
3. Selects/deselects interests as checkboxes
4. Clicks "Save Changes" to update
5. Interests stored as comma-separated string in database

### Tutors Listing
1. System queries Service Providers with "Verified" status
2. Filters those whose interests include "Become a Tutor"
3. Displays them on the Tutors page

## Testing Guide

### Test Signup
```bash
npm run dev
```

1. **Test Client Signup**:
   - Go to signup page
   - Enter details and select "Client" role
   - Verify account is created with status "Active"
   - Check dashboard loads correctly

2. **Test Service Provider Signup**:
   - Create account with "Service Provider" role
   - Verify status is "Pending Verification"
   - Go to Settings and add "Become a Tutor" interest
   - Save changes
   - Verify interests are saved

3. **Test Admin Signup**:
   - Create account with "Admin" role
   - Verify all interests are pre-selected
   - Verify status is "Verified"
   - Check admin dashboard access

### Test Interest Management
1. Login as any user
2. Navigate to Settings (Dashboard → Settings)
3. Try selecting/deselecting interests
4. Click "Save Changes"
5. Refresh page and verify interests persist
6. Check role-specific interest options display correctly

### Test Tutors Page
1. Create a Service Provider account
2. Go to Settings and select "Become a Tutor"
3. Save changes
4. Change account status to "Verified" in Appwrite console
5. Visit Tutors page
6. Verify the provider appears in the listing
7. Create another Service Provider without "Become a Tutor" interest
8. Verify they don't appear on Tutors page

## Database Migration Notes

If you have existing users in your database, you may need to migrate their `interests` field:

**Before**: `["Interest 1", "Interest 2"]` (array)
**After**: `"Interest 1, Interest 2"` (comma-separated string)

You can run a migration script or manually update records in Appwrite console.

## Role-Based Interest Options

### Admin
- Request a Language Service
- Find a Tutor
- Become a Tutor
- Become a Service Provider
- Explore Igbo Culture

### Service Provider
- Become a Tutor
- Become a Service Provider
- Explore Igbo Culture

### Client
- Request a Language Service
- Find a Tutor
- Explore Igbo Culture

## Future Enhancements

1. **Email verification for Service Providers** before changing status to "Verified"
2. **Admin panel** to manually verify Service Providers
3. **Interest-based dashboard widgets** showing relevant content per interest
4. **Analytics** on which interests are most popular
5. **Notifications** when Service Providers are verified and appear on Tutors page
