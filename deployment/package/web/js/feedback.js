        function handleLike(msgId) {
            const likeBtn = document.getElementById('like_' + msgId);
            const dislikeBtn = document.getElementById('dislike_' + msgId);
            const feedbackForm = document.getElementById('form_' + msgId);
            const likeFormSection = document.getElementById('like_form_' + msgId);
            const dislikeFormSection = document.getElementById('dislike_form_' + msgId);

            // Toggle like
            if (likeBtn.classList.contains('liked')) {
                likeBtn.classList.remove('liked');
                feedbackForm.classList.remove('visible');
                likeFormSection.style.display = 'none';
            } else {
                likeBtn.classList.add('liked');
                dislikeBtn.classList.remove('disliked');
                feedbackForm.classList.add('visible');
                likeFormSection.style.display = 'block';
                dislikeFormSection.style.display = 'none';
            }
        }

        function handleDislike(msgId) {
            const likeBtn = document.getElementById('like_' + msgId);
            const dislikeBtn = document.getElementById('dislike_' + msgId);
            const feedbackForm = document.getElementById('form_' + msgId);
            const likeFormSection = document.getElementById('like_form_' + msgId);
            const dislikeFormSection = document.getElementById('dislike_form_' + msgId);

            // Toggle dislike
            if (dislikeBtn.classList.contains('disliked')) {
                dislikeBtn.classList.remove('disliked');
                feedbackForm.classList.remove('visible');
                dislikeFormSection.style.display = 'none';
            } else {
                dislikeBtn.classList.add('disliked');
                likeBtn.classList.remove('liked');
                feedbackForm.classList.add('visible');
                dislikeFormSection.style.display = 'block';
                likeFormSection.style.display = 'none';
            }
        }

        function submitFeedback(msgId) {
            const submittedMsg = document.getElementById('submitted_' + msgId);
            const likeBtn = document.getElementById('like_' + msgId);
            const reaction = likeBtn.classList.contains('liked') ? 'like' : 'dislike';

            let feedbackData = {};

            if (reaction === 'like') {
                // LIKE: Get time saved and comments
                const timeSavedInput = document.getElementById('timesaved_' + msgId);
                const textarea = document.getElementById('text_' + msgId);
                
                const timeSaved = timeSavedInput.value.trim();
                const comments = textarea.value.trim();

                feedbackData = {
                    experience: null,
                    timeSaved: timeSaved || '0',
                    comments: comments
                };

                // Disable form fields
                timeSavedInput.disabled = true;
                textarea.disabled = true;
            } else {
                // DISLIKE: Get improvement suggestions only
                const improveTextarea = document.getElementById('improve_' + msgId);
                const improvementText = improveTextarea.value.trim();

                if (!improvementText) {
                    alert('Please tell us how we can improve.');
                    return;
                }

                feedbackData = {
                    experience: null,
                    timeSaved: null,
                    comments: improvementText
                };

                // Disable form field
                improveTextarea.disabled = true;
            }

            // Save feedback to server
            saveFeedback(msgId, reaction, feedbackData);
            submittedMsg.classList.add('visible');

            // Hide submit button
            event.target.style.display = 'none';
        }

        async function saveFeedback(msgId, reaction, feedbackData) {
            try {
                const apiUrl = DEPLOYMENT_CONFIG.getApiUrl();
                await fetch(`${apiUrl}/api/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        msgId: msgId,
                        reaction: reaction,
                        experience: feedbackData.experience || null,
                        timeSaved: feedbackData.timeSaved || '0',
                        comments: feedbackData.comments || null,
                        timestamp: new Date().toISOString()
                    })
                });
            } catch (e) {
                console.error('Failed to save feedback:', e);
            }
        }

        async function getFeedbacks() {
            try {
                const res = await fetch('/api/feedback');
                return await res.json();
            } catch (e) {
                console.error('Failed to get feedbacks:', e);
                return [];
            }
        }

        async function clearFeedbacks() {
            if (!isAdminAuthenticated) {
                addBotMessage('<div class="warning">⚠️ Admin authentication required to clear feedback data.</div>');
                return;
            }
            const apiUrl = DEPLOYMENT_CONFIG.getApiUrl();
            await fetch(`${apiUrl}/api/feedback/clear`, { method: 'POST' });
        }

        async function clearFeedbacksAndNotify() {
            await clearFeedbacks();
            addBotMessage('<div class="success">✅ Feedback data cleared!</div>');
            // Reload admin panel to show updated data
            setTimeout(() => loadAdminPanel(), 500);
        }



        function startNewChat() {
            const messagesWrapper = document.querySelector('.messages-wrapper');
            messagesWrapper.innerHTML = '';
            lastRequirement = '';
            conversationContext = {
                lastChangeType: '',
                lastModule: '',
                userPreferences: {
                    verboseMode: false
                }
            };
            
            // Show welcome message
            setTimeout(() => {
                addBotMessage(`
                    <strong>👋 Welcome to Next-Gen Call-Center Customization Assistant!</strong><br><br>
                    I can help you with:<br>
                    • Configuration customization<br>
                    • Component customization<br>
                    • Environment setup<br>
                    • Code examples<br>
                    • General guidance<br><br>
                    <em>👈 Please select a topic from the suggestions on the left.</em>
                `);
            }, 500);
        }

        // ============================================================
        // IP TRACKER - Visitor Tracking
        // ============================================================

        // ============================================================
        // USERNAME INITIALIZATION - RUNS IMMEDIATELY
        // ============================================================
        
        // Set username IMMEDIATELY before any API calls
        window.OMS_USERNAME = localStorage.getItem('oms_visitor_username') || 'Anonymous';
        console.log('Initial username set:', window.OMS_USERNAME);

        // ============================================================
        // USERNAME MODAL FUNCTIONS
        // ============================================================
        
        function handleUsernameKeyPress(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitUsername();
            }
        }

        function submitUsername() {
            const username = document.getElementById('usernameInput').value.trim();
            if (username) {
                localStorage.setItem('oms_visitor_username', username);
                window.OMS_USERNAME = username;
                console.log('Username updated:', username);
            } else {
                // If empty, treat as skip
                skipUsername();
                return;
            }
            closeUsernameModal();
        }

        function skipUsername() {
            localStorage.setItem('oms_visitor_username', 'Anonymous');
            window.OMS_USERNAME = 'Anonymous';
            console.log('Username skipped - set to Anonymous');
            closeUsernameModal();
        }

        function closeUsernameModal() {
            document.getElementById('usernameModal').classList.remove('active');
            // Focus on chat input after closing modal
            setTimeout(() => {
                document.getElementById('userInput').focus();
            }, 300);
        }

        // Show/hide modal based on stored username
        window.addEventListener('DOMContentLoaded', function() {
            const username = localStorage.getItem('oms_visitor_username');
            const modal = document.getElementById('usernameModal');
            
            if (username) {
                // User already has a username - hide modal
                modal.classList.remove('active');
                console.log('Existing username loaded:', username);
            } else {
                // New user - ensure modal is visible and focus input
                modal.classList.add('active');
                setTimeout(() => {
                    document.getElementById('usernameInput').focus();
                }, 300);
            }
        });

        async function trackVisitor() {
            // Username already initialized above
            console.log('trackVisitor called - username:', window.OMS_USERNAME);
        }

        // Track sidebar clicks by sending a lightweight API request
        async function trackSidebarClick(action) {
            try {
                const apiUrl = DEPLOYMENT_CONFIG.getApiUrl();
                await fetch(`${apiUrl}/api/track-action`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Username': window.OMS_USERNAME || 'Anonymous'
                    },
                    body: JSON.stringify({
                        action: action,
                        type: 'sidebar_click'
                    })
                });
                console.log('📊 Sidebar click tracked:', action);
            } catch (error) {
                console.log('Failed to track sidebar click:', error);
            }
        }

