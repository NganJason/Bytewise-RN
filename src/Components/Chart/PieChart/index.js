import React, { useState } from 'react';
import { View } from 'react-native';
import { colors } from './colors';
import { PieChartMain } from './main';

export const PieChart = props => {
  const radius = props.radius || 120;
  const extraRadiusForFocused = props.extraRadiusForFocused || radius / 10;
  const pi = props.semiCircle ? Math.PI / 2 : Math.PI;
  const [selectedIndex, setSelectedIndex] = useState(
    props.data.findIndex(item => item.focused === true),
  );
  let startAngle = props.initialAngle || (props.semiCircle ? -pi : 0);
  let total = 0;
  props.data.forEach(item => {
    total += item.value;
  });
  if (selectedIndex !== 0) {
    let start = 0;
    for (let i = 0; i < selectedIndex; i++) {
      start += props.data[i].value;
    }
    startAngle += (2 * pi * start) / total;
  }
  return (
    <View
      style={{
        height: (radius + extraRadiusForFocused) * 2,
        width: (radius + extraRadiusForFocused) * 2,
        justifyContent: 'center',
      }}>
      {!(
        props.data.length <= 1 ||
        !(props.focusOnPress || props.sectionAutoFocus) ||
        selectedIndex === -1
      ) && (
        <View
          style={{
            position: 'absolute',
            top: -extraRadiusForFocused,
            left: -extraRadiusForFocused,
          }}>
          <PieChartMain
            {...props}
            data={[
              {
                value: props.data[selectedIndex].value,
                color:
                  props.data[selectedIndex].color || colors[selectedIndex % 9],
                strokeColor: props.data[selectedIndex].strokeColor || null,
                strokeWidth: props.data[selectedIndex].strokeWidth || null,
                gradientCenterColor:
                  props.data[selectedIndex].gradientCenterColor || null,
              },
              {
                value: total - props.data[selectedIndex].value,
                peripheral: true,
                strokeWidth: 0,
              },
            ]}
            radius={radius + extraRadiusForFocused}
            initialAngle={startAngle}
            showText={false}
            innerRadius={props.innerRadius || radius / 2.5}
            isBiggerPie
            setSelectedIndex={setSelectedIndex}
          />
        </View>
      )}
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <PieChartMain
          {...props}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      </View>
    </View>
  );
};
