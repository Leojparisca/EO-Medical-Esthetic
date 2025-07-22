# EO - Clínica Estética

This is a Next.js application for an aesthetic clinic built with Supabase as the backend.

## Features

- **User Authentication**: Sign up, sign in, and profile management with Supabase Auth
- **Treatment Catalog**: Browse available aesthetic treatments
- **Appointment Booking**: Schedule appointments with real-time availability
- **Medical History**: Complete and manage medical history forms
- **Profile Management**: Update personal information and avatar
- **Loyalty Program**: Track loyalty points and rewards
- **Responsive Design**: Mobile-first design with dark/light theme support

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: React Context API
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database Setup

1. Create a new Supabase project
2. Run the migration files in the `supabase/migrations/` directory in your Supabase SQL editor
3. Enable Row Level Security (RLS) on all tables
4. Create the storage bucket for avatars

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Schema

### Tables

- **profiles**: User profile information linked to Supabase Auth
- **treatments**: Available aesthetic treatments
- **appointments**: User appointment bookings
- **treatment_history**: Past treatments received
- **medical_history**: User medical information and consent

### Storage

- **avatars**: User profile pictures

## Key Features Implementation

### Authentication
- Uses Supabase Auth with email/password
- Automatic profile creation on user registration
- Protected routes with middleware

### Real-time Data
- All data is fetched from Supabase in real-time
- Optimistic updates for better UX
- Error handling and loading states

### File Upload
- Avatar upload to Supabase Storage
- Image optimization and public URL generation

### Security
- Row Level Security (RLS) policies
- Users can only access their own data
- Public read access for treatments

## Project Structure

```
src/
├── app/                    # Next.js app router pages
├── components/             # Reusable UI components
│   ├── features/          # Feature-specific components
│   ├── providers/         # Context providers
│   └── ui/               # shadcn/ui components
├── lib/                   # Utility functions and configurations
│   ├── supabase/         # Supabase client and queries
│   └── types.ts          # TypeScript type definitions
└── hooks/                 # Custom React hooks
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.