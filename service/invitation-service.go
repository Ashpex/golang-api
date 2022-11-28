package service

import (
	"github.com/thanhpk/randstr"
	"golang-api/dto"
	"golang-api/entity"
	"golang-api/repository"
	"time"
)

type InvitationService interface {
	GenerateInvitation(groupID uint64) entity.Invitation
	CreateInvitation(i dto.InvitationCreateDTO) entity.Invitation
	DeleteInvitation(i entity.Invitation) entity.Invitation
	FindByInvitationCode(invitationCode string) entity.Invitation
}

func NewInvitationService(invitationRepo repository.InvitationRepository) InvitationService {
	return &invitationService{
		invitationRepository: invitationRepo,
	}
}

type invitationService struct {
	invitationRepository repository.InvitationRepository
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
