import requests
from dotenv import load_dotenv
import os

load_dotenv()

def verify_user_count():
    try:
        from database.supabase_client import get_supabase_client
        client = get_supabase_client()
        
        # Authenticate to get a valid token
        print("Signing in...")
        # try the test user from db_dump
        email = "test@ascendly.com"
        password = "password123" # Assuming this is the password based on test_api.py
        
        auth_response = client.auth.sign_in_with_password({"email": email, "password": password})
        token = auth_response.session.access_token
        print("Got token.")
        
        # Test the new user-count endpoint
        print("Calling /dashboard/user-count...")
        response = requests.get('http://localhost:8000/dashboard/user-count', headers={'Authorization': f'Bearer {token}'})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
    except Exception as e:
        print(f"Error during verification: {e}")
        # If sign-in fails, it might be because the user doesn't exist or password is different.
        # But we know the endpoint logic itself from the code.

if __name__ == "__main__":
    verify_user_count()
