from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime, date
from enum import Enum
import uuid

class NotificationType(str, Enum):
    STREAK_REMINDER = "streak_reminder"
    NEW_POLL = "new_poll"
    TRENDING = "trending"
    REWARD = "reward"
    LEVEL_UP = "level_up"
    COMPETITION = "competition"
    FOMO = "fomo"

class AchievementType(str, Enum):
    VOTER = "voter"
    CREATOR = "creator"
    SOCIAL = "social"
    STREAK = "streak"
    SPECIAL = "special"

# User Behavior Analytics Model
class UserBehavior(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_duration: int  # seconds
    polls_viewed: int
    polls_voted: int
    polls_created: int
    likes_given: int
    shares_made: int
    scroll_depth: float  # percentage
    interaction_rate: float
    peak_hours: List[int]  # hour of day (0-23)
    device_type: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# User Addiction Metrics
class AddictionMetrics(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    addiction_score: float  # 0-100
    engagement_level: str  # low, medium, high, addicted
    session_frequency: float  # sessions per day
    average_session_time: float  # minutes
    retention_probability: float  # 0-1
    churn_risk: float  # 0-1
    dopamine_triggers_hit: int
    fomo_susceptibility: float
    last_calculated: datetime = Field(default_factory=datetime.utcnow)

# User Profile with Addiction Features
class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    level: int = 1
    xp: int = 0
    total_votes: int = 0
    total_polls_created: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    daily_goal_completed: bool = False
    achievements: List[str] = []
    badges: List[str] = []
    addiction_metrics: Optional[AddictionMetrics] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Achievement Model
class Achievement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    icon: str
    type: AchievementType
    requirement: Dict[str, Any]  # {"votes": 100} or {"streak": 7}
    xp_reward: int
    rarity: str  # common, rare, epic, legendary
    hidden: bool = False  # surprise achievements

# Streak System
class UserStreak(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    streak_type: str  # daily_vote, daily_create, weekly_active
    current_count: int = 0
    best_count: int = 0
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    multiplier: float = 1.0  # streak bonus multiplier

# Variable Reward System
class RewardEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    event_type: str  # vote, create, share, daily_login
    xp_gained: int
    bonus_multiplier: float = 1.0
    rare_reward: Optional[str] = None  # special badge, avatar, etc.
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# FOMO Content System
class FOMOContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    poll_id: str
    title: str
    expires_at: datetime
    max_participants: Optional[int] = None
    current_participants: int = 0
    is_trending: bool = False
    urgency_level: int = 1  # 1-5, 5 being most urgent
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Push Notification Model
class PushNotification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    body: str
    type: NotificationType
    data: Dict[str, Any] = {}
    scheduled_for: datetime
    sent: bool = False
    opened: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Leaderboard Entry
class LeaderboardEntry(BaseModel):
    user_id: str
    username: str
    score: int
    rank: int
    badge: Optional[str] = None
    streak: int = 0
    level: int = 1

# Social Proof Data
class SocialProof(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    poll_id: str
    active_voters_count: int
    recent_voters: List[str]  # usernames
    trending_momentum: float
    social_pressure_score: float
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Dopamine Hit Tracker
class DopamineHit(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    trigger_type: str  # level_up, achievement, rare_reward, social_validation
    intensity: int  # 1-10
    context: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)