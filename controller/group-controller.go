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
}

type groupController struct {
	groupService     service.GroupService
	jwtService       service.JWTService
	userGroupService service.UserGroupService
	userService      service.UserService
}

func NewGroupController(groupService service.GroupService, jwtService service.JWTService, userGroupService service.UserGroupService) GroupController {
	return &groupController{
		groupService:     groupService,
		jwtService:       jwtService,
		userGroupService: userGroupService,
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
	res := helper.BuildResponse(true, "OK", users)
	ctx.JSON(http.StatusOK, res)
}
