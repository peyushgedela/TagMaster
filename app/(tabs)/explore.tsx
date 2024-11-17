import { StyleSheet, Image, Platform } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About</ThemedText>
      </ThemedView>
      <ThemedText>
        This app was made to demonstrate AWS Rekognition in Image Labelling.
      </ThemedText>
      <Collapsible title="Team">
        <ThemedText>
          1. Peyush Gedela - 22BAI1320 {"\n"}
          2. Charanya Jogi - 22BAI1467 {"\n"}
          3. Rupa Sindhu Sri - 22BAI1114 {"\n"}
        </ThemedText>
      </Collapsible>
      <Collapsible title="Course Info">
        <ThemedText>
          Course Title: AWS Solutions Architect {"\n"}
          Course Code: BCSE355L {"\n"}
          Faculty: Dr. Prakash P {"\n"}
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
