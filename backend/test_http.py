import requests

# 1. Login to get token
login_data = {
    "email": "test@example.com",
    "password": "password123"
}
# We don't know an exact test user, let's just create one if we can't login
try:
    res = requests.post("http://localhost:8000/auth/signup", json={
        "email": "test_patent_firm@example.com",
        "password": "password123",
        "first_name": "Test",
        "last_name": "User",
        "role": "Admin"
    })
except Exception as e:
    pass

res = requests.post("http://localhost:8000/auth/signin", json={
    "email": "test_patent_firm@example.com",
    "password": "password123"
})

if res.status_code == 200:
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    print("Fetching stats...")
    r1 = requests.get("http://localhost:8000/api/patent-firm/dashboard/stats", headers=headers)
    print("Stats:", r1.status_code, r1.text)
    
    print("Fetching pipeline...")
    r2 = requests.get("http://localhost:8000/api/patent-firm/dashboard/pipeline", headers=headers)
    print("Pipeline:", r2.status_code, r2.text)
    
    print("Fetching urgent...")
    r3 = requests.get("http://localhost:8000/api/patent-firm/dashboard/urgent", headers=headers)
    print("Urgent:", r3.status_code, r3.text)
    
    print("Fetching activities...")
    r4 = requests.get("http://localhost:8000/api/patent-firm/activities", headers=headers)
    print("Activities:", r4.status_code, r4.text)
else:
    print("Login Failed:", res.status_code, res.text)
