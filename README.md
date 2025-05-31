# SubTrack - Subscription Tracker

A modern, responsive web application for tracking your monthly subscriptions built with Vue 3, Tailwind CSS, and Supabase.

## ✨ Features

- **User Authentication** - Secure email/password login and registration
- **Subscription Management** - Add, edit, and delete subscriptions
- **Monthly Spend Tracking** - Automatic calculation of total monthly costs
- **Billing Reminders** - Visual indicators for upcoming billing dates
- **Responsive Design** - Mobile-first design that works on all devices
- **Clean UI** - Minimalist interface with modern design principles

## 🚀 Tech Stack

- **Frontend**: Vue 3 (Composition API), Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication)
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd subtrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   
   Create the following table in your Supabase database:
   
   ```sql
   -- Create subscriptions table
   CREATE TABLE subscriptions (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     amount NUMERIC(10,2) NOT NULL,
     billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
     next_billing_date DATE NOT NULL,
     tag TEXT,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

   -- Create policy to allow users to only see their own subscriptions
   CREATE POLICY "Users can only see their own subscriptions" ON subscriptions
     FOR ALL USING (auth.uid() = user_id);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── SubscriptionCard.vue      # Individual subscription display
│   └── AddSubscriptionModal.vue  # Add/edit subscription form
├── pages/
│   ├── Login.vue                 # Login page
│   ├── Register.vue              # Registration page
│   └── Dashboard.vue             # Main dashboard
├── stores/
│   ├── auth.js                   # Authentication store
│   └── subscriptions.js          # Subscriptions store
├── lib/
│   └── supabase.js              # Supabase client configuration
├── router/
│   └── index.js                 # Vue Router configuration
├── App.vue                      # Main app component
├── main.js                      # App entry point
└── style.css                    # Global styles
```

## 🎨 Design System

The app uses a clean, minimalist design with:

- **Colors**: 
  - Primary: Blue (#3B82F6)
  - Background: Light gray (#F9FAFB)
  - Text: Dark gray (#111827)
- **Typography**: Inter font family
- **Components**: Custom Tailwind CSS classes for consistency

## 📱 Features in Detail

### Authentication
- Email/password registration and login
- Secure session management with Supabase Auth
- Protected routes with automatic redirects

### Subscription Management
- Add subscriptions with name, cost, billing cycle, and next billing date
- Edit existing subscriptions
- Delete subscriptions with confirmation
- Optional categorization and notes

### Dashboard
- Total monthly spend calculation (yearly subscriptions converted to monthly)
- Visual cards for each subscription
- Days until next billing with color-coded warnings
- Responsive grid layout

### Smart Features
- Automatic monthly equivalent calculation for yearly subscriptions
- Color-coded billing reminders (red for ≤3 days)
- Form validation and error handling
- Loading states and user feedback

## 🔮 Future Enhancements

- Email notifications for upcoming renewals
- Spending analytics and charts
- Subscription categories and filtering
- Export functionality (PDF/CSV)
- Bank/email integration for automatic detection
- Mobile app with push notifications

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Environment Variables

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help setting up the project, please open an issue on GitHub. 