"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const date_and_time_1 = __importDefault(require("date-and-time"));
exports.default = ({ name }) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Changed</title>
    <style>
      body {
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        background-color: #f8f9fa;
        margin: 0;
        padding: 0;
        color: #212529;
      }
      .container {
        max-width: 480px;
        margin: auto;
        background-color: #ffffff;
        padding: 32px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }
      .logo {
        text-align: center;
        margin-bottom: 24px;
      }
      .logo img {
        height: 40px;
      }
      h2 {
        font-size: 20px;
        margin-bottom: 10px;
        color: #111;
      }
      p {
        font-size: 15px;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        background-color: #dc3545;
        color: white;
        text-decoration: none;
        padding: 10px 18px;
        border-radius: 6px;
        font-weight: 500;
        margin-top: 10px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #888;
        margin-top: 32px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="https://yourdomain.com/logo.png" alt="Tencoin Logo" />
      </div>

      <h2>Your Password Was Changed</h2>

      <p>Hi ${name},</p>

      <p>This is a confirmation that your <strong>Tencoin</strong> account password was changed on <strong>${date_and_time_1.default.format(new Date, 'YYYY/MM/DD HH:mm:ss')}</strong>.</p>

      <p>If you made this change, you’re all set.</p>

      <p>If you <strong>did not</strong> change your password, your account may be at risk. Please secure your account immediately:</p>

      <p style="margin-top: 20px;">Need help? Contact us at <a href="mailto:support@tencoin.io">support@tencoin.io</a>.</p>

      <p>Stay safe,<br />The Tencoin Security Team</p>

      <div class="footer">
        &copy; 2025 Tencoin • <a href="https://tencoin.io">www.tencoin.io</a>
      </div>
    </div>
  </body>
</html>
`;
//# sourceMappingURL=changePassword.js.map