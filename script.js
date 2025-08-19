// === CLEAN MESSAGING SYSTEM - FRESH START ===

// Global state - simplified
let currentTab = 'international';
let conversationState = {
    journeyStage: 'welcome_message',
    accessibilityFlow: { selectedTypes: [] }
};

// === SIMPLE MESSAGING SYSTEM ===

// Add a message to the chat
function addMessage(text, sender = 'bot') {
    console.log(`Adding ${sender} message:`, text);
    
    const chatContainer = document.getElementById('chatMessages');
    if (!chatContainer) {
        console.error('Chat container not found');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const currentTime = new Date().toLocaleTimeString();
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-text">${text}</div>
            <div class="message-time">${currentTime}</div>
        </div>
    `;
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Clear all messages
function clearMessages() {
    const chatContainer = document.getElementById('chatMessages');
    if (chatContainer) {
        chatContainer.innerHTML = '';
    }
}

// Welcome message sequence
function startWelcomeFlow() {
    console.log('Starting welcome flow...');
    clearMessages();
    
    const messages = [
        "👋 Welcome to Dubai International Airport Concierge! We're here to provide personalized accessibility support for your journey through DXB. ✈️",
        "We'll meet you at your chosen spot and assist you through the airport and on to your flight. We'll make sure you receive exactly the assistance you need throughout your journey. 🤝🌟",
        "Would you like to get started? Just say 'yes' or 'start' and we'll begin! 🚀"
    ];
    
    // Send messages with 1 second delay
    messages.forEach((message, index) => {
        setTimeout(() => {
            console.log(`Sending message ${index + 1}:`, message);
            addMessage(message);
        }, index * 1000);
    });
}

// Start on the day flow
function startOnTheDayFlow() {
    console.log('Starting on-the-day flow');
    
    setTimeout(() => {
        addMessage("☀️ Good morning Jim! It's your travel day. Are you still planning to fly to LHR on flight Emirates EK15 departing at 18:30 today?");
        conversationState.journeyStage = 'on_day_flight_confirmation';
    }, 1000);
}

// Handle user input
function handleUserMessage(message) {
    console.log('User said:', message);
    addMessage(message, 'user');
    
    const msg = message.toLowerCase();
    
    if (conversationState.journeyStage === 'welcome_message') {
        if (msg.includes('yes') || msg.includes('start') || msg.includes('begin')) {
            conversationState.journeyStage = 'choose_method';
            setTimeout(() => {
                addMessage("Perfect! To start, we'll need you to share your details. You can either:<br><br><strong>1. 📝 Type your details</strong><br>Tell me your name, flight info, and accessibility needs<br><br><strong>2. 📸 Upload or take a picture</strong><br>Share your ticket or boarding pass<br><br>Which would you prefer? Just type '1' or '2'.");
            }, 1000);
        } else if (msg.includes('no') || msg.includes('not now')) {
            setTimeout(() => {
                addMessage("No problem at all! I'll be here whenever you're ready. Just come back and say 'start' when you'd like to begin setting up your assistance. Have a great day! ✨");
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("I'd love to help you get started! Just say 'yes' or 'start' when you're ready to begin, or 'no' if you'd prefer to come back later. 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'choose_method') {
        if (msg.includes('1') || msg.includes('type') || msg.includes('manual') || msg.includes('write')) {
            conversationState.journeyStage = 'manual_entry';
            setTimeout(() => {
                addMessage("Great! Please tell me:\n\n1. Your name\n2. Your flight details (airline, flight number, destination)\n3. What accessibility support you need\n\nI'll use this information to coordinate with our Dubai International Airport team. 😊");
            }, 1000);
        } else if (msg.includes('2') || msg.includes('upload') || msg.includes('picture') || msg.includes('photo') || msg.includes('ticket') || msg.includes('boarding')) {
            conversationState.journeyStage = 'photo_upload';
            setTimeout(() => {
                addMessage("Perfect! Please take a photo of your ticket or boarding pass.<br><br>📸 <strong>Click the paperclip button below</strong> to take or upload your photo.");
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("Please choose either '1' to type your details manually, or '2' to share a picture of your ticket or boarding pass. 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'upload_method') {
        if (msg.includes('1') || msg.includes('camera') || msg.includes('photo') || msg.includes('picture') || msg.includes('take')) {
            setTimeout(() => {
                addMessage("📸 Camera activated! Please take a clear photo of your ticket or boarding pass.\n\n[Simulating camera interface...]\n\n📄 Photo captured! I can see your ticket details. Let me process this information...");
            }, 1000);
            setTimeout(() => {
                simulateTicketProcessing();
            }, 3000);
        } else if (msg.includes('2') || msg.includes('upload') || msg.includes('file') || msg.includes('share')) {
            setTimeout(() => {
                addMessage("📤 Please select your ticket or boarding pass file to upload.\n\n[Simulating file upload interface...]\n\n✅ File uploaded successfully! Processing your ticket information...");
                }, 1000);
                setTimeout(() => {
                simulateTicketProcessing();
                }, 3000);
        } else {
                setTimeout(() => {
                addMessage("Please choose either '1' to take a photo, or '2' to upload an existing file. 📸📤");
                }, 1000);
        }
    } else if (conversationState.journeyStage === 'manual_entry') {
        // Handle manual entry responses
        handleManualEntry(message);
    } else if (conversationState.journeyStage === 'confirm_flight_details') {
        // Handle flight details confirmation
        if (msg.includes('yes') || msg.includes('correct') || msg.includes('right')) {
            setTimeout(() => {
                addMessage("Excellent! Your flight details have been confirmed.<br><br>✅ <strong>Terminal Confirmation:</strong><br>Emirates Flight EK15 departs from <strong>Terminal 3</strong> at Dubai International Airport.");
            }, 1000);
            setTimeout(() => {
                addMessage("Now, <strong>where would you like to be met for your assistance?</strong>");
            }, 3000);
            setTimeout(() => {
                addMessage("Please choose your preferred meeting location:<br><br><strong>1. 🅿️ Disabled/Accessibility Parking</strong><br>Dedicated spaces near Terminal 3 entrance<br><br><strong>2. 🚗 Short Stay Parking</strong><br>Multi-storey car park (Levels 1-4)<br><br><strong>3. 🚙 Long Stay Parking</strong><br>Economy parking with shuttle service<br><br><strong>4. 🚕 Drop Off Zone</strong><br>Terminal 3 Departures level curbside<br><br><strong>5. 🔑 Car Rental Return</strong><br>Hertz/Avis/Budget return area<br><br><strong>6. 🚇 Metro/Public Transport</strong><br>Airport Metro Station entrance<br><br>Please type the number (1-6) of your preferred meeting location.");
                conversationState.journeyStage = 'choose_meeting_location';
            }, 4500);
        } else if (msg.includes('no') || msg.includes('wrong') || msg.includes('incorrect')) {
            setTimeout(() => {
                addMessage("No problem! Please tell me what needs to be corrected, or you can try taking another photo of your ticket by clicking the paperclip button again.");
                conversationState.journeyStage = 'photo_upload';
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("Please confirm if the flight details are correct by saying 'yes' or 'no'. 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'choose_meeting_location') {
        // Handle meeting location selection
        const locationOptions = {
            '1': 'Disabled/Accessibility Parking near Terminal 3 entrance',
            '2': 'Short Stay Parking (Multi-storey car park)',
            '3': 'Long Stay Parking with shuttle pickup',
            '4': 'Drop Off Zone at Terminal 3 Departures level',
            '5': 'Car Rental Return area',
            '6': 'Metro Station entrance'
        };
        
        const selectedOption = msg.match(/[1-6]/)?.[0];
        if (selectedOption && locationOptions[selectedOption]) {
            if (selectedOption === '5') {
                // Car rental return - ask for specific company
                setTimeout(() => {
                    addMessage(`Perfect! You've selected: <strong>${locationOptions[selectedOption]}</strong><br><br>Which car rental company are you returning your vehicle to?<br><br><strong>1. 🚗 Hertz</strong><br><strong>2. 🚙 Avis</strong><br><strong>3. 🚕 Budget Rent A Car</strong><br><strong>4. 🚐 Europcar</strong><br><strong>5. 🚓 Sixt</strong><br><strong>6. 💰 Thrifty</strong><br><strong>7. 💵 Dollar Rent A Car</strong><br><strong>8. 🏢 National Car Rental</strong><br><br>Please type the number (1-8) for your car rental company.`);
                    conversationState.journeyStage = 'choose_car_rental_company';
                }, 1000);
            } else {
                setTimeout(() => {
                    addMessage(`Perfect! You've selected: <strong>${locationOptions[selectedOption]}</strong><br><br>Now let's figure out exactly what help you need. Would you like assistance with check-in? (Many people prefer to do this themselves, especially when traveling with family)`);
                    conversationState.journeyStage = 'check_in_assistance';
                    conversationState.selectedMeetingPoint = locationOptions[selectedOption];
                    conversationState.accessibilityFlow = { selectedTypes: [] };
                }, 1000);
            }
        } else {
            setTimeout(() => {
                addMessage("Please select a valid option by typing a number from 1 to 6. 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'choose_car_rental_company') {
        // Handle car rental company selection
        const carRentalCompanies = {
            '1': 'Hertz',
            '2': 'Avis', 
            '3': 'Budget Rent A Car',
            '4': 'Europcar',
            '5': 'Sixt',
            '6': 'Thrifty',
            '7': 'Dollar Rent A Car',
            '8': 'National Car Rental'
        };
        
        const selectedCompany = msg.match(/[1-8]/)?.[0];
        if (selectedCompany && carRentalCompanies[selectedCompany]) {
            setTimeout(() => {
                addMessage(`Excellent! You're returning your vehicle to <strong>${carRentalCompanies[selectedCompany]}</strong> at Terminal 3.<br><br>Our assistance coordinator will meet you at the <strong>${carRentalCompanies[selectedCompany]} return area</strong>.<br><br>Now let's figure out exactly what help you need. Would you like assistance with check-in? (Many people prefer to do this themselves, especially when traveling with family)`);
                conversationState.journeyStage = 'check_in_assistance';
                conversationState.selectedMeetingPoint = `${carRentalCompanies[selectedCompany]} Car Rental Return area`;
                conversationState.accessibilityFlow = { selectedTypes: [] };
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("Please select a valid car rental company by typing a number from 1 to 8. 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'check_in_assistance') {
        // Handle check-in assistance preference
        conversationState.accessibilityFlow.checkInHelp = message.toLowerCase().includes('yes') || message.toLowerCase().includes('help');
        setTimeout(() => {
            addMessage("Great! I've got check-in help noted. How about security? Would you like assistance getting through? (This means priority lanes and help with procedures)");
            conversationState.journeyStage = 'security_assistance';
        }, 1000);
    } else if (conversationState.journeyStage === 'security_assistance') {
        // Handle security assistance preference
        conversationState.accessibilityFlow.securityHelp = message.toLowerCase().includes('yes') || message.toLowerCase().includes('help');
        setTimeout(() => {
            addMessage("Perfect! Security help is sorted. What about boarding? Would you like assistance getting on the plane? (Priority boarding and help to your seat)");
            conversationState.journeyStage = 'boarding_assistance';
        }, 1000);
    } else if (conversationState.journeyStage === 'boarding_assistance') {
        // Handle boarding assistance preference
        conversationState.accessibilityFlow.boardingHelp = message.toLowerCase().includes('yes') || message.toLowerCase().includes('help');
        setTimeout(() => {
            addMessage("Brilliant! Boarding help is all set. Now, here's something nice - instead of waiting at your gate, would you prefer somewhere more comfortable? Terminal 3 has some lovely spots!");
            conversationState.journeyStage = 'terminal_comfort';
        }, 1000);
    } else if (conversationState.journeyStage === 'terminal_comfort') {
        // Handle terminal comfort preference
        if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('comfortable') || message.toLowerCase().includes('prefer')) {
            setTimeout(() => {
                addMessage("Wonderful! What kind of place sounds good to you?<br><br><strong>1. Restaurant</strong><br><strong>2. Bar</strong><br><strong>3. Emirates Lounge</strong><br><strong>4. Quiet Area</strong><br><strong>5. Straight to Gate</strong><br><br>Just send me the number that works best for you! 😊");
                conversationState.journeyStage = 'terminal_location_type';
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("No problem! We'll take you straight to your gate when it's time.<br><br>Now let's make sure we have all your accessibility needs covered. Do any of these apply to you? (You can select multiple by sending the numbers separated by commas, like '1,2')<br><br><strong>1. Sensory impairment (hearing, vision)</strong><br><strong>2. Mobility impairment (walking, wheelchair)</strong><br><strong>3. Cognitive impairment (memory, learning)</strong><br><strong>4. None of the above</strong><br><strong>5. Prefer not to say</strong><br><br>Just send me the number that works best for you! 😊");
                conversationState.journeyStage = 'impairment_type';
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'terminal_location_type') {
        // Handle terminal location type selection
        const selectedOption = msg.match(/[1-5]/)?.[0];
        if (selectedOption === '1') {
            // Restaurant selection
            setTimeout(() => {
                addMessage("Great choice! Here are some excellent restaurants in Terminal 3:<br><br><strong>1. Hard Rock Café (classic American cuisine)</strong><br><strong>2. Cho Gao (authentic Asian flavors)</strong><br><strong>3. Giraffe (international favorites)</strong><br><strong>4. Paul Bakery & Restaurant (French cuisine)</strong><br><strong>5. The Daily DXB (global food tour)</strong><br><br>Just send me the number that works best for you! 😊");
                conversationState.journeyStage = 'terminal_specific_location';
                conversationState.accessibilityFlow.locationType = 'restaurant';
            }, 1000);
        } else if (selectedOption === '2') {
            // Bar selection
            setTimeout(() => {
                addMessage("Perfect! Here are some great bars in Terminal 3:<br><br><strong>1. O'Regan's Irish Bar & Restaurant (authentic Irish atmosphere)</strong><br><strong>2. Costa Coffee Bar (coffee & light drinks)</strong><br><strong>3. Paul Bakery Bar Section (French café vibes)</strong><br><strong>4. Terminal Bar Area (relaxed airport bar)</strong><br><br>Just send me the number that works best for you! 😊");
                conversationState.journeyStage = 'terminal_specific_location';
                conversationState.accessibilityFlow.locationType = 'bar';
            }, 1000);
        } else if (selectedOption === '3') {
            // Emirates Lounge
            setTimeout(() => {
                addMessage("Excellent choice! The <strong>Emirates Lounge</strong> offers:<br><br>🍽️ Gourmet dining with global flavors<br>🍷 Premium beverages and full-service bar<br>🚿 Shower facilities<br>💼 Business center with Wi-Fi<br>🛋️ Comfortable seating and peaceful ambiance<br><br>Please note: Access is complimentary for First & Business Class passengers and eligible Emirates Skywards members. We'll arrange access for you!<br><br>Now let's make sure we have all your accessibility needs covered. Do any of these apply to you? (You can select multiple by sending the numbers separated by commas, like '1,2')<br><br><strong>1. Sensory impairment (hearing, vision)</strong><br><strong>2. Mobility impairment (walking, wheelchair)</strong><br><strong>3. Cognitive impairment (memory, learning)</strong><br><strong>4. None of the above</strong><br><strong>5. Prefer not to say</strong><br><br>Just send me the number that works best for you! 😊");
                conversationState.accessibilityFlow.preferredLocation = 'Emirates Lounge';
                conversationState.journeyStage = 'impairment_type';
            }, 1000);
        } else if (selectedOption === '4') {
            // Quiet area
            setTimeout(() => {
                addMessage("Lovely choice! Terminal 3 has beautiful quiet spaces:<br><br><strong>1. Zen Gardens (fish ponds & greenery)</strong><br><strong>2. Quiet seating near Gates A</strong><br><strong>3. Peaceful area by the prayer room</strong><br><strong>4. Timeless Spa relaxation area</strong><br><br>Just send me the number that works best for you! 😊");
                conversationState.journeyStage = 'terminal_specific_location';
                conversationState.accessibilityFlow.locationType = 'quiet';
            }, 1000);
        } else if (selectedOption === '5') {
            // Straight to gate
            conversationState.accessibilityFlow.preferredLocation = 'Direct to gate';
            setTimeout(() => {
                addMessage("Perfect! We'll take you straight to your gate.<br><br>Now let's make sure we have all your accessibility needs covered. Do any of these apply to you? (You can select multiple by sending the numbers separated by commas, like '1,2')<br><br><strong>1. Sensory impairment (hearing, vision)</strong><br><strong>2. Mobility impairment (walking, wheelchair)</strong><br><strong>3. Cognitive impairment (memory, learning)</strong><br><strong>4. None of the above</strong><br><strong>5. Prefer not to say</strong><br><br>Just send me the number that works best for you! 😊");
                conversationState.journeyStage = 'impairment_type';
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("Please select a valid option by typing a number from 1 to 5. 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'terminal_specific_location') {
        // Handle specific location selection
        const selectedOption = msg.match(/[1-5]/)?.[0];
        const locationType = conversationState.accessibilityFlow.locationType;
        
        let locationName = '';
        if (locationType === 'restaurant') {
            const restaurants = {
                '1': 'Hard Rock Café',
                '2': 'Cho Gao', 
                '3': 'Giraffe',
                '4': 'Paul Bakery & Restaurant',
                '5': 'The Daily DXB'
            };
            locationName = restaurants[selectedOption];
        } else if (locationType === 'bar') {
            const bars = {
                '1': "O'Regan's Irish Bar & Restaurant",
                '2': 'Costa Coffee Bar',
                '3': 'Paul Bakery Bar Section',
                '4': 'Terminal Bar Area'
            };
            locationName = bars[selectedOption];
        } else if (locationType === 'quiet') {
            const quietAreas = {
                '1': 'Zen Gardens',
                '2': 'Quiet seating near Gates A',
                '3': 'Peaceful area by prayer room',
                '4': 'Timeless Spa relaxation area'
            };
            locationName = quietAreas[selectedOption];
        }
        
        if (locationName) {
            conversationState.accessibilityFlow.preferredLocation = locationName;
            setTimeout(() => {
                addMessage(`Excellent choice! We'll take you to <strong>${locationName}</strong> where you can relax before your flight.<br><br>Now let's make sure we have all your accessibility needs covered. Do any of these apply to you? (You can select multiple by sending the numbers separated by commas, like '1,2')<br><br><strong>1. Sensory impairment (hearing, vision)</strong><br><strong>2. Mobility impairment (walking, wheelchair)</strong><br><strong>3. Cognitive impairment (memory, learning)</strong><br><strong>4. None of the above</strong><br><strong>5. Prefer not to say</strong><br><br>Just send me the number that works best for you! 😊`);
                conversationState.journeyStage = 'impairment_type';
            }, 1000);
        } else {
            const maxOption = locationType === 'restaurant' ? '5' : '4';
            setTimeout(() => {
                addMessage(`Please select a valid option by typing a number from 1 to ${maxOption}. 😊`);
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'impairment_type') {
        // Handle impairment type selection
        const selections = msg.match(/\d/g) || [];
        const validSelections = selections.filter(num => ['1', '2', '3', '4', '5'].includes(num));
        
        if (validSelections.length > 0) {
            conversationState.accessibilityFlow.selectedTypes = validSelections;
            
            if (validSelections.includes('2')) {
                // Mobility impairment selected - ask specific mobility questions
                setTimeout(() => {
                    addMessage("Thanks! What kind of mobility support do you need?<br><br><strong>1. I need an airport wheelchair</strong><br><strong>2. I have my own wheelchair</strong><br><strong>3. I can walk but need assistance</strong><br><strong>4. Other mobility needs</strong><br><br>Just send me the number that works best for you! 😊");
                    conversationState.journeyStage = 'mobility_support';
                }, 1000);
            } else if (validSelections.includes('4') || validSelections.includes('5')) {
                // Skip to airport requests
                setTimeout(() => {
                    addMessage("Perfect! I have all your accessibility needs noted. Is there anything else you'd like me to share with the Dubai International Airport team? This could be things like preferred communication methods, specific concerns, or any other details that would help them provide better support. (If not, just say 'no' or 'nothing additional')");
                    conversationState.journeyStage = 'airport_requests';
                }, 1000);
            } else {
                // Other impairments - go to airport requests
                setTimeout(() => {
                    addMessage("Perfect! I have all your accessibility needs noted. Is there anything else you'd like me to share with the Dubai International Airport team? This could be things like preferred communication methods, specific concerns, or any other details that would help them provide better support. (If not, just say 'no' or 'nothing additional')");
                    conversationState.journeyStage = 'airport_requests';
                }, 1000);
            }
        } else {
            setTimeout(() => {
                addMessage("Please select a valid option by typing a number from 1 to 5, or multiple numbers separated by commas (like '1,2'). 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'mobility_support') {
        // Handle mobility support selection
        const selectedOption = msg.match(/[1-4]/)?.[0];
        if (selectedOption) {
            conversationState.accessibilityFlow.mobilityType = selectedOption;
            
            if (['1', '2'].includes(selectedOption)) {
                // Wheelchair users - ask about seat transfer
                setTimeout(() => {
                    addMessage("Do you need help getting from your wheelchair to your seat on the plane?<br><br><strong>1. Yes, I need help transferring to my seat</strong><br><strong>2. No, I can transfer myself</strong><br><strong>3. It depends on the situation</strong><br><br>Just send me the number that works best for you! 😊");
                    conversationState.journeyStage = 'seat_transfer';
                }, 1000);
            } else {
                // Walking assistance - skip to airport requests
                setTimeout(() => {
                    addMessage("Perfect! I have all your accessibility needs noted. Is there anything else you'd like me to share with the Dubai International Airport team? This could be things like preferred communication methods, specific concerns, or any other details that would help them provide better support. (If not, just say 'no' or 'nothing additional')");
                    conversationState.journeyStage = 'airport_requests';
                }, 1000);
            }
        } else {
            setTimeout(() => {
                addMessage("Please select a valid option by typing a number from 1 to 4. 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'seat_transfer') {
        // Handle seat transfer selection
        const selectedOption = msg.match(/[1-3]/)?.[0];
        if (selectedOption) {
            conversationState.accessibilityFlow.seatTransfer = selectedOption;
            setTimeout(() => {
                addMessage("Perfect! I have all your accessibility needs noted. Is there anything else you'd like me to share with the Dubai International Airport team? This could be things like preferred communication methods, specific concerns, or any other details that would help them provide better support. (If not, just say 'no' or 'nothing additional')");
                conversationState.journeyStage = 'airport_requests';
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("Please select a valid option by typing a number from 1 to 3. 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'airport_requests') {
        // Handle airport-specific requests
        conversationState.accessibilityFlow.airportRequests = message;
        setTimeout(() => {
            addMessage("Thanks! Now, is there anything you'd like the Emirates cabin crew to be made aware of in advance? This helps them prepare to support you during your flight. (Again, just say 'no' if there's nothing specific)");
            conversationState.journeyStage = 'cabin_crew_requests';
        }, 1000);
    } else if (conversationState.journeyStage === 'cabin_crew_requests') {
        // Handle cabin crew requests and complete the flow
        conversationState.accessibilityFlow.cabinCrewRequests = message;
        const meetingPoint = conversationState.selectedMeetingPoint || 'your selected location';
        
        setTimeout(() => {
            // First show passenger details
            addMessage(`✅ <strong>Perfect! I have everything for Jim Beattie:</strong><br><br>👤 <strong>Passenger:</strong> Jim Beattie (as shown on passport)<br>✈️ <strong>Emirates EK15</strong> from DXB to LHR<br>📅 <strong>Departing</strong> 18:30<br>💺 <strong>Seat</strong> 12A`);
            
            setTimeout(() => {
                // Then show Dubai Airport information  
                const services = conversationState.accessibilityFlow;
                const location = services.preferredLocation || 'Direct to gate';
                const supportNeeded = [
                    services.checkInHelp ? 'Check-in assistance' : null,
                    services.securityHelp ? 'Security assistance' : null,
                    services.boardingHelp ? 'Boarding assistance' : null
                ].filter(Boolean).join(', ') || 'No additional support needed';
                
                // Get accessibility details
                let accessibilityInfo = 'Not specified';
                let mobilityDetails = '';
                
                if (services.selectedTypes && services.selectedTypes.includes('2')) {
                    accessibilityInfo = 'Mobility impairment (walking, wheelchair)';
                    if (services.mobilityType === '1') {
                        mobilityDetails = 'Airport wheelchair needed';
                        if (services.seatTransfer === '1') {
                            mobilityDetails += ' - Yes, I need help transferring to my seat';
                        } else if (services.seatTransfer === '2') {
                            mobilityDetails += ' - No, I can transfer myself';
                        } else if (services.seatTransfer === '3') {
                            mobilityDetails += ' - It depends on the situation';
                        }
                    } else if (services.mobilityType === '2') {
                        mobilityDetails = 'Own wheelchair user';
                        if (services.seatTransfer === '1') {
                            mobilityDetails += ' - Yes, I need help transferring to my seat';
                        } else if (services.seatTransfer === '2') {
                            mobilityDetails += ' - No, I can transfer myself';
                        } else if (services.seatTransfer === '3') {
                            mobilityDetails += ' - It depends on the situation';
                        }
                    }
                } else if (services.selectedTypes && services.selectedTypes.includes('1')) {
                    accessibilityInfo = 'Sensory impairment (hearing, vision)';
                } else if (services.selectedTypes && services.selectedTypes.includes('3')) {
                    accessibilityInfo = 'Cognitive impairment (memory, learning)';
                } else if (services.selectedTypes && services.selectedTypes.includes('4')) {
                    accessibilityInfo = 'None of the above';
                } else if (services.selectedTypes && services.selectedTypes.includes('5')) {
                    accessibilityInfo = 'Prefer not to say';
                }
                
                const airportRequests = services.airportRequests && !['no', 'nothing', 'nothing additional'].some(word => services.airportRequests.toLowerCase().includes(word)) ? services.airportRequests : 'None specified';
                
                addMessage(`📋 <strong>Information for Dubai International Airport:</strong><br><br>• <strong>Meeting point:</strong> ${meetingPoint}<br>• <strong>Waiting preference:</strong> ${location}<br>• <strong>Support needed:</strong> ${supportNeeded}<br>• <strong>Accessibility needs:</strong> ${accessibilityInfo}${mobilityDetails ? '<br>• <strong>Mobility details:</strong> ' + mobilityDetails : ''}<br>• <strong>Additional information:</strong> ${airportRequests}`);
                
                setTimeout(() => {
                    // Then show Emirates cabin crew information
                    const cabinCrewRequests = services.cabinCrewRequests && !['no', 'nothing', 'nothing additional'].some(word => services.cabinCrewRequests.toLowerCase().includes(word)) ? services.cabinCrewRequests : 'None specified';
                    
                    addMessage(`✈️ <strong>Information for Emirates Cabin Crew:</strong><br><br>• <strong>Accessibility needs:</strong> ${accessibilityInfo}${mobilityDetails ? '<br>• <strong>Mobility support:</strong> ' + mobilityDetails : ''}<br>• <strong>Special requests:</strong> ${cabinCrewRequests}`);
                    
                    setTimeout(() => {
                        // Ask for confirmation
                        addMessage(`Does everything look correct? If you'd like to change anything, just let me know what needs updating. Otherwise, say 'looks good' and I'll send this information to both teams.`);
                        conversationState.journeyStage = 'final_confirmation';
                    }, 2000);
                }, 2000);
            }, 2000);
        }, 1000);
    } else if (conversationState.journeyStage === 'final_confirmation') {
        // Handle final confirmation
        if (message.toLowerCase().includes('looks good') || message.toLowerCase().includes('correct') || message.toLowerCase().includes('yes')) {
            setTimeout(() => {
                addMessage(`Perfect! ✅ I've sent all your details to both Dubai International Airport and Emirates. They now have your complete accessibility profile and travel preferences.<br><br>📞 <strong>What happens next:</strong><br><br>• Please plan to arrive at DXB Terminal 3 three hours before departure<br>• We'll be in touch on the day of your departure to provide further assistance<br>• Both teams will be fully prepared for your arrival<br>• If you need anything in the meantime, just send me a message<br><br>Have a wonderful trip! ✈️`);
                conversationState.journeyStage = 'completed';
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("What would you like me to update? Please let me know which details need changing and I'll take care of it for you.");
                // Stay in final_confirmation stage to allow updates
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'on_day_flight_confirmation') {
        // Handle on-the-day flight confirmation
        if (msg.includes('yes') || msg.includes('still') || msg.includes('confirm')) {
            setTimeout(() => {
                addMessage("Great! Do you still want to be met at the disabled parking area as planned?");
                conversationState.journeyStage = 'on_day_meeting_confirmation';
            }, 1000);
        } else if (msg.includes('no') || msg.includes('cancel') || msg.includes('change')) {
            setTimeout(() => {
                addMessage("No problem! Let me know what's changed and I can help you update your travel arrangements.");
                conversationState.journeyStage = 'on_day_changes';
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("Please confirm if you're still planning to fly today by saying 'yes' or 'no'. 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'on_day_meeting_confirmation') {
        // Handle meeting point confirmation
        if (msg.includes('yes') || msg.includes('still') || msg.includes('same')) {
            setTimeout(() => {
                addMessage("Perfect! Please try to arrive 3 hours before departure (so by 15:30 for your 18:30 flight).<br><br>🅿️ <strong>Here's the disabled parking location:</strong><br><br>📍 DXB Terminal 3 - Disabled/Accessibility Parking Area<br><br>🗺️ Map link: https://maps.google.com/maps?q=25.2529,-55.3658<br><br>This will take you directly to the disabled parking spaces.");
                conversationState.journeyStage = 'on_day_completed';
            }, 1000);
        } else if (msg.includes('no') || msg.includes('change') || msg.includes('different')) {
            setTimeout(() => {
                addMessage("No problem! Where would you like to be met instead? I can arrange meeting at:<br><br>1. Short Stay Parking<br>2. Long Stay Parking<br>3. Drop Off Zone<br>4. Car Rental Return<br>5. Metro Station<br><br>Just let me know the number or tell me what works better for you.");
                conversationState.journeyStage = 'on_day_new_meeting_point';
            }, 1000);
        } else {
            setTimeout(() => {
                addMessage("Please confirm if you still want to be met at the disabled parking area by saying 'yes' or 'no'. 😊");
            }, 1000);
        }
    } else if (conversationState.journeyStage === 'on_day_new_meeting_point') {
        // Handle new meeting point selection
        setTimeout(() => {
            addMessage(`Got it! I've updated your meeting point. Our assistance coordinator will meet you at your new location. Please arrive by 15:30 for your 18:30 flight.<br><br>I'll send you the exact location details shortly. Have a wonderful trip! ✈️`);
            conversationState.journeyStage = 'on_day_completed';
        }, 1000);
    } else if (conversationState.journeyStage === 'on_day_changes') {
        // Handle flight changes
        setTimeout(() => {
            addMessage("I understand your travel plans have changed. Let me connect you with our coordination team who can help make any necessary adjustments. They'll be in touch shortly.<br><br>Thank you for letting us know! 💙");
            conversationState.journeyStage = 'on_day_completed';
        }, 1000);
    }
}

// Simulate ticket processing
function simulateTicketProcessing() {
    addMessage("✅ Ticket processed successfully!\n\n🎫 Flight Details Detected:\n• Emirates EK789\n• Dubai (DXB) → London Heathrow (LHR)\n• Departure: Today at 18:30\n• Seat: 12A\n\n❓ I also need to know what accessibility support you require. Could you tell me about any assistance you need?");
    conversationState.journeyStage = 'accessibility_needs';
}

// Handle manual entry flow
function handleManualEntry(message) {
    // Simple manual entry handler - could be expanded
            setTimeout(() => {
        addMessage("Thank you for sharing your details! I'm processing this information and will coordinate with our Dubai International Airport team to ensure you receive the perfect assistance. 😊\n\nSomeone from our team will be in touch shortly with your meeting arrangements.");
                }, 1000);
}

// === UI FUNCTIONS ===

// Tab switching
function switchTab(tabName, airportView = null) {
    console.log('Switching to tab:', tabName);
    
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const tabButton = document.querySelector(`[onclick*="'${tabName}'"]`);
    if (tabButton) {
        tabButton.classList.add('active');
    }
    
    // Update active tab panel
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const tabPanel = document.getElementById(tabName);
    if (tabPanel) {
        tabPanel.classList.add('active');
    }
    
    currentTab = tabName;
    
    // Handle passenger chat tab
    if (tabName === 'passenger') {
        setTimeout(() => {
            // Auto-select welcome message radio
            const welcomeRadio = document.querySelector('input[value="welcome_message"]');
            if (welcomeRadio) {
                welcomeRadio.checked = true;
            }
            
            // Start welcome flow
            startWelcomeFlow();
            
            // Focus message input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.focus();
        }
        }, 100);
    }
}

// Send message
function sendMessage() {
    const input = document.getElementById('messageInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (message) {
        handleUserMessage(message);
        input.value = '';
    }
}

// Handle Enter key
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Journey stage update
function updateJourneyStage(stage) {
    console.log('Journey stage updated to:', stage);
    conversationState.journeyStage = stage;
    
    if (stage === 'welcome_message') {
        startWelcomeFlow();
    } else if (stage === 'on_the_day') {
        clearMessages();
        startOnTheDayFlow();
    }
}

// Placeholder functions for existing functionality
function onLanguageChange(language) {
    console.log('Language changed to:', language);
}

function toggleVoiceInput() {
    console.log('Voice input toggled');
}

function showAttachmentOptions() {
    console.log('Attachment options triggered');
    
    // Check if we're in photo upload stage
    if (conversationState.journeyStage === 'photo_upload') {
        simulatePhotoUpload();
    } else {
        console.log('Attachment options shown - other stage');
    }
}

// Simulate photo upload with Emirates ticket
function simulatePhotoUpload() {
    console.log('Simulating photo upload...');
    
    // Show photo capture simulation
    addMessage("📸 Photo captured! Processing your ticket...", 'user');
    
    setTimeout(() => {
        // Display the simulated Emirates ticket
        const ticketHtml = generateEmiratesTicket();
        addMessage("✅ <strong>Ticket successfully processed!</strong><br><br>" + ticketHtml);
    }, 1500);
    
    setTimeout(() => {
        // Show extracted flight details for confirmation
        addMessage("I've extracted the following flight details:<br><br><strong>🎫 Flight Details:</strong><br>• <strong>Airline:</strong> Emirates (EK)<br>• <strong>Flight:</strong> EK15<br>• <strong>From:</strong> Dubai (DXB)<br>• <strong>To:</strong> London Heathrow (LHR)<br>• <strong>Date:</strong> Friday, 23rd August 2025<br>• <strong>Departure:</strong> 18:30<br>• <strong>Passenger:</strong> Jim Beattie<br>• <strong>Seat:</strong> 12A<br><br><strong>Are these details correct?</strong> Please type 'yes' to confirm or 'no' if anything needs to be corrected.");
        conversationState.journeyStage = 'confirm_flight_details';
    }, 3000);
}

// Generate realistic Emirates ticket HTML
function generateEmiratesTicket() {
    return `
        <div style="background: linear-gradient(135deg, #c41e3a 0%, #8b1a2e 100%); color: white; padding: 15px; border-radius: 8px; font-family: Arial, sans-serif; margin: 10px 0; max-width: 400px;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
                <div style="font-size: 18px; font-weight: bold;">✈️ EMIRATES</div>
                <div style="margin-left: auto; font-size: 12px;">EK</div>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                <div style="font-size: 14px; font-weight: bold; margin-bottom: 5px;">BOARDING PASS</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 12px;">
                    <div>
                        <div style="opacity: 0.8;">PASSENGER</div>
                        <div style="font-weight: bold;">BEATTIE/JIM MR</div>
                    </div>
                    <div>
                        <div style="opacity: 0.8;">FLIGHT</div>
                        <div style="font-weight: bold;">EK15</div>
                    </div>
                    <div>
                        <div style="opacity: 0.8;">FROM</div>
                        <div style="font-weight: bold;">DXB DUBAI</div>
                    </div>
                    <div>
                        <div style="opacity: 0.8;">TO</div>
                        <div style="font-weight: bold;">LHR LONDON</div>
                    </div>
                    <div>
                        <div style="opacity: 0.8;">DATE</div>
                        <div style="font-weight: bold;">23AUG25</div>
                    </div>
                    <div>
                        <div style="opacity: 0.8;">TIME</div>
                        <div style="font-weight: bold;">18:30</div>
                    </div>
                    <div>
                        <div style="opacity: 0.8;">SEAT</div>
                        <div style="font-weight: bold;">12A</div>
                    </div>
                    <div>
                        <div style="opacity: 0.8;">GATE</div>
                        <div style="font-weight: bold;">A7</div>
                    </div>
                </div>
            </div>
            
            <div style="border-top: 1px dashed rgba(255,255,255,0.3); padding-top: 10px; font-size: 10px; text-align: center; opacity: 0.8;">
                ECONOMY CLASS • ELECTRONIC TICKET
            </div>
        </div>
    `;
}

function switchAirportView(view) {
    console.log('Airport view:', view);
}

function switchAirlineView(view) {
    console.log('Airline view:', view);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('Clean messaging system initialized');
    switchTab('international');
});