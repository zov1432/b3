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
    Message, MessageCreate, Conversation, ConversationResponse,
    UserUpdate, PasswordChange, UserSettings,
    Comment, CommentCreate, CommentUpdate, CommentResponse, CommentLike,
    Follow, FollowCreate, FollowResponse, FollowStatus, FollowingList, FollowersList
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

# =============  USER UPDATE ENDPOINTS =============

@api_router.put("/auth/profile", response_model=UserResponse)
async def update_profile(
    user_data: UserUpdate, 
    current_user: UserResponse = Depends(get_current_user)
):
    """Update user profile information"""
    update_fields = {}
    
    if user_data.display_name is not None:
        update_fields["display_name"] = user_data.display_name.strip()
    if user_data.bio is not None:
        update_fields["bio"] = user_data.bio.strip()
    if user_data.avatar_url is not None:
        update_fields["avatar_url"] = user_data.avatar_url.strip()
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Update user in database
    result = await db.users.update_one(
        {"id": current_user.id},
        {"$set": update_fields}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return updated user
    updated_user = await db.users.find_one({"id": current_user.id})
    return UserResponse(**updated_user)

@api_router.put("/auth/password")
async def change_password(
    password_data: PasswordChange,
    current_user: UserResponse = Depends(get_current_user)
):
    """Change user password"""
    # Get current user with password
    user_data = await db.users.find_one({"id": current_user.id})
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify current password
    if not verify_password(password_data.current_password, user_data["hashed_password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    
    # Hash new password
    new_hashed_password = get_password_hash(password_data.new_password)
    
    # Update password in database
    result = await db.users.update_one(
        {"id": current_user.id},
        {"$set": {"hashed_password": new_hashed_password}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update password")
    
    return {"message": "Password updated successfully"}

@api_router.put("/auth/settings", response_model=UserResponse)
async def update_settings(
    settings_data: UserSettings,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update user privacy settings"""
    update_fields = {}
    
    if settings_data.is_public is not None:
        update_fields["is_public"] = settings_data.is_public
    if settings_data.allow_messages is not None:
        update_fields["allow_messages"] = settings_data.allow_messages
    
    if not update_fields:
        raise HTTPException(status_code=400, detail="No settings to update")
    
    # Update user settings in database
    result = await db.users.update_one(
        {"id": current_user.id},
        {"$set": update_fields}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Return updated user
    updated_user = await db.users.find_one({"id": current_user.id})
    return UserResponse(**updated_user)

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

# =============  FOLLOW ENDPOINTS =============

@api_router.post("/users/{user_id}/follow")
async def follow_user(user_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Follow a user"""
    # Check if user to follow exists
    user_to_follow = await db.users.find_one({"id": user_id})
    if not user_to_follow:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user is trying to follow themselves
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot follow yourself")
    
    # Check if already following
    existing_follow = await db.follows.find_one({
        "follower_id": current_user.id,
        "following_id": user_id
    })
    if existing_follow:
        raise HTTPException(status_code=400, detail="Already following this user")
    
    # Create follow relationship
    follow_data = Follow(
        follower_id=current_user.id,
        following_id=user_id
    )
    
    result = await db.follows.insert_one(follow_data.model_dump())
    if not result.inserted_id:
        raise HTTPException(status_code=500, detail="Failed to follow user")
    
    return {"message": "Successfully followed user", "follow_id": follow_data.id}

@api_router.delete("/users/{user_id}/follow")
async def unfollow_user(user_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Unfollow a user"""
    # Find and delete follow relationship
    result = await db.follows.delete_one({
        "follower_id": current_user.id,
        "following_id": user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Follow relationship not found")
    
    return {"message": "Successfully unfollowed user"}

@api_router.get("/users/{user_id}/follow-status")
async def get_follow_status(user_id: str, current_user: UserResponse = Depends(get_current_user)):
    """Get follow status for a specific user"""
    follow_relationship = await db.follows.find_one({
        "follower_id": current_user.id,
        "following_id": user_id
    })
    
    return FollowStatus(
        is_following=follow_relationship is not None,
        follow_id=follow_relationship["id"] if follow_relationship else None
    )

@api_router.get("/users/following")
async def get_following_users(current_user: UserResponse = Depends(get_current_user)):
    """Get list of users that current user is following"""
    follows = await db.follows.find({"follower_id": current_user.id}).to_list(1000)
    
    following_ids = [follow["following_id"] for follow in follows]
    users = await db.users.find({"id": {"$in": following_ids}}).to_list(1000)
    
    return FollowingList(
        following=[UserResponse(**user) for user in users],
        total=len(users)
    )

@api_router.get("/users/{user_id}/followers")
async def get_user_followers(user_id: str):
    """Get list of users following the specified user"""
    follows = await db.follows.find({"following_id": user_id}).to_list(1000)
    
    follower_ids = [follow["follower_id"] for follow in follows]
    users = await db.users.find({"id": {"$in": follower_ids}}).to_list(1000)
    
    return FollowersList(
        followers=[UserResponse(**user) for user in users],
        total=len(users)
    )

@api_router.get("/users/{user_id}/following")
async def get_user_following(user_id: str):
    """Get list of users that specified user is following"""
    follows = await db.follows.find({"follower_id": user_id}).to_list(1000)
    
    following_ids = [follow["following_id"] for follow in follows]
    users = await db.users.find({"id": {"$in": following_ids}}).to_list(1000)
    
    return FollowingList(
        following=[UserResponse(**user) for user in users],
        total=len(users)
    )

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

# =============  COMMENT ENDPOINTS =============

@api_router.post("/polls/{poll_id}/comments", response_model=CommentResponse)
async def create_comment(
    poll_id: str,
    comment_data: CommentCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Create a new comment on a poll"""
    # Verificar que el poll_id coincida con el de los datos
    if comment_data.poll_id != poll_id:
        raise HTTPException(status_code=400, detail="Poll ID mismatch")
    
    # Si es una respuesta, verificar que el comentario padre existe
    if comment_data.parent_comment_id:
        parent_comment = await db.comments.find_one({
            "id": comment_data.parent_comment_id,
            "poll_id": poll_id
        })
        if not parent_comment:
            raise HTTPException(status_code=404, detail="Parent comment not found")
    
    # Crear el comentario
    comment = Comment(
        poll_id=poll_id,
        user_id=current_user.id,
        content=comment_data.content.strip(),
        parent_comment_id=comment_data.parent_comment_id
    )
    
    # Insertar en la base de datos
    await db.comments.insert_one(comment.dict())
    
    # Retornar el comentario creado con información del usuario
    return CommentResponse(
        **comment.dict(),
        user=current_user,
        replies=[],
        reply_count=0,
        user_liked=False
    )

@api_router.get("/polls/{poll_id}/comments")
async def get_poll_comments(
    poll_id: str,
    limit: int = 50,
    offset: int = 0,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get comments for a specific poll with nested structure"""
    
    # Obtener todos los comentarios del poll
    comments_cursor = db.comments.find({
        "poll_id": poll_id
    }).sort("created_at", 1)  # Orden cronológico
    
    all_comments = await comments_cursor.to_list(1000)  # Límite alto para obtener todos
    
    if not all_comments:
        return []
    
    # Obtener información de usuarios únicos
    user_ids = list(set(comment["user_id"] for comment in all_comments))
    users_cursor = db.users.find({"id": {"$in": user_ids}})
    users_list = await users_cursor.to_list(len(user_ids))
    users_dict = {user["id"]: UserResponse(**user) for user in users_list}
    
    # Obtener likes del usuario actual para cada comentario
    comment_ids = [comment["id"] for comment in all_comments]
    user_likes = await db.comment_likes.find({
        "comment_id": {"$in": comment_ids},
        "user_id": current_user.id
    }).to_list(len(comment_ids))
    
    liked_comments = set(like["comment_id"] for like in user_likes)
    
    # Crear diccionario de comentarios
    comments_dict = {}
    root_comments = []
    
    # Construir estructura anidada
    for comment_data in all_comments:
        comment_resp = CommentResponse(
            **comment_data,
            user=users_dict.get(comment_data["user_id"]),
            replies=[],
            reply_count=0,
            user_liked=comment_data["id"] in liked_comments
        )
        
        comments_dict[comment_data["id"]] = comment_resp
        
        if comment_data["parent_comment_id"] is None:
            root_comments.append(comment_resp)
    
    # Construir jerarquía de respuestas
    for comment_data in all_comments:
        if comment_data["parent_comment_id"]:
            parent = comments_dict.get(comment_data["parent_comment_id"])
            child = comments_dict.get(comment_data["id"])
            if parent and child:
                parent.replies.append(child)
    
    # Calcular conteos de respuestas anidadas recursivamente
    def calculate_reply_count(comment):
        count = len(comment.replies)
        for reply in comment.replies:
            count += calculate_reply_count(reply)
        comment.reply_count = count
        return count
    
    for comment in root_comments:
        calculate_reply_count(comment)
    
    # Aplicar paginación solo a comentarios raíz
    paginated_comments = root_comments[offset:offset + limit]
    
    return paginated_comments

@api_router.put("/comments/{comment_id}", response_model=CommentResponse)
async def update_comment(
    comment_id: str,
    comment_data: CommentUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    """Update a comment (only by the comment author)"""
    
    # Verificar que el comentario existe y pertenece al usuario
    comment = await db.comments.find_one({
        "id": comment_id,
        "user_id": current_user.id
    })
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found or not authorized")
    
    # Actualizar el comentario
    update_data = {
        "content": comment_data.content.strip(),
        "is_edited": True,
        "updated_at": datetime.utcnow()
    }
    
    result = await db.comments.update_one(
        {"id": comment_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Failed to update comment")
    
    # Obtener el comentario actualizado
    updated_comment = await db.comments.find_one({"id": comment_id})
    
    return CommentResponse(
        **updated_comment,
        user=current_user,
        replies=[],
        reply_count=0,
        user_liked=False
    )

@api_router.delete("/comments/{comment_id}")
async def delete_comment(
    comment_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Delete a comment (only by the comment author)"""
    
    # Verificar que el comentario existe y pertenece al usuario
    comment = await db.comments.find_one({
        "id": comment_id,
        "user_id": current_user.id
    })
    
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found or not authorized")
    
    # Eliminar el comentario y todas sus respuestas recursivamente
    await delete_comment_recursive(comment_id)
    
    return {"message": "Comment deleted successfully"}

async def delete_comment_recursive(comment_id: str):
    """Función auxiliar para eliminar comentarios de forma recursiva"""
    
    # Encontrar todos los comentarios hijos
    child_comments = await db.comments.find({"parent_comment_id": comment_id}).to_list(1000)
    
    # Eliminar recursivamente los comentarios hijos
    for child in child_comments:
        await delete_comment_recursive(child["id"])
    
    # Eliminar likes del comentario
    await db.comment_likes.delete_many({"comment_id": comment_id})
    
    # Eliminar el comentario principal
    await db.comments.delete_one({"id": comment_id})

@api_router.post("/comments/{comment_id}/like")
async def toggle_comment_like(
    comment_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Toggle like on a comment"""
    
    # Verificar que el comentario existe
    comment = await db.comments.find_one({"id": comment_id})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Verificar si ya existe el like
    existing_like = await db.comment_likes.find_one({
        "comment_id": comment_id,
        "user_id": current_user.id
    })
    
    if existing_like:
        # Quitar like
        await db.comment_likes.delete_one({
            "comment_id": comment_id,
            "user_id": current_user.id
        })
        
        # Decrementar contador de likes
        await db.comments.update_one(
            {"id": comment_id},
            {"$inc": {"likes": -1}}
        )
        
        # Obtener nuevo conteo
        updated_comment = await db.comments.find_one({"id": comment_id})
        
        return {
            "liked": False,
            "likes": updated_comment["likes"]
        }
    else:
        # Agregar like
        like = CommentLike(
            comment_id=comment_id,
            user_id=current_user.id
        )
        
        await db.comment_likes.insert_one(like.dict())
        
        # Incrementar contador de likes
        await db.comments.update_one(
            {"id": comment_id},
            {"$inc": {"likes": 1}}
        )
        
        # Obtener nuevo conteo
        updated_comment = await db.comments.find_one({"id": comment_id})
        
        return {
            "liked": True,
            "likes": updated_comment["likes"]
        }

@api_router.get("/comments/{comment_id}")
async def get_comment(
    comment_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    """Get a specific comment with its replies"""
    
    comment = await db.comments.find_one({"id": comment_id})
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Obtener información del usuario
    user_data = await db.users.find_one({"id": comment["user_id"]})
    if not user_data:
        raise HTTPException(status_code=404, detail="Comment author not found")
    
    user = UserResponse(**user_data)
    
    # Verificar si el usuario actual le dio like
    user_like = await db.comment_likes.find_one({
        "comment_id": comment_id,
        "user_id": current_user.id
    })
    
    # Obtener respuestas directas
    replies_cursor = db.comments.find({
        "parent_comment_id": comment_id
    }).sort("created_at", 1)
    
    replies_data = await replies_cursor.to_list(100)
    
    # Procesar respuestas
    replies = []
    for reply_data in replies_data:
        reply_user_data = await db.users.find_one({"id": reply_data["user_id"]})
        if reply_user_data:
            reply_user_like = await db.comment_likes.find_one({
                "comment_id": reply_data["id"],
                "user_id": current_user.id
            })
            
            reply = CommentResponse(
                **reply_data,
                user=UserResponse(**reply_user_data),
                replies=[],  # Por ahora solo 2 niveles
                reply_count=0,
                user_liked=bool(reply_user_like)
            )
            replies.append(reply)
    
    return CommentResponse(
        **comment,
        user=user,
        replies=replies,
        reply_count=len(replies),
        user_liked=bool(user_like)
    )

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