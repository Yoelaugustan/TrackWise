import { CategoryType, ExpenseCategoriesType, IncomeCategoriesType } from "@/types";
import { colors } from "./theme";

import * as Icons from "phosphor-react-native";

export const expenseCategories: ExpenseCategoriesType = {
    groceries: {
        label: "Groceries",
        value: "groceries",
        icon: Icons.ShoppingCart,
        bgColor: '#4B5563'
    },
    rent: {
        label: "Rent",
        value: "rent",
        icon: Icons.House,
        bgColor: '#075985'
    },
    utilities: {
        label: "Utilities",
        value: "utilities",
        icon: Icons.Lightbulb,
        bgColor: '#ca8a04'
    },
    transportation: {
        label: "Transportation",
        value: "transportation",
        icon: Icons.Car,
        bgColor: '#b45309'
    },
    entertainment: {
        label: "Entertainment",
        value: "entertainment",
        icon: Icons.FilmStrip,
        bgColor: '#0f766e'
    },
    social: {
        label: "Social",
        value: "social",
        icon: Icons.Cheers,
        bgColor: '#FFB343'
    },
    subscription: {
        label: "Subscription",
        value: "subscription",
        icon: Icons.CurrencyBtc,
        bgColor: '#22C55E'
    },
    food: {
        label: "Food",
        value: "food",
        icon: Icons.ForkKnife,
        bgColor: '#be185d'
    },
    health: {
        label: "Health",
        value: "health",
        icon: Icons.Heart,
        bgColor: '#e11d48'
    },
    insurance: {
        label: "Insurance",
        value: "insurance",
        icon: Icons.ShieldCheck,
        bgColor: '#11d925'
    },
    investments: {
        label: "Investments",
        value: "investments",
        icon: Icons.Bank,
        bgColor: '#EFBF04'
    },
    saving: {
        label: "Saving",
        value: "saving",
        icon: Icons.PiggyBank,
        bgColor: '#ff5eda'
    },
    clothing: {
        label: "Clothing",
        value: "clothing",
        icon: Icons.TShirt,
        bgColor: '#7c3aed'
    },
    personal: {
        label: "Personal",
        value: "personal",
        icon: Icons.User,
        bgColor: colors.black
    },
    others: {
        label: "Others",
        value: "others",
        icon: Icons.DotsThreeOutline,
        bgColor: "#525252"
    }
}

export const incomeCategories: IncomeCategoriesType = {
    income: {
        label: "Salary",
        value: "Salary",
        icon: Icons.Briefcase,
        bgColor: "#0EA5E9"
    },
    bonus: {
        label: "Bonus",
        value: "Bonus",
        icon: Icons.TipJar,
        bgColor: "#EAB308"
    },
    investment: {
        label: 'Investment',
        value: 'investment',
        icon: Icons.ChartLineUp,
        bgColor: '#16A34A',
    },
    part_time: {
        label: 'Part-Time',
        value: 'part_time',
        icon: Icons.Clock,
        bgColor: '#9333EA',
    },   
}

export const transactionTypes = [
    {label: "Expense", value: "expense"},
    {label: "Income", value: "Income"},
]