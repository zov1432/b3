from fastapi import FastAPI, APIRouter, HTTPException
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

# Import addiction system
from models import (
    UserProfile, UserBehavior, AddictionMetrics, Achievement, UserStreak,
    RewardEvent, FOMOContent, PushNotification, SocialProof, DopamineHit,
    NotificationType, AchievementType
)
from addiction_engine import addiction_engine

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Ultra-Addictive Polling App", description="More addictive than TikTok")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

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
    return {"message": "Ultra-Addictive Polling API", "version": "2.0", "addiction_level": "Maximum"}

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
async def create_user_profile(username: str):
    """Create or get user profile with addiction tracking"""
    existing_user = await db.user_profiles.find_one({"username": username})
    if existing_user:
        return UserProfile(**existing_user)
    
    profile = UserProfile(username=username)
    await db.user_profiles.insert_one(profile.dict())
    
    # Create initial streak
    streak = UserStreak(user_id=profile.id, streak_type="daily_vote")
    await db.user_streaks.insert_one(streak.dict())
    
    return profile

@api_router.get("/user/profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile with real-time addiction metrics"""
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
async def track_user_action(action: UserAction):
    """Track user action and trigger addiction mechanics"""
    current_time = datetime.utcnow()
    current_hour = current_time.hour
    
    # Get user profile
    profile_data = await db.user_profiles.find_one({"id": action.user_id})
    if not profile_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    profile = UserProfile(**profile_data)
    
    # Generate variable reward
    reward = addiction_engine.generate_variable_reward(action.action_type, profile)
    
    # Update user stats
    if action.action_type == "vote":
        profile.total_votes += 1
        # Update streak
        streak_data = await db.user_streaks.find_one({"user_id": action.user_id, "streak_type": "daily_vote"})
        if streak_data:
            streak = addiction_engine.update_user_streak(action.user_id, "daily_vote")
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
                action.user_id, "achievement_unlock", 
                {"achievement": achievement.name, "xp_bonus": achievement.xp_reward}
            )
            await db.dopamine_hits.insert_one(dopamine_hit.dict())
    
    # Level up dopamine hit
    if new_level > old_level:
        dopamine_hit = addiction_engine.trigger_dopamine_hit(
            action.user_id, "level_up",
            {"old_level": old_level, "new_level": new_level}
        )
        await db.dopamine_hits.insert_one(dopamine_hit.dict())
    
    # Rare reward dopamine hit
    if reward.rare_reward:
        dopamine_hit = addiction_engine.trigger_dopamine_hit(
            action.user_id, "rare_reward",
            {"reward_type": reward.rare_reward, "xp_bonus": reward.xp_gained}
        )
        await db.dopamine_hits.insert_one(dopamine_hit.dict())
    
    # Update profile in database
    profile.last_activity = current_time
    await db.user_profiles.replace_one({"id": action.user_id}, profile.dict())
    
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
async def track_user_behavior(behavior: UserBehavior):
    """Track detailed user behavior for addiction analytics"""
    await db.user_behavior.insert_one(behavior.dict())
    
    # Calculate real-time addiction score
    recent_behaviors = await db.user_behavior.find({"user_id": behavior.user_id}).sort("timestamp", -1).limit(20).to_list(20)
    addiction_score = addiction_engine.calculate_addiction_score(recent_behaviors)
    
    return {
        "success": True,
        "addiction_score": addiction_score,
        "engagement_level": "addicted" if addiction_score > 80 else "high" if addiction_score > 60 else "medium" if addiction_score > 30 else "low"
    }

@api_router.get("/user/{user_id}/streaks")
async def get_user_streaks(user_id: str):
    """Get all user streaks"""
    streaks = await db.user_streaks.find({"user_id": user_id}).to_list(10)
    return [UserStreak(**streak) for streak in streaks]

@api_router.get("/achievements")
async def get_all_achievements():
    """Get all possible achievements"""
    return addiction_engine.achievements

@api_router.get("/user/{user_id}/achievements")
async def get_user_achievements(user_id: str):
    """Get user's unlocked achievements"""
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

@api_router.post("/notifications/generate/{user_id}")
async def generate_smart_notifications(user_id: str):
    """Generate AI-powered notifications for user"""
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
