const CryptoJS = require("crypto-js");

function generateResetCode() {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generatePassword(length) {
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+<>?{}[]";
    var password = "";
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

function encryptData(data){
    const key = CryptoJS.enc.Utf8.parse(process.env.UUID).toString();
    // Encrypt
    try {
        // Encrypt data to ciphertext
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
        return ciphertext;
    } catch (error) {
        console.error('Encryption error:', error.message);
        throw error;
    }
}

function decryptData(data) {
    const key = CryptoJS.enc.Utf8.parse(process.env.UUID).toString();
    try {
        // Decrypt ciphertext to decrypted string
        const bytes = CryptoJS.AES.decrypt(data, key);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        
        // Parse decrypted string to JSON
        const decryptedData = JSON.parse(decryptedString);
        return decryptedData;
    } catch (error) {
        console.error('Decryption error:', error.message);
        throw error;
    }
}






module.exports={
    generateResetCode,
    generatePassword,
    encryptData,
    decryptData
}