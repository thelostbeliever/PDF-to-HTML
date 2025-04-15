# PDF to HTML Conversion API

A simple REST API service that converts PDF files to HTML using pdf2htmlEX.

## Features

- Convert PDF files to self-contained HTML
- Accept PDF uploads via file or base64-encoded data
- Optimized for deployment on Render

## API Endpoints

### Health Check

```
GET /api/health
```

Returns the health status of the API.

**Response**:
```json
{
  "status": "ok"
}
```

### Convert PDF File to HTML

```
POST /api/pdf-to-html/upload
```

Upload a PDF file for conversion to HTML.

**Request**:
- Content-Type: `multipart/form-data`
- Body:
  - `file`: PDF file (max 10MB)

**Response**:
- Success: HTML file download
- Error: JSON object with error details

### Convert Base64 PDF to HTML

```
POST /api/pdf-to-html/base64
```

Convert a base64-encoded PDF to HTML.

**Request**:
- Content-Type: `application/json`
- Body:
```json
{
  "base64pdf": "base64-encoded-pdf-content"
}
```

**Response**:
- Success: HTML file download
- Error: JSON object with error details

## Deployment on Render

This API is designed to be deployed on Render using Docker. The Dockerfile includes all necessary dependencies including the pdf2htmlEX tool.

### Requirements
- Docker (for local development and testing)
- Render account (for deployment)

### Local Development

1. Build Docker image:
```bash
docker build -t pdf-to-html-api .
```

2. Run the container:
```bash
docker run -p 3000:3000 pdf-to-html-api
```

3. Test the API at `http://localhost:3000/api/health`

### Deployment Steps

1. Push the code to a GitHub repository
2. Log in to your Render account
3. Create a new Web Service
4. Select "Deploy from Git repository"
5. Choose Docker as the environment
6. Select the repository containing this code
7. Configure the name and other settings
8. Deploy

## Usage Examples

### Using cURL to upload a PDF file:

```bash
curl -X POST -F "file=@/path/to/your/file.pdf" https://your-render-url.com/api/pdf-to-html/upload -o converted.html
```

### Using cURL to convert base64 PDF:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"base64pdf":"BASE64_ENCODED_PDF_CONTENT"}' \
  https://your-render-url.com/api/pdf-to-html/base64 \
  -o converted.html
```

### Using JavaScript fetch API:

```javascript
// For file upload
const formData = new FormData();
formData.append('file', pdfFile);

fetch('https://your-render-url.com/api/pdf-to-html/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.blob())
.then(blob => {
  // Handle the HTML file blob
});

// For base64 conversion
fetch('https://your-render-url.com/api/pdf-to-html/base64', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    base64pdf: base64String
  })
})
.then(response => response.blob())
.then(blob => {
  // Handle the HTML file blob
});
```