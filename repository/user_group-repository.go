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
	db.connection.Preload("Users").Find(&g)
	db.connection.Preload("Groups").Find(&g)
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
	db.connection.Preload("Users").Find(&userGroup, userID, groupID)
	return userGroup
}
