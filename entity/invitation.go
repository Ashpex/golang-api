package entity

type Invitation struct {
	ID             uint64 `gorm:"primary_key:auto_increment" json:"id"`
	Email          string `gorm:"uniqueIndex;type:varchar(255)" json:"email"`
	GroupID        uint64 `gorm:"not null" json:"group_id"`
	UserID         uint64 `gorm:"not null" json:"user_id"`
	Group          Group  `gorm:"foreignKey:GroupID" json:"group"`
	User           User   `gorm:"foreignKey:UserID" json:"user"`
	InvitationCode string `gorm:"->;<-;not null" json:"-"`
}
