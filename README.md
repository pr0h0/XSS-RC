# Work in progress
----------------
# Will be removed when the project is finished
----------------
----------------
# XSS-RC by pr0h0
### XSS post exploitation framework for penetration testers and bug bounty hunters.

### Description
**XSS-RC** is a post exploitation framework for penetration testers and bug bounty hunters. It is designed to automate the process of exploiting and escalating XSS vulnerabilities. It is a powerful tool that can be used to extract sensitive information, escalate privileges, and even take full control of the target browser page. This tool is useful after you have successfully exploited an XSS vulnerability and want to take your attack/proof to the next level.

### Motivation
Because I read somewhere that for your proof of XSS you need to show more than just alert, I decided to create this tool. I hope you will find it useful.

### Features
- Full access to the target's browser page
- Remote JavaScript execution in the context of the infected page
- Screenshot
- Keylogger
- Webcam access if available
- Microphone access if available

### Installation
1. Clone the repository
2. npm install
3. Edit .env file and set your own values
4. npm start
5. Open the url in the browser

### Usage
1. Open the URL in the browser
2. Enter the password from the .env file
3. Create new script
4. Paste <script ...> as xss payload
5. Wait for session and connect to it
6. Use the features :)

### Disclaimer
This tool is intended for educational purposes and bug bounty purposes. The author is not responsible for any misuse of this tool. Use it at your own risk.


### Contact
If you have any questions or suggestions, feel free to contact me at [email](mailto:abdulahproho@gmail.com) or on [Twitter / X](https://twitter.com/pr0h0_me).

### Tech stack
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [EJS](https://ejs.co/)
- [html2canvas](https://html2canvas.hertzen.com/)

### Issues and feature requests
If you have any issues or feature requests, please open an issue on the [issues](https://github.com/pr0h0/XSS-RC/issues) page.
If you want to contribute, please open a pull request on the [pull requests](https://github.com/pr0h0/XSS-RC/pulls) page.


### License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
>   &nbsp;
>   XSS-RC by pr0h0
>   Copyright (C) 2024  Abdulah Proho - pr0h0
>
>   This program is free software: you can redistribute it and/or modify
>   it under the terms of the GNU General Public License as published by
>   the Free Software Foundation, either version 3 of the License, or
>   (at your option) any later version.
>
>   This program is distributed in the hope that it will be useful,
>   but WITHOUT ANY WARRANTY; without even the implied warranty of
>   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
>   GNU General Public License for more details.
>
>   You should have received a copy of the GNU General Public License
>   along with this program.  If not, see <https://www.gnu.org/licenses/>.
>   &nbsp;