package service

import (
	"golang-api/entity"
	"golang-api/repository"
)

type UserGroupService interface {
	CreateGroup(userID uint64, groupID uint64) entity.UserGroup
	JoinGroup(userID uint64, groupID uint64) entity.UserGroup
	LeaveGroup(userID uint64, groupID uint64)
	FindUserGroupByID(userID uint64, groupID uint64) entity.UserGroup
}

func NewUserGroupService(userGroupRepo repository.UserGroupRepository) UserGroupService {
	return &userGroupService{
		userGroupRepository: userGroupRepo,
	}
}

type userGroupService struct {
	userGroupRepository repository.UserGroupRepository
}

func (service *userGroupService) CreateGroup(userID uint64, groupID uint64) entity.UserGroup {
	userGroup := entity.UserGroup{
		UserID:  userID,
		GroupID: groupID,
		Role:    "admin",
	}
	return service.userGroupRepository.CreateUserGroup(userGroup)
}

func (service *userGroupService) JoinGroup(userID uint64, groupID uint64) entity.UserGroup {
	userGroup := entity.UserGroup{
		UserID:  userID,
		GroupID: groupID,
		Role:    "member",
	}
	return service.userGroupRepository.CreateUserGroup(userGroup)
}

func (service *userGroupService) LeaveGroup(userID uint64, groupID uint64) {
	userGroup := service.userGroupRepository.FindUserGroupByID(userID, groupID)
	service.userGroupRepository.DeleteUserGroup(userGroup)
}

func (service *userGroupService) FindUserGroupByID(userID uint64, groupID uint64) entity.UserGroup {
	return service.userGroupRepository.FindUserGroupByID(userID, groupID)
}