package health

import (
	"context"
)

type Ping struct {
	Msg string `json:"msg"`
}

type Service interface {
	Ping(c context.Context, req *Ping) (*Ping, error)
}
