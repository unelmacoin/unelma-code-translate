# Unelma-Code Translator

Welcome to **Unelma-Code Translator**, an open-source tool that uses AI to translate code between programming languages. Whether you're porting a Python script to JavaScript, adapting C++ to Java, or exploring a new language, this project aims to save you time and effort with smart, context-aware translations. Built by [Unelma Platforms](https://unelmaplatforms.com/), it's free, collaborative, and ready for your input!

## Why Use It?

- **AI-Powered**: Goes beyond syntax—understands logic and intent.
- **Multi-Language**: Supports a growing list of languages (Python, Java, C++, JS, COBOL, and more).
- **API Access**: Built-in REST API for programmatic access.
- **Open-Source**: Free to use, modify, and improve under the [MIT License](#license).

Try it online at [translate.u16p.com](https://translate.u16p.com) or dive into the code right here!

## API Documentation

Unelma Code Translate provides a comprehensive REST API for programmatic access to code translation capabilities. The API is versioned and follows RESTful principles.

### Base URLs
- Production: `https://translate.u16p.com`
- Development: `http://localhost:3000` (when running locally)

### Authentication

Some endpoints require authentication using an API key:

```
Authorization: Bearer YOUR_API_KEY
```

### Interactive Documentation

Explore the API interactively using our Swagger UI:
- [Production API Docs](https://translate.u16p.com/api-docs)
- [Local Development](http://localhost:3000/api-docs)

### API Endpoints

#### Health Check

Check if the API is running.

```
GET /api/v1/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-06-05T07:45:00.000Z"
}
```

#### List Supported Languages (v1)

Get a list of all supported language pairs for translation.

```
GET /api/v1/translate
```

**Response:**
```json
{
  "languages": [
    "python",
    "javascript",
    "typescript",
    "java"
  ]
}
```

#### Translate Code (v1)

Translate code between supported programming languages.

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

#### Legacy Translate Endpoint

This is the legacy endpoint for backward compatibility.

```
POST /api/translate
```

**Request Body:**
```json
{
  "inputLanguage": "python",
  "outputLanguage": "javascript",
  "inputCode": "def hello():\n    print('Hello, World!')",
  "model": "gpt-4",
  "apiKey": "your_openai_api_key_here"
}
```

### Error Handling

#### 400 Bad Request
```json
{
  "error": "Missing required fields: source_code, from_lang, to_lang"
}
```

#### 401 Unauthorized
```json
{
  "error": "Invalid or missing API key"
}
```

#### 404 Not Found
```json
{
  "error": "Endpoint not found"
}
```

#### 500 Internal Server Error
```json
{
  "error": "An error occurred while processing your request"
}
```

### Rate Limiting

- Public API: 60 requests per minute per IP address
- Authenticated API: 1000 requests per minute per API key

### Webhooks

Set up webhooks to receive notifications about translation events. Contact support for more information.

### Support

For API support, please contact [info@unelmaplatforms.com](mailto:info@unelmaplatforms.com).

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
