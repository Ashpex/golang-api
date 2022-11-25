package repository

import (
	"golang-api/entity"
	"gorm.io/gorm"
)

type GroupRepository interface {
	CreateGroup(g entity.Group) entity.Group
	UpdateGroup(g entity.Group) entity.Group
	DeleteGroup(g entity.Group)
	AllGroup() []entity.Group
	FindGroupByID(groupID uint64) entity.Group
}

type groupConnection struct {
	connection *gorm.DB
}

func NewGroupRepository(dbConnection *gorm.DB) GroupRepository {
	return &groupConnection{
		connection: dbConnection,
	}
}
func (db *groupConnection) CreateGroup(g entity.Group) entity.Group {
	db.connection.Save(&g)
	db.connection.Preload("Users").Find(&g)
	return g
}

func (db *groupConnection) UpdateGroup(g entity.Group) entity.Group {
	db.connection.Save(&g)
	db.connection.Preload("Users").Find(&g)
	return g
}

func (db *groupConnection) DeleteGroup(g entity.Group) {
	db.connection.Delete(&g)
}

func (db *groupConnection) AllGroup() []entity.Group {
	var groups []entity.Group
	db.connection.Preload("Users").Find(&groups)
	return groups
}

func (db *groupConnection) FindGroupByID(groupID uint64) entity.Group {
	var group entity.Group
	db.connection.Preload("Users").Find(&group, groupID)
	return group
}
