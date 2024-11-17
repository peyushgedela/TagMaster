# TagMaster

TagMaster is a cross-platform mobile application built using **React Native** and **Expo** that allows users to upload images and retrieve associated labels using **AWS Rekognition**, a powerful image analysis service. This project demonstrates the integration of serverless AWS technologies to enhance image recognition functionalities.

![Logo](https://github.com/user-attachments/assets/40f4eea9-f68b-4864-a0b3-7f718997279b)

---

## Features

- **Image Capture and Upload**: Capture images directly from the camera or pick them from the device's gallery.
- **AWS Rekognition Integration**: Uses AWS Rekognition to analyze uploaded images and return detected labels with confidence scores.
- **Real-Time Feedback**: Displays results dynamically once the analysis is complete.
- **User-Friendly Interface**: Simple and clean design for seamless user interaction.

---

## Prerequisites

Before running the project, ensure you have the following:

1. **AWS Account**: Set up an AWS account and create the required IAM roles and policies.
2. **IAM Role/Policy**: Grant permissions for Rekognition in your AWS IAM user:
   - `rekognition:DetectLabels`
3. **React Native** and **Expo CLI** installed on your system.
4. Node.js installed (for dependencies).

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-repository/tagmaster.git
   cd tagmaster
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up AWS credentials:
   Replace the placeholder values in the AWS configuration section of the code with your **Access Key** and **Secret Key**:
   ```javascript
   const rekognition = new Rekognition({
       accessKeyId: "YOUR_ACCESS_KEY",
       secretAccessKey: "YOUR_SECRET_KEY",
       region: "YOUR_REGION",
   });
   ```

4. Run the development server:
   ```bash
   expo start
   ```

5. Scan the QR code to run the app on your device.

---

## Usage

1. **Choose or Capture an Image**:
   - Use the app to capture an image from the camera or upload one from the gallery.

2. **Upload Image**:
   - Click the **Upload** button to send the image to AWS Rekognition for processing.

3. **View Results**:
   - The detected labels with confidence percentages will be displayed once Rekognition processes the image.

---

## Technologies Used

- **React Native**: For building the mobile app interface.
- **Expo**: For rapid development and deployment.
- **AWS Rekognition**: For image analysis and label detection.

---

## AWS Rekognition Integration

TagMaster leverages AWS Rekognition's **DetectLabels** API to analyze images. Detected labels include objects, scenes, and activities with confidence scores.

### Example Label Data
```json
[
  {
    "name": "Tree",
    "confidence": 99.87
  },
  {
    "name": "Car",
    "confidence": 97.45
  },
  {
    "name": "Building",
    "confidence": 92.34
  }
]
```

---

## Screenshots

| **Home Screen**                | **Labels Display**               |
|---------------------------------|-----------------------------------|
|   ![HomeScreen](https://github.com/user-attachments/assets/6a436a1d-db25-4a2c-b048-de906fc7c09d) |    ![Labels](https://github.com/user-attachments/assets/e0c8e8ed-6ab4-45f3-b985-e0918ecb55f8) |

---

## Future Enhancements

- Support for Material You theming on Android 12+.
- Advanced image analysis features (e.g., facial recognition, object tracking).
- Multi-language support for app text and labels.
- Offline mode with local image processing.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

With **TagMaster**, identifying objects in images has never been easier! 🚀
