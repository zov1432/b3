#!/usr/bin/env python3
"""
Backend API Testing Script - Ultra-Addictive Polling System
Tests all backend endpoints including the new addiction algorithm system.
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

def test_health_check(base_url):
    """Test the root health check endpoint"""
    print("Testing health check endpoint...")
    try:
        response = requests.get(f"{base_url}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and "Ultra-Addictive Polling API" in response.json().get("message", ""):
            print("✅ Health check endpoint working correctly")
            return True
        else:
            print("❌ Health check endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Health check endpoint error: {e}")
        return False

def test_addiction_user_profile_system(base_url):
    """Test the addiction system user profile endpoints"""
    print("\n=== Testing Addiction System - User Profile ===")
    
    # Test creating user profile
    print("Testing POST /api/user/profile...")
    test_username = f"addiction_test_user_{int(time.time())}"
    
    try:
        response = requests.post(f"{base_url}/user/profile?username={test_username}", timeout=10)
        print(f"POST Status Code: {response.status_code}")
        
        if response.status_code == 200:
            profile_data = response.json()
            print(f"Created profile: {profile_data.get('username')} (ID: {profile_data.get('id')})")
            
            # Verify profile structure
            required_fields = ['id', 'username', 'level', 'xp', 'total_votes', 'current_streak']
            missing_fields = [field for field in required_fields if field not in profile_data]
            
            if not missing_fields:
                print("✅ POST /api/user/profile working correctly")
                user_id = profile_data['id']
                
                # Test getting user profile
                print(f"\nTesting GET /api/user/profile/{user_id}...")
                get_response = requests.get(f"{base_url}/user/profile/{user_id}", timeout=10)
                
                if get_response.status_code == 200:
                    get_profile = get_response.json()
                    print(f"Retrieved profile: {get_profile.get('username')}")
                    print("✅ GET /api/user/profile/{user_id} working correctly")
                    return True, user_id
                else:
                    print("❌ GET /api/user/profile/{user_id} failed")
                    return False, None
            else:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, None
        else:
            print("❌ POST /api/user/profile failed")
            return False, None
    except Exception as e:
        print(f"❌ User profile system error: {e}")
        return False, None

def test_addiction_action_tracking(base_url, user_id):
    """Test the action tracking system with variable rewards"""
    print("\n=== Testing Addiction System - Action Tracking ===")
    
    actions_to_test = ['vote', 'create', 'share', 'like']
    successful_actions = 0
    
    for action in actions_to_test:
        print(f"\nTesting action: {action}")
        try:
            action_data = {
                "user_id": user_id,
                "action_type": action,
                "context": {
                    "votes_in_last_minute": random.randint(0, 5),
                    "poll_id": f"test_poll_{random.randint(1, 100)}"
                }
            }
            
            response = requests.post(f"{base_url}/user/action", json=action_data, timeout=10)
            print(f"Action {action} - Status Code: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Action {action} tracked successfully")
                print(f"   XP gained: {result.get('reward', {}).get('xp_gained', 0)}")
                print(f"   Level up: {result.get('level_up', False)}")
                print(f"   Achievements unlocked: {len(result.get('achievements_unlocked', []))}")
                print(f"   Dopamine triggers: {result.get('dopamine_triggers', 0)}")
                successful_actions += 1
            else:
                print(f"❌ Action {action} tracking failed")
                
        except Exception as e:
            print(f"❌ Action {action} error: {e}")
    
    success_rate = successful_actions / len(actions_to_test)
    if success_rate >= 0.75:  # 75% success rate
        print("✅ Action tracking system working correctly")
        return True
    else:
        print("❌ Action tracking system has issues")
        return False

def test_addiction_achievements_system(base_url):
    """Test the achievements system"""
    print("\n=== Testing Addiction System - Achievements ===")
    
    try:
        # Test getting all achievements
        response = requests.get(f"{base_url}/achievements", timeout=10)
        print(f"GET /achievements - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            achievements = response.json()
            print(f"Found {len(achievements)} achievements")
            
            # Verify achievement structure
            if achievements and isinstance(achievements, list):
                first_achievement = achievements[0]
                required_fields = ['name', 'description', 'icon', 'type', 'xp_reward']
                missing_fields = [field for field in required_fields if field not in first_achievement]
                
                if not missing_fields:
                    print("✅ GET /api/achievements working correctly")
                    print(f"   Sample achievement: {first_achievement.get('name')} - {first_achievement.get('description')}")
                    return True
                else:
                    print(f"❌ Achievement missing fields: {missing_fields}")
                    return False
            else:
                print("❌ Invalid achievements format")
                return False
        else:
            print("❌ GET /api/achievements failed")
            return False
            
    except Exception as e:
        print(f"❌ Achievements system error: {e}")
        return False

def test_addiction_fomo_system(base_url):
    """Test the FOMO content system"""
    print("\n=== Testing Addiction System - FOMO Content ===")
    
    try:
        response = requests.get(f"{base_url}/fomo/content", timeout=10)
        print(f"GET /fomo/content - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            fomo_content = response.json()
            print(f"Generated {len(fomo_content)} FOMO content items")
            
            if fomo_content and isinstance(fomo_content, list):
                first_item = fomo_content[0]
                required_fields = ['poll_id', 'title', 'expires_at', 'urgency_level']
                missing_fields = [field for field in required_fields if field not in first_item]
                
                if not missing_fields:
                    print("✅ GET /api/fomo/content working correctly")
                    print(f"   Sample FOMO: {first_item.get('title')} (Urgency: {first_item.get('urgency_level')})")
                    return True
                else:
                    print(f"❌ FOMO content missing fields: {missing_fields}")
                    return False
            else:
                print("❌ Invalid FOMO content format")
                return False
        else:
            print("❌ GET /api/fomo/content failed")
            return False
            
    except Exception as e:
        print(f"❌ FOMO system error: {e}")
        return False

def test_addiction_social_proof(base_url):
    """Test the social proof system"""
    print("\n=== Testing Addiction System - Social Proof ===")
    
    test_poll_id = f"test_poll_{random.randint(1000, 9999)}"
    
    try:
        response = requests.get(f"{base_url}/social-proof/{test_poll_id}", timeout=10)
        print(f"GET /social-proof/{test_poll_id} - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            social_proof = response.json()
            print(f"Generated social proof for poll {test_poll_id}")
            
            required_fields = ['poll_id', 'active_voters_count', 'trending_momentum', 'social_pressure_score']
            missing_fields = [field for field in required_fields if field not in social_proof]
            
            if not missing_fields:
                print("✅ GET /api/social-proof/{poll_id} working correctly")
                print(f"   Active voters: {social_proof.get('active_voters_count')}")
                print(f"   Social pressure score: {social_proof.get('social_pressure_score')}")
                return True
            else:
                print(f"❌ Social proof missing fields: {missing_fields}")
                return False
        else:
            print("❌ GET /api/social-proof/{poll_id} failed")
            return False
            
    except Exception as e:
        print(f"❌ Social proof system error: {e}")
        return False

def test_addiction_leaderboard(base_url):
    """Test the leaderboard system"""
    print("\n=== Testing Addiction System - Leaderboard ===")
    
    try:
        response = requests.get(f"{base_url}/leaderboard", timeout=10)
        print(f"GET /leaderboard - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            leaderboard = response.json()
            print(f"Leaderboard has {len(leaderboard)} entries")
            
            if isinstance(leaderboard, list):
                print("✅ GET /api/leaderboard working correctly")
                if leaderboard:
                    top_user = leaderboard[0]
                    print(f"   Top user: {top_user.get('username')} (Level {top_user.get('level')}, {top_user.get('xp')} XP)")
                return True
            else:
                print("❌ Invalid leaderboard format")
                return False
        else:
            print("❌ GET /api/leaderboard failed")
            return False
            
    except Exception as e:
        print(f"❌ Leaderboard system error: {e}")
        return False

def test_addiction_behavior_tracking(base_url, user_id):
    """Test the behavior tracking system"""
    print("\n=== Testing Addiction System - Behavior Tracking ===")
    
    try:
        behavior_data = {
            "user_id": user_id,
            "session_duration": random.randint(300, 3600),  # 5-60 minutes
            "polls_viewed": random.randint(10, 50),
            "polls_voted": random.randint(5, 25),
            "polls_created": random.randint(0, 3),
            "likes_given": random.randint(2, 15),
            "shares_made": random.randint(0, 5),
            "scroll_depth": random.uniform(0.3, 1.0),
            "interaction_rate": random.uniform(0.1, 0.8),
            "peak_hours": [random.randint(0, 23) for _ in range(3)],
            "device_type": "mobile"
        }
        
        response = requests.post(f"{base_url}/user/behavior", json=behavior_data, timeout=10)
        print(f"POST /user/behavior - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ POST /api/user/behavior working correctly")
            print(f"   Addiction score: {result.get('addiction_score', 0):.1f}")
            print(f"   Engagement level: {result.get('engagement_level', 'unknown')}")
            return True
        else:
            print("❌ POST /api/user/behavior failed")
            return False
            
    except Exception as e:
        print(f"❌ Behavior tracking error: {e}")
        return False

def test_addiction_analytics(base_url, user_id):
    """Test the addiction analytics system"""
    print("\n=== Testing Addiction System - Analytics ===")
    
    try:
        response = requests.get(f"{base_url}/analytics/addiction/{user_id}", timeout=10)
        print(f"GET /analytics/addiction/{user_id} - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            analytics = response.json()
            
            if "message" in analytics and "No data available" in analytics["message"]:
                print("✅ GET /api/analytics/addiction/{user_id} working correctly (no data yet)")
                return True
            else:
                required_fields = ['addiction_score', 'total_sessions', 'addiction_level']
                missing_fields = [field for field in required_fields if field not in analytics]
                
                if not missing_fields:
                    print("✅ GET /api/analytics/addiction/{user_id} working correctly")
                    print(f"   Addiction score: {analytics.get('addiction_score', 0)}")
                    print(f"   Addiction level: {analytics.get('addiction_level', 'unknown')}")
                    return True
                else:
                    print(f"❌ Analytics missing fields: {missing_fields}")
                    return False
        else:
            print("❌ GET /api/analytics/addiction/{user_id} failed")
            return False
            
    except Exception as e:
        print(f"❌ Analytics system error: {e}")
        return False

def test_addiction_notifications(base_url, user_id):
    """Test the smart notifications system"""
    print("\n=== Testing Addiction System - Smart Notifications ===")
    
    try:
        response = requests.post(f"{base_url}/notifications/generate/{user_id}", timeout=10)
        print(f"POST /notifications/generate/{user_id} - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ POST /api/notifications/generate/{user_id} working correctly")
            print(f"   Generated notifications: {result.get('generated_notifications', 0)}")
            
            notifications = result.get('notifications', [])
            if notifications:
                sample_notification = notifications[0]
                print(f"   Sample notification: {sample_notification.get('title', 'N/A')}")
            
            return True
        else:
            print("❌ POST /api/notifications/generate/{user_id} failed")
            return False
            
    except Exception as e:
        print(f"❌ Notifications system error: {e}")
        return False

def test_addiction_jackpot_system(base_url, user_id):
    """Test the jackpot reward system"""
    print("\n=== Testing Addiction System - Jackpot Rewards ===")
    
    try:
        response = requests.post(f"{base_url}/user/{user_id}/jackpot", timeout=10)
        print(f"POST /user/{user_id}/jackpot - Status Code: {response.status_code}")
        
        if response.status_code == 200:
            jackpot = response.json()
            print("✅ POST /api/user/{user_id}/jackpot working correctly")
            print(f"   🎉 JACKPOT TRIGGERED! 🎉")
            print(f"   XP bonus: {jackpot.get('xp_bonus', 0)}")
            print(f"   Rare rewards: {len(jackpot.get('rare_rewards', []))}")
            print(f"   New level: {jackpot.get('new_level', 'N/A')}")
            print(f"   Message: {jackpot.get('message', 'N/A')}")
            return True
        else:
            print("❌ POST /api/user/{user_id}/jackpot failed")
            return False
            
    except Exception as e:
        print(f"❌ Jackpot system error: {e}")
        return False

def test_status_endpoints(base_url):
    """Test the status check endpoints (GET and POST)"""
    print("\n=== Testing Basic Status Endpoints ===")
    
    # Test POST /status
    print("Testing POST /api/status...")
    try:
        test_data = {
            "client_name": "addiction_test_client"
        }
        response = requests.post(f"{base_url}/status", json=test_data, timeout=10)
        print(f"POST Status Code: {response.status_code}")
        
        if response.status_code == 200:
            created_status = response.json()
            if "id" in created_status and "timestamp" in created_status:
                print("✅ POST /api/status working correctly")
                post_success = True
            else:
                print("❌ POST /api/status missing required fields")
                post_success = False
        else:
            print("❌ POST /api/status failed")
            post_success = False
    except Exception as e:
        print(f"❌ POST /api/status error: {e}")
        post_success = False
    
    # Test GET /status
    print("\nTesting GET /api/status...")
    try:
        response = requests.get(f"{base_url}/status", timeout=10)
        print(f"GET Status Code: {response.status_code}")
        
        if response.status_code == 200:
            status_list = response.json()
            print(f"GET Response: Found {len(status_list)} status checks")
            if isinstance(status_list, list):
                print("✅ GET /api/status working correctly")
                get_success = True
            else:
                print("❌ GET /api/status should return a list")
                get_success = False
        else:
            print("❌ GET /api/status failed")
            get_success = False
    except Exception as e:
        print(f"❌ GET /api/status error: {e}")
        get_success = False
    
    return post_success and get_success

def main():
    print("=== ULTRA-ADDICTIVE POLLING SYSTEM - COMPREHENSIVE BACKEND TESTING ===")
    print(f"Test started at: {datetime.now()}")
    
    # Get backend URL
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not determine backend URL from frontend/.env")
        sys.exit(1)
    
    print(f"Testing backend at: {base_url}")
    
    # Test results tracking
    test_results = {}
    user_id = None
    
    # 1. Basic health check
    test_results['health_check'] = test_health_check(base_url)
    
    # 2. Basic status endpoints
    test_results['status_endpoints'] = test_status_endpoints(base_url)
    
    # 3. Addiction system tests
    profile_success, user_id = test_addiction_user_profile_system(base_url)
    test_results['user_profile'] = profile_success
    
    if user_id:
        # Only run user-specific tests if we have a valid user
        test_results['action_tracking'] = test_addiction_action_tracking(base_url, user_id)
        test_results['behavior_tracking'] = test_addiction_behavior_tracking(base_url, user_id)
        test_results['analytics'] = test_addiction_analytics(base_url, user_id)
        test_results['notifications'] = test_addiction_notifications(base_url, user_id)
        test_results['jackpot'] = test_addiction_jackpot_system(base_url, user_id)
    else:
        print("\n⚠️  Skipping user-specific tests due to profile creation failure")
        test_results['action_tracking'] = False
        test_results['behavior_tracking'] = False
        test_results['analytics'] = False
        test_results['notifications'] = False
        test_results['jackpot'] = False
    
    # User-independent tests
    test_results['achievements'] = test_addiction_achievements_system(base_url)
    test_results['fomo_content'] = test_addiction_fomo_system(base_url)
    test_results['social_proof'] = test_addiction_social_proof(base_url)
    test_results['leaderboard'] = test_addiction_leaderboard(base_url)
    
    # Final Summary
    print("\n" + "="*80)
    print("🎯 ULTRA-ADDICTIVE POLLING SYSTEM - FINAL TEST RESULTS")
    print("="*80)
    
    # Basic functionality
    print("\n📋 BASIC FUNCTIONALITY:")
    print(f"   Health Check: {'✅ PASS' if test_results['health_check'] else '❌ FAIL'}")
    print(f"   Status Endpoints: {'✅ PASS' if test_results['status_endpoints'] else '❌ FAIL'}")
    
    # Addiction system core
    print("\n🧠 ADDICTION SYSTEM CORE:")
    print(f"   User Profile System: {'✅ PASS' if test_results['user_profile'] else '❌ FAIL'}")
    print(f"   Action Tracking: {'✅ PASS' if test_results['action_tracking'] else '❌ FAIL'}")
    print(f"   Variable Rewards: {'✅ PASS' if test_results['action_tracking'] else '❌ FAIL'}")
    
    # Engagement mechanics
    print("\n🎮 ENGAGEMENT MECHANICS:")
    print(f"   Achievements System: {'✅ PASS' if test_results['achievements'] else '❌ FAIL'}")
    print(f"   Behavior Tracking: {'✅ PASS' if test_results['behavior_tracking'] else '❌ FAIL'}")
    print(f"   Addiction Analytics: {'✅ PASS' if test_results['analytics'] else '❌ FAIL'}")
    
    # Social & FOMO features
    print("\n🔥 SOCIAL & FOMO FEATURES:")
    print(f"   FOMO Content: {'✅ PASS' if test_results['fomo_content'] else '❌ FAIL'}")
    print(f"   Social Proof: {'✅ PASS' if test_results['social_proof'] else '❌ FAIL'}")
    print(f"   Leaderboard: {'✅ PASS' if test_results['leaderboard'] else '❌ FAIL'}")
    
    # Advanced features
    print("\n🚀 ADVANCED FEATURES:")
    print(f"   Smart Notifications: {'✅ PASS' if test_results['notifications'] else '❌ FAIL'}")
    print(f"   Jackpot System: {'✅ PASS' if test_results['jackpot'] else '❌ FAIL'}")
    
    # Overall assessment
    passed_tests = sum(1 for result in test_results.values() if result)
    total_tests = len(test_results)
    success_rate = (passed_tests / total_tests) * 100
    
    print(f"\n📊 OVERALL RESULTS:")
    print(f"   Tests Passed: {passed_tests}/{total_tests}")
    print(f"   Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 90:
        print("   🏆 EXCELLENT: Ultra-addictive system is working perfectly!")
    elif success_rate >= 75:
        print("   ✅ GOOD: Most addiction features are working correctly")
    elif success_rate >= 50:
        print("   ⚠️  PARTIAL: Some addiction features need attention")
    else:
        print("   ❌ CRITICAL: Major issues with addiction system")
    
    print("="*80)
    
    return 0 if success_rate >= 75 else 1

if __name__ == "__main__":
    sys.exit(main())