import { View, Platform, Touchable, TouchableOpacity, StyleSheet } from 'react-native';
import { useIsFocused, useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors, spacingX, spacingY } from '@/constants/theme';
import { verticalScale } from '@/utils/styling';
import * as Icons from 'phosphor-react-native'
import Statistics from '@/app/(tabs)/statistics';
import Profile from '@/app/(tabs)/profile';

export default function CustomTabs({ state, descriptors, navigation }: BottomTabBarProps) {
    const tabbarIcons: any = {
        index: (isFocused: boolean) => (
            <Icons.House
                size={verticalScale(30)}
                weight={isFocused ? 'fill' : 'regular'}
                color={isFocused ? colors.green : colors.black}
            />
        ),
        statistics: (isFocused: boolean) => (
            <Icons.ChartLineUp
                size={verticalScale(30)}
                weight={isFocused ? 'fill' : 'regular'}
                color={isFocused ? colors.green : colors.black}
            />
        ),
        wallet: (isFocused: boolean) => (
            <Icons.Wallet
                size={verticalScale(30)}
                weight={isFocused ? 'fill' : 'regular'}
                color={isFocused ? colors.green : colors.black}
            />
        ),
        profile: (isFocused: boolean) => (
            <Icons.User
                size={verticalScale(30)}
                weight={isFocused ? 'fill' : 'regular'}
                color={isFocused ? colors.green : colors.black}
            />
        )
    }

  return (
    <View style={styles.tabbar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            // href={buildHref(route.name, route.params)}
            key={route.key}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabbarItems}
          >
            {
                tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)
            }
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
    tabbar: {
        flexDirection: 'row',
        width:'100%', 
        height: Platform.OS === 'ios' ? verticalScale(73) : verticalScale(65), 
        backgroundColor: colors.white,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopColor: colors.neutral100,
        borderTopWidth: 1,
    },
    tabbarItems: {
        marginBottom: Platform.OS === 'ios' ? spacingY._10 : spacingY._5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

