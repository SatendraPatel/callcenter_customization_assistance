        function showAdminPanel() {
            // Show password modal
            document.getElementById('adminModal').classList.add('active');
            document.getElementById('adminPassword').value = '';
            document.getElementById('modalError').classList.remove('visible');
            document.getElementById('adminPassword').focus();
        }

        function closeAdminModal() {
            document.getElementById('adminModal').classList.remove('active');
        }
        function handleAdminPasswordKeyPress(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitAdminPassword();
            }
        }


        async function submitAdminPassword() {
            const pwd = document.getElementById('adminPassword').value;
            const errorEl = document.getElementById('modalError');
            const inputEl = document.getElementById('adminPassword');

            if (pwd !== '2026') {
                errorEl.classList.add('visible');
                inputEl.classList.add('error');
                setTimeout(() => inputEl.classList.remove('error'), 300);
                return;
            }

            // Set admin authentication flag
            isAdminAuthenticated = true;
            
            // Close modal and show admin panel
            closeAdminModal();
            await loadAdminPanel();
        }

        async function loadAdminPanel() {
            try {
                // Fetch visitor data and feedback from server API (SQLite)
                const [visitorRes, feedbackRes] = await Promise.all([
                    fetch('/api/visitors'),
                    fetch('/api/feedback')
                ]);
                const visitors = await visitorRes.json();
                const feedbacks = await feedbackRes.json();

                const totalVisits = visitors.length;
                const uniqueIPs = [...new Set(visitors.map(v => v.ip))];

                let tableRows = '';
                // Show most recent first (already ordered DESC from server)
                const recentVisitors = visitors.slice(0, 100);
                recentVisitors.forEach((v, i) => {
                    const location = v.city && v.country ? v.city + ', ' + v.country : (v.country || '-');
                    tableRows += '<tr style="border-bottom:1px solid #e0e0e0;">' +
                        '<td style="padding:8px;">' + (i + 1) + '</td>' +
                        '<td style="padding:8px;font-weight:600;color:#0f62fe;">' + v.ip + '</td>' +
                        '<td style="padding:8px;">' + location + '</td>' +
                        '<td style="padding:8px;">' + v.time + '</td>' +
                        '<td style="padding:8px;font-size:11px;color:#525252;max-width:250px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + v.userAgent + '</td>' +
                        '</tr>';
                });

                // Build feedback section from SQLite via API
                const likes = feedbacks.filter(f => f.reaction === 'like').length;
                const dislikes = feedbacks.filter(f => f.reaction === 'dislike').length;
                
                // Calculate average time saved
                const totalTimeSaved = feedbacks.reduce((sum, f) => sum + parseInt(f.timeSaved || 0), 0);
                const avgTimeSaved = feedbacks.length > 0 ? Math.round(totalTimeSaved / feedbacks.length) : 0;

                let feedbackRows = '';
                if (feedbacks.length === 0) {
                    feedbackRows = '<tr><td colspan="6" style="padding:12px;text-align:center;color:#8d8d8d;">No feedback submitted yet.</td></tr>';
                } else {
                    feedbacks.forEach((f, i) => {
                        const reactionIcon = f.reaction === 'like' ? '👍' : '👎';
                        const reactionColor = f.reaction === 'like' ? '#28a745' : '#da1e28';
                        const experienceMap = {
                            'excellent': '⭐⭐⭐⭐⭐',
                            'good': '⭐⭐⭐⭐',
                            'average': '⭐⭐⭐',
                            'poor': '⭐⭐',
                            'very-poor': '⭐'
                        };
                        feedbackRows += '<tr style="border-bottom:1px solid #e0e0e0;">' +
                            '<td style="padding:8px;">' + (i + 1) + '</td>' +
                            '<td style="padding:8px;"><span style="color:' + reactionColor + ';font-size:16px;">' + reactionIcon + '</span></td>' +
                            '<td style="padding:8px;">' + (experienceMap[f.experience] || '-') + '</td>' +
                            '<td style="padding:8px;font-weight:600;color:#0f62fe;">' + (f.timeSaved || '0') + ' min</td>' +
                            '<td style="padding:8px;font-size:12px;color:#525252;">' + new Date(f.timestamp).toLocaleString() + '</td>' +
                            '<td style="padding:8px;max-width:300px;">' + (f.comments || '<em style="color:#8d8d8d;">No comments</em>') + '</td>' +
                            '</tr>';
                    });
                }

                const adminHTML = '<strong>🔐 Admin Panel - Visitor Tracker (Server-Side)</strong><br><br>' +
                    '<div style="display:flex;gap:20px;margin-bottom:16px;flex-wrap:wrap;">' +
                    '<div style="background:#0f62fe;color:white;padding:12px 20px;border-radius:4px;text-align:center;">' +
                    '<div style="font-size:24px;font-weight:700;">' + totalVisits + '</div>' +
                    '<div style="font-size:12px;">Total Visits</div></div>' +
                    '<div style="background:#198038;color:white;padding:12px 20px;border-radius:4px;text-align:center;">' +
                    '<div style="font-size:24px;font-weight:700;">' + uniqueIPs.length + '</div>' +
                    '<div style="font-size:12px;">Unique IPs</div></div>' +
                    '<div style="background:#28a745;color:white;padding:12px 20px;border-radius:4px;text-align:center;">' +
                    '<div style="font-size:24px;font-weight:700;">' + likes + '</div>' +
                    '<div style="font-size:12px;">👍 Likes</div></div>' +
                    '<div style="background:#da1e28;color:white;padding:12px 20px;border-radius:4px;text-align:center;">' +
                    '<div style="font-size:24px;font-weight:700;">' + dislikes + '</div>' +
                    '<div style="font-size:12px;">👎 Dislikes</div></div>' +
                    '<div style="background:#8a3ffc;color:white;padding:12px 20px;border-radius:4px;text-align:center;">' +
                    '<div style="font-size:24px;font-weight:700;">' + avgTimeSaved + '</div>' +
                    '<div style="font-size:12px;">⏱️ Avg Time Saved (min)</div></div>' +
                    '</div>' +
                    '<strong>Recent Visitors (Last 100):</strong><br>' +
                    '<div style="overflow-x:auto;margin-top:8px;">' +
                    '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
                    '<thead><tr style="background:#f4f4f4;">' +
                    '<th style="padding:8px;text-align:left;">#</th>' +
                    '<th style="padding:8px;text-align:left;">IP Address</th>' +
                    '<th style="padding:8px;text-align:left;">Location</th>' +
                    '<th style="padding:8px;text-align:left;">Visit Time</th>' +
                    '<th style="padding:8px;text-align:left;">Browser</th>' +
                    '</tr></thead>' +
                    '<tbody>' + tableRows + '</tbody>' +
                    '</table></div><br>' +
                    '<strong>All Unique IPs:</strong><br>' +
                    uniqueIPs.map(ip => '<span style="display:inline-block;background:#e8e8e8;padding:4px 10px;border-radius:12px;margin:3px;font-size:13px;">' + ip + '</span>').join('') +
                    '<br><br>' +
                    '<strong>💬 User Feedback Details:</strong><br>' +
                    '<div style="overflow-x:auto;margin-top:8px;">' +
                    '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
                    '<thead><tr style="background:#f4f4f4;">' +
                    '<th style="padding:8px;text-align:left;">#</th>' +
                    '<th style="padding:8px;text-align:left;">Reaction</th>' +
                    '<th style="padding:8px;text-align:left;">Experience</th>' +
                    '<th style="padding:8px;text-align:left;">Time Saved</th>' +
                    '<th style="padding:8px;text-align:left;">Submitted</th>' +
                    '<th style="padding:8px;text-align:left;">Comments</th>' +
                    '</tr></thead>' +
                    '<tbody>' + feedbackRows + '</tbody>' +
                    '</table></div><br>' +
                    '<button onclick="clearVisitorData()" style="background:#da1e28;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;margin-right:8px;">🗑️ Clear Visitor Data</button>' +
                    '<button onclick="clearFeedbacksAndNotify()" style="background:#6f6f6f;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;font-size:13px;">🗑️ Clear Feedback Data</button>';

                addBotMessage(adminHTML);
            } catch (error) {
                addBotMessage('<div class="warning">⚠️ Failed to load visitor data. Make sure the Node.js server is running.</div>');
                console.error('Error fetching visitors:', error);
            }
        }

        async function clearVisitorData() {
            try {
                await fetch('/api/visitors/clear', { method: 'POST' });
                addBotMessage('<div class="success">✅ Visitor data cleared successfully!</div>');
            } catch (error) {
                addBotMessage('<div class="warning">⚠️ Failed to clear data.</div>');
            }
        }

        // Initialize with welcome message
        window.onload = function() {
            trackVisitor();
            startNewChat();
        };
