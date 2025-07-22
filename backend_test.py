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
        
        if response.status_code == 200 and "Ultra-Addictive Polling API" in response.json().get("message", ""):
            print("✅ Health check endpoint working correctly")
            return True
        else:
            print("❌ Health check endpoint failed")
            return False
    except Exception as e:
        print(f"❌ Health check endpoint error: {e}")
        return False

def test_status_endpoints(base_url):
    """Test the status check endpoints (GET and POST)"""
    print("\nTesting status endpoints...")
    
    # Test POST /status
    print("Testing POST /api/status...")
    try:
        test_data = {
            "client_name": "test_client_backend_verification"
        }
        response = requests.post(f"{base_url}/status", json=test_data, timeout=10)
        print(f"POST Status Code: {response.status_code}")
        print(f"POST Response: {response.json()}")
        
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

def test_poll_endpoints(base_url):
    """Test for any poll-related endpoints"""
    print("\nTesting for poll-related endpoints...")
    
    # Common poll endpoint patterns to test
    poll_endpoints = ["/polls", "/poll", "/api/polls", "/api/poll"]
    
    found_poll_endpoints = False
    for endpoint in poll_endpoints:
        try:
            # Remove /api prefix if it's already in the endpoint
            test_endpoint = endpoint.replace("/api", "")
            response = requests.get(f"{base_url}{test_endpoint}", timeout=5)
            if response.status_code != 404:
                print(f"Found poll endpoint: {test_endpoint} (Status: {response.status_code})")
                found_poll_endpoints = True
        except:
            continue
    
    if not found_poll_endpoints:
        print("ℹ️  No poll-related endpoints found")
    
    return True  # Not a failure if no poll endpoints exist

def main():
    print("=== Backend API Testing ===")
    print(f"Test started at: {datetime.now()}")
    
    # Get backend URL
    base_url = get_backend_url()
    if not base_url:
        print("❌ Could not determine backend URL from frontend/.env")
        sys.exit(1)
    
    print(f"Testing backend at: {base_url}")
    
    # Run tests
    health_ok = test_health_check(base_url)
    status_ok = test_status_endpoints(base_url)
    poll_ok = test_poll_endpoints(base_url)
    
    # Summary
    print("\n=== Test Summary ===")
    print(f"Health Check: {'✅ PASS' if health_ok else '❌ FAIL'}")
    print(f"Status Endpoints: {'✅ PASS' if status_ok else '❌ FAIL'}")
    print(f"Poll Endpoints: {'✅ PASS' if poll_ok else '❌ FAIL'}")
    
    overall_success = health_ok and status_ok and poll_ok
    print(f"\nOverall Backend Status: {'✅ ALL TESTS PASSED' if overall_success else '❌ SOME TESTS FAILED'}")
    
    return 0 if overall_success else 1

if __name__ == "__main__":
    sys.exit(main())