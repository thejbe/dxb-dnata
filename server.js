const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname), {
  setHeaders: (res, path) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  }
}));

// Database initialization
const db = new sqlite3.Database(':memory:');

// Initialize database tables
db.serialize(() => {
  // Conversations table
  db.run(`CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    passenger_name TEXT,
    journey_stage TEXT,
    accessibility_needs TEXT,
    flight_info TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Messages table
  db.run(`CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT,
    sender TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(conversation_id) REFERENCES conversations(id)
  )`);

  // Passengers table for dashboard views
  db.run(`CREATE TABLE passengers (
    id TEXT PRIMARY KEY,
    name TEXT,
    flight TEXT,
    destination TEXT,
    gate TEXT,
    departure TEXT,
    needs TEXT,
    status TEXT,
    meeting_location TEXT,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Insert sample passenger data
  const samplePassengers = [
    {
      id: uuidv4(),
      name: 'Sarah Johnson',
      flight: 'EK 789',
      destination: 'ALC',
      gate: 'B7',
      departure: '18:30',
      needs: JSON.stringify(['Wheelchair', 'Priority Boarding']),
      status: 'confirmed',
      meeting_location: 'Assistance Desk',
      phone: '+44 7123 456789'
    },
    {
      id: uuidv4(),
      name: 'Michael Chen',
      flight: 'VS 456',
      destination: 'LAX',
      gate: 'A12',
      departure: '16:45',
      needs: JSON.stringify(['Visual Impairment', 'Guide Dog']),
      status: 'awaiting',
      meeting_location: 'DXB Terminal 3 Assistance Desk',
      phone: '+44 7987 654321'
    },
    {
      id: uuidv4(),
      name: 'Amelia Clarke',
      flight: 'DL 44',
      destination: 'ATL',
      gate: 'C3',
      departure: '18:20',
      needs: JSON.stringify(['Hearing Impairment']),
      status: 'pending',
      meeting_location: 'Information Desk',
      phone: '+44 7555 123456'
    }
  ];

  samplePassengers.forEach(passenger => {
    db.run(`INSERT INTO passengers (id, name, flight, destination, gate, departure, needs, status, meeting_location, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [passenger.id, passenger.name, passenger.flight, passenger.destination, passenger.gate, 
       passenger.departure, passenger.needs, passenger.status, passenger.meeting_location, passenger.phone]
    );
  });
});

// In-memory store for active conversations
const activeConversations = new Map();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', server: 'dxb-server', timestamp: new Date().toISOString() });
});

// Get all passengers for dashboard
app.get('/api/passengers', (req, res) => {
  db.all('SELECT * FROM passengers ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const passengers = rows.map(row => ({
      ...row,
      needs: JSON.parse(row.needs || '[]')
    }));
    
    res.json({ passengers });
  });
});

// Get specific passenger
app.get('/api/passengers/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM passengers WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Passenger not found' });
    }
    
    const passenger = {
      ...row,
      needs: JSON.parse(row.needs || '[]')
    };
    
    res.json({ passenger });
  });
});

// Create or update passenger
app.post('/api/passengers', (req, res) => {
  const { name, flight, destination, gate, departure, needs, status, meeting_location, phone } = req.body;
  const id = uuidv4();
  
  db.run(`INSERT INTO passengers (id, name, flight, destination, gate, departure, needs, status, meeting_location, phone)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, flight, destination, gate, departure, JSON.stringify(needs || []), status, meeting_location, phone],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      res.json({ 
        id: id,
        message: 'Passenger created successfully'
      });
    }
  );
});

// Get conversation history
app.get('/api/conversations/:id/messages', (req, res) => {
  const { id } = req.params;
  
  db.all('SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC', [id], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    res.json({ messages: rows });
  });
});

