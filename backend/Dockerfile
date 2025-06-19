# Use official Python image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy contents
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose WebSocket port (8765)
EXPOSE 8765

# Run the server
CMD ["python", "backend.py"]
