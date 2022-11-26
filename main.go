package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"golang-api/config"
	"golang-api/controller"
	"golang-api/middleware"
	"golang-api/repository"
	"golang-api/service"
	"gorm.io/gorm"
	"os"
	"time"
)

var (
	db                  *gorm.DB                       = config.SetupDatabaseConnection()
	userRepository      repository.UserRepository      = repository.NewUserRepository(db)
	groupRepository     repository.GroupRepository     = repository.NewGroupRepository(db)
	userGroupRepository repository.UserGroupRepository = repository.NewUserGroupRepository(db)
	jwtService          service.JWTService             = service.NewJWTService()
	userService         service.UserService            = service.NewUserService(userRepository)
	authService         service.AuthService            = service.NewAuthService(userRepository)
	groupService        service.GroupService           = service.NewGroupService(groupRepository)
	userGroupService    service.UserGroupService       = service.NewUserGroupService(userGroupRepository)
	authController      controller.AuthController      = controller.NewAuthController(authService, jwtService)
	userController      controller.UserController      = controller.NewUserController(userService, jwtService)
	groupController     controller.GroupController     = controller.NewGroupController(groupService, jwtService, userGroupService, userService)
	//userGroupController controller.UserGroupController = controller.NewUserGroupController()
)

func main() {
	defer config.CloseDatabaseConnection(db)
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Content-Type", "Authorization"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "*"
		},
		MaxAge: 12 * time.Hour,
	}))
	port := os.Getenv("PORT")
	authRoutes := r.Group("api/auth")
	{
		authRoutes.POST("/login", authController.Login)
		authRoutes.POST("/register", authController.Register)
		authRoutes.GET("/verify/:verification_code", authController.VerifyEmail)
	}

	userRoutes := r.Group("api/user", middleware.AuthorizeJWT(jwtService))
	{
		userRoutes.GET("/profile", userController.Profile)
		userRoutes.PUT("/profile", userController.Update)
		userRoutes.GET("/:id", userController.FindByID)
	}
	groupRoutes := r.Group("api/group", middleware.AuthorizeJWT(jwtService))
	{
		groupRoutes.GET("/", groupController.AllGroup)
		groupRoutes.GET("/:id", groupController.FindGroupByID)
		groupRoutes.POST("/", groupController.CreateGroup)
		groupRoutes.PUT("/:id", groupController.UpdateGroup)
		groupRoutes.DELETE("/:id", groupController.DeleteGroup)
		groupRoutes.GET("/:id/users", groupController.ListAllUsersInGroup)
		groupRoutes.GET("/:id/created/", groupController.ListGroupsCreatedByUser)
	}
	r.Run(":" + port)
}
