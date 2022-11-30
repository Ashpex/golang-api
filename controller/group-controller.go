package controller

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"golang-api/dto"
	"golang-api/entity"
	"golang-api/helper"
	"golang-api/service"
	"log"
	"net/http"
	"strconv"
)

type GroupController interface {
	AllGroup(ctx *gin.Context)
	FindGroupByID(ctx *gin.Context)
	UpdateGroup(ctx *gin.Context)
	DeleteGroup(ctx *gin.Context)
	CreateGroup(ctx *gin.Context)
	ListAllUsersInGroup(ctx *gin.Context)
	ListGroupsCreatedByUser(ctx *gin.Context)
	ListGroupsJoinedByUser(ctx *gin.Context)
	AssignRole(ctx *gin.Context)
	GenerateInvitation(ctx *gin.Context)
	JoinGroupByInvitation(ctx *gin.Context)
	JoinGroupByEmail(ctx *gin.Context)
	CreateEmailInvitation(ctx *gin.Context)
}

type groupController struct {
	groupService      service.GroupService
	jwtService        service.JWTService
	userGroupService  service.UserGroupService
	userService       service.UserService
	invitationService service.InvitationService
}

func NewGroupController(groupService service.GroupService, jwtService service.JWTService, userGroupService service.UserGroupService, userService service.UserService, invitationService service.InvitationService) GroupController {
	return &groupController{
		groupService:      groupService,
		jwtService:        jwtService,
		userGroupService:  userGroupService,
		userService:       userService,
		invitationService: invitationService,
	}
}
func (g *groupController) AllGroup(ctx *gin.Context) {
	var groups []entity.Group = g.groupService.ALl()
	res := helper.BuildResponse(true, "OK", groups)
	ctx.JSON(http.StatusOK, res)
}

