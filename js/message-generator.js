/**
 * Message Generator for Largo Lab Portal
 * Converts announcements into formatted Email and Microsoft Teams messages
 * Kaiser Permanente Largo Laboratory
 */

class MessageGenerator {
    constructor() {
        this.staffList = [
            // Laboratory Staff
            'Francis', 'Dat', 'Steeven', 'Tracy', 'Albert', 'Boyet', 'George',
            // Phlebotomy Staff
            'Christina', 'Youlana', 'Netta', 'Anne', 'Raquel', 'Emma', 'Mimi',
            'Farah', 'Stephanie', 'Nichole', 'Danalisa'
        ];
    }

    /**
     * Generate email format for announcement
     */
    generateEmail(announcement) {
        const templates = {
            motivational: this.motivationalEmailTemplate,
            policy: this.policyEmailTemplate,
            equipment: this.equipmentEmailTemplate,
            training: this.trainingEmailTemplate,
            safety: this.safetyEmailTemplate,
            recognition: this.recognitionEmailTemplate
        };

        const templateFunction = templates[announcement.type] || this.defaultEmailTemplate;
        return templateFunction.call(this, announcement);
    }

    /**
     * Generate Teams message format for announcement
     */
    generateTeams(announcement) {
        const templates = {
            motivational: this.motivationalTeamsTemplate,
            policy: this.policyTeamsTemplate,
            equipment: this.equipmentTeamsTemplate,
            training: this.trainingTeamsTemplate,
            safety: this.safetyTeamsTemplate,
            recognition: this.recognitionTeamsTemplate
        };

        const templateFunction = templates[announcement.type] || this.defaultTeamsTemplate;
        return templateFunction.call(this, announcement);
    }

    /**
     * EMAIL TEMPLATES
     */

    motivationalEmailTemplate(announcement) {
        return {
            subject: `🌟 ${announcement.title} 🌟`,
            body: `
                <p><strong>Good Morning Largo Lab Team!</strong></p>

                <p>${this.formatContent(announcement.content)}</p>

                <p style="margin-top: 20px;">Let's make today amazing! Your dedication to excellence makes a real difference in patient care.</p>

                <p style="margin-top: 20px; color: #0066cc; font-weight: bold;">Together We Excel!</p>

                <hr style="border: 1px solid #e3f2fd; margin: 20px 0;">

                <p style="font-size: 12px; color: #666;">
                    <strong>Kaiser Permanente Largo Laboratory</strong><br>
                    Largo Medical Office Building | Ambulatory Care Center
                </p>
            `
        };
    }

    policyEmailTemplate(announcement) {
        return {
            subject: `📋 IMPORTANT: ${announcement.title}`,
            body: `
                <div style="background: #fff3e0; padding: 15px; border-left: 5px solid #ff9800; margin-bottom: 20px;">
                    <strong style="color: #e65100;">⚠️ POLICY UPDATE - ACTION REQUIRED</strong>
                </div>

                <p><strong>All Largo Laboratory Staff,</strong></p>

                <p>Please review the following policy update:</p>

                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    ${this.formatContent(announcement.content)}
                </div>

                <p style="margin-top: 20px;"><strong>Effective Date:</strong> Immediately</p>

                <p><strong>Questions?</strong> Contact your supervisor or laboratory manager.</p>

                <p style="margin-top: 20px; color: #f44336; font-weight: bold;">Acknowledgment required - Please confirm receipt of this policy update.</p>

                <hr style="border: 1px solid #e3f2fd; margin: 20px 0;">

                <p style="font-size: 12px; color: #666;">
                    <strong>Kaiser Permanente Largo Laboratory - Policy & Procedures</strong><br>
                    For urgent concerns, contact Laboratory Manager immediately.
                </p>
            `
        };
    }

