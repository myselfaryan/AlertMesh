# AlertMesh

An offline-first, peer-to-peer emergency communication system designed for disaster-prone areas with no internet connectivity. Built with modern React UI and Go backend using libp2p networking.

**Demo video**
    
[outfile.webm](https://github.com/user-attachments/assets/7940c3cd-d245-44ee-961d-6ce7953df8fa)

## 🌟 Key Features

### 💬 Modern Chat Interface
- **Real-time messaging** with peer-to-peer communication
- **Message status indicators** (sent, delivered, failed)
- **User avatars** and timestamps
- **Emergency message highlighting** with priority indicators
- **Date dividers** for better message organization

### 🚨 Emergency Features
- **Emergency mode toggle** with visual alerts
- **Quick emergency templates** (Medical, Fire, Rescue, Shelter)
- **Location sharing** with GPS coordinates
- **Emergency broadcast** to all connected peers
- **Priority message routing** for urgent communications

### 👥 User Management
- **Connected users sidebar** with online status
- **User presence indicators** (online, away, offline)
- **Emergency user highlighting** when in crisis
- **Real-time user count** in header

### 📱 Mobile-First Design
- **Progressive Web App (PWA)** capabilities
- **Responsive design** for all screen sizes
- **Touch-optimized interface** for mobile devices
- **Offline-first architecture** with service worker caching
- **Native app-like experience** on mobile devices

### 🎨 Modern UI/UX
- **Smooth animations** with Framer Motion
- **Dark theme** optimized for emergency situations
- **Accessibility features** with proper focus management
- **Toast notifications** for user feedback
- **Gradient backgrounds** that change based on emergency mode

## What's the need for this?
In areas hit with natural disasters, internet connectivity is often lost. This system allows any number of devices (rescue teams, civilians, emergency responders) to communicate with each other as long as they are connected to the same network via WiFi/hotspot/ethernet LAN.

## How does this work?
It uses [libp2p-go](https://github.com/libp2p/go-libp2p) library to establish peer-to-peer connections.
Creates a Chat Room abstraction, allowing multiple users to communicate in real-time.
Requires a known connection string or roomName to connect to the specific room.

Defined in `/cmd/alertmesh/main.go`:

```go
roomFlag := flag.String("room", "chat-room", "name of chat room to join")
```

## How does it discover peers/other devices when offline?
It uses **MDNS (Multicast DNS)** to discover peers in the same LAN network.
Implementation is in `/internal/p2p/mdns.go`

**MDNS Explanation:**
> Multicast DNS (mDNS) is a computer networking protocol that resolves hostnames to IP addresses within small networks that do not include a local name server. It is a zero-configuration service, using essentially the same programming interfaces, packet formats and operating semantics as unicast Domain Name System (DNS).

## 📎 Architecture Overview

### Backend Components
- **`/cmd/alertmesh/main.go`** - Main server file that creates the host, discovers peers and handles HTTP API
- **`/cmd/alertmesh/logs.txt`** - Message logs for recovery and backup
- **`/internal/p2p/host.go`** - Creates the libp2p host on specified port
- **`/internal/p2p/mdns.go`** - MDNS implementation for peer discovery
- **`/internal/p2p/pubsub.go`** - Chat room and PubSub implementation using libp2p
- **`/cmd/node/main.go`** - Testing utility for direct peer connections

### Frontend Components
- **`/frontend/src/components/`** - Modern React components with TypeScript
- **`/frontend/src/hooks/`** - Custom React hooks for state management
- **`/frontend/src/utils/`** - Utility functions for formatting and API calls
- **`/frontend/src/types/`** - TypeScript type definitions

## 🎨 Modern Frontend UI
- **Built with React 19** and TypeScript for type safety
- **Tailwind CSS** for modern, responsive styling
- **Framer Motion** for smooth animations and transitions
- **Heroicons** for consistent iconography
- **PWA-enabled** for mobile app-like experience
- **Real-time updates** with optimistic UI updates
- **Emergency-focused design** with crisis-appropriate color schemes

![Modern UI](ui.png)

## 🚀 Quick Start Guide

### Prerequisites
- **Go 1.19+** for backend
- **Node.js 18+** and npm for frontend
- **Same WiFi network** for all devices

### 🎨 Frontend Setup
```bash
cd frontend/
npm install
npm run dev
```
The frontend will be available at `http://localhost:5173`

### 🔧 Backend Setup

#### Start the main host (with HTTP API for frontend)
```bash
cd cmd/alertmesh/
go run main.go --port 9000 --same_string emergency-net --room disaster-room --nick "Rescue-Team-1" --enable-http true
```

#### Connect additional peers
```bash
# Terminal 2 (or different device)
go run main.go --port 9001 --same_string emergency-net --room disaster-room --nick "Civilian-1"

# Terminal 3 (or different device) 
go run main.go --port 9002 --same_string emergency-net --room disaster-room --nick "Volunteer-1"
```

### 🛠️ Command Line Flags

| Flag | Description | Required |
|------|-------------|----------|
| `--port` | Port for the libp2p host | Yes |
| `--same_string` | Network discovery identifier (must match across peers) | Yes |
| `--nick` | Display name for the user | Yes |
| `--room` | Chat room name (must match across peers) | Yes |
| `--enable-http` | Enable HTTP API for frontend (only needed once) | No |

### 📱 Mobile PWA Installation
1. Open the frontend URL on your mobile device
2. Tap the browser menu and select "Add to Home Screen"
3. The app will install as a native-like application
4. Works offline once installed!

## 🔄 Usage Flow
1. **Start the backend** with HTTP enabled on one device
2. **Start additional peers** on other devices (same network)
3. **Open the frontend** in any web browser
4. **Start communicating** through the modern UI
5. **Use emergency features** when needed:
   - Toggle emergency mode for priority messages
   - Use quick emergency templates
   - Share location with GPS coordinates
   - Send emergency broadcasts

## 🖼️ Screenshots

### Normal Chat Mode
Clean, modern interface with real-time messaging and user management.

### Emergency Mode
Red-themed interface with emergency features prominently displayed.

### Mobile Experience
Fully responsive design that works seamlessly on smartphones and tablets.

## 🔧 Technical Stack

### Backend
- **Go** - High-performance backend language
- **libp2p** - Peer-to-peer networking library
- **Gorilla Mux** - HTTP routing
- **MDNS** - Zero-configuration peer discovery

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **Heroicons** - Beautiful hand-crafted SVG icons
- **React Hot Toast** - Notifications system

## 🌍 Network Requirements
- All devices must be on the **same local network**
- **WiFi hotspot**, **Ethernet LAN**, or **Ad-hoc network** 
- **No internet connection required** for operation
- **Port 9000-9999** should be available for libp2p hosts
- **Port 3001** for HTTP API (frontend-backend communication)

## 🔒 Security Considerations
- Messages are transmitted in **plain text** within the local network
- **No end-to-end encryption** (add if needed for sensitive communications)
- **Network isolation** provides basic security through local-only communication
- Consider adding **message signing** for authenticity verification

## 🚑 Emergency Use Cases
- **Natural disasters** (earthquakes, floods, hurricanes)
- **Infrastructure failures** (power outages, network failures)
- **Search and rescue operations**
- **Community emergency coordination**
- **Disaster relief coordination**
- **Remote area communications**

## 🔍 Troubleshooting

### Common Issues
- **Peers not connecting**: Ensure all devices use the same `--same_string` and `--room` values
- **Frontend not loading**: Check that backend is running with `--enable-http true`
- **Messages not syncing**: Verify all peers are on the same local network
- **Mobile issues**: Try installing as PWA or clearing browser cache

### Debug Steps
1. Check that all devices are on the same network
2. Verify firewall allows the specified ports
3. Ensure the backend logs show peer discovery messages
4. Test with browser developer tools for API errors

## 🚀 Future Enhancements
- 🔐 End-to-end message encryption
- 📋 File and image sharing
- 🌍 Offline message queuing
- 📍 Advanced location features with maps
- 🔊 Voice message support
- 📊 Network topology visualization
- ⚙️ Admin controls and user management
- 🔔 Custom notification sounds

