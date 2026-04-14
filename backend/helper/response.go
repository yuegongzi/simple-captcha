package helper

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Response 统一响应结构
type Response struct {
	ErrCode int         `json:"errcode"`
	ErrMsg  string      `json:"errmsg"`
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
}

// SuccessResponse 成功响应
func SuccessResponse(c *gin.Context, data interface{}) {
	c.JSON(http.StatusOK, Response{
		ErrCode: ErrCodeSuccess,
		ErrMsg:  "成功",
		Success: true,
		Data:    data,
	})
}

// ErrorResponse 错误响应
func ErrorResponse(c *gin.Context, err *CaptchaError) {
	statusCode := HTTPStatusFromError(err)
	c.JSON(statusCode, Response{
		ErrCode: err.Code,
		ErrMsg:  err.Message,
		Success: false,
	})
}

// ErrorResponseWithDetail 带详细信息的错误响应
func ErrorResponseWithDetail(c *gin.Context, err *CaptchaError, detail string) {
	statusCode := HTTPStatusFromError(err)
	c.JSON(statusCode, Response{
		ErrCode: err.Code,
		ErrMsg:  err.Message + ": " + detail,
		Success: false,
	})
}

// SimpleErrorResponse 简单错误响应（兼容旧代码）
func SimpleErrorResponse(c *gin.Context, code int, message string) {
	var statusCode int
	switch code {
	case 400:
		statusCode = http.StatusBadRequest
	case 429:
		statusCode = http.StatusTooManyRequests
	case 500:
		statusCode = http.StatusInternalServerError
	default:
		statusCode = http.StatusOK
	}

	c.JSON(statusCode, Response{
		ErrCode: code,
		ErrMsg:  message,
		Success: false,
	})
}