func (g *groupController) FindGroupByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 0, 0)
	if err != nil {
		res := helper.BuildErrorResponse("No param id was found", err.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	var group entity.Group = g.groupService.FindByID(id)
	if (group == entity.Group{}) {
		res := helper.BuildErrorResponse("No group found with given id", "No data found", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	} else {
		res := helper.BuildResponse(true, "OK", group)
		ctx.JSON(http.StatusOK, res)
	}

}

func (g *groupController) UpdateGroup(ctx *gin.Context) {
	var groupUdateDTO dto.GroupUpdateDTO
	var userGroup entity.UserGroup
	errDTO := ctx.ShouldBind(&groupUdateDTO)
	if errDTO != nil {
		res := helper.BuildErrorResponse("Failed to process request", errDTO.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}

	authHeader := ctx.GetHeader("Authorization")
	token, errToken := g.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	userID := fmt.Sprintf("%v", claims["user_id"])
	userIDInt, err := strconv.ParseUint(userID, 0, 0)
	if err != nil {
		log.Print(err)
	}

	userGroup = g.userGroupService.FindUserGroupByID(userIDInt, groupUdateDTO.ID)
	if (userGroup == entity.UserGroup{}) {
		res := helper.BuildErrorResponse("Failed to process request", "You are not in this group", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	if userGroup.Role != "admin" {
		res := helper.BuildErrorResponse("Failed to process request", "You are not admin in this group", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}

	group := g.groupService.UpdateGroup(groupUdateDTO)
	res := helper.BuildResponse(true, "OK", group)
	ctx.JSON(http.StatusOK, res)

}

func (g *groupController) DeleteGroup(ctx *gin.Context) {
	var userGroup entity.UserGroup
	var group entity.Group
	id, err := strconv.ParseUint(ctx.Param("id"), 0, 0)
	if err != nil {
		res := helper.BuildErrorResponse("No param id was found", err.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	group.ID = id
	authHeader := ctx.GetHeader("Authorization")
	token, errToken := g.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	userID := fmt.Sprintf("%v", claims["user_id"])
	userIDInt, err := strconv.ParseUint(userID, 0, 0)
	if err != nil {
		log.Print(err)
	}
	userGroup = g.userGroupService.FindUserGroupByID(userIDInt, group.ID)
	if (userGroup == entity.UserGroup{}) {
		res := helper.BuildErrorResponse("Failed to process request", "You are not in this group", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	if userGroup.Role != "admin" {
		res := helper.BuildErrorResponse("Failed to process request", "You are not admin in this group", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	g.groupService.Delete(group)
	res := helper.BuildResponse(true, "OK", helper.EmptyObj{})
	ctx.JSON(http.StatusOK, res)
}

func (g *groupController) CreateGroup(ctx *gin.Context) {
	var groupCreateDTO dto.GroupCreateDTO
	errDTO := ctx.ShouldBind(&groupCreateDTO)
	if errDTO != nil {
		res := helper.BuildErrorResponse("Failed to process request", errDTO.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	authHeader := ctx.GetHeader("Authorization")
	token, errToken := g.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	userID := fmt.Sprintf("%v", claims["user_id"])
	userIDInt, err := strconv.ParseUint(userID, 0, 0)
	if err != nil {
		log.Print(err)
	}
	group := g.groupService.CreateGroup(groupCreateDTO)
	g.userGroupService.CreateGroup(userIDInt, group.ID)
	res := helper.BuildResponse(true, "OK", group)
	ctx.JSON(http.StatusOK, res)
}

func (g *groupController) ListAllUsersInGroup(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 0, 0)
	if err != nil {
		res := helper.BuildErrorResponse("No param id was found", err.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	var userGroups []entity.UserGroup = g.userGroupService.FindByGroupID(id)
	var users []entity.User
	for _, item := range userGroups {
		user := g.userService.FindByID(int64(item.UserID))
		users = append(users, user)
	}
	var userDTOs []dto.UserInfoDTO
	for i := 0; i < len(users); i++ {
		userDTO := dto.UserInfoDTO{
			ID:   users[i].ID,
			Name: users[i].Name,
			Role: userGroups[i].Role,
		}
		userDTOs = append(userDTOs, userDTO)
	}
	res := helper.BuildResponse(true, "OK", userDTOs)
	ctx.JSON(http.StatusOK, res)
}

func (g *groupController) ListGroupsJoinedByUser(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 0, 0)
	if err != nil {
		res := helper.BuildErrorResponse("No param id was found", err.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	var userGroups []entity.UserGroup = g.userGroupService.FindByUserID(id)
	var groups []entity.Group
	for _, item := range userGroups {
		group := g.groupService.FindByID(item.GroupID)
		groups = append(groups, group)
	}
	res := helper.BuildResponse(true, "OK", groups)
	ctx.JSON(http.StatusOK, res)
}

func (g *groupController) ListGroupsCreatedByUser(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 0, 0)
	if err != nil {
		res := helper.BuildErrorResponse("No param id was found", err.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	var userGroups []entity.UserGroup = g.userGroupService.FindByGroupID(id)
	var groups []entity.Group
	for _, item := range userGroups {
		if item.Role == "admin" {
			group := g.groupService.FindByID(item.GroupID)
			groups = append(groups, group)
		}
	}
	res := helper.BuildResponse(true, "OK", groups)
	ctx.JSON(http.StatusOK, res)
}

func (g *groupController) AssignRole(ctx *gin.Context) {
	var assignRoleDTO dto.AssignRoleDTO
	errDTO := ctx.ShouldBind(&assignRoleDTO)
	if errDTO != nil {
		res := helper.BuildErrorResponse("Failed to process request", errDTO.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	authHeader := ctx.GetHeader("Authorization")
	token, errToken := g.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	userID := fmt.Sprintf("%v", claims["user_id"])
	userIDInt, err := strconv.ParseUint(userID, 0, 0)
	if err != nil {
		log.Print(err)
	}
	admin := g.userGroupService.FindUserGroupByID(userIDInt, assignRoleDTO.GroupID)
	userGroup := g.userGroupService.FindUserGroupByID(assignRoleDTO.UserID, assignRoleDTO.GroupID)
	if (admin == entity.UserGroup{} || admin.Role != "admin") {
		res := helper.BuildErrorResponse("Failed to process request", "You are not admin in this group", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	if (userGroup == entity.UserGroup{}) {
		res := helper.BuildErrorResponse("Failed to process request", "User is not in this group", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	userGroup = g.userGroupService.AssignRole(assignRoleDTO.UserID, assignRoleDTO.GroupID, assignRoleDTO.Role)
	res := helper.BuildResponse(true, "OK", helper.EmptyObj{})
	ctx.JSON(http.StatusOK, res)
}

func (g *groupController) GenerateInvitation(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 0, 0)
	if err != nil {
		res := helper.BuildErrorResponse("No param id was found", err.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	authHeader := ctx.GetHeader("Authorization")
	token, errToken := g.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	userID := fmt.Sprintf("%v", claims["user_id"])
	userIDInt, err := strconv.ParseUint(userID, 0, 0)
	if err != nil {
		log.Print(err)
	}
	admin := g.userGroupService.FindUserGroupByID(userIDInt, id)
	if (admin == entity.UserGroup{} || admin.Role != "admin") {
		res := helper.BuildErrorResponse("Failed to process request", "You are not admin in this group", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	invitation := g.invitationService.GenerateInvitation(id)
	res := helper.BuildResponse(true, "OK", invitation.InvitationCode)
	ctx.JSON(http.StatusOK, res)
}

func (g *groupController) JoinGroupByInvitation(ctx *gin.Context) {
	invitationCode := ctx.Params.ByName("invitation_code")
	authHeader := ctx.GetHeader("Authorization")
	token, errToken := g.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	userID := fmt.Sprintf("%v", claims["user_id"])
	userIDInt, err := strconv.ParseUint(userID, 0, 0)
	if err != nil {
		log.Print(err)
	}
	invitation := g.invitationService.FindByInvitationCode(invitationCode)
	if (invitation == entity.Invitation{}) {
		res := helper.BuildErrorResponse("Failed to process request", "Invitation code is invalid", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	userGroup := g.userGroupService.FindUserGroupByID(userIDInt, invitation.GroupID)
	if (userGroup != entity.UserGroup{}) {
		res := helper.BuildErrorResponse("Failed to process request", "You are already in this group", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	userGroup = g.userGroupService.JoinGroup(userIDInt, invitation.GroupID)
	groupInfo := g.groupService.FindByID(invitation.GroupID)
	g.invitationService.DeleteInvitation(invitation)
	res := helper.BuildResponse(true, "Joined group", groupInfo)
	ctx.JSON(http.StatusOK, res)
}

func (g *groupController) CreateEmailInvitation(ctx *gin.Context) {
	var emailInvitationDTO dto.InvitationCreateDTO
	errDTO := ctx.ShouldBind(&emailInvitationDTO)
	if errDTO != nil {
		res := helper.BuildErrorResponse("Failed to process request", errDTO.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	authHeader := ctx.GetHeader("Authorization")
	token, errToken := g.jwtService.ValidateToken(authHeader)
	if errToken != nil {
		panic(errToken.Error())
	}
	claims := token.Claims.(jwt.MapClaims)
	userID := fmt.Sprintf("%v", claims["user_id"])
	userIDInt, err := strconv.ParseUint(userID, 0, 0)
	if err != nil {
		log.Print(err)
	}
	admin := g.userGroupService.FindUserGroupByID(userIDInt, emailInvitationDTO.GroupID)
	if (admin == entity.UserGroup{} || admin.Role != "admin") {
		res := helper.BuildErrorResponse("Failed to process request", "You are not admin in this group", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}

	userToSend := g.userService.FindByEmail(emailInvitationDTO.Email)
	groupToInvite := g.groupService.FindByID(emailInvitationDTO.GroupID)
	invitation := entity.Invitation{
		UserID:  userToSend.ID,
		GroupID: emailInvitationDTO.GroupID,
		Email:   emailInvitationDTO.Email,
	}
	invitationEmail := g.invitationService.CreateEmailInvitation(invitation)
	res := helper.BuildResponse(true, "OK", &entity.Invitation{
		Email:          invitationEmail.Email,
		InvitationCode: invitationEmail.InvitationCode,
		User:           userToSend,
		Group:          groupToInvite,
	})
	ctx.JSON(http.StatusOK, res)
}

func (g *groupController) JoinGroupByEmail(ctx *gin.Context) {
	invitationCode := ctx.Params.ByName("invitation_code")
	invitationInfo := g.invitationService.FindByInvitationCode(invitationCode)
	if (invitationInfo == entity.Invitation{}) {
		res := helper.BuildErrorResponse("Failed to process request", "Invitation code is invalid", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	userGroup := g.userGroupService.FindUserGroupByID(invitationInfo.UserID, invitationInfo.GroupID)
	if (userGroup != entity.UserGroup{}) {
		res := helper.BuildErrorResponse("Failed to process request", "You are already in this group", helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusForbidden, res)
		return
	}
	userGroup = g.userGroupService.JoinGroup(invitationInfo.UserID, invitationInfo.GroupID)
	groupInfo := g.groupService.FindByID(invitationInfo.GroupID)
	g.invitationService.DeleteInvitation(invitationInfo)
	res := helper.BuildResponse(true, "Joined group", groupInfo)
	ctx.JSON(http.StatusOK, res)
}
