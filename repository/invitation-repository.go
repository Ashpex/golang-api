package repository

import (
	"golang-api/entity"
	"gorm.io/gorm"
)

type InvitationRepository interface {
	CreateInvitation(i entity.Invitation) entity.Invitation
	UpdateInvitation(i entity.Invitation) entity.Invitation
	DeleteInvitation(i entity.Invitation)
	AllInvitation() []entity.Invitation
	FindInvitationByID(invitationID uint64) entity.Invitation
	FindInvitationByCode(invitationCode string) entity.Invitation
}

type invitationConnection struct {
	connection *gorm.DB
}

func NewInvitationRepository(dbConnection *gorm.DB) InvitationRepository {
	return &invitationConnection{
		connection: dbConnection,
	}
}

func (db *invitationConnection) CreateInvitation(i entity.Invitation) entity.Invitation {
	db.connection.Save(&i)
	db.connection.Find(&i)
	return i
}

func (db *invitationConnection) UpdateInvitation(i entity.Invitation) entity.Invitation {
	db.connection.Save(&i)
	db.connection.Find(&i)
	return i
}

func (db invitationConnection) DeleteInvitation(i entity.Invitation) {
	db.connection.Delete(&i)
}

func (db invitationConnection) AllInvitation() []entity.Invitation {
	var invitations []entity.Invitation
	db.connection.Find(&invitations)
	return invitations
}

func (db invitationConnection) FindInvitationByID(invitationID uint64) entity.Invitation {
	var invitation entity.Invitation
	db.connection.Preload("Group").Preload("User").Find(&invitation, invitationID)
	return invitation
}

func (db invitationConnection) FindInvitationByCode(invitationCode string) entity.Invitation {
	var invitation entity.Invitation
	db.connection.Preload("Group").Preload("User").Where("invitation_code = ?", invitationCode).Find(&invitation)
	return invitation
}
