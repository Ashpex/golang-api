package repository

import (
	"golang-api/entity"
	"gorm.io/gorm"
)

type UserGroupRepository interface {
	CreateUserGroup(g entity.UserGroup) entity.UserGroup
	UpdateUserGroup(g entity.UserGroup) entity.UserGroup
	DeleteUserGroup(g entity.UserGroup)
	AllUserGroup() []entity.UserGroup
	FindUserGroupByID(userID uint64, groupID uint64) entity.UserGroup
	FindByGroupID(groupID uint64) []entity.UserGroup
	FindByUserID(userID uint64) []entity.UserGroup
}

type userGroupConnection struct {
	connection *gorm.DB
}

func NewUserGroupRepository(dbConnection *gorm.DB) UserGroupRepository {
	return &userGroupConnection{
		connection: dbConnection,
	}
}

func (db *userGroupConnection) CreateUserGroup(g entity.UserGroup) entity.UserGroup {
	db.connection.Save(&g)
	db.connection.Preload("User-Groups").Find(&g)
	return g
}

func (db *userGroupConnection) UpdateUserGroup(g entity.UserGroup) entity.UserGroup {
	db.connection.Save(&g)
	db.connection.Preload("Users").Find(&g)
	db.connection.Preload("Groups").Find(&g)
	return g
}

func (db *userGroupConnection) DeleteUserGroup(g entity.UserGroup) {
	db.connection.Delete(&g)
}

func (db *userGroupConnection) AllUserGroup() []entity.UserGroup {
	var userGroups []entity.UserGroup
	db.connection.Preload("Users").Find(&userGroups)
	return userGroups
}

func (db *userGroupConnection) FindUserGroupByID(userID uint64, groupID uint64) entity.UserGroup {
	var userGroup entity.UserGroup
	db.connection.Preload("Users").Preload("Groups").Where("user_id = ? AND group_id = ?", userID, groupID).Find(&userGroup)
	return userGroup
}

func (db *userGroupConnection) FindByGroupID(groupID uint64) []entity.UserGroup {
	var userGroups []entity.UserGroup
	db.connection.Preload("Users").Preload("Groups").Where("group_id = ?", groupID).Find(&userGroups)
	return userGroups
}

func (db *userGroupConnection) FindByUserID(userID uint64) []entity.UserGroup {
	var userGroups []entity.UserGroup
	db.connection.Preload("Users").Preload("Groups").Where("user_id = ?", userID).Find(&userGroups)
	return userGroups
}
