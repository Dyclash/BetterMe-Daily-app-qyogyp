
// This file is a fallback for using MaterialIcons on Android and web.

import React from "react";
import { SymbolWeight } from "expo-symbols";
import {
  OpaqueColorValue,
  StyleProp,
  TextStyle,
  ViewStyle,
  Image,
  View,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  ios_icon_name = undefined,
  android_material_icon_name,
  size = 24,
  color,
  style,
  image_source,
}: {
  ios_icon_name?: string | undefined;
  android_material_icon_name?: keyof typeof MaterialIcons.glyphMap;
  size?: number;
  color?: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
  image_source?: any;
}) {
  // If image_source is provided, render an Image instead
  if (image_source) {
    return (
      <View style={[{ width: size, height: size }, style]}>
        <Image
          source={image_source}
          style={{
            width: size,
            height: size,
            resizeMode: 'contain',
          }}
        />
      </View>
    );
  }

  // Fallback to MaterialIcons
  return (
    <MaterialIcons
      color={color}
      size={size}
      name={android_material_icon_name!}
      style={style as StyleProp<TextStyle>}
    />
  );
}
