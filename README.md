# Unelma-Code Translator

Welcome to **Unelma-Code Translator**, an open-source tool that uses AI to translate code between programming languages. Whether you're porting a Python script to JavaScript, adapting C++ to Java, or exploring a new language, this project aims to save you time and effort with smart, context-aware translations. Built by [Unelma Platforms](https://unelmaplatforms.com/), it's free, collaborative, and ready for your input!

## Why Use It?

- **AI-Powered**: Goes beyond syntax—understands logic and intent.
- **Multi-Language**: Supports a growing list of languages (Python, Java, C++, JS, COBOL, and more).
- **API Access**: Built-in REST API for programmatic access.
- **Open-Source**: Free to use, modify, and improve under the [MIT License](#license).

Try it online at [translate.u16p.com](https://translate.u16p.com) or dive into the code right here!

## API Documentation

The application includes a REST API that you can use to integrate code translation into your own applications.

### Base URL
All API endpoints are prefixed with `/api/v1`.

### Authentication
No authentication is required for the public API endpoints.

### Endpoints

#### Health Check
```
GET /api/v1/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Translation API is running",
  "timestamp": "2025-05-29T09:00:00.000Z"
}
```

#### List Supported Languages
```
GET /api/v1/translate
```

**Response:**
```json
{
  "languages": [
    { "from": "python", "to": "javascript" },
    { "from": "javascript", "to": "python" },
    { "from": "python", "to": "java" },
    { "from": "java", "to": "python" },
    { "from": "javascript", "to": "java" },
    { "from": "java", "to": "javascript" },
    { "from": "cobol", "to": "java" },
    { "from": "java", "to": "cobol" }
  ]
}
```

#### Translate Code
```
POST /api/v1/translate
```

**Request Body:**
```json
{
  "source_code": "def hello():\n    print('Hello, World!')",
  "from_lang": "python",
  "to_lang": "javascript"
}
```

**Response:**
```json
{
  "source_code": "def hello():\n    print('Hello, World!')",
  "from_lang": "python",
  "to_lang": "javascript",
  "translated_code": "function hello() {\n  console.log('Hello, World!');\n}"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Missing required fields: source_code, from_lang, to_lang"
}
```

#### 400 Bad Request (Unsupported Language Pair)
```json
{
  "error": "Translation from python to ruby is not supported",
  "supported_pairs": [
    { "from": "python", "to": "javascript" },
    { "from": "javascript", "to": "python" },
    { "from": "python", "to": "java" },
    { "from": "java", "to": "python" },
    { "from": "javascript", "to": "java" },
    { "from": "java", "to": "javascript" },
    { "from": "cobol", "to": "java" },
    { "from": "java", "to": "cobol" }
  ]
}
```

#### 500 Internal Server Error
```json
{
  "error": "An error occurred while translating the code",
  "details": "Error message from the server"
}
```

## Running the API Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/unelmacoin/unelma-code-translate.git
   cd unelma-code-translate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The API will be available at `http://localhost:3000/api/v1`

---

## Quick Start

### Option 1: Use Online

1. Visit [translate.u16p.com](https://translate.u16p.com).
2. Paste your code, select the source and target languages, and hit "Translate."
3. Done!

### Option 2: Run Locally

1. Clone the repo:
   ```bash
   git clone https://github.com/unelmacoin/unelma-code-translate.git
   ```
2. Follow the Installation steps below.
3. Launch and start translating!

### Installation

Prerequisites

    Node.js (v16+ recommended)
    Python (v3.8+ for AI components)
    Git

Steps

1. Clone the repository:

```bash
git clone https://github.com/unelmacoin/unelma-code-translate.git
```

```bash
 cd unelma-code-translate
```

2. Install dependencies:

```bash
npm install
```

3. Run the application:

```bash
npm start
```

4. Open localhost:3000 in your browser

### Usage Examples

Python to JavaScript

Input (Python):

```python
def greet(name):
    return f"Hello, {name}!"
print(greet("World"))
```

Output (JavaScript):

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
console.log(greet('World'));
```

Experiment with your own code at translate.u16p.com!

### Contributing

We’d love your help to make Unelma-Code Translator better! Here’s how to contribute:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature/your-idea
```

3.  Make your changes and commit:

```bash
git commit -m "Add feature: your-idea"
```

4.  Push to your fork:

```bash
git push origin feature/your-idea
```

5. Open a Pull Request—we’ll review it ASAP!

### Community

Twitter: Follow Unelma Platforms for updates.
Facebook: Join us at facebook.com/unelmaplatforms.
Support: DM us on socials or open an issue here.

### License

This project is licensed under the MIT License—feel free to use, modify, and share it!

### Acknowledgments

Built with ❤️ by the Unelma Platforms team. Special thanks to our contributors and the open-source community!
