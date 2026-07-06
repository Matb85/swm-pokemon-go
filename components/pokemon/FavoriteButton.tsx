import { Pressable, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const HEART_PATH =
  'M21.8933 11.0733C21.5528 10.7327 21.1485 10.4624 20.7035 10.2781C20.2586 10.0937 19.7816 9.9988 19.3 9.9988C18.8183 9.9988 18.3414 10.0937 17.8964 10.2781C17.4514 10.4624 17.0471 10.7327 16.7066 11.0733L16 11.78L15.2933 11.0733C14.6055 10.3856 13.6727 9.99915 12.7 9.99915C11.7273 9.99915 10.7944 10.3856 10.1066 11.0733C9.41885 11.7611 9.03245 12.694 9.03245 13.6667C9.03245 14.6394 9.41885 15.5722 10.1066 16.26L10.8133 16.9667L16 22.1533L21.1866 16.9667L21.8933 16.26C22.234 15.9195 22.5042 15.5152 22.6886 15.0703C22.873 14.6253 22.9679 14.1483 22.9679 13.6667C22.9679 13.185 22.873 12.7081 22.6886 12.2631C22.5042 11.8181 22.234 11.4139 21.8933 11.0733V11.0733Z';

type FavoriteButtonProps = {
  isFavorite: boolean;
  onPress: () => void;
};

export function FavoriteButton({ isFavorite, onPress }: FavoriteButtonProps) {
  return (
    <Pressable onPress={onPress} hitSlop={8} accessibilityRole="button">
      <View className="size-8">
        <Svg width={32} height={32} viewBox="0 0 32 32">
          <Circle
            cx={16}
            cy={16}
            r={15.25}
            fill={isFavorite ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'}
            stroke="#fff"
            strokeWidth={1.5}
          />
          <Path
            d={HEART_PATH}
            stroke="#fff"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={isFavorite ? '#fff' : 'none'}
          />
        </Svg>
      </View>
    </Pressable>
  );
}
