#!/usr/bin/env python3
"""
Backend Health Check Test - Quick verification after profile page changes
Tests: Basic API health, Authentication endpoints, User profile endpoints, Services status
"""

import requests
import json
import sys
import time
from datetime import datetime

# Get backend URL from frontend .env file
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

def test_basic_health_check(base_url):
    """Test basic API health check"""
    print("=== Testing Basic API Health Check ===")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if "Social Network API" in data.get("name", ""):
                print("✅ Basic API health check working correctly")
                return True
        
        print("❌ Basic API health check failed")
        return False
    except Exception as e:
        print(f"❌ Basic API health check error: {e}")
        return False

def test_authentication_endpoints(base_url):
    """Test authentication endpoints (register/login)"""
    print("\n=== Testing Authentication Endpoints ===")
    
    # Generate unique test data
    timestamp = int(time.time())
    test_user = {
        "email": f"healthcheck.{timestamp}@example.com",
        "username": f"healthcheck_{timestamp}",
        "display_name": "Health Check User",
        "password": "testpass123"
    }
    
    # Test registration
    print("Testing user registration...")
    try:
        response = requests.post(f"{base_url}/auth/register", json=test_user, timeout=10)
        print(f"Registration Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ User registration working correctly")
            print(f"User ID: {data['user']['id']}")
            print(f"Token Type: {data['token_type']}")
            
            # Test login with same credentials
            print("\nTesting user login...")
            login_data = {
                "email": test_user["email"],
                "password": test_user["password"]
            }
            
            response = requests.post(f"{base_url}/auth/login", json=login_data, timeout=10)
            print(f"Login Status Code: {response.status_code}")
            
            if response.status_code == 200:
                login_result = response.json()
                print("✅ User login working correctly")
                print(f"Login Token Type: {login_result['token_type']}")
                
                # Test get current user
                print("\nTesting get current user...")
                headers = {"Authorization": f"Bearer {login_result['access_token']}"}
                response = requests.get(f"{base_url}/auth/me", headers=headers, timeout=10)
                print(f"Get Current User Status Code: {response.status_code}")
                
                if response.status_code == 200:
                    user_data = response.json()
                    print("✅ Get current user working correctly")
                    print(f"Username: {user_data['username']}")
                    return True
                else:
                    print(f"❌ Get current user failed: {response.text}")
            else:
                print(f"❌ User login failed: {response.text}")
        else:
            print(f"❌ User registration failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Authentication endpoints error: {e}")
    
    return False

def test_user_profile_endpoints(base_url):
    """Test user profile endpoints"""
    print("\n=== Testing User Profile Endpoints ===")
    
    # First register a user to get auth token
    timestamp = int(time.time())
    test_user = {
        "email": f"profile.test.{timestamp}@example.com",
        "username": f"profile_test_{timestamp}",
        "display_name": "Profile Test User",
        "password": "testpass123"
    }
    
    try:
        # Register user
        response = requests.post(f"{base_url}/auth/register", json=test_user, timeout=10)
        if response.status_code != 200:
            print("❌ Could not register user for profile test")
            return False
        
        data = response.json()
        headers = {"Authorization": f"Bearer {data['access_token']}"}
        user_id = data['user']['id']
        
        # Test get my profile
        print("Testing get my profile...")
        response = requests.get(f"{base_url}/user/profile", headers=headers, timeout=10)
        print(f"Get My Profile Status Code: {response.status_code}")
        
        if response.status_code == 200:
            profile_data = response.json()
            print("✅ Get my profile working correctly")
            print(f"Profile Username: {profile_data['username']}")
            
            # Test get user profile by ID (public endpoint)
            print("\nTesting get user profile by ID...")
            response = requests.get(f"{base_url}/user/profile/{user_id}", timeout=10)
            print(f"Get User Profile Status Code: {response.status_code}")
            
            if response.status_code == 200:
                public_profile = response.json()
                print("✅ Get user profile by ID working correctly")
                print(f"Public Profile Username: {public_profile['username']}")
                return True
            else:
                print(f"❌ Get user profile by ID failed: {response.text}")
        else:
            print(f"❌ Get my profile failed: {response.text}")
            
    except Exception as e:
        print(f"❌ User profile endpoints error: {e}")
    
    return False

def test_services_status():
    """Test if all services are running properly"""
    print("\n=== Testing Services Status ===")
    
    try:
        import subprocess
        result = subprocess.run(['sudo', 'supervisorctl', 'status'], 
                              capture_output=True, text=True, timeout=10)
        
        print("Supervisor Status:")
        print(result.stdout)
        
        if result.returncode == 0:
            # Check if backend and frontend are running
            status_lines = result.stdout.strip().split('\n')
            backend_running = any('backend' in line and 'RUNNING' in line for line in status_lines)
            frontend_running = any('frontend' in line and 'RUNNING' in line for line in status_lines)
            
            if backend_running and frontend_running:
                print("✅ All services are running properly")
                return True
            else:
                print("❌ Some services are not running")
                return False
        else:
            print("❌ Could not check service status")
            return False
            
    except Exception as e:
        print(f"❌ Services status check error: {e}")
        return False

def main():
    print("=== BACKEND HEALTH CHECK AFTER PROFILE PAGE CHANGES ===")
    print(f"Test started at: {datetime.now()}")
    
    # Get backend URL
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not determine backend URL from frontend/.env")
        sys.exit(1)
    
    print(f"Testing backend at: {base_url}")
    
    # Run health check tests
    results = {}
    
    print("\n" + "="*60)
    results['basic_health'] = test_basic_health_check(base_url)
    
    print("\n" + "="*60)
    results['authentication'] = test_authentication_endpoints(base_url)
    
    print("\n" + "="*60)
    results['user_profiles'] = test_user_profile_endpoints(base_url)
    
    print("\n" + "="*60)
    results['services'] = test_services_status()
    
    # Summary
    print("\n" + "="*60)
    print("=== BACKEND HEALTH CHECK SUMMARY ===")
    print(f"Basic API Health: {'✅ PASS' if results['basic_health'] else '❌ FAIL'}")
    print(f"Authentication Endpoints: {'✅ PASS' if results['authentication'] else '❌ FAIL'}")
    print(f"User Profile Endpoints: {'✅ PASS' if results['user_profiles'] else '❌ FAIL'}")
    print(f"Services Status: {'✅ PASS' if results['services'] else '❌ FAIL'}")
    
    # Overall status
    all_passed = all(results.values())
    
    print(f"\n🚀 Overall Backend Health: {'✅ ALL SYSTEMS OPERATIONAL' if all_passed else '❌ ISSUES DETECTED'}")
    
    if all_passed:
        print("\n🎉 BACKEND HEALTH CHECK PASSED!")
        print("✅ Basic API health check working")
        print("✅ Authentication endpoints (register/login) functional")
        print("✅ User profile endpoints operational")
        print("✅ All services running properly")
        print("\n✅ Backend is ready to support frontend profile page functionality")
    else:
        print("\n⚠️  BACKEND HEALTH ISSUES DETECTED")
        print("See detailed logs above for specific problems")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())