// Create new conversation
app.post('/api/conversations', (req, res) => {
  const { passenger_name, journey_stage, accessibility_needs, flight_info } = req.body;
  const id = uuidv4();
  
  db.run(`INSERT INTO conversations (id, passenger_name, journey_stage, accessibility_needs, flight_info)
          VALUES (?, ?, ?, ?, ?)`,
    [id, passenger_name, journey_stage, JSON.stringify(accessibility_needs || []), JSON.stringify(flight_info || {})],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Initialize conversation state
      activeConversations.set(id, {
        id: id,
        hasProfile: false,
        userName: passenger_name || '',
        accessibilityNeeds: accessibility_needs || [],
        currentFlight: flight_info || null,
        journeyStage: journey_stage || 'welcome_message',
        lastOptions: null,
        waitingForNumericInput: false,
        confirmedTravel: false,
        preFlightStep: null,
        onFlightStep: null,
        feedbackStep: null,
        feedbackRatings: {},
        feedbackComments: {},
        currentRatingStage: null
      });
      
      res.json({ 
        conversation_id: id,
        message: 'Conversation created successfully'
      });
    }
  );
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-conversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
  });
  
  socket.on('send-message', (data) => {
    const { conversationId, message, sender } = data;
    const messageId = uuidv4();
    
    // Store message in database
    db.run(`INSERT INTO messages (id, conversation_id, sender, content)
            VALUES (?, ?, ?, ?)`,
      [messageId, conversationId, sender, message],
      function(err) {
        if (err) {
          console.error('Error storing message:', err);
          return;
        }
        
        // Broadcast message to conversation participants
        io.to(conversationId).emit('new-message', {
          id: messageId,
          conversation_id: conversationId,
          sender: sender,
          content: message,
          timestamp: new Date().toISOString()
        });
        
        // Generate AI response if message is from user
        if (sender === 'user') {
          setTimeout(() => {
            const aiResponse = generateAIResponse(message, conversationId);
            if (aiResponse) {
              const aiMessageId = uuidv4();
              
              // Store AI response
              db.run(`INSERT INTO messages (id, conversation_id, sender, content)
                      VALUES (?, ?, ?, ?)`,
                [aiMessageId, conversationId, 'bot', aiResponse],
                function(err) {
                  if (err) {
                    console.error('Error storing AI response:', err);
                    return;
                  }
                  
                  // Broadcast AI response
                  io.to(conversationId).emit('new-message', {
                    id: aiMessageId,
                    conversation_id: conversationId,
                    sender: 'bot',
                    content: aiResponse,
                    timestamp: new Date().toISOString()
                  });
                }
              );
            }
          }, 1000 + Math.random() * 2000); // Random delay for more natural feel
        }
      }
    );
  });
  
  socket.on('update-journey-stage', (data) => {
    const { conversationId, journeyStage } = data;
    
    // Update conversation state
    const conversation = activeConversations.get(conversationId);
    if (conversation) {
      conversation.journeyStage = journeyStage;
      activeConversations.set(conversationId, conversation);
      
      // Update database
      db.run('UPDATE conversations SET journey_stage = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [journeyStage, conversationId]);
      
      // Broadcast stage update
      io.to(conversationId).emit('journey-stage-updated', { journeyStage });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Simple AI response generation (placeholder for more sophisticated AI)
function generateAIResponse(message, conversationId) {
  const conversation = activeConversations.get(conversationId);
  if (!conversation) return "I'm sorry, I couldn't find your conversation. Please refresh and try again.";
  
  const msg = message.toLowerCase();
  
  // Handle journey stage specific responses
  if (conversation.journeyStage === 'welcome_message') {
    if (msg.includes('help') || msg.includes('assistance')) {
      return "Welcome! I'm here to help make your journey as smooth as possible. Can you tell me your name and what assistance you might need today?";
    }
  }
  
  if (conversation.journeyStage === 'entry_via_airline') {
    if (!conversation.hasProfile) {
      return `Hello! Welcome to Accessible Aviation assistance. I can see you've been referred by your airline. 

To get started, could you please tell me:
1. Your name
2. Your flight details
3. Any accessibility needs you have

This will help me provide the best possible support for your journey.`;
    }
  }
  
  if (conversation.journeyStage === 'departure_airport') {
    if (msg.includes("i've arrived") || msg.includes("i have arrived") || msg.includes("arrived")) {
      return "Great! I can see you've arrived at the airport. Ahmed from our assistance team will be with you in about 10 minutes. He'll be wearing a high-vis vest with Dubai International Airport logo and will help with your bags. Could you share your location or parking space number to help him find you?";
    }
  }
  
  // General helpful responses
  if (msg.includes('help') || msg.includes('assistance')) {
    return "I'm here to help! What do you need assistance with? You can ask me about your journey, meeting arrangements, or any concerns you have.";
  }
  
  if (msg.includes('thank')) {
    return "You're very welcome! I'm here whenever you need me. Is there anything else I can help you with?";
  }
  
  // Default response
  return "Thank you for your message. I'm processing your request and will respond shortly. If you need immediate assistance, please don't hesitate to ask specific questions about your journey.";
}

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 DXB Server running on port ${PORT}`);
  console.log(`📱 Chat interface available at http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`👥 Passengers API: http://localhost:${PORT}/api/passengers`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
  });
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
