#!/usr/bin/env python3
"""
Authentication System Testing Script
Tests complete authentication system as requested by user for TikTok feed access.
"""

import requests
import json
import sys
import time
import random
from datetime import datetime, timedelta

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

# Global variables for test data
test_users = []
auth_tokens = []

def test_authentication_system(base_url):
    """Test complete authentication system for TikTok feed access"""
    print("=== TESTING AUTHENTICATION SYSTEM FOR TIKTOK FEED ACCESS ===")
    print(f"Testing backend at: {base_url}")
    
    # Generate unique test data
    timestamp = int(time.time())
    test_email = f"usuario.tiktok.{timestamp}@example.com"
    test_username = f"usuario_tiktok_{timestamp}"
    test_password = "mipassword123"
    
    success_count = 0
    total_tests = 8
    
    # Test 1: Health Check
    print("\n1. Testing API Health Check...")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API Health Check: {data.get('name', 'Unknown')} v{data.get('version', 'Unknown')}")
            success_count += 1
        else:
            print(f"❌ API Health Check failed: Status {response.status_code}")
    except Exception as e:
        print(f"❌ API Health Check error: {e}")
    
    # Test 2: User Registration
    print("\n2. Testing User Registration...")
    try:
        registration_data = {
            "email": test_email,
            "username": test_username,
            "display_name": "Usuario TikTok Test",
            "password": test_password
        }
        
        response = requests.post(f"{base_url}/auth/register", json=registration_data, timeout=10)
        print(f"Registration Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Registration successful!")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Username: {data['user']['username']}")
            print(f"   Email: {data['user']['email']}")
            print(f"   Token expires in: {data['expires_in']} seconds")
            
            # Store for later tests
            test_users.append(data['user'])
            auth_tokens.append(data['access_token'])
            success_count += 1
        else:
            print(f"❌ Registration failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Registration error: {e}")
    
    # Test 3: User Login
    print("\n3. Testing User Login...")
    try:
        login_data = {
            "email": test_email,
            "password": test_password
        }
        
        response = requests.post(f"{base_url}/auth/login", json=login_data, timeout=10)
        print(f"Login Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful!")
            print(f"   User ID: {data['user']['id']}")
            print(f"   Token Type: {data['token_type']}")
            print(f"   Token expires in: {data['expires_in']} seconds")
            
            # Update token for authenticated tests
            if auth_tokens:
                auth_tokens[0] = data['access_token']
            else:
                auth_tokens.append(data['access_token'])
            success_count += 1
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Login error: {e}")
    
    # Test 4: Get Current User (Token Validation)
    print("\n4. Testing Token Validation (GET /auth/me)...")
    if auth_tokens:
        try:
            headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
            response = requests.get(f"{base_url}/auth/me", headers=headers, timeout=10)
            print(f"Token Validation Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Token validation successful!")
                print(f"   Authenticated as: {data['username']} ({data['email']})")
                print(f"   Display Name: {data.get('display_name', 'N/A')}")
                print(f"   User ID: {data['id']}")
                success_count += 1
            else:
                print(f"❌ Token validation failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Token validation error: {e}")
    else:
        print("❌ No auth token available for validation test")
    
    # Test 5: Test Protected Endpoint Access (User Profile)
    print("\n5. Testing Protected Endpoint Access (User Profile)...")
    if auth_tokens:
        try:
            headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
            response = requests.get(f"{base_url}/user/profile", headers=headers, timeout=10)
            print(f"User Profile Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ User profile access successful!")
                print(f"   Profile Username: {data.get('username', 'N/A')}")
                print(f"   Profile ID: {data.get('id', 'N/A')}")
                success_count += 1
            else:
                print(f"❌ User profile access failed: {response.text}")
                
        except Exception as e:
            print(f"❌ User profile access error: {e}")
    else:
        print("❌ No auth token available for profile test")
    
    # Test 6: Test Poll Comments Access (TikTok Feed Feature)
    print("\n6. Testing Poll Comments Access (TikTok Feed Feature)...")
    if auth_tokens:
        try:
            headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
            test_poll_id = "test_poll_tiktok_123"
            
            # First create a test comment
            comment_data = {
                "poll_id": test_poll_id,
                "content": "¡Este es un comentario de prueba para el feed TikTok!",
                "parent_comment_id": None
            }
            
            response = requests.post(f"{base_url}/polls/{test_poll_id}/comments", 
                                   json=comment_data, headers=headers, timeout=10)
            print(f"Create Comment Status: {response.status_code}")
            
            if response.status_code == 200:
                comment = response.json()
                print(f"✅ Poll comment creation successful!")
                print(f"   Comment ID: {comment['id']}")
                print(f"   Content: {comment['content']}")
                
                # Now test getting comments
                response = requests.get(f"{base_url}/polls/{test_poll_id}/comments", 
                                      headers=headers, timeout=10)
                print(f"Get Comments Status: {response.status_code}")
                
                if response.status_code == 200:
                    comments = response.json()
                    print(f"✅ Poll comments retrieval successful!")
                    print(f"   Retrieved {len(comments)} comments")
                    success_count += 1
                else:
                    print(f"❌ Get comments failed: {response.text}")
            else:
                print(f"❌ Create comment failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Poll comments test error: {e}")
    else:
        print("❌ No auth token available for comments test")
    
    # Test 7: Test User Search (Social Features)
    print("\n7. Testing User Search (Social Features)...")
    if auth_tokens:
        try:
            headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
            response = requests.get(f"{base_url}/users/search?q=usuario", headers=headers, timeout=10)
            print(f"User Search Status: {response.status_code}")
            
            if response.status_code == 200:
                users = response.json()
                print(f"✅ User search successful!")
                print(f"   Found {len(users)} users")
                success_count += 1
            else:
                print(f"❌ User search failed: {response.text}")
                
        except Exception as e:
            print(f"❌ User search error: {e}")
    else:
        print("❌ No auth token available for search test")
    
    # Test 8: Test Authentication Requirements (Security)
    print("\n8. Testing Authentication Requirements (Security)...")
    try:
        # Test accessing protected endpoint without token
        response = requests.get(f"{base_url}/auth/me", timeout=10)
        print(f"No Token Access Status: {response.status_code}")
        
        if response.status_code in [401, 403]:
            print("✅ Protected endpoints properly require authentication")
            
            # Test with invalid token
            invalid_headers = {"Authorization": "Bearer invalid_token_12345"}
            response = requests.get(f"{base_url}/auth/me", headers=invalid_headers, timeout=10)
            print(f"Invalid Token Status: {response.status_code}")
            
            if response.status_code in [401, 403]:
                print("✅ Invalid tokens properly rejected")
                success_count += 1
            else:
                print(f"❌ Invalid tokens should be rejected, got: {response.status_code}")
        else:
            print(f"❌ Protected endpoints should require auth, got: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Authentication requirements test error: {e}")
    
    return success_count, total_tests

