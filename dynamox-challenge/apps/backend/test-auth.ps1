$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "Test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/register" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Registration successful!"
    Write-Host "Response:" ($response | ConvertTo-Json)
} catch {
    Write-Host "❌ Registration failed:"
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails) {
        Write-Host $_.ErrorDetails.Message
    }
}
