const { body, query, param } = require('express-validator');

// Email validation
exports.emailValidator = () => {
    return body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required');
};

// Password validation
exports.passwordValidator = () => {
    return body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain a number');
};

// Date validation
exports.dateValidator = (field) => {
    return body(field)
        .optional()
        .isISO8601()
        .withMessage('Valid date is required (YYYY-MM-DD)');
};

// UUID validation
exports.uuidValidator = (field) => {
    return param(field)
        .isUUID()
        .withMessage('Valid ID is required');
};