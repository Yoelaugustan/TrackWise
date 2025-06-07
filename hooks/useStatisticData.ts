// src/hooks/useStatisticsData.ts
import { useMemo } from 'react'
import { TransactionType } from '@/types'
import { expenseCategories, incomeCategories } from '@/constants/data'
import { colors } from '@/constants/theme'

export function useStatisticsData(
  transactions: TransactionType[],
  selectedType: 'expense' | 'income',
  currentDate: Date,
) {
  const monthlyTransactions = useMemo(
    () =>
      transactions.filter(tx => {
        if (tx.type !== selectedType) return false
        const d = new Date(tx.date)
        return (
          d.getFullYear() === currentDate.getFullYear() &&
          d.getMonth() === currentDate.getMonth()
        )
      }),
    [transactions, selectedType, currentDate],
  )

  const categoriesMap = selectedType === 'expense'
    ? expenseCategories
    : incomeCategories

  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {}
    monthlyTransactions.forEach(tx => {
      const key = tx.category ?? 'others'
      totals[key] = (totals[key] || 0) + Number(tx.amount)
    })

    return Object.entries(totals)
      .map(([category, amount]) => {
        const info = categoriesMap[category as keyof typeof categoriesMap]
                      || categoriesMap.others
        return { category, amount, categoryInfo: info }
      })
      .sort((a, b) => b.amount - a.amount)
  }, [monthlyTransactions, categoriesMap])

  const totalAmount = useMemo(
    () => categoryData.reduce((sum, x) => sum + x.amount, 0),
    [categoryData],
  )

  const pieChartData = useMemo(
    () =>
      categoryData.map(item => ({
        name: item.categoryInfo.label,
        population: Math.round((item.amount / totalAmount) * 100),
        color: item.categoryInfo.bgColor,
        legendFontColor: colors.black,
        legendFontSize: 12,
      })),
    [categoryData, totalAmount],
  )

  return { monthlyTransactions, categoryData, totalAmount, pieChartData }
}
