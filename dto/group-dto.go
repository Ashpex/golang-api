package dto

type GroupUpdateDTO struct {
	ID          uint64 `json:"id" form:"id" binding:"required"`
	Name        string `json:"name" form:"name" binding:"required"`
	Description string `json:"description" form:"description" binding:"required"`
	UserID      uint64 `json:"user_id,omitempty" form:"user_id, omitempty"`
}

type GroupCreateDTO struct {
	Name        string `json:"name" form:"name" binding:"required"`
	Description string `json:"description" form:"description" binding:"required"`
	UserID      uint64 `json:"user_id,omitempty" form:"user_id, omitempty"`
}

type GroupInfoDTO struct {
	ID          uint64        `json:"id"`
	Name        string        `json:"name"`
	Description string        `json:"description"`
	Users       []UserInfoDTO `json:"users"`
}

type AssignRoleDTO struct {
	UserID  uint64 `json:"user_id" form:"user_id" binding:"required"`
	GroupID uint64 `json:"group_id" form:"group_id" binding:"required"`
	Role    string `json:"role" form:"role" binding:"required"`
}
