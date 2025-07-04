<div align="center">
  <h1 style="color: #1298cb;">x47PropCalc</h1>
  <p>A powerful trade size calculator and journal for traders</p>
  <img src="https://img.shields.io/badge/React%20Native-Expo-blue?logo=react" alt="React Native with Expo" />
  <img src="https://img.shields.io/badge/Styling-NativeWind-%231c8ab6" alt="NativeWind" />
  <img src="https://img.shields.io/badge/Deployment-EAS-%2378d2f5" alt="Expo Application Services" />
</div>

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Development Stack](#development-stack)
- [Project Milestones](#project-milestones)
- [Installation](#installation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview
x47PropCalc is a **trade size calculator** designed for traders to customize parameters specific to various companies, ensuring accurate trade size calculations. Beyond calculations, it allows users to save trades, log timestamps, and receive notifications when profit or loss targets are met. The app doubles as a **trade journal**, enabling users to add notes post-trade. Future features may include generating downloadable Profit and Loss (PnL) cards and importing trades from an MT5 account with proprietary trading firms.

<div style="background-color: #78d2f5; padding: 10px; border-radius: 5px; color: #1c8ab6;">
  <strong>Why x47PropCalc?</strong> Streamline your trading process with precise calculations, seamless trade tracking, and intuitive journaling—all in one mobile app.
</div>

## Features
- 📏 **Customizable Trade Size Calculator**: Adjust parameters for different companies to get accurate trade sizes.
- 💾 **Trade Saving**: Store trades with timestamps for future reference.
- 🔔 **Notifications**: Get alerted when profit or loss targets are reached.
- 📝 **Trade Journal**: Add notes to completed trades for analysis and record-keeping.
- 🔜 **Planned Features**:
  - Generate and download PnL cards as images.
  - Import trades from MT5 accounts (prop firm integration).

## Development Stack
- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Frontend**: JavaScript/TypeScript, React Native components
- **Notifications**: Expo Notifications
- **Data Storage**: Local storage (e.g., AsyncStorage) or integration with a backend/database (TBD)
- **Optional Integrations**:
  - MT5 API (for importing trades from prop firm accounts, if implemented)
  - Image generation library (e.g., react-native-view-shot for PnL card downloads)
- **Development Tools**: Expo CLI, Visual Studio Code, or similar IDE
- **Deployment**: Expo Application Services (EAS) for building and deploying

## Project Milestones
| Task | Status | Points |
|------|--------|--------|
| Read external interface (e.g., Market API) | ❌ Pending | 2 |
| Use multiple activities or views | ❌ Pending | 1 |
| Communication between activities/views | ❌ Pending | 1 |
| Use persistent local storage | ❌ Pending | 2 |
| Implement background operations (e.g., Services, Notifications) | ❌ Pending | 4 |
| Use custom animations (e.g., Sprites, Path Tracking) | ❌ Pending | 2 |
| Use a specific app icon | ❌ Pending | 1 |

**Legend**: ✅ Completed / ❌ Pending

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/x47PropCalc.git
   ```

2. Navigate to the project directory:
   ```bash
   cd x47PropCalc
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the Expo development server:
   ```bash
   npx expo start
   ```

5. Scan the QR code with the Expo Go app or run on an emulator.

## Roadmap

- [ ] Implement core trade size calculator logic-Add trade saving and journaling functionality

- [ ] Enable push notifications for profit/loss targets

- [ ] Integrate MT5 API for trade imports (optional)

- [ ] Develop PnL card generation and download feature

- [ ] Design and apply a custom app icon

- [ ] Add custom animations for enhanced UX

## Contributing
Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