    equipmentEmailTemplate(announcement) {
        return {
            subject: `🔧 Equipment Notice: ${announcement.title}`,
            body: `
                <p><strong>Laboratory Staff,</strong></p>

                <p>Important equipment notification:</p>

                <div style="background: #f3e5f5; padding: 15px; border-left: 5px solid #9c27b0; margin: 15px 0;">
                    ${this.formatContent(announcement.content)}
                </div>

                <p style="margin-top: 20px;"><strong>Action Required:</strong></p>
                <ul>
                    <li>Review the information above carefully</li>
                    <li>Follow all equipment-specific protocols</li>
                    <li>Document any issues in the maintenance log</li>
                    <li>Contact Equipment Coordinator with questions</li>
                </ul>

                <p style="margin-top: 20px;"><strong>Equipment Support Contacts:</strong></p>
                <ul style="font-size: 13px;">
                    <li>Roche (Chemistry): 1-800-428-2336</li>
                    <li>Sysmex (Hematology): 1-888-879-7639</li>
                    <li>Beckman Coulter: 1-800-526-3821</li>
                    <li>Stago (Coagulation): 1-800-221-8864</li>
                </ul>

                <hr style="border: 1px solid #e3f2fd; margin: 20px 0;">

                <p style="font-size: 12px; color: #666;">
                    <strong>Kaiser Permanente Largo Laboratory - Equipment Services</strong>
                </p>
            `
        };
    }

    trainingEmailTemplate(announcement) {
        return {
            subject: `🎓 Training Notification: ${announcement.title}`,
            body: `
                <p><strong>Largo Lab Team,</strong></p>

                <div style="background: #e8f5e9; padding: 15px; border-left: 5px solid #4caf50; margin: 15px 0;">
                    <strong style="color: #2e7d32;">📚 TRAINING OPPORTUNITY</strong>
                </div>

                ${this.formatContent(announcement.content)}

                <p style="margin-top: 20px;"><strong>Training Expectations:</strong></p>
                <ul>
                    <li>Attendance is mandatory unless otherwise noted</li>
                    <li>Bring questions and actively participate</li>
                    <li>Complete any pre-training materials</li>
                    <li>Sign attendance sheet for competency records</li>
                </ul>

                <p style="margin-top: 20px;"><strong>Registration:</strong> Please confirm your attendance by replying to this email.</p>

                <p style="margin-top: 20px; color: #4caf50; font-weight: bold;">Investing in your professional development!</p>

                <hr style="border: 1px solid #e3f2fd; margin: 20px 0;">

                <p style="font-size: 12px; color: #666;">
                    <strong>Kaiser Permanente Largo Laboratory - Education & Training</strong>
                </p>
            `
        };
    }

    safetyEmailTemplate(announcement) {
        return {
            subject: `⚠️ SAFETY ALERT: ${announcement.title}`,
            body: `
                <div style="background: #ffebee; padding: 20px; border: 3px solid #f44336; margin-bottom: 20px; border-radius: 8px;">
                    <h2 style="color: #c62828; margin: 0;">⚠️ SAFETY ALERT ⚠️</h2>
                    <p style="margin: 5px 0 0 0; color: #d32f2f; font-weight: bold;">IMMEDIATE ATTENTION REQUIRED</p>
                </div>

                <p><strong>All Laboratory Personnel,</strong></p>

                <p style="font-size: 16px; font-weight: bold; color: #d32f2f;">PLEASE READ IMMEDIATELY</p>

                <div style="background: #fff3e0; padding: 15px; margin: 15px 0;">
                    ${this.formatContent(announcement.content)}
                </div>

                <p style="margin-top: 20px;"><strong>Immediate Actions:</strong></p>
                <ul>
                    <li>Stop and assess your current work environment</li>
                    <li>Implement safety measures described above</li>
                    <li>Report any concerns immediately to your supervisor</li>
                    <li>Do not proceed if unsafe conditions exist</li>
                </ul>

                <p style="margin-top: 20px; background: #ffebee; padding: 15px; border-left: 5px solid #f44336;">
                    <strong>Emergency Contact:</strong> Supervisor on duty or call Security at ext. 5555
                </p>

                <p style="margin-top: 20px; color: #f44336; font-weight: bold; font-size: 16px;">
                    Your safety is our priority. Never compromise safety for speed.
                </p>

                <hr style="border: 1px solid #e3f2fd; margin: 20px 0;">

                <p style="font-size: 12px; color: #666;">
                    <strong>Kaiser Permanente Largo Laboratory - Safety Department</strong><br>
                    For safety concerns: Contact Safety Officer immediately
                </p>
            `
        };
    }

