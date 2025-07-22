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
    UserProfile, UserBehavior, AddictionMetrics, Achievement, UserStreak,
    RewardEvent, FOMOContent, PushNotification, SocialProof, DopamineHit,
    NotificationType, AchievementType,
    # Auth & Messaging models
    User, UserCreate, UserLogin, UserResponse, Token,
    Message, MessageCreate, Conversation, ConversationResponse
)
from addiction_engine import addiction_engine
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
app = FastAPI(title="Ultra-Addictive Social Network", description="More addictive than TikTok with messaging")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# Authentication dependency
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> UserResponse:
    """Get current authenticated user"""
    payload = verify_token(credentials.credentials)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    
    # Get user from database
    user_data = await db.users.find_one({"id": user_id})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    
    return UserResponse(**user_data)

# Optional authentication (for some endpoints)
async def get_current_user_optional(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Optional[UserResponse]:
    """Get current user if authenticated, None otherwise"""
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None

# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Vote Action Model
class VoteAction(BaseModel):
    user_id: str
    poll_id: str
    option_id: str
    session_data: Optional[Dict] = None

# User Action Model  
class UserAction(BaseModel):
    user_id: str
    action_type: str  # vote, create, share, like, view
    context: Optional[Dict] = None

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Ultra-Addictive Social Network API", "version": "3.0", "features": ["polling", "messaging", "addiction_system"]}

# ============= AUTHENTICATION ENDPOINTS =============

@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    """Register a new user"""
    # Check if email already exists
    existing_email = await db.users.find_one({"email": user_data.email})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = await db.users.find_one({"username": user_data.username})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Validate username (alphanumeric + underscore only)
    if not re.match(r'^[a-zA-Z0-9_]+$', user_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username can only contain letters, numbers, and underscores"
        )
    
    # Create user
    user = User(
        email=user_data.email,
        username=user_data.username,
        display_name=user_data.display_name
    )
    
    # Hash password and store separately
    hashed_password = get_password_hash(user_data.password)
    
    # Save user to database
    await db.users.insert_one(user.dict())
    await db.user_passwords.insert_one({
        "user_id": user.id,
        "hashed_password": hashed_password
    })
    
    # Create user profile for addiction system
    profile = UserProfile(id=user.id, username=user.username)
    await db.user_profiles.insert_one(profile.dict())
    
    # Create initial streak
    streak = UserStreak(user_id=profile.id, streak_type="daily_vote")
    await db.user_streaks.insert_one(streak.dict())
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Update last login
    await db.users.update_one(
        {"id": user.id},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse(**user.dict())
    )

@api_router.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """Login user"""
    # Find user by email
    user_data = await db.users.find_one({"email": user_credentials.email})
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    user = User(**user_data)
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Get password hash
    password_data = await db.user_passwords.find_one({"user_id": user.id})
    if not password_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(user_credentials.password, password_data["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    # Update last login
    await db.users.update_one(
        {"id": user.id},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse(**user.dict())
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@api_router.get("/users/search")
async def search_users(
    q: str,
    limit: int = 20,
    current_user: UserResponse = Depends(get_current_user)
):
    """Search users by username or display name"""
    if len(q) < 2:
        return []
    
    # Search by username or display name (case insensitive)
    users = await db.users.find({
        "$or": [
            {"username": {"$regex": q, "$options": "i"}},
            {"display_name": {"$regex": q, "$options": "i"}}
        ],
        "is_active": True,
        "id": {"$ne": current_user.id}  # Exclude current user
    }).limit(limit).to_list(limit)
    
    return [UserResponse(**user) for user in users]

# ============= MESSAGING ENDPOINTS =============

@api_router.get("/conversations")
async def get_conversations(current_user: UserResponse = Depends(get_current_user)):
    """Get user's conversations"""
    conversations = await db.conversations.find({
        "participants": current_user.id,
        "is_active": True
    }).sort("last_message_at", -1).to_list(50)
    
    result = []
    for conv_data in conversations:
        conv = Conversation(**conv_data)
        
        # Get participants info
        participant_ids = [p for p in conv.participants if p != current_user.id]
        participants_data = await db.users.find({"id": {"$in": participant_ids}}).to_list(10)
        participants = [UserResponse(**p) for p in participants_data]
        
        result.append(ConversationResponse(
            id=conv.id,
            participants=participants,
            last_message=conv.last_message,
            last_message_at=conv.last_message_at,
            unread_count=conv.unread_count.get(current_user.id, 0),
            created_at=conv.created_at
        ))
    
    return result

@api_router.get("/conversations/{conversation_id}/messages")
async def get_messages(
    conversation_id: str,
    limit: int = 50,
    offset: int = 0,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get messages in a conversation"""
    # Check if user is participant
    conversation = await db.conversations.find_one({
        "id": conversation_id,
        "participants": current_user.id
    })
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
    
    # Get messages
    messages = await db.messages.find({
        "conversation_id": conversation_id
    }).sort("created_at", -1).skip(offset).limit(limit).to_list(limit)
    
    # Mark messages as read
    await db.messages.update_many({
        "conversation_id": conversation_id,
        "recipient_id": current_user.id,
        "is_read": False
    }, {"$set": {"is_read": True}})
    
    # Update unread count
    await db.conversations.update_one(
        {"id": conversation_id},
        {"$set": {f"unread_count.{current_user.id}": 0}}
    )
    
    return [Message(**msg) for msg in reversed(messages)]

@api_router.post("/messages")
async def send_message(
    message_data: MessageCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Send a message"""
    # Check if recipient exists
    recipient = await db.users.find_one({"id": message_data.recipient_id})
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient not found"
        )
    
    # Check if recipient allows messages
    if not recipient.get("allow_messages", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not accept messages"
        )
    
    # Find or create conversation
    conversation = await db.conversations.find_one({
        "participants": {"$all": [current_user.id, message_data.recipient_id]},
        "is_active": True
    })
    
    if not conversation:
        # Create new conversation
        new_conv = Conversation(
            participants=[current_user.id, message_data.recipient_id],
            unread_count={
                current_user.id: 0,
                message_data.recipient_id: 0
            }
        )
        await db.conversations.insert_one(new_conv.dict())
        conversation_id = new_conv.id
    else:
        conversation_id = conversation["id"]
    
    # Create message
    message = Message(
        conversation_id=conversation_id,
        sender_id=current_user.id,
        recipient_id=message_data.recipient_id,
        content=message_data.content,
        message_type=message_data.message_type,
        metadata=message_data.metadata
    )
    
    await db.messages.insert_one(message.dict())
    
    # Update conversation
    await db.conversations.update_one(
        {"id": conversation_id},
        {
            "$set": {
                "last_message": message_data.content,
                "last_message_at": message.created_at,
                "updated_at": message.created_at
            },
            "$inc": {f"unread_count.{message_data.recipient_id}": 1}
        }
    )
    
    return {"success": True, "message_id": message.id}

@api_router.get("/messages/unread")
async def get_unread_count(current_user: UserResponse = Depends(get_current_user)):
    """Get total unread messages count"""
    conversations = await db.conversations.find({
        "participants": current_user.id,
        "is_active": True
    }).to_list(100)
    
    total_unread = sum(conv.get("unread_count", {}).get(current_user.id, 0) for conv in conversations)
    
    return {"unread_count": total_unread}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# ============= ADDICTION ENGINE ENDPOINTS =============

@api_router.post("/user/profile")
async def create_user_profile(username: str, current_user: UserResponse = Depends(get_current_user)):
    """Create or get user profile with addiction tracking"""
    # Use authenticated user
    existing_profile = await db.user_profiles.find_one({"id": current_user.id})
    if existing_profile:
        return UserProfile(**existing_profile)
    
    profile = UserProfile(id=current_user.id, username=current_user.username)
    await db.user_profiles.insert_one(profile.dict())
    
    # Create initial streak
    streak = UserStreak(user_id=profile.id, streak_type="daily_vote")
    await db.user_streaks.insert_one(streak.dict())
    
    return profile

@api_router.get("/user/profile")
async def get_my_profile(current_user: UserResponse = Depends(get_current_user)):
    """Get current user profile with real-time addiction metrics"""
    profile_data = await db.user_profiles.find_one({"id": current_user.id})
    if not profile_data:
        # Create profile if it doesn't exist
        profile = UserProfile(id=current_user.id, username=current_user.username)
        await db.user_profiles.insert_one(profile.dict())
        return profile
    
    profile = UserProfile(**profile_data)
    
    # Get recent behavior for addiction scoring
    behaviors = await db.user_behavior.find({"user_id": current_user.id}).sort("timestamp", -1).limit(50).to_list(50)
    if behaviors:
        addiction_score = addiction_engine.calculate_addiction_score(behaviors)
        addiction_metrics = AddictionMetrics(
            user_id=current_user.id,
            addiction_score=addiction_score,
            engagement_level="high" if addiction_score > 70 else "medium" if addiction_score > 40 else "low"
        )
        profile.addiction_metrics = addiction_metrics
    
    return profile

@api_router.get("/user/profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile with real-time addiction metrics (public endpoint)"""
    profile_data = await db.user_profiles.find_one({"id": user_id})
    if not profile_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = UserProfile(**profile_data)
    
    # Get recent behavior for addiction scoring
    behaviors = await db.user_behavior.find({"user_id": user_id}).sort("timestamp", -1).limit(50).to_list(50)
    if behaviors:
        addiction_score = addiction_engine.calculate_addiction_score(behaviors)
        addiction_metrics = AddictionMetrics(
            user_id=user_id,
            addiction_score=addiction_score,
            engagement_level="high" if addiction_score > 70 else "medium" if addiction_score > 40 else "low"
        )
        profile.addiction_metrics = addiction_metrics
    
    return profile

@api_router.post("/user/action")
async def track_user_action(action: UserAction, current_user: UserResponse = Depends(get_current_user)):
    """Track user action and trigger addiction mechanics"""
    action.user_id = current_user.id  # Use authenticated user
    
    current_time = datetime.utcnow()
    current_hour = current_time.hour
    
    # Get user profile
    profile_data = await db.user_profiles.find_one({"id": current_user.id})
    if not profile_data:
        # Create profile if it doesn't exist
        profile = UserProfile(id=current_user.id, username=current_user.username)
        await db.user_profiles.insert_one(profile.dict())
    else:
        profile = UserProfile(**profile_data)
    
    # Generate variable reward
    reward = addiction_engine.generate_variable_reward(action.action_type, profile)
    
    # Update user stats
    if action.action_type == "vote":
        profile.total_votes += 1
        # Update streak
        streak_data = await db.user_streaks.find_one({"user_id": current_user.id, "streak_type": "daily_vote"})
        if streak_data:
            streak = addiction_engine.update_user_streak(current_user.id, "daily_vote")
            await db.user_streaks.replace_one({"id": streak_data["id"]}, streak.dict())
            profile.current_streak = streak.current_count
    elif action.action_type == "create":
        profile.total_polls_created += 1
    
    # Add XP and check level up
    old_level = profile.level
    profile.xp += reward.xp_gained
    new_level = int((profile.xp / 100) ** 0.5) + 1  # Level formula
    profile.level = new_level
    
    # Check for achievements
    context = {
        "current_hour": current_hour,
        "votes_in_last_minute": action.context.get("votes_in_last_minute", 0) if action.context else 0
    }
    unlocked_achievements = addiction_engine.check_achievements(profile, context)
    
    # Add achievements to profile
    for achievement in unlocked_achievements:
        if achievement.id not in profile.achievements:
            profile.achievements.append(achievement.id)
            profile.xp += achievement.xp_reward
            
            # Trigger achievement dopamine hit
            dopamine_hit = addiction_engine.trigger_dopamine_hit(
                current_user.id, "achievement_unlock", 
                {"achievement": achievement.name, "xp_bonus": achievement.xp_reward}
            )
            await db.dopamine_hits.insert_one(dopamine_hit.dict())
    
    # Level up dopamine hit
    if new_level > old_level:
        dopamine_hit = addiction_engine.trigger_dopamine_hit(
            current_user.id, "level_up",
            {"old_level": old_level, "new_level": new_level}
        )
        await db.dopamine_hits.insert_one(dopamine_hit.dict())
    
    # Rare reward dopamine hit
    if reward.rare_reward:
        dopamine_hit = addiction_engine.trigger_dopamine_hit(
            current_user.id, "rare_reward",
            {"reward_type": reward.rare_reward, "xp_bonus": reward.xp_gained}
        )
        await db.dopamine_hits.insert_one(dopamine_hit.dict())
    
    # Update profile in database
    profile.last_activity = current_time
    await db.user_profiles.replace_one({"id": current_user.id}, profile.dict())
    
    # Save reward event
    await db.reward_events.insert_one(reward.dict())
    
    return {
        "success": True,
        "profile": profile,
        "reward": reward,
        "achievements_unlocked": unlocked_achievements,
        "level_up": new_level > old_level,
        "dopamine_triggers": len(unlocked_achievements) + (1 if new_level > old_level else 0) + (1 if reward.rare_reward else 0)
    }

@api_router.post("/user/behavior")
async def track_user_behavior(behavior: UserBehavior, current_user: UserResponse = Depends(get_current_user)):
    """Track detailed user behavior for addiction analytics"""
    behavior.user_id = current_user.id
    await db.user_behavior.insert_one(behavior.dict())
    
    # Calculate real-time addiction score
    recent_behaviors = await db.user_behavior.find({"user_id": current_user.id}).sort("timestamp", -1).limit(20).to_list(20)
    addiction_score = addiction_engine.calculate_addiction_score(recent_behaviors)
    
    return {
        "success": True,
        "addiction_score": addiction_score,
        "engagement_level": "addicted" if addiction_score > 80 else "high" if addiction_score > 60 else "medium" if addiction_score > 30 else "low"
    }

@api_router.get("/user/streaks")
async def get_my_streaks(current_user: UserResponse = Depends(get_current_user)):
    """Get current user streaks"""
    streaks = await db.user_streaks.find({"user_id": current_user.id}).to_list(10)
    return [UserStreak(**streak) for streak in streaks]

@api_router.get("/user/{user_id}/streaks")
async def get_user_streaks(user_id: str):
    """Get user streaks (public)"""
    streaks = await db.user_streaks.find({"user_id": user_id}).to_list(10)
    return [UserStreak(**streak) for streak in streaks]

@api_router.get("/achievements")
async def get_all_achievements():
    """Get all possible achievements"""
    return addiction_engine.achievements

@api_router.get("/user/achievements")
async def get_my_achievements(current_user: UserResponse = Depends(get_current_user)):
    """Get current user's unlocked achievements"""
    profile_data = await db.user_profiles.find_one({"id": current_user.id})
    if not profile_data:
        return []
    
    profile = UserProfile(**profile_data)
    unlocked = []
    
    for achievement in addiction_engine.achievements:
        if achievement.id in profile.achievements:
            unlocked.append(achievement)
    
    return unlocked

@api_router.get("/user/{user_id}/achievements")
async def get_user_achievements(user_id: str):
    """Get user's unlocked achievements (public)"""
    profile_data = await db.user_profiles.find_one({"id": user_id})
    if not profile_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = UserProfile(**profile_data)
    unlocked = []
    
    for achievement in addiction_engine.achievements:
        if achievement.id in profile.achievements:
            unlocked.append(achievement)
    
    return unlocked

@api_router.get("/fomo/content")
async def get_fomo_content():
    """Get FOMO-inducing content"""
    # Simulate trending polls (in real app, this would be real data)
    trending_polls = [
        {"id": f"poll_{i}", "title": f"Encuesta Trending {i}", "total_votes": random.randint(100, 1000)}
        for i in range(10)
    ]
    
    fomo_content = addiction_engine.generate_fomo_content(trending_polls)
    
    # Save to database
    for content in fomo_content:
        await db.fomo_content.insert_one(content.dict())
    
    return fomo_content

@api_router.get("/social-proof/{poll_id}")
async def get_social_proof(poll_id: str):
    """Get social proof data for a poll"""
    social_proof = addiction_engine.generate_social_proof(poll_id)
    await db.social_proof.insert_one(social_proof.dict())
    return social_proof

@api_router.post("/notifications/generate")
async def generate_smart_notifications(current_user: UserResponse = Depends(get_current_user)):
    """Generate AI-powered notifications for current user"""
    # Get user profile and behavior
    profile_data = await db.user_profiles.find_one({"id": current_user.id})
    if not profile_data:
        raise HTTPException(status_code=404, detail="User profile not found")
    
    profile = UserProfile(**profile_data)
    behaviors = await db.user_behavior.find({"user_id": current_user.id}).sort("timestamp", -1).limit(30).to_list(30)
    
    # Generate smart notifications
    notifications = addiction_engine.generate_smart_notifications(profile, behaviors)
    
    # Save notifications
    for notification in notifications:
        await db.push_notifications.insert_one(notification.dict())
    
    return {
        "generated_notifications": len(notifications),
        "notifications": notifications
    }

@api_router.post("/notifications/generate/{user_id}")
async def generate_smart_notifications_admin(user_id: str):
    """Generate AI-powered notifications for user (admin endpoint)"""
    # Get user profile and behavior
    profile_data = await db.user_profiles.find_one({"id": user_id})
    if not profile_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = UserProfile(**profile_data)
    behaviors = await db.user_behavior.find({"user_id": user_id}).sort("timestamp", -1).limit(30).to_list(30)
    
    # Generate smart notifications
    notifications = addiction_engine.generate_smart_notifications(profile, behaviors)
    
    # Save notifications
    for notification in notifications:
        await db.push_notifications.insert_one(notification.dict())
    
    return {
        "generated_notifications": len(notifications),
        "notifications": notifications
    }

@api_router.get("/leaderboard")
async def get_leaderboard():
    """Get top users leaderboard"""
    # Get top users by XP
    top_users = await db.user_profiles.find().sort("xp", -1).limit(50).to_list(50)
    
    leaderboard = []
    for i, user_data in enumerate(top_users):
        user = UserProfile(**user_data)
        leaderboard.append({
            "rank": i + 1,
            "user_id": user.id,
            "username": user.username,
            "level": user.level,
            "xp": user.xp,
            "streak": user.current_streak,
            "achievements": len(user.achievements)
        })
    
    return leaderboard

@api_router.get("/analytics/addiction/{user_id}")
async def get_addiction_analytics(user_id: str):
    """Get detailed addiction analytics for user"""
    # Get user behavior over last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    behaviors = await db.user_behavior.find({
        "user_id": user_id,
        "timestamp": {"$gte": thirty_days_ago}
    }).sort("timestamp", -1).to_list(1000)
    
    if not behaviors:
        return {"message": "No data available"}
    
    # Calculate detailed metrics
    addiction_score = addiction_engine.calculate_addiction_score(behaviors)
    total_sessions = len(behaviors)
    avg_session_time = sum(b['session_duration'] for b in behaviors) / total_sessions if total_sessions > 0 else 0
    total_interactions = sum(b['polls_viewed'] + b['polls_voted'] + b['likes_given'] for b in behaviors)
    
    # Get dopamine hits
    dopamine_hits = await db.dopamine_hits.find({
        "user_id": user_id,
        "timestamp": {"$gte": thirty_days_ago}
    }).sort("timestamp", -1).to_list(1000)
    
    analytics = {
        "addiction_score": addiction_score,
        "total_sessions": total_sessions,
        "avg_session_time_minutes": avg_session_time / 60,
        "total_interactions": total_interactions,
        "dopamine_hits_count": len(dopamine_hits),
        "addiction_level": "addicted" if addiction_score > 80 else "high" if addiction_score > 60 else "medium" if addiction_score > 30 else "low",
        "retention_probability": min(addiction_score / 100, 0.95),
        "engagement_trend": "increasing" if addiction_score > 70 else "stable" if addiction_score > 40 else "declining"
    }
    
    return analytics

# Special endpoint to trigger massive dopamine hit (use sparingly!)
@api_router.post("/user/{user_id}/jackpot")
async def trigger_jackpot(user_id: str):
    """Trigger rare jackpot reward for maximum addiction"""
    profile_data = await db.user_profiles.find_one({"id": user_id})
    if not profile_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = UserProfile(**profile_data)
    
    # Massive XP bonus
    jackpot_xp = random.randint(500, 2000)
    profile.xp += jackpot_xp
    
    # Multiple rare rewards
    rare_rewards = ["diamond_badge", "platinum_crown", "legendary_avatar", "exclusive_emoji_pack"]
    selected_rewards = random.sample(rare_rewards, k=min(3, len(rare_rewards)))
    
    # Add special achievement
    jackpot_achievement = Achievement(
        name="💎 JACKPOT WINNER 💎",
        description="Won the ultra-rare jackpot!",
        icon="💎",
        type=AchievementType.SPECIAL,
        requirement={},
        xp_reward=jackpot_xp,
        rarity="legendary"
    )
    
    profile.achievements.append(jackpot_achievement.id)
    await db.user_profiles.replace_one({"id": user_id}, profile.dict())
    
    # Create massive dopamine hit
    dopamine_hit = addiction_engine.trigger_dopamine_hit(
        user_id, "rare_reward",
        {
            "jackpot": True,
            "xp_bonus": jackpot_xp,
            "rare_rewards": selected_rewards,
            "achievement": jackpot_achievement.name
        }
    )
    await db.dopamine_hits.insert_one(dopamine_hit.dict())
    
    return {
        "JACKPOT": True,
        "xp_bonus": jackpot_xp,
        "rare_rewards": selected_rewards,
        "achievement": jackpot_achievement,
        "new_level": int((profile.xp / 100) ** 0.5) + 1,
        "message": "🎉 ¡JACKPOT! ¡Has ganado el premio más raro de la app! 🎉"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
