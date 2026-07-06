import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const RED = '#CD3131';
const PIN_SIZE = 28;

type PokeballPinProps = {
  selected?: boolean;
};

export function PokeballPin({ selected = false }: PokeballPinProps) {
  const size = selected ? PIN_SIZE + 4 : PIN_SIZE;
  const ringColor = selected ? '#173EA5' : '#ffffff';

  return (
    <View
      style={{
        width: size + 8,
        height: size + 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 3,
        elevation: 4,
      }}>
      <View
        style={{
          width: size + 6,
          height: size + 6,
          borderRadius: (size + 6) / 2,
          borderWidth: selected ? 2 : 1.5,
          borderColor: ringColor,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
          <Path
            d="M14 24.5C19.799 24.5 24.5 19.799 24.5 14C24.5 8.20101 19.799 3.5 14 3.5C8.20101 3.5 3.5 8.20101 3.5 14C3.5 19.799 8.20101 24.5 14 24.5Z"
            fill="#fff"
            stroke="#333"
            strokeWidth={1.2}
          />
          <Path
            d="M24.5 14C24.5 11.8783 23.6571 9.84344 22.1421 8.32843C20.6272 6.81342 18.5924 5.97059 16.4706 5.97059H14V14H24.5Z"
            fill={RED}
          />
          <Path
            d="M3.5 14C3.5 16.1217 4.34286 18.1566 5.85786 19.6716C7.37287 21.1866 9.40762 22.0294 11.5294 22.0294H14V14H3.5Z"
            fill="#fff"
            stroke="#333"
            strokeWidth={0.8}
          />
          <Path d="M3.5 14H24.5" stroke="#333" strokeWidth={1.2} />
          <Circle cx={14} cy={14} r={3.5} fill="#fff" stroke="#333" strokeWidth={1.2} />
          <Circle cx={14} cy={14} r={1.5} fill="#eee" />
        </Svg>
      </View>
    </View>
  );
}
