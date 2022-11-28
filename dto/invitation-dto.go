package dto

type InvitationCreateDTO struct {
	GroupID uint64 `json:"group_id" form:"group_id" binding:"required"`
	Email   string `json:"email" form:"email" binding:"required"`
}
