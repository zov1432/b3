#!/usr/bin/env python3
"""
Script to create sample polls in the database for testing
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
import uuid
import random

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'social_app')

sample_polls = [
    {
        "title": "¿Cuál es el mejor gameplay de hoy?",
        "description": "Vota por el mejor contenido gaming del día",
        "category": "gaming",
        "options": [
            {
                "text": "Epic Victory Royale! 🏆",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=800&fit=crop&crop=center",
                "thumbnail_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop&crop=center"
            },
            {
                "text": "Insane Headshot Streak! 🎯",
                "media_type": "image", 
                "media_url": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=800&fit=crop&crop=center",
                "thumbnail_url": "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=400&fit=crop&crop=center"
            },
            {
                "text": "Perfect Team Combo 💥",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=800&h=800&fit=crop&crop=center",
                "thumbnail_url": "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=400&h=400&fit=crop&crop=center"
            }
        ],
        "tags": ["gaming", "epic", "victory"],
        "votes_per_option": [89, 67, 54],
        "likes": 15620,
        "shares": 2340,
        "comments_count": 567,
        "is_featured": True,
        "created_days_ago": 0
    },
    {
        "title": "¿Cuál es la obra de arte más impresionante?",
        "description": "Vota por la mejor creación artística",
        "category": "art",
        "options": [
            {
                "text": "Futuristic Cyberpunk Art 🚀",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop&crop=center",
                "thumbnail_url": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&crop=center"
            },
            {
                "text": "Watercolor Dreams 🎨",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=800&fit=crop&crop=center",
                "thumbnail_url": "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop&crop=center"
            },
            {
                "text": "Street Art Revolution 🎯",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop&crop=center",
                "thumbnail_url": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&crop=center"
            }
        ],
        "tags": ["art", "creative", "design"],
        "votes_per_option": [156, 134, 98],
        "likes": 8945,
        "shares": 1876,
        "comments_count": 892,
        "is_featured": False,
        "created_days_ago": 1
    },
    {
        "title": "¿Cuál es la mejor coreografía viral?",
        "description": "Vota por el mejor baile del momento",
        "category": "dance",
        "options": [
            {
                "text": "Smooth Hip-Hop Moves 💃",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&h=800&fit=crop&crop=center",
                "thumbnail_url": "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop&crop=center"
            },
            {
                "text": "Epic Breakdance Battle 🔥",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=800&fit=crop&crop=center",
                "thumbnail_url": "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=400&fit=crop&crop=center"
            },
            {
                "text": "Latin Rhythm Fire 🌶️",
                "media_type": "image",
                "media_url": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&h=800&fit=crop&crop=center",
                "thumbnail_url": "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop&crop=center"
            }
        ],
        "tags": ["dance", "viral", "moves"],
        "votes_per_option": [234, 198, 167],
        "likes": 45230,
        "shares": 8965,
        "comments_count": 1234,
        "is_featured": True,
        "created_days_ago": 2
    }
]

async def create_sample_polls():
    """Create sample polls in the database"""
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    print("Creating sample polls...")
    
    # Get or create a sample user
    sample_user = await db.users.find_one({"username": "sample_creator"})
    if not sample_user:
        sample_user = {
            "id": str(uuid.uuid4()),
            "email": "sample@example.com",
            "username": "sample_creator",
            "display_name": "Sample Creator",
            "hashed_password": None,  # OAuth user
            "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
            "bio": "🎯 Creador de contenido | 📊 Fan de las votaciones | 🚀 Siempre innovando",
            "is_verified": True,
            "is_active": True,
            "created_at": datetime.utcnow(),
            "last_login": datetime.utcnow(),
            "is_public": True,
            "allow_messages": True,
            "oauth_provider": "google",
            "oauth_id": "sample_123"
        }
        await db.users.insert_one(sample_user)
        print("Created sample user")
    
    # Create sample option users
    option_users = []
    for i in range(10):
        user = {
            "id": str(uuid.uuid4()),
            "email": f"option_user_{i}@example.com",
            "username": f"option_user_{i}",
            "display_name": f"Option User {i+1}",
            "hashed_password": None,
            "avatar_url": f"https://images.unsplash.com/photo-1{500000000000 + i}?w=400&h=400&fit=crop&crop=face",
            "bio": f"Usuario de ejemplo {i+1}",
            "is_verified": random.choice([True, False]),
            "is_active": True,
            "created_at": datetime.utcnow() - timedelta(days=random.randint(1, 30)),
            "last_login": datetime.utcnow() - timedelta(hours=random.randint(1, 24)),
            "is_public": True,
            "allow_messages": True
        }
        
        existing = await db.users.find_one({"username": user["username"]})
        if not existing:
            await db.users.insert_one(user)
            option_users.append(user)
        else:
            option_users.append(existing)
    
    print(f"Created {len(option_users)} option users")
    
    # Create polls
    created_polls = 0
    for poll_data in sample_polls:
        # Check if poll already exists
        existing = await db.polls.find_one({"title": poll_data["title"]})
        if existing:
            print(f"Poll '{poll_data['title']}' already exists, skipping")
            continue
        
        # Create poll options with user assignments
        options = []
        for i, option_data in enumerate(poll_data["options"]):
            option_user = option_users[i % len(option_users)]
            option = {
                "id": str(uuid.uuid4()),
                "user_id": option_user["id"],
                "text": option_data["text"],
                "votes": poll_data["votes_per_option"][i],
                "media_type": option_data.get("media_type"),
                "media_url": option_data.get("media_url"),
                "thumbnail_url": option_data.get("thumbnail_url"),
                "created_at": datetime.utcnow()
            }
            options.append(option)
        
        # Calculate total votes
        total_votes = sum(poll_data["votes_per_option"])
        
        # Create poll
        created_at = datetime.utcnow() - timedelta(days=poll_data["created_days_ago"])
        poll = {
            "id": str(uuid.uuid4()),
            "title": poll_data["title"],
            "author_id": sample_user["id"],
            "description": poll_data.get("description"),
            "options": options,
            "total_votes": total_votes,
            "likes": poll_data["likes"],
            "shares": poll_data["shares"],
            "comments_count": poll_data["comments_count"],
            "music_id": None,
            "is_active": True,
            "created_at": created_at,
            "updated_at": created_at,
            "tags": poll_data["tags"],
            "category": poll_data["category"],
            "is_featured": poll_data["is_featured"]
        }
        
        await db.polls.insert_one(poll)
        created_polls += 1
        print(f"Created poll: {poll_data['title']}")
    
    print(f"Successfully created {created_polls} sample polls!")
    client.close()

if __name__ == "__main__":
    asyncio.run(create_sample_polls())