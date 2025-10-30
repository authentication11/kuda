// Transaction details functionality
let appData = {
    balance: 10000.00,
    userName: 'BABATUNDE',
    transactions: []
};

let currentTransaction = null;

// Load data
function loadData() {
    const saved = localStorage.getItem('kudasavingsData');
    if (saved) {
        appData = JSON.parse(saved);
    }

    // Get transaction ID
    const txId = localStorage.getItem('viewTransactionId');
    if (txId) {
        currentTransaction = appData.transactions.find(t => t.id === txId);
        if (currentTransaction) {
            displayTransaction();
        }
    }
}

// Display transaction
function displayTransaction() {
    if (!currentTransaction) return;

    // Update amount (with negative sign for debit)
    const amountValue = parseFloat(currentTransaction.amount);
    const amountSign = currentTransaction.type === 'debit' ? '-' : '+';
    const amount = `${amountSign}₦${amountValue.toLocaleString('en-NG', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById('transferAmount').textContent = amount;

    // Update title/recipient name
    const title = currentTransaction.type === 'credit'
        ? (currentTransaction.title || 'WALLET TOP-UP')
        : (currentTransaction.accountName || 'RECIPIENT').toUpperCase();
    document.getElementById('transferTitle').textContent = title;

    // Update transaction time
    const date = new Date(currentTransaction.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('transactionTime').textContent = `On ${formattedDate} at ${formattedTime}`;

    // Update recipient name
    if (currentTransaction.type === 'debit') {
        document.getElementById('recipientName').textContent = currentTransaction.bankName || 'BANK';
    } else {
        document.getElementById('recipientName').textContent = 'WALLET';
    }

    // Update receipt amount
    const receiptAmountEl = document.getElementById('receiptAmount');
    if (receiptAmountEl) {
        receiptAmountEl.textContent = `₦${amountValue.toLocaleString('en-NG', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    // Update description (use narration if available)
    const narration = currentTransaction.narration || currentTransaction.description || currentTransaction.title || 'Transfer';
    document.getElementById('description').textContent = narration;

    // Update timeline times
    const txDate = new Date(currentTransaction.date);
    const formatTime = (dateObj) => {
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        return `${day}/${month}, ${hours}:${minutes}:${seconds}`;
    };

    document.getElementById('timePayment').textContent = formatTime(txDate);
    document.getElementById('timeProcessing').textContent = formatTime(txDate);

    const receivedDate = new Date(txDate.getTime() + 28000);
    document.getElementById('timeReceived').textContent = formatTime(receivedDate);

    // Update account number
    if (currentTransaction.type === 'debit' && currentTransaction.accountNumber) {
        document.getElementById('accountNumber').textContent = currentTransaction.accountNumber;
    } else {
        document.getElementById('accountNumber').textContent = '--';
    }

    // Update transaction reference
    const refEl = document.getElementById('transactionRef');
    if (refEl) {
        refEl.textContent = currentTransaction.referenceNumber || '0902672510261232020545027233' + Math.floor(Math.random() * 1000) + 'PP';
    }

    // Update fees
    const feesElements = document.querySelectorAll('#fees');
    feesElements.forEach(el => {
        el.textContent = '₦10.00';
    });
}

// Copy to clipboard function
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;

    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Share receipt
function shareReceipt() {
    if (navigator.share && currentTransaction) {
        const text = `Transaction Receipt\nAmount: ₦${currentTransaction.amount.toLocaleString('en-NG', {minimumFractionDigits: 2})}\n${currentTransaction.type === 'debit' ? `Recipient: ${currentTransaction.accountName}\nBank: ${currentTransaction.bankName}` : 'Type: Wallet Top-up'}\nReference: ${currentTransaction.referenceNumber}\nDate: ${new Date(currentTransaction.date).toLocaleString()}`;

        navigator.share({
            title: 'Transaction Receipt',
            text: text
        }).catch(err => console.log('Share failed:', err));
    } else {
        // Fallback: Create shareable image or text
        const text = `Transaction Receipt\nAmount: ₦${currentTransaction?.amount.toLocaleString('en-NG', {minimumFractionDigits: 2})}\nReference: ${currentTransaction?.referenceNumber}`;

        navigator.clipboard.writeText(text).then(() => {
            alert('Receipt details copied to clipboard!');
        }).catch(() => {
            alert('Unable to share receipt. Please try again.');
        });
    }
}

// Repeat transaction
function repeatTransaction() {
    window.location.href = '/dashboard.html';
}

// Report transaction
function reportTransaction() {
    const subject = 'Transaction Report';
    const body = `I would like to report an issue with transaction reference: ${currentTransaction?.referenceNumber || 'N/A'}\n\nTransaction Details:\nAmount: ₦${currentTransaction?.amount || 0}\nDate: ${currentTransaction?.date || 'N/A'}\n\nIssue Description:\n`;

    window.location.href = `mailto:metahelpcenter333@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});