import random
import math
from datetime import datetime, timedelta, date
from typing import List, Dict, Tuple, Optional
from models import (
    UserProfile, AddictionMetrics, Achievement, UserStreak, 
    RewardEvent, FOMOContent, PushNotification, NotificationType,
    SocialProof, DopamineHit, AchievementType
)

class AddictionEngine:
    """
    Ultra-addictive algorithm engine that surpasses TikTok's engagement
    """
    
    def __init__(self):
        self.dopamine_triggers = {
            'vote': [5, 10, 15, 25, 50, 100],  # XP rewards with variable amounts
            'create': [20, 25, 30, 40, 75, 150],
            'share': [3, 5, 8, 12, 20],
            'daily_login': [10, 15, 20, 30, 50],
            'streak_bonus': [1.2, 1.5, 2.0, 3.0, 5.0]  # multipliers
        }
        
        self.achievements = self._init_achievements()
        self.fomo_messages = [
            "¡{count} personas están votando ahora mismo!",
            "¡Esta encuesta es tendencia! {count} votos en la última hora",
            "⚡ ¡Votación viral! {count} participantes activos",
            "🔥 ¡TRENDING! {count} personas no se lo quieren perder"
        ]

    def _init_achievements(self) -> List[Achievement]:
        """Initialize all possible achievements"""
        return [
            # Voting achievements
            Achievement(
                name="Primer Voto", description="Tu primera votación", icon="🎉",
                type=AchievementType.VOTER, requirement={"votes": 1}, xp_reward=10, rarity="common"
            ),
            Achievement(
                name="Votante Activo", description="100 votaciones", icon="🗳️",
                type=AchievementType.VOTER, requirement={"votes": 100}, xp_reward=100, rarity="rare"
            ),
            Achievement(
                name="Máquina de Votar", description="1000 votaciones", icon="⚡",
                type=AchievementType.VOTER, requirement={"votes": 1000}, xp_reward=500, rarity="epic"
            ),
            
            # Streak achievements
            Achievement(
                name="Racha de Fuego", description="7 días consecutivos", icon="🔥",
                type=AchievementType.STREAK, requirement={"streak": 7}, xp_reward=200, rarity="rare"
            ),
            Achievement(
                name="Imparable", description="30 días consecutivos", icon="💎",
                type=AchievementType.STREAK, requirement={"streak": 30}, xp_reward=1000, rarity="legendary"
            ),
            
            # Creator achievements
            Achievement(
                name="Creador", description="Primera encuesta creada", icon="✨",
                type=AchievementType.CREATOR, requirement={"polls_created": 1}, xp_reward=25, rarity="common"
            ),
            Achievement(
                name="Viral", description="Encuesta con 1000+ votos", icon="🚀",
                type=AchievementType.CREATOR, requirement={"poll_votes": 1000}, xp_reward=500, rarity="epic"
            ),
            
            # Hidden/Surprise achievements
            Achievement(
                name="Madrugador", description="Votar a las 3 AM", icon="🌙",
                type=AchievementType.SPECIAL, requirement={"hour": 3}, xp_reward=50, rarity="rare", hidden=True
            ),
            Achievement(
                name="Velocidad de Rayo", description="10 votos en 1 minuto", icon="⚡",
                type=AchievementType.SPECIAL, requirement={"votes_per_minute": 10}, xp_reward=75, rarity="epic", hidden=True
            ),
        ]

    def calculate_addiction_score(self, user_behavior: List[dict]) -> float:
        """Calculate user's addiction score (0-100)"""
        if not user_behavior:
            return 0.0
            
        # Analyze behavior patterns
        total_sessions = len(user_behavior)
        avg_session_time = sum(b['session_duration'] for b in user_behavior) / total_sessions / 60  # minutes
        total_interactions = sum(b['polls_viewed'] + b['polls_voted'] + b['likes_given'] for b in user_behavior)
        avg_interaction_rate = sum(b['interaction_rate'] for b in user_behavior) / total_sessions
        
        # Calculate frequency (sessions per day)
        if total_sessions > 1:
            date_range = (datetime.utcnow() - datetime.fromisoformat(user_behavior[0]['timestamp'].replace('Z', '+00:00'))).days or 1
            session_frequency = total_sessions / date_range
        else:
            session_frequency = 1
        
        # Addiction score components
        time_score = min(avg_session_time * 2, 30)  # Max 30 points for session time
        frequency_score = min(session_frequency * 10, 25)  # Max 25 points for frequency
        interaction_score = min(avg_interaction_rate * 25, 25)  # Max 25 points for interactions
        volume_score = min(total_interactions / 100, 20)  # Max 20 points for total interactions
        
        addiction_score = time_score + frequency_score + interaction_score + volume_score
        return min(addiction_score, 100.0)

    def generate_variable_reward(self, action: str, user_profile: UserProfile) -> RewardEvent:
        """Generate variable rewards like a slot machine"""
        base_rewards = self.dopamine_triggers.get(action, [10])
        
        # Variable reward algorithm - higher chance for small rewards, rare chance for jackpots
        reward_weights = [40, 30, 20, 7, 2, 1][:len(base_rewards)]
        selected_xp = random.choices(base_rewards, weights=reward_weights)[0]
        
        # Streak multiplier
        streak_multiplier = 1.0
        if user_profile.current_streak > 0:
            streak_multiplier = 1 + (user_profile.current_streak * 0.1)
        
        # Rare reward chance (1% for special items)
        rare_reward = None
        if random.random() < 0.01:  # 1% chance
            rare_rewards = ["golden_badge", "avatar_frame", "special_emoji", "crown_effect"]
            rare_reward = random.choice(rare_rewards)
            selected_xp *= 2  # Double XP for rare rewards
        
        return RewardEvent(
            user_id=user_profile.id,
            event_type=action,
            xp_gained=int(selected_xp * streak_multiplier),
            bonus_multiplier=streak_multiplier,
            rare_reward=rare_reward
        )

    def update_user_streak(self, user_id: str, activity_type: str) -> UserStreak:
        """Update user streak with psychological reinforcement"""
        # This would normally fetch from database
        streak = UserStreak(user_id=user_id, streak_type=activity_type)
        
        today = date.today()
        yesterday = today - timedelta(days=1)
        
        if streak.last_activity == yesterday:
            # Continue streak
            streak.current_count += 1
            streak.best_count = max(streak.best_count, streak.current_count)
        elif streak.last_activity == today:
            # Already active today
            return streak
        else:
            # Streak broken
            streak.current_count = 1
        
        streak.last_activity = today
        
        # Calculate streak multiplier (gets stronger over time)
        if streak.current_count >= 30:
            streak.multiplier = 3.0
        elif streak.current_count >= 14:
            streak.multiplier = 2.0
        elif streak.current_count >= 7:
            streak.multiplier = 1.5
        else:
            streak.multiplier = 1.0 + (streak.current_count * 0.1)
        
        return streak

    def generate_fomo_content(self, trending_polls: List[dict]) -> List[FOMOContent]:
        """Generate FOMO-inducing content"""
        fomo_content = []
        
        for poll in trending_polls[:5]:  # Top 5 trending
            expires_at = datetime.utcnow() + timedelta(hours=random.randint(2, 8))
            urgency = random.randint(3, 5)  # High urgency
            
            fomo_content.append(FOMOContent(
                poll_id=poll['id'],
                title=f"⚡ TRENDING: {poll['title'][:50]}...",
                expires_at=expires_at,
                max_participants=random.randint(500, 2000),
                current_participants=poll.get('total_votes', 0),
                is_trending=True,
                urgency_level=urgency
            ))
        
        return fomo_content

    def generate_smart_notifications(self, user_profile: UserProfile, user_behavior: List[dict]) -> List[PushNotification]:
        """Generate AI-powered notifications based on user patterns"""
        notifications = []
        now = datetime.utcnow()
        
        # Analyze user's peak hours
        peak_hours = self._analyze_peak_hours(user_behavior)
        optimal_time = now.replace(hour=peak_hours[0] if peak_hours else 19)
        
        # Streak reminder (high priority)
        if user_profile.current_streak > 0:
            notifications.append(PushNotification(
                user_id=user_profile.id,
                title=f"🔥 ¡{user_profile.current_streak} días de racha!",
                body="No rompas tu racha perfecta. ¡Vota ahora y mantenla!",
                type=NotificationType.STREAK_REMINDER,
                data={"streak": user_profile.current_streak},
                scheduled_for=optimal_time + timedelta(hours=23)
            ))
        
        # FOMO notifications
        if random.random() < 0.7:  # 70% chance
            notifications.append(PushNotification(
                user_id=user_profile.id,
                title="⚡ ¡No te lo pierdas!",
                body=f"{random.randint(200, 800)} personas están votando ahora mismo",
                type=NotificationType.FOMO,
                data={"urgency": "high"},
                scheduled_for=optimal_time + timedelta(minutes=random.randint(15, 120))
            ))
        
        # Level up teaser
        xp_to_next_level = self._calculate_xp_to_next_level(user_profile.xp, user_profile.level)
        if xp_to_next_level <= 50:
            notifications.append(PushNotification(
                user_id=user_profile.id,
                title="🚀 ¡Casi subes de nivel!",
                body=f"Solo te faltan {xp_to_next_level} XP para nivel {user_profile.level + 1}",
                type=NotificationType.LEVEL_UP,
                data={"xp_needed": xp_to_next_level},
                scheduled_for=optimal_time + timedelta(minutes=30)
            ))
        
        return notifications

    def generate_social_proof(self, poll_id: str) -> SocialProof:
        """Generate social proof data to increase engagement"""
        # Simulate active user data (in real app, this would be real data)
        active_voters = random.randint(50, 500)
        recent_voters = [f"user_{i}" for i in range(min(active_voters, 10))]
        
        # Calculate social pressure (higher = more addictive)
        momentum = random.uniform(1.2, 5.0)
        pressure_score = min(active_voters / 100 * momentum, 10.0)
        
        return SocialProof(
            poll_id=poll_id,
            active_voters_count=active_voters,
            recent_voters=recent_voters,
            trending_momentum=momentum,
            social_pressure_score=pressure_score
        )

    def trigger_dopamine_hit(self, user_id: str, trigger_type: str, context: dict) -> DopamineHit:
        """Track and optimize dopamine-triggering events"""
        intensity_map = {
            'level_up': 9,
            'rare_reward': 10,
            'achievement_unlock': 8,
            'streak_milestone': 7,
            'social_validation': 6,
            'surprise_bonus': 8
        }
        
        return DopamineHit(
            user_id=user_id,
            trigger_type=trigger_type,
            intensity=intensity_map.get(trigger_type, 5),
            context=context
        )

    def _analyze_peak_hours(self, user_behavior: List[dict]) -> List[int]:
        """Analyze when user is most active"""
        hour_counts = {}
        for behavior in user_behavior:
            hour = datetime.fromisoformat(behavior['timestamp'].replace('Z', '+00:00')).hour
            hour_counts[hour] = hour_counts.get(hour, 0) + 1
        
        # Return top 3 peak hours
        return sorted(hour_counts.keys(), key=lambda h: hour_counts[h], reverse=True)[:3]

    def _calculate_xp_to_next_level(self, current_xp: int, current_level: int) -> int:
        """Calculate XP needed for next level (exponential growth)"""
        next_level_xp = (current_level ** 2) * 100 + current_level * 50
        return max(0, next_level_xp - current_xp)

    def check_achievements(self, user_profile: UserProfile, action_context: dict) -> List[Achievement]:
        """Check if user unlocked any achievements"""
        unlocked = []
        
        for achievement in self.achievements:
            if achievement.id in user_profile.achievements:
                continue  # Already unlocked
            
            if self._meets_achievement_requirement(achievement, user_profile, action_context):
                unlocked.append(achievement)
        
        return unlocked

    def _meets_achievement_requirement(self, achievement: Achievement, user_profile: UserProfile, context: dict) -> bool:
        """Check if achievement requirement is met"""
        req = achievement.requirement
        
        if 'votes' in req:
            return user_profile.total_votes >= req['votes']
        elif 'polls_created' in req:
            return user_profile.total_polls_created >= req['polls_created']
        elif 'streak' in req:
            return user_profile.current_streak >= req['streak']
        elif 'hour' in req:
            return context.get('current_hour') == req['hour']
        elif 'votes_per_minute' in req:
            return context.get('votes_in_last_minute', 0) >= req['votes_per_minute']
        
        return False

# Global instance
addiction_engine = AddictionEngine()