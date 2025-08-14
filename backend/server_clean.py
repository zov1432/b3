from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import uuid
from datetime import datetime, date, timedelta
import random
import asyncio
import re

# Import models
from models import (
    UserProfile, User, UserCreate, UserLogin, UserResponse, Token,
    Message, MessageCreate, Conversation, ConversationResponse
)
from auth import (
    verify_password, get_password_hash, create_access_token, 
    verify_token, ACCESS_TOKEN_EXPIRE_MINUTES
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Social Network", description="Social network with messaging")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """Get current authenticated user"""
    token = credentials.credentials
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user_data = await db.users.find_one({"id": payload["sub"]})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return UserResponse(**user_data)

# Basic API endpoint
@api_router.get("/")
async def get_api_info():
    """Get API information"""
    return {
        "name": "Social Network API",
        "version": "1.0",
        "description": "Social network with messaging functionality",
        "features": ["messaging", "user_profiles"]
    }

# =============  AUTHENTICATION ENDPOINTS =============

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if email exists
    if await db.users.find_one({"email": user_data.email}):
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Check if username exists
    if await db.users.find_one({"username": user_data.username}):
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )
    
    # Create user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        username=user_data.username,
        display_name=user_data.display_name,
        hashed_password=hashed_password
    )
    
    # Insert user
    await db.users.insert_one(user.dict())
    
    # Create user profile
    profile = UserProfile(
        id=user.id,
        username=user.username
    )
    await db.user_profiles.insert_one(profile.dict())
    
    # Generate token
    access_token = create_access_token(data={"sub": user.id})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse(**user.dict())
    )

@api_router.post("/auth/login", response_model=Token)
async def login(login_data: UserLogin):
    """Login user"""
    # Find user
    user_data = await db.users.find_one({"email": login_data.email})
    if not user_data:
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password"
        )
    
    # Verify password
    if not verify_password(login_data.password, user_data["hashed_password"]):
        raise HTTPException(
            status_code=400,
            detail="Incorrect email or password"
        )
    
    # Update last login
    await db.users.update_one(
        {"id": user_data["id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    # Generate token
    access_token = create_access_token(data={"sub": user_data["id"]})
    
    return Token(
        access_token=access_token,
        token_type="bearer", 
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse(**user_data)
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information"""
    return current_user

# =============  USER PROFILE ENDPOINTS =============

@api_router.get("/user/profile")
async def get_my_profile(current_user: UserResponse = Depends(get_current_user)):
    """Get current user profile"""
    profile_data = await db.user_profiles.find_one({"id": current_user.id})
    if not profile_data:
        # Create profile if it doesn't exist
        profile = UserProfile(id=current_user.id, username=current_user.username)
        await db.user_profiles.insert_one(profile.dict())
        return profile
    
    profile = UserProfile(**profile_data)
    return profile

@api_router.get("/user/profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile (public endpoint)"""
    profile_data = await db.user_profiles.find_one({"id": user_id})
    if not profile_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = UserProfile(**profile_data)
    return profile

# =============  USER SEARCH ENDPOINTS =============

@api_router.get("/users/search")
async def search_users(q: str = "", current_user: UserResponse = Depends(get_current_user)):
    """Search users by username or display name"""
    if not q.strip():
        return []
    
    # Search by username or display_name (case-insensitive)
    search_regex = {"$regex": q, "$options": "i"}
    users = await db.users.find({
        "$and": [
            {"id": {"$ne": current_user.id}},  # Exclude current user
            {
                "$or": [
                    {"username": search_regex},
                    {"display_name": search_regex}
                ]
            }
        ]
    }).limit(10).to_list(10)
    
    return [UserResponse(**user) for user in users]

# =============  MESSAGING ENDPOINTS =============

@api_router.post("/messages")
async def send_message(message: MessageCreate, current_user: UserResponse = Depends(get_current_user)):
    """Send a message to another user"""
    # Verify recipient exists
    recipient = await db.users.find_one({"id": message.recipient_id})
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    # Find or create conversation
    conversation_data = await db.conversations.find_one({
        "participants": {"$all": [current_user.id, message.recipient_id]}
    })
    
    if not conversation_data:
        # Create new conversation
        conversation = Conversation(
            participants=[current_user.id, message.recipient_id],
            unread_count={
                current_user.id: 0,
                message.recipient_id: 1
            }
        )
        await db.conversations.insert_one(conversation.dict())
        conversation_id = conversation.id
    else:
        conversation_id = conversation_data["id"]
        # Update unread count for recipient
        await db.conversations.update_one(
            {"id": conversation_id},
            {
                "$inc": {f"unread_count.{message.recipient_id}": 1},
                "$set": {
                    "last_message": message.content,
                    "last_message_at": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                }
            }
        )
    
    # Create message
    new_message = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        recipient_id=message.recipient_id,
        content=message.content,
        message_type=message.message_type,
        metadata=message.metadata
    )
    
    await db.messages.insert_one(new_message.dict())
    
    return {
        "success": True,
        "message_id": new_message.id,
        "conversation_id": conversation_id
    }

@api_router.get("/conversations")
async def get_conversations(current_user: UserResponse = Depends(get_current_user)):
    """Get user's conversations"""
    conversations = await db.conversations.find({
        "participants": current_user.id,
        "is_active": True
    }).sort("last_message_at", -1).to_list(50)
    
    result = []
    for conv_data in conversations:
        # Get participant info
        participant_ids = [p for p in conv_data["participants"] if p != current_user.id]
        participants = []
        
        for participant_id in participant_ids:
            user_data = await db.users.find_one({"id": participant_id})
            if user_data:
                participants.append(UserResponse(**user_data))
        
        # Get unread count for current user
        unread_count = conv_data.get("unread_count", {}).get(current_user.id, 0)
        
        conversation_response = ConversationResponse(
            id=conv_data["id"],
            participants=participants,
            last_message=conv_data.get("last_message"),
            last_message_at=conv_data.get("last_message_at"),
            unread_count=unread_count,
            created_at=conv_data["created_at"]
        )
        result.append(conversation_response)
    
    return result

@api_router.get("/conversations/{conversation_id}/messages")
async def get_conversation_messages(
    conversation_id: str,
    limit: int = 50,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get messages from a conversation"""
    # Verify user is participant in conversation
    conversation = await db.conversations.find_one({
        "id": conversation_id,
        "participants": current_user.id
    })
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Get messages
    messages = await db.messages.find({
        "conversation_id": conversation_id
    }).sort("created_at", -1).limit(limit).to_list(limit)
    
    # Mark messages as read
    await db.messages.update_many(
        {
            "conversation_id": conversation_id,
            "recipient_id": current_user.id,
            "is_read": False
        },
        {"$set": {"is_read": True}}
    )
    
    # Reset unread count for current user
    await db.conversations.update_one(
        {"id": conversation_id},
        {"$set": {f"unread_count.{current_user.id}": 0}}
    )
    
    # Reverse to get chronological order (oldest first)
    messages.reverse()
    
    return [Message(**msg) for msg in messages]

@api_router.get("/messages/unread")
async def get_unread_count(current_user: UserResponse = Depends(get_current_user)):
    """Get total unread message count"""
    conversations = await db.conversations.find({
        "participants": current_user.id,
        "is_active": True
    }).to_list(100)
    
    total_unread = sum(
        conv.get("unread_count", {}).get(current_user.id, 0) 
        for conv in conversations
    )
    
    return {"unread_count": total_unread}

# Add the API router to the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)