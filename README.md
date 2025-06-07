This Expense Tracker is a React Native mobile app built with Expo. It lets users record and categorize expenses and income, then view month-by-month summaries with interactive pie charts. Authentication and data storage are powered by Supabase (PostgreSQL + Auth + Storage), while file-based routing comes courtesy of Expo Router and charts via react-native-chart-kit.

Features
- Record Transactions: Add expenses or income, assign to custom categories, and specify amounts and dates.

- Monthly Statistics: View a pie chart breakdown of spending or earnings by category 

- Category Management: Predefined expense/income categories with icons and colors; fallback “Others” for uncategorized items.

- Cloud Storage: Upload profile images to Cloudinary (or Supabase Storage).