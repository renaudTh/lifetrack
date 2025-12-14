#! /bin/bash

set -ue

readonly RootPath="/workspaces/lifetrack"

cd "${RootPath}"

# Define session
readonly SessionName="lifetrack-dev"
tmux kill-session -t "${SessionName}" &> /dev/null || :
tmux new-session -d -s "${SessionName}" -c "${RootPath}"
tmux set-option -t "${SessionName}" mouse on
# Declare all windows
tmux new-window -n 'backend' -c "${RootPath}/backend"
tmux new-window -n 'frontend' -c "${RootPath}/frontend"
tmux kill-window -t "${SessionName}:0"
# Default window selected
tmux select-window -t "${SessionName}:backend"
# Wait for prompts to appear properly
sleep 1
# Start backend
tmux send-keys -t "${SessionName}:backend" "npm run start:dev" ENTER
# Start frontend
tmux send-keys -t "${SessionName}:frontend" "npm run start:dev" ENTER

# Attach to the session
tmux a -t "${SessionName}"
