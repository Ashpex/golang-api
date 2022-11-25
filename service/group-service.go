package service

import (
	"github.com/mashingan/smapping"
	"golang-api/dto"
	"golang-api/entity"
	"golang-api/repository"
)

type GroupService interface {
	CreateGroup(g dto.GroupCreateDTO) entity.Group
	UpdateGroup(g dto.GroupUpdateDTO) entity.Group
	Delete(g entity.Group)
	ALl() []entity.Group
	FindByID(groupID uint64) entity.Group
	IsAllowedToEdit(userID uint64, groupID uint64) bool
}

type groupService struct {
	groupRepository repository.GroupRepository
}

func NewGroupService(groupRepo repository.GroupRepository) GroupService {
	return &groupService{
		groupRepository: groupRepo,
	}
}

func (service *groupService) CreateGroup(g dto.GroupCreateDTO) entity.Group {
	group := entity.Group{}
	err := smapping.FillStruct(&group, smapping.MapFields(&g))
	if err != nil {
		panic("Failed map")
	}
	res := service.groupRepository.CreateGroup(group)
	return res
}

func (service *groupService) UpdateGroup(g dto.GroupUpdateDTO) entity.Group {
	group := entity.Group{}
	err := smapping.FillStruct(&group, smapping.MapFields(&g))
	if err != nil {
		panic("Failed map")
	}
	res := service.groupRepository.UpdateGroup(group)
	return res
}

func (service *groupService) Delete(g entity.Group) {
	service.groupRepository.DeleteGroup(g)
}

func (service *groupService) ALl() []entity.Group {
	return service.groupRepository.AllGroup()
}

func (service *groupService) FindByID(groupID uint64) entity.Group {
	return service.groupRepository.FindGroupByID(groupID)
}

func (service *groupService) IsAllowedToEdit(userID uint64, groupID uint64) bool {
	// to be implemented
	panic("Not implemented")
}
