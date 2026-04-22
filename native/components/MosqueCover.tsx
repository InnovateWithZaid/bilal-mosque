import { StyleSheet, View, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Path, Rect, Stop } from "react-native-svg";

import { isBuiltInMosqueCover } from "@/lib/covers";
import { colors, gradients, radii } from "@/lib/theme";

type MosqueCoverProps = {
  uri?: string;
  height?: number;
  radius?: number;
  overlay?: "none" | "soft" | "strong";
  style?: ViewStyle;
  children?: React.ReactNode;
};

type CoverPalette = {
  sky: [string, string];
  sun: string;
  domes: string;
  courtyard: string;
  building: string;
  accents: string;
};

const coverPalettes: Record<string, CoverPalette> = {
  "placeholder:azure-dawn": {
    sky: ["#E8F8FF", "#A3D8EF"],
    sun: "#FFF0B2",
    domes: "#F9FDFF",
    courtyard: "#DDEFF6",
    building: "#FDFEFF",
    accents: "#7DB5CA",
  },
  "placeholder:marble-courtyard": {
    sky: ["#EEF7FF", "#BCDFF3"],
    sun: "#FFE5AC",
    domes: "#FEFFFF",
    courtyard: "#E9F4FA",
    building: "#FCFEFF",
    accents: "#8BC0D4",
  },
  "placeholder:sunlit-minaret": {
    sky: ["#EAFBFF", "#9FD4EC"],
    sun: "#FFF3C3",
    domes: "#FCFFFF",
    courtyard: "#D8EAF2",
    building: "#FFFFFF",
    accents: "#76B1C8",
  },
  "placeholder:blue-hour-domes": {
    sky: ["#DEF3FF", "#89C9E6"],
    sun: "#F8EAB0",
    domes: "#F5FBFE",
    courtyard: "#D7EAF3",
    building: "#FBFEFF",
    accents: "#6EA7BF",
  },
};

function MosqueCoverArt({ uri }: { uri?: string }) {
  const palette = coverPalettes[isBuiltInMosqueCover(uri) ? uri : "placeholder:azure-dawn"];

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient colors={palette.sky} style={StyleSheet.absoluteFill} />
      <Svg width="100%" height="100%" viewBox="0 0 360 240" preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFillObject}>
        <Defs>
          <SvgLinearGradient id="marble" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={palette.building} stopOpacity="1" />
            <Stop offset="100%" stopColor="#E7F2F8" stopOpacity="1" />
          </SvgLinearGradient>
          <SvgLinearGradient id="plaza" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={palette.courtyard} stopOpacity="1" />
            <Stop offset="100%" stopColor="#CFE3ED" stopOpacity="1" />
          </SvgLinearGradient>
        </Defs>
        <Circle cx="286" cy="46" r="30" fill={palette.sun} opacity="0.9" />
        <Path d="M0 162H360V240H0Z" fill="url(#plaza)" />
        <Path d="M44 178H316V134H44Z" fill={palette.building} />
        <Path d="M62 178H298V122H62Z" fill="url(#marble)" />
        <Rect x="84" y="122" width="190" height="56" rx="4" fill="url(#marble)" />
        <Circle cx="111" cy="122" r="26" fill={palette.domes} />
        <Circle cx="182" cy="102" r="41" fill={palette.domes} />
        <Circle cx="251" cy="120" r="26" fill={palette.domes} />
        <Rect x="97" y="146" width="18" height="32" fill="#EAF4F8" />
        <Rect x="174" y="140" width="28" height="38" fill="#EAF4F8" />
        <Rect x="248" y="144" width="16" height="34" fill="#EAF4F8" />
        <Path d="M175 178V144C175 132 184 126 189 126C197 126 206 132 206 144V178Z" fill="#D7EAF2" />
        <Path d="M302 178V74H314V178Z" fill={palette.domes} />
        <Path d="M297 76H319V68H297Z" fill={palette.domes} />
        <Circle cx="308" cy="61" r="8" fill={palette.domes} />
        <Path d="M78 178V104H86V178Z" fill="#E6F2F8" />
        <Path d="M74 104H90V98H74Z" fill="#E6F2F8" />
        <Circle cx="82" cy="93" r="5" fill="#E6F2F8" />
        {Array.from({ length: 9 }).map((_, index) => (
          <Rect key={index} x={54 + index * 28} y="156" width="12" height="22" rx="3" fill={palette.accents} opacity="0.18" />
        ))}
        <Path d="M0 198C52 186 105 180 180 180C253 180 308 188 360 200V240H0Z" fill="#D0E4EF" opacity="0.95" />
      </Svg>
    </View>
  );
}

export function MosqueCover({
  uri,
  height = 220,
  radius = radii.xl,
  overlay = "soft",
  style,
  children,
}: MosqueCoverProps) {
  const showImage = Boolean(uri && !isBuiltInMosqueCover(uri));

  return (
    <View style={[styles.container, { height, borderRadius: radius }, style]}>
      {showImage ? <Image source={{ uri }} style={StyleSheet.absoluteFillObject} contentFit="cover" transition={220} /> : <MosqueCoverArt uri={uri} />}
      {overlay === "soft" ? <LinearGradient colors={gradients.hero} style={StyleSheet.absoluteFill} /> : null}
      {overlay === "strong" ? <LinearGradient colors={gradients.heroStrong} style={StyleSheet.absoluteFill} /> : null}
      {children ? <View style={styles.content}>{children}</View> : null}
      <View pointerEvents="none" style={[styles.border, { borderRadius: radius }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 18,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },
});
