"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require('bcrypt');
function generateHashedPassword() {
    return __awaiter(this, void 0, void 0, function* () {
        const plainTextPassword = "password123";
        const saltRounds = 10;
        try {
            // Number of rounds to generate the salt
            const hashedPassword = yield bcrypt.hash(plainTextPassword, saltRounds);
            console.log('Hashed Password:', hashedPassword); // Example plaintext password
        }
        catch (error) {
            console.error('Error hashing password:', error);
        }
    });
}
generateHashedPassword();
