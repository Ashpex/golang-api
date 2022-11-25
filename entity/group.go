package entity

type Group struct {
	ID          uint64  `gorm:"primary_key:auto_increment" json:"id"`
	Name        string  `gorm:"type:varchar(255)" json:"name"`
	Description string  `gorm:"type:varchar(255)" json:"description"`
	Users       *[]User `gorm:"many2many:user_groups" json:"users,omitempty"`
}

type UserGroup struct {
	UserID  uint64 `gorm:"primary_key" json:"user_id"`
	GroupID uint64 `gorm:"primary_key" json:"group_id"`
	Role    string `gorm:"type:varchar(255)" json:"role"`
	User    User   `gorm:"foreignKey:UserID" json:"user"`
	Group   Group  `gorm:"foreignKey:GroupID" json:"group"`
}
