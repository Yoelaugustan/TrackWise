## Description
This Expense Tracker is a React Native mobile app built with Expo. It lets users record and categorize expenses and income, then view month-by-month summaries with interactive pie charts. Authentication and data storage are powered by Supabase (PostgreSQL + Storage), while file-based routing comes courtesy of Expo Router and charts via react-native-chart-kit.

## Features
- Record Transactions: Add expenses or income, assign to custom categories, and specify amounts and dates.

- Monthly Statistics: View a pie chart breakdown of spending or earnings by category 

- Category Management: Predefined expense/income categories with icons and colors; fallback “Others” for uncategorized items.

- Cloud Storage: Upload profile images to Cloudinary

## Usage
- Run on device/simulator:
  - Scan the QR code in the Expo DevTools with the Expo Go app.
  - Or press i / a in the terminal to launch on iOS Simulator / Android emulator.

- Navigation:
  - Transactions: view, add, edit.
  - Statistics: swipe between months, toggle “Expenses” vs. “Income”.
  - Wallet: view, add, edit.
  - Profile: update avatar and settings.

## Preview in Expo Go

Before installing locally, you can preview the latest published update in Expo Go:

- **Scan QR Code:**  
  ![Preview QR](./assets/images/Expo_QR.png)

- **Or open this link in Expo Go:**  
  https://expo.dev/preview/update?message=Fix%20Route%20Error&updateRuntimeVersion=1.0.0&createdAt=2025-06-08T08%3A12%3A28.545Z&slug=exp&projectId=061d64c8-3c74-453d-a71b-edb77bb0785f&group=3a6d4d8b-6381-4023-98d9-46ca28b6b4e1
