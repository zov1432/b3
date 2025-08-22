from pydantic import BaseModel, Field, EmailStr
from typing import List, Dict, Optional, Any
from datetime import datetime, date
from enum import Enum
import uuid

class NotificationType(str, Enum):
    NEW_POLL = "new_poll"
    TRENDING = "trending"
    COMPETITION = "competition"

# User Profile - Simplified without levels/achievements
class UserProfile(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    total_votes: int = 0
    total_polls_created: int = 0
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# =============  AUTHENTICATION MODELS =============

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    username: str
    display_name: str
    hashed_password: Optional[str] = None  # Allow None for OAuth users
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    is_verified: bool = False
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    # Privacy settings
    is_public: bool = True
    allow_messages: bool = True
    # OAuth fields
    oauth_provider: Optional[str] = None  # "google", "facebook", etc.
    oauth_id: Optional[str] = None
    
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    display_name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    display_name: str
    avatar_url: Optional[str] = None
    bio: Optional[str] = None
    is_verified: bool
    created_at: datetime
    last_login: Optional[datetime] = None
    is_public: bool
    allow_messages: bool

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user: UserResponse

class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class UserSettings(BaseModel):
    is_public: Optional[bool] = None
    allow_messages: Optional[bool] = None

# =============  SECURITY MODELS =============

class LoginAttempt(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    ip_address: str
    user_agent: str
    success: bool
    failure_reason: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserDevice(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    device_name: str
    device_type: str  # "desktop", "mobile", "tablet"
    browser: str
    os: str
    ip_address: str
    user_agent: str
    last_used: datetime = Field(default_factory=datetime.utcnow)
    is_trusted: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserSession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_token: str
    device_id: Optional[str] = None
    ip_address: str
    user_agent: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class SecurityNotification(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    notification_type: str  # "new_login", "password_change", "new_device"
    title: str
    message: str
    metadata: Dict[str, Any] = {}
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

# =============  MESSAGING MODELS =============

class Message(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    conversation_id: str
    sender_id: str
    recipient_id: str
    content: str
    message_type: str = "text"  # text, image, poll_share, etc.
    metadata: Dict[str, Any] = {}  # for attachments, poll links, etc.
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class MessageCreate(BaseModel):
    recipient_id: str
    content: str
    message_type: str = "text"
    metadata: Dict[str, Any] = {}

class Conversation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    participants: List[str]  # user_ids
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread_count: Dict[str, int] = {}  # user_id -> unread count
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ConversationResponse(BaseModel):
    id: str
    participants: List[UserResponse]
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    unread_count: int = 0
    created_at: datetime

# =============  FOLLOW MODELS =============

class Follow(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    follower_id: str  # ID del usuario que sigue
    following_id: str  # ID del usuario seguido
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FollowCreate(BaseModel):
    user_id: str  # ID del usuario a seguir

class FollowResponse(BaseModel):
    id: str
    follower: UserResponse
    following: UserResponse
    created_at: datetime

class FollowStatus(BaseModel):
    is_following: bool
    follow_id: Optional[str] = None

class FollowingList(BaseModel):
    following: List[UserResponse]
    total: int

class FollowersList(BaseModel):
    followers: List[UserResponse]
    total: int

# =============  COMMENT MODELS =============

class Comment(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    poll_id: str  # ID de la encuesta a la que pertenece el comentario
    user_id: str  # ID del usuario que creó el comentario
    content: str  # Contenido del comentario
    parent_comment_id: Optional[str] = None  # ID del comentario padre (para anidamiento)
    likes: int = 0  # Número de likes en el comentario
    is_edited: bool = False  # Si el comentario ha sido editado
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    # Metadata adicional
    metadata: Dict[str, Any] = {}  # Para menciones, hashtags, etc.

class CommentCreate(BaseModel):
    poll_id: str
    content: str
    parent_comment_id: Optional[str] = None

class CommentUpdate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: str
    poll_id: str
    user: UserResponse  # Información completa del usuario
    content: str
    parent_comment_id: Optional[str] = None
    likes: int = 0
    is_edited: bool = False
    created_at: datetime
    updated_at: datetime
    # Para anidamiento
    replies: List["CommentResponse"] = []  # Lista de comentarios hijos
    reply_count: int = 0  # Conteo total de respuestas anidadas
    user_liked: bool = False  # Si el usuario actual le dio like

class CommentLike(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    comment_id: str
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Necesario para resolver referencia circular
CommentResponse.model_rebuild()