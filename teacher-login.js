// Teacher Login JavaScript - Final Version
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    console.log('Teacher login page loaded');
    
    // Test sessionStorage availability
    function testSessionStorage() {
        try {
            const test = '__sessionStorage_test__';
            sessionStorage.setItem(test, test);
            const result = sessionStorage.getItem(test);
            sessionStorage.removeItem(test);
            return result === test;
        } catch (e) {
            console.error('sessionStorage test failed:', e);
            return false;
        }
    }
    
    if (!testSessionStorage()) {
        console.warn('sessionStorage is not available');
    }
    
    // Check if already logged in
    const existingSession = sessionStorage.getItem('teacherSession');
    if (existingSession) {
        try {
            const sessionData = JSON.parse(existingSession);
            const now = Date.now();
            const sessionAge = now - (sessionData.loginTimestamp || 0);
            const maxSessionAge = 8 * 60 * 60 * 1000; // 8 hours

            if (sessionAge < maxSessionAge) {
                console.log('Already logged in, redirecting to dashboard');
                window.location.replace('teacher-dashboard.html');
                return;
            } else {
                // Session expired, clear it
                sessionStorage.removeItem('teacherSession');
            }
        } catch (e) {
            console.error('Error parsing existing session:', e);
            sessionStorage.removeItem('teacherSession');
        }
    }

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Teacher login form submitted');
        
        // Check if terms are accepted
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox || !termsCheckbox.checked) {
            alert('You must agree to the Terms of Service and Privacy Policy to login.');
            return;
        }
        
        // Get form data
        const teacherIdInput = document.getElementById('teacherId');
        const passwordInput = document.getElementById('password');
        const subjectInput = document.getElementById('subject');
        const classInput = document.getElementById('class');
        
        if (!teacherIdInput || !passwordInput || !subjectInput || !classInput) {
            console.error('Form inputs not found');
            alert('Form error. Please refresh the page.');
            return;
        }
        
        const teacherId = teacherIdInput.value.trim();
        const password = passwordInput.value.trim();
        const subject = subjectInput.value;
        const classLevel = classInput.value;
        
        // Basic validation
        if (!teacherId || !password) {
            alert('Please fill in Teacher ID and Password.');
            return;
        }
        
        if (!subject) {
            alert('Please select a subject.');
            return;
        }
        
        if (!classLevel) {
            alert('Please select a class.');
            return;
        }
        
        console.log('Processing login for teacher:', teacherId);
        console.log('Subject:', subject, 'Class:', classLevel);
        
        // Create session data
        const sessionData = {
            username: teacherId,
            name: 'Teacher ' + teacherId.charAt(0).toUpperCase() + teacherId.slice(1),
            subject: subject,
            class: classLevel,
            loginTime: new Date().toLocaleString(),
            loginTimestamp: Date.now()
        };
        
        try {
            // Convert to JSON string
            const sessionDataString = JSON.stringify(sessionData);
            
            // Clear any existing session first
            sessionStorage.removeItem('teacherSession');
            
            // Store new session
            sessionStorage.setItem('teacherSession', sessionDataString);
            
            // Verify storage worked
            const verifySession = sessionStorage.getItem('teacherSession');
            
            if (!verifySession) {
                throw new Error('Failed to store session data. Please check browser settings.');
            }
            
            // Verify JSON is valid
            const parsedData = JSON.parse(verifySession);
            if (!parsedData.username || !parsedData.subject || !parsedData.class) {
                throw new Error('Session data is invalid.');
            }
            
            console.log('Login successful! Session data:', parsedData);
            console.log('Redirecting to dashboard...');
            
            // Redirect to dashboard
            setTimeout(function() {
                window.location.replace('teacher-dashboard.html');
            }, 100);
            
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message + '\n\nPlease try:\n1. Enabling sessionStorage in browser settings\n2. Disabling private/incognito mode\n3. Using a different browser');
        }
    });
    
    console.log('Teacher login form handler attached successfully');
});