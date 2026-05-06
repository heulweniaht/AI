from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt

from app.core.config import settings

security = HTTPBearer()


class TokenData:
    def __init__(self, user_id: int, email: str, role: str):
        self.user_id = user_id
        self.email   = email
        self.role    = role


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> TokenData:
    """
    Verify JWT token được tạo bởi Spring Auth Service.
    AI Service chỉ verify, không tạo token.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        user_id: int = payload.get("userId")
        email:   str = payload.get("sub")
        role:    str = payload.get("role")

        if not user_id or not email:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token payload không hợp lệ"
            )
        return TokenData(user_id=user_id, email=email, role=role)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token không hợp lệ: {str(e)}"
        )


# Optional auth (cho endpoint public nhưng có personalization khi login)
async def optional_token(
    credentials: HTTPAuthorizationCredentials = Depends(
        HTTPBearer(auto_error=False))
) -> TokenData | None:
    if not credentials:
        return None
    try:
        return await verify_token(credentials)
    except HTTPException:
        return None