    recognitionEmailTemplate(announcement) {
        return {
            subject: `🌟 Team Recognition: ${announcement.title}`,
            body: `
                <div style="background: linear-gradient(135deg, #fff9e6 0%, #ffe8b3 100%); padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #e65100; margin: 0;">🌟 CELEBRATING EXCELLENCE 🌟</h2>
                </div>

                <p><strong>Largo Lab Family,</strong></p>

                <p>It's time to celebrate outstanding performance and dedication!</p>

                <div style="background: #f8f9fa; padding: 20px; border-left: 5px solid #ff9800; margin: 15px 0;">
                    ${this.formatContent(announcement.content)}
                </div>

                <p style="margin-top: 20px; font-size: 16px; color: #0066cc; font-weight: bold;">
                    Thank you for exemplifying Kaiser Permanente values and making our laboratory exceptional!
                </p>

                <p style="margin-top: 20px;">Your dedication inspires us all. Keep up the amazing work! 🎉</p>

                <hr style="border: 1px solid #e3f2fd; margin: 20px 0;">

                <p style="font-size: 12px; color: #666;">
                    <strong>Kaiser Permanente Largo Laboratory Leadership</strong><br>
                    Together We Thrive
                </p>
            `
        };
    }

    defaultEmailTemplate(announcement) {
        return {
            subject: announcement.title,
            body: `
                <p><strong>Largo Laboratory Team,</strong></p>

                ${this.formatContent(announcement.content)}

                <p style="margin-top: 20px;">Thank you for your attention to this matter.</p>

                <hr style="border: 1px solid #e3f2fd; margin: 20px 0;">

                <p style="font-size: 12px; color: #666;">
                    <strong>Kaiser Permanente Largo Laboratory</strong>
                </p>
            `
        };
    }

    /**
     * TEAMS TEMPLATES
     */

    motivationalTeamsTemplate(announcement) {
        return {
            body: `
                <p><strong>🌟 ${announcement.title.toUpperCase()} 🌟</strong></p>

                <p>${this.formatContentTeams(announcement.content)}</p>

                <p>💪 Let's make today AMAZING! 💪</p>

                <p style="margin-top: 15px;">
                    <strong>👉 React with ❤️ if you're ready to excel today!</strong>
                </p>

                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                    #motivation #teamwork #largolab
                </p>
            `
        };
    }

    policyTeamsTemplate(announcement) {
        return {
            body: `
                <p><strong>📢 ATTENTION ALL STAFF 📢</strong></p>

                <div style="background: #fff3e0; padding: 12px; border-left: 4px solid #ff9800; margin: 10px 0;">
                    <p><strong style="color: #e65100;">⚠️ POLICY UPDATE</strong></p>
                </div>

                <p>${this.formatContentTeams(announcement.content)}</p>

                <p style="margin-top: 15px;">
                    <strong>👉 Please acknowledge by reacting with 👍</strong>
                </p>

                <p style="margin-top: 10px; font-size: 13px; color: #666;">
                    Questions? Contact your supervisor.
                </p>

                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                    #policyupdate #important #largolab
                </p>
            `
        };
    }

    equipmentTeamsTemplate(announcement) {
        return {
            body: `
                <p><strong>🔧 EQUIPMENT NOTICE 🔧</strong></p>

                <p>${this.formatContentTeams(announcement.content)}</p>

                <p style="margin-top: 15px;">
                    <strong>📞 Equipment Support:</strong><br>
                    • Roche: 1-800-428-2336<br>
                    • Sysmex: 1-888-879-7639<br>
                    • Beckman: 1-800-526-3821
                </p>

                <p style="margin-top: 15px;">
                    <strong>👉 React with ✅ when you've reviewed this</strong>
                </p>

                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                    #equipment #maintenance #largolab
                </p>
            `
        };
    }

    trainingTeamsTemplate(announcement) {
        return {
            body: `
                <p><strong>🎓 TRAINING ANNOUNCEMENT 🎓</strong></p>

                <div style="background: #e8f5e9; padding: 12px; border-left: 4px solid #4caf50; margin: 10px 0;">
                    <p><strong style="color: #2e7d32;">📚 Professional Development Opportunity</strong></p>
                </div>

                <p>${this.formatContentTeams(announcement.content)}</p>

                <p style="margin-top: 15px;">
                    <strong>👉 Confirm attendance by replying to this message</strong>
                </p>

                <p style="margin-top: 10px; font-size: 13px; color: #4caf50; font-weight: bold;">
                    Investing in YOUR success! 🌟
                </p>

                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                    #training #education #largolab
                </p>
            `
        };
    }

