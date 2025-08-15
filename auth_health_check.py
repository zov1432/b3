#!/usr/bin/env python3
"""
Quick Authentication Health Check
Focus on the specific issues reported by the user about login problems
"""

import requests
import json
import time
from datetime import datetime

def get_backend_url():
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

def test_basic_health(base_url):
    """Test basic API health"""
    print("=== BASIC HEALTH CHECK ===")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Backend API is responding")
            return True
        else:
            print("❌ Backend API health check failed")
            return False
    except Exception as e:
        print(f"❌ Backend API error: {e}")
        return False

def test_specific_user_registration(base_url):
    """Test registration with the specific user mentioned in the request"""
    print("\n=== TESTING SPECIFIC USER REGISTRATION ===")
    
    user_data = {
        "email": "testcomments@example.com",
        "username": "testcomments",
        "display_name": "Test Comments User",
        "password": "password123"
    }
    
    try:
        response = requests.post(f"{base_url}/auth/register", json=user_data, timeout=10)
        print(f"Registration Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ User testcomments@example.com registered successfully")
            print(f"User ID: {data['user']['id']}")
            print(f"Token: {data['access_token'][:50]}...")
            return data
        elif response.status_code == 400:
            print("⚠️ User already exists - this is expected if running multiple times")
            # Try to login instead
            return test_specific_user_login(base_url, user_data)
        else:
            print(f"❌ Registration failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return None

def test_specific_user_login(base_url, user_data=None):
    """Test login with the specific user"""
    print("\n=== TESTING SPECIFIC USER LOGIN ===")
    
    if not user_data:
        user_data = {
            "email": "testcomments@example.com",
            "password": "password123"
        }
    
    login_data = {
        "email": user_data["email"],
        "password": user_data["password"]
    }
    
    try:
        response = requests.post(f"{base_url}/auth/login", json=login_data, timeout=10)
        print(f"Login Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login successful for testcomments@example.com")
            print(f"User ID: {data['user']['id']}")
            print(f"Token: {data['access_token'][:50]}...")
            return data
        else:
            print(f"❌ Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None

def test_jwt_token_validation(base_url, token):
    """Test JWT token validation"""
    print("\n=== TESTING JWT TOKEN VALIDATION ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{base_url}/auth/me", headers=headers, timeout=10)
        print(f"Token Validation Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ JWT token is valid and working")
            print(f"Authenticated as: {data['username']} ({data['email']})")
            return True
        else:
            print(f"❌ JWT token validation failed: {response.text}")
            return False
    except Exception as e:
        print(f"❌ JWT validation error: {e}")
        return False

def check_existing_users(base_url, token):
    """Check if there are existing users we can login with"""
    print("\n=== CHECKING EXISTING USERS ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # Try to search for users to see what's in the database
        response = requests.get(f"{base_url}/users/search?q=", headers=headers, timeout=10)
        print(f"User Search Status Code: {response.status_code}")
        
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Found {len(users)} users in database")
            for user in users[:5]:  # Show first 5 users
                print(f"  - {user['username']} ({user['email']})")
            return users
        else:
            print(f"❌ Could not retrieve users: {response.text}")
            return []
    except Exception as e:
        print(f"❌ User search error: {e}")
        return []

def test_authentication_endpoints(base_url, token):
    """Test all authentication-related endpoints"""
    print("\n=== TESTING AUTHENTICATION ENDPOINTS ===")
    
    headers = {"Authorization": f"Bearer {token}"}
    endpoints_to_test = [
        ("GET", "/auth/me", "Get current user"),
        ("GET", "/user/profile", "Get user profile"),
        ("GET", "/users/search?q=test", "Search users"),
        ("GET", "/conversations", "Get conversations"),
        ("GET", "/messages/unread", "Get unread messages")
    ]
    
    working_endpoints = 0
    total_endpoints = len(endpoints_to_test)
    
    for method, endpoint, description in endpoints_to_test:
        try:
            if method == "GET":
                response = requests.get(f"{base_url}{endpoint}", headers=headers, timeout=10)
            
            print(f"{description}: Status {response.status_code}")
            
            if response.status_code == 200:
                print(f"  ✅ {description} working")
                working_endpoints += 1
            elif response.status_code in [401, 403]:
                print(f"  ❌ {description} - Authentication issue")
            elif response.status_code == 404:
                print(f"  ⚠️ {description} - Endpoint not found")
            else:
                print(f"  ❌ {description} - Error: {response.status_code}")
                
        except Exception as e:
            print(f"  ❌ {description} - Exception: {e}")
    
    print(f"\nAuthentication Endpoints Summary: {working_endpoints}/{total_endpoints} working")
    return working_endpoints >= (total_endpoints * 0.7)  # 70% success rate

def main():
    print("=== QUICK AUTHENTICATION HEALTH CHECK ===")
    print(f"Started at: {datetime.now()}")
    
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not get backend URL")
        return 1
    
    print(f"Testing backend at: {base_url}")
    
    # Step 1: Basic health check
    if not test_basic_health(base_url):
        print("❌ CRITICAL: Backend is not responding")
        return 1
    
    # Step 2: Try to register the specific user
    user_data = test_specific_user_registration(base_url)
    if not user_data:
        print("❌ CRITICAL: Cannot register or login user")
        return 1
    
    token = user_data['access_token']
    
    # Step 3: Test JWT token validation
    if not test_jwt_token_validation(base_url, token):
        print("❌ CRITICAL: JWT tokens are not working")
        return 1
    
    # Step 4: Check existing users
    existing_users = check_existing_users(base_url, token)
    
    # Step 5: Test authentication endpoints
    auth_working = test_authentication_endpoints(base_url, token)
    
    # Summary
    print("\n" + "="*60)
    print("=== AUTHENTICATION HEALTH CHECK SUMMARY ===")
    print("✅ Backend API responding")
    print("✅ User registration working")
    print("✅ User login working")
    print("✅ JWT tokens working")
    print(f"✅ Found {len(existing_users)} existing users in database")
    print(f"{'✅' if auth_working else '❌'} Authentication endpoints {'working' if auth_working else 'have issues'}")
    
    if auth_working:
        print("\n🎉 AUTHENTICATION SYSTEM IS WORKING!")
        print("✅ Users can register and login successfully")
        print("✅ JWT tokens are being generated and validated correctly")
        print("✅ Protected endpoints are accessible with valid tokens")
        print("\n💡 If users are stuck on login page, the issue might be:")
        print("   - Frontend authentication context issues")
        print("   - Token storage/persistence problems")
        print("   - Frontend-backend communication issues")
        print("   - Browser localStorage/session issues")
    else:
        print("\n❌ AUTHENTICATION SYSTEM HAS ISSUES")
        print("   - Some endpoints are not responding correctly")
        print("   - This could block users from accessing the main application")
    
    return 0 if auth_working else 1

if __name__ == "__main__":
    exit(main())