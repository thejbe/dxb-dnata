# DXB Accessibility Support Demo

A comprehensive accessibility assistance platform for Dubai International Airport (DXB) and Emirates, providing seamless support coordination for passengers with accessibility needs.

## 🌟 Overview

This demo showcases a professional accessibility support system that guides passengers through:
- **Comprehensive intake process** with ticket scanning/manual entry
- **Detailed service assessment** (check-in, security, boarding assistance)
- **Terminal comfort preferences** with real DXB Terminal 3 locations
- **Multi-stage accessibility evaluation** covering mobility, sensory, and cognitive needs
- **Professional confirmation sequence** with detailed summaries
- **Coordination with airport and airline teams**

## ✈️ Features

### 🎫 Passenger Onboarding
- **Smart ticket processing** with Emirates boarding pass simulation
- **Photo upload capability** with realistic ticket extraction
- **Manual entry alternative** for accessibility

### 🛂 Service Customization
- **Check-in assistance** preferences
- **Security support** with priority lane access
- **Boarding assistance** coordination
- **Terminal comfort** selection from real DXB locations

### 🏢 Real DXB Terminal 3 Integration
- **Authentic dining options**: Hard Rock Café, Cho Gao, Giraffe, Paul Bakery
- **Real bar locations**: O'Regan's Irish Bar, Costa Coffee Bar
- **Emirates Lounge access** with premium amenities
- **Quiet spaces**: Zen Gardens, prayer areas, spa relaxation zones

### ♿ Comprehensive Accessibility Assessment
- **Tiered evaluation**: Sensory, mobility, cognitive impairments
- **Detailed mobility support**: Wheelchair needs, transfer assistance
- **Airport team briefing** with specific requirements
- **Emirates cabin crew coordination** for in-flight support

### 📋 Professional Confirmation System
- **4-stage confirmation sequence**
- **Detailed passenger information summary**
- **Airport team coordination details**
- **Cabin crew briefing information**
- **Complete service overview**

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory
cd "where and when"

# Install dependencies
npm install

# Start the server
npm start
```

The application will be available at `http://localhost:3000`

## 🛠️ Technical Stack

- **Backend**: Node.js with Express
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Real-time Communication**: Socket.IO (ready for future enhancements)
- **Database**: SQLite (in-memory for demo)
- **Styling**: Modern CSS with accessibility focus

## 📱 Application Structure

### Main Interface Tabs
1. **International** - QR code entry point with Emirates branding
2. **Passenger Chat** - Main accessibility support flow
3. **Airport View** - DXB operations dashboard
4. **Airline View** - Emirates operations dashboard

### Core Journey Stages
1. **Welcome Message** - Multi-message DXB concierge introduction
2. **Method Selection** - Type details vs photo upload
3. **Flight Confirmation** - Emirates EK15 18:30 DXB→LHR validation
4. **Meeting Point Selection** - 6 realistic DXB Terminal 3 locations
5. **Service Assessment** - Check-in, security, boarding preferences
6. **Terminal Comfort** - Dining, lounge, and quiet space options
7. **Accessibility Evaluation** - Comprehensive multi-stage assessment
8. **Professional Confirmation** - 4-stage summary and team coordination

## 🎯 Demo Flight Details
- **Flight**: Emirates EK15
- **Route**: Dubai (DXB) → London Heathrow (LHR)
- **Departure**: 18:30 (6:30 PM)
- **Date**: Friday, 23rd August 2025
- **Passenger**: Jim Beattie
- **Seat**: 12A
- **Terminal**: DXB Terminal 3

## 🔧 Configuration

### Server Settings
- **Port**: 3000
- **CORS**: Enabled for development
- **Health Check**: `/api/health`
- **Passengers API**: `/api/passengers`

### Key Features
- **Professional timing** with appropriate delays between messages
- **Comprehensive data collection** for accessibility coordination
- **Real DXB locations** for authentic experience
- **Emirates branding** throughout the journey
- **Accessibility-first design** with clear, friendly messaging

## 📞 API Endpoints

- `GET /api/health` - Server health check
- `GET /api/passengers` - Retrieve passenger data
- `POST /api/passengers` - Create passenger record
- Socket.IO events for real-time communication

## 🎨 Design Principles

- **Accessibility-first** approach with clear navigation
- **Professional Emirates branding** with appropriate colors
- **Clear, friendly messaging** suitable for accessibility support
- **Responsive design** for mobile and desktop use
- **Comprehensive information collection** without overwhelming users

## 🚀 Future Enhancements

- **Real-time staff coordination** with live updates
- **Multi-language support** for international passengers
- **Integration with airline systems** for live flight data
- **Advanced accessibility features** like voice navigation
- **Mobile app development** for on-the-go access

## 📄 License

This demo is created for presentation purposes and showcases accessibility support capabilities for Dubai International Airport and Emirates.

---

**Built with accessibility and user experience at the forefront** 🌟