    safetyTeamsTemplate(announcement) {
        return {
            body: `
                <div style="background: #ffebee; padding: 15px; border: 3px solid #f44336; margin-bottom: 15px;">
                    <p><strong style="color: #c62828; font-size: 16px;">⚠️ SAFETY ALERT ⚠️</strong></p>
                    <p style="color: #d32f2f; margin: 5px 0 0 0;">IMMEDIATE ATTENTION REQUIRED</p>
                </div>

                <p><strong>READ IMMEDIATELY:</strong></p>

                <p>${this.formatContentTeams(announcement.content)}</p>

                <p style="margin-top: 15px; background: #fff3e0; padding: 10px; border-left: 4px solid #ff9800;">
                    <strong>🚨 Report concerns immediately to supervisor or Security (ext. 5555)</strong>
                </p>

                <p style="margin-top: 15px;">
                    <strong>👉 Acknowledge with ⚠️ reaction when you've read this</strong>
                </p>

                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                    #safety #urgent #largolab
                </p>
            `
        };
    }

    recognitionTeamsTemplate(announcement) {
        return {
            body: `
                <p><strong>🌟 CELEBRATING EXCELLENCE 🌟</strong></p>

                <div style="background: #fff9e6; padding: 12px; border-left: 4px solid #ff9800; margin: 10px 0;">
                    <p>${this.formatContentTeams(announcement.content)}</p>
                </div>

                <p style="margin-top: 15px; font-size: 16px;">
                    🎉 <strong>THANK YOU for making our lab amazing!</strong> 🎉
                </p>

                <p style="margin-top: 15px;">
                    <strong>👉 Show your appreciation with 👏 and ❤️ reactions!</strong>
                </p>

                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                    #recognition #teamwork #excellence #largolab
                </p>
            `
        };
    }

    defaultTeamsTemplate(announcement) {
        return {
            body: `
                <p><strong>${announcement.title}</strong></p>

                <p>${this.formatContentTeams(announcement.content)}</p>

                <p style="margin-top: 15px;">
                    <strong>👉 Questions? Contact your supervisor</strong>
                </p>

                <p style="font-size: 12px; color: #666; margin-top: 15px;">
                    #largolab
                </p>
            `
        };
    }

    /**
     * UTILITY METHODS
     */

    formatContent(content) {
        // Convert line breaks to paragraphs
        const paragraphs = content.split('\n').filter(p => p.trim() !== '');
        return paragraphs.map(p => `<p>${this.escapeHtml(p)}</p>`).join('');
    }

    formatContentTeams(content) {
        // Teams format - more casual, preserve line breaks
        return this.escapeHtml(content).replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Add @mentions for Teams
     */
    addMentions(content, staffNames) {
        let result = content;
        staffNames.forEach(name => {
            const regex = new RegExp(`\\b${name}\\b`, 'gi');
            result = result.replace(regex, `@${name}`);
        });
        return result;
    }

    /**
     * Suggest emojis based on content
     */
    suggestEmojis(content) {
        const suggestions = {
            safety: ['⚠️', '🚨', '🛑'],
            success: ['✅', '🎉', '👏'],
            warning: ['⚠️', '🔶', '❗'],
            celebration: ['🎉', '🎊', '🌟'],
            medical: ['🔬', '🩺', '💉'],
            equipment: ['🔧', '⚙️', '🛠️']
        };

        const lowerContent = content.toLowerCase();
        const emojis = [];

        if (lowerContent.includes('safety') || lowerContent.includes('alert')) {
            emojis.push(...suggestions.safety);
        }
        if (lowerContent.includes('success') || lowerContent.includes('excellent')) {
            emojis.push(...suggestions.success);
        }
        if (lowerContent.includes('equipment') || lowerContent.includes('maintenance')) {
            emojis.push(...suggestions.equipment);
        }
        if (lowerContent.includes('congratulations') || lowerContent.includes('recognition')) {
            emojis.push(...suggestions.celebration);
        }

        return [...new Set(emojis)]; // Remove duplicates
    }

    /**
     * Export announcement as PDF (requires external library)
     */
    exportToPDF(announcement, format) {
        // This would require a PDF generation library like jsPDF
        console.log('PDF export would be implemented with jsPDF library');
        return {
            success: true,
            message: 'PDF export functionality requires jsPDF library'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessageGenerator;
}
