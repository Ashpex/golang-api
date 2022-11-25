package entity

type Log struct {
	ID     uint64 `gorm:"primary_key:auto_increment" json:"id"`
	User   User   `gorm:"foreignKey:UserID" json:"user"`
	UserID uint64 `gorm:"not null" json:"user_id"`
	Action string `gorm:"type:varchar(255)" json:"action"`
}
