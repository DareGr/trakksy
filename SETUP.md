# Quick Setup Guide for SubTrack

## 🚀 Getting Started

Your SubTrack application is now ready to use! Here's what you can do:

### Option 1: Try the Demo (No Setup Required)
1. The app is running at `http://localhost:3002/`
2. Click "view demo" or go directly to `/dashboard`
3. You'll see sample subscription data and can test all features
4. All changes are temporary and stored in memory

### Option 2: Full Setup with Supabase (Recommended for Production)

#### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new account or sign in
3. Create a new project
4. Wait for the project to be ready

#### Step 2: Set Up the Database
1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL to create the subscriptions table and policies

#### Step 3: Configure Environment Variables
1. In your Supabase project, go to Settings > API
2. Copy your project URL and anon public key
3. Create a `.env` file in your project root:
   ```bash
   cp env.example .env
   ```
4. Edit `.env` and add your credentials:
   ```
   VITE_SUPABASE_URL=your_project_url_here
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

#### Step 4: Restart the Development Server
```bash
npm run dev
```

## ✨ Features Available

### Demo Mode (No Supabase)
- ✅ View sample subscriptions
- ✅ Add/edit/delete subscriptions (temporary)
- ✅ Calculate monthly totals
- ✅ Responsive design
- ❌ User authentication
- ❌ Data persistence

### Full Mode (With Supabase)
- ✅ All demo features
- ✅ User registration and login
- ✅ Secure data storage
- ✅ Data persistence across sessions
- ✅ Multi-user support

## 🎯 Next Steps

1. **Try the demo** to see all features in action
2. **Set up Supabase** when you're ready for real data
3. **Customize** the app to your needs
4. **Deploy** to production (Vercel, Netlify, etc.)

## 🛠️ Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📞 Need Help?

- Check the main `README.md` for detailed documentation
- Review the `supabase-schema.sql` for database setup
- All components are well-documented and modular

Enjoy tracking your subscriptions! 🎉 