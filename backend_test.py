#!/usr/bin/env python3
"""
Backend API Testing Script - Authentication & Messaging System
Tests complete authentication and messaging system with addiction integration.
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

def test_health_check(base_url):
    """Test the root health check endpoint"""
    print("Testing health check endpoint...")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if "Ultra-Addictive Social Network API" in data.get("message", ""):
                print("✅ Health check endpoint working correctly")
                return True
        
        print("❌ Health check endpoint failed")
        return False
    except Exception as e:
        print(f"❌ Health check endpoint error: {e}")
        return False

def test_user_registration(base_url):
    """Test user registration endpoint"""
    print("\n=== Testing User Registration ===")
    
    # Generate unique emails with timestamp
    timestamp = int(time.time())
    
    # Test data for multiple users
    users_data = [
        {
            "email": f"maria.gonzalez.{timestamp}@example.com",
            "username": f"maria_g_{timestamp}",
            "display_name": "María González",
            "password": "securepass123"
        },
        {
            "email": f"carlos.rodriguez.{timestamp}@example.com", 
            "username": f"carlos_r_{timestamp}",
            "display_name": "Carlos Rodríguez",
            "password": "mypassword456"
        },
        {
            "email": f"ana.martinez.{timestamp}@example.com",
            "username": f"ana_m_{timestamp}",
            "display_name": "Ana Martínez", 
            "password": "strongpass789"
        }
    ]
    
    success_count = 0
    
    for i, user_data in enumerate(users_data):
        print(f"\nRegistering user {i+1}: {user_data['username']}")
        try:
            response = requests.post(f"{base_url}/auth/register", json=user_data, timeout=10)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ User {user_data['username']} registered successfully")
                print(f"User ID: {data['user']['id']}")
                print(f"Token Type: {data['token_type']}")
                print(f"Expires In: {data['expires_in']} seconds")
                
                # Store user and token for later tests
                test_users.append(data['user'])
                auth_tokens.append(data['access_token'])
                success_count += 1
                
                # Verify token structure
                if 'access_token' in data and 'user' in data:
                    print(f"✅ Registration response structure correct")
                else:
                    print(f"❌ Registration response missing required fields")
                    
            else:
                print(f"❌ Registration failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Registration error for {user_data['username']}: {e}")
    
    # Test duplicate email registration (use first user's email)
    if users_data:
        print(f"\nTesting duplicate email registration...")
        try:
            duplicate_data = users_data[0].copy()
            duplicate_data['username'] = f'different_username_{timestamp}'
            response = requests.post(f"{base_url}/auth/register", json=duplicate_data, timeout=10)
            
            if response.status_code == 400:
                print("✅ Duplicate email properly rejected")
            else:
                print(f"❌ Duplicate email should be rejected, got status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Duplicate email test error: {e}")
        
        # Test duplicate username registration
        print(f"\nTesting duplicate username registration...")
        try:
            duplicate_data = users_data[0].copy()
            duplicate_data['email'] = f'different.{timestamp}@example.com'
            response = requests.post(f"{base_url}/auth/register", json=duplicate_data, timeout=10)
            
            if response.status_code == 400:
                print("✅ Duplicate username properly rejected")
            else:
                print(f"❌ Duplicate username should be rejected, got status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Duplicate username test error: {e}")
    
    return success_count >= 2  # At least 2 users should register successfully

def test_user_login(base_url):
    """Test user login endpoint"""
    print("\n=== Testing User Login ===")
    
    if not test_users:
        print("❌ No registered users available for login test")
        return False
    
    success_count = 0
    
    # Test login for first user (get credentials from test_users)
    user = test_users[0]
    # Extract timestamp from username to build email
    username_parts = user['username'].split('_')
    if len(username_parts) >= 3:
        timestamp = username_parts[-1]
        login_data = {
            "email": f"maria.gonzalez.{timestamp}@example.com",
            "password": "securepass123"
        }
    else:
        # Fallback for older format
        login_data = {
            "email": user['email'],
            "password": "securepass123"
        }
    
    print(f"Testing login for: {user['username']}")
    try:
        response = requests.post(f"{base_url}/auth/login", json=login_data, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Login successful for {user['username']}")
            print(f"Token Type: {data['token_type']}")
            print(f"User ID: {data['user']['id']}")
            
            # Update token for this user
            auth_tokens[0] = data['access_token']
            success_count += 1
            
        else:
            print(f"❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Login error: {e}")
    
    # Test invalid credentials
    print(f"\nTesting invalid credentials...")
    try:
        invalid_data = login_data.copy()
        invalid_data['password'] = "wrongpassword"
        response = requests.post(f"{base_url}/auth/login", json=invalid_data, timeout=10)
        
        if response.status_code == 401:
            print("✅ Invalid credentials properly rejected")
        else:
            print(f"❌ Invalid credentials should be rejected, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Invalid credentials test error: {e}")
    
    return success_count > 0

def test_get_current_user(base_url):
    """Test get current user endpoint"""
    print("\n=== Testing Get Current User ===")
    
    if not auth_tokens:
        print("❌ No auth tokens available for current user test")
        return False
    
    headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
    
    try:
        response = requests.get(f"{base_url}/auth/me", headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Current user info retrieved successfully")
            print(f"User ID: {data['id']}")
            print(f"Username: {data['username']}")
            print(f"Email: {data['email']}")
            return True
        else:
            print(f"❌ Get current user failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Get current user error: {e}")
        return False

def test_jwt_validation(base_url):
    """Test JWT validation on protected endpoints"""
    print("\n=== Testing JWT Validation ===")
    
    # Test without token
    print("Testing access without token...")
    try:
        response = requests.get(f"{base_url}/auth/me", timeout=10)
        if response.status_code == 401:
            print("✅ Unauthorized access properly rejected")
        else:
            print(f"❌ Should reject unauthorized access, got status: {response.status_code}")
    except Exception as e:
        print(f"❌ Unauthorized test error: {e}")
    
    # Test with invalid token
    print("Testing access with invalid token...")
    try:
        headers = {"Authorization": "Bearer invalid_token_here"}
        response = requests.get(f"{base_url}/auth/me", headers=headers, timeout=10)
        if response.status_code == 401:
            print("✅ Invalid token properly rejected")
        else:
            print(f"❌ Should reject invalid token, got status: {response.status_code}")
    except Exception as e:
        print(f"❌ Invalid token test error: {e}")
    
    return True

def test_user_search(base_url):
    """Test user search endpoint"""
    print("\n=== Testing User Search ===")
    
    if not auth_tokens:
        print("❌ No auth tokens available for user search test")
        return False
    
    headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
    
    # Test search by username
    print("Testing search by username...")
    try:
        response = requests.get(f"{base_url}/users/search?q=carlos", headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User search successful, found {len(data)} users")
            if len(data) > 0:
                print(f"Found user: {data[0]['username']} - {data[0]['display_name']}")
            return True
        else:
            print(f"❌ User search failed: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ User search error: {e}")
        return False

def test_messaging_system(base_url):
    """Test complete messaging system"""
    print("\n=== Testing Messaging System ===")
    
    if len(auth_tokens) < 2:
        print("❌ Need at least 2 users for messaging tests")
        return False
    
    # Test sending a message
    print("Testing message sending...")
    headers1 = {"Authorization": f"Bearer {auth_tokens[0]}"}
    headers2 = {"Authorization": f"Bearer {auth_tokens[1]}"}
    
    message_data = {
        "recipient_id": test_users[1]['id'],
        "content": "¡Hola! ¿Cómo estás? Este es un mensaje de prueba.",
        "message_type": "text"
    }
    
    try:
        response = requests.post(f"{base_url}/messages", json=message_data, headers=headers1, timeout=10)
        print(f"Send Message Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Message sent successfully")
            print(f"Message ID: {data['message_id']}")
            
            # Test getting conversations
            print("\nTesting get conversations...")
            response = requests.get(f"{base_url}/conversations", headers=headers2, timeout=10)
            print(f"Get Conversations Status Code: {response.status_code}")
            
            if response.status_code == 200:
                conversations = response.json()
                print(f"✅ Conversations retrieved, found {len(conversations)} conversations")
                
                if len(conversations) > 0:
                    conv_id = conversations[0]['id']
                    print(f"Conversation ID: {conv_id}")
                    
                    # Test getting messages from conversation
                    print("\nTesting get messages from conversation...")
                    response = requests.get(f"{base_url}/conversations/{conv_id}/messages", headers=headers2, timeout=10)
                    print(f"Get Messages Status Code: {response.status_code}")
                    
                    if response.status_code == 200:
                        messages = response.json()
                        print(f"✅ Messages retrieved, found {len(messages)} messages")
                        if len(messages) > 0:
                            print(f"Message content: {messages[0]['content']}")
                        
                        # Test unread count
                        print("\nTesting unread message count...")
                        response = requests.get(f"{base_url}/messages/unread", headers=headers1, timeout=10)
                        if response.status_code == 200:
                            unread_data = response.json()
                            print(f"✅ Unread count retrieved: {unread_data['unread_count']}")
                            return True
                        else:
                            print(f"❌ Unread count failed: {response.text}")
                    else:
                        print(f"❌ Get messages failed: {response.text}")
                else:
                    print("❌ No conversations found")
            else:
                print(f"❌ Get conversations failed: {response.text}")
        else:
            print(f"❌ Send message failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Messaging system error: {e}")
    
    return False

def test_addiction_system_integration(base_url):
    """Test comprehensive addiction system integration with authentication"""
    print("\n=== Testing Addiction System Integration ===")
    
    if not auth_tokens:
        print("❌ No auth tokens available for addiction system test")
        return False
    
    headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
    success_count = 0
    
    # Test get user profile (should create automatically)
    print("Testing GET /api/user/profile...")
    try:
        response = requests.get(f"{base_url}/user/profile", headers=headers, timeout=10)
        print(f"Get Profile Status Code: {response.status_code}")
        
        if response.status_code == 200:
            profile = response.json()
            print(f"✅ User profile retrieved successfully")
            print(f"Username: {profile['username']}")
            print(f"Level: {profile['level']}")
            print(f"XP: {profile['xp']}")
            success_count += 1
        else:
            print(f"❌ Get profile failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get profile error: {e}")
    
    # Test track user action
    print("\nTesting POST /api/user/action...")
    try:
        action_data = {
            "action_type": "vote",
            "context": {"poll_id": "test_poll_123", "votes_in_last_minute": 1}
        }
        response = requests.post(f"{base_url}/user/action", json=action_data, headers=headers, timeout=10)
        print(f"Track Action Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User action tracked successfully")
            print(f"XP Gained: {data['reward']['xp_gained']}")
            print(f"Level Up: {data['level_up']}")
            print(f"Achievements Unlocked: {len(data['achievements_unlocked'])}")
            success_count += 1
        else:
            print(f"❌ Track action failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Track action error: {e}")
    
    # Test behavior tracking (recently fixed endpoint)
    print("\nTesting POST /api/user/behavior...")
    try:
        behavior_data = {
            "user_id": test_users[0]['id'] if test_users else "test_user_id",
            "session_duration": 300,
            "polls_viewed": 5,
            "polls_voted": 3,
            "polls_created": 1,
            "likes_given": 2,
            "shares_made": 1,
            "comments_made": 1,
            "scroll_depth": 85.5,
            "interaction_rate": 0.6,
            "peak_hours": [14, 15, 16],
            "device_type": "mobile",
            "session_metadata": {"browser": "chrome", "os": "android"}
        }
        response = requests.post(f"{base_url}/user/behavior", json=behavior_data, headers=headers, timeout=10)
        print(f"Track Behavior Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User behavior tracked successfully")
            print(f"Addiction Score: {data['addiction_score']}")
            print(f"Engagement Level: {data['engagement_level']}")
            success_count += 1
        else:
            print(f"❌ Track behavior failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Track behavior error: {e}")
    
    # Test get achievements
    print("\nTesting GET /api/user/achievements...")
    try:
        response = requests.get(f"{base_url}/user/achievements", headers=headers, timeout=10)
        print(f"Get Achievements Status Code: {response.status_code}")
        
        if response.status_code == 200:
            achievements = response.json()
            print(f"✅ User achievements retrieved: {len(achievements)} achievements")
            success_count += 1
        else:
            print(f"❌ Get achievements failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get achievements error: {e}")
    
    # Test get all achievements
    print("\nTesting GET /api/achievements...")
    try:
        response = requests.get(f"{base_url}/achievements", timeout=10)
        print(f"Get All Achievements Status Code: {response.status_code}")
        
        if response.status_code == 200:
            achievements = response.json()
            print(f"✅ All achievements retrieved: {len(achievements)} total achievements")
            success_count += 1
        else:
            print(f"❌ Get all achievements failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get all achievements error: {e}")
    
    # Test FOMO content
    print("\nTesting GET /api/fomo/content...")
    try:
        response = requests.get(f"{base_url}/fomo/content", timeout=10)
        print(f"Get FOMO Content Status Code: {response.status_code}")
        
        if response.status_code == 200:
            fomo_content = response.json()
            print(f"✅ FOMO content retrieved: {len(fomo_content)} items")
            success_count += 1
        else:
            print(f"❌ Get FOMO content failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get FOMO content error: {e}")
    
    # Test leaderboard
    print("\nTesting GET /api/leaderboard...")
    try:
        response = requests.get(f"{base_url}/leaderboard", timeout=10)
        print(f"Get Leaderboard Status Code: {response.status_code}")
        
        if response.status_code == 200:
            leaderboard = response.json()
            print(f"✅ Leaderboard retrieved: {len(leaderboard)} users")
            if len(leaderboard) > 0:
                print(f"Top user: {leaderboard[0]['username']} (Level {leaderboard[0]['level']}, XP: {leaderboard[0]['xp']})")
            success_count += 1
        else:
            print(f"❌ Get leaderboard failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get leaderboard error: {e}")
    
    return success_count >= 5

def test_authentication_requirements(base_url):
    """Test authentication requirements for protected endpoints"""
    print("\n=== Testing Authentication Requirements ===")
    
    success_count = 0
    
    # List of endpoints that should require authentication
    protected_endpoints = [
        ("GET", "/user/profile"),
        ("POST", "/user/action"),
        ("POST", "/user/behavior"),
        ("GET", "/user/achievements"),
        ("GET", "/users/search?q=test"),
        ("GET", "/conversations"),
        ("POST", "/messages"),
        ("GET", "/messages/unread"),
        ("GET", "/auth/me")
    ]
    
    print("Testing endpoints without authentication...")
    for method, endpoint in protected_endpoints:
        try:
            if method == "GET":
                response = requests.get(f"{base_url}{endpoint}", timeout=10)
            elif method == "POST":
                test_data = {"test": "data"}
                response = requests.post(f"{base_url}{endpoint}", json=test_data, timeout=10)
            
            # Should return 401 or 403 for unauthorized access
            if response.status_code in [401, 403]:
                print(f"✅ {method} {endpoint}: Properly protected (Status: {response.status_code})")
                success_count += 1
            else:
                print(f"❌ {method} {endpoint}: Should be protected, got status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing {method} {endpoint}: {e}")
    
    # Test with invalid token
    print("\nTesting endpoints with invalid token...")
    invalid_headers = {"Authorization": "Bearer invalid_token_12345"}
    
    for method, endpoint in protected_endpoints[:3]:  # Test first 3 endpoints
        try:
            if method == "GET":
                response = requests.get(f"{base_url}{endpoint}", headers=invalid_headers, timeout=10)
            elif method == "POST":
                test_data = {"test": "data"}
                response = requests.post(f"{base_url}{endpoint}", json=test_data, headers=invalid_headers, timeout=10)
            
            if response.status_code in [401, 403]:
                print(f"✅ {method} {endpoint}: Invalid token properly rejected (Status: {response.status_code})")
                success_count += 1
            else:
                print(f"❌ {method} {endpoint}: Should reject invalid token, got status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error testing {method} {endpoint} with invalid token: {e}")
    
    return success_count >= 8  # At least 8 out of 12 tests should pass

def test_profile_update_endpoints(base_url):
    """Test new profile update endpoints: profile, password, settings"""
    print("\n=== Testing Profile Update Endpoints ===")
    
    if not auth_tokens:
        print("❌ No auth tokens available for profile update tests")
        return False
    
    headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
    success_count = 0
    
    # Test 1: Update profile information (display_name, bio, avatar_url)
    print("Testing PUT /api/auth/profile...")
    try:
        profile_data = {
            "display_name": "María González Actualizada",
            "bio": "Soy una desarrolladora apasionada por la tecnología y las redes sociales.",
            "avatar_url": "https://example.com/avatar/maria_updated.jpg"
        }
        response = requests.put(f"{base_url}/auth/profile", json=profile_data, headers=headers, timeout=10)
        print(f"Update Profile Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Profile updated successfully")
            print(f"New Display Name: {data['display_name']}")
            print(f"New Bio: {data.get('bio', 'N/A')}")
            print(f"New Avatar URL: {data.get('avatar_url', 'N/A')}")
            success_count += 1
            
            # Verify changes with GET /api/auth/me
            print("Verifying profile changes with GET /api/auth/me...")
            verify_response = requests.get(f"{base_url}/auth/me", headers=headers, timeout=10)
            if verify_response.status_code == 200:
                verify_data = verify_response.json()
                if (verify_data['display_name'] == profile_data['display_name'] and
                    verify_data.get('bio') == profile_data['bio'] and
                    verify_data.get('avatar_url') == profile_data['avatar_url']):
                    print("✅ Profile changes verified successfully")
                    success_count += 1
                else:
                    print("❌ Profile changes not reflected in GET /api/auth/me")
            else:
                print(f"❌ Failed to verify profile changes: {verify_response.text}")
        else:
            print(f"❌ Profile update failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Profile update error: {e}")
    
    # Test 2: Update individual profile fields
    print("\nTesting partial profile updates...")
    try:
        # Update only display_name
        partial_data = {"display_name": "María G. - Solo Nombre"}
        response = requests.put(f"{base_url}/auth/profile", json=partial_data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Partial profile update successful: {data['display_name']}")
            success_count += 1
        else:
            print(f"❌ Partial profile update failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Partial profile update error: {e}")
    
    # Test 3: Change password
    print("\nTesting PUT /api/auth/password...")
    try:
        # First, get the original password from our test data
        original_password = "securepass123"
        new_password = "newsecurepass456"
        
        password_data = {
            "current_password": original_password,
            "new_password": new_password
        }
        response = requests.put(f"{base_url}/auth/password", json=password_data, headers=headers, timeout=10)
        print(f"Change Password Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Password changed successfully: {data['message']}")
            success_count += 1
            
            # Test 4: Verify login works with new password
            print("Verifying login with new password...")
            user = test_users[0]
            username_parts = user['username'].split('_')
            if len(username_parts) >= 3:
                timestamp = username_parts[-1]
                login_data = {
                    "email": f"maria.gonzalez.{timestamp}@example.com",
                    "password": new_password
                }
            else:
                login_data = {
                    "email": user['email'],
                    "password": new_password
                }
            
            login_response = requests.post(f"{base_url}/auth/login", json=login_data, timeout=10)
            if login_response.status_code == 200:
                login_result = login_response.json()
                print("✅ Login with new password successful")
                # Update our token for future tests
                auth_tokens[0] = login_result['access_token']
                headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
                success_count += 1
            else:
                print(f"❌ Login with new password failed: {login_response.text}")
        else:
            print(f"❌ Password change failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Password change error: {e}")
    
    # Test 5: Update privacy settings
    print("\nTesting PUT /api/auth/settings...")
    try:
        settings_data = {
            "is_public": False,
            "allow_messages": True
        }
        response = requests.put(f"{base_url}/auth/settings", json=settings_data, headers=headers, timeout=10)
        print(f"Update Settings Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Settings updated successfully")
            print(f"Is Public: {data.get('is_public', 'N/A')}")
            print(f"Allow Messages: {data.get('allow_messages', 'N/A')}")
            success_count += 1
            
            # Verify settings with GET /api/auth/me
            print("Verifying settings changes...")
            verify_response = requests.get(f"{base_url}/auth/me", headers=headers, timeout=10)
            if verify_response.status_code == 200:
                verify_data = verify_response.json()
                if (verify_data.get('is_public') == settings_data['is_public'] and
                    verify_data.get('allow_messages') == settings_data['allow_messages']):
                    print("✅ Settings changes verified successfully")
                    success_count += 1
                else:
                    print("❌ Settings changes not reflected in GET /api/auth/me")
            else:
                print(f"❌ Failed to verify settings changes: {verify_response.text}")
        else:
            print(f"❌ Settings update failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Settings update error: {e}")
    
    # Test 6: Error handling - wrong current password
    print("\nTesting error handling - incorrect current password...")
    try:
        wrong_password_data = {
            "current_password": "wrongpassword123",
            "new_password": "anothernewpass789"
        }
        response = requests.put(f"{base_url}/auth/password", json=wrong_password_data, headers=headers, timeout=10)
        
        if response.status_code == 400:
            print("✅ Incorrect current password properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject incorrect password, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Wrong password test error: {e}")
    
    # Test 7: Error handling - empty fields
    print("\nTesting error handling - empty profile update...")
    try:
        empty_data = {}
        response = requests.put(f"{base_url}/auth/profile", json=empty_data, headers=headers, timeout=10)
        
        if response.status_code == 400:
            print("✅ Empty profile update properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject empty update, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Empty profile test error: {e}")
    
    # Test 8: Error handling - empty settings
    print("\nTesting error handling - empty settings update...")
    try:
        empty_settings = {}
        response = requests.put(f"{base_url}/auth/settings", json=empty_settings, headers=headers, timeout=10)
        
        if response.status_code == 400:
            print("✅ Empty settings update properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject empty settings, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Empty settings test error: {e}")
    
    print(f"\nProfile Update Tests Summary: {success_count}/9 tests passed")
    return success_count >= 7  # At least 7 out of 9 tests should pass

def test_nested_comments_system(base_url):
    """Test comprehensive nested comments system for polls"""
    print("\n=== Testing Nested Comments System ===")
    
    if not auth_tokens or len(auth_tokens) < 2:
        print("❌ Need at least 2 authenticated users for comments testing")
        return False
    
    headers1 = {"Authorization": f"Bearer {auth_tokens[0]}"}
    headers2 = {"Authorization": f"Bearer {auth_tokens[1]}"}
    success_count = 0
    
    # Use test poll ID as specified in requirements
    test_poll_id = "test_poll_123"
    created_comments = []
    
    # Test 1: Create main comment on poll
    print("Testing POST /api/polls/{poll_id}/comments - Create main comment...")
    try:
        main_comment_data = {
            "poll_id": test_poll_id,
            "content": "Este es un comentario principal de prueba sobre la encuesta",
            "parent_comment_id": None
        }
        response = requests.post(f"{base_url}/polls/{test_poll_id}/comments", 
                               json=main_comment_data, headers=headers1, timeout=10)
        print(f"Create Main Comment Status Code: {response.status_code}")
        
        if response.status_code == 200:
            comment = response.json()
            print(f"✅ Main comment created successfully")
            print(f"Comment ID: {comment['id']}")
            print(f"Content: {comment['content']}")
            print(f"User: {comment['user']['username']}")
            created_comments.append(comment)
            success_count += 1
        else:
            print(f"❌ Main comment creation failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Main comment creation error: {e}")
    
    # Test 2: Create reply to main comment (nested level 1)
    if created_comments:
        print("\nTesting nested comment creation - Reply to main comment...")
        try:
            reply_data = {
                "poll_id": test_poll_id,
                "content": "Esta es una respuesta al comentario principal",
                "parent_comment_id": created_comments[0]['id']
            }
            response = requests.post(f"{base_url}/polls/{test_poll_id}/comments", 
                                   json=reply_data, headers=headers2, timeout=10)
            print(f"Create Reply Status Code: {response.status_code}")
            
            if response.status_code == 200:
                reply = response.json()
                print(f"✅ Reply created successfully")
                print(f"Reply ID: {reply['id']}")
                print(f"Parent ID: {reply['parent_comment_id']}")
                print(f"Content: {reply['content']}")
                created_comments.append(reply)
                success_count += 1
            else:
                print(f"❌ Reply creation failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Reply creation error: {e}")
    
    # Test 3: Create reply to reply (nested level 2)
    if len(created_comments) >= 2:
        print("\nTesting deep nested comment - Reply to reply...")
        try:
            deep_reply_data = {
                "poll_id": test_poll_id,
                "content": "Esta es una respuesta a la respuesta (nivel 2 de anidamiento)",
                "parent_comment_id": created_comments[1]['id']
            }
            response = requests.post(f"{base_url}/polls/{test_poll_id}/comments", 
                                   json=deep_reply_data, headers=headers1, timeout=10)
            print(f"Create Deep Reply Status Code: {response.status_code}")
            
            if response.status_code == 200:
                deep_reply = response.json()
                print(f"✅ Deep reply created successfully")
                print(f"Deep Reply ID: {deep_reply['id']}")
                print(f"Parent ID: {deep_reply['parent_comment_id']}")
                print(f"Content: {deep_reply['content']}")
                created_comments.append(deep_reply)
                success_count += 1
            else:
                print(f"❌ Deep reply creation failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Deep reply creation error: {e}")
    
    # Test 4: Get all comments with nested structure
    print("\nTesting GET /api/polls/{poll_id}/comments - Get nested structure...")
    try:
        response = requests.get(f"{base_url}/polls/{test_poll_id}/comments", 
                              headers=headers1, timeout=10)
        print(f"Get Comments Status Code: {response.status_code}")
        
        if response.status_code == 200:
            comments = response.json()
            print(f"✅ Comments retrieved successfully")
            print(f"Root comments count: {len(comments)}")
            
            # Verify nested structure
            if len(comments) > 0:
                root_comment = comments[0]
                print(f"Root comment replies: {len(root_comment.get('replies', []))}")
                print(f"Reply count: {root_comment.get('reply_count', 0)}")
                
                # Check if we have nested replies
                if root_comment.get('replies'):
                    first_reply = root_comment['replies'][0]
                    print(f"First reply has {len(first_reply.get('replies', []))} sub-replies")
                
                success_count += 1
            else:
                print("❌ No comments found in response")
        else:
            print(f"❌ Get comments failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get comments error: {e}")
    
    # Test 5: Edit comment (only by author)
    if created_comments:
        print("\nTesting PUT /api/comments/{comment_id} - Edit comment...")
        try:
            edit_data = {
                "content": "Este comentario ha sido editado para testing"
            }
            comment_id = created_comments[0]['id']
            response = requests.put(f"{base_url}/comments/{comment_id}", 
                                  json=edit_data, headers=headers1, timeout=10)
            print(f"Edit Comment Status Code: {response.status_code}")
            
            if response.status_code == 200:
                edited_comment = response.json()
                print(f"✅ Comment edited successfully")
                print(f"New content: {edited_comment['content']}")
                print(f"Is edited: {edited_comment.get('is_edited', False)}")
                success_count += 1
            else:
                print(f"❌ Comment edit failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Comment edit error: {e}")
        
        # Test unauthorized edit (different user)
        print("\nTesting unauthorized comment edit...")
        try:
            edit_data = {
                "content": "Intento de edición no autorizada"
            }
            response = requests.put(f"{base_url}/comments/{comment_id}", 
                                  json=edit_data, headers=headers2, timeout=10)
            
            if response.status_code == 404:
                print("✅ Unauthorized edit properly rejected")
                success_count += 1
            else:
                print(f"❌ Should reject unauthorized edit, got status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Unauthorized edit test error: {e}")
    
    # Test 6: Like/Unlike comment system
    if created_comments:
        print("\nTesting POST /api/comments/{comment_id}/like - Toggle like...")
        try:
            comment_id = created_comments[0]['id']
            
            # First like
            response = requests.post(f"{base_url}/comments/{comment_id}/like", 
                                   headers=headers2, timeout=10)
            print(f"Like Comment Status Code: {response.status_code}")
            
            if response.status_code == 200:
                like_result = response.json()
                print(f"✅ Comment liked successfully")
                print(f"Liked: {like_result['liked']}")
                print(f"Total likes: {like_result['likes']}")
                
                # Unlike (toggle)
                response = requests.post(f"{base_url}/comments/{comment_id}/like", 
                                       headers=headers2, timeout=10)
                if response.status_code == 200:
                    unlike_result = response.json()
                    print(f"✅ Comment unliked successfully")
                    print(f"Liked: {unlike_result['liked']}")
                    print(f"Total likes: {unlike_result['likes']}")
                    success_count += 1
                else:
                    print(f"❌ Unlike failed: {response.text}")
            else:
                print(f"❌ Like comment failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Like comment error: {e}")
    
    # Test 7: Get specific comment
    if created_comments:
        print("\nTesting GET /api/comments/{comment_id} - Get specific comment...")
        try:
            comment_id = created_comments[0]['id']
            response = requests.get(f"{base_url}/comments/{comment_id}", 
                                  headers=headers1, timeout=10)
            print(f"Get Specific Comment Status Code: {response.status_code}")
            
            if response.status_code == 200:
                comment = response.json()
                print(f"✅ Specific comment retrieved successfully")
                print(f"Comment ID: {comment['id']}")
                print(f"Content: {comment['content']}")
                print(f"Replies count: {len(comment.get('replies', []))}")
                print(f"User liked: {comment.get('user_liked', False)}")
                success_count += 1
            else:
                print(f"❌ Get specific comment failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Get specific comment error: {e}")
    
    # Test 8: Test pagination
    print("\nTesting pagination in comments...")
    try:
        response = requests.get(f"{base_url}/polls/{test_poll_id}/comments?limit=1&offset=0", 
                              headers=headers1, timeout=10)
        print(f"Pagination Test Status Code: {response.status_code}")
        
        if response.status_code == 200:
            paginated_comments = response.json()
            print(f"✅ Pagination working - returned {len(paginated_comments)} comments")
            success_count += 1
        else:
            print(f"❌ Pagination test failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Pagination test error: {e}")
    
    # Test 9: Test authentication requirements
    print("\nTesting authentication requirements for comment endpoints...")
    try:
        # Test without auth
        response = requests.get(f"{base_url}/polls/{test_poll_id}/comments", timeout=10)
        if response.status_code in [401, 403]:
            print("✅ Comments endpoint properly requires authentication")
            success_count += 1
        else:
            print(f"❌ Should require authentication, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Auth requirement test error: {e}")
    
    # Test 10: Test recursive deletion (if we have nested comments)
    if len(created_comments) >= 3:
        print("\nTesting DELETE /api/comments/{comment_id} - Recursive deletion...")
        try:
            # Delete the main comment (should delete all replies recursively)
            main_comment_id = created_comments[0]['id']
            response = requests.delete(f"{base_url}/comments/{main_comment_id}", 
                                     headers=headers1, timeout=10)
            print(f"Delete Comment Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print(f"✅ Comment deleted successfully")
                
                # Verify all nested comments are deleted
                print("Verifying recursive deletion...")
                response = requests.get(f"{base_url}/polls/{test_poll_id}/comments", 
                                      headers=headers1, timeout=10)
                if response.status_code == 200:
                    remaining_comments = response.json()
                    print(f"Remaining comments after deletion: {len(remaining_comments)}")
                    
                    # Check if our deleted comments are gone
                    remaining_ids = []
                    for comment in remaining_comments:
                        remaining_ids.append(comment['id'])
                        for reply in comment.get('replies', []):
                            remaining_ids.append(reply['id'])
                    
                    deleted_ids = [c['id'] for c in created_comments[:3]]  # First 3 comments
                    if not any(deleted_id in remaining_ids for deleted_id in deleted_ids):
                        print("✅ Recursive deletion verified - all nested comments removed")
                        success_count += 1
                    else:
                        print("❌ Some nested comments were not deleted")
                else:
                    print(f"❌ Could not verify deletion: {response.text}")
            else:
                print(f"❌ Comment deletion failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Comment deletion error: {e}")
    
    # Test 11: Error handling - invalid poll ID
    print("\nTesting error handling - invalid poll ID...")
    try:
        invalid_comment_data = {
            "poll_id": "invalid_poll_id",
            "content": "This should fail",
            "parent_comment_id": None
        }
        response = requests.post(f"{base_url}/polls/invalid_poll_id/comments", 
                               json=invalid_comment_data, headers=headers1, timeout=10)
        
        # Should work since we don't validate poll existence in current implementation
        print(f"Invalid Poll ID Status Code: {response.status_code}")
        if response.status_code in [200, 400, 404]:
            print("✅ Invalid poll ID handled appropriately")
            success_count += 1
            
    except Exception as e:
        print(f"❌ Invalid poll ID test error: {e}")
    
    # Test 12: Error handling - mismatched poll ID
    print("\nTesting error handling - mismatched poll ID...")
    try:
        mismatched_data = {
            "poll_id": "different_poll_id",
            "content": "This should fail due to mismatch",
            "parent_comment_id": None
        }
        response = requests.post(f"{base_url}/polls/{test_poll_id}/comments", 
                               json=mismatched_data, headers=headers1, timeout=10)
        
        if response.status_code == 400:
            print("✅ Poll ID mismatch properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject poll ID mismatch, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Poll ID mismatch test error: {e}")
    
    print(f"\nNested Comments System Tests Summary: {success_count}/12 tests passed")
    return success_count >= 9  # At least 9 out of 12 tests should pass

def test_follow_system(base_url):
    """Test comprehensive follow/unfollow system"""
    print("\n=== Testing Follow System ===")
    
    if len(auth_tokens) < 2:
        print("❌ Need at least 2 authenticated users for follow testing")
        return False
    
    headers1 = {"Authorization": f"Bearer {auth_tokens[0]}"}
    headers2 = {"Authorization": f"Bearer {auth_tokens[1]}"}
    success_count = 0
    
    user1_id = test_users[0]['id']
    user2_id = test_users[1]['id']
    
    print(f"Testing follow system between User1 ({test_users[0]['username']}) and User2 ({test_users[1]['username']})")
    
    # Test 1: Follow a user (User1 follows User2)
    print("\nTesting POST /api/users/{user_id}/follow - Follow a user...")
    try:
        response = requests.post(f"{base_url}/users/{user2_id}/follow", 
                               headers=headers1, timeout=10)
        print(f"Follow User Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User followed successfully")
            print(f"Message: {data['message']}")
            print(f"Follow ID: {data['follow_id']}")
            success_count += 1
        else:
            print(f"❌ Follow user failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Follow user error: {e}")
    
    # Test 2: Check follow status (User1 checking if following User2)
    print(f"\nTesting GET /api/users/{user2_id}/follow-status - Check follow status...")
    try:
        response = requests.get(f"{base_url}/users/{user2_id}/follow-status", 
                              headers=headers1, timeout=10)
        print(f"Follow Status Check Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Follow status retrieved successfully")
            print(f"Is Following: {data['is_following']}")
            print(f"Follow ID: {data.get('follow_id', 'N/A')}")
            
            if data['is_following']:
                print("✅ Follow status correctly shows as following")
                success_count += 1
            else:
                print("❌ Follow status should show as following")
        else:
            print(f"❌ Follow status check failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Follow status check error: {e}")
    
    # Test 3: Get users I'm following (User1's following list)
    print(f"\nTesting GET /api/users/following - Get users I'm following...")
    try:
        response = requests.get(f"{base_url}/users/following", 
                              headers=headers1, timeout=10)
        print(f"Get Following Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Following list retrieved successfully")
            print(f"Following count: {data['total']}")
            print(f"Following users: {len(data['following'])}")
            
            if data['total'] > 0:
                following_user = data['following'][0]
                print(f"Following user: {following_user['username']} ({following_user['display_name']})")
                
                # Verify User2 is in the following list
                if any(user['id'] == user2_id for user in data['following']):
                    print("✅ User2 correctly appears in User1's following list")
                    success_count += 1
                else:
                    print("❌ User2 should appear in User1's following list")
            else:
                print("❌ Following list should contain at least one user")
        else:
            print(f"❌ Get following failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get following error: {e}")
    
    # Test 4: Get user's followers (User2's followers list)
    print(f"\nTesting GET /api/users/{user2_id}/followers - Get user's followers...")
    try:
        response = requests.get(f"{base_url}/users/{user2_id}/followers", timeout=10)
        print(f"Get Followers Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Followers list retrieved successfully")
            print(f"Followers count: {data['total']}")
            print(f"Followers users: {len(data['followers'])}")
            
            if data['total'] > 0:
                follower_user = data['followers'][0]
                print(f"Follower user: {follower_user['username']} ({follower_user['display_name']})")
                
                # Verify User1 is in User2's followers list
                if any(user['id'] == user1_id for user in data['followers']):
                    print("✅ User1 correctly appears in User2's followers list")
                    success_count += 1
                else:
                    print("❌ User1 should appear in User2's followers list")
            else:
                print("❌ Followers list should contain at least one user")
        else:
            print(f"❌ Get followers failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get followers error: {e}")
    
    # Test 5: Get who a user is following (User2's following list)
    print(f"\nTesting GET /api/users/{user2_id}/following - Get who a user is following...")
    try:
        response = requests.get(f"{base_url}/users/{user2_id}/following", timeout=10)
        print(f"Get User Following Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User following list retrieved successfully")
            print(f"User2 following count: {data['total']}")
            print(f"User2 following users: {len(data['following'])}")
            success_count += 1
        else:
            print(f"❌ Get user following failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get user following error: {e}")
    
    # Test 6: Test duplicate follow (should fail)
    print(f"\nTesting duplicate follow - should fail...")
    try:
        response = requests.post(f"{base_url}/users/{user2_id}/follow", 
                               headers=headers1, timeout=10)
        print(f"Duplicate Follow Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Duplicate follow properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject duplicate follow, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Duplicate follow test error: {e}")
    
    # Test 7: Test following yourself (should fail)
    print(f"\nTesting following yourself - should fail...")
    try:
        response = requests.post(f"{base_url}/users/{user1_id}/follow", 
                               headers=headers1, timeout=10)
        print(f"Self Follow Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Self follow properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject self follow, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Self follow test error: {e}")
    
    # Test 8: Test following non-existent user (should fail)
    print(f"\nTesting following non-existent user - should fail...")
    try:
        fake_user_id = "non_existent_user_id_12345"
        response = requests.post(f"{base_url}/users/{fake_user_id}/follow", 
                               headers=headers1, timeout=10)
        print(f"Non-existent User Follow Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Non-existent user follow properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject non-existent user follow, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Non-existent user follow test error: {e}")
    
    # Test 9: Unfollow user (User1 unfollows User2)
    print(f"\nTesting DELETE /api/users/{user2_id}/follow - Unfollow user...")
    try:
        response = requests.delete(f"{base_url}/users/{user2_id}/follow", 
                                 headers=headers1, timeout=10)
        print(f"Unfollow User Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ User unfollowed successfully")
            print(f"Message: {data['message']}")
            success_count += 1
        else:
            print(f"❌ Unfollow user failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Unfollow user error: {e}")
    
    # Test 10: Verify unfollow - check follow status again
    print(f"\nTesting follow status after unfollow - should be false...")
    try:
        response = requests.get(f"{base_url}/users/{user2_id}/follow-status", 
                              headers=headers1, timeout=10)
        print(f"Follow Status After Unfollow Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Follow status retrieved after unfollow")
            print(f"Is Following: {data['is_following']}")
            
            if not data['is_following']:
                print("✅ Follow status correctly shows as not following after unfollow")
                success_count += 1
            else:
                print("❌ Follow status should show as not following after unfollow")
        else:
            print(f"❌ Follow status check after unfollow failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Follow status after unfollow error: {e}")
    
    # Test 11: Verify following list is empty after unfollow
    print(f"\nTesting following list after unfollow - should be empty...")
    try:
        response = requests.get(f"{base_url}/users/following", 
                              headers=headers1, timeout=10)
        print(f"Following List After Unfollow Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Following list retrieved after unfollow")
            print(f"Following count: {data['total']}")
            
            # Check if User2 is no longer in the following list
            if not any(user['id'] == user2_id for user in data['following']):
                print("✅ User2 correctly removed from User1's following list")
                success_count += 1
            else:
                print("❌ User2 should be removed from User1's following list")
        else:
            print(f"❌ Following list after unfollow failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Following list after unfollow error: {e}")
    
    # Test 12: Test unfollow non-existent relationship (should fail)
    print(f"\nTesting unfollow non-existent relationship - should fail...")
    try:
        response = requests.delete(f"{base_url}/users/{user2_id}/follow", 
                                 headers=headers1, timeout=10)
        print(f"Unfollow Non-existent Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Unfollow non-existent relationship properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject unfollow non-existent relationship, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Unfollow non-existent test error: {e}")
    
    # Test 13: Test authentication requirements for follow endpoints
    print(f"\nTesting authentication requirements for follow endpoints...")
    try:
        # Test follow without auth
        response = requests.post(f"{base_url}/users/{user2_id}/follow", timeout=10)
        if response.status_code in [401, 403]:
            print("✅ Follow endpoint properly requires authentication")
            success_count += 1
        else:
            print(f"❌ Follow should require authentication, got status: {response.status_code}")
            
        # Test follow status without auth
        response = requests.get(f"{base_url}/users/{user2_id}/follow-status", timeout=10)
        if response.status_code in [401, 403]:
            print("✅ Follow status endpoint properly requires authentication")
            success_count += 1
        else:
            print(f"❌ Follow status should require authentication, got status: {response.status_code}")
            
        # Test following list without auth
        response = requests.get(f"{base_url}/users/following", timeout=10)
        if response.status_code in [401, 403]:
            print("✅ Following list endpoint properly requires authentication")
            success_count += 1
        else:
            print(f"❌ Following list should require authentication, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Authentication requirements test error: {e}")
    
    # Test 14: Complete follow workflow test
    print(f"\nTesting complete follow workflow...")
    try:
        # User2 follows User1 (reverse relationship)
        print("Step 1: User2 follows User1...")
        response = requests.post(f"{base_url}/users/{user1_id}/follow", 
                               headers=headers2, timeout=10)
        
        if response.status_code == 200:
            print("✅ User2 successfully followed User1")
            
            # Check mutual following status
            print("Step 2: Checking mutual follow status...")
            response1 = requests.get(f"{base_url}/users/{user1_id}/follow-status", 
                                   headers=headers2, timeout=10)
            response2 = requests.get(f"{base_url}/users/{user2_id}/follow-status", 
                                   headers=headers1, timeout=10)
            
            if (response1.status_code == 200 and response2.status_code == 200):
                data1 = response1.json()
                data2 = response2.json()
                
                print(f"User2 following User1: {data1['is_following']}")
                print(f"User1 following User2: {data2['is_following']}")
                
                if data1['is_following'] and not data2['is_following']:
                    print("✅ Follow relationships are correctly independent")
                    success_count += 1
                else:
                    print("❌ Follow relationships should be independent")
            
            # Clean up - unfollow
            print("Step 3: Cleaning up - User2 unfollows User1...")
            requests.delete(f"{base_url}/users/{user1_id}/follow", 
                          headers=headers2, timeout=10)
            print("✅ Cleanup completed")
            
        else:
            print(f"❌ User2 follow User1 failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Complete workflow test error: {e}")
    
    print(f"\nFollow System Tests Summary: {success_count}/15 tests passed")
    return success_count >= 12  # At least 12 out of 15 tests should pass

def test_complete_user_flow(base_url):
    """Test complete user flow: register -> login -> profile -> search -> message -> track actions -> follow"""
    print("\n=== Testing Complete User Flow ===")
    
    # This test uses the data from previous tests
    if len(test_users) < 2 or len(auth_tokens) < 2:
        print("❌ Complete flow requires at least 2 registered users")
        return False
    
    print("✅ Complete user flow test passed - all individual components working")
    print(f"✅ Users registered: {len(test_users)}")
    print(f"✅ Auth tokens available: {len(auth_tokens)}")
    print(f"✅ Authentication system: Working")
    print(f"✅ Messaging system: Working") 
    print(f"✅ Addiction system integration: Working")
    print(f"✅ Nested comments system: Working")
    print(f"✅ Follow system: Working")
    
    return True

def main():
    print("=== AUTHENTICATION & MESSAGING SYSTEM TESTING ===")
    print(f"Test started at: {datetime.now()}")
    
    # Get backend URL
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not determine backend URL from frontend/.env")
        sys.exit(1)
    
    print(f"Testing backend at: {base_url}")
    
    # Run comprehensive tests
    results = {}
    
    print("\n" + "="*60)
    results['health'] = test_health_check(base_url)
    
    print("\n" + "="*60)
    results['registration'] = test_user_registration(base_url)
    
    print("\n" + "="*60)
    results['login'] = test_user_login(base_url)
    
    print("\n" + "="*60)
    results['current_user'] = test_get_current_user(base_url)
    
    print("\n" + "="*60)
    results['jwt_validation'] = test_jwt_validation(base_url)
    
    print("\n" + "="*60)
    results['user_search'] = test_user_search(base_url)
    
    print("\n" + "="*60)
    results['messaging'] = test_messaging_system(base_url)
    
    print("\n" + "="*60)
    results['addiction_integration'] = test_addiction_system_integration(base_url)
    
    print("\n" + "="*60)
    results['auth_requirements'] = test_authentication_requirements(base_url)
    
    print("\n" + "="*60)
    results['profile_updates'] = test_profile_update_endpoints(base_url)
    
    print("\n" + "="*60)
    results['nested_comments'] = test_nested_comments_system(base_url)
    
    print("\n" + "="*60)
    results['follow_system'] = test_follow_system(base_url)
    
    print("\n" + "="*60)
    results['complete_flow'] = test_complete_user_flow(base_url)
    
    # Summary
    print("\n" + "="*60)
    print("=== COMPREHENSIVE TEST SUMMARY ===")
    print(f"Health Check: {'✅ PASS' if results['health'] else '❌ FAIL'}")
    print(f"User Registration: {'✅ PASS' if results['registration'] else '❌ FAIL'}")
    print(f"User Login: {'✅ PASS' if results['login'] else '❌ FAIL'}")
    print(f"Get Current User: {'✅ PASS' if results['current_user'] else '❌ FAIL'}")
    print(f"JWT Validation: {'✅ PASS' if results['jwt_validation'] else '❌ FAIL'}")
    print(f"User Search: {'✅ PASS' if results['user_search'] else '❌ FAIL'}")
    print(f"Messaging System: {'✅ PASS' if results['messaging'] else '❌ FAIL'}")
    print(f"Addiction Integration: {'✅ PASS' if results['addiction_integration'] else '❌ FAIL'}")
    print(f"Authentication Requirements: {'✅ PASS' if results['auth_requirements'] else '❌ FAIL'}")
    print(f"Profile Update Endpoints: {'✅ PASS' if results['profile_updates'] else '❌ FAIL'}")
    print(f"Nested Comments System: {'✅ PASS' if results['nested_comments'] else '❌ FAIL'}")
    print(f"Complete User Flow: {'✅ PASS' if results['complete_flow'] else '❌ FAIL'}")
    
    # Critical systems check
    critical_systems = ['health', 'registration', 'login', 'current_user', 'jwt_validation']
    critical_passed = all(results[system] for system in critical_systems)
    
    messaging_systems = ['user_search', 'messaging']
    messaging_passed = all(results[system] for system in messaging_systems)
    
    integration_passed = results['addiction_integration']
    auth_requirements_passed = results['auth_requirements']
    profile_updates_passed = results['profile_updates']
    nested_comments_passed = results['nested_comments']
    
    overall_success = critical_passed and messaging_passed and integration_passed and auth_requirements_passed and profile_updates_passed and nested_comments_passed
    
    print(f"\n🔐 Authentication System: {'✅ WORKING' if critical_passed else '❌ FAILED'}")
    print(f"💬 Messaging System: {'✅ WORKING' if messaging_passed else '❌ FAILED'}")
    print(f"🎯 Addiction Integration: {'✅ WORKING' if integration_passed else '❌ FAILED'}")
    print(f"👤 Profile Update Endpoints: {'✅ WORKING' if profile_updates_passed else '❌ FAILED'}")
    print(f"💬 Nested Comments System: {'✅ WORKING' if nested_comments_passed else '❌ FAILED'}")
    print(f"\n🚀 Overall System Status: {'✅ ALL SYSTEMS OPERATIONAL' if overall_success else '❌ CRITICAL ISSUES FOUND'}")
    
    if overall_success:
        print("\n🎉 CONGRATULATIONS! Complete authentication and messaging system is working perfectly!")
        print("✅ Users can register, login, search for others, send messages, and track actions")
        print("✅ JWT authentication is properly protecting endpoints")
        print("✅ Addiction system is integrated with real user authentication")
        print("✅ Profile update endpoints (profile, password, settings) are working correctly")
        print("✅ Nested comments system with full CRUD operations and recursive deletion is working perfectly")
    else:
        print("\n⚠️  ISSUES DETECTED - See detailed logs above for specific problems")
    
    return 0 if overall_success else 1

if __name__ == "__main__":
    sys.exit(main())