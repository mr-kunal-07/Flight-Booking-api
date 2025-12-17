// Generate random booking reference
exports.generateBookingReference = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = '';
    for (let i = 0; i < 10; i++) {
        reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
};

// Calculate flight duration
exports.calculateDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    return Math.floor(diff / (1000 * 60)); // in minutes
};

// Format currency
exports.formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};

// Format date
exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Format time
exports.formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
};