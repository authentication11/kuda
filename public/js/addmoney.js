// Add money functionality
let appData = {
    balance: 10000.00,
    userName: 'BABATUNDE',
    transactions: [],
    profileImage: null
};

const CORRECT_PIN = '862412';

// PIN verification
function verifyPin() {
    const pinInput = document.getElementById('pinInput');
    const pinError = document.getElementById('pinError');
    const enteredPin = pinInput.value;

    if (enteredPin === CORRECT_PIN) {
        document.getElementById('pinModal').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
    } else {
        pinError.textContent = 'Incorrect PIN. Please try again.';
        pinError.style.display = 'block';
        pinInput.value = '';
        pinInput.focus();
    }
}

// Show PIN modal on page load
window.addEventListener('DOMContentLoaded', function() {
    const pinModal = document.getElementById('pinModal');
    pinModal.style.display = 'flex';
    document.getElementById('pinInput').focus();

    // Allow Enter key to submit PIN
    document.getElementById('pinInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            verifyPin();
        }
    });
});

// Load data
function loadData() {
    const saved = localStorage.getItem('kudasavingsData');
    if (saved) {
        appData = JSON.parse(saved);
    }
    updateBalance();

    // Pre-fill display name if exists
    document.getElementById('displayName').value = appData.userName;

    // Load existing profile image if exists
    if (appData.profileImage) {
        const previewImg = document.getElementById('previewImg');
        const imagePreview = document.getElementById('imagePreview');
        previewImg.src = appData.profileImage;
        imagePreview.style.display = 'block';
    }
}

// Update balance display
function updateBalance() {
    const balanceEl = document.getElementById('currentBalance');
    if (balanceEl) {
        balanceEl.textContent = new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(appData.balance);
    }
}

// Handle profile image upload
document.getElementById('profileImage')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const previewImg = document.getElementById('previewImg');
            const imagePreview = document.getElementById('imagePreview');
            previewImg.src = event.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Handle form submission
document.getElementById('addMoneyForm')?.addEventListener('submit', function(e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('topupAmount').value);
    const displayName = document.getElementById('displayName').value;
    const narration = document.getElementById('narration').value || 'Wallet Top-up';
    const profileImageInput = document.getElementById('profileImage');

    if (amount < 100) {
        alert('Minimum top-up amount is ₦100.00');
        return;
    }

    // Show loading
    document.getElementById('loadingOverlay').classList.remove('hidden');

    // Update user name
    appData.userName = displayName;

    // Handle profile image if uploaded
    if (profileImageInput.files && profileImageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
            appData.profileImage = event.target.result;
            processTransaction();
        };
        reader.readAsDataURL(profileImageInput.files[0]);
    } else {
        processTransaction();
    }

    function processTransaction() {
        // Create transaction
        const transaction = {
            id: 'TXN' + Date.now(),
            type: 'credit',
            accountName: 'Wallet Top-up',
            amount: amount,
            narration: narration,
            date: new Date().toISOString(),
            status: 'successful',
            title: narration,
            referenceNumber: generateReference()
        };

        // Add to balance
        appData.balance += amount;

        // Add to transactions (newest first)
        appData.transactions.unshift(transaction);

        // Save data
        localStorage.setItem('kudasavingsData', JSON.stringify(appData));

        // Simulate processing
        setTimeout(() => {
            document.getElementById('loadingOverlay').classList.add('hidden');
            alert(`Successfully added ₦${amount.toLocaleString('en-NG', {minimumFractionDigits: 2})} to your balance!`);
            window.location.href = '/dashboard.html';
        }, 1500);
    }
});

// Generate reference number
function generateReference() {
    return '2509' + Date.now().toString().slice(-16);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();

    // Validate amount
    document.getElementById('topupAmount')?.addEventListener('input', function() {
        const amount = parseFloat(this.value) || 0;
        if (amount < 100 && amount > 0) {
            this.style.borderColor = '#ff6b35';
        } else {
            this.style.borderColor = '#ddd';
        }
    });
});
