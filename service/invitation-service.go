package service

import (
	"github.com/thanhpk/randstr"
	"golang-api/config"
	"golang-api/dto"
	"golang-api/entity"
	"golang-api/helper"
	"golang-api/repository"
	"time"
)

type InvitationService interface {
	GenerateInvitation(groupID uint64) entity.Invitation
	CreateInvitation(i dto.InvitationCreateDTO) entity.Invitation
	DeleteInvitation(i entity.Invitation) entity.Invitation
	FindByInvitationCode(invitationCode string) entity.Invitation
	CreateEmailInvitation(i entity.Invitation) entity.Invitation
}

func NewInvitationService(invitationRepo repository.InvitationRepository) InvitationService {
	return &invitationService{
		invitationRepository: invitationRepo,
	}
}

type invitationService struct {
	invitationRepository repository.InvitationRepository
}

func (service *invitationService) CreateEmailInvitation(invitation entity.Invitation) entity.Invitation {
	invitationCode := randstr.String(20)
	invitationToCreate := entity.Invitation{
		GroupID:        invitation.GroupID,
		Email:          invitation.Email,
		InvitationCode: invitationCode,
	}
	env := config.LoadEnv()
	emailData := helper.EmailData{
		URL:     env.CLIENT_URL + "/api/group/join/" + invitationCode,
		Subject: "You have been invited to join a group",
		Code:    invitationCode,
	}
	helper.SendInvitationEmail(&invitationToCreate, &emailData)
	return service.invitationRepository.CreateInvitation(invitationToCreate)
}

func (service *invitationService) GenerateInvitation(groupID uint64) entity.Invitation {
	invitationToCreate := entity.Invitation{
		GroupID:        groupID,
		InvitationCode: randstr.String(20),
		CreatedAt:      time.Now().Format("2006-01-02 15:04:05"),
	}
	return service.invitationRepository.CreateInvitation(invitationToCreate)
}

func (service *invitationService) CreateInvitation(i dto.InvitationCreateDTO) entity.Invitation {
	invitationToCreate := entity.Invitation{
		GroupID:        i.GroupID,
		Email:          i.Email,
		InvitationCode: randstr.String(20),
	}
	return service.invitationRepository.CreateInvitation(invitationToCreate)
}

func (service *invitationService) FindByInvitationCode(invitationCode string) entity.Invitation {
	return service.invitationRepository.FindInvitationByCode(invitationCode)
}

func (service *invitationService) DeleteInvitation(i entity.Invitation) entity.Invitation {
	service.invitationRepository.DeleteInvitation(i)
	return i
}
