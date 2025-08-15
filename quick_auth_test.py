#!/usr/bin/env python3
"""
Quick Authentication Test - Testing specific endpoints as requested
Tests: POST /api/auth/register, POST /api/auth/login, GET /api/auth/me
"""

import requests
import json
import time
from datetime import datetime

def get_backend_url():
    """Get backend URL from frontend .env file"""
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    base_url = line.split('=', 1)[1].strip()
                    return f"{base_url}/api"
        return None
    except Exception as e:
        print(f"Error reading frontend .env file: {e}")
        return None

def test_quick_authentication():
    """Quick test of the three authentication endpoints"""
    print("=== QUICK AUTHENTICATION TEST ===")
    print(f"Test started at: {datetime.now()}")
    
    # Get backend URL
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not determine backend URL from frontend/.env")
        return False
    
    print(f"Testing backend at: {base_url}")
    
    # Generate unique test data
    timestamp = int(time.time())
    test_user = {
        "email": f"testuser.{timestamp}@example.com",
        "username": f"testuser_{timestamp}",
        "display_name": "Test User",
        "password": "testpassword123"
    }
    
    auth_token = None
    
    # Test 1: POST /api/auth/register
    print("\n1. Testing POST /api/auth/register...")
    try:
        response = requests.post(f"{base_url}/auth/register", json=test_user, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Registration successful!")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Username: {data['user']['username']}")
            print(f"   Email: {data['user']['email']}")
            print(f"   Token Type: {data['token_type']}")
            print(f"   Expires In: {data['expires_in']} seconds")
            auth_token = data['access_token']
        else:
            print(f"   ❌ Registration failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Registration error: {e}")
        return False
    
    # Test 2: POST /api/auth/login
    print("\n2. Testing POST /api/auth/login...")
    try:
        login_data = {
            "email": test_user["email"],
            "password": test_user["password"]
        }
        response = requests.post(f"{base_url}/auth/login", json=login_data, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Login successful!")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Username: {data['user']['username']}")
            print(f"   Email: {data['user']['email']}")
            print(f"   Token Type: {data['token_type']}")
            # Update token from login response
            auth_token = data['access_token']
        else:
            print(f"   ❌ Login failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Login error: {e}")
        return False
    
    # Test 3: GET /api/auth/me
    print("\n3. Testing GET /api/auth/me...")
    try:
        if not auth_token:
            print("   ❌ No auth token available")
            return False
            
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{base_url}/auth/me", headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Token verification successful!")
            print(f"   User ID: {data['id']}")
            print(f"   Username: {data['username']}")
            print(f"   Email: {data['email']}")
            print(f"   Display Name: {data['display_name']}")
        else:
            print(f"   ❌ Token verification failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Token verification error: {e}")
        return False
    
    # Bonus: Test invalid token
    print("\n4. Testing invalid token (bonus)...")
    try:
        invalid_headers = {"Authorization": "Bearer invalid_token_123"}
        response = requests.get(f"{base_url}/auth/me", headers=invalid_headers, timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code in [401, 403]:
            print(f"   ✅ Invalid token properly rejected!")
        else:
            print(f"   ⚠️  Invalid token should be rejected, got status: {response.status_code}")
            
    except Exception as e:
        print(f"   ❌ Invalid token test error: {e}")
    
    print("\n=== QUICK TEST SUMMARY ===")
    print("✅ POST /api/auth/register - Working")
    print("✅ POST /api/auth/login - Working") 
    print("✅ GET /api/auth/me - Working")
    print("\n🚀 RESULT: All authentication endpoints are working correctly!")
    print("✅ Backend is ready for frontend development")
    
    return True

if __name__ == "__main__":
    success = test_quick_authentication()
    exit(0 if success else 1)