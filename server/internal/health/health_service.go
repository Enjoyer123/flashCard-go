package health

import (
	"context"
)

type service struct{}

func NewService() Service {
	return &service{}
}

func (s *service) Ping(ctx context.Context, req *Ping) (*Ping, error) {
	return &Ping{Msg: "pong"}, nil
}
