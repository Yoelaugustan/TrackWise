import { ScrollView, StyleSheet, View, Dimensions, TouchableOpacity } from 'react-native'
import React, { useCallback, useState, useMemo } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { colors, spacingX, spacingY, radius } from '@/constants/theme'
import { verticalScale } from '@/utils/styling'
import Typo from '@/components/Typo'
import MonthNavigator from '@/components/MonthNavigator'
import { useTransactionActions } from '@/hooks/useTransactionActions'
import { useFocusEffect } from 'expo-router'
import { TransactionType } from '@/types'
import { expenseCategories, incomeCategories } from '@/constants/data'
import { PieChart } from 'react-native-chart-kit'
import Loading from '@/components/Loading'
import Header from '@/components/Header'
import { useStatisticsData } from '@/hooks/useStatisticData'

const screenWidth = Dimensions.get('window').width

const Statistics = () => {
  
  const [transactions, setTransactions] = useState<TransactionType[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedType, setSelectedType] = useState<'expense' | 'income'>('expense')
  const { selectTransaction, loading } = useTransactionActions()

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const data = await selectTransaction()
        if (data) setTransactions(data)
      })()
    }, [selectTransaction])
  )

  const {
    monthlyTransactions,
    categoryData,
    totalAmount,
    pieChartData,
  } = useStatisticsData(transactions, selectedType, currentDate)

  const prevMonth = () => {
    const m = new Date(currentDate)
    m.setMonth(m.getMonth() - 1)
    setCurrentDate(m)
  }

  const nextMonth = () => {
    const m = new Date(currentDate)
    m.setMonth(m.getMonth() + 1)
    setCurrentDate(m)
  }

  if (loading) {
    return (
      <ScreenWrapper>
        <Loading />
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header title='Statistics' showBackButton={false}/>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.monthNavigatorContainer}>
            <MonthNavigator
              date={currentDate}
              onPrev={prevMonth}
              onNext={nextMonth}
            />
          </View>

          {/* Segmented Control */}
          <View style={styles.segmentedControlContainer}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                selectedType === 'expense' && styles.segmentButtonActive
              ]}
              onPress={() => setSelectedType('expense')}
            >
              <Typo
                size={14}
                fontWeight="500"
                color={selectedType === 'expense' ? colors.white : colors.neutral600}
              >
                Expenses
              </Typo>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                selectedType === 'income' && styles.segmentButtonActive
              ]}
              onPress={() => setSelectedType('income')}
            >
              <Typo
                size={14}
                fontWeight="500"
                color={selectedType === 'income' ? colors.white : colors.neutral600}
              >
                Income
              </Typo>
            </TouchableOpacity>
          </View>

          {/* Pie Chart */}
          {pieChartData.length > 0 ? (
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={screenWidth - 40}
                height={220}
                chartConfig={{
                  backgroundColor: colors.white,
                  backgroundGradientFrom: colors.white,
                  backgroundGradientTo: colors.white,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute={false}
                hasLegend={true}
                avoidFalseZero={true}
              />
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Typo size={16} color={colors.neutral600} style={styles.noDataText}>
                No {selectedType} data for this month
              </Typo>
            </View>
          )}

          {/* Total Amount */}
          {totalAmount > 0 && (
            <View style={styles.totalContainer}>
              <Typo size={18} fontWeight="600" color={colors.black}>
                Total {selectedType === 'expense' ? 'Expenses' : 'Income'}: Rp. {totalAmount.toLocaleString('id-ID')}
              </Typo>
            </View>
          )}

          {/* Category Breakdown */}
          {categoryData.length > 0 && (
            <View style={styles.breakdownContainer}>
              <Typo size={18} fontWeight="600" color={colors.black} style={styles.breakdownTitle}>
                Category Breakdown
              </Typo>
              
              {categoryData.map((item, index) => {
                const percentage = Math.round((item.amount / totalAmount) * 100)
                const IconComponent = item.categoryInfo.icon
                
                return (
                  <View key={item.category} style={styles.categoryItem}>
                    <View style={styles.categoryLeft}>
                      <View style={[styles.categoryIcon, { backgroundColor: item.categoryInfo.bgColor }]}>
                        {IconComponent && (
                          <IconComponent 
                            size={verticalScale(20)} 
                            color={colors.white} 
                            weight="fill"
                          />
                        )}
                      </View>
                      <View style={styles.categoryInfo}>
                        <Typo size={14} fontWeight="500" color={colors.black}>
                          {item.categoryInfo.label}
                        </Typo>
                        <Typo size={12} color={colors.neutral600}>
                          {percentage}% of total
                        </Typo>
                      </View>
                    </View>
                    
                    <Typo size={14} fontWeight="600" color={colors.black}>
                      Rp. {item.amount.toLocaleString('id-ID')}
                    </Typo>
                  </View>
                )
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  )
}

export default Statistics

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  scrollContent: {
    paddingBottom: spacingY._30,
    padding: 2
  },
  monthNavigatorContainer: {
    padding: spacingY._15,
    marginBottom: spacingY._5,
  },
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: radius._17,
    padding: spacingY._15,
    marginBottom: spacingY._20,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noDataContainer: {
    backgroundColor: colors.white,
    borderRadius: radius._17,
    padding: spacingY._40,
    marginBottom: spacingY._20,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noDataText: {
    textAlign: 'center',
  },
  totalContainer: {
    backgroundColor: colors.white,
    borderRadius: radius._17,
    padding: spacingY._20,
    marginBottom: spacingY._20,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownContainer: {
    backgroundColor: colors.white,
    borderRadius: radius._17,
    padding: spacingY._20,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownTitle: {
    marginBottom: spacingY._15,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacingY._12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral100,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: verticalScale(36),
    height: verticalScale(36),
    borderRadius: radius._10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacingX._12,
  },
  categoryInfo: {
    flex: 1,
    gap: 2,
  },
  segmentedControlContainer: {
    backgroundColor: colors.neutral100,
    borderRadius: radius._12,
    padding: 4,
    marginBottom: spacingY._20,
    flexDirection: 'row',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: spacingY._12,
    borderRadius: radius._10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: colors.green,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
})