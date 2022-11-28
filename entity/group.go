package entity

type Group struct {
	ID          uint64       `gorm:"primary_key:auto_increment" json:"id"`
	Name        string       `gorm:"type:varchar(255)" json:"name"`
	Description string       `gorm:"type:varchar(255)" json:"description"`
	UsersGroup  *[]UserGroup `gorm:"foreignKey:GroupID;references:ID" json:"users_groups,omitempty"`
}

type UserGroup struct {
	UserID  uint64 `gorm:"primary_key;uniqueIndex:idx_userid_groupid_role" json:"user_id"`
	GroupID uint64 `gorm:"primary_key:uniqueIndex:idx_userid_groupid_role" json:"group_id"`
	Role    string `gorm:"type:varchar(255);uniqueIndex:idx_userid_groupid_role" json:"role"`
	User    User   `gorm:"foreignKey:ID;references:UserID" json:"user,omitempty"`
	Group   Group  `gorm:"foreignKey:ID;references:GroupID" json:"group,omitempty"`
}
