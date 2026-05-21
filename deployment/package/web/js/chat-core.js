        let isAdminAuthenticated = false; // Track admin session
        let lastRequirement = '';
        let conversationContext = {
            lastChangeType: '',
            lastModule: '',
            userPreferences: {
                verboseMode: false
            }
        };

        function getCurrentTime() {
            const now = new Date();
            return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        }

        function addMessage(content, isUser = false) {
            const messagesWrapper = document.querySelector('.messages-wrapper');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = isUser ? 'You' : '🤖';
            
            const wrapper = document.createElement('div');
            wrapper.className = 'message-wrapper';
            
            const header = document.createElement('div');
            header.className = 'message-header';
            header.innerHTML = `
                <span>${isUser ? 'You' : 'next-gen call-center customization assistant'}</span>
                <span class="message-time">${getCurrentTime()}</span>
            `;
            
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
            messageContent.innerHTML = content;
            
            wrapper.appendChild(header);
            wrapper.appendChild(messageContent);

            // Add like/dislike + feedback for bot messages only
            if (!isUser) {
                const msgId = 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

                const feedbackRow = document.createElement('div');
                feedbackRow.className = 'message-feedback';
                feedbackRow.innerHTML = `
                    <button class="feedback-btn" id="like_${msgId}" onclick="handleLike('${msgId}')">👍 Like</button>
                    <button class="feedback-btn" id="dislike_${msgId}" onclick="handleDislike('${msgId}')">👎 Dislike</button>
                `;

                const feedbackForm = document.createElement('div');
                feedbackForm.className = 'feedback-form';
                feedbackForm.id = 'form_' + msgId;
                feedbackForm.innerHTML = `
                    <!-- LIKE FORM: time saved + comments -->
                    <div id="like_form_${msgId}" style="display:none;">
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #161616;">Estimated time saved in execution/implementation (minutes):</label>
                            <input type="number" id="timesaved_${msgId}" placeholder="e.g., 30" min="0" style="width: 100%; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 13px; box-sizing: border-box; outline:none;">
                        </div>
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #161616;">Additional comments (optional):</label>
                            <textarea class="feedback-textarea" id="text_${msgId}" placeholder="Share your thoughts or suggestions..." rows="2"></textarea>
                        </div>
                    </div>
                    <!-- DISLIKE FORM: how to improve -->
                    <div id="dislike_form_${msgId}" style="display:none;">
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; font-size: 13px; font-weight: 600; margin-bottom: 4px; color: #161616;">How can we improve this response?</label>
                            <textarea class="feedback-textarea" id="improve_${msgId}" placeholder="Tell us how we can improve..." rows="3"></textarea>
                        </div>
                    </div>
                    <button class="feedback-submit-btn" onclick="submitFeedback('${msgId}')">Submit Feedback</button>
                    <div class="feedback-submitted" id="submitted_${msgId}">✅ Thank you for your feedback!</div>
                `;

                wrapper.appendChild(feedbackRow);
                wrapper.appendChild(feedbackForm);
            }

            messageDiv.appendChild(avatar);
            messageDiv.appendChild(wrapper);
            messagesWrapper.appendChild(messageDiv);
            
            // Scroll to bottom
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function addBotMessage(content) {
            addMessage(content, false);
        }

        function addUserMessage(content) {
            addMessage(content, true);
        }

        function showTypingIndicator() {
            const messagesWrapper = document.querySelector('.messages-wrapper');
            const typingDiv = document.createElement('div');
            typingDiv.className = 'message bot';
            typingDiv.id = 'typingIndicator';
            typingDiv.innerHTML = `
                <div class="message-avatar">🤖</div>
                <div class="message-wrapper">
                    <div class="typing-indicator active">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            `;
            messagesWrapper.appendChild(typingDiv);
            
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function hideTypingIndicator() {
            const typingIndicator = document.getElementById('typingIndicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
        }

        function sendQuickMessage(message) {
            // Track sidebar click
            trackSidebarClick(message);
            
            addUserMessage(message);
            showTypingIndicator();
            
            setTimeout(() => {
                hideTypingIndicator();
                processMessage(message);
            }, 1000);
        }
        function sendMessage() {
            const input = document.getElementById('userInput');
            const message = input.value.trim();
            
            if (message) {
                addUserMessage(message);
                input.value = '';
                input.style.height = 'auto';
                showTypingIndicator();
                
                setTimeout(() => {
                    hideTypingIndicator();
                    processMessage(message);
                }, 1000);
            }
        }

        function handleInputKeyPress(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        }

        function autoResizeTextarea(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }


        async function processMessage(message) {
            const lowerMessage = message.toLowerCase();
            
            // Check troubleshooting first (before general mashup check)
            if (lowerMessage.includes('blank page') ||
                lowerMessage.includes('blank screen') ||
                lowerMessage.includes('totalnumberofrecords') ||
                lowerMessage.includes('mashup not displaying') ||
                lowerMessage.includes('empty page') ||
                lowerMessage.includes('mashup overriding') ||
                (lowerMessage.includes('blank') && lowerMessage.includes('mashup'))) {
                await showTroubleshootBlankPage();
            } else if (lowerMessage.includes('duplicate popup') ||
                      lowerMessage.includes('duplicate pop-up') ||
                      lowerMessage.includes('duplicate modal') ||
                      lowerMessage.includes('multiple popups') ||
                      lowerMessage.includes('two popups') ||
                      lowerMessage.includes('useclass')) {
                await showTroubleshootDuplicatePopups();
            } else if (lowerMessage.includes('config customization') ||
                lowerMessage.includes('configuration customization') ||
                lowerMessage.includes('customize by configuration') ||
                lowerMessage.includes('how to customize call center by configuration') ||
                lowerMessage.includes('how to customize by configuration')) {
                showConfigCustomization();
            } else if (lowerMessage.includes('customize existing action') ||
                      lowerMessage.includes('existing action')) {
                showCustomizeExistingAction();
            } else if (lowerMessage.includes('custom action with config') ||
                      lowerMessage.includes('implement custom action with config') ||
                      lowerMessage.includes('action with config')) {
                showCustomActionWithConfig();
            } else if (lowerMessage.includes('custom action with code') ||
                      lowerMessage.includes('implement custom action with code') ||
                      lowerMessage.includes('action with code')) {
                showCustomActionWithCode();
            } else if (lowerMessage.includes('home portlet customization') ||
                      lowerMessage.includes('customize home portlet') ||
                      lowerMessage.includes('home portlet')) {
                showHomePortletCustomization();
            } else if (lowerMessage.includes('shared component customization') ||
                      lowerMessage.includes('customize shared component') ||
                      lowerMessage.includes('shared component')) {
                showSharedComponentCustomization();
            } else if (lowerMessage.includes('component customization') ||
                      lowerMessage.includes('features component customization') ||
                      lowerMessage.includes('customize component') ||
                      lowerMessage.includes('component custom') ||
                      lowerMessage.includes('how to customize features component') ||
                      lowerMessage.includes('customize features component') ||
                      lowerMessage.includes('features component') ||
                      lowerMessage.includes('call center features component')) {
                showComponentCustomization();
            } else if (lowerMessage.includes('setup') || lowerMessage.includes('environment')) {
                showDevEnvironmentSetup();
            } else if (lowerMessage === 'admin' || lowerMessage === 'admin panel' || lowerMessage === 'visitor tracker') {
                showAdminPanel();
            } else if (lowerMessage.includes('incremental mashup')) {
                showIncrementalMashup();
            } else if (lowerMessage.includes('override mashup')) {
                showOverrideMashup();
            } else if (lowerMessage.includes('mashup extension') || lowerMessage.includes('mashup')) {
                showMashupOptions();
            } else if (lowerMessage.includes('planned enhancement') || lowerMessage.includes('planned enhancements')) {
                showPlannedEnhancements();
            } else if (lowerMessage.includes('help')) {
                showHelp();
            } else if (lowerMessage.includes('example')) {
                showExamples();
            } else {
                addBotMessage(`
                    <strong>I can help you with:</strong><br><br>
                    • Configuration customization<br>
                    • Component customization<br>
                    • Environment setup<br>
                    • Troubleshooting (blank page, duplicate popups)<br>
                    • Examples<br>
                    • General help<br><br>
                    <em>What would you like to know about?</em>
                `);
            }
        }

