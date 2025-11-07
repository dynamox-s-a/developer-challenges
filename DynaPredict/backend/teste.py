import requests

response = requests.get("http://127.0.0.1:8000/auth/refresh-token", headers={
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3IiwiZXhwIjoxNzYzMDkxNzE1fQ.2NQrgRGjc9rEP4cI88AXP82cbLeAXsvIYyRK-QdNwWs"})

print(response)
print(response.json())
