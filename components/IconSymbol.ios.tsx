
import { SymbolView, SymbolViewProps, SymbolWeight } from "expo-symbols";
import { StyleProp, ViewStyle, Image, View } from "react-native";

export function IconSymbol({
  ios_icon_name,
  android_material_icon_name,
  size = 24,
  color,
  style,
  weight = "regular",
  image_source,
}: {
  ios_icon_name?: SymbolViewProps["name"];
  android_material_icon_name?: any;
  size?: number;
  color?: string;
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

  // Fallback to SymbolView
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={ios_icon_name!}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
