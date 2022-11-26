package entity

//User represents users table in database
type User struct {
	ID               uint64       `gorm:"primary_key:auto_increment" json:"id"`
	Name             string       `gorm:"type:varchar(255)" json:"name"`
	Email            string       `gorm:"uniqueIndex;type:varchar(255)" json:"email"`
	Password         string       `gorm:"->;<-;not null" json:"-"`
	VerificationCode string       `gorm:"->;<-;not null" json:"-"`
	Verified         bool         `gorm:"default:false" json:"verified"`
	Token            string       `gorm:"-" json:"token,omitempty"`
	UserGroups       *[]UserGroup `gorm:"foreignKey:UserID;references:ID" json:"user_groups,omitempty"`
}
