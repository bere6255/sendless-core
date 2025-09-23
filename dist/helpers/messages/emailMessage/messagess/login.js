"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_and_time_1 = __importDefault(require("date-and-time"));
const now = new Date();
exports.default = ({ name, userAgent }) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Login Detected - Tencoin</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        /* Custom font if needed, otherwise Tailwind's default is Inter */
        body {
            font-family: 'Inter', sans-serif;
        }
    </style>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen p-4">
    <div class="bg-white rounded-xl shadow-lg p-8 md:p-10 max-w-lg w-full">
        <!-- Header Section -->
        <h1 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            Tencoin - New Login Detected
        </h1>

        <!-- Body Section -->
        <p class="text-gray-700 mb-4">
            Dear <span class="font-semibold">${name}</span>,
        </p>
        <p class="text-gray-700 mb-6">
            We detected a recent login to your Tencoin account.
        </p>

        <!-- Login Details Section -->
        <div class="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded-lg mb-6">
            <p class="mb-2">
                <strong class="text-indigo-900">Time of Login:</strong> ${date_and_time_1.default.format(now, 'YYYY/MM/DD HH:mm:ss')}
            </p>
            <p class="mb-2">
                <strong class="text-indigo-900">Device/Browser:</strong> ${userAgent}
            </p>
        </div>

        <!-- Call to Action for Unauthorized Access -->
        <p class="text-gray-700 mb-6">
            If this wasn't you, please secure your account immediately by changing your password or contacting our support team.
        </p>
        <div class="mb-6 text-center">
            <a href="[Change Password Link Here (e.g., https://tencoin.app/reset-password)]"
               class="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-md mr-2">
                Change Password
            </a>
            <a href="[Support Link Here (e.g., https://tencoin.app/support)]"
               class="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out shadow-md">
                Contact Support
            </a>
        </div>

        <!-- Important Notes Section -->
        <div class="border-t border-gray-200 pt-6 mt-6">
            <p class="text-sm text-gray-600 italic">
                <strong class="font-semibold">Important:</strong> For your security, always review login notifications.
            </p>
        </div>

        <!-- Footer Section -->
        <p class="text-gray-700 mt-6 text-center">
            Thanks,
        </p>
        <p class="text-gray-800 font-semibold text-center">
            The Tencoin Team
        </p>
        <p class="text-blue-600 text-sm text-center">
            <a href="https://tencoin.app" class="hover:underline">Tencoin.app</a>
        </p>
    </div>
</body>
</html>
`;
//# sourceMappingURL=login.js.map