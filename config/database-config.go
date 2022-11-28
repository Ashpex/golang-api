package config

import (
	"fmt"
	"github.com/joho/godotenv"
	"golang-api/entity"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

func SetupDatabaseConnection() *gorm.DB {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	env := LoadEnv()
	dsn := fmt.Sprintf("host=%s user=%s password=%s port=%s dbname=%s TimeZone=Asia/Shanghai", env.DB_HOST, env.DB_USER, env.DB_PASS, env.DB_PORT, env.DB_NAME)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		panic("Failed to create a connection to database")
	}

	//err = db.SetupJoinTable(&entity.User{}, "UserGroups", &entity.UserGroup{})
	//if err != nil {
	//	log.Println(err)
	//	panic("Failed to setup join table")
	//}
	db.AutoMigrate(&entity.UserGroup{}, &entity.User{}, &entity.Group{}, &entity.Invitation{}, &entity.Log{})

	println("Database connected!")
	return db
}

func CloseDatabaseConnection(db *gorm.DB) {
	dbSQL, err := db.DB()
	if err != nil {
		panic("Failed to close connection from database")
	}
	dbSQL.Close()
}
