package controller

import (
	"github.com/gin-gonic/gin"
	"golang-api/entity"
	"golang-api/helper"
	"golang-api/service"
	"log"
	"net/http"
	"strconv"
)

type UserGroupController interface {
	ListAllUserInGroup(ctx *gin.Context)
}
type userGroupController struct {
	groupService     service.GroupService
	jwtService       service.JWTService
	userGroupService service.UserGroupService
	userService      service.UserService
}

func NewUserGroupController(groupService service.GroupService, jwtService service.JWTService, userGroupService service.UserGroupService, userService service.UserService) UserGroupController {
	return &userGroupController{
		groupService:     groupService,
		userService:      userService,
		jwtService:       jwtService,
		userGroupService: userGroupService,
	}
}

func (g *userGroupController) ListAllUserInGroup(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 0, 0)
	if err != nil {
		res := helper.BuildErrorResponse("No param id was found", err.Error(), helper.EmptyObj{})
		ctx.AbortWithStatusJSON(http.StatusBadRequest, res)
		return
	}
	var userGroups []entity.UserGroup = g.userGroupService.FindByGroupID(id)
	log.Println(userGroups)
	var users []entity.User
	for _, item := range userGroups {
		log.Println(g.userService.FindByID(int64(item.User.ID)))
		user := g.userService.FindByID(int64(item.User.ID))
		users = append(users, user)
	}
	res := helper.BuildResponse(true, "OK", userGroups)
	ctx.JSON(http.StatusOK, res)

}
