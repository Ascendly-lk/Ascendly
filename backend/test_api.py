import requests
from dotenv import load_dotenv
import os

load_dotenv()

def end_to_end_test():
    try:
        from database.supabase_client import get_supabase_client
        client = get_supabase_client()
        # authenticate to get a valid token
        print("Signing in...")
        # try the test user from db_dump
        auth_response = client.auth.sign_in_with_password({"email": "test@ascendly.com", "password": "password123"})
        token = auth_response.session.access_token
        print("Got token.")
        
        # Test backend metrics endpoint
        print("Calling /dashboard/metrics...")
        response = requests.get('http://localhost:8000/dashboard/metrics', headers={'Authorization': f'Bearer {token}'})
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    end_to_end_test()
