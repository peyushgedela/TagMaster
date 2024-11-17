import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { MaterialIcons } from "@expo/vector-icons";
import AWS from "aws-sdk";

// Configure AWS
AWS.config.update({
  region: "us-east-1", // Replace with your AWS region
  credentials: new AWS.Credentials({
    accessKeyId: "id", // Replace with your access key
    secretAccessKey: "key", // Replace with your secret key
  }),
});

// Initialize Rekognition service
const rekognition = new AWS.Rekognition();

interface Label {
  name: string;
  confidence: number;
}

export default function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [labels, setLabels] = useState<Label[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Request permissions when component mounts
    (async () => {
      const { status: libraryStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();

      if (libraryStatus !== "granted" || cameraStatus !== "granted") {
        Alert.alert(
          "Permissions Required",
          "Please grant camera and media library permissions to use this app."
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setLabels(null); // Clear previous labels
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image from library.");
      console.error(error);
    }
  };

  const captureImage = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        setLabels(null); // Clear previous labels
      }
    } catch (error) {
      Alert.alert("Error", "Failed to capture image.");
      console.error(error);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setLabels(null);

      // Fetch the image as a Blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      // Convert blob to ArrayBuffer using FileReader
      const buffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      });

      const imageBytes = new Uint8Array(buffer as ArrayBuffer);

      // Prepare parameters for Rekognition
      const rekognitionParams = {
        Image: {
          Bytes: imageBytes,
        },
        MaxLabels: 10, // Limit the number of labels returned
        MinConfidence: 70, // Only return labels with confidence > 70%
      };

      // Call Rekognition API
      const rekognitionResponse = await rekognition
        .detectLabels(rekognitionParams)
        .promise();
      console.log("Rekognition Response:", rekognitionResponse);

      // Process and format the labels
      if (rekognitionResponse.Labels) {
        const labelsData = rekognitionResponse.Labels.map((label) => ({
          name: label.Name || "Unknown",
          confidence: label.Confidence || 0,
        }));
        setLabels(labelsData);
      } else {
        throw new Error("No labels detected in the image.");
      }
    } catch (error) {
      console.error("Recognition error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to analyze the image.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">TagMaster</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Add Image, Get Labels</ThemedText>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        )}

        <ThemedView style={styles.optionspane}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={pickImage}
            disabled={loading}
          >
            <ThemedText>
              <MaterialIcons size={20} name="image" color="#fff" />
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={captureImage}
            disabled={loading}
          >
            <ThemedText>
              <MaterialIcons size={20} name="camera" color="#fff" />
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity
          style={[
            styles.uploadButton,
            { opacity: loading || !selectedImage ? 0.7 : 1 },
          ]}
          onPress={uploadImage}
          disabled={loading || !selectedImage}
        >
          <ThemedText style={styles.addButtonText}>
            {loading ? "Analyzing..." : "Analyze Image"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {loading && <ActivityIndicator size="large" color="#007BFF" />}

      {labels && labels.length > 0 && (
        <ScrollView style={styles.labelsContainer}>
          <ThemedText type="subtitle">Detected Labels:</ThemedText>
          {labels.map((label, index) => (
            <ThemedText key={index} style={styles.labelText}>
              {label.name} ({label.confidence.toFixed(1)}%)
            </ThemedText>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    padding: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 30,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  addButton: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "#007BFF",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 10,
    elevation: 5,
  },
  uploadButton: {
    height: 50,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePreview: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  optionspane: {
    flexDirection: "row",
    alignSelf: "center",
  },
  labelsContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: "rgba(0,123,255,0.1)",
  },
  labelText: {
    fontSize: 16,
    marginVertical: 4,
  },
});
