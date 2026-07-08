import { Text } from '@/components/ui/text';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Path } from 'react-native-svg';

const ACTIVE_COLOR = '#173EA5';
const INACTIVE_COLOR = '#808080';
const RED = '#CD3131';

type TabIconProps = {
  color: string;
  active?: boolean;
};

function PokedexIcon({ color, active }: TabIconProps) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Path
        d="M2.16679 12.9999C2.16679 14.4225 2.447 15.8313 2.99143 17.1456C3.53585 18.46 4.33383 19.6542 5.3398 20.6602C6.34577 21.6662 7.54002 22.4642 8.85438 23.0086C10.1687 23.553 11.5775 23.8332 13.0001 23.8332C14.4228 23.8332 15.8315 23.553 17.1459 23.0086C18.4602 22.4642 19.6545 21.6662 20.6604 20.6602C21.6664 19.6542 22.4644 18.46 23.0088 17.1456C23.5532 15.8313 23.8335 14.4225 23.8335 12.9999L13.0001 12.9999H2.16679Z"
        fill={active ? '#fff' : 'transparent'}
      />
      <Path
        d="M23.8333 12.9998C23.8333 11.5772 23.5531 10.1685 23.0087 8.85409C22.4643 7.53973 21.6663 6.34547 20.6603 5.3395C19.6543 4.33354 18.4601 3.53556 17.1457 2.99113C15.8314 2.44671 14.4226 2.16649 13 2.16649C11.5773 2.16649 10.1686 2.44671 8.85425 2.99113C7.53989 3.53556 6.34563 4.33354 5.33966 5.3395C4.33369 6.34547 3.53571 7.53973 2.99129 8.85409C2.44686 10.1685 2.16665 11.5772 2.16665 12.9998L13 12.9998H23.8333Z"
        fill={active ? RED : 'transparent'}
      />
      <Circle cx={13} cy={13} r={3.25} fill={active ? '#fff' : 'transparent'} />
      <G>
        <Path
          d="M13 23.8332C18.9832 23.8332 23.8333 18.9831 23.8333 12.9998C23.8333 7.01658 18.9832 2.16649 13 2.16649C7.01673 2.16649 2.16665 7.01658 2.16665 12.9998C2.16665 18.9831 7.01673 23.8332 13 23.8332Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M12.9999 16.2499C13.8619 16.2499 14.6885 15.9075 15.298 15.298C15.9075 14.6885 16.2499 13.8618 16.2499 12.9999C16.2499 12.1379 15.9075 11.3113 15.298 10.7018C14.6885 10.0923 13.8619 9.74987 12.9999 9.74987C12.1379 9.74987 11.3113 10.0923 10.7018 10.7018C10.0923 11.3113 9.7499 12.1379 9.7499 12.9999C9.7499 13.8618 10.0923 14.6885 10.7018 15.298C11.3113 15.9075 12.1379 16.2499 12.9999 16.2499V16.2499Z"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M2.16665 12.9997H9.74998M16.25 12.9997H23.8333" stroke={color} strokeWidth={1.5} />
      </G>
    </Svg>
  );
}

function MapIcon({ color }: TabIconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 21C15.5 17.4 19 14.1765 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1765 8.5 17.4 12 21Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={10} r={3} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

function FavoriteIcon({ color }: TabIconProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20.25C12 20.25 3.75 14.25 3.75 8.625C3.75 6.59375 5.34375 5 7.375 5C8.90625 5 10.2656 5.84375 12 7.5C13.7344 5.84375 15.0938 5 16.625 5C18.6562 5 20.25 6.59375 20.25 8.625C20.25 14.25 12 20.25 12 20.25Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CameraIcon({ color }: TabIconProps) {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Path
        d="M4 9.5C4 8.39543 4.89543 7.5 6 7.5H8.17157C8.70201 7.5 9.21071 7.28929 9.58579 6.91421L10.4142 6.08579C10.7893 5.71071 11.298 5.5 11.8284 5.5H14.1716C14.702 5.5 15.2107 5.71071 15.5858 6.08579L16.4142 6.91421C16.7893 7.28929 17.298 7.5 17.8284 7.5H20C21.1046 7.5 22 8.39543 22 9.5V18.5C22 19.6046 21.1046 20.5 20 20.5H6C4.89543 20.5 4 19.6046 4 18.5V9.5Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <Circle cx={13} cy={14} r={4} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

const TAB_CONFIG = [
  { name: 'pokedex', label: 'Pokédex', Icon: PokedexIcon },
  { name: 'map', label: null, Icon: MapIcon },
  { name: 'favorite', label: null, Icon: FavoriteIcon },
  { name: 'camera', label: null, Icon: CameraIcon },
] as const;

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="border-t border-[#e6e6e6] bg-white px-8"
      style={{ paddingBottom: insets.bottom, height: 72 + insets.bottom }}>
      <View className="h-[72px] flex-row items-center justify-between">
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[index];
          const color = isFocused ? ACTIVE_COLOR : INACTIVE_COLOR;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="size-14 items-center justify-center"
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}>
              <config.Icon color={color} active={isFocused} />
              {config.label && isFocused ? (
                <Text className="mt-[-2px] text-xs font-medium text-[#173ea5]">{config.label}</Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
