# Smart Irrigation Client

Frontend interface for the Smart Irrigation System. This application serves as the control dashboard for monitoring and managing the IoT watering network.

It connects to a centralized server running on a Raspberry Pi to receive real-time updates and dispatch commands to ESP32 microcontrollers.

## Project Ecosystem

This repository acts as the presentation layer. The complete system consists of three distinct parts:

-   **Frontend (This Repo):** React web application for user interaction.
-   **Backend API:** Node.js/Express server handling business logic, scheduling, and websocket connections (hosted on Raspberry Pi) [https://github.com/pruden96/home-watering-system-backend].
-   **IoT Firmware:** C++ code running on ESP32 units for physical valve control and pump [https://github.com/pruden96/home-watering-system-ESP32].

## Features

-   **Real-time Monitoring:** Visualization of current system state (Idle/Watering) using WebSockets.
-   **Manual Control:** Direct interface to trigger or stop watering zones instantly.
-   **Global State Management:** synchronized application state across components using Zustand.
-   **Mobile Design:** Optimized for access via mobile devices only within the local network.

## Tech Stack

-   **Framework:** React + TypeScript
-   **Build Tool:** Vite
-   **State Management:** Zustand
-   **Communication:** Fetch (REST) & Socket.io-client (WebSockets)

## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/pruden96/home-watering-system-frontend.git
    cd home-watering-system-frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration (.env)

Create a `.env` file in the root directory based on the example below. You must point this to your Raspberry Pi / Backend server IP address.

```ini
# .env example
VITE_SERVER_URL=http://localhost:3000
VITE_IRRIGATE_ENDPOINT=/api/control/irrigate
VITE_SCHEDULE_ENDPOINT=/api/control/schedule
VITE_STATUS_ENDPOINT=/api/control/status
VITE_STOP_ENDPOINT=/api/control/irrigation
```

## Contribution

This is a personal project. Feel free to use the code as inspiration for your own smart home projects.
