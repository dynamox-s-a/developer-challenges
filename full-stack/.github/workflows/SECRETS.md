# GitHub Actions Secrets Configuration

This document describes the required secrets for the project's CI/CD pipeline to function.

## Required Secrets

### Render Deployment
Configure the following secrets in your GitHub repository settings:

#### `RENDER_API_KEY`
- **Description**: Render account API key for automatic deployment
- **How to obtain**: 
  1. Access [dashboard.render.com](https://dashboard.render.com)
  2. Go to Settings → API Keys
  3. Create new API key
  4. Copy and paste to GitHub secrets

#### `RENDER_DATABASE_URL`
- **Description**: PostgreSQL database connection URL in production
- **Format**: `postgresql://user:password@host:port/database`
- **How to obtain**: 
  1. In Render dashboard, go to PostgreSQL service
  2. Copy the Connection URL
  3. Paste to GitHub secrets

#### `RENDER_JWT_SECRET`
- **Description**: Secret for JWT token signing
- **How to generate**: 
  ```bash
  openssl rand -base64 32
  ```
- **Importance**: Essential for authentication security

## Optional Secrets (Recommended)

### Separate Services
For deploying frontend and backend on separate services:

#### `RENDER_BACKEND_SERVICE_ID`
- **Description**: Backend service ID on Render
- **How to obtain**: Backend service URL (ex: `srv-abc123def456`)

#### `RENDER_FRONTEND_SERVICE_ID`
- **Description**: Frontend service ID on Render
- **How to obtain**: Frontend service URL (ex: `srv-xyz789uvw012`)

#### `RENDER_BACKEND_URL`
- **Description**: Backend base URL in production
- **Format**: `your-backend.onrender.com`
- **Usage**: Frontend configuration to connect to backend

#### `RENDER_FRONTEND_URL`
- **Description**: Frontend base URL in production
- **Format**: `your-frontend.onrender.com`
- **Usage**: Pipeline reference and logs

## Step-by-Step Configuration

### 1. Access GitHub Secrets
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 2. Add Secrets
Add the secrets one by one:

```
Name: RENDER_API_KEY
Value: rnd_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Name: RENDER_DATABASE_URL
Value: postgresql://user:password@host:port/database

Name: RENDER_JWT_SECRET
Value: your_secret_key_generated_with_openssl
```

### 3. Configure Services (Optional)
If using separate services:

```
Name: RENDER_BACKEND_SERVICE_ID
Value: srv-abc123def456

Name: RENDER_FRONTEND_SERVICE_ID
Value: srv-xyz789uvw012

Name: RENDER_BACKEND_URL
Value: your-backend.onrender.com

Name: RENDER_FRONTEND_URL
Value: your-frontend.onrender.com
```

## How the Pipeline Works

### Without Secrets Configured
- CI works (build, test, lint)
- Pipeline doesn't break
- Deploy is skipped with warning

### With Secrets Configured
- CI works completely
- Automatic deploy to Render
- Detailed deploy logs

## Security

### Validation
The pipeline validates if secrets exist before attempting deploy:
```yaml
if: secrets.RENDER_BACKEND_SERVICE_ID != ''
```

## Troubleshooting

### Deploy Fails
1. Check if all required secrets are configured
2. Confirm if Render API key is valid
3. Check if service IDs are correct

### Secrets Don't Work
1. Check exact spelling of names
2. Confirm there are no extra spaces
3. Test manually with `echo $SECRET_NAME`

---

**For support**: Check Actions logs on GitHub or consult [Render Deploy documentation](https://render.com/docs/deploy).
