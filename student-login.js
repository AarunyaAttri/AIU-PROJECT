// Student Login JavaScript - Final Version
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    console.log('Student login page loaded');
    
    // Test localStorage availability
    function testLocalStorage() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            const result = localStorage.getItem(test);
            localStorage.removeItem(test);
            return result === test;
        } catch (e) {
            console.error('localStorage test failed:', e);
            return false;
        }
    }
    
    if (!testLocalStorage()) {
        console.warn('localStorage is not available');
    }
    
    // Check if already logged in
    const isLoggedIn = localStorage.getItem('studentLoggedIn');
    const currentStudent = localStorage.getItem('currentStudent');
    
    if (isLoggedIn === 'true' && currentStudent) {
        try {
            const studentData = JSON.parse(currentStudent);
            if (studentData && studentData.studentId) {
                console.log('Already logged in, redirecting to dashboard');
                window.location.replace('student-dashboard.html');
                return;
            }
        } catch (e) {
            console.error('Error parsing existing student data:', e);
            localStorage.removeItem('studentLoggedIn');
            localStorage.removeItem('currentStudent');
        }
    }

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('Login form submitted');
        
        // Check if terms are accepted
        const termsCheckbox = document.getElementById('terms');
        if (!termsCheckbox || !termsCheckbox.checked) {
            alert('You must agree to the Terms of Service and Privacy Policy to login.');
            return;
        }
        
        // Get form data
        const studentIdInput = document.getElementById('studentId');
        const passwordInput = document.getElementById('password');
        
        if (!studentIdInput || !passwordInput) {
            console.error('Form inputs not found');
            alert('Form error. Please refresh the page.');
            return;
        }
        
        const studentId = studentIdInput.value.trim();
        const password = passwordInput.value.trim();
        
        // Basic validation
        if (!studentId || !password) {
            alert('Please fill in all fields.');
            return;
        }
        
        console.log('Processing login for student ID:', studentId);
        
        // Create student data object with all required fields
        const studentData = {
            studentId: studentId,
            studentName: 'Student ' + studentId,
            class: 'class-10',
            section: 'A',
            loginTime: new Date().toISOString()
        };
        
        try {
            // Convert to JSON string
            const studentDataString = JSON.stringify(studentData);
            
            // Clear any existing data first
            localStorage.removeItem('studentLoggedIn');
            localStorage.removeItem('currentStudent');
            
            // Store new data
            localStorage.setItem('currentStudent', studentDataString);
            localStorage.setItem('studentLoggedIn', 'true');
            
            // Verify storage worked
            const verifyStudent = localStorage.getItem('currentStudent');
            const verifyLogin = localStorage.getItem('studentLoggedIn');
            
            if (!verifyStudent || verifyLogin !== 'true') {
                throw new Error('Failed to store login data. Please check browser settings.');
            }
            
            // Verify JSON is valid
            const parsedData = JSON.parse(verifyStudent);
            if (!parsedData.studentId) {
                throw new Error('Student data is invalid.');
            }
            
            console.log('Login successful! Redirecting to dashboard...');
            
            // Redirect to dashboard
            setTimeout(function() {
                window.location.replace('student-dashboard.html');
            }, 100);
            
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message + '\n\nPlease try:\n1. Enabling localStorage in browser settings\n2. Disabling private/incognito mode\n3. Using a different browser');
        }
    });
    
    console.log('Login form handler attached successfully');
});