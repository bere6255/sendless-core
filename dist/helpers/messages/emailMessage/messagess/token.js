"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ token }) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Account - Tencoin</title>
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
            Tencoin - Verification Token
        </h1>

        <!-- Body Section -->
      
        <p class="text-gray-700 mb-6">
            Please use the following token to verify your account with Tencoin:
        </p>

        <!-- Verification Token Section -->
        <div class="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-center">
            <p class="text-lg md:text-xl font-mono break-all">
                <strong class="text-blue-900">Token:</strong> <span id="verificationToken" class="select-all">${token}</span>
            </p>
        </div>
      

        <!-- Important Notes Section -->
        <div class="border-t border-gray-200 pt-6 mt-6">
            <p class="text-sm text-gray-600 italic">
                <strong class="font-semibold">Important:</strong> This token is for your use only. Do not share it. If you didn't request this, please ignore this email.
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
            <a href="https://tencoin.app" class="hover:underline">Tencoin</a>
        </p>
    </div>
</body>
</html>
`;
//# sourceMappingURL=token.js.map