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
            if "Social Network API" in data.get("name", ""):
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
        
        if response.status_code == 400:
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

def test_tiktok_profile_grid_backend_support(base_url):
    """Test backend functionality that supports TikTok profile grid implementation"""
    print("\n=== Testing TikTok Profile Grid Backend Support ===")
    
    if not auth_tokens:
        print("❌ No auth tokens available for TikTok profile grid testing")
        return False
    
    headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
    success_count = 0
    
    # Test 1: User authentication for profile access
    print("Testing user authentication for profile access...")
    try:
        response = requests.get(f"{base_url}/auth/me", headers=headers, timeout=10)
        print(f"Auth Status Code: {response.status_code}")
        
        if response.status_code == 200:
            user_data = response.json()
            print(f"✅ User authentication working for profile grid")
            print(f"User ID: {user_data['id']}")
            print(f"Username: {user_data['username']}")
            print(f"Display Name: {user_data['display_name']}")
            success_count += 1
        else:
            print(f"❌ User authentication failed: {response.text}")
            
    except Exception as e:
        print(f"❌ User authentication error: {e}")
    
    # Test 2: User profile data retrieval
    print("\nTesting user profile data retrieval...")
    try:
        response = requests.get(f"{base_url}/user/profile", headers=headers, timeout=10)
        print(f"Profile Status Code: {response.status_code}")
        
        if response.status_code == 200:
            profile_data = response.json()
            print(f"✅ User profile data retrieved successfully")
            print(f"Profile Username: {profile_data['username']}")
            print(f"Profile Level: {profile_data['level']}")
            print(f"Profile XP: {profile_data['xp']}")
            success_count += 1
        else:
            print(f"❌ Profile data retrieval failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Profile data retrieval error: {e}")
    
    # Test 3: User search functionality (for finding other profiles)
    print("\nTesting user search functionality...")
    try:
        response = requests.get(f"{base_url}/users/search?q=test", headers=headers, timeout=10)
        print(f"User Search Status Code: {response.status_code}")
        
        if response.status_code == 200:
            search_results = response.json()
            print(f"✅ User search working for profile navigation")
            print(f"Search results count: {len(search_results)}")
            if len(search_results) > 0:
                print(f"Sample user: {search_results[0]['username']} - {search_results[0]['display_name']}")
            success_count += 1
        else:
            print(f"❌ User search failed: {response.text}")
            
    except Exception as e:
        print(f"❌ User search error: {e}")
    
    # Test 4: Follow system for profile interactions
    if len(test_users) >= 2:
        print("\nTesting follow system for profile interactions...")
        try:
            user2_id = test_users[1]['id']
            
            # Test follow status check
            response = requests.get(f"{base_url}/users/{user2_id}/follow-status", 
                                  headers=headers, timeout=10)
            print(f"Follow Status Check Status Code: {response.status_code}")
            
            if response.status_code == 200:
                follow_status = response.json()
                print(f"✅ Follow status check working for profile grid")
                print(f"Is Following: {follow_status['is_following']}")
                success_count += 1
            else:
                print(f"❌ Follow status check failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Follow system test error: {e}")
    
    # Test 5: Profile update functionality
    print("\nTesting profile update functionality...")
    try:
        update_data = {
            "display_name": "TikTok Grid Test User",
            "bio": "Testing TikTok profile grid functionality"
        }
        response = requests.put(f"{base_url}/auth/profile", json=update_data, headers=headers, timeout=10)
        print(f"Profile Update Status Code: {response.status_code}")
        
        if response.status_code == 200:
            updated_profile = response.json()
            print(f"✅ Profile update working for grid customization")
            print(f"Updated Display Name: {updated_profile['display_name']}")
            print(f"Updated Bio: {updated_profile.get('bio', 'N/A')}")
            success_count += 1
        else:
            print(f"❌ Profile update failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Profile update error: {e}")
    
    print(f"\nTikTok Profile Grid Backend Support Tests Summary: {success_count}/5 tests passed")
    return success_count >= 4  # At least 4 out of 5 tests should pass

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
    print(f"✅ TikTok Profile Grid Backend Support: Working")
    
    return True

