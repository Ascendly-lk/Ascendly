"""
Conversation management — GET/POST/PATCH/DELETE /api/conversations
Stores chat threads and their messages for the AI Assistant.
"""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Literal
from database.supabase_client import require_auth, get_supabase_admin

router = APIRouter(prefix="/api/conversations", tags=["Conversations"])


class ConversationCreate(BaseModel):
    title: Optional[str] = "New Conversation"
    dataset_id: Optional[str] = None


class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    dataset_id: Optional[str] = None


class MessageCreate(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    msg_type: Literal["text", "c1", "error"] = "text"
    metadata: Optional[dict] = {}


@router.get("")
async def list_conversations(current_user=Depends(require_auth)):
    admin = get_supabase_admin()
    res = (
        admin.table("conversations")
        .select("id,title,dataset_id,created_at,updated_at")
        .eq("user_id", str(current_user.id))
        .order("updated_at", desc=True)
        .limit(50)
        .execute()
    )
    return {"conversations": res.data or []}


@router.post("")
async def create_conversation(body: ConversationCreate, current_user=Depends(require_auth)):
    admin = get_supabase_admin()
    res = admin.table("conversations").insert({
        "user_id": str(current_user.id),
        "title": body.title,
        "dataset_id": body.dataset_id,
    }).execute()
    return res.data[0] if res.data else {}


@router.get("/{conversation_id}/messages")
async def get_messages(conversation_id: str, current_user=Depends(require_auth)):
    admin = get_supabase_admin()
    conv = admin.table("conversations").select("id").eq("id", conversation_id).eq("user_id", str(current_user.id)).execute()
    if not conv.data:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    msgs = (
        admin.table("chat_messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at")
        .execute()
    )
    return {"messages": msgs.data or []}


@router.post("/{conversation_id}/messages")
async def append_message(conversation_id: str, body: MessageCreate, current_user=Depends(require_auth)):
    admin = get_supabase_admin()
    conv = admin.table("conversations").select("id").eq("id", conversation_id).eq("user_id", str(current_user.id)).execute()
    if not conv.data:
        raise HTTPException(status_code=404, detail="Conversation not found.")
    res = admin.table("chat_messages").insert({
        "conversation_id": conversation_id,
        "role": body.role,
        "content": body.content,
        "msg_type": body.msg_type,
        "metadata": body.metadata or {},
    }).execute()
    admin.table("conversations").update({"updated_at": datetime.now(timezone.utc).isoformat()}).eq("id", conversation_id).execute()
    return res.data[0] if res.data else {}


@router.patch("/{conversation_id}")
async def update_conversation(conversation_id: str, body: ConversationUpdate, current_user=Depends(require_auth)):
    admin = get_supabase_admin()
    updates = {k: v for k, v in body.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="Nothing to update.")
    res = (
        admin.table("conversations")
        .update(updates)
        .eq("id", conversation_id)
        .eq("user_id", str(current_user.id))
        .execute()
    )
    return res.data[0] if res.data else {}


@router.delete("/{conversation_id}")
async def delete_conversation(conversation_id: str, current_user=Depends(require_auth)):
    admin = get_supabase_admin()
    admin.table("conversations").delete().eq("id", conversation_id).eq("user_id", str(current_user.id)).execute()
    return {"deleted": True}
