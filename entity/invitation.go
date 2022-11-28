package entity

type Invitation struct {
	ID             uint64 `gorm:"primary_key:auto_increment" json:"id"`
	Email          string `gorm:"type:varchar(255)" json:"email"`
	GroupID        uint64 `gorm:"not null" json:"group_id"`
	UserID         uint64 `gorm:"default:null" json:"user_id"`
	Group          Group  `gorm:"foreignKey:GroupID" json:"group,omitempty"`
	User           User   `gorm:"foreignKey:UserID" json:"user,omitempty"`
	InvitationCode string `gorm:"->;<-;not null" json:"-"`
	CreatedAt      string `gorm:"->;<-;not null" json:"-"`
	DeletedAt      string `gorm:"->;<-;default:null" json:"-"`
}