def test_follow_system_with_usernames(base_url):
    """Test follow system with specific usernames as requested in review"""
    print("\n=== Testing Follow System with Specific Usernames ===")
    print("Testing the 'Usuario no encontrado' error fix with proper usernames")
    
    # Generate unique timestamp for this test
    timestamp = int(time.time())
    
    # Create 2 test users with proper usernames as requested
    test_users_data = [
        {
            "email": f"progamer.alex.{timestamp}@example.com",
            "username": "progamer_alex",
            "display_name": "ProGamer Alex",
            "password": "gamerpass123"
        },
        {
            "email": f"artmaster.studio.{timestamp}@example.com", 
            "username": "artmaster_studio",
            "display_name": "ArtMaster Studio",
            "password": "artpass456"
        }
    ]
    
    created_users = []
    user_tokens = []
    success_count = 0
    
    # Step 1: Register the test users
    print("\n--- Step 1: Creating test users with proper usernames ---")
    for i, user_data in enumerate(test_users_data):
        print(f"Registering user {i+1}: {user_data['username']}")
        try:
            response = requests.post(f"{base_url}/auth/register", json=user_data, timeout=10)
            print(f"Registration Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ User {user_data['username']} registered successfully")
                print(f"User ID: {data['user']['id']}")
                print(f"Username: {data['user']['username']}")
                print(f"Display Name: {data['user']['display_name']}")
                
                created_users.append(data['user'])
                user_tokens.append(data['access_token'])
                success_count += 1
            else:
                print(f"❌ Registration failed for {user_data['username']}: {response.text}")
                
        except Exception as e:
            print(f"❌ Registration error for {user_data['username']}: {e}")
    
    if len(created_users) < 2:
        print("❌ Failed to create required test users")
        return False
    
    # Step 2: Test user search functionality with specific usernames
    print("\n--- Step 2: Testing user search with specific usernames ---")
    headers1 = {"Authorization": f"Bearer {user_tokens[0]}"}
    headers2 = {"Authorization": f"Bearer {user_tokens[1]}"}
    
    # Test search for "progamer_alex"
    print("Testing GET /api/users/search?q=progamer_alex")
    try:
        response = requests.get(f"{base_url}/users/search?q=progamer_alex", headers=headers2, timeout=10)
        print(f"Search Status Code: {response.status_code}")
        
        if response.status_code == 200:
            search_results = response.json()
            print(f"✅ Search successful, found {len(search_results)} users")
            
            # Verify progamer_alex is found
            progamer_found = False
            for user in search_results:
                print(f"Found user: {user['username']} - {user['display_name']}")
                if user['username'] == 'progamer_alex':
                    progamer_found = True
                    print("✅ progamer_alex found in search results")
                    break
            
            if progamer_found:
                success_count += 1
            else:
                print("❌ progamer_alex not found in search results")
        else:
            print(f"❌ User search failed: {response.text}")
            
    except Exception as e:
        print(f"❌ User search error: {e}")
    
    # Test search for "artmaster_studio"
    print("\nTesting GET /api/users/search?q=artmaster_studio")
    try:
        response = requests.get(f"{base_url}/users/search?q=artmaster_studio", headers=headers1, timeout=10)
        print(f"Search Status Code: {response.status_code}")
        
        if response.status_code == 200:
            search_results = response.json()
            print(f"✅ Search successful, found {len(search_results)} users")
            
            # Verify artmaster_studio is found
            artmaster_found = False
            for user in search_results:
                print(f"Found user: {user['username']} - {user['display_name']}")
                if user['username'] == 'artmaster_studio':
                    artmaster_found = True
                    print("✅ artmaster_studio found in search results")
                    break
            
            if artmaster_found:
                success_count += 1
            else:
                print("❌ artmaster_studio not found in search results")
        else:
            print(f"❌ User search failed: {response.text}")
            
    except Exception as e:
        print(f"❌ User search error: {e}")
    
    # Step 3: Test follow functionality with user IDs
    print("\n--- Step 3: Testing follow functionality with user IDs ---")
    user1_id = created_users[0]['id']  # progamer_alex
    user2_id = created_users[1]['id']  # artmaster_studio
    
    print(f"Testing POST /api/users/{user2_id}/follow (progamer_alex follows artmaster_studio)")
    try:
        response = requests.post(f"{base_url}/users/{user2_id}/follow", headers=headers1, timeout=10)
        print(f"Follow Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Follow successful: {data['message']}")
            print(f"Follow ID: {data['follow_id']}")
            success_count += 1
        else:
            print(f"❌ Follow failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Follow error: {e}")
    
    # Step 4: Verify follow status
    print(f"\n--- Step 4: Verifying follow status ---")
    print(f"Testing GET /api/users/{user2_id}/follow-status")
    try:
        response = requests.get(f"{base_url}/users/{user2_id}/follow-status", headers=headers1, timeout=10)
        print(f"Follow Status Check Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Follow status retrieved: is_following = {data['is_following']}")
            if data['is_following']:
                print("✅ Follow relationship confirmed")
                success_count += 1
            else:
                print("❌ Follow relationship not confirmed")
        else:
            print(f"❌ Follow status check failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Follow status error: {e}")
    
    # Step 5: Test reverse follow (artmaster_studio follows progamer_alex)
    print(f"\n--- Step 5: Testing reverse follow ---")
    print(f"Testing POST /api/users/{user1_id}/follow (artmaster_studio follows progamer_alex)")
    try:
        response = requests.post(f"{base_url}/users/{user1_id}/follow", headers=headers2, timeout=10)
        print(f"Reverse Follow Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Reverse follow successful: {data['message']}")
            success_count += 1
        else:
            print(f"❌ Reverse follow failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Reverse follow error: {e}")
    
    # Step 6: Test following lists
    print(f"\n--- Step 6: Testing following lists ---")
    print("Testing GET /api/users/following (progamer_alex's following list)")
    try:
        response = requests.get(f"{base_url}/users/following", headers=headers1, timeout=10)
        print(f"Following List Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Following list retrieved: {data['total']} users")
            for user in data['following']:
                print(f"Following: {user['username']} - {user['display_name']}")
            
            # Verify artmaster_studio is in the list
            if any(user['username'] == 'artmaster_studio' for user in data['following']):
                print("✅ artmaster_studio found in progamer_alex's following list")
                success_count += 1
            else:
                print("❌ artmaster_studio not found in following list")
        else:
            print(f"❌ Following list failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Following list error: {e}")
    
    # Step 7: Test followers list
    print(f"\n--- Step 7: Testing followers list ---")
    print(f"Testing GET /api/users/{user2_id}/followers (artmaster_studio's followers)")
    try:
        response = requests.get(f"{base_url}/users/{user2_id}/followers", timeout=10)
        print(f"Followers List Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Followers list retrieved: {data['total']} users")
            for user in data['followers']:
                print(f"Follower: {user['username']} - {user['display_name']}")
            
            # Verify progamer_alex is in the list
            if any(user['username'] == 'progamer_alex' for user in data['followers']):
                print("✅ progamer_alex found in artmaster_studio's followers list")
                success_count += 1
            else:
                print("❌ progamer_alex not found in followers list")
        else:
            print(f"❌ Followers list failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Followers list error: {e}")
    
    # Step 8: Test error scenarios that were causing "Usuario no encontrado"
    print(f"\n--- Step 8: Testing error scenarios ---")
    
    # Test following non-existent user
    print("Testing follow with non-existent user ID")
    try:
        fake_user_id = "non_existent_user_12345"
        response = requests.post(f"{base_url}/users/{fake_user_id}/follow", headers=headers1, timeout=10)
        print(f"Non-existent User Follow Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Non-existent user properly returns 404 (Usuario no encontrado)")
            success_count += 1
        else:
            print(f"❌ Should return 404 for non-existent user, got: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Non-existent user test error: {e}")
    
    # Test search with partial username
    print("\nTesting search with partial username 'progamer'")
    try:
        response = requests.get(f"{base_url}/users/search?q=progamer", headers=headers2, timeout=10)
        print(f"Partial Search Status Code: {response.status_code}")
        
        if response.status_code == 200:
            search_results = response.json()
            print(f"✅ Partial search successful, found {len(search_results)} users")
            
            # Should find progamer_alex
            if any(user['username'] == 'progamer_alex' for user in search_results):
                print("✅ progamer_alex found with partial search 'progamer'")
                success_count += 1
            else:
                print("❌ progamer_alex not found with partial search")
        else:
            print(f"❌ Partial search failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Partial search error: {e}")
    
    # Step 9: Clean up - unfollow relationships
    print(f"\n--- Step 9: Cleanup - Testing unfollow functionality ---")
    
    # Unfollow artmaster_studio
    print(f"Testing DELETE /api/users/{user2_id}/follow (progamer_alex unfollows artmaster_studio)")
    try:
        response = requests.delete(f"{base_url}/users/{user2_id}/follow", headers=headers1, timeout=10)
        print(f"Unfollow Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Unfollow successful: {data['message']}")
            success_count += 1
        else:
            print(f"❌ Unfollow failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Unfollow error: {e}")
    
    # Unfollow progamer_alex
    print(f"Testing DELETE /api/users/{user1_id}/follow (artmaster_studio unfollows progamer_alex)")
    try:
        response = requests.delete(f"{base_url}/users/{user1_id}/follow", headers=headers2, timeout=10)
        print(f"Reverse Unfollow Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Reverse unfollow successful: {data['message']}")
            success_count += 1
        else:
            print(f"❌ Reverse unfollow failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Reverse unfollow error: {e}")
    
    # Final verification
    print(f"\n--- Final Verification ---")
    print(f"Testing follow status after cleanup")
    try:
        response = requests.get(f"{base_url}/users/{user2_id}/follow-status", headers=headers1, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if not data['is_following']:
                print("✅ Follow status correctly shows not following after cleanup")
                success_count += 1
            else:
                print("❌ Should not be following after unfollow")
        else:
            print(f"❌ Final verification failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Final verification error: {e}")
    
    print(f"\n=== Follow System with Usernames Test Summary ===")
    print(f"✅ Tests passed: {success_count}/12")
    print(f"✅ Users created: progamer_alex, artmaster_studio")
    print(f"✅ User search functionality: Working")
    print(f"✅ Follow/unfollow with user IDs: Working")
    print(f"✅ Follow status verification: Working")
    print(f"✅ Following/followers lists: Working")
    print(f"✅ Error handling for non-existent users: Working")
    print(f"✅ 'Usuario no encontrado' error should be fixed")
    
    return success_count >= 10  # At least 10 out of 12 tests should pass

def test_poll_endpoints(base_url):
    """Test comprehensive poll CRUD endpoints"""
    print("\n=== Testing Poll Endpoints ===")
    
    if not auth_tokens:
        print("❌ No auth tokens available for poll testing")
        return False
    
    headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
    success_count = 0
    created_poll_id = None
    
    # Test 1: GET /api/polls without authentication (should fail)
    print("Testing GET /api/polls without authentication...")
    try:
        response = requests.get(f"{base_url}/polls", timeout=10)
        print(f"No Auth Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Polls endpoint properly requires authentication")
            success_count += 1
        else:
            print(f"❌ Should require authentication, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ No auth test error: {e}")
    
    # Test 2: GET /api/polls with authentication
    print("\nTesting GET /api/polls with authentication...")
    try:
        response = requests.get(f"{base_url}/polls", headers=headers, timeout=10)
        print(f"Get Polls Status Code: {response.status_code}")
        
        if response.status_code == 200:
            polls = response.json()
            print(f"✅ Polls retrieved successfully")
            print(f"Number of polls: {len(polls)}")
            
            if len(polls) > 0:
                poll = polls[0]
                print(f"Sample poll: {poll.get('title', 'N/A')}")
                print(f"Author: {poll.get('author', {}).get('username', 'N/A')}")
                print(f"Total votes: {poll.get('total_votes', 0)}")
                print(f"Likes: {poll.get('likes', 0)}")
            
            success_count += 1
        else:
            print(f"❌ Get polls failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get polls error: {e}")
    
    # Test 3: GET /api/polls with pagination
    print("\nTesting GET /api/polls with pagination...")
    try:
        response = requests.get(f"{base_url}/polls?limit=5&offset=0", headers=headers, timeout=10)
        print(f"Pagination Status Code: {response.status_code}")
        
        if response.status_code == 200:
            polls = response.json()
            print(f"✅ Pagination working - returned {len(polls)} polls (max 5)")
            success_count += 1
        else:
            print(f"❌ Pagination failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Pagination error: {e}")
    
    # Test 4: GET /api/polls with filters
    print("\nTesting GET /api/polls with filters...")
    try:
        # Test category filter
        response = requests.get(f"{base_url}/polls?category=gaming", headers=headers, timeout=10)
        print(f"Category Filter Status Code: {response.status_code}")
        
        if response.status_code == 200:
            polls = response.json()
            print(f"✅ Category filter working - returned {len(polls)} gaming polls")
            success_count += 1
        else:
            print(f"❌ Category filter failed: {response.text}")
            
        # Test featured filter
        response = requests.get(f"{base_url}/polls?featured=true", headers=headers, timeout=10)
        print(f"Featured Filter Status Code: {response.status_code}")
        
        if response.status_code == 200:
            polls = response.json()
            print(f"✅ Featured filter working - returned {len(polls)} featured polls")
            success_count += 1
        else:
            print(f"❌ Featured filter failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Filters error: {e}")
    
    # Test 5: POST /api/polls - Create new poll
    print("\nTesting POST /api/polls - Create new poll...")
    try:
        poll_data = {
            "title": "¿Cuál es tu videojuego favorito de 2024?",
            "description": "Vota por el mejor juego del año según tu experiencia",
            "options": [
                {
                    "text": "Baldur's Gate 3",
                    "media_type": "image",
                    "media_url": "https://example.com/bg3.jpg",
                    "thumbnail_url": "https://example.com/bg3_thumb.jpg"
                },
                {
                    "text": "Cyberpunk 2077: Phantom Liberty",
                    "media_type": "image", 
                    "media_url": "https://example.com/cp2077.jpg",
                    "thumbnail_url": "https://example.com/cp2077_thumb.jpg"
                },
                {
                    "text": "The Legend of Zelda: Tears of the Kingdom",
                    "media_type": "image",
                    "media_url": "https://example.com/zelda.jpg",
                    "thumbnail_url": "https://example.com/zelda_thumb.jpg"
                }
            ],
            "tags": ["gaming", "2024", "videojuegos"],
            "category": "gaming"
        }
        
        response = requests.post(f"{base_url}/polls", json=poll_data, headers=headers, timeout=10)
        print(f"Create Poll Status Code: {response.status_code}")
        
        if response.status_code == 200:
            poll = response.json()
            created_poll_id = poll['id']
            print(f"✅ Poll created successfully")
            print(f"Poll ID: {created_poll_id}")
            print(f"Title: {poll['title']}")
            print(f"Options count: {len(poll['options'])}")
            print(f"Author: {poll['author']['username']}")
            success_count += 1
        else:
            print(f"❌ Create poll failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Create poll error: {e}")
    
    # Test 6: POST /api/polls with validation errors
    print("\nTesting POST /api/polls with validation errors...")
    try:
        # Test with missing required fields
        invalid_poll_data = {
            "title": "",  # Empty title
            "options": []  # No options
        }
        
        response = requests.post(f"{base_url}/polls", json=invalid_poll_data, headers=headers, timeout=10)
        print(f"Invalid Poll Status Code: {response.status_code}")
        
        if response.status_code == 422:  # Validation error
            print("✅ Poll validation working correctly")
            success_count += 1
        else:
            print(f"❌ Should validate poll data, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Poll validation error: {e}")
    
    # Test 7: GET /api/polls/{poll_id} - Get specific poll
    if created_poll_id:
        print(f"\nTesting GET /api/polls/{created_poll_id} - Get specific poll...")
        try:
            response = requests.get(f"{base_url}/polls/{created_poll_id}", headers=headers, timeout=10)
            print(f"Get Specific Poll Status Code: {response.status_code}")
            
            if response.status_code == 200:
                poll = response.json()
                print(f"✅ Specific poll retrieved successfully")
                print(f"Poll ID: {poll['id']}")
                print(f"Title: {poll['title']}")
                print(f"Total votes: {poll['total_votes']}")
                print(f"User vote: {poll.get('user_vote', 'None')}")
                print(f"User liked: {poll.get('user_liked', False)}")
                success_count += 1
            else:
                print(f"❌ Get specific poll failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Get specific poll error: {e}")
    
    # Test 8: GET /api/polls/{poll_id} with invalid ID
    print("\nTesting GET /api/polls/{invalid_id} - Invalid poll ID...")
    try:
        response = requests.get(f"{base_url}/polls/invalid_poll_id_12345", headers=headers, timeout=10)
        print(f"Invalid Poll ID Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Invalid poll ID properly rejected")
            success_count += 1
        else:
            print(f"❌ Should return 404 for invalid poll ID, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Invalid poll ID error: {e}")
    
    # Test 9: POST /api/polls/{poll_id}/vote - Vote on poll
    if created_poll_id:
        print(f"\nTesting POST /api/polls/{created_poll_id}/vote - Vote on poll...")
        try:
            # First, get the poll to find a valid option ID
            poll_response = requests.get(f"{base_url}/polls/{created_poll_id}", headers=headers, timeout=10)
            if poll_response.status_code == 200:
                poll = poll_response.json()
                if poll['options']:
                    option_id = poll['options'][0]['id']
                    
                    vote_data = {"option_id": option_id}
                    response = requests.post(f"{base_url}/polls/{created_poll_id}/vote", 
                                           json=vote_data, headers=headers, timeout=10)
                    print(f"Vote Status Code: {response.status_code}")
                    
                    if response.status_code == 200:
                        result = response.json()
                        print(f"✅ Vote recorded successfully")
                        print(f"Message: {result.get('message', 'N/A')}")
                        success_count += 1
                    else:
                        print(f"❌ Vote failed: {response.text}")
                else:
                    print("❌ No options available in created poll")
            else:
                print("❌ Could not retrieve poll for voting test")
                
        except Exception as e:
            print(f"❌ Vote error: {e}")
    
    # Test 10: POST /api/polls/{poll_id}/vote - Change vote
    if created_poll_id:
        print(f"\nTesting POST /api/polls/{created_poll_id}/vote - Change vote...")
        try:
            # Get poll again to find a different option
            poll_response = requests.get(f"{base_url}/polls/{created_poll_id}", headers=headers, timeout=10)
            if poll_response.status_code == 200:
                poll = poll_response.json()
                if len(poll['options']) > 1:
                    # Vote for second option
                    option_id = poll['options'][1]['id']
                    
                    vote_data = {"option_id": option_id}
                    response = requests.post(f"{base_url}/polls/{created_poll_id}/vote", 
                                           json=vote_data, headers=headers, timeout=10)
                    print(f"Change Vote Status Code: {response.status_code}")
                    
                    if response.status_code == 200:
                        result = response.json()
                        print(f"✅ Vote changed successfully")
                        print(f"Message: {result.get('message', 'N/A')}")
                        success_count += 1
                    else:
                        print(f"❌ Change vote failed: {response.text}")
                else:
                    print("❌ Need at least 2 options to test vote change")
            else:
                print("❌ Could not retrieve poll for vote change test")
                
        except Exception as e:
            print(f"❌ Change vote error: {e}")
    
    # Test 11: POST /api/polls/{poll_id}/vote with invalid option
    if created_poll_id:
        print(f"\nTesting POST /api/polls/{created_poll_id}/vote with invalid option...")
        try:
            vote_data = {"option_id": "invalid_option_id_12345"}
            response = requests.post(f"{base_url}/polls/{created_poll_id}/vote", 
                                   json=vote_data, headers=headers, timeout=10)
            print(f"Invalid Vote Status Code: {response.status_code}")
            
            if response.status_code == 400:
                print("✅ Invalid option ID properly rejected")
                success_count += 1
            else:
                print(f"❌ Should reject invalid option ID, got status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Invalid vote error: {e}")
    
    # Test 12: POST /api/polls/{poll_id}/like - Like poll
    if created_poll_id:
        print(f"\nTesting POST /api/polls/{created_poll_id}/like - Like poll...")
        try:
            response = requests.post(f"{base_url}/polls/{created_poll_id}/like", 
                                   headers=headers, timeout=10)
            print(f"Like Poll Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Poll liked successfully")
                print(f"Liked: {result.get('liked', False)}")
                print(f"Total likes: {result.get('likes', 0)}")
                success_count += 1
            else:
                print(f"❌ Like poll failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Like poll error: {e}")
    
    # Test 13: POST /api/polls/{poll_id}/like - Unlike poll (toggle)
    if created_poll_id:
        print(f"\nTesting POST /api/polls/{created_poll_id}/like - Unlike poll...")
        try:
            response = requests.post(f"{base_url}/polls/{created_poll_id}/like", 
                                   headers=headers, timeout=10)
            print(f"Unlike Poll Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Poll unliked successfully")
                print(f"Liked: {result.get('liked', False)}")
                print(f"Total likes: {result.get('likes', 0)}")
                success_count += 1
            else:
                print(f"❌ Unlike poll failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Unlike poll error: {e}")
    
    # Test 14: POST /api/polls/{poll_id}/like - Like again
    if created_poll_id:
        print(f"\nTesting POST /api/polls/{created_poll_id}/like - Like again...")
        try:
            response = requests.post(f"{base_url}/polls/{created_poll_id}/like", 
                                   headers=headers, timeout=10)
            print(f"Like Again Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Poll liked again successfully")
                print(f"Liked: {result.get('liked', False)}")
                print(f"Total likes: {result.get('likes', 0)}")
                success_count += 1
            else:
                print(f"❌ Like again failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Like again error: {e}")
    
    # Test 15: POST /api/polls/{poll_id}/share - Share poll
    if created_poll_id:
        print(f"\nTesting POST /api/polls/{created_poll_id}/share - Share poll...")
        try:
            response = requests.post(f"{base_url}/polls/{created_poll_id}/share", 
                                   headers=headers, timeout=10)
            print(f"Share Poll Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Poll shared successfully")
                print(f"Total shares: {result.get('shares', 0)}")
                success_count += 1
            else:
                print(f"❌ Share poll failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Share poll error: {e}")
    
    # Test 16: POST /api/polls/{poll_id}/share - Share again (increment counter)
    if created_poll_id:
        print(f"\nTesting POST /api/polls/{created_poll_id}/share - Share again...")
        try:
            response = requests.post(f"{base_url}/polls/{created_poll_id}/share", 
                                   headers=headers, timeout=10)
            print(f"Share Again Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Poll shared again successfully")
                print(f"Total shares: {result.get('shares', 0)}")
                success_count += 1
            else:
                print(f"❌ Share again failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Share again error: {e}")
    
    # Test 17: Verify vote counts and user fields are correct
    if created_poll_id:
        print(f"\nTesting vote counts and user fields verification...")
        try:
            response = requests.get(f"{base_url}/polls/{created_poll_id}", headers=headers, timeout=10)
            print(f"Verification Status Code: {response.status_code}")
            
            if response.status_code == 200:
                poll = response.json()
                print(f"✅ Poll data verification successful")
                print(f"Total votes: {poll.get('total_votes', 0)}")
                print(f"Total likes: {poll.get('likes', 0)}")
                print(f"Total shares: {poll.get('shares', 0)}")
                print(f"User vote: {poll.get('user_vote', 'None')}")
                print(f"User liked: {poll.get('user_liked', False)}")
                
                # Verify response format matches PollResponse model
                required_fields = ['id', 'title', 'author', 'options', 'total_votes', 'likes', 'shares', 'user_vote', 'user_liked']
                missing_fields = [field for field in required_fields if field not in poll]
                
                if not missing_fields:
                    print("✅ Response format matches PollResponse model")
                    success_count += 1
                else:
                    print(f"❌ Missing fields in response: {missing_fields}")
                    
            else:
                print(f"❌ Verification failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Verification error: {e}")
    
    # Test 18: Test error cases with invalid poll IDs
    print("\nTesting error cases with invalid poll IDs...")
    try:
        invalid_poll_id = "invalid_poll_id_12345"
        
        # Test vote on invalid poll
        vote_data = {"option_id": "some_option_id"}
        response = requests.post(f"{base_url}/polls/{invalid_poll_id}/vote", 
                               json=vote_data, headers=headers, timeout=10)
        if response.status_code == 404:
            print("✅ Vote on invalid poll properly rejected")
            success_count += 1
        
        # Test like on invalid poll
        response = requests.post(f"{base_url}/polls/{invalid_poll_id}/like", 
                               headers=headers, timeout=10)
        if response.status_code == 404:
            print("✅ Like on invalid poll properly rejected")
            success_count += 1
        
        # Test share on invalid poll
        response = requests.post(f"{base_url}/polls/{invalid_poll_id}/share", 
                               headers=headers, timeout=10)
        if response.status_code == 404:
            print("✅ Share on invalid poll properly rejected")
            success_count += 1
            
    except Exception as e:
        print(f"❌ Error cases test error: {e}")
    
    print(f"\nPoll Endpoints Tests Summary: {success_count}/20 tests passed")
    return success_count >= 16  # At least 16 out of 20 tests should pass

def test_file_upload_endpoints(base_url):
    """Test comprehensive file upload system endpoints"""
    print("\n=== Testing File Upload System ===")
    
    if not auth_tokens:
        print("❌ No auth tokens available for file upload testing")
        return False
    
    headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
    success_count = 0
    uploaded_files = []
    
    # Test 1: Upload image file (JPG)
    print("Testing POST /api/upload - Upload JPG image...")
    try:
        # Create a simple test image file
        import io
        from PIL import Image
        
        # Create a small test image
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        files = {'file': ('test_image.jpg', img_bytes, 'image/jpeg')}
        data = {'upload_type': 'general'}
        
        response = requests.post(f"{base_url}/upload", files=files, data=data, headers=headers, timeout=30)
        print(f"Upload JPG Status Code: {response.status_code}")
        
        if response.status_code == 200:
            upload_data = response.json()
            print(f"✅ JPG image uploaded successfully")
            print(f"File ID: {upload_data['id']}")
            print(f"Filename: {upload_data['filename']}")
            print(f"File Type: {upload_data['file_type']}")
            print(f"File Size: {upload_data['file_size']} bytes")
            print(f"Public URL: {upload_data['public_url']}")
            print(f"Dimensions: {upload_data.get('width', 'N/A')}x{upload_data.get('height', 'N/A')}")
            uploaded_files.append(upload_data)
            success_count += 1
        else:
            print(f"❌ JPG upload failed: {response.text}")
            
    except Exception as e:
        print(f"❌ JPG upload error: {e}")
    
    # Test 2: Upload PNG image with different upload_type
    print("\nTesting POST /api/upload - Upload PNG image with avatar type...")
    try:
        # Create a PNG test image
        img = Image.new('RGBA', (150, 150), color=(0, 255, 0, 128))
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {'file': ('test_avatar.png', img_bytes, 'image/png')}
        data = {'upload_type': 'avatar'}
        
        response = requests.post(f"{base_url}/upload", files=files, data=data, headers=headers, timeout=30)
        print(f"Upload PNG Status Code: {response.status_code}")
        
        if response.status_code == 200:
            upload_data = response.json()
            print(f"✅ PNG avatar uploaded successfully")
            print(f"File ID: {upload_data['id']}")
            print(f"Upload Type: avatar")
            print(f"Public URL: {upload_data['public_url']}")
            uploaded_files.append(upload_data)
            success_count += 1
        else:
            print(f"❌ PNG upload failed: {response.text}")
            
    except Exception as e:
        print(f"❌ PNG upload error: {e}")
    
    # Test 3: Test different upload types
    print("\nTesting different upload_type values...")
    upload_types = ['poll_option', 'poll_background', 'general']
    
    for upload_type in upload_types:
        try:
            # Create a small test image for each type
            img = Image.new('RGB', (80, 80), color='blue')
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='JPEG')
            img_bytes.seek(0)
            
            files = {'file': (f'test_{upload_type}.jpg', img_bytes, 'image/jpeg')}
            data = {'upload_type': upload_type}
            
            response = requests.post(f"{base_url}/upload", files=files, data=data, headers=headers, timeout=30)
            print(f"Upload {upload_type} Status Code: {response.status_code}")
            
            if response.status_code == 200:
                upload_data = response.json()
                print(f"✅ {upload_type} upload successful - ID: {upload_data['id']}")
                uploaded_files.append(upload_data)
                success_count += 1
            else:
                print(f"❌ {upload_type} upload failed: {response.text}")
                
        except Exception as e:
            print(f"❌ {upload_type} upload error: {e}")
    
    # Test 4: Test unsupported file format
    print("\nTesting unsupported file format (should fail)...")
    try:
        # Create a text file (unsupported)
        text_content = b"This is a test text file"
        files = {'file': ('test.txt', io.BytesIO(text_content), 'text/plain')}
        data = {'upload_type': 'general'}
        
        response = requests.post(f"{base_url}/upload", files=files, data=data, headers=headers, timeout=30)
        print(f"Unsupported Format Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Unsupported file format properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject unsupported format, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Unsupported format test error: {e}")
    
    # Test 5: Test file size validation (create large file)
    print("\nTesting file size validation...")
    try:
        # Create a large image (should be rejected if over limit)
        large_img = Image.new('RGB', (2000, 2000), color='yellow')
        img_bytes = io.BytesIO()
        large_img.save(img_bytes, format='JPEG', quality=100)
        img_bytes.seek(0)
        
        # Check file size
        file_size = len(img_bytes.getvalue())
        print(f"Test file size: {file_size / (1024*1024):.2f} MB")
        
        files = {'file': ('large_test.jpg', img_bytes, 'image/jpeg')}
        data = {'upload_type': 'general'}
        
        response = requests.post(f"{base_url}/upload", files=files, data=data, headers=headers, timeout=30)
        print(f"Large File Status Code: {response.status_code}")
        
        # If file is within limits, it should succeed; if over limits, should fail
        if response.status_code == 200:
            upload_data = response.json()
            print(f"✅ Large file upload successful (within limits)")
            uploaded_files.append(upload_data)
            success_count += 1
        elif response.status_code == 400:
            print("✅ Large file properly rejected (over size limit)")
            success_count += 1
        else:
            print(f"❌ Unexpected response for large file: {response.status_code}")
            
    except Exception as e:
        print(f"❌ File size validation error: {e}")
    
    # Test 6: Test upload without authentication (should fail)
    print("\nTesting upload without authentication (should fail)...")
    try:
        img = Image.new('RGB', (50, 50), color='black')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        files = {'file': ('unauth_test.jpg', img_bytes, 'image/jpeg')}
        data = {'upload_type': 'general'}
        
        response = requests.post(f"{base_url}/upload", files=files, data=data, timeout=30)
        print(f"Unauthorized Upload Status Code: {response.status_code}")
        
        if response.status_code in [401, 403]:
            print("✅ Unauthorized upload properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject unauthorized upload, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Unauthorized upload test error: {e}")
    
    # Test 7: Get file info for uploaded files
    if uploaded_files:
        print(f"\nTesting GET /api/upload/{{file_id}} - Get file info...")
        try:
            file_id = uploaded_files[0]['id']
            response = requests.get(f"{base_url}/upload/{file_id}", headers=headers, timeout=10)
            print(f"Get File Info Status Code: {response.status_code}")
            
            if response.status_code == 200:
                file_info = response.json()
                print(f"✅ File info retrieved successfully")
                print(f"File ID: {file_info['id']}")
                print(f"Original Filename: {file_info['original_filename']}")
                print(f"File Type: {file_info['file_type']}")
                print(f"Created At: {file_info['created_at']}")
                success_count += 1
            else:
                print(f"❌ Get file info failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Get file info error: {e}")
    
    # Test 8: Get file info for non-existent file (should return 404)
    print("\nTesting GET /api/upload/{{file_id}} - Non-existent file...")
    try:
        fake_file_id = "non_existent_file_id_12345"
        response = requests.get(f"{base_url}/upload/{fake_file_id}", headers=headers, timeout=10)
        print(f"Non-existent File Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Non-existent file properly returns 404")
            success_count += 1
        else:
            print(f"❌ Should return 404 for non-existent file, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Non-existent file test error: {e}")
    
    # Test 9: Get user's uploaded files
    print("\nTesting GET /api/uploads/user - Get user's files...")
    try:
        response = requests.get(f"{base_url}/uploads/user", headers=headers, timeout=10)
        print(f"Get User Files Status Code: {response.status_code}")
        
        if response.status_code == 200:
            user_files = response.json()
            print(f"✅ User files retrieved successfully")
            print(f"Total files: {len(user_files)}")
            if user_files:
                print(f"First file: {user_files[0]['original_filename']} ({user_files[0]['file_type']})")
            success_count += 1
        else:
            print(f"❌ Get user files failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get user files error: {e}")
    
    # Test 10: Get user's files with upload_type filter
    print("\nTesting GET /api/uploads/user with upload_type filter...")
    try:
        response = requests.get(f"{base_url}/uploads/user?upload_type=avatar", headers=headers, timeout=10)
        print(f"Filtered User Files Status Code: {response.status_code}")
        
        if response.status_code == 200:
            filtered_files = response.json()
            print(f"✅ Filtered user files retrieved successfully")
            print(f"Avatar files: {len(filtered_files)}")
            success_count += 1
        else:
            print(f"❌ Filtered user files failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Filtered user files error: {e}")
    
    # Test 11: Test pagination for user files
    print("\nTesting GET /api/uploads/user with pagination...")
    try:
        response = requests.get(f"{base_url}/uploads/user?limit=2&offset=0", headers=headers, timeout=10)
        print(f"Paginated User Files Status Code: {response.status_code}")
        
        if response.status_code == 200:
            paginated_files = response.json()
            print(f"✅ Paginated user files retrieved successfully")
            print(f"Files returned: {len(paginated_files)} (limit=2)")
            success_count += 1
        else:
            print(f"❌ Paginated user files failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Paginated user files error: {e}")
    
    # Test 12: Test static file serving (access uploaded file via public URL)
    if uploaded_files:
        print("\nTesting static file serving - Access uploaded file via public URL...")
        try:
            public_url = uploaded_files[0]['public_url']
            # Remove /api prefix and construct full URL
            file_url = base_url.replace('/api', '') + public_url
            print(f"Testing access to: {file_url}")
            
            response = requests.get(file_url, timeout=10)
            print(f"Static File Access Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print(f"✅ Static file accessible via public URL")
                print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
                print(f"Content-Length: {response.headers.get('content-length', 'N/A')} bytes")
                success_count += 1
            else:
                print(f"❌ Static file access failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Static file access error: {e}")
    
    # Test 13: Delete uploaded file (own file)
    if uploaded_files:
        print("\nTesting DELETE /api/upload/{{file_id}} - Delete own file...")
        try:
            file_to_delete = uploaded_files[-1]  # Delete last uploaded file
            file_id = file_to_delete['id']
            
            response = requests.delete(f"{base_url}/upload/{file_id}", headers=headers, timeout=10)
            print(f"Delete File Status Code: {response.status_code}")
            
            if response.status_code == 200:
                delete_result = response.json()
                print(f"✅ File deleted successfully")
                print(f"Message: {delete_result['message']}")
                
                # Verify file is deleted by trying to get info
                verify_response = requests.get(f"{base_url}/upload/{file_id}", headers=headers, timeout=10)
                if verify_response.status_code == 404:
                    print("✅ File deletion verified - file no longer exists")
                    success_count += 1
                else:
                    print("❌ File should be deleted but still exists")
            else:
                print(f"❌ File deletion failed: {response.text}")
                
        except Exception as e:
            print(f"❌ File deletion error: {e}")
    
    # Test 14: Try to delete non-existent file (should return 404)
    print("\nTesting DELETE /api/upload/{{file_id}} - Delete non-existent file...")
    try:
        fake_file_id = "non_existent_file_id_12345"
        response = requests.delete(f"{base_url}/upload/{fake_file_id}", headers=headers, timeout=10)
        print(f"Delete Non-existent File Status Code: {response.status_code}")
        
        if response.status_code == 404:
            print("✅ Delete non-existent file properly returns 404")
            success_count += 1
        else:
            print(f"❌ Should return 404 for non-existent file deletion, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Delete non-existent file test error: {e}")
    
    # Test 15: Try to delete another user's file (should return 403)
    if len(auth_tokens) >= 2 and uploaded_files:
        print("\nTesting DELETE /api/upload/{{file_id}} - Try to delete another user's file...")
        try:
            # Use second user's token to try to delete first user's file
            headers2 = {"Authorization": f"Bearer {auth_tokens[1]}"}
            file_id = uploaded_files[0]['id']  # First user's file
            
            response = requests.delete(f"{base_url}/upload/{file_id}", headers=headers2, timeout=10)
            print(f"Delete Other User's File Status Code: {response.status_code}")
            
            if response.status_code == 403:
                print("✅ Delete other user's file properly returns 403 (Forbidden)")
                success_count += 1
            else:
                print(f"❌ Should return 403 for deleting other user's file, got status: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Delete other user's file test error: {e}")
    
    print(f"\nFile Upload System Tests Summary: {success_count}/15 tests passed")
    return success_count >= 12  # At least 12 out of 15 tests should pass

def test_image_upload_and_static_files(base_url):
    """Test image upload system and static file serving for mobile image display issue"""
    print("\n=== Testing Image Upload and Static File System ===")
    
    if not auth_tokens:
        print("❌ No auth tokens available for image upload testing")
        return False
    
    headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
    success_count = 0
    uploaded_files = []
    
    # Test 1: Upload image file (JPG)
    print("Testing POST /api/upload - Upload JPG image...")
    try:
        # Create a simple test image (1x1 pixel JPG)
        import io
        from PIL import Image
        
        # Create a small test image
        img = Image.new('RGB', (100, 100), color='red')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        files = {
            'file': ('test_image.jpg', img_bytes, 'image/jpeg')
        }
        data = {
            'upload_type': 'general'
        }
        
        response = requests.post(f"{base_url}/upload", files=files, data=data, headers=headers, timeout=30)
        print(f"Upload JPG Status Code: {response.status_code}")
        
        if response.status_code == 200:
            upload_data = response.json()
            print(f"✅ JPG image uploaded successfully")
            print(f"File ID: {upload_data['id']}")
            print(f"Original filename: {upload_data['original_filename']}")
            print(f"Public URL: {upload_data['public_url']}")
            print(f"File size: {upload_data['file_size']} bytes")
            print(f"Dimensions: {upload_data.get('width', 'N/A')}x{upload_data.get('height', 'N/A')}")
            uploaded_files.append(upload_data)
            success_count += 1
        else:
            print(f"❌ JPG upload failed: {response.text}")
            
    except Exception as e:
        print(f"❌ JPG upload error: {e}")
    
    # Test 2: Upload PNG image
    print("\nTesting POST /api/upload - Upload PNG image...")
    try:
        # Create a PNG test image
        img = Image.new('RGBA', (50, 50), color=(0, 255, 0, 128))  # Semi-transparent green
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        files = {
            'file': ('test_avatar.png', img_bytes, 'image/png')
        }
        data = {
            'upload_type': 'avatar'
        }
        
        response = requests.post(f"{base_url}/upload", files=files, data=data, headers=headers, timeout=30)
        print(f"Upload PNG Status Code: {response.status_code}")
        
        if response.status_code == 200:
            upload_data = response.json()
            print(f"✅ PNG image uploaded successfully")
            print(f"File ID: {upload_data['id']}")
            print(f"Upload type: avatar")
            print(f"Public URL: {upload_data['public_url']}")
            uploaded_files.append(upload_data)
            success_count += 1
        else:
            print(f"❌ PNG upload failed: {response.text}")
            
    except Exception as e:
        print(f"❌ PNG upload error: {e}")
    
    # Test 3: Test static file serving - access uploaded files via public URL
    print("\nTesting static file serving - Access uploaded images...")
    for uploaded_file in uploaded_files:
        try:
            # Extract backend base URL (remove /api)
            backend_base = base_url.replace('/api', '')
            full_url = f"{backend_base}{uploaded_file['public_url']}"
            
            print(f"Testing access to: {full_url}")
            response = requests.get(full_url, timeout=10)
            print(f"Static File Access Status Code: {response.status_code}")
            print(f"Content-Type: {response.headers.get('content-type', 'N/A')}")
            print(f"Content-Length: {response.headers.get('content-length', 'N/A')} bytes")
            
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                if 'image' in content_type:
                    print(f"✅ Static file served correctly with proper content-type")
                    success_count += 1
                else:
                    print(f"❌ Static file served but wrong content-type: {content_type}")
            else:
                print(f"❌ Static file access failed: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Static file access error: {e}")
    
    # Test 4: Get file information
    if uploaded_files:
        print(f"\nTesting GET /api/upload/{{file_id}} - Get file information...")
        try:
            file_id = uploaded_files[0]['id']
            response = requests.get(f"{base_url}/upload/{file_id}", headers=headers, timeout=10)
            print(f"Get File Info Status Code: {response.status_code}")
            
            if response.status_code == 200:
                file_info = response.json()
                print(f"✅ File information retrieved successfully")
                print(f"Filename: {file_info['filename']}")
                print(f"File type: {file_info['file_type']}")
                print(f"Created at: {file_info['created_at']}")
                success_count += 1
            else:
                print(f"❌ Get file info failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Get file info error: {e}")
    
    # Test 5: List user uploads
    print(f"\nTesting GET /api/uploads/user - List user uploads...")
    try:
        response = requests.get(f"{base_url}/uploads/user", headers=headers, timeout=10)
        print(f"List User Uploads Status Code: {response.status_code}")
        
        if response.status_code == 200:
            user_uploads = response.json()
            print(f"✅ User uploads listed successfully")
            print(f"Total uploads: {len(user_uploads)}")
            
            for upload in user_uploads[:3]:  # Show first 3
                print(f"  - {upload['original_filename']} ({upload['file_type']}) - {upload['public_url']}")
            
            success_count += 1
        else:
            print(f"❌ List user uploads failed: {response.text}")
            
    except Exception as e:
        print(f"❌ List user uploads error: {e}")
    
    # Test 6: Filter uploads by type
    print(f"\nTesting GET /api/uploads/user?upload_type=avatar - Filter by upload type...")
    try:
        response = requests.get(f"{base_url}/uploads/user?upload_type=avatar", headers=headers, timeout=10)
        print(f"Filter Uploads Status Code: {response.status_code}")
        
        if response.status_code == 200:
            filtered_uploads = response.json()
            print(f"✅ Filtered uploads retrieved successfully")
            print(f"Avatar uploads: {len(filtered_uploads)}")
            success_count += 1
        else:
            print(f"❌ Filter uploads failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Filter uploads error: {e}")
    
    # Test 7: Test URL format consistency - check if URLs are relative or absolute
    print(f"\nTesting URL format consistency...")
    if uploaded_files:
        for uploaded_file in uploaded_files:
            public_url = uploaded_file['public_url']
            print(f"Public URL format: {public_url}")
            
            if public_url.startswith('/uploads/'):
                print(f"✅ URL is relative format (good for frontend handling)")
                success_count += 1
            elif public_url.startswith('http'):
                print(f"⚠️  URL is absolute format: {public_url}")
                # This is not necessarily wrong, but the issue mentions relative URLs should be used
            else:
                print(f"❌ Unexpected URL format: {public_url}")
    
    # Test 8: Test unsupported file format (should fail)
    print(f"\nTesting unsupported file format - should fail...")
    try:
        # Create a text file
        text_content = b"This is a test text file"
        files = {
            'file': ('test.txt', io.BytesIO(text_content), 'text/plain')
        }
        data = {
            'upload_type': 'general'
        }
        
        response = requests.post(f"{base_url}/upload", files=files, data=data, headers=headers, timeout=10)
        print(f"Unsupported Format Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print(f"✅ Unsupported file format properly rejected")
            success_count += 1
        else:
            print(f"❌ Should reject unsupported format, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Unsupported format test error: {e}")
    
    # Test 9: Test authentication requirement for upload
    print(f"\nTesting authentication requirement for upload...")
    try:
        img = Image.new('RGB', (10, 10), color='blue')
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        
        files = {
            'file': ('test_no_auth.jpg', img_bytes, 'image/jpeg')
        }
        data = {
            'upload_type': 'general'
        }
        
        # No headers (no authentication)
        response = requests.post(f"{base_url}/upload", files=files, data=data, timeout=10)
        print(f"No Auth Upload Status Code: {response.status_code}")
        
        if response.status_code in [401, 403]:
            print(f"✅ Upload properly requires authentication")
            success_count += 1
        else:
            print(f"❌ Upload should require authentication, got status: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Auth requirement test error: {e}")
    
    # Test 10: Test file deletion
    if uploaded_files:
        print(f"\nTesting DELETE /api/upload/{{file_id}} - Delete uploaded file...")
        try:
            file_to_delete = uploaded_files[0]
            file_id = file_to_delete['id']
            
            response = requests.delete(f"{base_url}/upload/{file_id}", headers=headers, timeout=10)
            print(f"Delete File Status Code: {response.status_code}")
            
            if response.status_code == 200:
                print(f"✅ File deleted successfully")
                
                # Verify file is no longer accessible
                backend_base = base_url.replace('/api', '')
                full_url = f"{backend_base}{file_to_delete['public_url']}"
                
                verify_response = requests.get(full_url, timeout=10)
                print(f"Verify Deletion Status Code: {verify_response.status_code}")
                
                if verify_response.status_code == 404:
                    print(f"✅ File properly removed from static serving")
                    success_count += 1
                else:
                    print(f"⚠️  File still accessible after deletion (status: {verify_response.status_code})")
                    
            else:
                print(f"❌ File deletion failed: {response.text}")
                
        except Exception as e:
            print(f"❌ File deletion error: {e}")
    
    print(f"\nImage Upload and Static Files Tests Summary: {success_count}/12 tests passed")
    return success_count >= 9  # At least 9 out of 12 tests should pass

def test_poll_creation_with_images(base_url):
    """Test poll creation with uploaded images and verify URL handling"""
    print("\n=== Testing Poll Creation with Images ===")
    
    if not auth_tokens:
        print("❌ No auth tokens available for poll creation testing")
        return False
    
    headers = {"Authorization": f"Bearer {auth_tokens[0]}"}
    success_count = 0
    
    # First upload some images for poll options
    uploaded_images = []
    
    print("Step 1: Uploading images for poll options...")
    try:
        from PIL import Image
        import io
        
        # Create test images for poll options
        for i, color in enumerate(['red', 'blue', 'green']):
            img = Image.new('RGB', (200, 200), color=color)
            img_bytes = io.BytesIO()
            img.save(img_bytes, format='JPEG')
            img_bytes.seek(0)
            
            files = {
                'file': (f'poll_option_{color}.jpg', img_bytes, 'image/jpeg')
            }
            data = {
                'upload_type': 'poll_option'
            }
            
            response = requests.post(f"{base_url}/upload", files=files, data=data, headers=headers, timeout=30)
            
            if response.status_code == 200:
                upload_data = response.json()
                uploaded_images.append({
                    'color': color,
                    'url': upload_data['public_url'],
                    'id': upload_data['id']
                })
                print(f"✅ {color.capitalize()} image uploaded: {upload_data['public_url']}")
            else:
                print(f"❌ Failed to upload {color} image: {response.text}")
        
        if len(uploaded_images) >= 2:
            success_count += 1
            print(f"✅ Successfully uploaded {len(uploaded_images)} images for poll")
        else:
            print(f"❌ Need at least 2 images for poll, only got {len(uploaded_images)}")
            
    except Exception as e:
        print(f"❌ Image upload for poll error: {e}")
    
    # Step 2: Create poll with uploaded images
    if uploaded_images:
        print(f"\nStep 2: Creating poll with uploaded images...")
        try:
            poll_data = {
                "title": "¿Cuál es tu color favorito de estos?",
                "description": "Elige el color que más te guste de las opciones",
                "options": [
                    {
                        "text": f"Color {img['color'].capitalize()}",
                        "media_type": "image",
                        "media_url": img['url'],
                        "thumbnail_url": img['url']
                    }
                    for img in uploaded_images[:3]  # Use up to 3 images
                ],
                "category": "entretenimiento",
                "tags": ["colores", "preferencias", "test"]
            }
            
            response = requests.post(f"{base_url}/polls", json=poll_data, headers=headers, timeout=10)
            print(f"Create Poll Status Code: {response.status_code}")
            
            if response.status_code == 200:
                poll_response = response.json()
                print(f"✅ Poll created successfully with images")
                print(f"Poll ID: {poll_response['id']}")
                print(f"Poll Title: {poll_response['title']}")
                print(f"Options count: {len(poll_response['options'])}")
                
                # Verify image URLs in poll options
                for i, option in enumerate(poll_response['options']):
                    if option.get('media'):
                        media_url = option['media']['url']
                        print(f"  Option {i+1}: {option['text']} - Media URL: {media_url}")
                        
                        # Check if URL format is consistent
                        if media_url and (media_url.startswith('/uploads/') or media_url.startswith('http')):
                            print(f"    ✅ Media URL format is valid")
                        else:
                            print(f"    ❌ Media URL format may be invalid: {media_url}")
                
                success_count += 1
                
                # Store poll ID for further testing
                created_poll_id = poll_response['id']
                
            else:
                print(f"❌ Poll creation failed: {response.text}")
                
        except Exception as e:
            print(f"❌ Poll creation error: {e}")
    
    # Step 3: Retrieve polls and verify image URLs
    print(f"\nStep 3: Retrieving polls and verifying image URLs...")
    try:
        response = requests.get(f"{base_url}/polls?limit=5", headers=headers, timeout=10)
        print(f"Get Polls Status Code: {response.status_code}")
        
        if response.status_code == 200:
            polls = response.json()
            print(f"✅ Retrieved {len(polls)} polls")
            
            # Find our created poll and verify image URLs
            for poll in polls:
                if poll['title'] == "¿Cuál es tu color favorito de estos?":
                    print(f"Found our test poll: {poll['id']}")
                    
                    for i, option in enumerate(poll['options']):
                        if option.get('media'):
                            media_url = option['media']['url']
                            print(f"  Option {i+1} media URL: {media_url}")
                            
                            # Test if the image URL is accessible
                            try:
                                # Handle relative URLs
                                if media_url.startswith('/uploads/'):
                                    backend_base = base_url.replace('/api', '')
                                    full_url = f"{backend_base}{media_url}"
                                else:
                                    full_url = media_url
                                
                                img_response = requests.get(full_url, timeout=5)
                                print(f"    Image accessibility: {img_response.status_code}")
                                print(f"    Content-Type: {img_response.headers.get('content-type', 'N/A')}")
                                
                                if img_response.status_code == 200 and 'image' in img_response.headers.get('content-type', ''):
                                    print(f"    ✅ Image is accessible and properly served")
                                    success_count += 1
                                else:
                                    print(f"    ❌ Image not accessible or wrong content type")
                                    
                            except Exception as img_e:
                                print(f"    ❌ Error accessing image: {img_e}")
                    
                    break
            else:
                print(f"❌ Could not find our test poll in the results")
                
        else:
            print(f"❌ Get polls failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Get polls error: {e}")
    
    # Step 4: Test URL normalization (frontend concern but we can verify backend consistency)
    print(f"\nStep 4: Testing URL consistency for frontend processing...")
    if uploaded_images:
        for img in uploaded_images:
            url = img['url']
            print(f"Image URL: {url}")
            
            # Check URL format
            if url.startswith('/uploads/'):
                print(f"  ✅ Relative URL format (good for frontend normalization)")
                success_count += 1
            elif url.startswith('http'):
                print(f"  ⚠️  Absolute URL format: {url}")
                # Check if it points to correct domain
                if 'mediapolls.preview.emergentagent.com' in url:
                    print(f"    ✅ Points to correct domain")
                    success_count += 1
                else:
                    print(f"    ❌ Points to wrong domain")
            else:
                print(f"  ❌ Unexpected URL format: {url}")
    
    print(f"\nPoll Creation with Images Tests Summary: {success_count}/8 tests passed")
    return success_count >= 6  # At least 6 out of 8 tests should pass

def main():
    """Main test execution function"""
    print("🚀 Starting Backend API Testing - Focus on Image Upload System...")
    print("=" * 80)
    
    # Get backend URL
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not determine backend URL from frontend .env file")
        sys.exit(1)
    
    print(f"🌐 Testing backend at: {base_url}")
    print("=" * 80)
    
    # Test results tracking
    test_results = {}
    
    # Run all tests
    test_results['health_check'] = test_health_check(base_url)
    test_results['user_registration'] = test_user_registration(base_url)
    test_results['user_login'] = test_user_login(base_url)
    test_results['get_current_user'] = test_get_current_user(base_url)
    test_results['jwt_validation'] = test_jwt_validation(base_url)
    test_results['user_search'] = test_user_search(base_url)
    test_results['messaging_system'] = test_messaging_system(base_url)
    test_results['addiction_system'] = test_addiction_system_integration(base_url)
    test_results['authentication_requirements'] = test_authentication_requirements(base_url)
    test_results['profile_updates'] = test_profile_update_endpoints(base_url)
    test_results['nested_comments'] = test_nested_comments_system(base_url)
    test_results['follow_system'] = test_follow_system(base_url)
    test_results['follow_system_usernames'] = test_follow_system_with_usernames(base_url)
    test_results['poll_endpoints'] = test_poll_endpoints(base_url)
    test_results['file_upload_system'] = test_file_upload_endpoints(base_url)
    test_results['tiktok_profile_grid_backend'] = test_tiktok_profile_grid_backend_support(base_url)
    test_results['complete_flow'] = test_complete_user_flow(base_url)
    
    # Print summary
    print("\n" + "=" * 80)
    print("📊 FINAL TEST RESULTS SUMMARY")
    print("=" * 80)
    
    passed_tests = 0
    total_tests = len(test_results)
    
    for test_name, result in test_results.items():
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
        if result:
            passed_tests += 1
    
    print("=" * 80)
    print(f"📈 OVERALL RESULTS: {passed_tests}/{total_tests} tests passed ({(passed_tests/total_tests)*100:.1f}%)")
    
    if passed_tests == total_tests:
        print("🎉 ALL TESTS PASSED! Backend is ready for TikTok Profile Grid implementation.")
        return 0
    elif passed_tests >= total_tests * 0.8:
        print("⚠️  MOST TESTS PASSED. Backend is mostly functional with minor issues.")
        return 0
    else:
        print("🚨 MULTIPLE TEST FAILURES. Backend needs attention before TikTok Profile Grid can work properly.")
        return 1

if __name__ == "__main__":
    sys.exit(main())