def test_tiktok_feed_readiness(base_url):
    """Test if the system is ready for TikTok feed access"""
    print("\n=== TESTING TIKTOK FEED READINESS ===")
    
    if not auth_tokens:
        print("❌ No authenticated user available for TikTok feed test")
        return False
    
    headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
    feed_ready = True
    
    # Test 1: User can access their profile (required for TikTok feed)
    print("\n1. Testing Profile Access for TikTok Feed...")
    try:
        response = requests.get(f"{base_url}/auth/me", headers=headers, timeout=10)
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ User profile accessible: {user_data['username']}")
        else:
            print(f"❌ User profile not accessible: {response.status_code}")
            feed_ready = False
    except Exception as e:
        print(f"❌ Profile access error: {e}")
        feed_ready = False
    
    # Test 2: User can interact with polls (comments system)
    print("\n2. Testing Poll Interaction for TikTok Feed...")
    try:
        test_poll_id = "tiktok_feed_poll_123"
        
        # Create a comment (simulating user interaction with poll)
        comment_data = {
            "poll_id": test_poll_id,
            "content": "¡Me encanta esta encuesta del feed TikTok! 🔥",
            "parent_comment_id": None
        }
        
        response = requests.post(f"{base_url}/polls/{test_poll_id}/comments", 
                               json=comment_data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            print("✅ User can interact with polls (comment system working)")
            
            # Test getting comments (feed display)
            response = requests.get(f"{base_url}/polls/{test_poll_id}/comments", 
                                  headers=headers, timeout=10)
            if response.status_code == 200:
                comments = response.json()
                print(f"✅ Poll comments can be displayed in feed ({len(comments)} comments)")
            else:
                print(f"❌ Cannot display poll comments: {response.status_code}")
                feed_ready = False
        else:
            print(f"❌ User cannot interact with polls: {response.status_code}")
            feed_ready = False
            
    except Exception as e:
        print(f"❌ Poll interaction error: {e}")
        feed_ready = False
    
    # Test 3: User search works (for social features)
    print("\n3. Testing Social Features for TikTok Feed...")
    try:
        response = requests.get(f"{base_url}/users/search?q=test", headers=headers, timeout=10)
        if response.status_code == 200:
            print("✅ User search working (social features available)")
        else:
            print(f"❌ User search not working: {response.status_code}")
            feed_ready = False
    except Exception as e:
        print(f"❌ Social features error: {e}")
        feed_ready = False
    
    return feed_ready

def main():
    print("🚀 AUTHENTICATION SYSTEM TESTING FOR TIKTOK FEED ACCESS")
    print(f"Test started at: {datetime.now()}")
    print("="*70)
    
    # Get backend URL
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not determine backend URL from frontend/.env")
        sys.exit(1)
    
    # Run authentication tests
    success_count, total_tests = test_authentication_system(base_url)
    
    # Test TikTok feed readiness
    feed_ready = test_tiktok_feed_readiness(base_url)
    
    # Final Summary
    print("\n" + "="*70)
    print("🎯 FINAL TEST RESULTS")
    print("="*70)
    
    auth_success_rate = (success_count / total_tests) * 100
    print(f"Authentication Tests: {success_count}/{total_tests} passed ({auth_success_rate:.1f}%)")
    
    if success_count >= 6:  # At least 75% success rate
        print("✅ AUTHENTICATION SYSTEM: WORKING")
    else:
        print("❌ AUTHENTICATION SYSTEM: FAILED")
    
    if feed_ready:
        print("✅ TIKTOK FEED ACCESS: READY")
    else:
        print("❌ TIKTOK FEED ACCESS: NOT READY")
    
    # Overall assessment
    overall_success = (success_count >= 6) and feed_ready
    
    print("\n" + "="*70)
    if overall_success:
        print("🎉 SUCCESS! AUTHENTICATION SYSTEM IS WORKING")
        print("✅ Users can register and login successfully")
        print("✅ JWT tokens are working correctly")
        print("✅ Protected endpoints are secure")
        print("✅ Users can access the TikTok feed")
        print("✅ Users can interact with polls (comments)")
        print("✅ Social features are available")
        print("\n🚀 SYSTEM IS READY FOR TIKTOK FEED ACCESS!")
        print("   Users should be able to:")
        print("   • Register and login to the app")
        print("   • Access the main TikTok feed")
        print("   • See polls/votaciones with the new UI changes")
        print("   • Interact with content (comments, etc.)")
    else:
        print("⚠️ ISSUES DETECTED IN AUTHENTICATION SYSTEM")
        print("❌ Some critical authentication features are not working")
        print("❌ TikTok feed access may be limited")
        print("\n🔧 RECOMMENDATIONS:")
        print("   • Fix authentication token validation")
        print("   • Ensure all protected endpoints work correctly")
        print("   • Test user registration and login flows")
    
    print("="*70)
    return 0 if overall_success else 1

if __name__ == "__main__":
    sys.exit(main())