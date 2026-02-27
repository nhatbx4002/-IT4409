/**
 * Validate password strength
 *
 * Requirements:
 * - Minimum 8 characterrs
 * - At least 1 uppercase letter
 * - At least 1 number
 */

export const validatePassword = (password) => {
    const errors = [];

    if(!password) {
        errors.push("Password is required");
        return {isValid: false , errors: errors};
    }

    if(password.length < 8) {
        errors.push("Password must be at least 8 characters long");
    }

    if(!/[A-Z]/.test(password)) {
        errors.push("Password must be have a uppercase letter");
    }

    if(!/[0-9]/.test(password)) {
        errors.push("Password must be have a number letter");
    }

    return {
        isValid: errors.length === 0,
        errors: errors,
    }
}

/**
 * Validate email format
 */

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * validate phone number
 */

export const validatePhone = (email) => {
    const phoneRegex = /^0[0-9]{9}$/;
    return phoneRegex.test(email);
}